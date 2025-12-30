-- violate_population.sql
--
-- Purpose:
-- Insert deterministic “violation/trigger” fixtures that light up the Module 3 checks:
--   1) Fraud detection thresholds (View_PotentialFraudTransactions)
--   2) High account balance recommendations
--   3) Inactive account follow-up
--
-- Idempotency:
-- This script can be re-run safely. It deletes and recreates ONLY rows tagged with
-- Notes/AccountNumber prefixes used in this file.
--
-- Recommended usage:
--   1) Run schema (module_2.sql)
--   2) Run base seed data (base_population.sql)
--   3) Run this file (violate_population.sql)
--   4) Run Module 3 scripts to observe triggered results

BEGIN;

-- 0) Ensure reference data exists (safe no-op if already present)
INSERT INTO TransactionStatus (StatusName, StatusDescription, IsFinal) VALUES
('Pending', 'Transaction initiated but not cleared', FALSE),
('Posted', 'Transaction completed successfully', TRUE),
('Failed', 'Transaction failed due to error or funds', TRUE),
('Reversed', 'Transaction reversed by admin', TRUE)
ON CONFLICT (StatusName) DO NOTHING;

-- Ensure at least one Investment product exists for the high-balance recommendation query.
-- BankProducts has no unique constraint on ProductName, so we delete by name to stay idempotent.
DELETE FROM BankProducts WHERE ProductName IN ('VIOLATE Investment Max');
INSERT INTO BankProducts (ProductName, ProductType, InterestRate, FeeSchedule, ActiveFlag) VALUES
('VIOLATE Investment Max', 'Investment', 0.0999, 'Management: 2%', TRUE);

-- 1) Clean up previous “violate” rows (idempotent reruns)
DELETE FROM TransactionLines tl
USING Transactions t
WHERE tl.TransactionID = t.TransactionID
  AND t.Notes LIKE 'VIOLATE_%';

DELETE FROM Transactions
WHERE Notes LIKE 'VIOLATE_%';

-- Remove only accounts created by this script.
-- Any dependent transactions are already deleted above.
DELETE FROM Accounts
WHERE AccountNumber LIKE 'VIO-%';

-- 2) Customers (upsert by unique Email)
INSERT INTO Customers (CustomerName, Email, Phone, Address, KYCStatus, RiskRating)
VALUES
('Violator Checking Fraud', 'violate.fraud.checking@example.com', '555-9001', 'Violation St 1, Singapore', 'Verified', 0.90),
('Violator Savings Fraud',  'violate.fraud.savings@example.com',  '555-9002', 'Violation St 2, Singapore', 'Verified', 0.90),
('Violator Loan Fraud',     'violate.fraud.loan@example.com',     '555-9003', 'Violation St 3, Singapore', 'Verified', 0.90),
('Violator High Balance',   'violate.highbalance@example.com',    '555-9010', 'Rich St 10, Singapore',     'Verified', 0.10),
('Violator Inactive',       'violate.inactive@example.com',       '555-9020', 'Quiet St 20, Singapore',    'Verified', 0.10)
ON CONFLICT (Email) DO UPDATE SET
    CustomerName = EXCLUDED.CustomerName,
    Phone = EXCLUDED.Phone,
    Address = EXCLUDED.Address,
    KYCStatus = EXCLUDED.KYCStatus,
    RiskRating = EXCLUDED.RiskRating;

-- 3) Accounts (upsert by unique AccountNumber)
-- 3a) Fraud-triggering accounts
INSERT INTO Accounts (CustomerID, AccountNumber, AccountType, OpenDate, Balance, Currency)
VALUES (
    (SELECT CustomerID FROM Customers WHERE Email = 'violate.fraud.checking@example.com'),
    'VIO-CHK-9001',
    'Checking',
    CURRENT_DATE - INTERVAL '30 days',
    500.00,
    'USD'
)
ON CONFLICT (AccountNumber) DO UPDATE SET
    CustomerID = EXCLUDED.CustomerID,
    AccountType = EXCLUDED.AccountType,
    OpenDate = EXCLUDED.OpenDate,
    Balance = EXCLUDED.Balance,
    Currency = EXCLUDED.Currency;

INSERT INTO Accounts (CustomerID, AccountNumber, AccountType, OpenDate, Balance, Currency)
VALUES (
    (SELECT CustomerID FROM Customers WHERE Email = 'violate.fraud.savings@example.com'),
    'VIO-SAV-9002',
    'Savings',
    CURRENT_DATE - INTERVAL '45 days',
    1000.00,
    'USD'
)
ON CONFLICT (AccountNumber) DO UPDATE SET
    CustomerID = EXCLUDED.CustomerID,
    AccountType = EXCLUDED.AccountType,
    OpenDate = EXCLUDED.OpenDate,
    Balance = EXCLUDED.Balance,
    Currency = EXCLUDED.Currency;

INSERT INTO Accounts (CustomerID, AccountNumber, AccountType, OpenDate, Balance, Currency)
VALUES (
    (SELECT CustomerID FROM Customers WHERE Email = 'violate.fraud.loan@example.com'),
    'VIO-LN-9003',
    'Loan',
    CURRENT_DATE - INTERVAL '60 days',
    0.00,
    'USD'
)
ON CONFLICT (AccountNumber) DO UPDATE SET
    CustomerID = EXCLUDED.CustomerID,
    AccountType = EXCLUDED.AccountType,
    OpenDate = EXCLUDED.OpenDate,
    Balance = EXCLUDED.Balance,
    Currency = EXCLUDED.Currency;

