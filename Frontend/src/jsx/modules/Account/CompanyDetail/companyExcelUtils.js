import * as XLSX from "xlsx";

export const COMPANY_IMPORT_COLUMNS = [
  { key: "name", label: "Company Name", required: true },
  { key: "short_name", label: "Short Name", required: true },
  { key: "code", label: "Ledger Code", required: true },
  { key: "add_line1", label: "Address Line 1", required: true },
  { key: "city", label: "City", required: true },
  { key: "state", label: "State", required: true },
  { key: "zipcode", label: "PIN Code", required: true },
  { key: "ledger_name", label: "Ledger Name", required: false },
  { key: "ledger_group", label: "Ledger Group", required: false },
  { key: "gst", label: "GST Number", required: false },
  { key: "pan", label: "PAN", required: false },
  { key: "tan", label: "TAN", required: false },
  { key: "cin", label: "CIN", required: false },
  { key: "email", label: "Email", required: false },
  { key: "state_code", label: "State Code", required: false },
  { key: "add_line2", label: "Address Line 2", required: false },
  { key: "add_line3", label: "Address Line 3", required: false },
  { key: "country", label: "Country", required: false },
  { key: "contact_person", label: "Contact Person", required: false },
  { key: "contact_number", label: "Contact Number", required: false },
  { key: "status", label: "Status", required: false },
  { key: "bank_name", label: "Bank Name", required: false },
  { key: "ac_no", label: "Bank A/C No", required: false },
  { key: "branch_name", label: "Bank Branch", required: false },
  { key: "ifsc_code", label: "IFSC", required: false },
];

const SAMPLE_ROWS = [
  {
    "Company Name": "ABC Traders Pvt Ltd",
    "Short Name": "ABC",
    "Ledger Code": "CUST-001",
    "Ledger Name": "ABC Traders",
    "Ledger Group": "Sundry Debtors",
    "Address Line 1": "12 MG Road",
    "Address Line 2": "Near Metro",
    "Address Line 3": "",
    City: "Delhi",
    State: "Delhi",
    "PIN Code": "110001",
    Country: "India",
    "State Code": "07",
    "GST Number": "07AAAAA1111A1Z1",
    PAN: "AAAAA1111A",
    TAN: "",
    CIN: "",
    Email: "abc@example.com",
    "Contact Person": "Rahul",
    "Contact Number": "9999999999",
    Status: "Active",
    "Bank Name": "HDFC Bank",
    "Bank A/C No": "1234567890",
    "Bank Branch": "Connaught Place",
    IFSC: "HDFC0001234",
  },
  {
    "Company Name": "XYZ Suppliers",
    "Short Name": "XYZ",
    "Ledger Code": "VEND-001",
    "Ledger Name": "XYZ Suppliers",
    "Ledger Group": "Sundry Creditors",
    "Address Line 1": "45 Industrial Area",
    "Address Line 2": "",
    "Address Line 3": "",
    City: "Gurugram",
    State: "Haryana",
    "PIN Code": "122001",
    Country: "India",
    "State Code": "06",
    "GST Number": "06BBBBB2222B1Z2",
    PAN: "BBBBB2222B",
    TAN: "",
    CIN: "",
    Email: "xyz@example.com",
    "Contact Person": "Amit",
    "Contact Number": "8888888888",
    Status: "Active",
    "Bank Name": "",
    "Bank A/C No": "",
    "Bank Branch": "",
    IFSC: "",
  },
];

