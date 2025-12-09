import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

export default function PORList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Purchase Order Requisitions</h1>
          <p className="mt-1 text-slate-600">Track and manage your PORs</p>
        </div>
        <Link
          to="/pors/new"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus size={18} />
          Create POR
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Vendor</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Description</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Amount</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Submitted</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                No PORs yet. Click "Create POR" to get started.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

