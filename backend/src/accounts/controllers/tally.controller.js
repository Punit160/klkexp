import { PrismaClient } from "@prisma/client";
import { DATA_STATUS_APP } from "../constants/dataStatus.js";
import { splitBankIfscBranch } from "../utils/tallyPayloadUtils.js";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Settings — change here if Tally rules change
// ---------------------------------------------------------------------------
/**
 * App → Tally export queue:
 * Senior clicks "Push to Tally" → tally_push_status=PUSHED, data_status=1
 * Tally GET fetches these records. Tally POST imports (data_status=2) are excluded.
 */
function getTallyWhere(req) {
  return {
    approval_status: "APPROVED",
    tally_push_status: "PUSHED",
    data_status: DATA_STATUS_APP,
    company_id: req.tally_company_id,
  };
}

async function buildTallyQueueHint(model, company_id) {
  const base = { company_id };
  const [total, approved, pushed, appCreated, inQueue, tallyImported] = await Promise.all([
    prisma[model].count({ where: base }),
    prisma[model].count({ where: { ...base, approval_status: "APPROVED" } }),
    prisma[model].count({ where: { ...base, tally_push_status: "PUSHED" } }),
    prisma[model].count({ where: { ...base, data_status: DATA_STATUS_APP } }),
    prisma[model].count({
      where: {
        ...base,
        approval_status: "APPROVED",
        tally_push_status: "PUSHED",
        data_status: DATA_STATUS_APP,
      },
    }),
    prisma[model].count({ where: { ...base, data_status: 2 } }),
  ]);

  const reasons = [];
  if (total === 0) {
    reasons.push(`No records exist for company_id=${company_id}`);
  } else {
    if (approved === 0) reasons.push("None are APPROVED yet (Approve in portal first)");
    if (pushed === 0) {
      reasons.push(
        "None have tally_push_status=PUSHED (NOT_PUSHED means still waiting — click Push to Tally)"
      );
    }
    if (pushed > 0 && inQueue === 0) {
      reasons.push(
        "Some are PUSHED but not in queue — check approval_status=APPROVED and data_status=1 (Tally POST imports with data_status=2 are excluded)"
      );
    }
  }

  return {
    hint:
      reasons.join(". ") ||
      "No records in Tally export queue. Create in KLK app → Approve → Senior clicks 'Push to Tally'.",
    queue_filter: {
      company_id,
      approval_status: "APPROVED",
      tally_push_status: "PUSHED",
      data_status: 1,
    },
    counts: {
      total,
      approved,
      pushed,
      app_created_data_status_1: appCreated,
      tally_imported_data_status_2: tallyImported,
      in_export_queue: inQueue,
    },
  };
}

