import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, CheckCircle, Clock, Eye, ThumbsDown, ThumbsUp, User, X } from 'lucide-react'
import { toast } from 'sonner'
import { getPORs, savePOR } from '../lib/storage'

const CURRENT_USER = 'Jane Smith'
const CURRENT_USER_EMAIL = 'jane.smith@axon.com'

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getDaysAged(dateString) {
  if (!dateString) return 0
  const created = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - created)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

function getAgingColor(days) {
  if (days <= 2) {
    return 'text-emerald-600 bg-emerald-50'
  } else if (days <= 7) {
    return 'text-amber-600 bg-amber-50'
  } else {
    return 'text-red-600 bg-red-50'
  }
}

export default function Approvals() {
  const [pors, setPors] = useState(() => getPORs())
  const [filter, setFilter] = useState('all') // 'all' or specific assignee name
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectingPor, setRejectingPor] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  // Get pending approvals (submitted status, from other requestors - not Jane's own)
  const pendingPors = pors.filter(por => 
    por.status === 'submitted' && por.requestorEmail !== CURRENT_USER_EMAIL
  )
  
  // Filter based on toggle - by assignee (amount-based: Brittany >$1M, Dave $250K-$1M, Jen <$250K)
  const filteredPors = filter === 'all' 
    ? pendingPors
    : pendingPors.filter(por => por.assignee === filter)

  // Stats
  const totalPending = pendingPors.length
  const byBrittany = pendingPors.filter(por => por.assignee === 'Brittany Bagley').length
  const byDave = pendingPors.filter(por => por.assignee === 'Dave Iacovelli').length
  const byJennifer = pendingPors.filter(por => por.assignee === 'Jennifer Mak').length
  const overdue = pendingPors.filter(por => getDaysAged(por.createdAt) > 7).length

  const handleApprove = (por) => {
    const updated = { 
      ...por, 
      status: 'approved', 
      approvedAt: new Date().toISOString(),
      approvedBy: CURRENT_USER,
    }
    savePOR(updated)
    setPors(getPORs())
    toast.success(`Approved: ${por.name}`)
  }

  const openRejectModal = (por) => {
    setRejectingPor(por)
    setRejectReason('')
    setRejectModalOpen(true)
  }

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    
    const updated = { 
      ...rejectingPor, 
      status: 'rejected', 
      rejectedAt: new Date().toISOString(),
      rejectedBy: CURRENT_USER,
      rejectionReason: rejectReason,
    }
    savePOR(updated)
    setPors(getPORs())
    toast.success(`Rejected: ${rejectingPor.name}`)
    setRejectModalOpen(false)
    setRejectingPor(null)
    setRejectReason('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Approvals</h1>
        <p className="mt-1 text-slate-600">Review and approve purchase order requisitions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Pending</p>
              <p className="text-2xl font-bold text-slate-900">{totalPending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Brittany (&gt;$1M)</p>
              <p className="text-2xl font-bold text-slate-900">{byBrittany}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <User className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Dave ($250K-$1M)</p>
              <p className="text-2xl font-bold text-slate-900">{byDave}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <User className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Jennifer (&lt;$250K)</p>
              <p className="text-2xl font-bold text-slate-900">{byJennifer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Filter by assignee:</span>
        <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-white">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({totalPending})
          </button>
          <button
            onClick={() => setFilter('Brittany Bagley')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === 'Brittany Bagley'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Brittany ({byBrittany})
          </button>
          <button
            onClick={() => setFilter('Dave Iacovelli')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === 'Dave Iacovelli'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dave ({byDave})
          </button>
          <button
            onClick={() => setFilter('Jennifer Mak')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === 'Jennifer Mak'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jennifer ({byJennifer})
          </button>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Requestor</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Vendor</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Description</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-slate-600">Amount</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">Age</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Assigned To</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPors.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <CheckCircle className="mx-auto text-emerald-300" size={48} />
                  <p className="mt-4 text-slate-500">
                    {filter === 'all' 
                      ? 'No pending approvals!' 
                      : `No pending approvals for ${filter}!`}
                  </p>
                </td>
              </tr>
            ) : (
              filteredPors.map((por) => {
                const daysAged = getDaysAged(por.createdAt)
                const agingColor = getAgingColor(daysAged)
                
                return (
                  <tr key={por.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div>
                        <span className="font-medium text-slate-900">{por.requestor}</span>
                        <p className="text-xs text-slate-500">{por.requestorEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-slate-600">{por.vendorName}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-slate-600 line-clamp-1">{por.name}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={`font-medium ${por.totalAmount >= 1000000 ? 'text-amber-600' : 'text-slate-900'}`}>
                        {formatCurrency(por.totalAmount, por.currency)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md ${agingColor}`}>
                        <Clock size={12} />
                        {daysAged}d
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                        por.assignee === 'Brittany Bagley' ? 'bg-purple-100 text-purple-700' :
                        por.assignee === 'Dave Iacovelli' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {por.assignee}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          to={`/pors/${por.id}`}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => handleApprove(por)}
                          className="p-1.5 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                          title="Approve"
                        >
                          <ThumbsUp size={16} />
                        </button>
                        <button
                          onClick={() => openRejectModal(por)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Reject"
                        >
                          <ThumbsDown size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {filteredPors.length > 0 && (
        <p className="text-sm text-slate-500">
          Showing {filteredPors.length} pending approval{filteredPors.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Reject POR</h2>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-slate-600">
                  You are rejecting: <span className="font-medium text-slate-900">{rejectingPor?.name}</span>
                </p>
                <p className="text-sm text-slate-500">
                  Requestor: {rejectingPor?.requestor}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Please explain why this POR is being rejected..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-slate-200">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <ThumbsDown size={16} />
                Reject POR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

