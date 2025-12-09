# Tasks

## ✅ Completed

All screens from the spec have been fully implemented:

### Dashboard (`/`)
- [x] Links to Vendors and PORs

### Vendor List (`/vendors`)
- [x] Fuzzy search with Fuse.js
- [x] Show results with name, status, contact email
- [x] "Add Vendor" button

### Vendor Create (`/vendors/new`)
- [x] Vendor information form (name, DBA, contact, phone, Axon entity)
- [x] Preliminary questions (NDA, Privacy, InfoSec checkboxes)
- [x] Navigate to Email Preview on submit

### Email Preview (`/vendors/:id/email`)
- [x] Auto-generated email template based on requirements
- [x] Portal link included
- [x] List of required documents based on preliminary answers
- [x] Editable email body
- [x] Modal confirmation (mocked send)
- [x] Updates vendor status to "pending"

### Vendor Portal (`/portal/:vendorId`)
- [x] Master Supplier Agreement - Download (toast), upload (stores filename)
- [x] W-9 / W8 BEN-E - Upload with signature detection (1s delay)
- [x] Banking Information - Form with 9-digit routing validation
- [x] Quote - Upload with mock OCR extraction
- [x] Progress indicator
- [x] Submit → vendor becomes "active"

### Vendor Detail (`/vendors/:id`)
- [x] View vendor info and status
- [x] Document status checklist
- [x] Compliance requirements badges
- [x] Portal link with copy button
- [x] "Send Email" and "Create POR" actions

### POR List (`/pors`)
- [x] Load PORs from localStorage and display in table
- [x] Show columns: Vendor Name, Description, Amount, Status, Submitted Date
- [x] Add View action link to POR detail page
- [x] Format amount as currency and date nicely

### POR Create (`/pors/new`)
- [x] Add vendor selector dropdown (or pre-fill from `vendorId` query param)
- [x] Implement quote upload dropzone with file input
- [x] Add mock OCR that returns hardcoded values after upload
- [x] Build header fields form: Name, Cost Center, Profit Center, Project Code, Country, Attachments
- [x] Build line items section with add/remove functionality
- [x] Line item fields: Product name, Line amount, Category, Currency, Purpose Code, Vendor name, Vendor key, Start date, End date, Billing frequency
- [x] Add auto-calculated Net amount and Total amount
- [x] Add form validation for required fields
- [x] Implement submit that saves POR to localStorage
- [x] Add "Send to Dynamics" button with mock success toast
- [x] Redirect to POR list after successful submission

### POR Detail (`/pors/:id`)
- [x] Load POR data from localStorage by ID
- [x] Display all header fields (read-only)
- [x] Display all line items (read-only)
- [x] Show totals section
- [x] Wire up Approve/Reject buttons to update status in localStorage
- [x] Show toast on status change

### Infrastructure
- [x] Hardcoded user "Jane Smith" in header
- [x] All data in localStorage
- [x] Sonner toasts configured throughout
- [x] react-dropzone for file uploads
- [x] Fuse.js for fuzzy search