function tallyListResponse(rows, mapper, emptyMeta = null) {
  const data = rows.map(mapper);
  if (!data.length) {
    return {
      data,
      hint:
        emptyMeta?.hint ||
        "No records in Tally export queue. Create in KLK app → Approve → Senior clicks 'Push to Tally'. Records imported via Tally POST (data_status=2) are excluded from GET.",
      ...(emptyMeta?.queue_filter && { queue_filter: emptyMeta.queue_filter }),
      ...(emptyMeta?.counts && { counts: emptyMeta.counts }),
    };
  }
  return { data };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ---------------------------------------------------------------------------
// Helpers — format DB row to Tally JSON
// ---------------------------------------------------------------------------
function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${MONTHS[date.getMonth()]}/${date.getFullYear()}`;
}

function text(value) {
  if (value === undefined || value === null) return "";
  return String(value);
}

function money(value) {
  return Number(value) || 0;
}

function mapItems(items = []) {
  return [...items]
    .sort((a, b) => (a.sl_no ?? a.id ?? 0) - (b.sl_no ?? b.id ?? 0))
    .map((item) => ({
      itemname: item.description || "",
      hsn_sac: item.hsn_sac || "",
      quantity: money(item.quantity),
      unit: item.unit || "",
      rate: money(item.rate),
      per: item.per || item.unit || "",
      amount: money(item.amount),
    }));
}

function mapTallyMeta(row) {
  return {
    DataSource: Number(row.data_status) === 2 ? "Tally" : "Software",
    TallyPushStatus: row.tally_push_status || "NOT_PUSHED",
  };
}

function mapGstDetails(record) {
  if (record.gst_details?.length) {
    return record.gst_details.map((row) => ({
      LedgerName: row.ledger_name || "",
      rate: money(row.rate),
      amount: money(row.amount),
    }));
  }

  const rows = [];
  const push = (name, rate, amount) => {
    if (money(amount) > 0 || money(rate) > 0) {
      rows.push({ LedgerName: name, rate: money(rate), amount: money(amount) });
    }
  };
  push("CGST", record.cgst_rate, record.cgst_amount);
  push("SGST", record.sgst_rate, record.sgst_amount);
  push("IGST", record.igst_rate, record.igst_amount);
  return rows;
}

function mapSignatory(row) {
  return {
    AuthorisedSignatoryName: text(row.authorised_signatory_name),
    AuthorisedSignatoryDesignation: text(row.authorised_signatory_designation),
  };
}

function mapLedgers(entries = []) {
  const sorted = [...entries].sort((a, b) => (a.sl_no || 0) - (b.sl_no || 0));
  return {
    DebitLedgers: sorted
      .filter((e) => e.entry_type === "Dr")
      .map((e) => ({ LedgerName: e.particulars || "", Amount: Number(e.debit_amount) || 0 })),
    CreditLedgers: sorted
      .filter((e) => e.entry_type === "Cr")
      .map((e) => ({ LedgerName: e.particulars || "", Amount: Number(e.credit_amount) || 0 })),
  };
}

function mapCreditNote(row) {
  return {
    id: row.id,
    company_id: row.company_id || "",
    ...mapTallyMeta(row),
    InvoiceType: row.invoice_type || "Credit Note",
    IRN: text(row.irn),
    AckNo: text(row.ack_no),
    AckDate: formatDate(row.ack_date),
    CreditNoteNo: text(row.credit_note_no),
    CreditNoteDate: formatDate(row.credit_note_date),
    InvoiceNo: text(row.original_invoice_no),
    InvoiceDate: formatDate(row.original_invoice_date),
    EWayBillNo: text(row.eway_bill_no),
    BuyersOrderNo: text(row.buyers_order_no),
    OtherReferences: text(row.other_references),
    DispatchDocNo: text(row.dispatch_doc_no),
    DispatchedThrough: text(row.dispatched_through),
    Destination: text(row.destination),
    TermsOfDelivery: text(row.terms_of_delivery),
    SellerName: text(row.seller_name),
    SellerAddress: text(row.seller_address),
    SellerGstin: text(row.seller_gstin),
    SellerState: text(row.seller_state),
    SellerStateCode: text(row.seller_state_code),
    SellerCIN: text(row.seller_cin),
    SellerEmail: text(row.seller_email),
    SellerPAN: text(row.seller_pan),
    ConsigneeName: text(row.consignee_name),
    ConsigneeAddress: text(row.consignee_address),
    ConsigneeGstin: text(row.consignee_gstin),
    ConsigneeState: text(row.consignee_state),
    ConsigneeStateCode: text(row.consignee_state_code),
    ConsigneeEmail: text(row.consignee_email),
    CustomerName: text(row.buyer_name),
    BuyerAddress: text(row.buyer_address),
    customergstin: text(row.buyer_gstin),
    BuyerState: text(row.buyer_state),
    BuyerStateCode: text(row.buyer_state_code),
    BuyerPAN: text(row.buyer_pan),
    BuyerEmail: text(row.buyer_email),
    BillAmount: money(row.total_amount),
    TaxableValue: money(row.taxable_value),
    TotalQuantity: money(row.total_quantity),
    TotalTaxAmount: money(row.total_tax_amount),
    CGSTRate: money(row.cgst_rate),
    CGSTAmount: money(row.cgst_amount),
    SGSTRate: money(row.sgst_rate),
    SGSTAmount: money(row.sgst_amount),
    IGSTRate: money(row.igst_rate),
    IGSTAmount: money(row.igst_amount),
    AmountInWords: text(row.amount_in_words),
    TaxAmountInWords: text(row.tax_amount_in_words),
    ...mapSignatory(row),
    BillItems: mapItems(row.items),
    GstDetails: mapGstDetails(row),
  };
}

function mapDebitNote(row) {
  return {
    id: row.id,
    company_id: row.company_id || "",
    ...mapTallyMeta(row),
    DebitNoteNo: text(row.debit_note_no),
    DebitNoteDate: formatDate(row.debit_note_date),
    PurchaseNo: text(row.original_invoice_no),
    PurchaseDate: formatDate(row.original_invoice_date),
    OtherReferences: text(row.other_references),
    VendorName: text(row.seller_name),
    VendorAddress: text(row.seller_address),
    Vendorgstin: text(row.seller_gstin),
    VendorState: text(row.seller_state),
    VendorStateCode: text(row.seller_state_code),
    VendorCIN: text(row.seller_cin),
    VendorEmail: text(row.seller_email),
    VendorPAN: text(row.seller_pan),
    ConsigneeName: text(row.consignee_name),
    ConsigneeAddress: text(row.consignee_address),
    ConsigneeGstin: text(row.consignee_gstin),
    ConsigneeState: text(row.consignee_state),
    ConsigneeStateCode: text(row.consignee_state_code),
    ConsigneeEmail: text(row.consignee_email),
    BuyerName: text(row.buyer_name),
    BuyerAddress: text(row.buyer_address),
    BuyerGstin: text(row.buyer_gstin),
    BuyerState: text(row.buyer_state),
    BuyerStateCode: text(row.buyer_state_code),
    BuyerPAN: text(row.buyer_pan),
    BuyerEmail: text(row.buyer_email),
    DebitNoteAmount: money(row.total_amount),
    TaxableValue: money(row.taxable_value),
    TotalQuantity: money(row.total_quantity),
    TotalTaxAmount: money(row.total_tax_amount),
    CGSTRate: money(row.cgst_rate),
    CGSTAmount: money(row.cgst_amount),
    SGSTRate: money(row.sgst_rate),
    SGSTAmount: money(row.sgst_amount),
    IGSTRate: money(row.igst_rate),
    IGSTAmount: money(row.igst_amount),
    AmountInWords: text(row.amount_in_words),
    ...mapSignatory(row),
    PurchaseItems: mapItems(row.items),
    GstDetails: mapGstDetails(row),
  };
}

function mapDeliveryChallan(row) {
  return {
    id: row.id,
    company_id: row.company_id || "",
    ...mapTallyMeta(row),
    Challanno: text(row.challan_no),
    Challandate: formatDate(row.challan_date),
    ReferenceNo: text(row.reference_no),
    ReferenceDate: formatDate(row.reference_date),
    InvoiceNo: text(row.invoice_no),
    InvoiceDate: formatDate(row.invoice_date),
    BuyersOrderNo: text(row.buyers_order_no),
    BuyersOrderDate: formatDate(row.buyers_order_date),
    DispatchDocNo: text(row.dispatch_doc_no),
    DispatchedThrough: text(row.dispatched_through),
    Destination: text(row.destination),
    MotorVehicleNo: text(row.motor_vehicle_no),
    BillOfLadingNo: text(row.bill_of_lading_no),
    TermsOfDelivery: text(row.terms_of_delivery),
    PolicyNo: text(row.policy_no),
    PlaceOfSupply: text(row.place_of_supply),
    SellerName: text(row.seller_name),
    SellerAddress: text(row.seller_address),
    SellerGstin: text(row.seller_gstin),
    SellerState: text(row.seller_state),
    SellerStateCode: text(row.seller_state_code),
    SellerEmail: text(row.seller_email),
    CustomerName: text(row.buyer_name),
    BuyerAddress: text(row.buyer_address),
    customergstin: text(row.buyer_gstin),
    BuyerState: text(row.buyer_state),
    BuyerStateCode: text(row.buyer_state_code),
    Challanamount: money(row.total_amount),
    TaxableValue: money(row.taxable_value),
    TotalQuantity: money(row.total_quantity),
    TotalTaxAmount: money(row.total_tax_amount),
    CGSTRate: money(row.cgst_rate),
    CGSTAmount: money(row.cgst_amount),
    SGSTRate: money(row.sgst_rate),
    SGSTAmount: money(row.sgst_amount),
    IGSTRate: money(row.igst_rate),
    IGSTAmount: money(row.igst_amount),
    AmountInWords: text(row.amount_in_words),
    ...mapSignatory(row),
    challanitems: mapItems(row.items),
    GstDetails: mapGstDetails(row),
  };
}

function mapExpense(row) {
  const ledgers = mapLedgers(row.entries);
  return {
    id: row.id,
    company_id: row.company_id || "",
    ...mapTallyMeta(row),
    VoucherNo: text(row.voucher_no),
    VoucherDate: formatDate(row.voucher_date),
    VoucherType: row.voucher_type || "Journal Voucher",
    CompanyName: text(row.company_name),
    CompanyAddress: text(row.company_address),
    CompanyState: text(row.company_state),
    CompanyStateCode: text(row.company_state_code),
    CompanyCIN: text(row.company_cin),
    CompanyEmail: text(row.company_email),
    PayeeType: row.payee_type || "COMPANY",
    PayeeName: text(row.payee_name),
    PayeeAddress: text(row.payee_address),
    PayeeState: text(row.payee_state),
    PayeeStateCode: text(row.payee_state_code),
    PayeeGstin: text(row.payee_gstin),
    PayeeEmail: text(row.payee_email),
    PayeeDesignation: text(row.payee_designation),
    Narration: text(row.narration),
    OnAccountOf: text(row.on_account_of),
    ...mapSignatory(row),
    DebitLedgers: ledgers.DebitLedgers,
    CreditLedgers: ledgers.CreditLedgers,
  };
}

function mapPayment(row) {
  const ledgers = mapLedgers(row.entries);
  return {
    id: row.id,
    company_id: row.company_id || "",
    ...mapTallyMeta(row),
    VoucherNo: text(row.voucher_no),
    VoucherDate: formatDate(row.voucher_date),
    PaymentType: row.payment_type || "GENERAL",
    PaymentMode: row.payment_mode || "BANK",
    Narration: text(row.narration),
    OnAccountOf: text(row.on_account_of),
    FromCompanyName: text(row.from_company_name),
    FromCompanyAddress: text(row.from_company_address),
    FromCompanyGstin: text(row.from_company_gstin),
    PayeeType: row.payee_type || "COMPANY",
    PartyName: text(row.party_name),
    PartyGstin: text(row.party_gstin),
    PartyAddress: text(row.party_address),
    LinkedDocumentType: text(row.linked_document_type),
    LinkedDocumentNo: text(row.linked_document_no),
    BankName: text(row.bank_name),
    BankAccountNo: text(row.bank_account_no),
    BankIfsc: text(row.bank_ifsc),
    ReferenceNo: text(row.reference_no),
    ChequeNo: text(row.cheque_no),
    ChequeDate: formatDate(row.cheque_date),
    ...mapSignatory(row),
    DebitLedgers: ledgers.DebitLedgers,
    CreditLedgers: ledgers.CreditLedgers,
    Allocations: (row.allocations || []).map((rowItem) => ({
      document_type: rowItem.document_type || "",
      document_id: rowItem.document_id,
      document_no: text(rowItem.document_no),
      document_amount: money(rowItem.document_amount),
      paid_amount: money(rowItem.paid_amount),
      allocation_type: rowItem.allocation_type || "PARTIAL",
      remarks: text(rowItem.remarks),
    })),
  };
}

/** Staff ExpensePayment → Tally voucher shape (fully paid only). */
function mapStaffExpensePayment(row, { interventionName = "", projectName = "" } = {}) {
  const amount = Number(row.paid_amount || row.final_approved_amount || 0);
  const debitLedger =
    interventionName ||
    (row.intervention != null ? String(row.intervention) : "") ||
    "Expenses";

  const creditByMode = new Map();
  for (const tx of row.transactions || []) {
    const mode = String(tx.payment_mode || "Cash").trim() || "Cash";
    creditByMode.set(mode, (creditByMode.get(mode) || 0) + (Number(tx.payment_amount) || 0));
  }

  let CreditLedgers = [...creditByMode.entries()].map(([LedgerName, Amount]) => ({
    LedgerName,
    Amount,
  }));

  if (!CreditLedgers.length && amount > 0) {
    CreditLedgers = [{ LedgerName: "Cash", Amount: amount }];
  }

  const lastPaymentDate = (row.transactions || [])
    .map((t) => t.payment_date)
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a))[0];

  const narrationParts = [
    row.remarks,
    projectName ? `Project: ${projectName}` : null,
    debitLedger !== "Expenses" ? `Intervention: ${debitLedger}` : null,
  ].filter(Boolean);

  return {
    id: row.id,
    company_id: row.company_id || "",
    ...mapTallyMeta(row),
    VoucherNo: String(row.id).padStart(4, "0"),
    VoucherDate: formatDate(lastPaymentDate || row.manager_approved_at || row.requested_date),
    Narration: narrationParts.join(" | ") || `Expense payment #${row.id}`,
    DebitLedgers: amount > 0 ? [{ LedgerName: debitLedger, Amount: amount }] : [],
    CreditLedgers,
  };
}

