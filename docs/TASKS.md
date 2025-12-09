# Tasks

## Debug Bar

Create a debug bar at the bottom of the app for development/demo purposes.

### UI
- [ ] Fixed position bar at bottom of screen (only in Layout, not VendorPortal)
- [ ] Semi-transparent dark background
- [ ] Small text, doesn't interfere with main app
- [ ] Shows "🛠 Debug" label

### Clear Data Button
- [ ] Button labeled "Clear Data"
- [ ] Calls `clearAllData()` from storage.js (already exists)
- [ ] Shows toast confirmation
- [ ] Triggers page reload to reflect empty state

### Create Data Button
- [ ] Button labeled "Create Data"
- [ ] Creates representative sample data:

**Vendors (6 total):**
| Name | Status | Notes |
|------|--------|-------|
| Acme Consulting LLC | active | All docs complete |
| Robert Half International | active | All docs complete |
| CloudSecure Technologies | pending | Missing MSA and banking |
| DataFlow Analytics Inc | incomplete | Missing most docs |
| Sterling Office Supplies | active | All docs complete |
| Apex Training Solutions | pending | Missing W-9 |

**PORs (5 total):**
| Vendor | Amount | Status | Age | Assignee |
|--------|--------|--------|-----|----------|
| Acme Consulting | $15,000 | submitted | 1 day ago | Brittany Bagley |
| Robert Half | $45,000 | approved | 5 days ago | Dave Iacovelli |
| Sterling Office | $2,500 | sent_to_dynamics | 3 days ago | Jennifer Mak |
| Acme Consulting | $8,750 | rejected | 10 days ago | Dave Iacovelli |
| Robert Half | $22,000 | submitted | 8 days ago | Brittany Bagley |

- [ ] Shows toast confirmation
- [ ] Triggers page reload to show new data
