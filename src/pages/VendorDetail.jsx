import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, FileText, CheckCircle, Clock, Copy, Check, Shield, Lock, Server } from 'lucide-react'
import { toast } from 'sonner'
import { getVendor } from '../lib/storage'

const statusColors = {
  active: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
  incomplete: 'bg-red-100 text-red-800',
}

export default function VendorDetail() {
  const { id } = useParams()
  const [vendor, setVendor] = useState(null)
  const [copied, setCopied] = useState(false)

  const portalUrl = `${window.location.origin}/portal/${id}`

  useEffect(() => {
    const v = getVendor(id)
    setVendor(v)
  }, [id])

  const copyPortalLink = () => {
    navigator.clipboard.writeText(portalUrl)
    setCopied(true)
    toast.success('Portal link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Vendor not found</p>
        <Link to="/vendors" className="text-slate-900 underline mt-2 inline-block">
          Back to Vendors
        </Link>
      </div>
    )
  }

  const docs = vendor.documents || {}

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
            <h1 className="text-3xl font-bold text-slate-900">{vendor.name}</h1>
            {vendor.dba && (
              <p className="mt-1 text-slate-600">DBA: {vendor.dba}</p>
            )}
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${statusColors[vendor.status]}`}>
            {vendor.status}
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
          {vendor.status === 'incomplete' ? 'Send Email' : 'Resend Email'}
        </Link>
        <Link
          to={`/pors/new?vendorId=${id}`}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <FileText size={16} />
          Create POR
        </Link>
      </div>

      {/* Portal Link */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900 mb-2">Vendor Portal Link</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 bg-white rounded border border-blue-200 text-sm text-blue-800 overflow-x-auto">
            {portalUrl}
          </code>
          <button
            onClick={copyPortalLink}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Vendor Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Vendor Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-slate-500">Contact Name</span>
            <p className="font-medium text-slate-900">{vendor.contactName}</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Contact Email</span>
            <p className="font-medium text-slate-900">{vendor.contactEmail}</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Contact Phone</span>
            <p className="font-medium text-slate-900">{vendor.contactPhoneNumber || '—'}</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Axon Entity</span>
            <p className="font-medium text-slate-900">{vendor.axonEntity}</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Created</span>
            <p className="font-medium text-slate-900">
              {new Date(vendor.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Compliance Requirements */}
      {(vendor.requiresNDA || vendor.requiresPrivacy || vendor.requiresInfoSec) && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Compliance Requirements</h2>
          <div className="flex flex-wrap gap-2">
            {vendor.requiresNDA && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm">
                <Lock size={14} />
                NDA Required
              </span>
            )}
            {vendor.requiresPrivacy && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-100 text-pink-800 rounded-full text-sm">
                <Shield size={14} />
                Privacy Review
              </span>
            )}
            {vendor.requiresInfoSec && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm">
                <Server size={14} />
                InfoSec Review
              </span>
            )}
          </div>
        </div>
      )}

      {/* Document Status */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Document Status</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {docs.msaSigned ? (
              <CheckCircle className="text-emerald-500" size={18} />
            ) : (
              <Clock className="text-amber-500" size={18} />
            )}
            <span className="text-slate-600">Master Supplier Agreement</span>
          </div>
          <div className="flex items-center gap-3">
            {docs.w9Uploaded ? (
              <CheckCircle className="text-emerald-500" size={18} />
            ) : (
              <Clock className="text-amber-500" size={18} />
            )}
            <span className="text-slate-600">W-9 / W8 BEN-E</span>
          </div>
          <div className="flex items-center gap-3">
            {docs.bankingComplete ? (
              <CheckCircle className="text-emerald-500" size={18} />
            ) : (
              <Clock className="text-amber-500" size={18} />
            )}
            <span className="text-slate-600">Banking Information</span>
          </div>
          <div className="flex items-center gap-3">
            {docs.quoteUploaded ? (
              <CheckCircle className="text-emerald-500" size={18} />
            ) : (
              <Clock className="text-amber-500" size={18} />
            )}
            <span className="text-slate-600">Quote</span>
          </div>
        </div>
      </div>
    </div>
  )
}