function getStaffExpenseTallyWhere(req) {
  return {
    company_id: req.tally_company_id,
    approval_status: 1,
    payment_status: 2,
    tally_push_status: "PUSHED",
    data_status: DATA_STATUS_APP,
  };
}

async function resolveInterventionNames(rows) {
  const ids = [
    ...new Set(
      rows
        .map((r) => Number(r.intervention))
        .filter((id) => Number.isFinite(id) && id > 0)
    ),
  ];
  if (!ids.length) return {};
  const interventions = await prisma.intervention.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true },
  });
  return Object.fromEntries(interventions.map((i) => [i.id, i.name]));
}

async function resolveProjectNames(rows) {
  const ids = [
    ...new Set(
      rows
        .map((r) => Number(r.project_name))
        .filter((id) => Number.isFinite(id) && id > 0)
    ),
  ];
  if (!ids.length) return {};
  const projects = await prisma.project.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true },
  });
  return Object.fromEntries(projects.map((p) => [p.id, p.name]));
}

function mapPurchase(row) {
  const bank = splitBankIfscBranch(row.bank_ifsc_branch);
  return {
    id: row.id,
    company_id: row.company_id || "",
    ...mapTallyMeta(row),
    InvoiceType: row.invoice_type || "Tax Invoice",
    IRN: text(row.irn),
    AckNo: text(row.ack_no),
    AckDate: formatDate(row.ack_date),
    PurchaseNo: text(row.invoice_no),
    PurchaseDate: formatDate(row.invoice_date),
    PONo: text(row.buyers_order_no),
    PODate: formatDate(row.reference_date),
    EWayBillNo: text(row.eway_bill_no),
    DeliveryNote: text(row.delivery_note),
    DeliveryNoteDate: formatDate(row.delivery_note_date),
    ModeTermsOfPayment: text(row.mode_of_payment),
    ReferenceNoDate: text(row.reference_no),
    OtherReferences: text(row.other_references),
    DispatchDocNo: text(row.dispatch_doc_no),
    DispatchedThrough: text(row.dispatched_through),
    Destination: text(row.destination),
    BillOfLadingNo: text(row.bill_of_lading_no),
    MotorVehicleNo: text(row.motor_vehicle_no),
    TermsOfDelivery: text(row.terms_of_delivery),
    VendorName: text(row.seller_name),
    VendorAddress: text(row.seller_address),
    Vendorgstin: text(row.seller_gstin),
    VendorState: text(row.seller_state),
    VendorStateCode: text(row.seller_state_code),
    VendorCIN: text(row.seller_cin),
    VendorEmail: text(row.seller_email),
    BankName: text(row.bank_name),
    BankAccountNo: text(row.bank_account_no),
    BankBranch: bank.BankBranch,
    BankIfsc: bank.BankIfsc,
    ConsigneeName: text(row.consignee_name),
    ConsigneeAddress: text(row.consignee_address),
    ConsigneeGstin: text(row.consignee_gstin),
    ConsigneeState: text(row.consignee_state),
    ConsigneeStateCode: text(row.consignee_state_code),
    ConsigneeEmail: text(row.consignee_email),
    BuyerName: text(row.buyer_name),
    BuyerAddress: text(row.buyer_address),
    BuyerGstin: text(row.buyer_gstin),
    BuyerState: text(row.buyer_state),
    BuyerStateCode: text(row.buyer_state_code),
    BuyerPAN: text(row.buyer_pan),
    BuyerEmail: text(row.buyer_email),
    PurchaseAmount: money(row.total_amount),
    TaxableValue: money(row.taxable_value),
    TotalQuantity: money(row.total_quantity),
    TotalTaxAmount: money(row.total_tax_amount),
    IGSTRate: money(row.igst_rate),
    IGSTAmount: money(row.igst_amount),
    AmountInWords: text(row.amount_in_words),
    TaxAmountInWords: text(row.tax_amount_in_words),
    Declaration: text(row.declaration),
    ...mapSignatory(row),
    IssuingSignatoryName: text(row.issuing_signatory_name),
    IssuingSignatoryDesignation: text(row.issuing_signatory_designation),
    Jurisdiction: text(row.jurisdiction),
    PurchaseItems: mapItems(row.items),
    GstDetails: mapGstDetails(row),
  };
}

