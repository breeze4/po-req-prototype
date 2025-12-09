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

| Field | Per line? | Input Type | Help Text | Text List (if applicable) |
|-------|-----------|------------|-----------|---------------------------|
| Name (Description) | | Text | The system creates a name automatically. You can rename it for your own tracking, but everyone else will refer to the PR number. | |
| Cost Center | | Text list | Choose the cost center that will be charged. Incorrect values are the #1 reason for PR rejection. Visible on your profile in Workday. | |
| Profit Center | | Text list | Select the matching profit center for your cost center. This ensures expenses roll up correctly for FP&A. | |
| Project Code | | Text | Used only when the spend is tied to a project budget. Not required for typical indirect purchases. | |
| Country | | Text list | Select the country where the good or service originated. Required for compliance and correct processing. | USA - United States; ABW - Aruba; AFG - Afghanistan; ARE - United Arab Emirates |
| Attachments | | Text | You must attach supporting documents—SOW, quote, contract, invoice, or proposal. | |

### Line Items Instances Per Line

| Field | Per line? | Input Type | Help Text | Text List (if applicable) |
|-------|-----------|------------|-----------|---------------------------|
| Line | Y | Sequence generated | Line number | |
| Product name | Y | Text | Write a clear description of what you're buying. Vendors see this directly, so include detail if needed (SKU, service description, etc.). | |
| Line amount | Y | Currency | Total Cost is how Axon handles non-inventory spend by line. Please include projected tax amount per line. | |
| Category | Y | Text | Choose the category that best matches what you are buying. | |
| Currency | Y | Text list | Defaults to vendor currency. | USD; VND; GBP; EUR; CAD; MXN; SGD |
| Purpose Code | Y | Text | Optional coding that indicates the purpose of the spend. Use only if your team regularly tracks this dimension. | |
| Vendor name | Y | Text | Vendor contracted for spend | |
| Vendor key/ID | Y | Text | Unique ID for vendor | |
| Start date | Y | Text | For services, enter when work begins. Required for all service lines. | |
| End date | Y | Text | Enter when work ends. Required for timing and PO closure rules. | |
| Billing frequency | Y | Text list | Choose how often you expect to be billed (Monthly, Annual, Upfront, etc.). This ensures payment terms align with AP processing. | Upfront; Deposit; Upon Completion; Upon Delivery; Milestone (Only if noted in legal contract); Paid by CC; Weekly; Monthly; Quarterly; Annual |

### Totals Section

| Field | Per line? | Input Type | Help Text | Text List (if applicable) |
|-------|-----------|------------|-----------|---------------------------|
| Net amount | | Total minus charges and sales tax | Total of all line costs. Auto-calculated. | |
| Total amount | | Calculated total cost | Final total cost. Auto-calculated. | |

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
