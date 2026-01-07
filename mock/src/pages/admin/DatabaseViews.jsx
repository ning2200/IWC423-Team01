import { useState } from 'react'
import { Database, Server, FileJson, Table2, GitBranch } from 'lucide-react'
import CodeBlock from '../../components/CodeBlock'
import MermaidDiagram from '../../components/MermaidDiagram'

const tabs = ['Schema', 'PostgreSQL Views', 'MongoDB Documents', 'Hybrid Integration']

// ER Diagram for PostgreSQL Schema
const schemaERDiagram = `erDiagram
    CUSTOMERS {
        int CustomerID PK
        varchar CustomerName
        varchar Email UK
        varchar Phone
        text Address
        varchar KYCStatus
        decimal RiskRating
        timestamp CreatedDate
    }
    
    ACCOUNTS {
        int AccountID PK
        int CustomerID FK
        varchar AccountNumber UK
        varchar AccountType
        date OpenDate
        decimal Balance
        varchar Currency
        varchar AccountStatus
        timestamp CreatedDate
    }
    
    TRANSACTIONS {
        int TransactionID PK
        int AccountID FK
        int CustomerID FK
        int StaffID FK
        int StatusID FK
        timestamp TransactionDate
        varchar TransactionType
        decimal TotalAmount
        varchar Channel
        text Notes
    }
    
    TRANSACTIONLINES {
        int TransactionLineID PK
        int TransactionID FK
        int ProductID FK
        decimal Amount
        decimal FeeAmount
        text LineDescription
    }
    
    BANKPRODUCTS {
        int ProductID PK
        varchar ProductName
        varchar ProductType
        decimal InterestRate
        text FeeSchedule
        boolean ActiveFlag
    }
    
    BANKSTAFF {
        int StaffID PK
        varchar FirstName
        varchar LastName
        varchar RoleTitle
        varchar BranchID
        varchar Email
        boolean Active
    }
    
    TRANSACTIONSTATUS {
        int StatusID PK
        varchar StatusName UK
        text StatusDescription
        boolean IsFinal
    }
    
    CUSTOMERS ||--o{ ACCOUNTS : "has"
    CUSTOMERS ||--o{ TRANSACTIONS : "makes"
    ACCOUNTS ||--o{ TRANSACTIONS : "contains"
    TRANSACTIONS ||--o{ TRANSACTIONLINES : "has"
    BANKPRODUCTS ||--o{ TRANSACTIONLINES : "referenced_in"
    BANKSTAFF ||--o{ TRANSACTIONS : "processes"
    TRANSACTIONSTATUS ||--o{ TRANSACTIONS : "status_of"`

// MongoDB Document Structure Diagram
const mongoDocDiagram = `flowchart TB
    subgraph customers["📁 customers Collection"]
        direction TB
        C1["<b>Customer Document</b><br/>_id: ObjectId<br/>customerId: Number<br/>customerName: String<br/>email: String"]
        C2["<b>Embedded: address</b><br/>street, city, postalCode"]
        C3["<b>Embedded: accounts[]</b><br/>accountId, accountNumber<br/>accountType, balance"]
        C4["<b>Embedded: auditLog[]</b><br/>action, timestamp<br/>staffId, notes"]
        C5["<b>Embedded: preferences</b><br/>language, notifications"]
        C1 --> C2
        C1 --> C3
        C1 --> C4
        C1 --> C5
    end
    
    subgraph transactions["📁 transaction_events Collection"]
        direction TB
        T1["<b>Transaction Event</b><br/>_id: ObjectId<br/>transactionId: String<br/>accountId, customerId"]
        T2["<b>Embedded: transaction</b><br/>type, amount, currency<br/>channel, status"]
        T3["<b>Embedded: fraudAnalysis</b><br/>flagged, reason<br/>riskScore, threshold"]
        T4["<b>Embedded: deviceInfo</b><br/>type, os, appVersion"]
        T5["<b>Embedded: geolocation</b><br/>lat, long, city<br/>isAnomalous"]
        T6["<b>Embedded: networkMetrics</b><br/>sliceId, latency<br/>bandwidth"]
        T1 --> T2
        T1 --> T3
        T1 --> T4
        T1 --> T5
        T1 --> T6
    end
    
    subgraph analytics["📁 fraud_analytics Collection"]
        direction TB
        A1["<b>Aggregated Results</b><br/>_id: accountType<br/>totalFlagged: Number"]
        A2["<b>Computed Fields</b><br/>avgRiskScore<br/>alertPriority"]
        A1 --> A2
    end
    
    customers -.->|"Referenced by<br/>customerId"| transactions
    transactions -.->|"Aggregated into"| analytics`

