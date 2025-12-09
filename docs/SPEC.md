# Procurement-One

Scrappy prototype for vendor management and purchase order requisition (POR) workflow. Replaces a gigantic complex horrible process.

**Prototype constraints:**
- All data in localStorage
- Hardcoded user: "Jane Smith" / jane.smith@axon.com (logged-in approver)
- Multiple requestors exist in mock data (Jane sees their PORs in Approvals queue)

**Mocked behaviors:**
- 📧 **Email sending** — shows content in modal, no actual email sent
- 📄 **PDF downloads** — button click shows toast "PDF downloaded" (no real file)
- 📤 **File uploads** — dropzone accepts files but just stores filename + timestamp in localStorage
- 🔍 **OCR extraction** — returns hardcoded values regardless of uploaded file
- ✍️ **Signature detection** — always returns "signature detected" after 1s delay
- 🏦 **Banking validation** — basic format checks only (9-digit routing, etc.)
- 📊 **Dynamics 365** — "Send to Dynamics" shows success toast, updates status locally
- ⏳ **Status progression** — POR status changes are manual buttons in prototype (not real workflow)
- 👥 **Multi-user** — mock data includes PORs from multiple requestors; Jane Smith acts as approver

---

## Navigation

- **Dashboard** — home with links to Vendors, PORs, and Approvals
- **Vendors** — list, search, create
- **PORs** — list, create, view (Jane's own PORs)
- **Approvals** — queue of PORs pending Jane's approval (from all requestors)

---

## Screens

| # | Screen | Route | Description |
|---|--------|-------|-------------|
| 1 | Dashboard | `/` | Links to Vendors, PORs, and Approvals |
| 2 | Vendor List | `/vendors` | Search + results + "Add Vendor" button |
| 3 | Vendor Create | `/vendors/new` | Preliminary questions form |
| 4 | Email Preview | `/vendors/:id/email` | Edit and send invite email to vendor |
| 5 | Vendor Portal | `/portal/:vendorId` | Vendor's view — upload documents (no auth) |
| 6 | Vendor Detail | `/vendors/:id` | View vendor status, docs, start POR |
| 7 | POR Create | `/pors/new?vendorId=` | Upload quote → fill form → submit |
| 8 | POR List | `/pors` | Table of all PORs with status |
| 9 | POR Detail | `/pors/:id` | View submitted POR (read-only) |
| 10 | Approvals | `/approvals` | Queue of PORs awaiting approval |

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
- Days Aged (with SLA color coding)
- Assigned To
- Actions (View)

### POR Detail

Read-only view of all 13 fields.

⏳ *MOCKED: Status can be manually changed via buttons (Approve/Reject) for demo purposes*

---

## Approvals Workflow

Jane Smith acts as an approver and sees PORs submitted by other requestors in her approval queue.

### Requestors (Mock Data)

| Name | Email | Role |
|------|-------|------|
| Jane Smith | jane.smith@axon.com | Requestor + Approver (logged-in user) |
| Tom Bradley | tom.bradley@axon.com | Requestor |
| Sarah Chen | sarah.chen@axon.com | Requestor |
| Mike Johnson | mike.johnson@axon.com | Requestor |

### Approvals Queue (`/approvals`)

Shows all PORs with status `submitted` or `pending_approval` from ALL requestors.

**Table columns:**
- Requestor Name
- Vendor Name
- Description
- Amount
- Days Aged (with SLA color coding)
- Assigned To
- Actions (View / Quick Approve / Quick Reject)

**Filtering:**
- Default: Shows only items assigned to Jane Smith
- Toggle: "Show All" to see entire queue

**Summary Stats (top of page):**
- Total pending approvals
- Items assigned to Jane
- Items overdue (8+ days)

### Approval Actions

From the Approvals list, Jane can:
1. **View** — Opens POR Detail page
2. **Quick Approve** — Approves directly from list (with confirmation)
3. **Quick Reject** — Rejects directly from list (requires reason in modal)

On approval/rejection:
- Status updates to `approved` or `rejected`
- Toast confirmation shown
- Item removed from queue (or visually marked as actioned)