-- 3b) High-balance account (triggers module_3_high_account_balance.sql)
INSERT INTO Accounts (CustomerID, AccountNumber, AccountType, OpenDate, Balance, Currency)
VALUES (
    (SELECT CustomerID FROM Customers WHERE Email = 'violate.highbalance@example.com'),
    'VIO-HIBAL-9010',
    'Savings',
    CURRENT_DATE - INTERVAL '180 days',
    250000.01,
    'USD'
)
ON CONFLICT (AccountNumber) DO UPDATE SET
    CustomerID = EXCLUDED.CustomerID,
    AccountType = EXCLUDED.AccountType,
    OpenDate = EXCLUDED.OpenDate,
    Balance = EXCLUDED.Balance,
    Currency = EXCLUDED.Currency;

-- 3c) Inactive account with NO transactions (triggers module_3_inactive_account_followup.sql)
INSERT INTO Accounts (CustomerID, AccountNumber, AccountType, OpenDate, Balance, Currency)
VALUES (
    (SELECT CustomerID FROM Customers WHERE Email = 'violate.inactive@example.com'),
    'VIO-INACT-9020',
    'Checking',
    CURRENT_DATE - INTERVAL '400 days',
    42.00,
    'USD'
)
ON CONFLICT (AccountNumber) DO UPDATE SET
    CustomerID = EXCLUDED.CustomerID,
    AccountType = EXCLUDED.AccountType,
    OpenDate = EXCLUDED.OpenDate,
    Balance = EXCLUDED.Balance,
    Currency = EXCLUDED.Currency;

-- 4) Transactions that exceed fraud limits (triggers View_PotentialFraudTransactions)
-- Checking limit: > 10000
INSERT INTO Transactions (AccountID, CustomerID, StaffID, StatusID, TransactionType, TotalAmount, Channel, Notes, TransactionDate)
VALUES (
    (SELECT AccountID FROM Accounts WHERE AccountNumber = 'VIO-CHK-9001'),
    (SELECT CustomerID FROM Customers WHERE Email = 'violate.fraud.checking@example.com'),
    NULL,
    (SELECT StatusID FROM TransactionStatus WHERE StatusName = 'Pending'),
    'Transfer',
    10000.01,
    'Mobile',
    'VIOLATE_FRAUD_CHECKING',
    CURRENT_TIMESTAMP
);

-- Savings limit: > 50000
INSERT INTO Transactions (AccountID, CustomerID, StaffID, StatusID, TransactionType, TotalAmount, Channel, Notes, TransactionDate)
VALUES (
    (SELECT AccountID FROM Accounts WHERE AccountNumber = 'VIO-SAV-9002'),
    (SELECT CustomerID FROM Customers WHERE Email = 'violate.fraud.savings@example.com'),
    NULL,
    (SELECT StatusID FROM TransactionStatus WHERE StatusName = 'Pending'),
    'Transfer',
    50000.01,
    'Online',
    'VIOLATE_FRAUD_SAVINGS',
    CURRENT_TIMESTAMP - INTERVAL '1 hour'
);

-- Loan limit: > 100000
INSERT INTO Transactions (AccountID, CustomerID, StaffID, StatusID, TransactionType, TotalAmount, Channel, Notes, TransactionDate)
VALUES (
    (SELECT AccountID FROM Accounts WHERE AccountNumber = 'VIO-LN-9003'),
    (SELECT CustomerID FROM Customers WHERE Email = 'violate.fraud.loan@example.com'),
    NULL,
    (SELECT StatusID FROM TransactionStatus WHERE StatusName = 'Pending'),
    'Disbursement',
    100000.01,
    'System',
    'VIOLATE_FRAUD_LOAN',
    CURRENT_TIMESTAMP - INTERVAL '2 hours'
);

-- 5) Optional detail lines for the new transactions (not required by Module 3, but keeps data model consistent)
INSERT INTO TransactionLines (TransactionID, ProductID, Amount, FeeAmount, LineDescription)
VALUES
(
    (SELECT TransactionID FROM Transactions WHERE Notes = 'VIOLATE_FRAUD_CHECKING'),
    (SELECT ProductID FROM BankProducts WHERE ProductName = 'Standard Checking' ORDER BY ProductID LIMIT 1),
    10000.01,
    0.00,
    'VIOLATE_LINE_FRAUD_CHECKING'
),
(
    (SELECT TransactionID FROM Transactions WHERE Notes = 'VIOLATE_FRAUD_SAVINGS'),
    (SELECT ProductID FROM BankProducts WHERE ProductName = 'Gold Saver' ORDER BY ProductID LIMIT 1),
    50000.01,
    0.00,
    'VIOLATE_LINE_FRAUD_SAVINGS'
),
(
    (SELECT TransactionID FROM Transactions WHERE Notes = 'VIOLATE_FRAUD_LOAN'),
    (SELECT ProductID FROM BankProducts WHERE ProductName = 'Home Starter Loan' ORDER BY ProductID LIMIT 1),
    100000.01,
    0.00,
    'VIOLATE_LINE_FRAUD_LOAN'
);

COMMIT;
