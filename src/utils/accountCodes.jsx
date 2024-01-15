const accountCode = [
  {
    Code: "200",
    Name: "Pergeraq Events",
    Type: "Revenue",
    TaxCode: "Standard-Rated Supplies (8%)",
  },
  {
    Code: "202",
    Name: "Dana KCQ 2",
    Type: "Revenue",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "204",
    Name: "Dana Zakat",
    Type: "Revenue",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "206",
    Name: "Membership Fees",
    Type: "Revenue",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "207",
    Name: "Dana Renovation",
    Type: "Revenue",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "208",
    Name: "Donations",
    Type: "Other Income",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "210",
    Name: "Subscription Received",
    Type: "Other Income",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "310",
    Name: "Miscellenous project cost",
    Type: "Direct Costs",
    TaxCode: "Standard-Rated Purchases (8%)",
  },
  {
    Code: "312",
    Name: "Korban/Aqiqah",
    Type: "Direct Costs",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "314",
    Name: "Kias",
    Type: "Direct Costs",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "3161",
    Name: "Auditor's Fee",
    Type: "Expense",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "3181",
    Name: "Petty Cash Expenses Topup",
    Type: "Expense",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "319",
    Name: "Asatizah Fees",
    Type: "Direct Costs",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "320",
    Name: "Program AQ",
    Type: "Direct Costs",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "425",
    Name: "Accounting Fees",
    Type: "Expense",
    TaxCode: "Standard-Rated Purchases (8%)",
  },
  {
    Code: "473",
    Name: "Office Maintenance",
    Type: "Expense",
    TaxCode: "Standard-Rated Purchases (8%)",
  },
  {
    Code: "600",
    Name: "DBS",
    Type: "Bank",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "605",
    Name: "Petty Cash",
    Type: "Bank",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "610",
    Name: "Accounts Receivable",
    Type: "Accounts Receivable",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "800",
    Name: "Accounts Payable",
    Type: "Accounts Payable",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "801",
    Name: "Unpaid Expense Claims",
    Type: "Unpaid Expense Claims",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "803",
    Name: "Wages Payable",
    Type: "Wages Payable",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "820",
    Name: "GST",
    Type: "Sales Tax",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "824",
    Name: "Accruals",
    Type: "Current Liability",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "826",
    Name: "Other Payable",
    Type: "Current Liability",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "830",
    Name: "Dana Biasiswa AQ Qiraat",
    Type: "Equity",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "960",
    Name: "General Fund - Unrestricted Fund",
    Type: "Retained Earnings",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "961",
    Name: "General Funds Allocated",
    Type: "Equity",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "970",
    Name: "KCQ II FUND - designated fund (restricted)",
    Type: "Equity",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "973",
    Name: "Dana Kabajikan",
    Type: "Equity",
    TaxCode: "No Tax (0%)",
  },
  {
    Code: "975",
    Name: "ZAKAT HARTA FUND - restricted fund",
    Type: "Equity",
    TaxCode: "No Tax (0%)",
  },
];

export const accountCodes = accountCode.map((item) => ({
  value: item.Code,
  label: item.Name,
}));