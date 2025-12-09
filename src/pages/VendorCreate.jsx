import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { saveVendor } from '../lib/storage'

const AXON_ENTITIES = ['TAS', 'CAN', 'SEG', 'AUK']

export default function VendorCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    dba: '',
    contactName: '',
    contactEmail: '',
    contactPhoneNumber: '',
    axonEntity: '',
    requiresNDA: false,
    requiresPrivacy: false,
    requiresInfoSec: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const vendor = {
      id: `v-${crypto.randomUUID().slice(0, 8)}`,
      ...form,
      isAuthorizedSigner: false,
      status: 'incomplete',
      createdAt: new Date().toISOString(),
      documents: {
        msaSigned: false,
        w9Uploaded: false,
        bankingComplete: false,
        quoteUploaded: false,
      },
    }
    
    saveVendor(vendor)
    navigate(`/vendors/${vendor.id}/email`)
  }

  const isValid = form.name && form.contactName && form.contactEmail && form.axonEntity

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vendor Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Vendor Information</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Acme Corporation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                DBA (if different)
              </label>
              <input
                type="text"
                name="dba"
                value={form.dba}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Acme"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contact Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="john@acme.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contactPhoneNumber"
                value={form.contactPhoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="555-123-4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Axon Entity <span className="text-red-500">*</span>
            </label>
            <select
              name="axonEntity"
              value={form.axonEntity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">Select an entity...</option>
              {AXON_ENTITIES.map(entity => (
                <option key={entity} value={entity}>{entity}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Preliminary Questions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Preliminary Questions</h2>
          <p className="text-sm text-slate-600">Will you be sharing any of the following with this vendor?</p>
          
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                name="requiresNDA"
                checked={form.requiresNDA}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <div>
                <span className="font-medium text-slate-900">Confidential Axon Information</span>
                <p className="text-sm text-slate-500">R&D, engineering, IP, or other proprietary information → Requires NDA</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                name="requiresPrivacy"
                checked={form.requiresPrivacy}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <div>
                <span className="font-medium text-slate-900">Personal Identifiable Information (PII)</span>
                <p className="text-sm text-slate-500">Employee, consultant, or customer data → Requires Privacy Policy review</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                name="requiresInfoSec"
                checked={form.requiresInfoSec}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <div>
                <span className="font-medium text-slate-900">Vendor Tool Hosts Axon Data</span>
                <p className="text-sm text-slate-500">SaaS or tool that will store/process Axon data → Requires InfoSec review</p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isValid}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Email Preview
          </button>
        </div>
      </form>
    </div>
  )
}
