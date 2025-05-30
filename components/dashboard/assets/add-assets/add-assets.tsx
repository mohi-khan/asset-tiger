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
  CreateCategoryType,
  CreateCostCenterType,
  CreateDepartmentType,
  CreateLocationType,
  CreateSupplierType,
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
  createCategory,
  createCostCenter,
  createDepartment,
  createLocation,
  createSite,
  createSupplier,
  getAllCategories,
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
import { format, set } from 'date-fns'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

const countries = [
  { id: 1, name: 'Bangladesh' },
  { id: 2, name: 'USA' },
  { id: 3, name: 'Canada' },
]

const AddAssets = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [userData] = useAtom(userDataAtom)

  const router = useRouter()

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
  const [locationPopupOpen, setLocationPopupOpen] = useState(false)
  const [sitePopupOpen, setSitePopupOpen] = useState(false)
  const [departmentPopupOpen, setDepartmentPopupOpen] = useState(false)
  const [costCenterPopupOpen, setCostCenterPopupOpen] = useState(false)
  const [categoryPopupOpen, setCategoryPopupOpen] = useState(false)
  const [supplierPopupOpen, setSupplierPopupOpen] = useState(false)

  // API data states
  const [departments, setDepartments] = useState<GetDepartmentType[]>([])
  const [categories, setCategories] = useState<GetCategoryType[]>([])
  const [locations, setLocations] = useState<GetLocationType[]>([])
  const [sites, setSites] = useState<GetSiteType[]>([])
  const [suppliers, setSuppliers] = useState<GetSupplierType[]>([])
  const [costCenters, setCostCenters] = useState<GetCostCenterType[]>([])
  const [loading, setLoading] = useState(true)

  // Form data for each popup
  const [locationFormData, setLocationFormData] = useState<CreateLocationType>({
    name: '',
  })

  // Site form state
  const [siteFormData, setSiteFormData] = useState({
    name: '',
  })

  const [departmentFormData, setDepartmentFormData] =
    useState<CreateDepartmentType>({
      departmentName: '',
      budget: undefined,
      companyCode: undefined,
      isActive: true,
      startDate: new Date(),
      endDate: null,
      createdBy: userData?.userId || 0,
      actual: undefined,
    })

  const [costCenterFormData, setCostCenterFormData] =
    useState<CreateCostCenterType>({
      costCenterName: '',
      costCenterDescription: '',
      budget: 0,
      actual: 0,
      companyCode: null,
      isActive: true,
      isVehicle: false,
      startDate: null,
      endDate: null,
      createdBy: userData?.userId || 1, // Default value, should be replaced with actual user ID
      createdAt: new Date(),
      updatedBy: null,
      updatedAt: null,
    })

  const [supplierFormData, setSupplierFormData] = useState<CreateSupplierType>({
    name: '',
    displayName: '',
    companyName: '',
    type: 'Supplier',
    email: '',
    phone: '',
    mobile: '',
    website: '',
    isCompany: true,
    vat: '',
    street: '',
    city: '',
    zip: '',
    active: true,
    comment: '',
    createdBy: userData?.userId || 0,
    createdAt: new Date(),
  })

  const [categoryFormData, setCategoryFormData] = useState<CreateCategoryType>({
    category_name: '',
    depreciation_rate: null,
    account_code: '',
    depreciation_account_code: '',
    parent_cat_code: null,
    created_by: userData?.userId || 0,
    created_time: new Date(),
  })

  // Fetch data from APIs
  const fetchData = useCallback(async () => {
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
      if (
        departmentsData?.error?.status === 401 ||
        categoriesData?.error?.status === 401 ||
        locationsData?.error?.status === 401 ||
        sitesData?.error?.status === 401 ||
        suppliersData?.error?.status === 401 ||
        costCentersData?.error?.status === 401
      ) {
        router.push('/unauthorized-access')
        return
      } else {
        setDepartments(departmentsData.data || [])
        setCategories(categoriesData.data || [])
        setLocations(locationsData.data || [])
        setSites(sitesData.data || [])
        setSuppliers(suppliersData.data || [])
        setCostCenters(costCentersData.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchData()
  }, [token, fetchData])

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

  // Handle department form input changes
  const handleDepartmentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target

    if (type === 'number') {
      setDepartmentFormData((prev) => ({
        ...prev,
        [name]: value ? Number(value) : undefined,
      }))
    } else if (type === 'date') {
      setDepartmentFormData((prev) => ({
        ...prev,
        [name]: value ? new Date(value) : null,
      }))
    } else {
      setDepartmentFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Handle cost center form input changes
  const handleCostCenterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target

    // Convert numeric fields to numbers
    if (name === 'budget' || name === 'actual' || name === 'companyCode') {
      setCostCenterFormData((prev) => ({
        ...prev,
        [name]:
          value === '' ? (name === 'companyCode' ? null : 0) : Number(value),
      }))
    } else if (type === 'checkbox') {
      setCostCenterFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else if (type === 'date') {
      setCostCenterFormData((prev) => ({
        ...prev,
        [name]: value ? new Date(value) : null,
      }))
    } else {
      setCostCenterFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setLocationFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSupplierInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target
    setSupplierFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setCategoryFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleParentCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      parent_cat_code: value === '' ? null : Number(value),
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

  const handleCheckboxChange = (checked: boolean) => {
    setDepartmentFormData((prev) => ({
      ...prev,
      isActive: checked,
    }))
  }

  const resetDepartmentForm = () => {
    setDepartmentFormData({
      departmentName: '',
      budget: undefined,
      companyCode: undefined,
      isActive: true,
      startDate: new Date(),
      endDate: null,
      createdBy: userData?.userId || 0,
      actual: undefined,
    })
    setDepartmentPopupOpen(false)
    fetchData()
  }

  const resetCostCenterForm = () => {
    setCostCenterFormData({
      costCenterName: '',
      costCenterDescription: '',
      budget: 0,
      actual: 0,
      companyCode: null,
      isActive: true,
      isVehicle: false,
      startDate: null,
      endDate: null,
      createdBy: userData?.userId || 0,
      createdAt: new Date(),
      updatedBy: null,
      updatedAt: null,
    })
    setCostCenterPopupOpen(false)
    fetchData()
  }

  const resetLocationForm = () => {
    setLocationFormData({
      name: '',
    })
    setLocationPopupOpen(false)
    fetchData()
  }

  const resetCateogryForm = () => {
    setCategoryFormData({
      category_name: '',
      depreciation_rate: null,
      account_code: '',
      depreciation_account_code: '',
      parent_cat_code: null,
      created_by: userData?.userId || 0,
      created_time: new Date(),
    })
    setCategoryPopupOpen(false)
    fetchData()
  }

  // Handle department form submission
  const handleDepartmentSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    try {
      // Convert Date objects to 'YYYY-MM-DD' strings
      const payload = {
        ...departmentFormData,
        startDate: departmentFormData.startDate
          ? new Date(departmentFormData.startDate)
          : null,
        endDate: departmentFormData.endDate
          ? new Date(departmentFormData.endDate)
          : null,
      }

      await createDepartment(payload, token)

      // Reset form and close popup
      resetDepartmentForm()
    } catch (error) {
      console.error('Error creating department:', error)
    }
  }

  // Handle cost center form submission
  const handleCostCenterSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    try {
      // Call API to create cost center
      await createCostCenter(costCenterFormData, token)

      // Reset form and close popup
      setCostCenterFormData({
        costCenterName: '',
        costCenterDescription: '',
        budget: 0,
        actual: 0,
        companyCode: null,
        isActive: true,
        isVehicle: false,
        startDate: null,
        endDate: null,
        createdBy: userData?.userId || 0,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: null,
      })

      setCostCenterPopupOpen(false)
      resetCostCenterForm()
      toast({
        title: 'Success',
        description: 'Cost center created successfully',
      })
    } catch (error) {
      console.error('Error creating cost center:', error)
      toast({
        title: 'Error',
        description: 'Failed to create cost center. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Handle location form submission
  const handleLocationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('site/location form submitted:', locationFormData)
    // Here you would typically update your department options
    try {
      await createLocation(locationFormData, token)
      setLocationFormData({
        name: '',
      })
      setLocationPopupOpen(false)
      toast({
        title: 'Success',
        description: 'Location created successfully',
      })
      resetLocationForm()
    } catch (error) {
      console.log(error)
    }
    setDepartmentPopupOpen(false)
  }

  // Reset site form
  const resetSiteForm = () => {
    setSiteFormData({ name: '' })
  }

  // Handle site input change
  const handleSiteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSiteFormData({ ...siteFormData, [e.target.name]: e.target.value })
  }

  // Handle site form submission
  const handleSiteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('site form submitted:', siteFormData)
    try {
      await createSite(siteFormData, token)
      setSiteFormData({ name: '' })
      setSitePopupOpen(false)
      toast({
        title: 'Success',
        description: 'Site created successfully',
      })
      resetSiteForm()
    } catch (error) {
      console.error('Error creating site:', error)
      toast({
        title: 'Error',
        description: 'Failed to create site. Please try again.',
        variant: 'destructive',
      })
    }
  }
  // Handle category form submission
  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await createCategory(categoryFormData, token)
      console.log('category form submitted:', categoryFormData)
      setCategoryFormData({
        category_name: '',
        depreciation_rate: null,
        account_code: '',
        depreciation_account_code: '',
        parent_cat_code: null,
        created_by: userData?.userId || 0,
        created_time: new Date(),
      })
      setCategoryPopupOpen(false)
      toast({
        title: 'Success',
        description: 'Category created successfully',
      })
      resetCateogryForm()
    } catch (error) {
      console.error('Error creating category:', error)
      toast({
        title: 'Error',
        description: 'Failed to create category. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const resetSupplierForm = () => {
    setSupplierFormData({
      name: '',
      displayName: '',
      companyName: '',
      type: 'Supplier',
      email: '',
      phone: '',
      mobile: '',
      website: '',
      isCompany: true,
      vat: '',
      street: '',
      city: '',
      zip: '',
      active: true,
      comment: '',
      createdBy: userData?.userId || 0,
      createdAt: new Date(),
    })
    setSupplierPopupOpen(false)
    fetchData()
  }

  const handleSupplierSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      try {
        const payload = {
          ...supplierFormData,
          createdBy: userData?.userId || 0,
          createdAt: new Date(),
        }

        await createSupplier(payload, token)
        // Reset form and close popup
        resetSupplierForm()
      } catch (error) {
        console.error('Error creating supplier:', error)
      }
    },
    [formData, userData, token]
  )

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setSupplierFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
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
                  title="Add new Supplier"
                  onClick={() => setSupplierPopupOpen(true)}
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
                  onClick={() => setCategoryPopupOpen(true)}
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
                    onClick={() => setSitePopupOpen(true)}
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
                    onClick={() => setLocationPopupOpen(true)}
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
                      <SelectValue placeholder="Select a cost center" />
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
                  name="assetValue"
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
                  name="currentValue"
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
                  name="soldValue"
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
                  name="salvageValue"
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
                  name="depRate"
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
      {/* Site Popup */}
      <Popup
        isOpen={sitePopupOpen}
        onClose={() => setSitePopupOpen(false)}
        title="Add Site"
        size="sm:max-w-md"
      >
        <form onSubmit={handleSiteSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="name"
                name="name"
                value={siteFormData.name}
                onChange={handleSiteInputChange}
                placeholder="Enter Site Name"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSitePopupOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Popup>
      {/* Location Popup */}
      <Popup
        isOpen={locationPopupOpen}
        onClose={() => setLocationPopupOpen(false)}
        title="Add Location"
        size="sm:max-w-md"
      >
        <form onSubmit={handleLocationSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="name"
                name="name"
                value={locationFormData.name}
                onChange={handleLocationInputChange}
                placeholder="Enter Location"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocationPopupOpen(false)}
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
        onClose={resetDepartmentForm}
        title="Add Department"
        size="sm:max-w-md"
      >
        <form onSubmit={handleDepartmentSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="departmentName">Department Name*</Label>
              <Input
                id="departmentName"
                name="departmentName"
                value={departmentFormData.departmentName || ''}
                onChange={handleDepartmentInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                value={
                  departmentFormData.budget !== undefined &&
                  departmentFormData.budget !== null
                    ? departmentFormData.budget
                    : ''
                }
                onChange={handleDepartmentInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyCode">Company Code</Label>
              <Input
                id="companyCode"
                name="companyCode"
                type="number"
                value={
                  departmentFormData.companyCode !== undefined &&
                  departmentFormData.companyCode !== null
                    ? departmentFormData.companyCode
                    : ''
                }
                onChange={handleDepartmentInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actual">Actual</Label>
              <Input
                id="actual"
                name="actual"
                type="number"
                value={
                  departmentFormData.actual !== undefined &&
                  departmentFormData.actual !== null
                    ? departmentFormData.actual
                    : ''
                }
                onChange={handleDepartmentInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={
                    departmentFormData.startDate
                      ? format(
                          new Date(departmentFormData.startDate),
                          'yyyy-MM-dd'
                        )
                      : ''
                  }
                  onChange={handleDepartmentInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={
                    departmentFormData.endDate
                      ? format(
                          new Date(departmentFormData.endDate),
                          'yyyy-MM-dd'
                        )
                      : ''
                  }
                  onChange={handleDepartmentInputChange}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={departmentFormData.isActive ?? false}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetDepartmentForm}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Popup>{' '}
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
              <Label htmlFor="costCenterDescription">Description</Label>
              <Input
                id="costCenterDescription"
                name="costCenterDescription"
                value={costCenterFormData.costCenterDescription || ''}
                onChange={handleCostCenterInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={costCenterFormData.budget}
                  onChange={handleCostCenterInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actual">Actual</Label>
                <Input
                  id="actual"
                  name="actual"
                  type="number"
                  value={costCenterFormData.actual}
                  onChange={handleCostCenterInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={costCenterFormData.isActive || false}
                onChange={handleCostCenterInputChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyCode">Company Code</Label>
            <Input
              id="companyCode"
              name="companyCode"
              type="number"
              value={costCenterFormData.companyCode || ''}
              onChange={handleCostCenterInputChange}
            />
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="isVehicle"
              name="isVehicle"
              checked={costCenterFormData.isVehicle || false}
              onChange={handleCostCenterInputChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isVehicle">Is Vehicle</Label>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={
                  costCenterFormData.startDate
                    ? new Date(costCenterFormData.startDate)
                        .toISOString()
                        .split('T')[0]
                    : ''
                }
                onChange={handleCostCenterInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={
                  costCenterFormData.endDate
                    ? new Date(costCenterFormData.endDate)
                        .toISOString()
                        .split('T')[0]
                    : ''
                }
                onChange={handleCostCenterInputChange}
              />
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
      {/* supplier popup */}
      <Popup
        isOpen={supplierPopupOpen}
        onClose={resetSupplierForm}
        title="Add Supplier"
        size="sm:max-w-2xl"
      >
        <form onSubmit={handleSupplierSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name*</Label>
              <Input
                id="name"
                name="name"
                value={supplierFormData.name}
                onChange={handleSupplierInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                name="displayName"
                value={supplierFormData.displayName || ''}
                onChange={handleSupplierInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type*</Label>
              <Select
                name="type"
                value={supplierFormData.type || ''}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                  <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={supplierFormData.companyName || ''}
                onChange={handleSupplierInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile*</Label>
              <Input
                id="mobile"
                name="mobile"
                value={supplierFormData.mobile}
                onChange={handleSupplierInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={supplierFormData.phone || ''}
                onChange={handleSupplierInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={supplierFormData.email || ''}
                onChange={handleSupplierInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={supplierFormData.website || ''}
                onChange={handleSupplierInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City*</Label>
              <Input
                id="city"
                name="city"
                value={supplierFormData.city}
                onChange={handleSupplierInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                name="street"
                value={supplierFormData.street || ''}
                onChange={handleSupplierInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                name="zip"
                value={supplierFormData.zip || ''}
                onChange={handleSupplierInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vat">VAT</Label>
              <Input
                id="vat"
                name="vat"
                value={supplierFormData.vat || ''}
                onChange={handleSupplierInputChange}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Input
                id="comment"
                name="comment"
                value={supplierFormData.comment || ''}
                onChange={handleSupplierInputChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCompany"
                name="isCompany"
                checked={supplierFormData.isCompany || false}
                onChange={handleSupplierInputChange}
              />
              <Label htmlFor="isCompany">Is Company</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                name="active"
                checked={supplierFormData.active || false}
                onChange={handleSupplierInputChange}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={resetSupplierForm}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Popup>
      {/* category popup */}
      <Popup
        isOpen={categoryPopupOpen}
        onClose={() => setCategoryPopupOpen(false)}
        title="Add Category"
        size="sm:max-w-md"
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="category_name">Category Name</Label>
              <Input
                id="category_name"
                name="category_name"
                value={categoryFormData.category_name || ''}
                onChange={handleCategoryInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_code">Asset Accounting Code</Label>
              <Input
                id="account_code"
                name="account_code"
                value={categoryFormData.account_code || ''}
                onChange={handleCategoryInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depreciation_account_code">
                Depreciation Accounting Code
              </Label>
              <Input
                id="depreciation_account_code"
                name="depreciation_account_code"
                value={categoryFormData.depreciation_account_code || ''}
                onChange={handleCategoryInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depreciation_rate">Depreciation Rate (%)</Label>
              <Input
                id="depreciation_rate"
                name="depreciation_rate"
                type="number"
                min="0"
                step="0.01"
                value={
                  categoryFormData.depreciation_rate === null
                    ? ''
                    : Number(categoryFormData.depreciation_rate)
                }
                onChange={(e) => {
                  const value =
                    e.target.value === undefined ? null : Number(e.target.value)
                  handleCategoryInputChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: 'depreciation_rate',
                      value,
                    },
                  })
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_cat_code">Parent Category</Label>
              <Select
                value={categoryFormData.parent_cat_code?.toString() || ''}
                onValueChange={(value) => {
                  handleParentCategoryChange(value)
                  setCategoryFormData((prev) => ({
                    ...prev,
                    parent_cat_code: value === 'none' ? null : Number(value),
                  }))
                }}
              >
                <SelectTrigger id="parent_cat_code">
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.category_id}
                      value={category.category_id?.toString() || ''}
                    >
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSitePopupOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Popup>
    </div>
  )
}

export default AddAssets
