# KLK ↔ Tally — Full JSON Field Catalog (for Tally Team)

**Purpose:** Software forms collect many fields. Current Tally integration uses a short JSON.  
This document defines the **full recommended JSON** for every module so Tally can send/receive complete data.

**Base URL:** `{SERVER}/api/tally`  
**Auth:** None (public). **`company_id` is required on every request** (query and/or body).

**Common rules**
- Prefer batch: `{ "data": [ {...}, {...} ] }` or a raw JSON array `[ {...} ]`
- Dates: `DD/Mon/YYYY` (e.g. `02/Jul/2026`) or `YYYY-MM-DD`
- Nested arrays: items / GstDetails / DebitLedgers / CreditLedgers / BankAccounts
- Empty string `""` is OK for optional text; omit or `null` for unused optionals

**Endpoints per module**

| Action | Method | Path |
|--------|--------|------|
| List (export queue) | GET | `/api/tally/{module}?company_id=KLKURJA` |
| One | GET | `/api/tally/{module}/{id}?company_id=KLKURJA` |
| Create | POST | `/api/tally/{module}?company_id=KLKURJA` |
| Update | PUT | `/api/tally/{module}/{id}?company_id=KLKURJA` |
| Delete | DELETE | `/api/tally/{module}/{id}?company_id=KLKURJA` |
| Mark synced | PATCH | `/api/tally/{module}/{id}/pushed?company_id=KLKURJA` |

---

## 1. Purchase Invoice

**Module path:** `purchases`

```http
POST /api/tally/purchases?company_id=KLKURJA
Content-Type: application/json
```

```json
{
  "data": [
    {
      "company_id": "KLKURJA",

      "InvoiceType": "Tax Invoice",
      "IRN": "abcd1234irn...",
      "AckNo": "112233",
      "AckDate": "02/Jul/2026",

      "PurchaseNo": "Pur0991",
      "PurchaseDate": "02/Jul/2026",
      "PONo": "PO908",
      "PODate": "01/Jul/2026",

      "EWayBillNo": "EWB123456",
      "DeliveryNote": "DN-01",
      "DeliveryNoteDate": "02/Jul/2026",
      "ModeTermsOfPayment": "30 Days",
      "ReferenceNoDate": "REF-1",
      "OtherReferences": "",
      "DispatchDocNo": "DISP-1",
      "DispatchedThrough": "Road",
      "Destination": "Delhi",
      "BillOfLadingNo": "",
      "MotorVehicleNo": "DL01AB1234",
      "TermsOfDelivery": "FOB",

      "VendorName": "XYZ Pvt Ltd",
      "VendorAddress": "Plot 12, Industrial Area, Gurugram",
      "Vendorgstin": "06AAAAA0000A1Z5",
      "VendorState": "Haryana",
      "VendorStateCode": "06",
      "VendorCIN": "U12345HR2020PTC000001",
      "VendorEmail": "vendor@xyz.com",

      "BankName": "HDFC Bank",
      "BankAccountNo": "1234567890",
      "BankBranch": "MG Road",
      "BankIfsc": "HDFC0001234",

      "ConsigneeName": "Consignee Name",
      "ConsigneeAddress": "Warehouse address",
      "ConsigneeGstin": "07BBBBB0000B1Z5",
      "ConsigneeState": "Delhi",
      "ConsigneeStateCode": "07",
      "ConsigneeEmail": "consignee@mail.com",

      "BuyerName": "KLK Ventures",
      "BuyerAddress": "Head Office Address",
      "BuyerGstin": "07CCCCC0000C1Z5",
      "BuyerState": "Delhi",
      "BuyerStateCode": "07",
      "BuyerPAN": "CCCCC0000C",
      "BuyerEmail": "accounts@klk.co.in",

      "PurchaseAmount": 120000,
      "TaxableValue": 101694.92,
      "TotalQuantity": 5,
      "TotalTaxAmount": 18305.08,
      "IGSTRate": 0,
      "IGSTAmount": 0,
      "AmountInWords": "One Lakh Twenty Thousand Only",
      "TaxAmountInWords": "Eighteen Thousand Three Hundred Five Only",
      "Declaration": "We declare that this invoice shows the actual price...",
      "AuthorisedSignatoryName": "Accounts Head",
      "AuthorisedSignatoryDesignation": "Manager",
      "IssuingSignatoryName": "",
      "IssuingSignatoryDesignation": "",
      "Jurisdiction": "Delhi",

      "PurchaseItems": [
        {
          "itemname": "Item A",
          "hsn_sac": "84713010",
          "quantity": 1,
          "unit": "Nos",
          "rate": 15844,
          "per": "Nos",
          "amount": 15844
        },
        {
          "itemname": "Item B",
          "hsn_sac": "39269099",
          "quantity": 4,
          "unit": "Nos",
          "rate": 12000,
          "per": "Nos",
          "amount": 48000
        }
      ],
      "GstDetails": [
        { "LedgerName": "CGST", "rate": 9, "amount": 5822 },
        { "LedgerName": "SGST", "rate": 9, "amount": 5822 }
      ]
    }
  ]
}
```