function mapSales(row) {
  const bank = splitBankIfscBranch(row.bank_ifsc_branch);
  const deliveryNote = text(row.delivery_note);
  return {
    id: row.id,
    company_id: row.company_id || "",
    ...mapTallyMeta(row),
    InvoiceType: row.invoice_type || "Tax Invoice",
    IRN: text(row.irn),
    AckNo: text(row.ack_no),
    AckDate: formatDate(row.ack_date),
    InvoiceNo: text(row.invoice_no),
    InvoiceDate: formatDate(row.invoice_date),
    Challanno: deliveryNote,
    BuyersOrderNo: text(row.buyers_order_no),
    BuyersOrderDate: formatDate(row.reference_date),
    EWayBillNo: text(row.eway_bill_no),
    DeliveryNote: deliveryNote,
    DeliveryNoteDate: formatDate(row.delivery_note_date),
    ModeTermsOfPayment: text(row.mode_of_payment),
    ReferenceNoDate: text(row.reference_no),
    OtherReferences: text(row.other_references),
    DispatchDocNo: text(row.dispatch_doc_no),
    DispatchedThrough: text(row.dispatched_through),
    Destination: text(row.destination),
    BillOfLadingNo: text(row.bill_of_lading_no),
    MotorVehicleNo: text(row.motor_vehicle_no),
    TermsOfDelivery: text(row.terms_of_delivery),
    SellerName: text(row.seller_name),
    SellerAddress: text(row.seller_address),
    SellerGstin: text(row.seller_gstin),
    SellerState: text(row.seller_state),
    SellerStateCode: text(row.seller_state_code),
    SellerCIN: text(row.seller_cin),
    SellerEmail: text(row.seller_email),
    BankName: text(row.bank_name),
    BankAccountNo: text(row.bank_account_no),
    BankBranch: bank.BankBranch,
    BankIfsc: bank.BankIfsc,
    ConsigneeName: text(row.consignee_name),
    ConsigneeAddress: text(row.consignee_address),
    ConsigneeGstin: text(row.consignee_gstin),
    ConsigneeState: text(row.consignee_state),
    ConsigneeStateCode: text(row.consignee_state_code),
    ConsigneeEmail: text(row.consignee_email),
    CustomerName: text(row.buyer_name),
    BuyerAddress: text(row.buyer_address),
    customergstin: text(row.buyer_gstin),
    BuyerState: text(row.buyer_state),
    BuyerStateCode: text(row.buyer_state_code),
    BuyerPAN: text(row.buyer_pan),
    BuyerEmail: text(row.buyer_email),
    BillAmount: money(row.total_amount),
    TaxableValue: money(row.taxable_value),
    TotalQuantity: money(row.total_quantity),
    TotalTaxAmount: money(row.total_tax_amount),
    CGSTRate: money(row.cgst_rate),
    CGSTAmount: money(row.cgst_amount),
    SGSTRate: money(row.sgst_rate),
    SGSTAmount: money(row.sgst_amount),
    IGSTRate: money(row.igst_rate),
    IGSTAmount: money(row.igst_amount),
    AmountInWords: text(row.amount_in_words),
    TaxAmountInWords: text(row.tax_amount_in_words),
    Declaration: text(row.declaration),
    ...mapSignatory(row),
    IssuingSignatoryName: text(row.issuing_signatory_name),
    IssuingSignatoryDesignation: text(row.issuing_signatory_designation),
    Jurisdiction: text(row.jurisdiction),
    BillItems: mapItems(row.items),
    GstDetails: mapGstDetails(row),
  };
}

