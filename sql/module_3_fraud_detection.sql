CREATE OR REPLACE VIEW View_PotentialFraudTransactions AS
WITH TransactionThresholds AS (
    SELECT
        t.TransactionID,
        t.TransactionDate,
        t.TotalAmount,
        a.AccountType,
        c.CustomerName,
        CASE
            WHEN a.AccountType IN ('Checking', 'Savings', 'Loan') THEN 0.01
            ELSE 0.01
        END AS MinThreshold,
        CASE
            WHEN a.AccountType = 'Checking' THEN 10000
            WHEN a.AccountType = 'Savings' THEN 50000
            WHEN a.AccountType = 'Loan' THEN 100000
            ELSE NULL
        END AS MaxThreshold
    FROM Transactions t
    JOIN Accounts a ON t.AccountID = a.AccountID
    JOIN Customers c ON t.CustomerID = c.CustomerID
)
SELECT
    TransactionID,
    TransactionDate,
    TotalAmount,
    AccountType,
    CustomerName,
    MinThreshold,
    MaxThreshold,
    CASE
        WHEN MaxThreshold IS NOT NULL AND TotalAmount > MaxThreshold THEN
            CASE
                WHEN AccountType = 'Checking' THEN 'Exceeds Checking Limit ($10k)'
                WHEN AccountType = 'Savings' THEN 'Exceeds Savings Limit ($50k)'
                WHEN AccountType = 'Loan' THEN 'Exceeds Loan Limit ($100k)'
                ELSE 'Exceeds Maximum Threshold'
            END
        WHEN TotalAmount < MinThreshold THEN
            CASE
                WHEN AccountType = 'Checking' THEN 'Below Checking Minimum ($0.01)'
                WHEN AccountType = 'Savings' THEN 'Below Savings Minimum ($0.01)'
                WHEN AccountType = 'Loan' THEN 'Below Loan Minimum ($0.01)'
                ELSE 'Below Minimum Threshold'
            END
        ELSE 'Valid'
    END AS StatusCheck
FROM TransactionThresholds
WHERE
    (MaxThreshold IS NOT NULL AND TotalAmount > MaxThreshold)
    OR (TotalAmount < MinThreshold);