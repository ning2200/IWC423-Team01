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
SELECT
    c.CustomerID,
    c.CustomerName,
    SUM(t.TotalAmount) AS TotalTransactionValue
FROM Customers c
LEFT JOIN Transactions t
    ON c.CustomerID = t.CustomerID
GROUP BY
    c.CustomerID,
    c.CustomerName
ORDER BY
    TotalTransactionValue DESC
;

-- 4. Customers with more than one Account
SELECT
    c.CustomerID,
    c.CustomerName,
    COUNT(a.AccountID) AS AccountCount
FROM Customers c
JOIN Accounts a
    ON c.CustomerID = a.CustomerID
GROUP BY
    c.CustomerID,
    c.CustomerName
HAVING
    COUNT(a.AccountID) > 1
ORDER BY
    AccountCount DESC
;

-- 5. Average fee per BankProduct
SELECT
    p.ProductID,
    p.ProductName,
    AVG(tl.FeeAmount) AS AverageFee
FROM BankProducts p
JOIN TransactionLines tl
    ON p.ProductID = tl.ProductID
GROUP BY
    p.ProductID,
    p.ProductName
ORDER BY
    AverageFee DESC
;