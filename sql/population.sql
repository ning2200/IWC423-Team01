-- 1. Populate Customers
-- We include a mix of low/high risk customers to test KYC logic
INSERT INTO Customers (CustomerName, Email, Phone, Address, KYCStatus, RiskRating) VALUES
('John Doe', 'john.doe@example.com', '555-0101', '123 Maple St, Singapore', 'Verified', 0.10),
('Jane Smith', 'jane.smith@example.com', '555-0102', '456 Oak Rd, Singapore', 'Verified', 0.05),
('Robert Brown', 'bob.brown@example.com', '555-0103', '789 Pine Ln, Singapore', 'Pending', 0.45),
('Alice Wong', 'alice.wong@example.com', '555-0104', '321 Birch Blvd, Singapore', 'Verified', 0.02),
('Charlie Cho', 'charlie.cho@example.com', '555-0105', '654 Cedar Ave, Singapore', 'Verified', 0.80); -- High Risk

-- 2. Populate BankStaff
INSERT INTO BankStaff (FirstName, LastName, RoleTitle, BranchID, Email) VALUES
('Sarah', 'Lee', 'Branch Manager', 'SG-001', 'sarah.lee@bank.com'),
('Mike', 'Tan', 'Senior Teller', 'SG-001', 'mike.tan@bank.com'),
('Jessica', 'Chen', 'Loan Officer', 'SG-002', 'jessica.chen@bank.com');

-- 3. Populate TransactionStatus (Reference Data)
-- These must match the CHECK constraint in your schema
INSERT INTO TransactionStatus (StatusName, StatusDescription, IsFinal) VALUES
('Pending', 'Transaction initiated but not cleared', FALSE),
('Posted', 'Transaction completed successfully', TRUE),
('Failed', 'Transaction failed due to error or funds', TRUE),
('Reversed', 'Transaction reversed by admin', TRUE);

-- 4. Populate BankProducts
-- Products for upsell recommendations (Rule #2)
INSERT INTO BankProducts (ProductName, ProductType, InterestRate, FeeSchedule, ActiveFlag) VALUES
('Standard Checking', 'Checking', 0.0010, 'Monthly: $10', TRUE),
('Gold Saver', 'Savings', 0.0250, 'None', TRUE),
('Platinum Investment', 'Investment', 0.0500, 'Management: 1%', TRUE), -- High Yield for Upsell
('Home Starter Loan', 'Loan', 0.0350, 'Origination: 2%', TRUE),
('Tech Startup Loan', 'Loan', 0.0650, 'Origination: 3%', TRUE);

-- 5. Populate Accounts
-- We create specific scenarios for your business rules:
-- Jane Smith: Balance > $100k (Triggers Rule #2 Recommendation)
-- Robert Brown: Account opened long ago (Triggers Rule #3 Inactive if no recent tx)
INSERT INTO Accounts (CustomerID, AccountNumber, AccountType, OpenDate, Balance, Currency) VALUES
(1, 'CHK-1001', 'Checking', CURRENT_DATE - INTERVAL '1 year', 5500.00, 'USD'),   -- John
(2, 'SAV-2001', 'Savings', CURRENT_DATE - INTERVAL '6 months', 150000.00, 'USD'), -- Jane (High Balance!)
(2, 'CHK-2002', 'Checking', CURRENT_DATE - INTERVAL '2 years', 2500.00, 'USD'),   -- Jane
(3, 'CHK-3001', 'Checking', CURRENT_DATE - INTERVAL '200 days', 100.00, 'USD'),   -- Robert (Inactive candidate)
(4, 'LN-4001', 'Loan', CURRENT_DATE - INTERVAL '1 month', 0.00, 'USD'),           -- Alice
(5, 'CHK-5001', 'Checking', CURRENT_DATE - INTERVAL '1 week', 1000.00, 'USD');    -- Charlie

-- 6. Populate Transactions
-- Specific scenarios:
-- 1. Normal transactions for John
-- 2. A "Fraud" attempt for Charlie (Exceeds $10k checking limit)
-- 3. No recent transactions for Robert (to ensure he shows up as Inactive)
INSERT INTO Transactions (AccountID, CustomerID, StaffID, StatusID, TransactionType, TotalAmount, Channel, Notes, TransactionDate) VALUES
-- John: Normal activity
(1, 1, 2, 2, 'Deposit', 2000.00, 'ATM', 'Paycheck deposit', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(1, 1, NULL, 2, 'Purchase', 150.00, 'POS', 'Grocery Store', CURRENT_TIMESTAMP - INTERVAL '1 day'),

-- Jane: Recent activity
(2, 2, 1, 2, 'Deposit', 50000.00, 'Branch', 'Large cash deposit', CURRENT_TIMESTAMP - INTERVAL '5 days'),

-- Robert: Old activity (More than 90 days ago) -> Makes him "Inactive"
(4, 3, 2, 2, 'Deposit', 100.00, 'Branch', 'Opening deposit', CURRENT_TIMESTAMP - INTERVAL '150 days'),

-- Charlie: Fraud Attempt? (Checking limit is $10k, he tries $12k)
(6, 5, NULL, 1, 'Transfer', 12000.00, 'Mobile', 'Suspicious large transfer', CURRENT_TIMESTAMP),

-- Alice: Loan Disbursement
(5, 4, 3, 2, 'Disbursement', 100000.00, 'System', 'Home Loan Payout', CURRENT_TIMESTAMP - INTERVAL '10 days');

-- 7. Populate TransactionLines
-- Details linking transactions to products
INSERT INTO TransactionLines (TransactionID, ProductID, Amount, FeeAmount, LineDescription) VALUES
(1, 1, 2000.00, 0.00, 'Salary Credit'),
(2, 1, 150.00, 0.00, 'Grocery Payment'),
(3, 2, 50000.00, 0.00, 'Investment Capital'),
(4, 1, 100.00, 10.00, 'Initial Deposit + Account Fee'),
(5, 1, 12000.00, 50.00, 'External Transfer Out'),
(6, 4, 100000.00, 2000.00, 'Loan Principal Disbursement');