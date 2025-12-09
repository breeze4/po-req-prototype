import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'
import { Plus, Search, Building2, Mail } from 'lucide-react'
import { getVendors } from '../lib/storage'

const statusColors = {
  active: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
  incomplete: 'bg-red-100 text-red-800',
}

export default function VendorList() {
  const [searchQuery, setSearchQuery] = useState('')
  const vendors = getVendors()

  const fuse = useMemo(() => {
    return new Fuse(vendors, {
      keys: ['name', 'dba', 'contactName', 'contactEmail'],
      threshold: 0.3,
      ignoreLocation: true,
    })
  }, [vendors])

  const filteredVendors = useMemo(() => {
    if (!searchQuery.trim()) {
      return vendors
    }
    return fuse.search(searchQuery).map(result => result.item)
  }, [searchQuery, fuse, vendors])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vendors</h1>
          <p className="mt-1 text-slate-600">Search and manage vendor relationships</p>
        </div>
        <Link
          to="/vendors/new"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus size={18} />
          Add Vendor
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search vendors by name, contact, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
        />
      </div>

      {/* Results */}
      {filteredVendors.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          {searchQuery ? (
            <p className="text-slate-500">No vendors match "{searchQuery}"</p>
          ) : (
            <p className="text-slate-500">No vendors yet. Click "Add Vendor" to create one.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredVendors.map((vendor) => (
            <Link
              key={vendor.id}
              to={`/vendors/${vendor.id}`}
              className="block bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Building2 className="text-slate-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{vendor.name}</h3>
                    {vendor.dba && (
                      <p className="text-sm text-slate-500">DBA: {vendor.dba}</p>
                    )}
                    <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                      <span>{vendor.contactName}</span>
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {vendor.contactEmail}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${statusColors[vendor.status]}`}>
                  {vendor.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Result count */}
      {searchQuery && filteredVendors.length > 0 && (
        <p className="text-sm text-slate-500">
          Showing {filteredVendors.length} of {vendors.length} vendors
        </p>
      )}
    </div>
  )
}
