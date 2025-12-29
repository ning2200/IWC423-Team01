SELECT 
    c.CustomerName,
    c.Email,
    a.AccountNumber,
    a.AccountType,
    a.Balance,
    p.ProductName AS RecommendedProduct,
    p.InterestRate AS ProposedRate
FROM Accounts a
JOIN Customers c ON a.CustomerID = c.CustomerID
CROSS JOIN BankProducts p -- Cartesian join to suggest all relevant products
WHERE 
    a.Balance > 100000.00 -- The "High Balance" threshold
    AND p.ProductType = 'Investment' -- Only suggesting relevant investment products
    AND p.ActiveFlag = TRUE
ORDER BY a.Balance DESC;