**Minimum still accepted today:** `PurchaseNo`, `PurchaseDate`, `VendorName`, `PurchaseItems[]` (+ `company_id`).

---

## 2. Sales Invoice

**Module path:** `sales`

```http
POST /api/tally/sales?company_id=KLKURJA
```

```json
{
  "data": [
    {
      "company_id": "KLKURJA",

      "InvoiceType": "Tax Invoice",
      "IRN": "",
      "AckNo": "",
      "AckDate": "",

      "InvoiceNo": "Inv0991",
      "InvoiceDate": "02/Jul/2026",
      "Challanno": "DC-01",
      "BuyersOrderNo": "BO-100",
      "BuyersOrderDate": "01/Jul/2026",

      "EWayBillNo": "",
      "DeliveryNote": "",
      "DeliveryNoteDate": "",
      "ModeTermsOfPayment": "Advance",
      "ReferenceNoDate": "",
      "OtherReferences": "",
      "DispatchDocNo": "",
      "DispatchedThrough": "",
      "Destination": "Noida",
      "BillOfLadingNo": "",
      "MotorVehicleNo": "",
      "TermsOfDelivery": "",

      "SellerName": "KLK Ventures",
      "SellerAddress": "Head Office Address",
      "SellerGstin": "07CCCCC0000C1Z5",
      "SellerState": "Delhi",
      "SellerStateCode": "07",
      "SellerCIN": "",
      "SellerEmail": "accounts@klk.co.in",

      "BankName": "HDFC Bank",
      "BankAccountNo": "9988776655",
      "BankBranch": "CP",
      "BankIfsc": "HDFC0001111",

      "ConsigneeName": "",
      "ConsigneeAddress": "",
      "ConsigneeGstin": "",
      "ConsigneeState": "",
      "ConsigneeStateCode": "",
      "ConsigneeEmail": "",

      "CustomerName": "ABC Pvt Ltd",
      "BuyerAddress": "Customer address",
      "customergstin": "09DDDDD0000D1Z5",
      "BuyerState": "Uttar Pradesh",
      "BuyerStateCode": "09",
      "BuyerPAN": "DDDDD0000D",
      "BuyerEmail": "buyer@abc.com",

      "BillAmount": 118000,
      "TaxableValue": 100000,
      "TotalQuantity": 10,
      "TotalTaxAmount": 18000,
      "CGSTRate": 9,
      "CGSTAmount": 9000,
      "SGSTRate": 9,
      "SGSTAmount": 9000,
      "IGSTRate": 0,
      "IGSTAmount": 0,
      "AmountInWords": "",
      "TaxAmountInWords": "",
      "Declaration": "",
      "AuthorisedSignatoryName": "",
      "AuthorisedSignatoryDesignation": "",
      "IssuingSignatoryName": "",
      "IssuingSignatoryDesignation": "",
      "Jurisdiction": "",

      "BillItems": [
        {
          "itemname": "Product A",
          "hsn_sac": "8471",
          "quantity": 10,
          "unit": "Nos",
          "rate": 10000,
          "per": "Nos",
          "amount": 100000
        }
      ],
      "GstDetails": [
        { "LedgerName": "CGST", "rate": 9, "amount": 9000 },
        { "LedgerName": "SGST", "rate": 9, "amount": 9000 }
      ]
    }
  ]
}
```

