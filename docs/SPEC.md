# Procurement-One

Scrappy prototype for vendor management and purchase order requisition (POR) workflow. Replaces a gigantic complex horrible process.

**Prototype constraints:**
- All data in localStorage
- Hardcoded user: "Jane Smith" / jane.smith@axon.com

**Mocked behaviors:**
- 📧 **Email sending** — shows content in modal, no actual email sent
- 📄 **PDF downloads** — button click shows toast "PDF downloaded" (no real file)
- 📤 **File uploads** — dropzone accepts files but just stores filename + timestamp in localStorage
- 🔍 **OCR extraction** — returns hardcoded values regardless of uploaded file
- ✍️ **Signature detection** — always returns "signature detected" after 1s delay
- 🏦 **Banking validation** — basic format checks only (9-digit routing, etc.)
- 📊 **Dynamics 365** — "Send to Dynamics" shows success toast, updates status locally
- ⏳ **Status progression** — POR status changes are manual buttons in prototype (not real workflow)

---

## Navigation

- **Dashboard** — home with links to Vendors and PORs
- **Vendors** — list, search, create
- **PORs** — list, create, view

---

## Screens

| # | Screen | Route | Description |
|---|--------|-------|-------------|
| 1 | Dashboard | `/` | Links to Vendors and PORs |
| 2 | Vendor List | `/vendors` | Search + results + "Add Vendor" button |
| 3 | Vendor Create | `/vendors/new` | Preliminary questions form |
| 4 | Email Preview | `/vendors/:id/email` | Edit and send invite email to vendor |
| 5 | Vendor Portal | `/portal/:vendorId` | Vendor's view — upload documents (no auth) |
| 6 | Vendor Detail | `/vendors/:id` | View vendor status, docs, start POR |
| 7 | POR Create | `/pors/new?vendorId=` | Upload quote → fill form → submit |
| 8 | POR List | `/pors` | Table of all PORs with status |
| 9 | POR Detail | `/pors/:id` | View submitted POR (read-only) |

---

## Vendor Intake Workflow

### A. Search for Vendor
1. Fuzzy search (e.g., "robert half")
2. Show results with: name, status, contact email

### B. Create New Vendor (if not found)

**Step 1: Preliminary Questions**
- Which Axon entity is entering this relationship?
- Will you be sharing (these should be simple yes/no checkboxes that flags this for further review or skips the review):
  - Confidential Axon info (R&D, engineering, IP)? → requires NDA
  - PII of employees/consultants/customers? → requires Privacy Policy
  - Vendor tool will host/ingest Axon data? → requires InfoSec review

**Step 2: Email Preview**
- Auto-generated email template with:
  - Portal link for vendor
  - List of required documents based on preliminary answers
- Axon owner can edit, then hits "Send"
- 📧 *MOCKED: Email content shown in modal, logged to console*

**Step 3: Vendor Completes Portal**
- Vendor receives link, fills out Vendor Form (see below)

**Step 4: Ready for POR**
- Once vendor submits, Axon owner can create POR

---

## Vendor Portal Form

Vendor fills this out after receiving invite email.

| Section | Details | Mock Behavior |
|---------|---------|---------------|
| **Master Supplier Agreement** | Download PDF, upload signed copy | 📄 Download = toast only; 📤 Upload = stores filename |
| **W-9 or W8 BEN-E** | Upload signed PDF | 📤 Stores filename; ✍️ "Signature detected" after 1s |
| **Banking Info** | Form: bank name, routing #, account #, type | 🏦 Basic format validation only |
| **Quote** | Upload PDF | 📤 Stores filename; 🔍 Returns hardcoded OCR data |

Submit → vendor status becomes "active", available for POR.

---

## Purchase Order Requisition (POR)

### Create POR

**Flow:** Upload quote → Fill 13 fields → Review & Submit

1. Select vendor (or start from Vendor Detail page)
2. Upload quote PDF — 🔍 *MOCKED: OCR returns hardcoded values to pre-fill fields*
3. Fill/edit 13 fields (see DATA.md)
4. Review and submit
5. "Send to Dynamics" button — 📊 *MOCKED: Shows success toast, saves to localStorage*
6. Redirect to POR List

### POR List

Table columns:
- Vendor Name
- Description
- Amount
- Status
- Submitted Date
- Actions (View)

### POR Detail

Read-only view of all 13 fields.

⏳ *MOCKED: Status can be manually changed via buttons (Approve/Reject) for demo purposes*
