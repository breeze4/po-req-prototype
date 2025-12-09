import { useParams } from 'react-router-dom'
import { Upload, Download, FileCheck } from 'lucide-react'

export default function VendorPortal() {
  const { vendorId } = useParams()

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Different header for vendor portal */}
      <header className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-xl font-bold text-slate-900">Axon Vendor Portal</h1>
          <p className="text-sm text-slate-600">Complete your vendor registration</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">Vendor ID: {vendorId}</p>
        </div>

        {/* Master Supplier Agreement */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Master Supplier Agreement</h2>
          <p className="text-sm text-slate-600">Download, review, sign, and upload the agreement.</p>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm">
              <Download size={16} />
              Download PDF
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600">
              <Upload size={16} />
              Upload Signed Copy
            </button>
          </div>
        </section>

        {/* W-9 */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">W-9 or W8 BEN-E</h2>
          <p className="text-sm text-slate-600">Upload a signed tax form.</p>
          <button className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600">
            <Upload size={16} />
            Upload Signed PDF
          </button>
        </section>

        {/* Banking Info */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Banking Information</h2>
          <p className="text-sm text-slate-600">Provide your payment details.</p>
          <p className="text-slate-500 italic text-sm">Banking form fields will go here</p>
        </section>

        {/* Quote */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Quote</h2>
          <p className="text-sm text-slate-600">Upload your quote or statement of work.</p>
          <button className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600">
            <Upload size={16} />
            Upload Quote PDF
          </button>
        </section>

        {/* Submit */}
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
          <FileCheck size={18} />
          Submit Registration
        </button>
      </main>
    </div>
  )
}