const HEADER_MAP = {
  "company name": "name",
  name: "name",
  "short name": "short_name",
  short_name: "short_name",
  "ledger code": "code",
  code: "code",
  "ledger name": "ledger_name",
  ledger_name: "ledger_name",
  "ledger group": "ledger_group",
  ledger_group: "ledger_group",
  "address line 1": "add_line1",
  address: "add_line1",
  add_line1: "add_line1",
  "address line 2": "add_line2",
  add_line2: "add_line2",
  "address line 3": "add_line3",
  add_line3: "add_line3",
  city: "city",
  state: "state",
  "pin code": "zipcode",
  pin: "zipcode",
  pincode: "zipcode",
  zipcode: "zipcode",
  zip: "zipcode",
  country: "country",
  "state code": "state_code",
  state_code: "state_code",
  "gst number": "gst",
  gst: "gst",
  gstin: "gst",
  pan: "pan",
  tan: "tan",
  cin: "cin",
  email: "email",
  "contact person": "contact_person",
  contact_person: "contact_person",
  "contact number": "contact_number",
  contact_number: "contact_number",
  phone: "contact_number",
  status: "status",
  "bank name": "bank_name",
  bank_name: "bank_name",
  "bank a/c no": "ac_no",
  "bank ac no": "ac_no",
  "account no": "ac_no",
  ac_no: "ac_no",
  "bank branch": "branch_name",
  branch: "branch_name",
  branch_name: "branch_name",
  ifsc: "ifsc_code",
  ifsc_code: "ifsc_code",
};

const parseStatus = (value) => {
  if (value == null || value === "") return 1;
  const normalized = String(value).trim().toLowerCase();
  if (["1", "active", "yes", "true"].includes(normalized)) return 1;
  if (["0", "inactive", "no", "false"].includes(normalized)) return 0;
  return 1;
};

const str = (value) => (value != null ? String(value).trim() : "");

const normalizeRow = (raw) => {
  const normalized = {};
  Object.entries(raw).forEach(([key, value]) => {
    const mapped = HEADER_MAP[String(key).trim().toLowerCase()];
    if (mapped) normalized[mapped] = value != null ? String(value).trim() : "";
  });

  const name = str(normalized.name);
  const bank_name = str(normalized.bank_name);
  const ac_no = str(normalized.ac_no);
  const branch_name = str(normalized.branch_name);
  const ifsc_code = str(normalized.ifsc_code);

  const bank_accounts =
    bank_name || ac_no
      ? [
          {
            bank_name,
            ac_no,
            branch_name,
            ifsc_code,
            is_primary: true,
          },
        ]
      : [];

  return {
    name,
    short_name: str(normalized.short_name),
    code: str(normalized.code),
    ledger_name: str(normalized.ledger_name) || name,
    ledger_group: str(normalized.ledger_group),
    add_line1: str(normalized.add_line1),
    add_line2: str(normalized.add_line2),
    add_line3: str(normalized.add_line3),
    address: str(normalized.add_line1),
    city: str(normalized.city),
    state: str(normalized.state),
    zipcode: str(normalized.zipcode),
    country: str(normalized.country) || "India",
    state_code: str(normalized.state_code),
    gst: str(normalized.gst),
    pan: str(normalized.pan),
    tan: str(normalized.tan),
    cin: str(normalized.cin),
    email: str(normalized.email),
    contact_person: str(normalized.contact_person),
    contact_number: str(normalized.contact_number),
    status: parseStatus(normalized.status),
    bank_accounts,
  };
};

const isEmptyRow = (row) =>
  !row.name &&
  !row.short_name &&
  !row.code &&
  !row.add_line1 &&
  !row.city &&
  !row.state &&
  !row.zipcode;

export const downloadCompanyImportSample = () => {
  const worksheet = XLSX.utils.json_to_sheet(SAMPLE_ROWS);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");
  XLSX.writeFile(workbook, "Company_Import_Sample.xlsx");
};

export const parseCompanyExcelFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          reject(new Error("Excel file has no sheets"));
          return;
        }
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        const companies = rows.map(normalizeRow).filter((row) => !isEmptyRow(row));
        resolve(companies);
      } catch {
        reject(new Error("Could not read Excel file. Use the sample format."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });

export const validateImportCompanies = (companies) => {
  const errors = [];
  companies.forEach((company, index) => {
    const row = index + 2;
    if (!company.name) errors.push({ row, message: "Company Name is required" });
    if (!company.short_name) errors.push({ row, message: "Short Name is required" });
    if (!company.code) errors.push({ row, message: "Ledger Code is required" });
    if (!company.add_line1) errors.push({ row, message: "Address Line 1 is required" });
    if (!company.city) errors.push({ row, message: "City is required" });
    if (!company.state) errors.push({ row, message: "State is required" });
    if (!company.zipcode) errors.push({ row, message: "PIN Code is required" });
  });
  return errors;
};
