SELECT 
    c.CustomerName,
    c.Phone,
    a.AccountNumber,
    a.OpenDate,
    MAX(t.TransactionDate) AS LastTransactionDate,
    CURRENT_DATE - MAX(t.TransactionDate)::DATE AS DaysInactive
FROM Accounts a
JOIN Customers c ON a.CustomerID = c.CustomerID
LEFT JOIN Transactions t ON a.AccountID = t.AccountID
GROUP BY c.CustomerName, c.Phone, a.AccountNumber, a.OpenDate
HAVING 
    MAX(t.TransactionDate) < CURRENT_DATE - INTERVAL '90 days'
    OR MAX(t.TransactionDate) IS NULL -- Catch accounts that NEVER had a transaction
ORDER BY DaysInactive DESC;