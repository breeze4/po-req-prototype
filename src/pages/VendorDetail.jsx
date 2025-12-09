import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, FileText, CheckCircle, Clock } from 'lucide-react'

export default function VendorDetail() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/vendors"
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={16} />
          Back to Vendors
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Vendor Details</h1>
            <p className="mt-1 text-slate-600">Vendor ID: {id}</p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
            Pending
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          to={`/vendors/${id}/email`}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Mail size={16} />
          Send/Resend Email
        </Link>
        <Link
          to={`/pors/new?vendorId=${id}`}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <FileText size={16} />
          Create POR
        </Link>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Document Status</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Clock className="text-amber-500" size={18} />
            <span className="text-slate-600">Master Supplier Agreement</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-amber-500" size={18} />
            <span className="text-slate-600">W-9 / W8 BEN-E</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-amber-500" size={18} />
            <span className="text-slate-600">Banking Information</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="text-emerald-500" size={18} />
            <span className="text-slate-600">Quote</span>
          </div>
        </div>
      </div>

      {/* Vendor Info Placeholder */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Vendor Information</h2>
        <p className="text-slate-500 italic">Vendor details will be displayed here</p>
      </div>
    </div>
  )
}

