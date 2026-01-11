# PORtal

A prototype for vendor management and purchase order requisition (POR) workflow.

**Live demo:** https://axon-po-req-prototype.netlify.app

## Prototype Notice

This is a UI prototype only. There is no backend, database, or external API integration.

All data is stored in browser localStorage and resets when cleared. The app includes mock data that seeds automatically on first load.

### Mocked Features

| Feature | Behavior |
|---------|----------|
| Email sending | Shows content in modal, nothing sent |
| PDF downloads | Toast notification, no file generated |
| File uploads | Stores filename only, no actual upload |
| OCR extraction | Returns hardcoded values |
| Signature detection | Always succeeds after 1s delay |
| Send to Dynamics | Updates local status only |

### Hardcoded User

The app assumes you are logged in as Jane Smith (jane.smith@axon.com), who acts as both a requestor and approver.

## Running Locally

```bash
npm install
npm run dev
```

## Tech Stack

React 19, Vite, Tailwind CSS 4, React Router 7
