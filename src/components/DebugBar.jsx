import { Trash2, Database, Wrench } from 'lucide-react'
import { toast } from 'sonner'
import { clearAllData } from '../lib/storage'
import { createDemoData } from '../lib/seedData'

export default function DebugBar() {
  const handleClearData = () => {
    clearAllData()
    toast.success('All data cleared!')
    setTimeout(() => window.location.reload(), 500)
  }

  const handleCreateData = () => {
    createDemoData()
    toast.success('Demo data created: 6 vendors, 9 PORs (4 requestors)')
    setTimeout(() => window.location.reload(), 500)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700 px-4 py-2 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Wrench size={14} />
          <span>Debug</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
          >
            <Trash2 size={14} />
            Clear Data
          </button>
          <button
            onClick={handleCreateData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30 rounded transition-colors"
          >
            <Database size={14} />
            Create Data
          </button>
        </div>
      </div>
    </div>
  )
}

