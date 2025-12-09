import { Link } from 'react-router-dom'
import { Users, FileText, ArrowRight, CheckSquare } from 'lucide-react'
import { getPORs } from '../lib/storage'

export default function Dashboard() {
  // Get pending approvals count for badge (PORs submitted by others, not Jane)
  const pors = getPORs()
  const pendingCount = pors.filter(por => 
    por.status === 'submitted' && por.requestorEmail !== 'jane.smith@axon.com'
  ).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Welcome to Procurement-One. Manage vendors and purchase order requisitions.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/vendors"
          className="group block p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <ArrowRight className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" size={20} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Vendors</h2>
          <p className="mt-1 text-slate-600">Search, create, and manage vendor relationships</p>
        </Link>

        <Link
          to="/pors"
          className="group block p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <FileText className="text-emerald-600" size={24} />
            </div>
            <ArrowRight className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" size={20} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Purchase Order Requisitions</h2>
          <p className="mt-1 text-slate-600">Create and track PORs through approval workflow</p>
        </Link>

        <Link
          to="/approvals"
          className="group block p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all relative"
        >
          {pendingCount > 0 && (
            <span className="absolute top-4 right-4 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {pendingCount}
            </span>
          )}
          <div className="flex items-start justify-between">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckSquare className="text-purple-600" size={24} />
            </div>
            <ArrowRight className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" size={20} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Approvals</h2>
          <p className="mt-1 text-slate-600">Review and approve pending purchase requests</p>
        </Link>
      </div>
    </div>
  )
}
