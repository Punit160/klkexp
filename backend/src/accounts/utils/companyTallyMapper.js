function asText(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

function asBool(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

/** Map CompanyDetail record to Tally company/ledger master JSON shape. */
export const mapCompanyDetailToTally = (company) => {
  if (!company) return null;

  const addLine1 = company.add_line1 || company.address || "";
  const gst = company.gst || "";
  const stateCode =
    company.state_code || (gst.length >= 2 && /^\d{2}/.test(gst) ? gst.slice(0, 2) : "");

  return {
    CompanyName: company.name || "",
    LedgerName: company.ledger_name || company.name || "",
    LedgerCode: company.code || "",
    LedgerGroup: company.ledger_group || "",
    ShortName: company.short_name || "",
    AddLine1: addLine1,
    AddLine2: company.add_line2 || "",
    AddLine3: company.add_line3 || "",
    City: company.city || "",
    LedgerPIN: company.zipcode != null ? String(company.zipcode) : "",
    LedState: company.state || "",
    LedCountry: company.country || "India",
    StateCode: stateCode,
    ContactPerson: company.contact_person || "",
    ContactNumber: company.contact_number || "",
    EmailID: company.email || "",
    PanNumber: company.pan || "",
    GSTNumber: gst,
    TAN: company.tan || "",
    CIN: company.cin || "",
    Status: company.status != null ? Number(company.status) : 1,
    BankAccounts: (company.bank_accounts || []).map((bank) => ({
      BankName: bank.bank_name || "",
      AccountNo: bank.ac_no || "",
      BranchName: bank.branch_name || "",
      IFSC: bank.ifsc_code || "",
      IsPrimary: !!bank.is_primary,
    })),
  };
};

export const mapTallyBankAccounts = (rows) => {
  if (!Array.isArray(rows)) return undefined;

  return rows.map((row) => ({
    bank_name: asText(row.bank_name ?? row.BankName),
    ac_no: asText(row.ac_no ?? row.AccountNo),
    branch_name: asText(row.branch_name ?? row.BranchName),
    ifsc_code: asText(row.ifsc_code ?? row.IFSC),
    is_primary: asBool(row.is_primary ?? row.IsPrimary),
  }));
};

/** Normalize incoming Tally/API payload into CompanyDetail field names. */
export const mapTallyToCompanyDetail = (payload = {}) => {
  const addLine1 = payload.AddLine1 ?? payload.add_line1 ?? payload.address ?? "";
  const name = payload.CompanyName ?? payload.LedgerName ?? payload.name ?? "";
  const ledgerName = payload.LedgerName ?? payload.ledger_name ?? payload.CompanyName ?? payload.name ?? "";

  const gst = asText(payload.GSTNumber ?? payload.gst);
  const stateCode =
    asText(payload.StateCode ?? payload.state_code) ||
    (gst.length >= 2 && /^\d{2}/.test(gst) ? gst.slice(0, 2) : "");
  const statusNum = Number(payload.Status ?? payload.status ?? 1);

  return {
    name: asText(name),
    ledger_name: asText(ledgerName),
    code: asText(payload.LedgerCode ?? payload.code),
    ledger_group: asText(payload.LedgerGroup ?? payload.ledger_group),
    short_name: asText(payload.ShortName ?? payload.short_name),
    add_line1: asText(addLine1),
    add_line2: asText(payload.AddLine2 ?? payload.add_line2),
    add_line3: asText(payload.AddLine3 ?? payload.add_line3),
    address: asText(addLine1),
    city: asText(payload.City ?? payload.city),
    zipcode: payload.LedgerPIN ?? payload.zipcode ?? "",
    state: asText(payload.LedState ?? payload.state),
    country: asText(payload.LedCountry ?? payload.country) || "India",
    state_code: stateCode,
    contact_person: asText(payload.ContactPerson ?? payload.contact_person),
    contact_number: asText(payload.ContactNumber ?? payload.contact_number),
    email: asText(payload.EmailID ?? payload.email),
    pan: asText(payload.PanNumber ?? payload.pan),
    gst,
    tan: asText(payload.TAN ?? payload.tan),
    cin: asText(payload.CIN ?? payload.cin),
    status: Number.isFinite(statusNum) ? statusNum : 1,
  };
};
