import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, X, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { getVendor, saveVendor } from '../lib/storage'

function generateEmailBody(vendor, portalUrl) {
  const requiredDocs = ['Master Supplier Agreement', 'W-9 or W8 BEN-E', 'Banking Information', 'Quote']
  
  if (vendor.requiresNDA) {
    requiredDocs.push('Non-Disclosure Agreement (NDA)')
  }
  if (vendor.requiresPrivacy) {
    requiredDocs.push('Privacy Policy Acknowledgment')
  }
  if (vendor.requiresInfoSec) {
    requiredDocs.push('Information Security Questionnaire')
  }

  return `Dear ${vendor.contactName},

You have been invited to join the Axon Vendor Network on behalf of ${vendor.name}.

Please click the link below to complete your vendor registration:
${portalUrl}

Required documents:
${requiredDocs.map(doc => `- ${doc}`).join('\n')}

Once you have submitted all required documents, we will review and activate your vendor account.

Best regards,
Jane Smith
jane.smith@axon.com`
}

export default function EmailPreview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const portalUrl = `${window.location.origin}/portal/${id}`
  
  const [email, setEmail] = useState({
    to: '',
    subject: 'Invitation to join Axon Vendor Network',
    body: '',
  })

  useEffect(() => {
    const v = getVendor(id)
    if (v) {
      setVendor(v)
      setEmail(prev => ({
        ...prev,
        to: v.contactEmail,
        body: generateEmailBody(v, portalUrl),
      }))
    }
  }, [id, portalUrl])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEmail(prev => ({ ...prev, [name]: value }))
  }

  const handleSend = () => {
    setShowModal(true)
  }

  const confirmSend = () => {
    // Log to console (mocked)
    console.log('📧 Email sent:', email)
    
    // Update vendor status to pending
    if (vendor) {
      saveVendor({ ...vendor, status: 'pending' })
    }
    
    toast.success('Email sent successfully!')
    setShowModal(false)
    navigate(`/vendors/${id}`)
  }

  const copyPortalLink = () => {
    navigator.clipboard.writeText(portalUrl)
    setCopied(true)
    toast.success('Portal link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Vendor not found</p>
        <Link to="/vendors" className="text-slate-900 underline mt-2 inline-block">
          Back to Vendors
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/vendors/${id}`}
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={16} />
          Back to Vendor
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Email Preview</h1>
        <p className="mt-1 text-slate-600">Review and send the vendor invite email to {vendor.name}</p>
      </div>

      {/* Portal Link */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900 mb-2">Vendor Portal Link</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 bg-white rounded border border-blue-200 text-sm text-blue-800 overflow-x-auto">
            {portalUrl}
          </code>
          <button
            onClick={copyPortalLink}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Email Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">To:</label>
          <input
            type="email"
            name="to"
            value={email.to}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject:</label>
          <input
            type="text"
            name="subject"
            value={email.subject}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Body:</label>
          <textarea
            name="body"
            rows={14}
            value={email.body}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-sm"
          />
        </div>
        
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={handleSend}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Send size={16} />
            Send Email
          </button>
        </div>
      </div>

      {/* Email Preview Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">📧 Email Preview (Mocked)</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">To:</span> {email.to}</p>
                <p><span className="font-medium">Subject:</span> {email.subject}</p>
                <p><span className="font-medium">CC:</span> jane.smith@axon.com</p>
              </div>
              <hr className="my-4" />
              <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono bg-slate-50 p-4 rounded-lg">
                {email.body}
              </pre>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-slate-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSend}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Send size={16} />
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
