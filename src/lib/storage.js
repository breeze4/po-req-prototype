// localStorage keys
const VENDORS_KEY = 'procurement_vendors'
const PORS_KEY = 'procurement_pors'

// Vendors
export function getVendors() {
  const data = localStorage.getItem(VENDORS_KEY)
  return data ? JSON.parse(data) : []
}

export function getVendor(id) {
  const vendors = getVendors()
  return vendors.find(v => v.id === id) || null
}

export function saveVendor(vendor) {
  const vendors = getVendors()
  const index = vendors.findIndex(v => v.id === vendor.id)
  if (index >= 0) {
    vendors[index] = vendor
  } else {
    vendors.push(vendor)
  }
  localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors))
  return vendor
}

export function deleteVendor(id) {
  const vendors = getVendors().filter(v => v.id !== id)
  localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors))
}

// PORs
export function getPORs() {
  const data = localStorage.getItem(PORS_KEY)
  return data ? JSON.parse(data) : []
}

export function getPOR(id) {
  const pors = getPORs()
  return pors.find(p => p.id === id) || null
}

export function savePOR(por) {
  const pors = getPORs()
  const index = pors.findIndex(p => p.id === por.id)
  if (index >= 0) {
    pors[index] = por
  } else {
    pors.push(por)
  }
  localStorage.setItem(PORS_KEY, JSON.stringify(pors))
  return por
}

export function deletePOR(id) {
  const pors = getPORs().filter(p => p.id !== id)
  localStorage.setItem(PORS_KEY, JSON.stringify(pors))
}

// Utility to check if seed data exists
export function hasSeededData() {
  return localStorage.getItem(VENDORS_KEY) !== null
}

// Clear all data (for testing)
export function clearAllData() {
  localStorage.removeItem(VENDORS_KEY)
  localStorage.removeItem(PORS_KEY)
}

