import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Upload, Send } from 'lucide-react'

export default function PORCreate() {
  const [searchParams] = useSearchParams()
  const vendorId = searchParams.get('vendorId')

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
        <h1 className="text-3xl font-bold text-slate-900">Create Purchase Order Requisition</h1>
        <p className="mt-1 text-slate-600">
          {vendorId ? `For Vendor: ${vendorId}` : 'Upload quote and fill out the required fields'}
        </p>
      </div>

      {/* Step 1: Upload Quote */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Step 1: Upload Quote</h2>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <Upload className="mx-auto text-slate-400" size={32} />
          <p className="mt-2 text-slate-600">Drag and drop quote PDF here, or click to browse</p>
          <p className="mt-1 text-sm text-slate-500">OCR will extract data to pre-fill the form</p>
        </div>
      </div>

      {/* Step 2: Form Fields */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Step 2: POR Details (13 fields)</h2>
        <p className="text-slate-500 italic">Form with 13 required fields will go here (see DATA.md)</p>
        
        <div className="grid md:grid-cols-2 gap-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Name</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="Auto-filled from quote" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="$0.00" />
          </div>
        </div>
        <p className="text-sm text-slate-400">+ 11 more fields...</p>
      </div>

      {/* Step 3: Submit */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Step 3: Review & Submit</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
          <Send size={16} />
          Send to Dynamics
        </button>
      </div>
    </div>
  )
}