function mapCompany(row) {
  const gst = text(row.gst);
  const stateCode =
    text(row.state_code) || (gst.length >= 2 && /^\d{2}/.test(gst) ? gst.slice(0, 2) : "");
  return {
    id: row.id,
    company_id: row.company_id || "",
    ...mapTallyMeta(row),
    CompanyName: text(row.name),
    LedgerName: text(row.ledger_name || row.name),
    LedgerCode: text(row.code),
    LedgerGroup: text(row.ledger_group),
    ShortName: text(row.short_name),
    AddLine1: text(row.add_line1 || row.address),
    AddLine2: text(row.add_line2),
    AddLine3: text(row.add_line3),
    City: text(row.city),
    LedState: text(row.state),
    LedCountry: row.country || "India",
    LedgerPIN: row.zipcode != null ? String(row.zipcode) : "",
    StateCode: stateCode,
    ContactPerson: text(row.contact_person),
    ContactNumber: text(row.contact_number),
    EmailID: text(row.email),
    PanNumber: text(row.pan),
    GSTNumber: gst,
    TAN: text(row.tan),
    CIN: text(row.cin),
    Status: row.status != null ? Number(row.status) : 1,
    BankAccounts: (row.bank_accounts || []).map((bank) => ({
      BankName: text(bank.bank_name),
      AccountNo: text(bank.ac_no),
      BranchName: text(bank.branch_name),
      IFSC: text(bank.ifsc_code),
      IsPrimary: !!bank.is_primary,
    })),
  };
}

