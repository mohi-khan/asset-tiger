'use client'

import type React from 'react'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { Popup } from '@/utils/popup'
import {
  CreateAssetType,
  GetCategoryType,
  GetCostCenterType,
  GetDepartmentType,
  GetLocationType,
  GetSiteType,
  GetSupplierType,
} from '@/utils/type'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import {
  createAsset,
  getAllCategories,
  getAllCompanies,
  getAllCostCenters,
  getAllDepartments,
  getAllLocations,
  getAllSites,
  getAllSuppliers,
} from '@/utils/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { format } from 'date-fns'

const countries = [
  { id: 1, name: 'Bangladesh' },
  { id: 2, name: 'USA' },
  { id: 3, name: 'Canada' },
]

const AddAssets = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [userData] = useAtom(userDataAtom)

  // Main form state
  const [formData, setFormData] = useState<CreateAssetType>({
    assetCode: '',
    assetName: '',
    startDate: '',
    purDate: '',
    categoryId: 0,
    supplierId: null,
    user: null,
    locationId: null,
    sectionId: null,
    departmentId: null,
    assetValue: 0,
    currentValue: 0,
    depRate: 0,
    salvageValue: 0,
    status: '',
    soldDate: null,
    soldValue: null,
    mfgCode: null,
    mfgYear: null,
    countryCode: null,
    model: null,
    slNo: null,
    costCenterId: null,
    assetGlCode: null,
    createdBy: userData?.userId || 0,
    updatedBy: null,
  })

  // Popup states
  const [siteLocationPopupOpen, setSiteLocationPopupOpen] = useState(false)
  const [departmentPopupOpen, setDepartmentPopupOpen] = useState(false)
  const [costCenterPopupOpen, setCostCenterPopupOpen] = useState(false)
  const [activePopupType, setActivePopupType] = useState<
    'site' | 'location' | null
  >(null)

  // API data states
  const [departments, setDepartments] = useState<GetDepartmentType[]>([])
  const [categories, setCategories] = useState<GetCategoryType[]>([])
  const [locations, setLocations] = useState<GetLocationType[]>([])
  const [sites, setSites] = useState<GetSiteType[]>([])
  const [suppliers, setSuppliers] = useState<GetSupplierType[]>([])
  const [costCenters, setCostCenters] = useState<GetCostCenterType[]>([])
  const [loading, setLoading] = useState(true)

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

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return

      try {
        setLoading(true)
        const [
          departmentsData,
          categoriesData,
          locationsData,
          sitesData,
          suppliersData,
          costCentersData,
        ] = await Promise.all([
          getAllDepartments(token),
          getAllCategories(token),
          getAllLocations(token),
          getAllSites(token),
          getAllSuppliers(token),
          getAllCostCenters(token),
        ])
        setDepartments(departmentsData.data || [])
        setCategories(categoriesData.data || [])
        setLocations(locationsData.data || [])
        setSites(sitesData.data || [])
        setSuppliers(suppliersData.data || [])
        setCostCenters(costCentersData.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchData()
    }
  }, [token])

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
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      console.log(formData)
      e.preventDefault()
      try {
        const processedData = {
          ...formData,
          mfgYear: Number(formData.mfgYear || '0'),
          mfgCode: Number(formData.mfgCode || '0'),
          assetValue: Number(formData.assetValue || 0),
          currentValue: Number(formData.currentValue || 0),
          depRate: Number(formData.depRate || 0),
          salvageValue: Number(formData.salvageValue || 0),
          soldValue: Number(formData.soldValue || 0),
          status: formData.status || '',
        }
        await createAsset(processedData, token)
      } catch (error) {
        console.error('Error creating asset:', error)
      }
    },
    [formData, userData, token]
  )

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
        <div className="grid gap-2">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="assetCode">Asset Code(*)</Label>
              <Input
                id="assetCode"
                name="assetCode"
                value={formData.assetCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                name="purDate"
                type="date"
                value={formData.purDate || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soldDate">Sold Date</Label>
              <Input
                id="soldDate"
                name="soldDate"
                type="date"
                value={formData.soldDate || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetGlCode">Asset Gl Code</Label>
              <Input
                id="assetGlCode"
                name="assetGlCode"
                value={formData.purDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site">Supplier</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.supplierId?.toString() || ''}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      supplierId: value ? Number.parseInt(value) : null,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem
                        key={supplier.id}
                        value={supplier.id?.toString() ?? ''}
                      >
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Label htmlFor="site">Category</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.categoryId?.toString() || ''}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: value ? Number.parseInt(value) : 0,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((category) => category.category_id !== undefined)
                      .map((category) => (
                        <SelectItem
                          key={category.category_id}
                          value={category.category_id!.toString()}
                        >
                          {category.category_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
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
              <Label htmlFor="site">Country</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.countryCode?.toString() || ''}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      countryCode: value ? Number.parseInt(value) : null,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem
                        key={country.id}
                        value={country.id!.toString()}
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                name="model"
                value={formData.model || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slNo">Serial No</Label>
              <Input
                id="slNo"
                name="slNo"
                value={formData.slNo || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Input
                id="user"
                name="user"
                value={formData.user || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mfgCode">Manufacture Code</Label>
              <Input
                id="mfgCode"
                name="mfgCode"
                type="number"
                value={formData.mfgCode || 0}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mfgYear">Manufacture Year</Label>
              <Input
                id="mfgYear"
                name="mfgYear"
                type="number"
                value={formData.mfgYear || 0}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="status">Active Status</Label>
                <Switch
                  id="status"
                  name="status"
                  onChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: checked ? 'active' : 'inactive',
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="p-6 my-5 border rounded-lg shadow-sm bg-white">
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
                  <Select
                    value={formData.sectionId?.toString() || ''}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        sectionId: value ? Number.parseInt(value) : null,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Site" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem
                          key={site.id}
                          value={site.id?.toString() ?? ''}
                        >
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select
                    value={formData.locationId?.toString() || ''}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        locationId: value ? Number.parseInt(value) : null,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem
                          key={location.id}
                          value={location.id?.toString() ?? ''}
                        >
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select
                    value={formData.departmentId?.toString() || ''}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        departmentId: value ? Number.parseInt(value) : null,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem
                          key={department.departmentID}
                          value={department.departmentID.toString()}
                        >
                          {department.departmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select
                    value={formData.costCenterId?.toString() || ''}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        costCenterId: value ? Number.parseInt(value) : null,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {costCenters.map((costCenter) => (
                        <SelectItem
                          key={costCenter.costCenterId}
                          value={costCenter.costCenterId.toString()}
                        >
                          {costCenter.costCenterName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

          <div className="p-6 mb-5 border rounded-lg shadow-sm bg-white">
            {/* Header */}
            <div className="mb-4 pb-2 border-b">
              <h3 className="font-semibold">Depreciation Info</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center mb-5">
              <Label htmlFor="assetValue">Asset Value</Label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  id="assetValue"
                  type="number"
                 name='assetValue'
                  placeholder="0.00"
                  className="pl-9"
                  value={formData.assetValue || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center mb-5">
              <Label htmlFor="currentValue">Current Value</Label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  id="currentValue"
                  type="number"
                  name='currentValue'
                  placeholder="0.00"
                  className="pl-9"
                  value={formData.currentValue || ''}
                  onChange={handleInputChange}
                />
                {/* <Input
                id="mfgCode"
                type="number"
                name="mfgCode"
                value={formData.mfgCode || 0}
                onChange={handleInputChange}
                required
              /> */}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center mb-5">
              <Label htmlFor="soldValue">Sold Value</Label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  id="soldValue"
                  type="number"
                  name='soldValue'
                  placeholder="0.00"
                  className="pl-9"
                  value={formData.soldValue || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center mb-5">
              <Label htmlFor="salvageValue">Salvage Value</Label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  id="salvageValue"
                  type="number"
                  name='salvageValue'
                  placeholder="0.00"
                  className="pl-9"
                  value={formData.salvageValue || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <Label htmlFor="depRate">Depreciation Rate</Label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
                <Input
                  id="depRate"
                  type="number"
                  name='depRate'
                  placeholder="0.00"
                  className="pl-9"
                  value={formData.depRate || ''}
                  onChange={handleInputChange}
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
