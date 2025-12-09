import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import VendorList from './pages/VendorList'
import VendorCreate from './pages/VendorCreate'
import VendorDetail from './pages/VendorDetail'
import EmailPreview from './pages/EmailPreview'
import VendorPortal from './pages/VendorPortal'
import PORList from './pages/PORList'
import PORCreate from './pages/PORCreate'
import PORDetail from './pages/PORDetail'
import Approvals from './pages/Approvals'
import { seedVendors } from './lib/seedData'

export default function App() {
  useEffect(() => {
    seedVendors()
  }, [])

  return (
    <Routes>
      {/* Vendor Portal has its own layout */}
      <Route path="/portal/:vendorId" element={<VendorPortal />} />
      
      {/* Main app with nav layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vendors" element={<VendorList />} />
        <Route path="/vendors/new" element={<VendorCreate />} />
        <Route path="/vendors/:id" element={<VendorDetail />} />
        <Route path="/vendors/:id/email" element={<EmailPreview />} />
        <Route path="/pors" element={<PORList />} />
        <Route path="/pors/new" element={<PORCreate />} />
        <Route path="/pors/:id" element={<PORDetail />} />
        <Route path="/approvals" element={<Approvals />} />
      </Route>
    </Routes>
  )
}
