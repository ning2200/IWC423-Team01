-- 1. Show Customers with their Accounts 
SELECT 
    c.CustomerID,
    c.CustomerName,
    a.AccountID,
    a.AccountNumber,
    a.AccountType,
    a.Balance
FROM 
    Customers c
LEFT JOIN 
    Accounts a ON c.CustomerID = a.CustomerID
;

-- 2. Total number of Transactions per Account
SELECT 
    a.AccountID,
    a.AccountNumber,
    COUNT(t.TransactionID) AS TotalTransactions
FROM 
    Accounts a
LEFT JOIN 
    Transactions t ON a.AccountID = t.AccountID
GROUP BY 
    a.AccountID, a.AccountNumber
;

-- 3. Total Transaction value per Customer

-- 4. Customers with more than one Account

-- 5. Average fee per BankProduct