// Hybrid Integration Diagram
const hybridDiagram = `flowchart TB
    subgraph client["🖥️ Client Applications"]
        WEB["Web Portal<br/>(React)"]
        MOBILE["Mobile App<br/>(iOS/Android)"]
        API["REST API<br/>Gateway"]
    end
    
    subgraph app["⚙️ Application Layer"]
        RULES["Module 3<br/>Rules Engine"]
        FRAUD["Real-time<br/>Fraud Detection"]
        CDC["Change Data<br/>Capture (CDC)"]
    end
    
    subgraph postgres["🐘 PostgreSQL (OLTP)"]
        direction TB
        PG_CUST["Customers"]
        PG_ACC["Accounts"]
        PG_TXN["Transactions"]
        PG_LINES["TransactionLines"]
        PG_PROD["BankProducts"]
        PG_STATUS["TransactionStatus"]
        
        PG_VIEW1["View: PotentialFraud<br/>Transactions"]
        PG_VIEW2["View: HighBalance<br/>Recommendations"]
        PG_VIEW3["View: InactiveAccount<br/>Followup"]
    end
    
    subgraph mongo["🍃 MongoDB (OLAP)"]
        direction TB
        MG_CUST["customer_profiles<br/>(denormalized)"]
        MG_TXN["transaction_events<br/>(enriched)"]
        MG_FRAUD["fraud_analytics<br/>(aggregated)"]
        MG_AUDIT["audit_logs<br/>(append-only)"]
        MG_MKT["marketing_segments<br/>(ML features)"]
    end
    
    WEB --> API
    MOBILE --> API
    API --> RULES
    
    RULES -->|"ACID Writes"| postgres
    RULES -->|"Analytics Queries"| mongo
    
    FRAUD --> MG_FRAUD
    
    postgres -->|"CDC Stream<br/>(Debezium/Kafka)"| CDC
    CDC -->|"Enriched Events"| mongo
    
    PG_TXN --> PG_VIEW1
    PG_ACC --> PG_VIEW2
    PG_ACC --> PG_VIEW3
    
    MG_TXN --> MG_FRAUD
    
    style postgres fill:#E3F2FD,stroke:#1565C0
    style mongo fill:#E8F5E9,stroke:#2E7D32
    style app fill:#FFF3E0,stroke:#EF6C00
    style client fill:#FCE4EC,stroke:#C2185B`

// PostgreSQL Schema
const schemaSQL = `-- IWC423 Team 1 Banking Domain Schema

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

-- 3. Transactions Table
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
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID) ON DELETE CASCADE
);

-- 4. TransactionLines Table (Detail)
CREATE TABLE TransactionLines (
    TransactionLineID SERIAL,
    TransactionID INTEGER NOT NULL,
    ProductID INTEGER,
    Amount DECIMAL(15,2) NOT NULL,
    FeeAmount DECIMAL(15,2) DEFAULT 0.00,
    LineDescription TEXT,
    PRIMARY KEY (TransactionLineID),
    FOREIGN KEY (TransactionID) REFERENCES Transactions(TransactionID) ON DELETE CASCADE
);

-- 5. BankProducts Table
CREATE TABLE BankProducts (
    ProductID SERIAL,
    ProductName VARCHAR(255) NOT NULL,
    ProductType VARCHAR(100),
    InterestRate DECIMAL(5,4),
    FeeSchedule TEXT,
    ActiveFlag BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (ProductID)
);`

