# Tasks

## Approvals Page ✅

### Data Model Updates
- [x] Add `requestor` and `requestorEmail` fields to POR model
- [x] Update seedData.js with multiple requestors (Tom Bradley, Sarah Chen, Mike Johnson)
- [x] Create PORs from different requestors in mock data (mix of Jane's and others')
- [x] Add `pending_approval` status option

### Navigation & Routing
- [x] Add "Approvals" to nav in Layout.jsx (with icon)
- [x] Add route `/approvals` in App.jsx
- [x] Create Approvals.jsx page component
- [x] Update Dashboard with link to Approvals (with pending badge)

### Approvals Page UI (`/approvals`)

**Summary Stats (top of page):**
- [x] Card: Total pending approvals count
- [x] Card: Assigned to Jane count
- [x] Card: Overdue (8+ days) count

**Filter Controls:**
- [x] Toggle/tabs: "Assigned to Me" (default) vs "Show All"
- [x] Visual indicator of which filter is active

**Approvals Table:**
- [x] Column: Requestor Name
- [x] Column: Vendor Name
- [x] Column: Description
- [x] Column: Amount (formatted currency)
- [x] Column: Days Aged (with SLA color coding)
- [x] Column: Assigned To
- [x] Column: Actions

**Actions Column:**
- [x] "View" button → navigates to `/pors/:id`
- [x] "Approve" button (green) → quick approve with confirmation toast
- [x] "Reject" button (red) → opens modal for rejection reason

### Reject Modal
- [x] Modal with text input for rejection reason
- [x] Cancel and Confirm buttons
- [x] On confirm: update POR status to `rejected`, add `rejectionReason` field
- [x] Show toast confirmation

### Mock Data Distribution

**PORs from Jane Smith (jane.smith@axon.com):** (her own, not in approval queue)
- Q1 Strategy Consulting - $15K - approved
- Annual Engineering Staff Augmentation - $2.64M - sent_to_dynamics
- Office Equipment Refresh - $2.5K - approved

**PORs from Tom Bradley (tom.bradley@axon.com):**
- Enterprise Digital Transformation - $1.5M - submitted (assigned to Jane)
- Cloud Infrastructure Security Upgrade - $340K - submitted (assigned to Jane)

**PORs from Sarah Chen (sarah.chen@axon.com):**
- Market Research Analysis - $8.75K - rejected
- Annual Software Licenses - $125K - submitted (assigned to Jane)

**PORs from Mike Johnson (mike.johnson@axon.com):**
- Executive Assistant Placement - $22K - submitted (assigned to Jane)
- Annual Trade Show Booth - $78K - submitted (assigned to Brittany)
