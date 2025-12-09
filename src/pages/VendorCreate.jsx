import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function VendorCreate() {
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
        <h1 className="text-3xl font-bold text-slate-900">Create Vendor</h1>
        <p className="mt-1 text-slate-600">Answer preliminary questions to set up a new vendor relationship</p>
      </div>

      {/* Placeholder Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <p className="text-slate-500 italic">Preliminary questions form will go here</p>
        
        <div className="pt-4 border-t border-slate-200">
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
            Continue to Email Preview
          </button>
        </div>
      </div>
    </div>
  )
}

