-- hospital domain creation script

-- 1. Customers Table

CREATE TABLE Customers (
    CustomerID SERIAL PRIMARY KEY,
    CustomerName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE,
    Phone VARCHAR(20),
    Address TEXT,
    KYCStatus VARCHAR(50) DEFAULT 'Pending',
    RiskRating DECIMAL(3,2) CHECK (RiskRating >= 0 AND RiskRating <= 1),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Accounts Table

CREATE TABLE Accounts (
    AccountID SERIAL PRIMARY KEY,
    CustomerID INTEGER NOT NULL REFERENCES Customers(CustomerID) ON DELETE CASCADE,
    AccountNumber VARCHAR(50) UNIQUE NOT NULL,
    AccountType VARCHAR(50) CHECK (AccountType IN ('Checking', 'Savings', 'Loan')),
    OpenDate DATE NOT NULL,
    Balance DECIMAL(15,2) DEFAULT 0.00 CHECK (Balance >= 0),
    Currency VARCHAR(3) DEFAULT 'USD',
    AccountStatus VARCHAR(50) DEFAULT 'Active',
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(CustomerID, AccountNumber)
);

-- 3. BankStaff Table

CREATE TABLE BankStaff (
    StaffID SERIAL PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    RoleTitle VARCHAR(100),
    BranchID VARCHAR(20),
    Email VARCHAR(255) UNIQUE,
    Active BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TransactionStatus Table

CREATE TABLE TransactionStatus (
    StatusID SERIAL PRIMARY KEY,
    StatusName VARCHAR(50) NOT NULL UNIQUE CHECK (StatusName IN ('Pending', 'Posted', 'Failed', 'Reversed')),
    StatusDescription TEXT,
    IsFinal BOOLEAN DEFAULT FALSE
);

-- Insert default transaction statuses

INSERT INTO TransactionStatus 
(StatusName, StatusDescription, IsFinal) VALUES
('Pending', 'Transaction awaiting approval/processing', FALSE),
('Posted', 'Transaction successfully completed', TRUE),
('Failed', 'Transaction processing failed', TRUE),
('Reversed', 'Transaction cancelled/reversed', TRUE);

-- 5. BankProducts Table

CREATE TABLE BankProducts (
    ProductID SERIAL PRIMARY KEY,
    ProductName VARCHAR(255) NOT NULL,
    ProductType VARCHAR(100),
    InterestRate DECIMAL(5,4) CHECK (InterestRate >= 0),
    FeeSchedule TEXT,
    ActiveFlag BOOLEAN DEFAULT TRUE
);

-- 6. Transactions Table

CREATE TABLE Transactions (
    TransactionID SERIAL PRIMARY KEY,
    AccountID INTEGER NOT NULL REFERENCES Accounts(AccountID) ON DELETE CASCADE,
    CustomerID INTEGER NOT NULL REFERENCES Customers(CustomerID) ON DELETE CASCADE,
    StaffID INTEGER REFERENCES BankStaff(StaffID) ON DELETE SET NULL,
    StatusID INTEGER NOT NULL REFERENCES TransactionStatus(StatusID),
    TransactionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    TransactionType VARCHAR(100) NOT NULL,
    TotalAmount DECIMAL(15,2) NOT NULL,
    Channel VARCHAR(50),
    Notes TEXT
);

-- 7. TransactionLines Table

CREATE TABLE TransactionLines (
    TransactionLineID SERIAL PRIMARY KEY,
    TransactionID INTEGER NOT NULL REFERENCES Transactions(TransactionID) ON DELETE CASCADE,
    ProductID INTEGER REFERENCES BankProducts(ProductID) ON DELETE SET NULL,
    Amount DECIMAL(15,2) NOT NULL,
    FeeAmount DECIMAL(15,2) DEFAULT 0.00 CHECK (FeeAmount >= 0),
    LineDescription TEXT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);