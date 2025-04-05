"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form } from "@/components/ui/form"
import { initialCategories, initialDepartments } from "@/app/type"
import { Plus } from "lucide-react"
const departments = initialDepartments; 
const  categories = initialCategories ;
const siteOptions = Array.from(new Set(departments.map(dept => dept.location)))
const locationOptions = ["Building A", "Building B", "Floor 1", "Floor 2"] // Defaults
const deprectypeOptions = ["Straigth Line", "Reducing Balnce Method", "Double Reducing Method"] // Defaults

const departmentOptions = departments.map(dept => dept.departmentName)
const costCenterOptions = categories.map(cat => cat.categoryName)
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
  depreciableCost:number,
}

const AddAssets = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(true)
  const [formData, setFormData] = useState<AssetFormData>({
    assetName: "",
    description: "",
    assetTagId: "",
    company: "",
    purchaseDate: "",
    cost: "",
    purchaseFrom: "",
    brand: "",
    model: "",
    serialNo: "",
    attachment: null,
    depreciableCost:0.00,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target

    if (type === "file" && files) {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your API
    // After successful submission, close the popup
    setIsPopupOpen(false)
  }

  return (
    <div>
   
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetName">Asset Name(*)</Label>
              <Input id="assetName" name="assetName" value={formData.assetName} onChange={handleInputChange} required />
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
              <Input id="company" name="company" value={formData.company} onChange={handleInputChange} required />
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
                <Input id="brand" name="brand" value={formData.brand} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" name="model" value={formData.model} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNo">Serial No</Label>
              <Input id="serialNo" name="serialNo" value={formData.serialNo} onChange={handleInputChange} required />
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-white">
      {/* Header */}
      <div className="mb-4 pb-2 border-b">
        <h3 className="font-semibold">Site,Location, Department and Cost Center</h3>
      
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
                <option key={site} value={site}>{site}</option>
              ))}
            </select>
            <Button variant="outline" size="icon" title="Add new site">
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
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <Button variant="outline" size="icon" title="Add new location">
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
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <Button variant="outline" size="icon" title="Add new department">
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
                <option key={cc} value={cc}>{cc}</option>
              ))}
            </select>
            <Button variant="outline" size="icon" title="Add new cost center">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
            <div className="space-y-2">
              <Label htmlFor="attachment">Attachment</Label>
              <Input id="attachment" name="attachment" type="file" onChange={handleInputChange} />
            </div>
          </div>
          <div className="mb-4 pb-2 border-b">
        <h3 className="font-semibold">Depriciation Info</h3>
        <div className="grid grid-cols-2 gap-4">
              <Label htmlFor="serialNo">Depreciale Cost</Label>
         
              <div className="relative flex items-center">
    <div className="absolute left-3 pointer-events-none">
      <span className="text-gray-500">$</span>
    </div>
              <Input id="currency" type="number" min={0} max={10000} step={0.01} placeholder="0.00" className="pl-9" />
            </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Label htmlFor="serialNo">Salvage Value</Label>
         
              <div className="relative flex items-center">
    <div className="absolute left-3 pointer-events-none">
      <span className="text-gray-500">$</span>
    </div>
              <Input id="currency" type="number" min={0} max={10000} step={0.01} placeholder="0.00" className="pl-9" />
            </div>
            </div> 
            <div className="grid grid-cols-2 gap-4">
              <Label htmlFor="serialNo">Asset Life(Months)</Label>
         
              <div className="relative flex items-center">

              <Input id="currency" type="number" min={0} max={100} step={0.01} placeholder="0.00" className="pl-9" />
            </div>
            </div>   
            <div className="grid grid-cols-2 gap-4">
              <Label htmlFor="serialNo">Depreciation Type</Label>
         
              <div className="relative flex items-center">
   
              <select
              id="department"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {deprectypeOptions.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            </div>
            </div>   
            <div className="grid grid-cols-2 gap-4">
              <Label htmlFor="serialNo">Date Acquired</Label>
         
              <div className="relative flex items-center">
   
              <Input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  required
                />
            </div>
            </div>   
      </div>
      
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsPopupOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      
    </div>
  )
}

export default AddAssets

