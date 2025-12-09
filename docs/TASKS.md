# Tasks

## Phase 1: Initial Setup & Routing ✅
*Completed*

---

## Phase 2: Vendor List & Search ✅

Use docs/DATA.md vendor data types to fill this out

### 2.1 Data Layer ✅
- [x] Create `src/lib/storage.js` — localStorage helpers (getVendors, saveVendor, etc.)
- [x] Create `src/lib/seedData.js` — mock vendors to populate on first load (6 vendors)

### 2.2 Fuzzy Search ✅
- [x] Set up Fuse.js in VendorList page
- [x] Search on: name, dba, contactName, contactEmail
- [x] Show results as user types (no submit button)

### 2.3 Vendor List UI ✅
- [x] Display vendor cards with: name, DBA, status badge, contact name, contact email
- [x] Link each result to `/vendors/:id` (Vendor Detail)
- [x] Empty state when no results match search
- [x] "Add Vendor" button links to `/vendors/new`
- [x] Result count when filtering

---

## Phase 3: Vendor Create Workflow

### 3.1 VendorCreate Page — Preliminary Questions Form ✅
- [x] Vendor info fields: name, DBA, contact name, contact email, contact phone
- [x] Axon entity dropdown (TAS, CAN, SEG, AUK)
- [x] Three yes/no checkboxes:
  - Sharing confidential Axon info? → requiresNDA
  - Sharing PII? → requiresPrivacy
  - Vendor tool hosts Axon data? → requiresInfoSec
- [x] "Continue to Email Preview" button — saves vendor (status: incomplete), navigates to `/vendors/:id/email`

### 3.2 EmailPreview Page — Compose Invite Email ✅
- [x] Pre-filled email fields: To (vendor email), Subject, Body
- [x] Auto-generate email body with:
  - Portal link (`/portal/:vendorId`)
  - List of required documents based on NDA/Privacy/InfoSec flags
- [x] Editable textarea for body
- [x] Copy portal link button
- [x] "Send Email" button — shows modal with email content, updates vendor status to `pending`, navigates to vendor detail

### 3.3 VendorDetail Page — View Vendor ✅
- [x] Display vendor info (name, DBA, contact, entity, created date)
- [x] Compliance requirements badges (NDA, Privacy, InfoSec)
- [x] Document checklist with status icons (pending/complete)
- [x] Actions: "Send/Resend Email" link, "Create POR" button
- [x] Portal link with copy button

---

## Phase 4: Vendor Portal
*TBD*
