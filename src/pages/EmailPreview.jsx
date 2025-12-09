import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'

export default function EmailPreview() {
  const { id } = useParams()

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
        <p className="mt-1 text-slate-600">Review and send the vendor invite email</p>
        <p className="mt-1 text-sm text-amber-600">Vendor ID: {id}</p>
      </div>

      {/* Placeholder Email */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">To:</label>
          <input
            type="email"
            placeholder="vendor@example.com"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject:</label>
          <input
            type="text"
            defaultValue="Invitation to join Axon Vendor Network"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Body:</label>
          <textarea
            rows={10}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            defaultValue={`Dear Vendor,

You have been invited to join the Axon Vendor Network.

Please click the link below to complete your vendor registration:
[Portal Link]

Required documents:
- Master Supplier Agreement
- W-9 or W8 BEN-E
- Banking Information
- Quote

Best regards,
Jane Smith`}
          />
        </div>
        
        <div className="pt-4 border-t border-slate-200">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
            <Send size={16} />
            Send Email
          </button>
        </div>
      </div>
    </div>
  )
}