// Module 4 SQL Joins
const module4SQL = `-- Module 4: SQL Joins Examples

-- 1. Show Customers with their Accounts 
SELECT 
    c.CustomerID,
    c.CustomerName,
    a.AccountID,
    a.AccountNumber,
    a.AccountType,
    a.Balance
FROM Customers c
LEFT JOIN Accounts a ON c.CustomerID = a.CustomerID;

-- 2. Total number of Transactions per Account
SELECT 
    a.AccountID,
    a.AccountNumber,
    COUNT(t.TransactionID) AS TotalTransactions
FROM Accounts a
LEFT JOIN Transactions t ON a.AccountID = t.AccountID
GROUP BY a.AccountID, a.AccountNumber;

-- 3. Total Transaction value per Customer
SELECT
    c.CustomerID,
    c.CustomerName,
    SUM(t.TotalAmount) AS TotalTransactionValue
FROM Customers c
LEFT JOIN Transactions t ON c.CustomerID = t.CustomerID
GROUP BY c.CustomerID, c.CustomerName
ORDER BY TotalTransactionValue DESC;

-- 4. Average fee per BankProduct
SELECT
    p.ProductID,
    p.ProductName,
    AVG(tl.FeeAmount) AS AverageFee
FROM BankProducts p
JOIN TransactionLines tl ON p.ProductID = tl.ProductID
GROUP BY p.ProductID, p.ProductName
ORDER BY AverageFee DESC;`

// MongoDB Documents
const mongoCustomerDoc = `// MongoDB: Customer Document (Flexible Schema)
// Collection: customers

{
  "_id": ObjectId("65a1b2c3d4e5f6789012345"),
  "customerId": 5,
  "customerName": "Charlie Cho",
  "email": "charlie.cho@example.com",
  "phone": "555-0105",
  "address": {
    "street": "654 Cedar Ave",
    "city": "Singapore",
    "postalCode": "123456"
  },
  "kycStatus": "Pending",
  "riskRating": 0.80,
  "riskCategory": "High",
  
  // Embedded accounts for fast reads
  "accounts": [
    {
      "accountId": 6,
      "accountNumber": "CHK-5001",
      "accountType": "Checking",
      "balance": 1000.00,
      "currency": "USD"
    }
  ],
  
  // Audit trail (append-only)
  "auditLog": [
    {
      "action": "KYC_SUBMITTED",
      "timestamp": ISODate("2025-12-01T11:20:00Z"),
      "staffId": null,
      "notes": "Online registration"
    },
    {
      "action": "RISK_FLAGGED",
      "timestamp": ISODate("2025-12-15T09:00:00Z"),
      "staffId": 1,
      "notes": "High transaction volume detected"
    }
  ],
  
  // Personalization metadata
  "preferences": {
    "language": "en",
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    }
  },
  
  "createdAt": ISODate("2025-12-01T11:20:00Z"),
  "updatedAt": ISODate("2025-12-15T09:00:00Z")
}`

