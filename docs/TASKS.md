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
*TBD*

## Phase 4: Vendor Portal
*TBD*

## Phase 5: POR Workflows
*TBD*