**Minimum today:** `InvoiceNo`, `InvoiceDate`, `CustomerName`, `BillItems[]`.

---

## 3. Credit Note

**Module path:** `credit-notes`

```http
POST /api/tally/credit-notes?company_id=KLKURJA
```

```json
{
  "data": [
    {
      "company_id": "KLKURJA",

      "InvoiceType": "Credit Note",
      "IRN": "",
      "AckNo": "",
      "AckDate": "",

      "CreditNoteNo": "CN-0991",
      "CreditNoteDate": "02/Jul/2026",
      "InvoiceNo": "Inv0991",
      "InvoiceDate": "01/Jul/2026",
      "EWayBillNo": "",
      "BuyersOrderNo": "",
      "OtherReferences": "",
      "DispatchDocNo": "",
      "DispatchedThrough": "",
      "Destination": "",
      "TermsOfDelivery": "",

      "SellerName": "KLK Ventures",
      "SellerAddress": "Head Office",
      "SellerGstin": "07CCCCC0000C1Z5",
      "SellerState": "Delhi",
      "SellerStateCode": "07",
      "SellerCIN": "",
      "SellerEmail": "",
      "SellerPAN": "",

      "ConsigneeName": "",
      "ConsigneeAddress": "",
      "ConsigneeGstin": "",
      "ConsigneeState": "",
      "ConsigneeStateCode": "",
      "ConsigneeEmail": "",

      "CustomerName": "ABC Pvt Ltd",
      "BuyerAddress": "Customer address",
      "customergstin": "09DDDDD0000D1Z5",
      "BuyerState": "Uttar Pradesh",
      "BuyerStateCode": "09",
      "BuyerPAN": "",
      "BuyerEmail": "",

      "BillAmount": 11800,
      "TaxableValue": 10000,
      "TotalQuantity": 1,
      "TotalTaxAmount": 1800,
      "CGSTRate": 9,
      "CGSTAmount": 900,
      "SGSTRate": 9,
      "SGSTAmount": 900,
      "IGSTRate": 0,
      "IGSTAmount": 0,
      "AmountInWords": "",
      "TaxAmountInWords": "",
      "AuthorisedSignatoryName": "",
      "AuthorisedSignatoryDesignation": "",

      "BillItems": [
        {
          "itemname": "Returned item",
          "hsn_sac": "8471",
          "quantity": 1,
          "unit": "Nos",
          "rate": 10000,
          "per": "Nos",
          "amount": 10000
        }
      ],
      "GstDetails": [
        { "LedgerName": "CGST", "rate": 9, "amount": 900 },
        { "LedgerName": "SGST", "rate": 9, "amount": 900 }
      ]
    }
  ]
}
```

**Minimum today:** `CreditNoteNo`, `CreditNoteDate`, `CustomerName`, `BillItems[]`.

---

## 4. Debit Note

**Module path:** `debit-notes`

```http
POST /api/tally/debit-notes?company_id=KLKURJA
```

