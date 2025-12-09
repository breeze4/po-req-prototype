import { Link } from 'react-router-dom'
import { Users, FileText, ArrowRight } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Welcome to Procurement-One. Manage vendors and purchase order requisitions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
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
      </div>
    </div>
  )
}

