const MONTH_MAP = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

export function strVal(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

export function numVal(value, fallback = 0) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  const cleaned = String(value).replace(/,/g, "").replace(/[^\d.-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === "." || cleaned === "-.") return fallback;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : fallback;
}

export function nullifyOptional(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return value;
}

/** First present value as text. Dates are left as Date objects. Numbers become strings. */
export function firstText(...values) {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) continue;
      return value;
    }
    const text = String(value).trim();
    if (text === "") continue;
    return text;
  }
  return undefined;
}

/** First numeric value, keeping 0. Blank strings are skipped. */
export function firstNum(...values) {
  for (const value of values) {
    if (value === undefined || value === null || value === "") continue;
    return value;
  }
  return undefined;
}

/** Purchase/sales store branch and IFSC in one column: "Branch / IFSC". */
export function joinBankBranchIfsc(branch, ifsc) {
  const joined = [strVal(branch), strVal(ifsc)].filter(Boolean).join(" / ");
  return joined || undefined;
}

export function splitBankIfscBranch(value) {
  if (!value) return { BankBranch: "", BankIfsc: "" };
  const parts = String(value).split(" / ");
  if (parts.length >= 2) {
    return { BankBranch: parts[0], BankIfsc: parts.slice(1).join(" / ") };
  }
  return { BankBranch: "", BankIfsc: String(value) };
}

export function stateCodeFromGstin(gstin) {
  const normalized = strVal(gstin).replace(/\s/g, "").toUpperCase();
  if (normalized.length >= 2 && /^\d{2}/.test(normalized)) {
    return normalized.slice(0, 2);
  }
  return "";
}