```json
{
  "data": [
    {
      "company_id": "KLKURJA",

      "DebitNoteNo": "DN-0991",
      "DebitNoteDate": "02/Jul/2026",
      "PurchaseNo": "Pur0991",
      "PurchaseDate": "01/Jul/2026",
      "OtherReferences": "",

      "VendorName": "XYZ Pvt Ltd",
      "VendorAddress": "Vendor address",
      "Vendorgstin": "06AAAAA0000A1Z5",
      "VendorState": "Haryana",
      "VendorStateCode": "06",
      "VendorCIN": "",
      "VendorEmail": "",
      "VendorPAN": "",

      "ConsigneeName": "",
      "ConsigneeAddress": "",
      "ConsigneeGstin": "",
      "ConsigneeState": "",
      "ConsigneeStateCode": "",
      "ConsigneeEmail": "",

      "BuyerName": "KLK Ventures",
      "BuyerAddress": "Head Office",
      "BuyerGstin": "07CCCCC0000C1Z5",
      "BuyerState": "Delhi",
      "BuyerStateCode": "07",
      "BuyerPAN": "",
      "BuyerEmail": "",

      "DebitNoteAmount": 11800,
      "TaxableValue": 10000,
      "TotalQuantity": 1,
      "TotalTaxAmount": 1800,
      "CGSTRate": 9,
      "CGSTAmount": 900,
      "SGSTRate": 9,
      "SGSTAmount": 900,
      "IGSTRate": 0,
      "IGSTAmount": 0,
      "AmountInWords": "",
      "AuthorisedSignatoryName": "",
      "AuthorisedSignatoryDesignation": "",

      "PurchaseItems": [
        {
          "itemname": "Debit item",
          "hsn_sac": "8471",
          "quantity": 1,
          "unit": "Nos",
          "rate": 10000,
          "per": "Nos",
          "amount": 10000
        }
      ],
      "GstDetails": [
        { "LedgerName": "CGST", "rate": 9, "amount": 900 },
        { "LedgerName": "SGST", "rate": 9, "amount": 900 }
      ]
    }
  ]
}
```

**Minimum today:** `DebitNoteNo`, `PurchaseItems[]` (+ vendor/date recommended).  
**Do not** post Payment vouchers (`VoucherNo` + `DebitLedgers`) to this URL — use `/payments`.

---

## 5. Delivery Challan

**Module path:** `delivery-challans`

```http
POST /api/tally/delivery-challans?company_id=KLKURJA
```

```json
{
  "data": [
    {
      "company_id": "KLKURJA",

      "Challanno": "DC0991",
      "Challandate": "02/Jul/2026",
      "ReferenceNo": "REF-1",
      "ReferenceDate": "02/Jul/2026",
      "InvoiceNo": "Inv0991",
      "InvoiceDate": "02/Jul/2026",
      "BuyersOrderNo": "BO-1",
      "BuyersOrderDate": "01/Jul/2026",
      "DispatchDocNo": "",
      "DispatchedThrough": "Courier",
      "Destination": "Noida",
      "MotorVehicleNo": "",
      "BillOfLadingNo": "",
      "TermsOfDelivery": "",
      "PolicyNo": "",
      "PlaceOfSupply": "Uttar Pradesh",

      "SellerName": "KLK Ventures",
      "SellerAddress": "Head Office",
      "SellerGstin": "07CCCCC0000C1Z5",
      "SellerState": "Delhi",
      "SellerStateCode": "07",
      "SellerEmail": "",

      "CustomerName": "ABC Pvt Ltd",
      "BuyerAddress": "Customer address",
      "customergstin": "09DDDDD0000D1Z5",
      "BuyerState": "Uttar Pradesh",
      "BuyerStateCode": "09",

      "Challanamount": 50000,
      "TaxableValue": 50000,
      "TotalQuantity": 5,
      "TotalTaxAmount": 0,
      "CGSTRate": 0,
      "CGSTAmount": 0,
      "SGSTRate": 0,
      "SGSTAmount": 0,
      "IGSTRate": 0,
      "IGSTAmount": 0,
      "AmountInWords": "",
      "AuthorisedSignatoryName": "",
      "AuthorisedSignatoryDesignation": "",

      "challanitems": [
        {
          "itemname": "Item A",
          "hsn_sac": "8471",
          "quantity": 5,
          "unit": "Nos",
          "rate": 10000,
          "per": "Nos",
          "amount": 50000
        }
      ],
      "GstDetails": []
    }
  ]
}
```

