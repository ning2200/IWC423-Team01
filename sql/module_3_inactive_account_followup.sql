-- 1. Create follow-up tasks table
CREATE TABLE InactiveAccountFollowups (
    TaskID SERIAL PRIMARY KEY,
    AccountID INTEGER REFERENCES Accounts(AccountID),
    CustomerID INTEGER REFERENCES Customers(CustomerID),
    DaysInactive INTEGER,
    LastTransactionDate DATE,
    SuggestedProducts TEXT[],
    FollowupStatus VARCHAR(50) DEFAULT 'Pending',
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Function to detect and log inactive accounts
CREATE OR REPLACE FUNCTION detect_inactive_accounts()
RETURNS TABLE (
    account_id INTEGER,
    customer_id INTEGER,
    days_inactive INTEGER,
    last_tx_date DATE,
    inactivity_threshold INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.AccountID,
        a.CustomerID,
        EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(MAX(t.TransactionDate::DATE), a.OpenDate))) AS days_inactive,
        MAX(t.TransactionDate::DATE) AS last_tx_date,
        90 AS threshold  -- Configurable per policy
    FROM Accounts a
    LEFT JOIN Transactions t ON a.AccountID = t.AccountID 
        AND t.StatusID IN (SELECT StatusID FROM TransactionStatus WHERE IsFinal = TRUE)
    WHERE a.AccountStatus = 'Active'
      AND a.OpenDate <= CURRENT_DATE - INTERVAL '90 days'  -- Account age filter
      AND EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(MAX(t.TransactionDate::DATE), a.OpenDate))) >= 90
    GROUP BY a.AccountID, a.CustomerID, a.OpenDate
    HAVING COUNT(t.TransactionID) = 0 OR MAX(t.TransactionDate::DATE) < CURRENT_DATE - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- 3. Function to create follow-up tasks (run daily)
CREATE OR REPLACE FUNCTION create_inactive_followups()
RETURNS VOID AS $$
DECLARE
    rec RECORD;
    prod_names TEXT[];
BEGIN
    -- Get attractive products (high interest, low fees)
    SELECT ARRAY_AGG(ProductName) INTO prod_names
    FROM BankProducts 
    WHERE ActiveFlag = TRUE AND InterestRate > (SELECT AVG(InterestRate) FROM BankProducts);
    
    FOR rec IN SELECT * FROM detect_inactive_accounts() LOOP
        INSERT INTO InactiveAccountFollowups (AccountID, CustomerID, DaysInactive, LastTransactionDate, SuggestedProducts)
        VALUES (rec.account_id, rec.customer_id, rec.days_inactive, rec.last_tx_date, prod_names)
        ON CONFLICT DO NOTHING;
    END LOOP;
END;
$$ LANGUAGE plpgsql;