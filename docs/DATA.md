# Data Entities
---
## Vendors
| Field | Type | Notes |
|-------|------|-------|
| id | string | UUID |
| name | string | Company name |
| name | string | Company DBA|
| contactEmail | string | |
| contactName | string | |
| contactName | Confirm Authorized Signer |boolean |
| contactPhoneNumber| string | |
| status | enum | `pending` \| `active` \| `incomplete` |
| axonEntity | string | Which Axon entity relationship |
| requiresNDA | boolean | |
| requiresPrivacy | boolean | |
| requiresInfoSec | boolean | |
| createdAt | date | |
| documents | object | See Documents below |

---
## Banking Info
| Field | Type | Validation |
|-------|------|------------|
| bankName | string | |
| accountHolderName | string | |
| routingNumber | string | 9 digits |
| accountNumber | string | |
| accountType | enum | `checking` \| `savings` |
---
## Purchase Order Requisitions (PORs)
| Field | Type | Notes |
|-------|------|-------|
| id | string | UUID |
| vendorId | string | FK to Vendor |
| vendorName | string | Denormalized |
| description | string | |
| amount | number | |
| currency | string | Default: USD |
| costCenter | string | |
| glAccount | string | |
| startDate | date | |
| endDate | date | |
| axonEntity | string | |
| requestorName | string | |
| requestorEmail | string | |
| justification | string | |
| status | enum | `draft` \| `submitted` \| `pending_approval` \| `approved` \| `rejected` |
| submittedAt | date | |
| createdAt | date | |
---
## Dropdown Values
### Axon Entities
- TAS
- CAN
- SEG
- AUK
### Currencies
- USD
- CAD
- EUR
- GBP
### Cost Centers (mock)
- CC-1001 Engineering
- CC-1002 Sales
- CC-1003 Marketing
- CC-1004 Operations
- CC-1005 Legal
### GL Accounts (mock)
- 6100 - Professional Services
- 6200 - Software Subscriptions
- 6300 - Hardware
- 6400 - Consulting
- 6500 - Training
---
## Mock OCR Responses
When a quote PDF is "uploaded", return hardcoded values:
```json
{
  "vendorName": "Acme Consulting LLC",
  "amount": 15000.00,
  "description": "Professional services engagement",
  "startDate": "2025-01-15",
  "endDate": "2025-06-30"
}
```
