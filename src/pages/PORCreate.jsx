import { ArrowLeft, FileText, Plus, Send, Trash2, Upload } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getVendor, getVendors, savePOR } from '../lib/storage'
import { useCallback, useState } from 'react'

import { toast } from 'sonner'

// Dropdown options from DATA.md
const COST_CENTERS = [
  'CC-1001 Engineering',
  'CC-1002 Sales',
  'CC-1003 Marketing',
  'CC-1004 Operations',
  'CC-1005 Legal',
]

const PROFIT_CENTERS = [
  'PC-1001 Engineering',
  'PC-1002 Sales',
  'PC-1003 Marketing',
  'PC-1004 Operations',
  'PC-1005 Legal',
]

const COUNTRIES = [
  'USA - United States',
  'ABW - Aruba',
  'AFG - Afghanistan',
  'ARE - United Arab Emirates',
  'CAN - Canada',
  'GBR - United Kingdom',
  'MEX - Mexico',
]

const CURRENCIES = ['USD', 'VND', 'GBP', 'EUR', 'CAD', 'MXN', 'SGD']

const CATEGORIES = [
  '6100 - Professional Services',
  '6200 - Software Subscriptions',
  '6300 - Hardware',
  '6400 - Consulting',
  '6500 - Training',
]

const BILLING_FREQUENCIES = [
  'Upfront',
  'Deposit',
  'Upon Completion',
  'Upon Delivery',
  'Milestone (Only if noted in legal contract)',
  'Paid by CC',
  'Weekly',
  'Monthly',
  'Quarterly',
  'Annual',
]

// Mock OCR response
const MOCK_OCR_RESPONSE = {
  vendorName: 'Acme Consulting LLC',
  amount: 15000.0,
  description: 'Professional services engagement',
  startDate: '2025-01-15',
  endDate: '2025-06-30',
}

// Assignees for POR workflow
const ASSIGNEES = ['Brittany Bagley', 'Dave Iacovelli', 'Jennifer Mak']

function getRandomAssignee() {
  return ASSIGNEES[Math.floor(Math.random() * ASSIGNEES.length)]
}

function createEmptyLineItem(lineNumber) {
  return {
    id: crypto.randomUUID(),
    line: lineNumber,
    productName: '',
    lineAmount: '',
    category: '',
    currency: 'USD',
    purposeCode: '',
    vendorName: '',
    vendorKey: '',
    startDate: '',
    endDate: '',
    billingFrequency: '',
  }
}

