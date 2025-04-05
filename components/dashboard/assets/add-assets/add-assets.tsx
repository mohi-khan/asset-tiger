'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { Popup } from '@/utils/popup'

// Sample data
const initialDepartments = [
  {
    departmentName: 'Finance',
    departmentCode: 'FIN',
    location: 'New York',
    manager: 'John Doe',
    employeeCount: '15',
  },
  {
    departmentName: 'HR',
    departmentCode: 'HR',
    location: 'Chicago',
    manager: 'Jane Smith',
    employeeCount: '8',
  },
  {
    departmentName: 'IT',
    departmentCode: 'IT',
    location: 'San Francisco',
    manager: 'Mike Johnson',
    employeeCount: '25',
  },
]

const initialCategories = [
  { categoryName: 'Operations', categoryCode: 'OPS' },
  { categoryName: 'Marketing', categoryCode: 'MKT' },
  { categoryName: 'Research', categoryCode: 'RND' },
]

const departments = initialDepartments
const categories = initialCategories
const siteOptions = Array.from(
  new Set(departments.map((dept) => dept.location))
)
const locationOptions = ['Building A', 'Building B', 'Floor 1', 'Floor 2'] // Defaults
const deprectypeOptions = [
  'Straigth Line',
  'Reducing Balnce Method',
  'Double Reducing Method',
] // Defaults

const departmentOptions = departments.map((dept) => dept.departmentName)
const costCenterOptions = categories.map((cat) => cat.categoryName)

interface AssetFormData {
  assetName: string
  description: string
  assetTagId: string
  company: string
  purchaseDate: string
  cost: string
  purchaseFrom: string
  brand: string
  model: string
  serialNo: string
  attachment: File | null
  depreciableCost: number
}

