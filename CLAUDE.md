# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## About This Project

PORtal is a prototype for vendor management and purchase order requisition (POR) workflow at Axon. It replaces a complex procurement process with a streamlined web interface.

Key constraints:
- All data stored in localStorage (no backend)
- Hardcoded logged-in user: Jane Smith (jane.smith@axon.com) who acts as both requestor and approver
- Many features are mocked (email, PDF, OCR, file uploads)

## Architecture

React 19 + Vite + Tailwind CSS 4 + React Router 7 single-page application.

### Data Layer (`src/lib/`)
- `storage.js` - localStorage CRUD for vendors and PORs (keys: `procurement_vendors`, `procurement_pors`)
- `seedData.js` - Mock data with 6 vendors and 9 PORs from 4 requestors; auto-seeds on app load

### Routing (`src/App.jsx`)
Two layout patterns:
- `/portal/:vendorId` - Standalone vendor portal (no nav)
- All other routes - Wrapped in `Layout` component with navigation

### Key Screens
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Dashboard | Home with links to main sections |
| `/vendors` | VendorList | Search vendors (Fuse.js fuzzy search) |
| `/vendors/new` | VendorCreate | Preliminary questions form |
| `/vendors/:id` | VendorDetail | View vendor, start POR |
| `/vendors/:id/email` | EmailPreview | Edit/send vendor invite |
| `/portal/:vendorId` | VendorPortal | Vendor's self-service upload portal |
| `/pors` | PORList | Table of all PORs |
| `/pors/new` | PORCreate | Multi-step POR creation |
| `/pors/:id` | PORDetail | Read-only POR view |
| `/approvals` | Approvals | Queue of pending approvals |

### Approval Routing
PORs are assigned to approvers based on total amount:
- Over $1M → Brittany Bagley
- $250K-$1M → Dave Iacovelli
- Under $250K → Jennifer Mak

### Data Schemas
See `docs/DATA.md` for complete field definitions for Vendors, Banking Info, PORs (with line items), and dropdown values (Axon entities, currencies, cost centers, GL accounts).

### Mocked Behaviors
These features show UI but don't perform real operations:
- Email sending (modal preview only)
- PDF downloads (toast notification)
- File uploads (stores filename + timestamp)
- OCR extraction (returns hardcoded values from `docs/DATA.md`)
- Signature detection (always succeeds after 1s delay)
- "Send to Dynamics" (updates local status only)
