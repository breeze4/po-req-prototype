import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

export default function PORDetail() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/pors"
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={16} />
          Back to PORs
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">POR Details</h1>
            <p className="mt-1 text-slate-600">POR ID: {id}</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            Submitted
          </span>
        </div>
      </div>

      {/* POR Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">POR Information</h2>
        <p className="text-slate-500 italic">All 13 fields displayed here (read-only)</p>
        
        <div className="grid md:grid-cols-2 gap-4 pt-4">
          <div>
            <span className="text-sm text-slate-500">Vendor Name</span>
            <p className="font-medium text-slate-900">Acme Consulting LLC</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Amount</span>
            <p className="font-medium text-slate-900">$15,000.00</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Status</span>
            <p className="font-medium text-slate-900">Submitted</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Submitted Date</span>
            <p className="font-medium text-slate-900">Dec 9, 2025</p>
          </div>
        </div>
      </div>

      {/* Mock Status Controls */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-amber-900">⏳ Demo: Status Controls</h2>
        <p className="text-sm text-amber-800">These buttons are for prototype demo purposes only.</p>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <CheckCircle size={16} />
            Approve
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <XCircle size={16} />
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}