export default function PORCreate() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const vendorIdParam = searchParams.get('vendorId')

  const [vendors] = useState(() => getVendors().filter(v => v.status === 'active'))
  const [selectedVendorId, setSelectedVendorId] = useState(vendorIdParam || '')
  const [quoteFile, setQuoteFile] = useState(null)
  const [ocrComplete, setOcrComplete] = useState(false)
  const [isProcessingOcr, setIsProcessingOcr] = useState(false)

  // Header fields
  const [name, setName] = useState('')
  const [costCenter, setCostCenter] = useState('')
  const [profitCenter, setProfitCenter] = useState('')
  const [projectCode, setProjectCode] = useState('')
  const [country, setCountry] = useState('USA - United States')
  const [attachments, setAttachments] = useState('')

  // Line items - pre-fill vendor info if coming from vendor detail page
  const [lineItems, setLineItems] = useState(() => {
    const initialItem = createEmptyLineItem(1)
    if (vendorIdParam) {
      const vendor = getVendor(vendorIdParam)
      if (vendor) {
        return [{ ...initialItem, vendorName: vendor.name, vendorKey: vendor.id }]
      }
    }
    return [initialItem]
  })

  // Validation errors
  const [errors, setErrors] = useState({})

  // Calculate totals
  const netAmount = lineItems.reduce((sum, item) => {
    const amount = parseFloat(item.lineAmount) || 0
    return sum + amount
  }, 0)

  const totalAmount = netAmount // Could add tax/fees here if needed

  // Handle file upload with mock OCR
  const handleFileUpload = useCallback((file) => {
    setQuoteFile(file)
    setIsProcessingOcr(true)

    // Simulate OCR processing delay
    setTimeout(() => {
      setIsProcessingOcr(false)
      setOcrComplete(true)

      // Pre-fill form with mock OCR data
      setName(MOCK_OCR_RESPONSE.description)
      setLineItems(prev => prev.map((item, idx) =>
        idx === 0
          ? {
              ...item,
              productName: MOCK_OCR_RESPONSE.description,
              lineAmount: MOCK_OCR_RESPONSE.amount.toString(),
              vendorName: MOCK_OCR_RESPONSE.vendorName,
              startDate: MOCK_OCR_RESPONSE.startDate,
              endDate: MOCK_OCR_RESPONSE.endDate,
            }
          : item
      ))

      toast.success('OCR complete! Form pre-filled with extracted data.')
    }, 1500)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      handleFileUpload(file)
    }
  }, [handleFileUpload])

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }, [handleFileUpload])

  // Line item management
  const addLineItem = () => {
    setLineItems(prev => [...prev, createEmptyLineItem(prev.length + 1)])
  }

  const removeLineItem = (id) => {
    if (lineItems.length > 1) {
      setLineItems(prev => {
        const filtered = prev.filter(item => item.id !== id)
        return filtered.map((item, idx) => ({ ...item, line: idx + 1 }))
      })
    }
  }

  const updateLineItem = (id, field, value) => {
    setLineItems(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  // Validation
  const validateForm = () => {
    const newErrors = {}

    if (!selectedVendorId) newErrors.vendor = 'Please select a vendor'
    if (!name.trim()) newErrors.name = 'Name/Description is required'
    if (!costCenter) newErrors.costCenter = 'Cost Center is required'
    if (!profitCenter) newErrors.profitCenter = 'Profit Center is required'
    if (!country) newErrors.country = 'Country is required'

    // Validate line items
    lineItems.forEach((item, idx) => {
      if (!item.productName.trim()) {
        newErrors[`line_${idx}_productName`] = 'Product name is required'
      }
      if (!item.lineAmount || parseFloat(item.lineAmount) <= 0) {
        newErrors[`line_${idx}_lineAmount`] = 'Valid amount is required'
      }
      if (!item.category) {
        newErrors[`line_${idx}_category`] = 'Category is required'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit POR
  const handleSubmit = (sendToDynamics = false) => {
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting.')
      return
    }

    const vendor = getVendor(selectedVendorId)
    const por = {
      id: `POR-${crypto.randomUUID().slice(0, 8)}`,
      vendorId: selectedVendorId,
      vendorName: vendor?.name || '',
      name,
      description: name,
      costCenter,
      profitCenter,
      projectCode,
      country,
      attachments,
      lineItems,
      netAmount,
      totalAmount,
      currency: lineItems[0]?.currency || 'USD',
      status: sendToDynamics ? 'sent_to_dynamics' : 'submitted',
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      createdBy: 'jane.smith@axon.com',
      requestor: 'Jane Smith',
      requestorEmail: 'jane.smith@axon.com',
      assignee: getRandomAssignee(),
    }

    savePOR(por)

    if (sendToDynamics) {
      toast.success('✅ POR sent to Dynamics 365 successfully!')
      console.log('📊 Dynamics 365 Integration (MOCKED):', por)
    } else {
      toast.success('POR saved successfully!')
    }

    setTimeout(() => navigate('/pors'), 1500)
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <Link
          to="/pors"
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={16} />
          Back to PORs
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Create Purchase Order Requisition</h1>
        <p className="mt-1 text-slate-600">Upload quote and fill out the required fields</p>
      </div>

      {/* Vendor Selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Select Vendor</h2>
        <div>
          <select
            value={selectedVendorId}
            onChange={(e) => {
              setSelectedVendorId(e.target.value)
              const vendor = getVendor(e.target.value)
              if (vendor) {
                setLineItems(prev => prev.map((item, idx) =>
                  idx === 0 ? { ...item, vendorName: vendor.name, vendorKey: vendor.id } : item
                ))
              }
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${errors.vendor ? 'border-red-500' : 'border-slate-200'}`}
          >
            <option value="">Select a vendor...</option>
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name} ({vendor.status})
              </option>
            ))}
          </select>
          {errors.vendor && <p className="mt-1 text-sm text-red-600">{errors.vendor}</p>}
          {vendors.length === 0 && (
            <p className="mt-2 text-sm text-amber-600">
              No active vendors available.{' '}
              <Link to="/vendors/new" className="underline">Create a vendor first</Link>.
            </p>
          )}
        </div>
      </div>

      {/* Step 1: Upload Quote */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Step 1: Upload Quote (Optional)</h2>

        {!quoteFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400 transition-colors"
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
              id="quote-upload"
            />
            <label htmlFor="quote-upload" className="cursor-pointer">
              <Upload className="mx-auto text-slate-400" size={32} />
              <p className="mt-2 text-slate-600">Drag and drop quote PDF here, or click to browse</p>
              <p className="mt-1 text-sm text-slate-500">OCR will extract data to pre-fill the form</p>
            </label>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <FileText className="text-slate-600" size={24} />
            <div className="flex-1">
              <p className="font-medium text-slate-900">{quoteFile.name}</p>
              {isProcessingOcr ? (
                <p className="text-sm text-blue-600">🔍 Processing OCR...</p>
              ) : ocrComplete ? (
                <p className="text-sm text-emerald-600">✓ OCR complete - form pre-filled</p>
              ) : null}
            </div>
            <button
              onClick={() => {
                setQuoteFile(null)
                setOcrComplete(false)
              }}
              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Step 2: Header Fields */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Step 2: POR Details</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name (Description) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
              placeholder="Brief description of the purchase"
            />
            <p className="mt-1 text-xs text-slate-500">The system creates a name automatically. You can rename it for your own tracking.</p>
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cost Center <span className="text-red-500">*</span>
            </label>
            <select
              value={costCenter}
              onChange={(e) => setCostCenter(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${errors.costCenter ? 'border-red-500' : 'border-slate-200'}`}
            >
              <option value="">Select cost center...</option>
              {COST_CENTERS.map(cc => (
                <option key={cc} value={cc}>{cc}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">Incorrect values are the #1 reason for PR rejection.</p>
            {errors.costCenter && <p className="mt-1 text-sm text-red-600">{errors.costCenter}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Profit Center <span className="text-red-500">*</span>
            </label>
            <select
              value={profitCenter}
              onChange={(e) => setProfitCenter(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${errors.profitCenter ? 'border-red-500' : 'border-slate-200'}`}
            >
              <option value="">Select profit center...</option>
              {PROFIT_CENTERS.map(pc => (
                <option key={pc} value={pc}>{pc}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">Ensures expenses roll up correctly for FP&A.</p>
            {errors.profitCenter && <p className="mt-1 text-sm text-red-600">{errors.profitCenter}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Code</label>
            <input
              type="text"
              value={projectCode}
              onChange={(e) => setProjectCode(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Optional"
            />
            <p className="mt-1 text-xs text-slate-500">Used only when tied to a project budget.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${errors.country ? 'border-red-500' : 'border-slate-200'}`}
            >
              <option value="">Select country...</option>
              {COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Attachments</label>
            <input
              type="text"
              value={attachments}
              onChange={(e) => setAttachments(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="List any supporting documents (SOW, contract, invoice, etc.)"
            />
            <p className="mt-1 text-xs text-slate-500">You must attach supporting documents—SOW, quote, contract, invoice, or proposal.</p>
          </div>
        </div>
      </div>

      {/* Step 3: Line Items */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Step 3: Line Items</h2>
          <button
            onClick={addLineItem}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Plus size={16} />
            Add Line
          </button>
        </div>

        <div className="space-y-6">
          {lineItems.map((item, idx) => (
            <div key={item.id} className="border border-slate-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Line {item.line}</span>
                {lineItems.length > 1 && (
                  <button
                    onClick={() => removeLineItem(item.id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={item.productName}
                    onChange={(e) => updateLineItem(item.id, 'productName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${errors[`line_${idx}_productName`] ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="Description of item/service"
                  />
                  {errors[`line_${idx}_productName`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`line_${idx}_productName`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Line Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.lineAmount}
                    onChange={(e) => updateLineItem(item.id, 'lineAmount', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${errors[`line_${idx}_lineAmount`] ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="0.00"
                  />
                  {errors[`line_${idx}_lineAmount`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`line_${idx}_lineAmount`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={item.category}
                    onChange={(e) => updateLineItem(item.id, 'category', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${errors[`line_${idx}_category`] ? 'border-red-500' : 'border-slate-200'}`}
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors[`line_${idx}_category`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`line_${idx}_category`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                  <select
                    value={item.currency}
                    onChange={(e) => updateLineItem(item.id, 'currency', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {CURRENCIES.map(cur => (
                      <option key={cur} value={cur}>{cur}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Purpose Code</label>
                  <input
                    type="text"
                    value={item.purposeCode}
                    onChange={(e) => updateLineItem(item.id, 'purposeCode', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Name</label>
                  <input
                    type="text"
                    value={item.vendorName}
                    onChange={(e) => updateLineItem(item.id, 'vendorName', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Vendor name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Key/ID</label>
                  <input
                    type="text"
                    value={item.vendorKey}
                    onChange={(e) => updateLineItem(item.id, 'vendorKey', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Vendor ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={item.startDate}
                    onChange={(e) => updateLineItem(item.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={item.endDate}
                    onChange={(e) => updateLineItem(item.id, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Billing Frequency</label>
                  <select
                    value={item.billingFrequency}
                    onChange={(e) => updateLineItem(item.id, 'billingFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="">Select frequency...</option>
                    {BILLING_FREQUENCIES.map(freq => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-slate-200 pt-4 mt-4">
          <div className="flex justify-end gap-8">
            <div className="text-right">
              <p className="text-sm text-slate-500">Net Amount</p>
              <p className="text-lg font-semibold text-slate-900">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: lineItems[0]?.currency || 'USD' }).format(netAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Total Amount</p>
              <p className="text-2xl font-bold text-slate-900">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: lineItems[0]?.currency || 'USD' }).format(totalAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: Submit */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Step 4: Review & Submit</h2>
        <p className="text-sm text-slate-600">
          Review all information above, then submit your POR. You can optionally send directly to Dynamics 365.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => handleSubmit(false)}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Save as Submitted
          </button>
          <button
            onClick={() => handleSubmit(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Send size={16} />
            Send to Dynamics
          </button>
        </div>
      </div>
    </div>
  )
}