const mongoTransactionDoc = `// MongoDB: Transaction Event Document
// Collection: transaction_events

{
  "_id": ObjectId("65b2c3d4e5f67890123456a"),
  "transactionId": "TXN006",
  "accountId": 6,
  "customerId": 5,
  
  "transaction": {
    "type": "Transfer",
    "amount": 12000.00,
    "currency": "USD",
    "channel": "Mobile",
    "status": "Pending"
  },
  
  // Fraud detection metadata (from CSV data)
  "fraudAnalysis": {
    "flagged": true,
    "reason": "Exceeds Checking Limit ($10,000)",
    "riskScore": 0.85,
    "thresholdExceeded": {
      "accountType": "Checking",
      "maxLimit": 10000,
      "transactionAmount": 12000,
      "variance": 2000
    }
  },
  
  // Device and location info (IoT/telemetry)
  "deviceInfo": {
    "type": "Mobile",
    "os": "iOS 17.2",
    "appVersion": "2.4.1"
  },
  
  "geolocation": {
    "latitude": 34.0522,
    "longitude": -118.2437,
    "city": "Los Angeles",
    "country": "USA",
    "isAnomalous": true  // Different from usual Singapore location
  },
  
  "networkMetrics": {
    "sliceId": "Slice3",
    "latency": 250,
    "bandwidth": 127
  },
  
  "timestamp": ISODate("2026-01-07T09:00:00Z"),
  "processedAt": ISODate("2026-01-07T09:00:01Z")
}`

const mongoAnalyticsDoc = `// MongoDB: Analytics Aggregation Pipeline
// For OLAP-style queries on transaction patterns

db.transaction_events.aggregate([
  // Stage 1: Match fraud-flagged transactions
  {
    $match: {
      "fraudAnalysis.flagged": true,
      "timestamp": {
        $gte: ISODate("2026-01-01T00:00:00Z")
      }
    }
  },
  
  // Stage 2: Group by account type
  {
    $group: {
      _id: "$fraudAnalysis.thresholdExceeded.accountType",
      totalFlaggedTransactions: { $sum: 1 },
      totalFlaggedAmount: { $sum: "$transaction.amount" },
      avgRiskScore: { $avg: "$fraudAnalysis.riskScore" },
      transactions: {
        $push: {
          transactionId: "$transactionId",
          amount: "$transaction.amount",
          timestamp: "$timestamp"
        }
      }
    }
  },
  
  // Stage 3: Add computed fields
  {
    $addFields: {
      alertPriority: {
        $cond: {
          if: { $gte: ["$avgRiskScore", 0.8] },
          then: "CRITICAL",
          else: {
            $cond: {
              if: { $gte: ["$avgRiskScore", 0.5] },
              then: "HIGH",
              else: "MEDIUM"
            }
          }
        }
      }
    }
  },
  
  // Stage 4: Sort by priority
  {
    $sort: { avgRiskScore: -1 }
  }
]);

// Expected Output:
{
  "_id": "Checking",
  "totalFlaggedTransactions": 3,
  "totalFlaggedAmount": 34000.01,
  "avgRiskScore": 0.87,
  "alertPriority": "CRITICAL",
  "transactions": [
    { "transactionId": "TXN006", "amount": 12000, ... },
    { "transactionId": "TXN007", "amount": 10000.01, ... }
  ]
}`

