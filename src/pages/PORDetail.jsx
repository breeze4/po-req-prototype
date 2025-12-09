import { ArrowLeft, Building2, Calendar, CheckCircle, DollarSign, FileText, XCircle } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPOR, savePOR } from '../lib/storage'

import { useState } from 'react'

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
  }).format(amount || 0)
}

function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function PORDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [por, setPor] = useState(() => getPOR(id))
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const displayToast = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const updateStatus = (newStatus) => {
    const updated = { ...por, status: newStatus, updatedAt: new Date().toISOString() }
    savePOR(updated)
    setPor(updated)
    displayToast(`POR ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully!`)
  }

  if (!por) {
    return (
      <div className="space-y-6">
        <Link
          to="/pors"
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to PORs
        </Link>
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <FileText className="mx-auto text-slate-300" size={48} />
          <h2 className="mt-4 text-lg font-medium text-slate-900">POR Not Found</h2>
          <p className="mt-2 text-slate-500">The requested POR could not be found.</p>
          <Link
            to="/pors"
            className="inline-block mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            View All PORs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle size={18} />
          {toastMessage}
        </div>
      )}

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
            <p className="mt-1 text-slate-600">ID: {por.id}</p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${statusColors[por.status] || statusColors.draft}`}>
            {por.status?.replace(/_/g, ' ') || 'Draft'}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Building2 className="text-slate-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Vendor</p>
              <p className="font-semibold text-slate-900">{por.vendorName}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Amount</p>
              <p className="font-semibold text-slate-900">{formatCurrency(por.totalAmount, por.currency)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Submitted</p>
              <p className="font-semibold text-slate-900">{formatDate(por.submittedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">POR Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <span className="text-sm text-slate-500">Name / Description</span>
            <p className="font-medium text-slate-900">{por.name || por.description || '—'}</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Cost Center</span>
            <p className="font-medium text-slate-900">{por.costCenter || '—'}</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Profit Center</span>
            <p className="font-medium text-slate-900">{por.profitCenter || '—'}</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Project Code</span>
            <p className="font-medium text-slate-900">{por.projectCode || '—'}</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Country</span>
            <p className="font-medium text-slate-900">{por.country || '—'}</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Attachments</span>
            <p className="font-medium text-slate-900">{por.attachments || '—'}</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Created By</span>
            <p className="font-medium text-slate-900">{por.createdBy || '—'}</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Created At</span>
            <p className="font-medium text-slate-900">{formatDate(por.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Line Items</h2>

        {por.lineItems && por.lineItems.length > 0 ? (
          <div className="space-y-4">
            {por.lineItems.map((item, idx) => (
              <div key={item.id || idx} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-600">Line {item.line || idx + 1}</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(item.lineAmount, item.currency)}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Product Name</span>
                    <p className="font-medium text-slate-900">{item.productName || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Category</span>
                    <p className="font-medium text-slate-900">{item.category || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Currency</span>
                    <p className="font-medium text-slate-900">{item.currency || 'USD'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Vendor</span>
                    <p className="font-medium text-slate-900">{item.vendorName || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Vendor Key</span>
                    <p className="font-medium text-slate-900">{item.vendorKey || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Purpose Code</span>
                    <p className="font-medium text-slate-900">{item.purposeCode || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Start Date</span>
                    <p className="font-medium text-slate-900">{formatDate(item.startDate)}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">End Date</span>
                    <p className="font-medium text-slate-900">{formatDate(item.endDate)}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Billing Frequency</span>
                    <p className="font-medium text-slate-900">{item.billingFrequency || '—'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic">No line items</p>
        )}

        {/* Totals */}
        <div className="border-t border-slate-200 pt-4 mt-4">
          <div className="flex justify-end gap-8">
            <div className="text-right">
              <p className="text-sm text-slate-500">Net Amount</p>
              <p className="text-lg font-semibold text-slate-900">
                {formatCurrency(por.netAmount, por.currency)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Total Amount</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(por.totalAmount, por.currency)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Status Controls */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-amber-900">⏳ Demo: Status Controls</h2>
        <p className="text-sm text-amber-800">
          These buttons are for prototype demo purposes only. In production, status would change via workflow.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => updateStatus('approved')}
            disabled={por.status === 'approved'}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle size={16} />
            Approve
          </button>
          <button
            onClick={() => updateStatus('rejected')}
            disabled={por.status === 'rejected'}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle size={16} />
            Reject
          </button>
        </div>
        {por.updatedAt && (
          <p className="text-xs text-amber-700">Last updated: {formatDate(por.updatedAt)}</p>
        )}
      </div>
    </div>
  )
}