const AddAssets = () => {
  // Main form state
  const [formData, setFormData] = useState<AssetFormData>({
    assetName: '',
    description: '',
    assetTagId: '',
    company: '',
    purchaseDate: '',
    cost: '',
    purchaseFrom: '',
    brand: '',
    model: '',
    serialNo: '',
    attachment: null,
    depreciableCost: 0.0,
  })

  // Popup states
  const [siteLocationPopupOpen, setSiteLocationPopupOpen] = useState(false)
  const [departmentPopupOpen, setDepartmentPopupOpen] = useState(false)
  const [costCenterPopupOpen, setCostCenterPopupOpen] = useState(false)
  const [activePopupType, setActivePopupType] = useState<
    'site' | 'location' | null
  >(null)

  // Form data for each popup
  const [siteLocationFormData, setSiteLocationFormData] = useState({
    site: '',
    location: '',
  })

  const [departmentFormData, setDepartmentFormData] = useState({
    departmentName: '',
    departmentCode: '',
    location: '',
    manager: '',
    employeeCount: '',
  })

  const [costCenterFormData, setCostCenterFormData] = useState({
    costCenterName: '',
    costCenterCode: '',
    description: '',
    manager: '',
    budget: '',
  })

  // Handle main form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target

    if (type === 'file' && files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0] || null,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Handle site/location form input changes
  const handleSiteLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setSiteLocationFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle department form input changes
  const handleDepartmentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setDepartmentFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle cost center form input changes
  const handleCostCenterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setCostCenterFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle main form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Here you would typically send the data to your API
  }

  // Handle site/location form submission
  const handleSiteLocationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Site/Location form submitted:', siteLocationFormData)
    // Here you would typically update your site/location options
    setSiteLocationPopupOpen(false)
  }

  // Handle department form submission
  const handleDepartmentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Department form submitted:', departmentFormData)
    // Here you would typically update your department options
    setDepartmentPopupOpen(false)
  }

  // Handle cost center form submission
  const handleCostCenterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Cost Center form submitted:', costCenterFormData)
    // Here you would typically update your cost center options
    setCostCenterPopupOpen(false)
  }

  // Open the appropriate popup based on button clicked
  const openSiteLocationPopup = (type: 'site' | 'location') => {
    setActivePopupType(type)
    setSiteLocationPopupOpen(true)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="assetName">Asset Name(*)</Label>
            <Input
              id="assetName"
              name="assetName"
              value={formData.assetName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description(*)</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetTagId">Asset Tag(*)</Label>
            <Input
              id="assetTagId"
              name="assetTagId"
              value={formData.assetTagId}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company(*)</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseFrom">Purchase From</Label>
            <Input
              id="purchaseFrom"
              name="purchaseFrom"
              value={formData.purchaseFrom}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serialNo">Serial No</Label>
            <Input
              id="serialNo"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="p-6 border rounded-lg shadow-sm bg-white">
            {/* Header */}
            <div className="mb-4 pb-2 border-b">
              <h3 className="font-semibold">
                Site, Location, Department and Cost Center
              </h3>
            </div>

            {/* First row - Site and Location */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="site">Site</Label>
                <div className="flex gap-2">
                  <select
                    id="site"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {siteOptions.map((site) => (
                      <option key={site} value={site}>
                        {site}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="icon"
                    title="Add new site"
                    onClick={() => openSiteLocationPopup('site')}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex gap-2">
                  <select
                    id="location"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {locationOptions.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="icon"
                    title="Add new location"
                    onClick={() => openSiteLocationPopup('location')}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Second row - Department and Cost Center */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="flex gap-2">
                  <select
                    id="department"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="icon"
                    title="Add new department"
                    onClick={() => setDepartmentPopupOpen(true)}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="costCenter">Cost Center</Label>
                <div className="flex gap-2">
                  <select
                    id="costCenter"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {costCenterOptions.map((cc) => (
                      <option key={cc} value={cc}>
                        {cc}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="icon"
                    title="Add new cost center"
                    onClick={() => setCostCenterPopupOpen(true)}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment</Label>
            <Input
              id="attachment"
              name="attachment"
              type="file"
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4 pb-2 border-b">
            <h3 className="font-semibold">Depreciation Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <Label htmlFor="depreciableCost">Depreciable Cost</Label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  id="depreciableCost"
                  type="number"
                  min={0}
                  max={10000}
                  step={0.01}
                  placeholder="0.00"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Label htmlFor="salvageValue">Salvage Value</Label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  id="salvageValue"
                  type="number"
                  min={0}
                  max={10000}
                  step={0.01}
                  placeholder="0.00"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Label htmlFor="assetLife">Asset Life(Months)</Label>
              <div className="relative flex items-center">
                <Input
                  id="assetLife"
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Label htmlFor="depreciationType">Depreciation Type</Label>
              <div className="relative flex items-center">
                <select
                  id="depreciationType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {deprectypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Label htmlFor="dateAcquired">Date Acquired</Label>
              <div className="relative flex items-center">
                <Input
                  id="dateAcquired"
                  name="dateAcquired"
                  type="date"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>

      {/* Site/Location Popup */}
      <Popup
        isOpen={siteLocationPopupOpen}
        onClose={() => setSiteLocationPopupOpen(false)}
        title={
          activePopupType === 'site' ? 'Add Site' : 'Add Location and Site'
        }
        size="sm:max-w-md"
      >
        <form onSubmit={handleSiteLocationSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={siteLocationFormData.location}
                onChange={handleSiteLocationInputChange}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site">Site</Label>
              <Input
                id="site"
                name="site"
                value={siteLocationFormData.site}
                onChange={handleSiteLocationInputChange}
                placeholder="Enter site"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSiteLocationPopupOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Popup>

      {/* Department Popup */}
      <Popup
        isOpen={departmentPopupOpen}
        onClose={() => setDepartmentPopupOpen(false)}
        title="Add Department"
        size="sm:max-w-md"
      >
        <form onSubmit={handleDepartmentSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="departmentName">Department Name</Label>
              <Input
                id="departmentName"
                name="departmentName"
                value={departmentFormData.departmentName}
                onChange={handleDepartmentInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departmentCode">Department Code</Label>
              <Input
                id="departmentCode"
                name="departmentCode"
                value={departmentFormData.departmentCode}
                onChange={handleDepartmentInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={departmentFormData.location}
                onChange={handleDepartmentInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Input
                  id="manager"
                  name="manager"
                  value={departmentFormData.manager}
                  onChange={handleDepartmentInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCount">Employee Count</Label>
                <Input
                  id="employeeCount"
                  name="employeeCount"
                  value={departmentFormData.employeeCount}
                  onChange={handleDepartmentInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDepartmentPopupOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Popup>

      {/* Cost Center Popup */}
      <Popup
        isOpen={costCenterPopupOpen}
        onClose={() => setCostCenterPopupOpen(false)}
        title="Add Cost Center"
        size="sm:max-w-md"
      >
        <form onSubmit={handleCostCenterSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="costCenterName">Cost Center Name</Label>
              <Input
                id="costCenterName"
                name="costCenterName"
                value={costCenterFormData.costCenterName}
                onChange={handleCostCenterInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costCenterCode">Cost Center Code</Label>
              <Input
                id="costCenterCode"
                name="costCenterCode"
                value={costCenterFormData.costCenterCode}
                onChange={handleCostCenterInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={costCenterFormData.description}
                onChange={handleCostCenterInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Input
                  id="manager"
                  name="manager"
                  value={costCenterFormData.manager}
                  onChange={handleCostCenterInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  name="budget"
                  value={costCenterFormData.budget}
                  onChange={handleCostCenterInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCostCenterPopupOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Popup>
    </div>
  )
}

export default AddAssets