// Hybrid Integration
const hybridIntegration = `// Hybrid Database Integration Strategy
// PostgreSQL (OLTP) + MongoDB (OLAP/Flexible)

/*
┌─────────────────────────────────────────────────────────────────────┐
│                    HYBRID DATABASE ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────┐         ┌─────────────────────────────┐   │
│  │    PostgreSQL       │         │       MongoDB               │   │
│  │    (OLTP)           │ ──CDC──>│       (OLAP/Analytics)      │   │
│  ├─────────────────────┤         ├─────────────────────────────┤   │
│  │ • Customers         │         │ • customer_profiles         │   │
│  │ • Accounts          │         │ • transaction_events        │   │
│  │ • Transactions      │         │ • fraud_analytics           │   │
│  │ • TransactionLines  │         │ • audit_logs                │   │
│  │ • BankProducts      │         │ • marketing_segments        │   │
│  │ • TransactionStatus │         │                             │   │
│  └─────────────────────┘         └─────────────────────────────┘   │
│           │                                    │                    │
│           │ ACID Transactions                  │ Flexible Schema    │
│           │ Strong Consistency                 │ Horizontal Scale   │
│           │ Complex JOINs                      │ Real-time Analytics│
│           │ Referential Integrity              │ Document Embedding │
│           │                                    │                    │
│  ┌────────┴────────────────────────────────────┴──────────────┐    │
│  │                    APPLICATION LAYER                        │    │
│  │  • Module 3 Rules Engine (triggers both DBs)               │    │
│  │  • Real-time Fraud Detection Pipeline                      │    │
│  │  • Customer 360° View (aggregated from both)               │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
*/

// Scenario: High-risk customer transaction flow

// 1. Transaction received in PostgreSQL (OLTP)
INSERT INTO Transactions (AccountID, CustomerID, TotalAmount, ...)
VALUES (6, 5, 12000.00, ...);

// 2. Trigger CDC (Change Data Capture) to MongoDB
// Debezium/Kafka connector captures change event

// 3. MongoDB receives enriched document
db.transaction_events.insertOne({
  transactionId: "TXN006",
  // ... PostgreSQL data
  // + Additional analytics fields
  fraudAnalysis: {
    flagged: true,
    reason: "Exceeds Checking Limit"
  },
  geolocation: { /* from device */ },
  deviceInfo: { /* from app */ }
});

// 4. Real-time analytics query in MongoDB
db.transaction_events.aggregate([
  { $match: { customerId: 5, "fraudAnalysis.flagged": true } },
  { $group: { _id: "$customerId", totalFlagged: { $sum: 1 } } }
]);

// 5. Results feed back to PostgreSQL for compliance
UPDATE Customers SET RiskRating = 0.80 WHERE CustomerID = 5;`

export default function AdminDatabaseViews() {
  const [activeTab, setActiveTab] = useState('Schema')

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Database className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Database Views</h1>
            <p className="text-gray-500">PostgreSQL & MongoDB schema and query examples</p>
          </div>
        </div>
      </div>

      {/* Database Architecture Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <GitBranch className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Hybrid Database Architecture</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/70 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">PostgreSQL (OLTP)</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• ACID-compliant transactions</li>
              <li>• Referential integrity with FKs</li>
              <li>• Complex JOIN operations</li>
              <li>• Module 3 business rule views</li>
            </ul>
          </div>
          <div className="bg-white/70 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileJson className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-900">MongoDB (OLAP/Analytics)</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Flexible document schema</li>
              <li>• Embedded subdocuments</li>
              <li>• Aggregation pipelines</li>
              <li>• Real-time fraud analytics</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-bank-secondary text-bank-secondary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'Schema' && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Table2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">PostgreSQL Schema (module_2.sql)</h3>
            </div>
            <CodeBlock code={schemaSQL} language="sql" title="Banking Domain Schema" />
          </>
        )}

        {activeTab === 'PostgreSQL Views' && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Module 4: SQL JOIN Queries</h3>
            </div>
            <CodeBlock code={module4SQL} language="sql" title="module_4.sql - JOIN Examples" />
          </>
        )}

        {activeTab === 'MongoDB Documents' && (
          <>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileJson className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Customer Profile Document</h3>
                </div>
                <CodeBlock code={mongoCustomerDoc} language="json" title="customers collection" />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileJson className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Transaction Event Document</h3>
                </div>
                <CodeBlock code={mongoTransactionDoc} language="json" title="transaction_events collection" />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileJson className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Analytics Aggregation Pipeline</h3>
                </div>
                <CodeBlock code={mongoAnalyticsDoc} language="json" title="Fraud Analytics Aggregation" />
              </div>
            </div>
          </>
        )}

        {activeTab === 'Hybrid Integration' && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <GitBranch className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Hybrid Database Integration Strategy</h3>
            </div>
            <CodeBlock code={hybridIntegration} language="sql" title="PostgreSQL + MongoDB Integration" />
          </>
        )}
      </div>
    </div>
  )
}