**Minimum today:** `Challanno`, `Challandate`, `CustomerName`, `challanitems[]`.

---

## 6. Expense (Journal Voucher)

**Module path:** `expenses`  
*(Accounts → Journal Voucher / Expense — not staff emp payments)*

```http
POST /api/tally/expenses?company_id=KLKURJA
```

```json
{
  "data": [
    {
      "company_id": "KLKURJA",

      "VoucherNo": "0012",
      "VoucherDate": "02/Jul/2026",
      "VoucherType": "Expense Voucher",

      "CompanyName": "KLK Ventures",
      "CompanyAddress": "Head Office",
      "CompanyState": "Delhi",
      "CompanyStateCode": "07",
      "CompanyCIN": "",
      "CompanyEmail": "accounts@klk.co.in",

      "PayeeType": "COMPANY",
      "PayeeName": "Travel Agency",
      "PayeeAddress": "",
      "PayeeState": "",
      "PayeeStateCode": "",
      "PayeeGstin": "",
      "PayeeEmail": "",
      "PayeeDesignation": "",

      "Narration": "Travelling and accommodation for project visit",
      "OnAccountOf": "Field visit Jul 2026",
      "AuthorisedSignatoryName": "",
      "AuthorisedSignatoryDesignation": "",

      "DebitLedgers": [
        { "LedgerName": "Travelling Expenses", "Amount": 10000 },
        { "LedgerName": "Accomodation Charges", "Amount": 3000 }
      ],
      "CreditLedgers": [
        { "LedgerName": "Cash", "Amount": 8000 },
        { "LedgerName": "UPI", "Amount": 5000 }
      ]
    }
  ]
}
```

**Rule:** Sum(DebitLedgers.Amount) must equal Sum(CreditLedgers.Amount).  
**Minimum today:** `VoucherNo`, `DebitLedgers[]`, `CreditLedgers[]` (balanced).

```http
GET /api/tally/expenses?company_id=KLKURJA
```
Returns only **Approved + Push to Tally** software vouchers (`tally_push_status=PUSHED`).

---

## 7. Payment Voucher

**Module path:** `payments`  
**Use this for payment JSON — not `/debit-notes`.**

```http
POST /api/tally/payments?company_id=KLKURJA
```

```json
{
  "data": [
    {
      "company_id": "KLKURJA",

      "VoucherNo": "0089",
      "VoucherDate": "02/Jul/2026",
      "PaymentType": "GENERAL",
      "PaymentMode": "BANK",

      "Narration": "paid to XYZ and ABC",
      "OnAccountOf": "Against purchase bills",

      "FromCompanyName": "KLK Ventures",
      "FromCompanyAddress": "Head Office",
      "FromCompanyGstin": "07CCCCC0000C1Z5",

      "PayeeType": "COMPANY",
      "PartyName": "XYZ Pvt Ltd",
      "PartyGstin": "06AAAAA0000A1Z5",
      "PartyAddress": "Vendor address",

      "LinkedDocumentType": "PURCHASE",
      "LinkedDocumentNo": "Pur0991",

      "BankName": "HDFC Bank",
      "BankAccountNo": "9988776655",
      "BankIfsc": "HDFC0001111",
      "ReferenceNo": "UTR123456",
      "ChequeNo": "",
      "ChequeDate": "",

      "AuthorisedSignatoryName": "",
      "AuthorisedSignatoryDesignation": "",

      "DebitLedgers": [
        { "LedgerName": "XYZ Imprest A/c", "Amount": 13000 },
        { "LedgerName": "ABC Imprest A/c", "Amount": 5000 }
      ],
      "CreditLedgers": [
        { "LedgerName": "HDFC Bank", "Amount": 18000 }
      ],

      "Allocations": [
        {
          "document_type": "PURCHASE",
          "document_id": 12,
          "document_no": "Pur0991",
          "document_amount": 18000,
          "paid_amount": 18000,
          "allocation_type": "FULL",
          "remarks": ""
        }
      ]
    }
  ]
}
```