// ---------------------------------------------------------------------------
// Credit Note — GET /api/tally/credit-notes
// ---------------------------------------------------------------------------
export async function getCreditNotesForTally(req, res) {
  try {
    const where = getTallyWhere(req);

    const rows = await prisma.creditNote.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(tallyListResponse(rows, mapCreditNote));
  } catch (error) {
    console.error("Tally credit notes:", error);
    return res.status(500).json({ message: "Failed to fetch credit notes" });
  }
}

export async function getCreditNoteForTally(req, res) {
  try {
    const where = getTallyWhere(req);

    const row = await prisma.creditNote.findFirst({
      where: { id: Number(req.params.id), ...where },
      include: { items: true },
    });
    if (!row) return res.status(404).json({ message: "Credit note not found" });
    return res.json({ data: [mapCreditNote(row)] });
  } catch (error) {
    console.error("Tally credit note:", error);
    return res.status(500).json({ message: "Failed to fetch credit note" });
  }
}

// ---------------------------------------------------------------------------
// Debit Note — GET /api/tally/debit-notes
// ---------------------------------------------------------------------------
export async function getDebitNotesForTally(req, res) {
  try {
    const where = getTallyWhere(req);

    const rows = await prisma.debitNote.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(tallyListResponse(rows, mapDebitNote));
  } catch (error) {
    console.error("Tally debit notes:", error);
    return res.status(500).json({ message: "Failed to fetch debit notes" });
  }
}

export async function getDebitNoteForTally(req, res) {
  try {
    const where = getTallyWhere(req);

    const row = await prisma.debitNote.findFirst({
      where: { id: Number(req.params.id), ...where },
      include: { items: true },
    });
    if (!row) return res.status(404).json({ message: "Debit note not found" });
    return res.json({ data: [mapDebitNote(row)] });
  } catch (error) {
    console.error("Tally debit note:", error);
    return res.status(500).json({ message: "Failed to fetch debit note" });
  }
}

// ---------------------------------------------------------------------------
// Delivery Challan — GET /api/tally/delivery-challans
// ---------------------------------------------------------------------------
export async function getDeliveryChallansForTally(req, res) {
  try {
    const where = getTallyWhere(req);

    const rows = await prisma.deliveryChallan.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(tallyListResponse(rows, mapDeliveryChallan));
  } catch (error) {
    console.error("Tally delivery challans:", error);
    return res.status(500).json({ message: "Failed to fetch delivery challans" });
  }
}

export async function getDeliveryChallanForTally(req, res) {
  try {
    const where = getTallyWhere(req);

    const row = await prisma.deliveryChallan.findFirst({
      where: { id: Number(req.params.id), ...where },
      include: { items: true },
    });
    if (!row) return res.status(404).json({ message: "Delivery challan not found" });
    return res.json({ data: [mapDeliveryChallan(row)] });
  } catch (error) {
    console.error("Tally delivery challan:", error);
    return res.status(500).json({ message: "Failed to fetch delivery challan" });
  }
}