/** Parse Tally / Indian invoice date strings into JS Date. */
export function parseTallyDate(value) {
  if (value === undefined || value === null || value === "") return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  const str = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const parsed = new Date(str);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  // 02/Jul/2026, 4-Jun-26
  const textMonth = str.match(/^(\d{1,2})[-\/]([A-Za-z]{3})[-\/](\d{2,4})$/i);
  if (textMonth) {
    const [, day, monthText, yearText] = textMonth;
    const month = MONTH_MAP[monthText.toLowerCase()];
    if (month == null) return null;
    let year = Number(yearText);
    if (yearText.length === 2) year += 2000;
    const parsed = new Date(year, month, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const numeric = str.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
  if (numeric) {
    const [, day, month, yearText] = numeric;
    let year = Number(yearText);
    if (yearText.length === 2) year += 2000;
    const parsed = new Date(year, Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(str);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Unwrap Tally POST body — single record, { data: [...] }, or JSON string. */
function extractTallyBatchRecords(body, rootMarkers = []) {
  if (body == null) return [];

  if (typeof body === "string") {
    const trimmed = body.trim();
    if (!trimmed) return [];
    try {
      return extractTallyBatchRecords(JSON.parse(trimmed), rootMarkers);
    } catch {
      return [];
    }
  }

  if (typeof body !== "object") return [];

  if (Array.isArray(body)) {
    return body.filter((row) => row && typeof row === "object");
  }

  let { data } = body;

  if (typeof data === "string") {
    const trimmed = data.trim();
    if (!trimmed) return [];
    try {
      data = JSON.parse(trimmed);
    } catch {
      return [];
    }
  }

  if (data != null) {
    if (Array.isArray(data)) {
      return data.filter((row) => row && typeof row === "object");
    }
    if (typeof data === "object") {
      return [data];
    }
  }

  if (rootMarkers.some((key) => body[key])) {
    return [body];
  }

  if (Object.keys(body).length > 0) {
    return [body];
  }

  return [];
}

export function extractTallyPurchaseRecords(body) {
  return extractTallyBatchRecords(body, [
    "PurchaseNo",
    "invoice_no",
    "PurchaseItems",
    "items",
  ]);
}

export function extractTallySalesRecords(body) {
  return extractTallyBatchRecords(body, [
    "InvoiceNo",
    "invoice_no",
    "BillItems",
    "items",
  ]);
}

export function extractTallyCreditNoteRecords(body) {
  return extractTallyBatchRecords(body, [
    "CreditNoteNo",
    "credit_note_no",
    "BillItems",
    "items",
  ]);
}

export function extractTallyDebitNoteRecords(body) {
  return extractTallyBatchRecords(body, [
    "DebitNoteNo",
    "debit_note_no",
    "PurchaseItems",
    "items",
  ]);
}

export function extractTallyPaymentRecords(body) {
  return extractTallyBatchRecords(body, [
    "VoucherNo",
    "voucher_no",
    "DebitLedgers",
    "CreditLedgers",
    "entries",
  ]);
}

/** True when payload is a Payment/Expense voucher (ledgers), not a debit/credit/purchase note. */
export function looksLikeTallyPaymentVoucher(body) {
  const records = extractTallyBatchRecords(body, [
    "VoucherNo",
    "voucher_no",
    "DebitLedgers",
    "CreditLedgers",
  ]);
  if (!records.length) return false;

  return records.every((row) => {
    const hasLedgers =
      (Array.isArray(row.DebitLedgers) && row.DebitLedgers.length > 0) ||
      (Array.isArray(row.CreditLedgers) && row.CreditLedgers.length > 0) ||
      (Array.isArray(row.entries) && row.entries.length > 0);
    const hasVoucherNo = !!(row.VoucherNo || row.voucher_no);
    const looksLikeDebitNote = !!(
      row.DebitNoteNo ||
      row.debit_note_no ||
      row.PurchaseItems ||
      row.VendorName
    );
    const looksLikeCreditNote = !!(
      row.CreditNoteNo ||
      row.credit_note_no ||
      row.BillItems ||
      row.CustomerName
    );
    const looksLikePurchase = !!(row.PurchaseNo && row.PurchaseItems);
    return hasLedgers && hasVoucherNo && !looksLikeDebitNote && !looksLikeCreditNote && !looksLikePurchase;
  });
}

export function wrongTallyEndpointResponse(expectedPath, example) {
  return {
    message: `Wrong Tally endpoint. This payload looks like a Payment / Expense voucher (VoucherNo + DebitLedgers / CreditLedgers).`,
    hint: `POST it to ${expectedPath} instead.`,
    example,
  };
}

export function extractTallyCompanyRecords(body) {
  return extractTallyBatchRecords(body, [
    "CompanyName",
    "LedgerName",
    "LedgerCode",
    "name",
    "code",
  ]);
}

export function extractTallyDeliveryChallanRecords(body) {
  return extractTallyBatchRecords(body, [
    "Challanno",
    "challan_no",
    "challanitems",
    "items",
  ]);
}

export const extractTallyExpenseRecords = extractTallyPaymentRecords;

export function isTallyBatchRequest(body) {
  if (!body || typeof body !== "object") return false;
  if (Array.isArray(body)) return body.length > 0;
  if (Array.isArray(body.data)) return body.data.length > 0;
  if (body.data && typeof body.data === "object") return true;
  return false;
}

/** Use array-style batch response when body is wrapped or sent as a JSON array. */
export function shouldUseTallyBatchResponse(body, records = []) {
  if (!records.length) return false;
  if (records.length > 1) return true;
  return isTallyBatchRequest(body);
}

export const isTallyPurchaseBatchRequest = isTallyBatchRequest;
export const isTallySalesBatchRequest = isTallyBatchRequest;
export const isTallyCreditNoteBatchRequest = isTallyBatchRequest;
export const isTallyDebitNoteBatchRequest = isTallyBatchRequest;
export const isTallyPaymentBatchRequest = isTallyBatchRequest;
export const isTallyCompanyBatchRequest = isTallyBatchRequest;
export const isTallyDeliveryChallanBatchRequest = isTallyBatchRequest;
export const isTallyExpenseBatchRequest = isTallyBatchRequest;

export function describeTallyBodyIssue(body, docType = "purchase") {
  const label =
    docType === "sales"
      ? "sales invoice"
      : docType === "credit note"
        ? "credit note"
        : docType === "debit note"
          ? "debit note"
          : docType === "payment"
            ? "payment"
            : docType === "company"
              ? "company"
              : docType === "delivery challan"
                ? "delivery challan"
                : docType === "expense"
                  ? "expense"
                  : "purchase";
  const example =
    docType === "sales"
      ? '{ "data": [ { "InvoiceNo": "...", "InvoiceDate": "...", "CustomerName": "...", "BillItems": [] } ] }'
      : docType === "credit note"
        ? '{ "data": [ { "CreditNoteNo": "...", "CreditNoteDate": "...", "InvoiceNo": "...", "CustomerName": "...", "BillItems": [] } ] }'
        : docType === "debit note"
          ? '{ "data": [ { "DebitNoteNo": "...", "DebitNoteDate": "...", "PurchaseNo": "...", "VendorName": "...", "PurchaseItems": [] } ] }'
          : docType === "payment"
            ? '{ "data": [ { "VoucherNo": "...", "VoucherDate": "...", "Narration": "...", "DebitLedgers": [], "CreditLedgers": [] } ] }'
            : docType === "company"
              ? '{ "data": [ { "CompanyName": "...", "LedgerCode": "..." } ] } or [ { "CompanyName": "..." }, { "CompanyName": "..." } ]'
              : docType === "delivery challan"
                ? '{ "data": [ { "Challanno": "...", "Challandate": "...", "CustomerName": "...", "challanitems": [] } ] }'
                : docType === "expense"
                  ? '{ "data": [ { "VoucherNo": "...", "VoucherDate": "...", "Narration": "...", "DebitLedgers": [], "CreditLedgers": [] } ] }'
                  : '{ "data": [ { "PurchaseNo": "...", "PurchaseDate": "...", "VendorName": "...", "PurchaseItems": [] } ] }';

  if (body == null) {
    return "Request body is empty. Use POST with Content-Type: application/json.";
  }
  if (typeof body === "string") {
    return "Body was received as plain text. Send JSON and set Content-Type: application/json.";
  }
  if (Array.isArray(body) && body.length === 0) {
    return `Body is an empty array. Wrap ${label}s in { "data": [ {...} ] }.`;
  }
  if (body?.data != null) {
    if (Array.isArray(body.data) && body.data.length === 0) {
      return `Field "data" is an empty array. Add at least one ${label} object.`;
    }
    if (typeof body.data === "string") {
      return 'Field "data" must be a JSON array/object, not a string (auto-parse failed).';
    }
  }
  return `Expected format: ${example}`;
}

export const describeTallySalesBodyIssue = (body) => describeTallyBodyIssue(body, "sales");
export const describeTallyCreditNoteBodyIssue = (body) =>
  describeTallyBodyIssue(body, "credit note");
export const describeTallyDebitNoteBodyIssue = (body) =>
  describeTallyBodyIssue(body, "debit note");
export const describeTallyPaymentBodyIssue = (body) =>
  describeTallyBodyIssue(body, "payment");
export const describeTallyCompanyBodyIssue = (body) =>
  describeTallyBodyIssue(body, "company");
export const describeTallyDeliveryChallanBodyIssue = (body) =>
  describeTallyBodyIssue(body, "delivery challan");
export const describeTallyExpenseBodyIssue = (body) =>
  describeTallyBodyIssue(body, "expense");

export function mapTallyPurchaseAliases(body = {}) {
  return {
    ...body,
    invoice_type: firstText(body.invoice_type, body.InvoiceType),
    irn: firstText(body.irn, body.IRN),
    ack_no: firstText(body.ack_no, body.AckNo),
    ack_date: firstText(body.ack_date, body.AckDate),
    invoice_no: firstText(body.invoice_no, body.PurchaseNo),
    invoice_date: firstText(body.invoice_date, body.PurchaseDate),
    eway_bill_no: firstText(body.eway_bill_no, body.EWayBillNo),
    delivery_note: firstText(body.delivery_note, body.DeliveryNote),
    delivery_note_date: firstText(body.delivery_note_date, body.DeliveryNoteDate),
    mode_of_payment: firstText(body.mode_of_payment, body.ModeTermsOfPayment),
    reference_no: firstText(body.reference_no, body.ReferenceNoDate),
    reference_date: firstText(body.reference_date, body.PODate),
    buyers_order_no: firstText(body.buyers_order_no, body.PONo),
    other_references: firstText(body.other_references, body.OtherReferences),
    dispatch_doc_no: firstText(body.dispatch_doc_no, body.DispatchDocNo),
    dispatched_through: firstText(body.dispatched_through, body.DispatchedThrough),
    destination: firstText(body.destination, body.Destination),
    bill_of_lading_no: firstText(body.bill_of_lading_no, body.BillOfLadingNo),
    motor_vehicle_no: firstText(body.motor_vehicle_no, body.MotorVehicleNo),
    terms_of_delivery: firstText(body.terms_of_delivery, body.TermsOfDelivery),
    seller_name: firstText(body.seller_name, body.VendorName),
    seller_address: firstText(body.seller_address, body.VendorAddress),
    seller_gstin: firstText(body.seller_gstin, body.Vendorgstin),
    seller_state: firstText(body.seller_state, body.VendorState),
    seller_state_code: firstText(body.seller_state_code, body.VendorStateCode),
    seller_cin: firstText(body.seller_cin, body.VendorCIN),
    seller_email: firstText(body.seller_email, body.VendorEmail),
    buyer_name: firstText(body.buyer_name, body.BuyerName, body.CustomerName),
    buyer_address: firstText(body.buyer_address, body.BuyerAddress),
    buyer_gstin: firstText(body.buyer_gstin, body.BuyerGstin, body.customergstin),
    buyer_state: firstText(body.buyer_state, body.BuyerState),
    buyer_state_code: firstText(body.buyer_state_code, body.BuyerStateCode),
    buyer_pan: firstText(body.buyer_pan, body.BuyerPAN),
    buyer_email: firstText(body.buyer_email, body.BuyerEmail),
    consignee_name: firstText(body.consignee_name, body.ConsigneeName),
    consignee_address: firstText(body.consignee_address, body.ConsigneeAddress),
    consignee_gstin: firstText(body.consignee_gstin, body.ConsigneeGstin),
    consignee_state: firstText(body.consignee_state, body.ConsigneeState),
    consignee_state_code: firstText(body.consignee_state_code, body.ConsigneeStateCode),
    consignee_email: firstText(body.consignee_email, body.ConsigneeEmail),
    total_amount: firstNum(body.total_amount, body.PurchaseAmount),
    taxable_value: firstNum(body.taxable_value, body.TaxableValue),
    total_quantity: firstNum(body.total_quantity, body.TotalQuantity),
    total_tax_amount: firstNum(body.total_tax_amount, body.TotalTaxAmount),
    igst_rate: firstNum(body.igst_rate, body.IGSTRate),
    igst_amount: firstNum(body.igst_amount, body.IGSTAmount),
    amount_in_words: firstText(body.amount_in_words, body.AmountInWords),
    tax_amount_in_words: firstText(body.tax_amount_in_words, body.TaxAmountInWords),
    bank_name: firstText(body.bank_name, body.BankName),
    bank_account_no: firstText(body.bank_account_no, body.BankAccountNo),
    bank_ifsc_branch: firstText(
      body.bank_ifsc_branch,
      joinBankBranchIfsc(body.BankBranch, body.BankIfsc)
    ),
    declaration: firstText(body.declaration, body.Declaration),
    authorised_signatory_name: firstText(body.authorised_signatory_name, body.AuthorisedSignatoryName),
    authorised_signatory_designation: firstText(
      body.authorised_signatory_designation,
      body.AuthorisedSignatoryDesignation
    ),
    issuing_signatory_name: firstText(body.issuing_signatory_name, body.IssuingSignatoryName),
    issuing_signatory_designation: firstText(
      body.issuing_signatory_designation,
      body.IssuingSignatoryDesignation
    ),
    jurisdiction: firstText(body.jurisdiction, body.Jurisdiction),
  };
}

export function normalizePurchaseItems(items = []) {
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    description: strVal(item.description ?? item.itemname, "Item"),
    hsn_sac: strVal(item.hsn_sac ?? item.hsn, "-"),
    quantity: numVal(item.quantity ?? item.qty, 0),
    unit: nullifyOptional(item.unit),
    rate: numVal(item.rate, 0),
    per: nullifyOptional(item.per ?? item.unit),
    amount: numVal(item.amount, 0),
  }));
}

export function normalizePurchaseGstDetails(gstDetails = []) {
  if (!Array.isArray(gstDetails)) return [];

  return gstDetails.map((row) => ({
    ledger_name: strVal(row.ledger_name ?? row.LedgerName, "Tax"),
    rate: numVal(row.rate, 0),
    amount: numVal(row.amount, 0),
  }));
}

/** Fill missing purchase header fields before Prisma create/update. */
export function normalizePurchasePayload(body = {}, items = [], gstDetails = [], companyId = "") {
  const mapped = mapTallyPurchaseAliases(body);
  const normalizedItems = normalizePurchaseItems(
    items.length ? items : mapped.items ?? mapped.PurchaseItems
  );
  const normalizedGst = normalizePurchaseGstDetails(
    gstDetails.length ? gstDetails : mapped.gst_details ?? mapped.GstDetails
  );

  const invoiceDate = parseTallyDate(mapped.invoice_date) ?? new Date();
  const ackDate = parseTallyDate(mapped.ack_date) ?? invoiceDate;
  const invoiceNo = strVal(mapped.invoice_no ?? mapped.PurchaseNo);

  const sellerGstin = strVal(mapped.seller_gstin ?? mapped.Vendorgstin);
  const buyerGstin = strVal(mapped.buyer_gstin);

  const itemsTotal = normalizedItems.reduce((sum, item) => sum + numVal(item.amount), 0);
  const taxTotal = normalizedGst.reduce((sum, row) => sum + numVal(row.amount), 0);

  const taxableValue =
    mapped.taxable_value != null && mapped.taxable_value !== ""
      ? numVal(mapped.taxable_value)
      : itemsTotal;

  const totalTaxAmount =
    mapped.total_tax_amount != null && mapped.total_tax_amount !== ""
      ? numVal(mapped.total_tax_amount)
      : taxTotal;

  const totalAmount =
    mapped.total_amount != null && mapped.total_amount !== ""
      ? numVal(mapped.total_amount)
      : numVal(mapped.PurchaseAmount, taxableValue + totalTaxAmount);

  const totalQuantity =
    mapped.total_quantity != null && mapped.total_quantity !== ""
      ? numVal(mapped.total_quantity)
      : normalizedItems.reduce((sum, item) => sum + numVal(item.quantity), 0);

  const irn =
    strVal(mapped.irn) ||
    (companyId && invoiceNo ? `TALLY-${companyId}-${invoiceNo}` : "");

  // Live DB may still treat ack_no as NOT NULL — never send null/empty.
  const ackNo =
    strVal(mapped.ack_no) ||
    (companyId && invoiceNo ? `TALLY-ACK-${companyId}-${invoiceNo}` : "") ||
    (irn ? `ACK-${irn}` : "NA");

  return {
    body: {
      ...mapped,
      irn,
      ack_no: ackNo,
      ack_date: ackDate,
      invoice_no: invoiceNo,
      invoice_date: invoiceDate,
      seller_name: strVal(mapped.seller_name ?? mapped.VendorName, "Unknown Vendor"),
      seller_address: strVal(mapped.seller_address),
      seller_gstin: sellerGstin || "NA",
      seller_state: strVal(mapped.seller_state),
      seller_state_code: strVal(mapped.seller_state_code) || stateCodeFromGstin(sellerGstin),
      seller_email: nullifyOptional(mapped.seller_email),
      seller_cin: nullifyOptional(mapped.seller_cin),
      buyer_name: strVal(mapped.buyer_name, companyId || "Company"),
      buyer_address: strVal(mapped.buyer_address),
      buyer_gstin: buyerGstin || "NA",
      buyer_state: strVal(mapped.buyer_state),
      buyer_state_code: strVal(mapped.buyer_state_code) || stateCodeFromGstin(buyerGstin),
      buyer_pan: nullifyOptional(mapped.buyer_pan),
      buyer_email: nullifyOptional(mapped.buyer_email),
      consignee_name: nullifyOptional(mapped.consignee_name),
      consignee_address: nullifyOptional(mapped.consignee_address),
      consignee_gstin: nullifyOptional(mapped.consignee_gstin),
      consignee_state: nullifyOptional(mapped.consignee_state),
      consignee_state_code: nullifyOptional(mapped.consignee_state_code),
      consignee_email: nullifyOptional(mapped.consignee_email),
      total_quantity: totalQuantity,
      taxable_value: taxableValue,
      igst_rate: numVal(mapped.igst_rate),
      igst_amount: numVal(mapped.igst_amount),
      total_tax_amount: totalTaxAmount,
      total_amount: totalAmount,
      eway_bill_no: nullifyOptional(mapped.eway_bill_no),
      delivery_note: nullifyOptional(mapped.delivery_note),
      mode_of_payment: nullifyOptional(mapped.mode_of_payment),
      reference_no: nullifyOptional(mapped.reference_no),
      reference_date: parseTallyDate(mapped.reference_date),
      buyers_order_no: nullifyOptional(mapped.buyers_order_no ?? mapped.PONo),
      other_references: nullifyOptional(mapped.other_references),
      dispatch_doc_no: nullifyOptional(mapped.dispatch_doc_no),
      delivery_note_date: parseTallyDate(mapped.delivery_note_date),
      dispatched_through: nullifyOptional(mapped.dispatched_through),
      destination: nullifyOptional(mapped.destination),
      bill_of_lading_no: nullifyOptional(mapped.bill_of_lading_no),
      motor_vehicle_no: nullifyOptional(mapped.motor_vehicle_no),
      terms_of_delivery: nullifyOptional(mapped.terms_of_delivery),
      amount_in_words: nullifyOptional(mapped.amount_in_words),
      tax_amount_in_words: nullifyOptional(mapped.tax_amount_in_words),
      bank_name: nullifyOptional(mapped.bank_name),
      bank_account_no: nullifyOptional(mapped.bank_account_no),
      bank_ifsc_branch: nullifyOptional(mapped.bank_ifsc_branch),
      declaration: nullifyOptional(mapped.declaration),
      authorised_signatory_name: nullifyOptional(mapped.authorised_signatory_name),
      authorised_signatory_designation: nullifyOptional(mapped.authorised_signatory_designation),
      issuing_signatory_name: nullifyOptional(mapped.issuing_signatory_name),
      issuing_signatory_designation: nullifyOptional(mapped.issuing_signatory_designation),
      jurisdiction: nullifyOptional(mapped.jurisdiction),
      invoice_type: nullifyOptional(mapped.invoice_type),
    },
    items: normalizedItems,
    gst_details: normalizedGst,
  };
}

export function mapTallySalesAliases(body = {}) {
  return {
    ...body,
    invoice_type: firstText(body.invoice_type, body.InvoiceType),
    irn: firstText(body.irn, body.IRN),
    ack_no: firstText(body.ack_no, body.AckNo),
    ack_date: firstText(body.ack_date, body.AckDate),
    invoice_no: firstText(body.invoice_no, body.InvoiceNo),
    invoice_date: firstText(body.invoice_date, body.InvoiceDate),
    eway_bill_no: firstText(body.eway_bill_no, body.EWayBillNo),
    delivery_note: firstText(body.delivery_note, body.DeliveryNote, body.Challanno, body.challanno),
    delivery_note_date: firstText(body.delivery_note_date, body.DeliveryNoteDate),
    mode_of_payment: firstText(body.mode_of_payment, body.ModeTermsOfPayment),
    reference_no: firstText(body.reference_no, body.ReferenceNoDate),
    reference_date: firstText(body.reference_date, body.BuyersOrderDate),
    buyers_order_no: firstText(body.buyers_order_no, body.BuyersOrderNo),
    other_references: firstText(body.other_references, body.OtherReferences),
    dispatch_doc_no: firstText(body.dispatch_doc_no, body.DispatchDocNo),
    dispatched_through: firstText(body.dispatched_through, body.DispatchedThrough),
    destination: firstText(body.destination, body.Destination),
    bill_of_lading_no: firstText(body.bill_of_lading_no, body.BillOfLadingNo),
    motor_vehicle_no: firstText(body.motor_vehicle_no, body.MotorVehicleNo),
    terms_of_delivery: firstText(body.terms_of_delivery, body.TermsOfDelivery),
    seller_name: firstText(body.seller_name, body.SellerName),
    seller_address: firstText(body.seller_address, body.SellerAddress),
    seller_gstin: firstText(body.seller_gstin, body.SellerGstin),
    seller_state: firstText(body.seller_state, body.SellerState),
    seller_state_code: firstText(body.seller_state_code, body.SellerStateCode),
    seller_cin: firstText(body.seller_cin, body.SellerCIN),
    seller_email: firstText(body.seller_email, body.SellerEmail),
    buyer_name: firstText(body.buyer_name, body.CustomerName),
    buyer_address: firstText(body.buyer_address, body.BuyerAddress),
    buyer_gstin: firstText(body.buyer_gstin, body.customergstin, body.BuyerGstin),
    buyer_state: firstText(body.buyer_state, body.BuyerState),
    buyer_state_code: firstText(body.buyer_state_code, body.BuyerStateCode),
    buyer_pan: firstText(body.buyer_pan, body.BuyerPAN),
    buyer_email: firstText(body.buyer_email, body.BuyerEmail),
    consignee_name: firstText(body.consignee_name, body.ConsigneeName),
    consignee_address: firstText(body.consignee_address, body.ConsigneeAddress),
    consignee_gstin: firstText(body.consignee_gstin, body.ConsigneeGstin),
    consignee_state: firstText(body.consignee_state, body.ConsigneeState),
    consignee_state_code: firstText(body.consignee_state_code, body.ConsigneeStateCode),
    consignee_email: firstText(body.consignee_email, body.ConsigneeEmail),
    total_amount: firstNum(body.total_amount, body.BillAmount),
    taxable_value: firstNum(body.taxable_value, body.TaxableValue),
    total_quantity: firstNum(body.total_quantity, body.TotalQuantity),
    total_tax_amount: firstNum(body.total_tax_amount, body.TotalTaxAmount),
    cgst_rate: firstNum(body.cgst_rate, body.CGSTRate),
    cgst_amount: firstNum(body.cgst_amount, body.CGSTAmount),
    sgst_rate: firstNum(body.sgst_rate, body.SGSTRate),
    sgst_amount: firstNum(body.sgst_amount, body.SGSTAmount),
    igst_rate: firstNum(body.igst_rate, body.IGSTRate),
    igst_amount: firstNum(body.igst_amount, body.IGSTAmount),
    amount_in_words: firstText(body.amount_in_words, body.AmountInWords),
    tax_amount_in_words: firstText(body.tax_amount_in_words, body.TaxAmountInWords),
    bank_name: firstText(body.bank_name, body.BankName),
    bank_account_no: firstText(body.bank_account_no, body.BankAccountNo),
    bank_ifsc_branch: firstText(
      body.bank_ifsc_branch,
      joinBankBranchIfsc(body.BankBranch, body.BankIfsc)
    ),
    declaration: firstText(body.declaration, body.Declaration),
    authorised_signatory_name: firstText(body.authorised_signatory_name, body.AuthorisedSignatoryName),
    authorised_signatory_designation: firstText(
      body.authorised_signatory_designation,
      body.AuthorisedSignatoryDesignation
    ),
    issuing_signatory_name: firstText(body.issuing_signatory_name, body.IssuingSignatoryName),
    issuing_signatory_designation: firstText(
      body.issuing_signatory_designation,
      body.IssuingSignatoryDesignation
    ),
    jurisdiction: firstText(body.jurisdiction, body.Jurisdiction),
  };
}

export function normalizeSalesItems(items = []) {
  return normalizePurchaseItems(items);
}

export function splitSalesGstAmounts(gstDetails = []) {
  const rows = normalizePurchaseGstDetails(gstDetails);
  const rowFor = (name) => rows.find((r) => strVal(r.ledger_name).toUpperCase() === name);
  const amountFor = (name) => {
    const row = rowFor(name);
    return row ? numVal(row.amount) : 0;
  };
  const rateFor = (name) => {
    const row = rowFor(name);
    return row ? numVal(row.rate) : 0;
  };

  const cgst_amount = amountFor("CGST");
  const sgst_amount = amountFor("SGST");
  const igst_amount = amountFor("IGST");
  const total_tax_amount = rows.reduce((sum, row) => sum + numVal(row.amount), 0);

  return {
    cgst_amount,
    sgst_amount,
    igst_amount,
    cgst_rate: rateFor("CGST"),
    sgst_rate: rateFor("SGST"),
    igst_rate: rateFor("IGST"),
    total_tax_amount,
  };
}

function numOrSplit(value, splitValue) {
  if (value != null && value !== "") return numVal(value);
  return numVal(splitValue);
}

/** Fill missing sales header fields before Prisma create/update. */
export function normalizeSalesPayload(body = {}, items = [], gstDetails = [], companyId = "") {
  const mapped = mapTallySalesAliases(body);
  const normalizedItems = normalizeSalesItems(
    items.length ? items : mapped.items ?? mapped.BillItems
  );
  const gstRows = normalizePurchaseGstDetails(
    gstDetails.length ? gstDetails : mapped.gst_details ?? mapped.GstDetails
  );
  const gstSplit = splitSalesGstAmounts(gstRows);

  const invoiceDate = parseTallyDate(mapped.invoice_date) ?? new Date();
  const ackDate = parseTallyDate(mapped.ack_date) ?? invoiceDate;
  const invoiceNo = strVal(mapped.invoice_no ?? mapped.InvoiceNo);

  const buyerGstin = strVal(mapped.buyer_gstin ?? mapped.customergstin);
  const sellerGstin = strVal(mapped.seller_gstin);

  const itemsTotal = normalizedItems.reduce((sum, item) => sum + numVal(item.amount), 0);

  const taxableValue =
    mapped.taxable_value != null && mapped.taxable_value !== ""
      ? numVal(mapped.taxable_value)
      : itemsTotal;

  const totalTaxAmount =
    mapped.total_tax_amount != null && mapped.total_tax_amount !== ""
      ? numVal(mapped.total_tax_amount)
      : gstSplit.total_tax_amount;

  const totalAmount =
    mapped.total_amount != null && mapped.total_amount !== ""
      ? numVal(mapped.total_amount)
      : numVal(mapped.BillAmount, taxableValue + totalTaxAmount);

  const totalQuantity =
    mapped.total_quantity != null && mapped.total_quantity !== ""
      ? numVal(mapped.total_quantity)
      : normalizedItems.reduce((sum, item) => sum + numVal(item.quantity), 0);

  const irn =
    strVal(mapped.irn) ||
    (companyId && invoiceNo ? `TALLY-${companyId}-${invoiceNo}` : null);

  const ackNo =
    strVal(mapped.ack_no) ||
    (companyId && invoiceNo ? `TALLY-ACK-${companyId}-${invoiceNo}` : "") ||
    (irn ? `ACK-${irn}` : null);

  return {
    body: {
      ...mapped,
      irn,
      ack_no: ackNo,
      ack_date: ackDate,
      invoice_no: invoiceNo,
      invoice_date: invoiceDate,
      delivery_note: nullifyOptional(mapped.delivery_note ?? mapped.Challanno),
      seller_name: strVal(mapped.seller_name, companyId || "Company"),
      seller_address: strVal(mapped.seller_address),
      seller_gstin: sellerGstin || "NA",
      seller_state: strVal(mapped.seller_state),
      seller_state_code: strVal(mapped.seller_state_code) || stateCodeFromGstin(sellerGstin),
      seller_cin: nullifyOptional(mapped.seller_cin),
      seller_email: nullifyOptional(mapped.seller_email),
      buyer_name: strVal(mapped.buyer_name ?? mapped.CustomerName, "Unknown Customer"),
      buyer_address: strVal(mapped.buyer_address),
      buyer_gstin: buyerGstin || "NA",
      buyer_state: strVal(mapped.buyer_state),
      buyer_state_code: strVal(mapped.buyer_state_code) || stateCodeFromGstin(buyerGstin),
      buyer_pan: nullifyOptional(mapped.buyer_pan),
      buyer_email: nullifyOptional(mapped.buyer_email),
      consignee_name: nullifyOptional(mapped.consignee_name),
      consignee_address: nullifyOptional(mapped.consignee_address),
      consignee_gstin: nullifyOptional(mapped.consignee_gstin),
      consignee_state: nullifyOptional(mapped.consignee_state),
      consignee_state_code: nullifyOptional(mapped.consignee_state_code),
      consignee_email: nullifyOptional(mapped.consignee_email),
      total_quantity: totalQuantity,
      taxable_value: taxableValue,
      igst_rate: numOrSplit(mapped.igst_rate, gstSplit.igst_rate),
      igst_amount: numOrSplit(mapped.igst_amount, gstSplit.igst_amount),
      cgst_rate: numOrSplit(mapped.cgst_rate, gstSplit.cgst_rate),
      cgst_amount: numOrSplit(mapped.cgst_amount, gstSplit.cgst_amount),
      sgst_rate: numOrSplit(mapped.sgst_rate, gstSplit.sgst_rate),
      sgst_amount: numOrSplit(mapped.sgst_amount, gstSplit.sgst_amount),
      total_tax_amount: totalTaxAmount,
      total_amount: totalAmount,
      eway_bill_no: nullifyOptional(mapped.eway_bill_no),
      mode_of_payment: nullifyOptional(mapped.mode_of_payment),
      reference_no: nullifyOptional(mapped.reference_no),
      reference_date: parseTallyDate(mapped.reference_date),
      buyers_order_no: nullifyOptional(mapped.buyers_order_no),
      other_references: nullifyOptional(mapped.other_references),
      dispatch_doc_no: nullifyOptional(mapped.dispatch_doc_no),
      delivery_note_date: parseTallyDate(mapped.delivery_note_date),
      dispatched_through: nullifyOptional(mapped.dispatched_through),
      destination: nullifyOptional(mapped.destination),
      bill_of_lading_no: nullifyOptional(mapped.bill_of_lading_no),
      motor_vehicle_no: nullifyOptional(mapped.motor_vehicle_no),
      terms_of_delivery: nullifyOptional(mapped.terms_of_delivery),
      amount_in_words: nullifyOptional(mapped.amount_in_words),
      tax_amount_in_words: nullifyOptional(mapped.tax_amount_in_words),
      bank_name: nullifyOptional(mapped.bank_name),
      bank_account_no: nullifyOptional(mapped.bank_account_no),
      bank_ifsc_branch: nullifyOptional(mapped.bank_ifsc_branch),
      declaration: nullifyOptional(mapped.declaration),
      authorised_signatory_name: nullifyOptional(mapped.authorised_signatory_name),
      authorised_signatory_designation: nullifyOptional(mapped.authorised_signatory_designation),
      issuing_signatory_name: nullifyOptional(mapped.issuing_signatory_name),
      issuing_signatory_designation: nullifyOptional(mapped.issuing_signatory_designation),
      jurisdiction: nullifyOptional(mapped.jurisdiction),
      invoice_type: nullifyOptional(mapped.invoice_type),
    },
    items: normalizedItems,
  };
}

export function mapTallyCreditNoteAliases(body = {}) {
  return {
    ...body,
    invoice_type: firstText(body.invoice_type, body.InvoiceType),
    irn: firstText(body.irn, body.IRN),
    ack_no: firstText(body.ack_no, body.AckNo),
    ack_date: firstText(body.ack_date, body.AckDate),
    credit_note_no: firstText(body.credit_note_no, body.CreditNoteNo),
    credit_note_date: firstText(body.credit_note_date, body.CreditNoteDate),
    eway_bill_no: firstText(body.eway_bill_no, body.EWayBillNo),
    original_invoice_no: firstText(body.original_invoice_no, body.InvoiceNo),
    original_invoice_date: firstText(body.original_invoice_date, body.InvoiceDate),
    buyers_order_no: firstText(body.buyers_order_no, body.BuyersOrderNo),
    other_references: firstText(body.other_references, body.OtherReferences),
    dispatch_doc_no: firstText(body.dispatch_doc_no, body.DispatchDocNo),
    dispatched_through: firstText(body.dispatched_through, body.DispatchedThrough),
    destination: firstText(body.destination, body.Destination),
    terms_of_delivery: firstText(body.terms_of_delivery, body.TermsOfDelivery),
    seller_name: firstText(body.seller_name, body.SellerName),
    seller_address: firstText(body.seller_address, body.SellerAddress),
    seller_gstin: firstText(body.seller_gstin, body.SellerGstin),
    seller_state: firstText(body.seller_state, body.SellerState),
    seller_state_code: firstText(body.seller_state_code, body.SellerStateCode),
    seller_cin: firstText(body.seller_cin, body.SellerCIN),
    seller_email: firstText(body.seller_email, body.SellerEmail),
    seller_pan: firstText(body.seller_pan, body.SellerPAN),
    consignee_name: firstText(body.consignee_name, body.ConsigneeName),
    consignee_address: firstText(body.consignee_address, body.ConsigneeAddress),
    consignee_gstin: firstText(body.consignee_gstin, body.ConsigneeGstin),
    consignee_state: firstText(body.consignee_state, body.ConsigneeState),
    consignee_state_code: firstText(body.consignee_state_code, body.ConsigneeStateCode),
    consignee_email: firstText(body.consignee_email, body.ConsigneeEmail),
    buyer_name: firstText(body.buyer_name, body.CustomerName),
    buyer_address: firstText(body.buyer_address, body.BuyerAddress),
    buyer_gstin: firstText(body.buyer_gstin, body.customergstin, body.BuyerGstin),
    buyer_state: firstText(body.buyer_state, body.BuyerState),
    buyer_state_code: firstText(body.buyer_state_code, body.BuyerStateCode),
    buyer_pan: firstText(body.buyer_pan, body.BuyerPAN),
    buyer_email: firstText(body.buyer_email, body.BuyerEmail),
    total_amount: firstNum(body.total_amount, body.BillAmount),
    taxable_value: firstNum(body.taxable_value, body.TaxableValue),
    total_quantity: firstNum(body.total_quantity, body.TotalQuantity),
    total_tax_amount: firstNum(body.total_tax_amount, body.TotalTaxAmount),
    cgst_rate: firstNum(body.cgst_rate, body.CGSTRate),
    cgst_amount: firstNum(body.cgst_amount, body.CGSTAmount),
    sgst_rate: firstNum(body.sgst_rate, body.SGSTRate),
    sgst_amount: firstNum(body.sgst_amount, body.SGSTAmount),
    igst_rate: firstNum(body.igst_rate, body.IGSTRate),
    igst_amount: firstNum(body.igst_amount, body.IGSTAmount),
    amount_in_words: firstText(body.amount_in_words, body.AmountInWords),
    tax_amount_in_words: firstText(body.tax_amount_in_words, body.TaxAmountInWords),
    authorised_signatory_name: firstText(body.authorised_signatory_name, body.AuthorisedSignatoryName),
    authorised_signatory_designation: firstText(
      body.authorised_signatory_designation,
      body.AuthorisedSignatoryDesignation
    ),
  };
}

/** Fill missing credit note header fields before Prisma create/update. */
export function normalizeCreditNotePayload(body = {}, items = [], gstDetails = [], companyId = "") {
  const mapped = mapTallyCreditNoteAliases(body);
  const normalizedItems = normalizeSalesItems(
    items.length ? items : mapped.items ?? mapped.BillItems
  );
  const gstRows = normalizePurchaseGstDetails(
    gstDetails.length ? gstDetails : mapped.gst_details ?? mapped.GstDetails
  );
  const gstSplit = splitSalesGstAmounts(gstRows);

  const creditNoteDate = parseTallyDate(mapped.credit_note_date) ?? new Date();
  const ackDate = parseTallyDate(mapped.ack_date) ?? creditNoteDate;
  const creditNoteNo = strVal(mapped.credit_note_no ?? mapped.CreditNoteNo);

  const buyerGstin = strVal(mapped.buyer_gstin ?? mapped.customergstin);
  const sellerGstin = strVal(mapped.seller_gstin);

  const itemsTotal = normalizedItems.reduce((sum, item) => sum + numVal(item.amount), 0);

  const taxableValue =
    mapped.taxable_value != null && mapped.taxable_value !== ""
      ? numVal(mapped.taxable_value)
      : itemsTotal;

  const totalTaxAmount =
    mapped.total_tax_amount != null && mapped.total_tax_amount !== ""
      ? numVal(mapped.total_tax_amount)
      : gstSplit.total_tax_amount;

  const totalAmount =
    mapped.total_amount != null && mapped.total_amount !== ""
      ? numVal(mapped.total_amount)
      : numVal(mapped.BillAmount, taxableValue + totalTaxAmount);

  const totalQuantity =
    mapped.total_quantity != null && mapped.total_quantity !== ""
      ? numVal(mapped.total_quantity)
      : normalizedItems.reduce((sum, item) => sum + numVal(item.quantity), 0);

  const irn =
    strVal(mapped.irn) ||
    (companyId && creditNoteNo ? `TALLY-${companyId}-${creditNoteNo}` : null);

  return {
    body: {
      ...mapped,
      invoice_type: nullifyOptional(mapped.invoice_type) || "Credit Note",
      irn,
      ack_no: nullifyOptional(mapped.ack_no),
      ack_date: ackDate,
      credit_note_no: creditNoteNo,
      credit_note_date: creditNoteDate,
      eway_bill_no: nullifyOptional(mapped.eway_bill_no),
      original_invoice_no: nullifyOptional(mapped.original_invoice_no ?? mapped.InvoiceNo),
      original_invoice_date: parseTallyDate(mapped.original_invoice_date ?? mapped.InvoiceDate),
      buyers_order_no: nullifyOptional(mapped.buyers_order_no),
      other_references: nullifyOptional(mapped.other_references),
      dispatch_doc_no: nullifyOptional(mapped.dispatch_doc_no),
      dispatched_through: nullifyOptional(mapped.dispatched_through),
      destination: nullifyOptional(mapped.destination),
      terms_of_delivery: nullifyOptional(mapped.terms_of_delivery),
      seller_name: strVal(mapped.seller_name, companyId || "Company"),
      seller_address: strVal(mapped.seller_address),
      seller_gstin: sellerGstin || "NA",
      seller_state: strVal(mapped.seller_state),
      seller_state_code: strVal(mapped.seller_state_code) || stateCodeFromGstin(sellerGstin),
      seller_cin: nullifyOptional(mapped.seller_cin),
      seller_email: nullifyOptional(mapped.seller_email),
      seller_pan: nullifyOptional(mapped.seller_pan),
      consignee_name: nullifyOptional(mapped.consignee_name),
      consignee_address: nullifyOptional(mapped.consignee_address),
      consignee_gstin: nullifyOptional(mapped.consignee_gstin),
      consignee_state: nullifyOptional(mapped.consignee_state),
      consignee_state_code: nullifyOptional(mapped.consignee_state_code),
      consignee_email: nullifyOptional(mapped.consignee_email),
      buyer_name: strVal(mapped.buyer_name ?? mapped.CustomerName, "Unknown Customer"),
      buyer_address: strVal(mapped.buyer_address),
      buyer_gstin: buyerGstin || "NA",
      buyer_state: strVal(mapped.buyer_state),
      buyer_state_code: strVal(mapped.buyer_state_code) || stateCodeFromGstin(buyerGstin),
      buyer_pan: nullifyOptional(mapped.buyer_pan),
      buyer_email: nullifyOptional(mapped.buyer_email),
      total_quantity: totalQuantity,
      taxable_value: taxableValue,
      igst_rate: numOrSplit(mapped.igst_rate, gstSplit.igst_rate),
      igst_amount: numOrSplit(mapped.igst_amount, gstSplit.igst_amount),
      cgst_rate: numOrSplit(mapped.cgst_rate, gstSplit.cgst_rate),
      cgst_amount: numOrSplit(mapped.cgst_amount, gstSplit.cgst_amount),
      sgst_rate: numOrSplit(mapped.sgst_rate, gstSplit.sgst_rate),
      sgst_amount: numOrSplit(mapped.sgst_amount, gstSplit.sgst_amount),
      total_tax_amount: totalTaxAmount,
      total_amount: totalAmount,
      authorised_signatory_name: nullifyOptional(mapped.authorised_signatory_name),
      authorised_signatory_designation: nullifyOptional(mapped.authorised_signatory_designation),
    },
    items: normalizedItems,
  };
}

export function mapTallyDebitNoteAliases(body = {}) {
  return {
    ...body,
    debit_note_no: firstText(body.debit_note_no, body.DebitNoteNo),
    debit_note_date: firstText(body.debit_note_date, body.DebitNoteDate),
    original_invoice_no: firstText(body.original_invoice_no, body.PurchaseNo),
    original_invoice_date: firstText(body.original_invoice_date, body.PurchaseDate),
    other_references: firstText(body.other_references, body.OtherReferences),
    seller_name: firstText(body.seller_name, body.VendorName),
    seller_address: firstText(body.seller_address, body.VendorAddress),
    seller_gstin: firstText(body.seller_gstin, body.Vendorgstin),
    seller_state: firstText(body.seller_state, body.VendorState),
    seller_state_code: firstText(body.seller_state_code, body.VendorStateCode),
    seller_cin: firstText(body.seller_cin, body.VendorCIN),
    seller_email: firstText(body.seller_email, body.VendorEmail),
    seller_pan: firstText(body.seller_pan, body.VendorPAN),
    consignee_name: firstText(body.consignee_name, body.ConsigneeName),
    consignee_address: firstText(body.consignee_address, body.ConsigneeAddress),
    consignee_gstin: firstText(body.consignee_gstin, body.ConsigneeGstin),
    consignee_state: firstText(body.consignee_state, body.ConsigneeState),
    consignee_state_code: firstText(body.consignee_state_code, body.ConsigneeStateCode),
    consignee_email: firstText(body.consignee_email, body.ConsigneeEmail),
    buyer_name: firstText(body.buyer_name, body.BuyerName, body.CustomerName),
    buyer_address: firstText(body.buyer_address, body.BuyerAddress),
    buyer_gstin: firstText(body.buyer_gstin, body.BuyerGstin, body.customergstin),
    buyer_state: firstText(body.buyer_state, body.BuyerState),
    buyer_state_code: firstText(body.buyer_state_code, body.BuyerStateCode),
    buyer_pan: firstText(body.buyer_pan, body.BuyerPAN),
    buyer_email: firstText(body.buyer_email, body.BuyerEmail),
    total_amount: firstNum(body.total_amount, body.DebitNoteAmount),
    taxable_value: firstNum(body.taxable_value, body.TaxableValue),
    total_quantity: firstNum(body.total_quantity, body.TotalQuantity),
    total_tax_amount: firstNum(body.total_tax_amount, body.TotalTaxAmount),
    cgst_rate: firstNum(body.cgst_rate, body.CGSTRate),
    cgst_amount: firstNum(body.cgst_amount, body.CGSTAmount),
    sgst_rate: firstNum(body.sgst_rate, body.SGSTRate),
    sgst_amount: firstNum(body.sgst_amount, body.SGSTAmount),
    igst_rate: firstNum(body.igst_rate, body.IGSTRate),
    igst_amount: firstNum(body.igst_amount, body.IGSTAmount),
    amount_in_words: firstText(body.amount_in_words, body.AmountInWords),
    authorised_signatory_name: firstText(body.authorised_signatory_name, body.AuthorisedSignatoryName),
    authorised_signatory_designation: firstText(
      body.authorised_signatory_designation,
      body.AuthorisedSignatoryDesignation
    ),
  };
}

/** Fill missing debit note header fields before Prisma create/update. */
export function normalizeDebitNotePayload(body = {}, items = [], gstDetails = [], companyId = "") {
  const mapped = mapTallyDebitNoteAliases(body);
  const normalizedItems = normalizePurchaseItems(
    items.length ? items : mapped.items ?? mapped.PurchaseItems
  );
  const gstRows = normalizePurchaseGstDetails(
    gstDetails.length ? gstDetails : mapped.gst_details ?? mapped.GstDetails
  );
  const gstSplit = splitSalesGstAmounts(gstRows);

  const debitNoteDate = parseTallyDate(mapped.debit_note_date) ?? new Date();
  const debitNoteNo = strVal(mapped.debit_note_no ?? mapped.DebitNoteNo);

  const sellerGstin = strVal(mapped.seller_gstin ?? mapped.Vendorgstin);
  const buyerGstin = strVal(mapped.buyer_gstin);

  const itemsTotal = normalizedItems.reduce((sum, item) => sum + numVal(item.amount), 0);

  const taxableValue =
    mapped.taxable_value != null && mapped.taxable_value !== ""
      ? numVal(mapped.taxable_value)
      : itemsTotal;

  const totalTaxAmount =
    mapped.total_tax_amount != null && mapped.total_tax_amount !== ""
      ? numVal(mapped.total_tax_amount)
      : gstSplit.total_tax_amount;

  const totalAmount =
    mapped.total_amount != null && mapped.total_amount !== ""
      ? numVal(mapped.total_amount)
      : numVal(mapped.DebitNoteAmount, taxableValue + totalTaxAmount);

  const totalQuantity =
    mapped.total_quantity != null && mapped.total_quantity !== ""
      ? numVal(mapped.total_quantity)
      : normalizedItems.reduce((sum, item) => sum + numVal(item.quantity), 0);

  return {
    body: {
      ...mapped,
      debit_note_no: debitNoteNo,
      debit_note_date: debitNoteDate,
      original_invoice_no: nullifyOptional(mapped.original_invoice_no ?? mapped.PurchaseNo),
      original_invoice_date: parseTallyDate(mapped.original_invoice_date ?? mapped.PurchaseDate),
      other_references: nullifyOptional(mapped.other_references),
      seller_name: strVal(mapped.seller_name ?? mapped.VendorName, "Unknown Vendor"),
      seller_address: strVal(mapped.seller_address),
      seller_gstin: sellerGstin || "NA",
      seller_state: strVal(mapped.seller_state),
      seller_state_code: strVal(mapped.seller_state_code) || stateCodeFromGstin(sellerGstin),
      seller_cin: nullifyOptional(mapped.seller_cin),
      seller_email: nullifyOptional(mapped.seller_email),
      seller_pan: nullifyOptional(mapped.seller_pan),
      consignee_name: nullifyOptional(mapped.consignee_name),
      consignee_address: nullifyOptional(mapped.consignee_address),
      consignee_gstin: nullifyOptional(mapped.consignee_gstin),
      consignee_state: nullifyOptional(mapped.consignee_state),
      consignee_state_code: nullifyOptional(mapped.consignee_state_code),
      consignee_email: nullifyOptional(mapped.consignee_email),
      buyer_name: strVal(mapped.buyer_name, companyId || "Company"),
      buyer_address: strVal(mapped.buyer_address),
      buyer_gstin: buyerGstin || "NA",
      buyer_state: strVal(mapped.buyer_state),
      buyer_state_code: strVal(mapped.buyer_state_code) || stateCodeFromGstin(buyerGstin),
      buyer_pan: nullifyOptional(mapped.buyer_pan),
      buyer_email: nullifyOptional(mapped.buyer_email),
      total_quantity: totalQuantity,
      taxable_value: taxableValue,
      igst_rate: numOrSplit(mapped.igst_rate, gstSplit.igst_rate),
      igst_amount: numOrSplit(mapped.igst_amount, gstSplit.igst_amount),
      cgst_rate: numOrSplit(mapped.cgst_rate, gstSplit.cgst_rate),
      cgst_amount: numOrSplit(mapped.cgst_amount, gstSplit.cgst_amount),
      sgst_rate: numOrSplit(mapped.sgst_rate, gstSplit.sgst_rate),
      sgst_amount: numOrSplit(mapped.sgst_amount, gstSplit.sgst_amount),
      total_tax_amount: totalTaxAmount,
      total_amount: totalAmount,
      amount_in_words: nullifyOptional(mapped.amount_in_words),
      authorised_signatory_name: nullifyOptional(mapped.authorised_signatory_name),
      authorised_signatory_designation: nullifyOptional(mapped.authorised_signatory_designation),
    },
    items: normalizedItems,
  };
}

export function mapTallyLedgerVoucherAliases(body = {}) {
  return {
    ...body,
    voucher_no: firstText(body.voucher_no, body.VoucherNo),
    voucher_date: firstText(body.voucher_date, body.VoucherDate),
    voucher_type: firstText(body.voucher_type, body.VoucherType),
    narration: firstText(body.narration, body.Narration),
    payment_type: firstText(body.payment_type, body.PaymentType),
    payment_mode: firstText(body.payment_mode, body.PaymentMode),
    on_account_of: firstText(body.on_account_of, body.OnAccountOf),
    from_company_name: firstText(body.from_company_name, body.FromCompanyName),
    from_company_address: firstText(body.from_company_address, body.FromCompanyAddress),
    from_company_gstin: firstText(body.from_company_gstin, body.FromCompanyGstin),
    payee_type: firstText(body.payee_type, body.PayeeType),
    party_name: firstText(body.party_name, body.PartyName),
    party_gstin: firstText(body.party_gstin, body.PartyGstin),
    party_address: firstText(body.party_address, body.PartyAddress),
    linked_document_type: firstText(body.linked_document_type, body.LinkedDocumentType),
    linked_document_no: firstText(body.linked_document_no, body.LinkedDocumentNo),
    linked_document_id: firstNum(body.linked_document_id, body.LinkedDocumentId),
    linked_document_amount: firstNum(body.linked_document_amount, body.LinkedDocumentAmount),
    bank_name: firstText(body.bank_name, body.BankName),
    bank_account_no: firstText(body.bank_account_no, body.BankAccountNo),
    bank_ifsc: firstText(body.bank_ifsc, body.BankIfsc),
    reference_no: firstText(body.reference_no, body.ReferenceNo),
    cheque_no: firstText(body.cheque_no, body.ChequeNo),
    cheque_date: firstText(body.cheque_date, body.ChequeDate),
    company_name: firstText(body.company_name, body.CompanyName),
    company_address: firstText(body.company_address, body.CompanyAddress),
    company_state: firstText(body.company_state, body.CompanyState),
    company_state_code: firstText(body.company_state_code, body.CompanyStateCode),
    company_cin: firstText(body.company_cin, body.CompanyCIN),
    company_email: firstText(body.company_email, body.CompanyEmail),
    payee_name: firstText(body.payee_name, body.PayeeName),
    payee_address: firstText(body.payee_address, body.PayeeAddress),
    payee_state: firstText(body.payee_state, body.PayeeState),
    payee_state_code: firstText(body.payee_state_code, body.PayeeStateCode),
    payee_gstin: firstText(body.payee_gstin, body.PayeeGstin),
    payee_email: firstText(body.payee_email, body.PayeeEmail),
    payee_designation: firstText(body.payee_designation, body.PayeeDesignation),
    authorised_signatory_name: firstText(body.authorised_signatory_name, body.AuthorisedSignatoryName),
    authorised_signatory_designation: firstText(
      body.authorised_signatory_designation,
      body.AuthorisedSignatoryDesignation
    ),
  };
}

export function normalizePaymentAllocations(rows = []) {
  if (!Array.isArray(rows)) return [];

  return rows
    .filter((row) => row && typeof row === "object")
    .map((row) => ({
      document_type: strVal(firstText(row.document_type, row.documentType), "PURCHASE"),
      document_id: numVal(firstNum(row.document_id, row.documentId)),
      document_no: nullifyOptional(firstText(row.document_no, row.documentNo)),
      document_amount: numVal(firstNum(row.document_amount, row.documentAmount)),
      paid_amount: numVal(firstNum(row.paid_amount, row.paidAmount)),
      allocation_type: strVal(firstText(row.allocation_type, row.allocationType), "PARTIAL"),
      remarks: nullifyOptional(row.remarks),
    }))
    .filter((row) => row.document_id > 0);
}

export function normalizeTallyLedgerEntries(debitLedgers = [], creditLedgers = []) {
  const debits = Array.isArray(debitLedgers) ? debitLedgers : [];
  const credits = Array.isArray(creditLedgers) ? creditLedgers : [];

  const debitEntries = debits.map((row) => ({
    particulars: strVal(row.particulars ?? row.LedgerName, "Ledger"),
    debit_amount: numVal(row.debit_amount ?? row.Amount ?? row.amount),
    credit_amount: null,
    entry_type: "Dr",
  }));

  const creditEntries = credits.map((row) => ({
    particulars: strVal(row.particulars ?? row.LedgerName, "Ledger"),
    debit_amount: null,
    credit_amount: numVal(row.credit_amount ?? row.Amount ?? row.amount),
    entry_type: "Cr",
  }));

  return [...debitEntries, ...creditEntries];
}

function sumLedgerEntries(entries = [], entryType, amountField) {
  return entries
    .filter((entry) => entry.entry_type === entryType)
    .reduce((sum, entry) => sum + numVal(entry[amountField]), 0);
}

/** Fill missing payment voucher fields before Prisma create/update. */
export function normalizePaymentPayload(
  body = {},
  debitLedgers = [],
  creditLedgers = [],
  existingEntries = []
) {
  const mapped = mapTallyLedgerVoucherAliases(body);
  const entries = existingEntries.length
    ? existingEntries
    : normalizeTallyLedgerEntries(
        debitLedgers.length ? debitLedgers : mapped.DebitLedgers,
        creditLedgers.length ? creditLedgers : mapped.CreditLedgers
      );

  const totalDebit = sumLedgerEntries(entries, "Dr", "debit_amount");
  const totalCredit = sumLedgerEntries(entries, "Cr", "credit_amount");
  const debitRows = entries.filter((entry) => entry.entry_type === "Dr");
  const creditRows = entries.filter((entry) => entry.entry_type === "Cr");

  return {
    body: {
      ...mapped,
      voucher_no: strVal(mapped.voucher_no ?? mapped.VoucherNo),
      voucher_date: parseTallyDate(mapped.voucher_date) ?? new Date(),
      payment_type: strVal(mapped.payment_type, "GENERAL"),
      payment_mode: strVal(mapped.payment_mode, "BANK"),
      narration: nullifyOptional(mapped.narration ?? mapped.Narration),
      on_account_of: nullifyOptional(mapped.on_account_of),
      from_company_name: nullifyOptional(mapped.from_company_name),
      from_company_address: nullifyOptional(mapped.from_company_address),
      from_company_gstin: nullifyOptional(mapped.from_company_gstin),
      payee_type: strVal(mapped.payee_type, "COMPANY"),
      party_name: nullifyOptional(mapped.party_name ?? debitRows[0]?.particulars),
      party_gstin: nullifyOptional(mapped.party_gstin),
      party_address: nullifyOptional(mapped.party_address),
      linked_document_type: nullifyOptional(mapped.linked_document_type),
      linked_document_no: nullifyOptional(mapped.linked_document_no),
      bank_name: nullifyOptional(mapped.bank_name ?? creditRows[0]?.particulars),
      bank_account_no: nullifyOptional(mapped.bank_account_no),
      bank_ifsc: nullifyOptional(mapped.bank_ifsc),
      reference_no: nullifyOptional(mapped.reference_no),
      cheque_no: nullifyOptional(mapped.cheque_no),
      cheque_date: parseTallyDate(mapped.cheque_date),
      authorised_signatory_name: nullifyOptional(mapped.authorised_signatory_name),
      authorised_signatory_designation: nullifyOptional(mapped.authorised_signatory_designation),
    },
    entries,
    totalDebit,
    totalCredit,
  };
}

export function mapTallyDeliveryChallanAliases(body = {}) {
  return {
    ...body,
    challan_no: firstText(body.challan_no, body.Challanno, body.challanno),
    challan_date: firstText(body.challan_date, body.Challandate, body.challandate),
    reference_no: firstText(body.reference_no, body.ReferenceNo),
    reference_date: firstText(body.reference_date, body.ReferenceDate),
    invoice_no: firstText(body.invoice_no, body.InvoiceNo),
    invoice_date: firstText(body.invoice_date, body.InvoiceDate),
    buyers_order_no: firstText(body.buyers_order_no, body.BuyersOrderNo),
    buyers_order_date: firstText(body.buyers_order_date, body.BuyersOrderDate),
    dispatch_doc_no: firstText(body.dispatch_doc_no, body.DispatchDocNo),
    dispatched_through: firstText(body.dispatched_through, body.DispatchedThrough),
    destination: firstText(body.destination, body.Destination),
    motor_vehicle_no: firstText(body.motor_vehicle_no, body.MotorVehicleNo),
    bill_of_lading_no: firstText(body.bill_of_lading_no, body.BillOfLadingNo),
    terms_of_delivery: firstText(body.terms_of_delivery, body.TermsOfDelivery),
    policy_no: firstText(body.policy_no, body.PolicyNo),
    place_of_supply: firstText(body.place_of_supply, body.PlaceOfSupply),
    seller_name: firstText(body.seller_name, body.SellerName),
    seller_address: firstText(body.seller_address, body.SellerAddress),
    seller_gstin: firstText(body.seller_gstin, body.SellerGstin),
    seller_state: firstText(body.seller_state, body.SellerState),
    seller_state_code: firstText(body.seller_state_code, body.SellerStateCode),
    seller_email: firstText(body.seller_email, body.SellerEmail),
    seller_cin: firstText(body.seller_cin, body.SellerCIN),
    seller_pan: firstText(body.seller_pan, body.SellerPAN),
    buyer_name: firstText(body.buyer_name, body.CustomerName),
    buyer_address: firstText(body.buyer_address, body.BuyerAddress),
    buyer_gstin: firstText(body.buyer_gstin, body.customergstin, body.BuyerGstin),
    buyer_state: firstText(body.buyer_state, body.BuyerState),
    buyer_state_code: firstText(body.buyer_state_code, body.BuyerStateCode),
    buyer_email: firstText(body.buyer_email, body.BuyerEmail),
    total_amount: firstNum(body.total_amount, body.Challanamount, body.challanamount),
    taxable_value: firstNum(body.taxable_value, body.TaxableValue),
    total_quantity: firstNum(body.total_quantity, body.TotalQuantity),
    total_tax_amount: firstNum(body.total_tax_amount, body.TotalTaxAmount),
    cgst_rate: firstNum(body.cgst_rate, body.CGSTRate),
    cgst_amount: firstNum(body.cgst_amount, body.CGSTAmount),
    sgst_rate: firstNum(body.sgst_rate, body.SGSTRate),
    sgst_amount: firstNum(body.sgst_amount, body.SGSTAmount),
    igst_rate: firstNum(body.igst_rate, body.IGSTRate),
    igst_amount: firstNum(body.igst_amount, body.IGSTAmount),
    amount_in_words: firstText(body.amount_in_words, body.AmountInWords),
    authorised_signatory_name: firstText(body.authorised_signatory_name, body.AuthorisedSignatoryName),
    authorised_signatory_designation: firstText(
      body.authorised_signatory_designation,
      body.AuthorisedSignatoryDesignation
    ),
  };
}

/** Fill missing delivery challan header fields before Prisma create/update. */
export function normalizeDeliveryChallanPayload(
  body = {},
  items = [],
  gstDetails = [],
  companyId = ""
) {
  const mapped = mapTallyDeliveryChallanAliases(body);
  const normalizedItems = normalizeSalesItems(
    items.length ? items : mapped.items ?? mapped.challanitems ?? mapped.Challanitems
  );
  const gstRows = normalizePurchaseGstDetails(
    gstDetails.length ? gstDetails : mapped.gst_details ?? mapped.GstDetails
  );
  const gstSplit = splitSalesGstAmounts(gstRows);

  const challanDate = parseTallyDate(mapped.challan_date) ?? new Date();
  const challanNo = strVal(mapped.challan_no ?? mapped.Challanno);

  const buyerGstin = strVal(mapped.buyer_gstin ?? mapped.customergstin);
  const sellerGstin = strVal(mapped.seller_gstin);

  const itemsTotal = normalizedItems.reduce((sum, item) => sum + numVal(item.amount), 0);

  const taxableValue =
    mapped.taxable_value != null && mapped.taxable_value !== ""
      ? numVal(mapped.taxable_value)
      : itemsTotal;

  const totalTaxAmount =
    mapped.total_tax_amount != null && mapped.total_tax_amount !== ""
      ? numVal(mapped.total_tax_amount)
      : gstSplit.total_tax_amount;

  const totalAmount =
    mapped.total_amount != null && mapped.total_amount !== ""
      ? numVal(mapped.total_amount)
      : numVal(mapped.Challanamount, taxableValue + totalTaxAmount);

  const totalQuantity =
    mapped.total_quantity != null && mapped.total_quantity !== ""
      ? numVal(mapped.total_quantity)
      : normalizedItems.reduce((sum, item) => sum + numVal(item.quantity), 0);

  return {
    body: {
      ...mapped,
      challan_no: challanNo,
      challan_date: challanDate,
      reference_no: nullifyOptional(mapped.reference_no),
      reference_date: parseTallyDate(mapped.reference_date),
      invoice_no: nullifyOptional(mapped.invoice_no),
      invoice_date: parseTallyDate(mapped.invoice_date),
      buyers_order_no: nullifyOptional(mapped.buyers_order_no),
      buyers_order_date: parseTallyDate(mapped.buyers_order_date),
      dispatch_doc_no: nullifyOptional(mapped.dispatch_doc_no),
      dispatched_through: nullifyOptional(mapped.dispatched_through),
      destination: nullifyOptional(mapped.destination),
      motor_vehicle_no: nullifyOptional(mapped.motor_vehicle_no),
      bill_of_lading_no: nullifyOptional(mapped.bill_of_lading_no),
      terms_of_delivery: nullifyOptional(mapped.terms_of_delivery),
      policy_no: nullifyOptional(mapped.policy_no),
      place_of_supply: nullifyOptional(mapped.place_of_supply),
      seller_name: strVal(mapped.seller_name, companyId || "Company"),
      seller_address: strVal(mapped.seller_address),
      seller_gstin: sellerGstin || "NA",
      seller_state: strVal(mapped.seller_state),
      seller_state_code: strVal(mapped.seller_state_code) || stateCodeFromGstin(sellerGstin),
      seller_cin: nullifyOptional(mapped.seller_cin),
      seller_email: nullifyOptional(mapped.seller_email),
      seller_pan: nullifyOptional(mapped.seller_pan),
      buyer_name: strVal(mapped.buyer_name ?? mapped.CustomerName, "Unknown Customer"),
      buyer_address: strVal(mapped.buyer_address),
      buyer_gstin: buyerGstin || "NA",
      buyer_state: nullifyOptional(mapped.buyer_state),
      buyer_state_code: nullifyOptional(mapped.buyer_state_code) || stateCodeFromGstin(buyerGstin),
      buyer_email: nullifyOptional(mapped.buyer_email),
      total_quantity: totalQuantity,
      taxable_value: taxableValue,
      igst_rate: numOrSplit(mapped.igst_rate, gstSplit.igst_rate),
      igst_amount: numOrSplit(mapped.igst_amount, gstSplit.igst_amount),
      cgst_rate: numOrSplit(mapped.cgst_rate, gstSplit.cgst_rate),
      cgst_amount: numOrSplit(mapped.cgst_amount, gstSplit.cgst_amount),
      sgst_rate: numOrSplit(mapped.sgst_rate, gstSplit.sgst_rate),
      sgst_amount: numOrSplit(mapped.sgst_amount, gstSplit.sgst_amount),
      total_tax_amount: totalTaxAmount,
      total_amount: totalAmount,
      amount_in_words: nullifyOptional(mapped.amount_in_words),
      authorised_signatory_name: nullifyOptional(mapped.authorised_signatory_name),
      authorised_signatory_designation: nullifyOptional(mapped.authorised_signatory_designation),
    },
    items: normalizedItems,
  };
}

/** Fill missing journal/expense voucher fields before Prisma create/update. */
export function normalizeJournalVoucherPayload(
  body = {},
  debitLedgers = [],
  creditLedgers = [],
  existingEntries = [],
  companyId = ""
) {
  const ledgerPayload = normalizePaymentPayload(body, debitLedgers, creditLedgers, existingEntries);
  const mapped = ledgerPayload.body;

  return {
    body: {
      voucher_no: mapped.voucher_no,
      voucher_date: mapped.voucher_date,
      voucher_type: strVal(mapped.voucher_type, "Journal Voucher"),
      company_name: strVal(mapped.company_name, companyId || "Company"),
      company_address: strVal(mapped.company_address),
      company_state: strVal(mapped.company_state),
      company_state_code: strVal(mapped.company_state_code),
      company_cin: nullifyOptional(mapped.company_cin),
      company_email: nullifyOptional(mapped.company_email),
      payee_type: strVal(mapped.payee_type, "COMPANY"),
      payee_name: nullifyOptional(
        mapped.payee_name ?? ledgerPayload.entries.find((e) => e.entry_type === "Dr")?.particulars
      ),
      payee_address: nullifyOptional(mapped.payee_address),
      payee_state: nullifyOptional(mapped.payee_state),
      payee_state_code: nullifyOptional(mapped.payee_state_code),
      payee_gstin: nullifyOptional(mapped.payee_gstin),
      payee_email: nullifyOptional(mapped.payee_email),
      payee_designation: nullifyOptional(mapped.payee_designation),
      narration: mapped.narration,
      on_account_of: nullifyOptional(mapped.on_account_of),
      total_debit: ledgerPayload.totalDebit,
      total_credit: ledgerPayload.totalCredit,
      authorised_signatory_name: nullifyOptional(mapped.authorised_signatory_name),
      authorised_signatory_designation: nullifyOptional(mapped.authorised_signatory_designation),
    },
    entries: ledgerPayload.entries,
    totalDebit: ledgerPayload.totalDebit,
    totalCredit: ledgerPayload.totalCredit,
  };
}
