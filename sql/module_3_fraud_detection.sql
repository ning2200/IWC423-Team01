CREATE OR REPLACE VIEW View_PotentialFraudTransactions AS
SELECT 
    t.TransactionID,
    t.TransactionDate,
    t.TotalAmount,
    a.AccountType,
    c.CustomerName,
    CASE 
        WHEN a.AccountType = 'Checking' AND t.TotalAmount > 10000 THEN 'Exceeds Checking Limit ($10k)'
        WHEN a.AccountType = 'Savings' AND t.TotalAmount > 50000 THEN 'Exceeds Savings Limit ($50k)'
        WHEN a.AccountType = 'Loan' AND t.TotalAmount > 100000 THEN 'Exceeds Loan Limit ($100k)'
        ELSE 'Valid'
    END AS StatusCheck
FROM Transactions t
JOIN Accounts a ON t.AccountID = a.AccountID
JOIN Customers c ON t.CustomerID = c.CustomerID
WHERE 
    (a.AccountType = 'Checking' AND t.TotalAmount > 10000) OR
    (a.AccountType = 'Savings' AND t.TotalAmount > 50000) OR
    (a.AccountType = 'Loan' AND t.TotalAmount > 100000);