-- banking domain database schema

-- 1. Customers Table

CREATE TABLE Customers (
    CustomerID SERIAL,
    CustomerName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE,
    Phone VARCHAR(20),
    Address TEXT,
    KYCStatus VARCHAR(50) DEFAULT 'Pending',
    RiskRating DECIMAL(3,2) CHECK (RiskRating >= 0 AND RiskRating <= 1),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (CustomerID)
);

-- 2. Accounts Table

CREATE TABLE Accounts (
    AccountID SERIAL,
    CustomerID INTEGER NOT NULL,
    AccountNumber VARCHAR(50) UNIQUE NOT NULL,
    AccountType VARCHAR(50) CHECK (AccountType IN ('Checking', 'Savings', 'Loan')),
    OpenDate DATE NOT NULL,
    Balance DECIMAL(15,2) DEFAULT 0.00 CHECK (Balance >= 0),
    Currency VARCHAR(3) DEFAULT 'USD',
    AccountStatus VARCHAR(50) DEFAULT 'Active',
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (AccountID),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID) ON DELETE CASCADE,
    UNIQUE(CustomerID, AccountNumber)
);

-- 3. BankStaff Table

CREATE TABLE BankStaff (
    StaffID SERIAL,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    RoleTitle VARCHAR(100),
    BranchID VARCHAR(20),
    Email VARCHAR(255) UNIQUE,
    Active BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (StaffID)
);

-- 4. TransactionStatus Table

CREATE TABLE TransactionStatus (
    StatusID SERIAL,
    StatusName VARCHAR(50) NOT NULL UNIQUE CHECK (StatusName IN ('Pending', 'Posted', 'Failed', 'Reversed')),
    StatusDescription TEXT,
    IsFinal BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (StatusID)
);

-- 5. BankProducts Table

CREATE TABLE BankProducts (
    ProductID SERIAL,
    ProductName VARCHAR(255) NOT NULL,
    ProductType VARCHAR(100),
    InterestRate DECIMAL(5,4) CHECK (InterestRate >= 0),
    FeeSchedule TEXT,
    ActiveFlag BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (ProductID)
);

-- 6. Transactions Table

CREATE TABLE Transactions (
    TransactionID SERIAL,
    AccountID INTEGER NOT NULL,
    CustomerID INTEGER NOT NULL,
    StaffID INTEGER,
    StatusID INTEGER NOT NULL,
    TransactionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    TransactionType VARCHAR(100) NOT NULL,
    TotalAmount DECIMAL(15,2) NOT NULL,
    Channel VARCHAR(50),
    Notes TEXT,
    PRIMARY KEY (TransactionID),
    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID) ON DELETE CASCADE,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID) ON DELETE CASCADE,
    FOREIGN KEY (StaffID) REFERENCES BankStaff(StaffID) ON DELETE SET NULL,
    FOREIGN KEY (StatusID) REFERENCES TransactionStatus(StatusID)
);

-- 7. TransactionLines Table

CREATE TABLE TransactionLines (
    TransactionLineID SERIAL,
    TransactionID INTEGER NOT NULL,
    ProductID INTEGER,
    Amount DECIMAL(15,2) NOT NULL,
    FeeAmount DECIMAL(15,2) DEFAULT 0.00 CHECK (FeeAmount >= 0),
    LineDescription TEXT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (TransactionLineID),
    FOREIGN KEY (TransactionID) REFERENCES Transactions(TransactionID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES BankProducts(ProductID) ON DELETE SET NULL
);
