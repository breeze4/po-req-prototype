import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { 
  Upload, Download, FileCheck, CheckCircle, 
  Loader2, FileText, AlertCircle 
} from 'lucide-react'
import { getVendor, saveVendor } from '../lib/storage'

// Mock OCR response
const MOCK_OCR_DATA = {
  vendorName: "Acme Consulting LLC",
  amount: 15000.00,
  description: "Professional services engagement",
  startDate: "2025-01-15",
  endDate: "2025-06-30"
}

function FileDropzone({ onDrop, accept, children, disabled }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    disabled,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-slate-900 bg-slate-50' : 'border-slate-300 hover:border-slate-400'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      {children}
    </div>
  )
}

function SectionStatus({ complete }) {
  if (complete) {
    return (
      <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
        <CheckCircle size={16} />
        Complete
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 text-amber-600 text-sm font-medium">
      <AlertCircle size={16} />
      Required
    </span>
  )
}

export default function VendorPortal() {
  const { vendorId } = useParams()
  const [vendor, setVendor] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  
  // Section states
  const [msaFile, setMsaFile] = useState(null)
  const [w9File, setW9File] = useState(null)
  const [w9Checking, setW9Checking] = useState(false)
  const [w9SignatureDetected, setW9SignatureDetected] = useState(false)
  const [quoteFile, setQuoteFile] = useState(null)
  const [ocrData, setOcrData] = useState(null)
  
  const [banking, setBanking] = useState({
    bankName: '',
    accountHolderName: '',
    routingNumber: '',
    accountNumber: '',
    accountType: 'checking',
  })
  const [bankingErrors, setBankingErrors] = useState({})

  useEffect(() => {
    const v = getVendor(vendorId)
    if (v) {
      setVendor(v)
      // Pre-populate if already submitted
      if (v.documents?.msaSigned) setMsaFile({ name: 'msa_signed.pdf' })
      if (v.documents?.w9Uploaded) {
        setW9File({ name: 'w9_signed.pdf' })
        setW9SignatureDetected(true)
      }
      if (v.documents?.quoteUploaded) setQuoteFile({ name: 'quote.pdf' })
      if (v.documents?.bankingComplete) {
        setBanking(v.banking || banking)
      }
      if (v.status === 'active') setSubmitted(true)
    }
  }, [vendorId])

  // MSA handlers
  const handleDownloadMSA = () => {
    toast.success('📄 MSA PDF downloaded (mocked)')
  }

  const onMsaDrop = useCallback((files) => {
    if (files[0]) {
      setMsaFile({ name: files[0].name, uploadedAt: new Date().toISOString() })
      toast.success('MSA uploaded successfully')
    }
  }, [])

  // W-9 handlers with signature detection
  const onW9Drop = useCallback((files) => {
    if (files[0]) {
      setW9File({ name: files[0].name, uploadedAt: new Date().toISOString() })
      setW9Checking(true)
      setW9SignatureDetected(false)
      
      // Mock signature detection after 1 second
      setTimeout(() => {
        setW9Checking(false)
        setW9SignatureDetected(true)
        toast.success('✍️ Signature detected')
      }, 1000)
    }
  }, [])

  // Quote handlers with mock OCR
  const onQuoteDrop = useCallback((files) => {
    if (files[0]) {
      setQuoteFile({ name: files[0].name, uploadedAt: new Date().toISOString() })
      
      // Mock OCR extraction after brief delay
      setTimeout(() => {
        setOcrData(MOCK_OCR_DATA)
        toast.success('🔍 Quote data extracted')
      }, 500)
    }
  }, [])

  // Banking handlers
  const handleBankingChange = (e) => {
    const { name, value } = e.target
    setBanking(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (bankingErrors[name]) {
      setBankingErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validateBanking = () => {
    const errors = {}
    if (!banking.bankName.trim()) errors.bankName = 'Required'
    if (!banking.accountHolderName.trim()) errors.accountHolderName = 'Required'
    if (!banking.routingNumber.trim()) {
      errors.routingNumber = 'Required'
    } else if (!/^\d{9}$/.test(banking.routingNumber)) {
      errors.routingNumber = 'Must be 9 digits'
    }
    if (!banking.accountNumber.trim()) errors.accountNumber = 'Required'
    setBankingErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Completion checks
  const isMsaComplete = !!msaFile
  const isW9Complete = !!w9File && w9SignatureDetected
  const isBankingComplete = banking.bankName && banking.accountHolderName && 
    banking.routingNumber && banking.accountNumber && /^\d{9}$/.test(banking.routingNumber)
  const isQuoteComplete = !!quoteFile

  const allComplete = isMsaComplete && isW9Complete && isBankingComplete && isQuoteComplete
  const completedCount = [isMsaComplete, isW9Complete, isBankingComplete, isQuoteComplete].filter(Boolean).length

  // Submit handler
  const handleSubmit = () => {
    if (!validateBanking()) {
      toast.error('Please fix banking information errors')
      return
    }
    
    if (!allComplete) {
      toast.error('Please complete all sections')
      return
    }

    // Update vendor
    const updatedVendor = {
      ...vendor,
      status: 'active',
      banking,
      documents: {
        msaSigned: true,
        w9Uploaded: true,
        bankingComplete: true,
        quoteUploaded: true,
      },
    }
    saveVendor(updatedVendor)
    setVendor(updatedVendor)
    setSubmitted(true)
    toast.success('🎉 Registration submitted successfully!')
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">Vendor not found</p>
          <p className="text-sm text-slate-400 mt-1">ID: {vendorId}</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-100">
        <header className="bg-white border-b border-slate-200 py-4">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-xl font-bold text-slate-900">Axon Vendor Portal</h1>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <CheckCircle className="mx-auto text-emerald-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-slate-900">Registration Complete!</h2>
            <p className="mt-2 text-slate-600">
              Thank you, {vendor.name}. Your vendor registration has been submitted successfully.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              The Axon team will review your documents and activate your account.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-xl font-bold text-slate-900">Axon Vendor Portal</h1>
          <p className="text-sm text-slate-600">Complete your vendor registration</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Vendor Info & Progress */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">{vendor.name}</h2>
              <p className="text-sm text-slate-500">{vendor.contactEmail}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{completedCount} of 4 complete</p>
              <div className="mt-1 w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${(completedCount / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 1. Master Supplier Agreement */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">1. Master Supplier Agreement</h2>
            <SectionStatus complete={isMsaComplete} />
          </div>
          <p className="text-sm text-slate-600">Download, review, sign, and upload the agreement.</p>
          
          <div className="flex gap-3">
            <button 
              onClick={handleDownloadMSA}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download size={16} />
              Download MSA PDF
            </button>
          </div>

          {msaFile ? (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <FileText className="text-emerald-600" size={18} />
              <span className="text-sm text-emerald-800">{msaFile.name}</span>
              <CheckCircle className="ml-auto text-emerald-600" size={16} />
            </div>
          ) : (
            <FileDropzone onDrop={onMsaDrop} accept={{ 'application/pdf': ['.pdf'] }}>
              <Upload className="mx-auto text-slate-400" size={24} />
              <p className="mt-2 text-sm text-slate-600">Drop signed MSA here, or click to browse</p>
            </FileDropzone>
          )}
        </section>

        {/* 2. W-9 / W8 BEN-E */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">2. W-9 or W8 BEN-E</h2>
            <SectionStatus complete={isW9Complete} />
          </div>
          <p className="text-sm text-slate-600">Upload a signed tax form.</p>

          {w9File ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <FileText className="text-emerald-600" size={18} />
                <span className="text-sm text-emerald-800">{w9File.name}</span>
                {w9Checking ? (
                  <Loader2 className="ml-auto text-slate-400 animate-spin" size={16} />
                ) : w9SignatureDetected ? (
                  <CheckCircle className="ml-auto text-emerald-600" size={16} />
                ) : null}
              </div>
              {w9Checking && (
                <p className="text-sm text-slate-500 flex items-center gap-2">
                  <Loader2 className="animate-spin" size={14} />
                  Detecting signature...
                </p>
              )}
              {w9SignatureDetected && (
                <p className="text-sm text-emerald-600 flex items-center gap-1">
                  <CheckCircle size={14} />
                  Signature detected ✓
                </p>
              )}
            </div>
          ) : (
            <FileDropzone onDrop={onW9Drop} accept={{ 'application/pdf': ['.pdf'] }}>
              <Upload className="mx-auto text-slate-400" size={24} />
              <p className="mt-2 text-sm text-slate-600">Drop signed W-9 or W8 BEN-E here</p>
            </FileDropzone>
          )}
        </section>

        {/* 3. Banking Information */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">3. Banking Information</h2>
            <SectionStatus complete={isBankingComplete} />
          </div>
          <p className="text-sm text-slate-600">Provide your payment details for invoice processing.</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={banking.bankName}
                onChange={handleBankingChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                  bankingErrors.bankName ? 'border-red-300' : 'border-slate-200'
                }`}
                placeholder="Chase Bank"
              />
              {bankingErrors.bankName && (
                <p className="mt-1 text-xs text-red-600">{bankingErrors.bankName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account Holder Name</label>
              <input
                type="text"
                name="accountHolderName"
                value={banking.accountHolderName}
                onChange={handleBankingChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                  bankingErrors.accountHolderName ? 'border-red-300' : 'border-slate-200'
                }`}
                placeholder="Acme Corporation"
              />
              {bankingErrors.accountHolderName && (
                <p className="mt-1 text-xs text-red-600">{bankingErrors.accountHolderName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Routing Number</label>
              <input
                type="text"
                name="routingNumber"
                value={banking.routingNumber}
                onChange={handleBankingChange}
                maxLength={9}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                  bankingErrors.routingNumber ? 'border-red-300' : 'border-slate-200'
                }`}
                placeholder="123456789"
              />
              {bankingErrors.routingNumber && (
                <p className="mt-1 text-xs text-red-600">{bankingErrors.routingNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={banking.accountNumber}
                onChange={handleBankingChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                  bankingErrors.accountNumber ? 'border-red-300' : 'border-slate-200'
                }`}
                placeholder="9876543210"
              />
              {bankingErrors.accountNumber && (
                <p className="mt-1 text-xs text-red-600">{bankingErrors.accountNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account Type</label>
              <select
                name="accountType"
                value={banking.accountType}
                onChange={handleBankingChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>
          </div>
        </section>

        {/* 4. Quote */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">4. Quote / Statement of Work</h2>
            <SectionStatus complete={isQuoteComplete} />
          </div>
          <p className="text-sm text-slate-600">Upload your quote or statement of work.</p>

          {quoteFile ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <FileText className="text-emerald-600" size={18} />
                <span className="text-sm text-emerald-800">{quoteFile.name}</span>
                <CheckCircle className="ml-auto text-emerald-600" size={16} />
              </div>
              
              {ocrData && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-2">🔍 Extracted Data (Mock OCR)</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-blue-600">Vendor:</span>{' '}
                      <span className="text-blue-900">{ocrData.vendorName}</span>
                    </div>
                    <div>
                      <span className="text-blue-600">Amount:</span>{' '}
                      <span className="text-blue-900">${ocrData.amount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-blue-600">Start:</span>{' '}
                      <span className="text-blue-900">{ocrData.startDate}</span>
                    </div>
                    <div>
                      <span className="text-blue-600">End:</span>{' '}
                      <span className="text-blue-900">{ocrData.endDate}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <FileDropzone onDrop={onQuoteDrop} accept={{ 'application/pdf': ['.pdf'] }}>
              <Upload className="mx-auto text-slate-400" size={24} />
              <p className="mt-2 text-sm text-slate-600">Drop quote PDF here, or click to browse</p>
            </FileDropzone>
          )}
        </section>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!allComplete}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
            allComplete
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
        >
          <FileCheck size={18} />
          Submit Registration
        </button>

        {!allComplete && (
          <p className="text-center text-sm text-slate-500">
            Complete all sections above to submit your registration
          </p>
        )}
      </main>
    </div>
  )
}
