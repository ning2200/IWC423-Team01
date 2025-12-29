-- 1. Create function to check transaction limits by account type
CREATE OR REPLACE FUNCTION check_transaction_limit()
RETURNS TRIGGER AS $$
DECLARE
    max_limit DECIMAL(15,2);
BEGIN
    -- Determine max limit based on account type
    SELECT CASE 
        WHEN a.AccountType = 'Checking' THEN 10000.00
        WHEN a.AccountType = 'Savings' THEN 50000.00  
        WHEN a.AccountType = 'Loan' THEN 100000.00
        ELSE 1000.00  -- Default conservative limit
    END INTO max_limit
    FROM Accounts a
    WHERE a.AccountID = NEW.AccountID;
    
    -- Enforce limit (raise exception on violation)
    IF NEW.TotalAmount > max_limit THEN
        RAISE EXCEPTION 'Transaction amount $% exceeds account limit of $% for AccountID % (Type: %)', 
            NEW.TotalAmount, max_limit, NEW.AccountID, 
            (SELECT AccountType FROM Accounts WHERE AccountID = NEW.AccountID);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create trigger
CREATE TRIGGER fraud_detection_limit
    BEFORE INSERT OR UPDATE OF TotalAmount ON Transactions
    FOR EACH ROW
    EXECUTE FUNCTION check_transaction_limit();
