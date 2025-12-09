import { Clock, Eye, FileText, Plus, User } from 'lucide-react'

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

function getDaysAged(dateString) {
  if (!dateString) return 0
  const created = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - created)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// SLA thresholds: green < 3 days, yellow 3-7 days, red > 7 days
function getAgingColor(days, status) {
  // Completed statuses don't need aging indicators
  if (status === 'approved' || status === 'rejected') {
    return 'text-slate-400'
  }
  if (days <= 2) {
    return 'text-emerald-600 bg-emerald-50'
  } else if (days <= 7) {
    return 'text-amber-600 bg-amber-50'
  } else {
    return 'text-red-600 bg-red-50'
  }
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

      {/* SLA Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span className="text-slate-500">SLA:</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          0-2 days
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          3-7 days
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          8+ days
        </span>
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
              <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">Age</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Assigned To</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pors.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
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
              pors.map((por) => {
                const daysAged = getDaysAged(por.createdAt)
                const agingColor = getAgingColor(daysAged, por.status)
                
                return (
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
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md ${agingColor}`}>
                        <Clock size={12} />
                        {daysAged}d
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                        <User size={14} className="text-slate-400" />
                        {por.assignee || '—'}
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
                )
              })
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