**Minimum today:** `VoucherNo`, `DebitLedgers[]`, `CreditLedgers[]` (balanced).

---

## 8. Company Master

**Module path:** `companies`

```http
POST /api/tally/companies?company_id=KLKURJA
```

```json
{
  "data": [
    {
      "company_id": "KLKURJA",

      "CompanyName": "ABC Company",
      "LedgerName": "Customer 1",
      "LedgerCode": "Cust 001",
      "LedgerGroup": "Sundry Debtors",
      "ShortName": "ABC",

      "AddLine1": "12 MG Road",
      "AddLine2": "Near Metro",
      "AddLine3": "",
      "City": "Delhi",
      "LedState": "Delhi",
      "LedCountry": "India",
      "LedgerPIN": "110001",
      "StateCode": "07",

      "ContactPerson": "ABC",
      "ContactNumber": "9999999999",
      "EmailID": "abc@gmail.com",
      "PanNumber": "AAAAA1111A",
      "GSTNumber": "07AAAAA1111A1Z1",
      "TAN": "",
      "CIN": "",
      "Status": 1,

      "BankAccounts": [
        {
          "BankName": "HDFC Bank",
          "AccountNo": "1234567890",
          "BranchName": "Connaught Place",
          "IFSC": "HDFC0001234",
          "IsPrimary": true
        }
      ]
    }
  ]
}
```

**Minimum today:** `CompanyName` or `LedgerName` (address/PIN/code auto-filled if missing).

---

## 9. Staff Expense Payments (fully paid emp expenses)

**Module path:** `expense-payments`  
**GET + PATCH only** (create stays in KLK Accounts → Pay).

```http
GET /api/tally/expense-payments?company_id=KLKURJA
PATCH /api/tally/expense-payments/{id}/pushed?company_id=KLKURJA
```

**Export shape (after Fully Paid + Push to Tally):**

```json
{
  "data": [
    {
      "id": 12,
      "company_id": "KLKURJA",
      "DataSource": "Software",
      "TallyPushStatus": "PUSHED",
      "VoucherNo": "0012",
      "VoucherDate": "02/Jul/2026",
      "Narration": "remarks | Project: Demo | Intervention: Travelling Expenses",
      "DebitLedgers": [
        { "LedgerName": "Travelling Expenses", "Amount": 13000 }
      ],
      "CreditLedgers": [
        { "LedgerName": "Cash", "Amount": 8000 },
        { "LedgerName": "UPI", "Amount": 5000 }
      ]
    }
  ]
}
```

---

## Quick API map for Tally connector

| KLK Module | Base path |
|------------|-----------|
| Purchase | `/api/tally/purchases` |
| Sales | `/api/tally/sales` |
| Credit Note | `/api/tally/credit-notes` |
| Debit Note | `/api/tally/debit-notes` |
| Delivery Challan | `/api/tally/delivery-challans` |
| Expense (Journal) | `/api/tally/expenses` |
| Payment | `/api/tally/payments` |
| Company Master | `/api/tally/companies` |
| Staff Expense Payments | `/api/tally/expense-payments` |

Every call needs: `?company_id=YOUR_TENANT_ID`  
Example tenant: `KLKURJA`

---

## Notes for Tally team

1. **Full JSON above** = target format to match software forms (parties, bank, dispatch, HSN, signatory, etc.).
2. **Current live API** still accepts the older short JSON; missing fields are filled with defaults (`NA`, empty address, etc.).
3. Prefer sending the **full** payload so KLK screens show complete data after import.
4. **GET export queue** only returns software records that are **Approved + Push to Tally** (`tally_push_status=PUSHED`). `NOT_PUSHED` does not appear in GET.
5. Payment vouchers must go to **`/payments`**, not `/debit-notes`.

---

*Document for Tally integration — KLK Expense. Software forms unchanged; this is the field contract to implement on Tally side / next API upgrade.*
