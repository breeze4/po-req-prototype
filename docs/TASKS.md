# Tasks

## POR Screens

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