// ---------------------------------------------------------------------------
// Expense — GET /api/tally/expenses
// ---------------------------------------------------------------------------
export async function getExpensesForTally(req, res) {
  try {
    const where = getTallyWhere(req);

    const rows = await prisma.journalVoucher.findMany({
      where,
      include: { entries: { orderBy: { sl_no: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
    const emptyMeta = rows.length
      ? null
      : await buildTallyQueueHint("journalVoucher", req.tally_company_id);
    return res.json(tallyListResponse(rows, mapExpense, emptyMeta));
  } catch (error) {
    console.error("Tally expenses:", error);
    return res.status(500).json({ message: "Failed to fetch expenses" });
  }
}

export async function getExpenseForTally(req, res) {
  try {
    const where = getTallyWhere(req);

    const row = await prisma.journalVoucher.findFirst({
      where: { id: Number(req.params.id), ...where },
      include: { entries: { orderBy: { sl_no: "asc" } } },
    });
    if (!row) return res.status(404).json({ message: "Expense voucher not found" });
    return res.json({ data: [mapExpense(row)] });
  } catch (error) {
    console.error("Tally expense:", error);
    return res.status(500).json({ message: "Failed to fetch expense voucher" });
  }
}

// ---------------------------------------------------------------------------
// Payment — GET /api/tally/payments
// ---------------------------------------------------------------------------
export async function getPaymentsForTally(req, res) {
  try {
    const where = getTallyWhere(req);

    const rows = await prisma.paymentVoucher.findMany({
      where,
      include: { entries: { orderBy: { sl_no: "asc" } }, allocations: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(tallyListResponse(rows, mapPayment));
  } catch (error) {
    console.error("Tally payments:", error);
    return res.status(500).json({ message: "Failed to fetch payments" });
  }
}

export async function getPaymentForTally(req, res) {
  try {
    const where = getTallyWhere(req);

    const row = await prisma.paymentVoucher.findFirst({
      where: { id: Number(req.params.id), ...where },
      include: { entries: { orderBy: { sl_no: "asc" } }, allocations: true },
    });
    if (!row) return res.status(404).json({ message: "Payment voucher not found" });
    return res.json({ data: [mapPayment(row)] });
  } catch (error) {
    console.error("Tally payment:", error);
    return res.status(500).json({ message: "Failed to fetch payment voucher" });
  }
}

// ---------------------------------------------------------------------------
// Staff Expense Payments — GET /api/tally/expense-payments
// Fully paid (payment_status=2) + pushed queue. Separate from JV /expenses.
// ---------------------------------------------------------------------------
export async function getStaffExpensePaymentsForTally(req, res) {
  try {
    const where = getStaffExpenseTallyWhere(req);

    const rows = await prisma.expensePayment.findMany({
      where,
      include: { transactions: { orderBy: { payment_date: "asc" } } },
      orderBy: { id: "desc" },
    });

    const nameMap = await resolveInterventionNames(rows);
    const projectMap = await resolveProjectNames(rows);
    const data = rows.map((row) =>
      mapStaffExpensePayment(row, {
        interventionName: nameMap[Number(row.intervention)] || "",
        projectName: projectMap[Number(row.project_name)] || "",
      })
    );

    if (!data.length) {
      const [total, fullyPaid, pushed, inQueue] = await Promise.all([
        prisma.expensePayment.count({ where: { company_id: req.tally_company_id } }),
        prisma.expensePayment.count({
          where: { company_id: req.tally_company_id, approval_status: 1, payment_status: 2 },
        }),
        prisma.expensePayment.count({
          where: { company_id: req.tally_company_id, tally_push_status: "PUSHED" },
        }),
        prisma.expensePayment.count({ where }),
      ]);
      return res.json({
        data,
        hint:
          pushed === 0
            ? "No fully paid staff expenses with tally_push_status=PUSHED. On Paid Payments click Push to Tally. (NOT_PUSHED means not in this queue yet.)"
            : "No records match export queue (must be fully paid, PUSHED, data_status=1).",
        queue_filter: {
          company_id: req.tally_company_id,
          approval_status: 1,
          payment_status: 2,
          tally_push_status: "PUSHED",
          data_status: 1,
        },
        counts: {
          total,
          fully_paid_approved: fullyPaid,
          pushed,
          in_export_queue: inQueue,
        },
      });
    }
    return res.json({ data });
  } catch (error) {
    console.error("Tally staff expense payments:", error);
    return res.status(500).json({ message: "Failed to fetch expense payments" });
  }
}

export async function getStaffExpensePaymentForTally(req, res) {
  try {
    const where = getStaffExpenseTallyWhere(req);

    const row = await prisma.expensePayment.findFirst({
      where: { id: Number(req.params.id), ...where },
      include: { transactions: { orderBy: { payment_date: "asc" } } },
    });
    if (!row) {
      return res.status(404).json({ message: "Expense payment not found in Tally export queue" });
    }

    const nameMap = await resolveInterventionNames([row]);
    const projectMap = await resolveProjectNames([row]);
    return res.json({
      data: [
        mapStaffExpensePayment(row, {
          interventionName: nameMap[Number(row.intervention)] || "",
          projectName: projectMap[Number(row.project_name)] || "",
        }),
      ],
    });
  } catch (error) {
    console.error("Tally staff expense payment:", error);
    return res.status(500).json({ message: "Failed to fetch expense payment" });
  }
}

export async function markStaffExpensePaymentPushed(req, res) {
  try {
    const company_id = req.tally_company_id;

    const row = await prisma.expensePayment.findFirst({
      where: {
        id: Number(req.params.id),
        company_id,
        approval_status: 1,
        payment_status: 2,
        tally_push_status: "PUSHED",
        data_status: DATA_STATUS_APP,
      },
    });

    if (!row) {
      return res.status(404).json({
        message:
          "Expense payment not found or not in Tally export queue (must be fully paid, pushed)",
      });
    }

    const updated = await prisma.expensePayment.update({
      where: { id: Number(req.params.id) },
      data: { tally_push_status: "NOT_PUSHED" },
    });

    return res.json({
      message: "Expense payment synced to Tally — removed from export queue",
      data: { id: updated.id, tally_push_status: updated.tally_push_status },
    });
  } catch (error) {
    console.error("Tally mark staff expense pushed:", error);
    return res.status(500).json({ message: "Failed to mark expense payment as pushed" });
  }
}

// ---------------------------------------------------------------------------
// Purchase — GET /api/tally/purchases
// ---------------------------------------------------------------------------
export async function getPurchasesForTally(req, res) {
  try {
    const where = getTallyWhere(req);

    const rows = await prisma.purchase.findMany({
      where,
      include: { items: true, gst_details: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(tallyListResponse(rows, mapPurchase));
  } catch (error) {
    console.error("Tally purchases:", error);
    return res.status(500).json({ message: "Failed to fetch purchases" });
  }
}

export async function getPurchaseForTally(req, res) {
  try {
    const where = getTallyWhere(req);

    const row = await prisma.purchase.findFirst({
      where: { id: Number(req.params.id), ...where },
      include: { items: true, gst_details: true },
    });
    if (!row) return res.status(404).json({ message: "Purchase invoice not found" });
    return res.json({ data: [mapPurchase(row)] });
  } catch (error) {
    console.error("Tally purchase:", error);
    return res.status(500).json({ message: "Failed to fetch purchase invoice" });
  }
}

// ---------------------------------------------------------------------------
// Sales — GET /api/tally/sales
// ---------------------------------------------------------------------------
export async function getSalesForTally(req, res) {
  try {
    const where = getTallyWhere(req);

    const rows = await prisma.sales.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(tallyListResponse(rows, mapSales));
  } catch (error) {
    console.error("Tally sales:", error);
    return res.status(500).json({ message: "Failed to fetch sales invoices" });
  }
}

export async function getSalesForTallyById(req, res) {
  try {
    const where = getTallyWhere(req);

    const row = await prisma.sales.findFirst({
      where: { id: Number(req.params.id), ...where },
      include: { items: true },
    });
    if (!row) return res.status(404).json({ message: "Sales invoice not found" });
    return res.json({ data: [mapSales(row)] });
  } catch (error) {
    console.error("Tally sales invoice:", error);
    return res.status(500).json({ message: "Failed to fetch sales invoice" });
  }
}

// ---------------------------------------------------------------------------
// Company Master — GET /api/tally/companies
// ---------------------------------------------------------------------------
export async function getCompaniesForTally(req, res) {
  try {
    const where = getTallyWhere(req);

    const rows = await prisma.companyDetail.findMany({
      where,
      include: { bank_accounts: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(tallyListResponse(rows, mapCompany));
  } catch (error) {
    console.error("Tally companies:", error);
    return res.status(500).json({ message: "Failed to fetch companies" });
  }
}

export async function getCompanyForTally(req, res) {
  try {
    const where = getTallyWhere(req);

    const row = await prisma.companyDetail.findFirst({
      where: { id: Number(req.params.id), ...where },
      include: { bank_accounts: true },
    });
    if (!row) return res.status(404).json({ message: "Company not found" });
    return res.json({ data: [mapCompany(row)] });
  } catch (error) {
    console.error("Tally company:", error);
    return res.status(500).json({ message: "Failed to fetch company" });
  }
}

// ---------------------------------------------------------------------------
// Mark as pushed — PATCH after Tally successfully imports a record
// ---------------------------------------------------------------------------
function createMarkPushedHandler(modelName, docLabel) {
  return async (req, res) => {
    try {
      const company_id = req.tally_company_id;

      const row = await prisma[modelName].findFirst({
        where: {
          id: Number(req.params.id),
          company_id,
          approval_status: "APPROVED",
          tally_push_status: "PUSHED",
          data_status: DATA_STATUS_APP,
        },
      });

      if (!row) {
        return res.status(404).json({
          message: `${docLabel} not found or not in Tally export queue (must be APPROVED, PUSHED, app-created)`,
        });
      }

      const updated = await prisma[modelName].update({
        where: { id: Number(req.params.id) },
        data: { tally_push_status: "NOT_PUSHED" },
      });

      return res.json({
        message: `${docLabel} synced to Tally — removed from export queue`,
        data: { id: updated.id, tally_push_status: updated.tally_push_status },
      });
    } catch (error) {
      console.error(`Tally mark pushed (${docLabel}):`, error);
      return res.status(500).json({ message: `Failed to mark ${docLabel} as pushed` });
    }
  };
}

export const markCreditNotePushed = createMarkPushedHandler("creditNote", "Credit note");
export const markDebitNotePushed = createMarkPushedHandler("debitNote", "Debit note");
export const markDeliveryChallanPushed = createMarkPushedHandler("deliveryChallan", "Delivery challan");
export const markExpensePushed = createMarkPushedHandler("journalVoucher", "Expense voucher");
export const markPaymentPushed = createMarkPushedHandler("paymentVoucher", "Payment voucher");
export const markPurchasePushed = createMarkPushedHandler("purchase", "Purchase invoice");
export const markSalesPushed = createMarkPushedHandler("sales", "Sales invoice");
export const markCompanyPushed = createMarkPushedHandler("companyDetail", "Company");

