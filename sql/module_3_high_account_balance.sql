-- 1. Create audit table for recommendations
CREATE TABLE AccountRecommendations (
    RecID SERIAL PRIMARY KEY,
    AccountID INTEGER REFERENCES Accounts(AccountID),
    CustomerID INTEGER REFERENCES Customers(CustomerID),
    HighBalanceAmount DECIMAL(15,2),
    SuggestedProducts TEXT[],  -- Array of ProductID names
    RecommendationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    StaffNotified BOOLEAN DEFAULT FALSE
);

-- 2. Function to suggest products for high balance accounts
CREATE OR REPLACE FUNCTION recommend_high_balance_products()
RETURNS TRIGGER AS $$
DECLARE
    high_threshold DECIMAL(15,2) := 100000.00;
    suggested_prods TEXT[];
    prod_names TEXT[];
BEGIN
    -- Only trigger on balance increases to high threshold
    IF TG_OP = 'UPDATE' AND (NEW.Balance >= high_threshold AND OLD.Balance < high_threshold) THEN
        
        -- Suggest products: High-yield savings for balances >100k, Investment products
        SELECT ARRAY_AGG(bp.ProductName)
        INTO prod_names
        FROM BankProducts bp
        WHERE bp.ActiveFlag = TRUE 
          AND (bp.ProductType LIKE '%Investment%' OR bp.InterestRate > 0.03);
        
        INSERT INTO AccountRecommendations (AccountID, CustomerID, HighBalanceAmount, SuggestedProducts)
        VALUES (NEW.AccountID, NEW.CustomerID, NEW.Balance, prod_names);
        
        -- Optional: RAISE NOTICE for application layer notification
        RAISE NOTICE 'High balance detected on AccountID % ($%). Suggested: %', 
            NEW.AccountID, NEW.Balance, prod_names;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create trigger
CREATE TRIGGER high_balance_recommendation
    AFTER UPDATE OF Balance ON Accounts
    FOR EACH ROW
    EXECUTE FUNCTION recommend_high_balance_products();