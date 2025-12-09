import { Eye, FileText, Plus } from 'lucide-react'

import { Link } from 'react-router-dom'
import { getPORs } from '../lib/storage'

const statusColors = {
  draft: 'bg-slate-100 text-slate-800',
  submitted: 'bg-blue-100 text-blue-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
  sent_to_dynamics: 'bg-purple-100 text-purple-800',
}

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function PORList() {
  const pors = getPORs()

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
              <th className="text-right px-4 py-3 text-sm font-medium text-slate-600">Amount</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Submitted</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <FileText className="mx-auto text-slate-300" size={48} />
                  <p className="mt-4 text-slate-500">No PORs yet.</p>
                  <Link
                    to="/pors/new"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Plus size={16} />
                    Create your first POR
                  </Link>
                </td>
              </tr>
            ) : (
              pors.map((por) => (
                <tr key={por.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <span className="font-medium text-slate-900">{por.vendorName}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-slate-600 line-clamp-1">{por.name || por.description}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-medium text-slate-900">
                      {formatCurrency(por.totalAmount, por.currency)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${statusColors[por.status] || statusColors.draft}`}>
                      {por.status?.replace(/_/g, ' ') || 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-slate-600">
                      {por.submittedAt ? formatDate(por.submittedAt) : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Link
                      to={`/pors/${por.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pors.length > 0 && (
        <p className="text-sm text-slate-500">
          Showing {pors.length} POR{pors.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
