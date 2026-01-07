// Mock data based on IWC423-Team01 banking domain schema
// Derived from base_population.sql and transaction_data.csv

export const customers = [
  { customerId: 1, customerName: 'John Doe', email: 'john.doe@example.com', phone: '555-0101', address: '123 Maple St, Singapore', kycStatus: 'Verified', riskRating: 0.10, createdDate: '2024-01-15T10:00:00Z' },
  { customerId: 2, customerName: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-0102', address: '456 Oak Rd, Singapore', kycStatus: 'Verified', riskRating: 0.05, createdDate: '2024-06-20T14:30:00Z' },
  { customerId: 3, customerName: 'Robert Brown', email: 'bob.brown@example.com', phone: '555-0103', address: '789 Pine Ln, Singapore', kycStatus: 'Pending', riskRating: 0.45, createdDate: '2025-03-10T09:15:00Z' },
  { customerId: 4, customerName: 'Alice Wong', email: 'alice.wong@example.com', phone: '555-0104', address: '321 Birch Blvd, Singapore', kycStatus: 'Verified', riskRating: 0.02, createdDate: '2025-11-05T16:45:00Z' },
  { customerId: 5, customerName: 'Charlie Cho', email: 'charlie.cho@example.com', phone: '555-0105', address: '654 Cedar Ave, Singapore', kycStatus: 'Pending', riskRating: 0.80, createdDate: '2025-12-01T11:20:00Z' },
  // Violation test customers
  { customerId: 6, customerName: 'Violator Checking Fraud', email: 'violate.fraud.checking@example.com', phone: '555-9001', address: 'Violation St 1, Singapore', kycStatus: 'Verified', riskRating: 0.90, createdDate: '2025-11-07T08:00:00Z' },
  { customerId: 7, customerName: 'Violator Savings Fraud', email: 'violate.fraud.savings@example.com', phone: '555-9002', address: 'Violation St 2, Singapore', kycStatus: 'Verified', riskRating: 0.90, createdDate: '2025-10-23T12:00:00Z' },
  { customerId: 8, customerName: 'Violator Loan Fraud', email: 'violate.fraud.loan@example.com', phone: '555-9003', address: 'Violation St 3, Singapore', kycStatus: 'Verified', riskRating: 0.90, createdDate: '2025-10-08T09:30:00Z' },
  { customerId: 9, customerName: 'Violator High Balance', email: 'violate.highbalance@example.com', phone: '555-9010', address: 'Rich St 10, Singapore', kycStatus: 'Verified', riskRating: 0.10, createdDate: '2025-07-11T15:00:00Z' },
  { customerId: 10, customerName: 'Violator Inactive', email: 'violate.inactive@example.com', phone: '555-9020', address: 'Quiet St 20, Singapore', kycStatus: 'Verified', riskRating: 0.10, createdDate: '2024-12-03T10:00:00Z' },
];

export const accounts = [
  { accountId: 1, customerId: 1, accountNumber: 'CHK-1001', accountType: 'Checking', openDate: '2025-01-07', balance: 5500.00, currency: 'USD', accountStatus: 'Active' },
  { accountId: 2, customerId: 2, accountNumber: 'SAV-2001', accountType: 'Savings', openDate: '2025-07-07', balance: 150000.00, currency: 'USD', accountStatus: 'Active' }, // High Balance!
  { accountId: 3, customerId: 2, accountNumber: 'CHK-2002', accountType: 'Checking', openDate: '2024-01-07', balance: 2500.00, currency: 'USD', accountStatus: 'Active' },
  { accountId: 4, customerId: 3, accountNumber: 'CHK-3001', accountType: 'Checking', openDate: '2025-06-21', balance: 100.00, currency: 'USD', accountStatus: 'Active' }, // Inactive candidate
  { accountId: 5, customerId: 4, accountNumber: 'LN-4001', accountType: 'Loan', openDate: '2025-12-07', balance: 0.00, currency: 'USD', accountStatus: 'Active' },
  { accountId: 6, customerId: 5, accountNumber: 'CHK-5001', accountType: 'Checking', openDate: '2025-12-31', balance: 1000.00, currency: 'USD', accountStatus: 'Active' },
  // Violation accounts
  { accountId: 7, customerId: 6, accountNumber: 'VIO-CHK-9001', accountType: 'Checking', openDate: '2025-12-08', balance: 500.00, currency: 'USD', accountStatus: 'Active' },
  { accountId: 8, customerId: 7, accountNumber: 'VIO-SAV-9002', accountType: 'Savings', openDate: '2025-11-23', balance: 1000.00, currency: 'USD', accountStatus: 'Active' },
  { accountId: 9, customerId: 8, accountNumber: 'VIO-LN-9003', accountType: 'Loan', openDate: '2025-11-08', balance: 0.00, currency: 'USD', accountStatus: 'Active' },
  { accountId: 10, customerId: 9, accountNumber: 'VIO-HIBAL-9010', accountType: 'Savings', openDate: '2025-07-11', balance: 250000.01, currency: 'USD', accountStatus: 'Active' }, // High Balance!
  { accountId: 11, customerId: 10, accountNumber: 'VIO-INACT-9020', accountType: 'Checking', openDate: '2024-12-03', balance: 42.00, currency: 'USD', accountStatus: 'Active' }, // Inactive!
];

export const bankStaff = [
  { staffId: 1, firstName: 'Sarah', lastName: 'Lee', roleTitle: 'Branch Manager', branchId: 'SG-001', email: 'sarah.lee@bank.com', active: true },
  { staffId: 2, firstName: 'Mike', lastName: 'Tan', roleTitle: 'Senior Teller', branchId: 'SG-001', email: 'mike.tan@bank.com', active: true },
  { staffId: 3, firstName: 'Jessica', lastName: 'Chen', roleTitle: 'Loan Officer', branchId: 'SG-002', email: 'jessica.chen@bank.com', active: true },
];

export const transactionStatus = [
  { statusId: 1, statusName: 'Pending', statusDescription: 'Transaction initiated but not cleared', isFinal: false },
  { statusId: 2, statusName: 'Posted', statusDescription: 'Transaction completed successfully', isFinal: true },
  { statusId: 3, statusName: 'Failed', statusDescription: 'Transaction failed due to error or funds', isFinal: true },
  { statusId: 4, statusName: 'Reversed', statusDescription: 'Transaction reversed by admin', isFinal: true },
];

export const bankProducts = [
  { productId: 1, productName: 'Standard Checking', productType: 'Checking', interestRate: 0.0010, feeSchedule: 'Monthly: $10', activeFlag: true },
  { productId: 2, productName: 'Gold Saver', productType: 'Savings', interestRate: 0.0250, feeSchedule: 'None', activeFlag: true },
  { productId: 3, productName: 'Platinum Investment', productType: 'Investment', interestRate: 0.0500, feeSchedule: 'Management: 1%', activeFlag: true },
  { productId: 4, productName: 'Home Starter Loan', productType: 'Loan', interestRate: 0.0350, feeSchedule: 'Origination: 2%', activeFlag: true },
  { productId: 5, productName: 'Tech Startup Loan', productType: 'Loan', interestRate: 0.0650, feeSchedule: 'Origination: 3%', activeFlag: true },
  { productId: 6, productName: 'VIOLATE Investment Max', productType: 'Investment', interestRate: 0.0999, feeSchedule: 'Management: 2%', activeFlag: true },
];

// Transaction thresholds for Module 3 Fraud Detection
export const FRAUD_THRESHOLDS = {
  Checking: { min: 0.01, max: 10000 },
  Savings: { min: 0.01, max: 50000 },
  Loan: { min: 0.01, max: 100000 },
};

export const HIGH_BALANCE_THRESHOLD = 100000;
export const INACTIVE_DAYS_THRESHOLD = 90;
