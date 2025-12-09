# Procurement-One

Extremely scrappy prototype of an application that allows vendor management and purchase order requisition workflow. We are replacing a gigantic complex horrible process.

There will be several screens to the dashboard:
- vendor management (search + create a vendor)
    - vendor creation (form with basic contact info and starts a form for the vendor to fill out (the vendor intake form))
    - vendor intake form (vendor submits a set of forms to join the vendor network)

- purchase order requisition (POR) creation
    - start with uploading a quote/statement of work (SOW)
    - takes you to a form with 13 specific fields needed, these can be partially populated by the quote/SOW
    - fake-submits the form to Dynamics 365
    - takes you back to the POR management screen

- purchase order requisition management screen
    - be able to see all the PORs that are in progress for you the requestor
    - see the current status and other data fields



## Screens

### Vendor Intake (Vendor Creation Workflow)

A. Search for Vendor
    1. Fuzzy search (e.g.: search for “robert half”, search query is “*robert half*”)
    2. See the list of results with some basic info on them
B. If Vendor doesn’t exist
    3. Axon owner answers some preliminary questions 
        1. Which Axon entity is entering this relationship
        2. Will you be sharing:
            1. Confidential Axon information with the vendor (R&D, engineering, IP)
                1. If yes → route NDA
            2. PII Axon employees or consultants or customers (human resources)
                1. If yes → route Privacy Policy
            3. The vendor has a tool that Axon is looking to purchase and that tool will host or ingest Axon data
                1. If yes → route InfoSec documents
    4. Draft email to Vendor 
        1. Form email with templates for each of the things included
            1. Here is a link to create your vendor account...
            2. When you login you’ll be required to provide these documents:
                1. <list of documents listed below under the vendor form>
            3. Portal link to Vendor form (for the vendor’s use)
    5. Axon owner edits and approves the email and hits send → will send to vendor, with a copy to Axon owner
    6. Vendor fills and uploads all information in portal. 
    7. Axon owner pushes the quote to POR workflow



### Vendor form:

* Documents to review and sign
    * Master Supplier Agreement we expect all vendors to sign. 
        * PDF to download
        * Drag-and-drop upload box to put the signed PDF back in there
    * Signed W-9 or W8 BEN-E
        * Drag and drop upload box to put a signed PDF
        * Ideal: OCR and verify there is a signature
    * Banking/Payment information
        * Fill out a form, can do validation if numbers are wrong
    * Vendor uploads quote (version controlling)
        * Drag and drop PDF
        * Ideal: OCR and extract the vendor info and line item quotes
* Submit the form and then it becomes available for POR



## Purchase order requisition 


Prototype:
- Requestor workflow only

Create POs
- 13 fields
- "send to Dynamics" mock button

Manage POs
- see all your open POs, date they were submitted, current status, total PO amount, total invoice, who is it waiting for
