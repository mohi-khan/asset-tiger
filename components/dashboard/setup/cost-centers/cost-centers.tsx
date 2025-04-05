"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popup } from "@/utils/popup"
import { Building2 } from "lucide-react"

const CostCenters = () => {
  // State for popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  // State for form data
  const [formData, setFormData] = useState({
    costCenterName: "",
    costCenterCode: "",
    description: "",
    manager: "",
    budget: "",
  })

  // State for table data
  const [costCenters, setCostCenters] = useState([
    // Sample data
    {
      id: 1,
      costCenterName: "Marketing",
      costCenterCode: "MKT-001",
      description: "Marketing department expenses",
      manager: "John Smith",
      budget: "$250,000",
    },
  ])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Add new cost center to the table
    setCostCenters((prev) => [
      ...prev,
      {
        id: Date.now(), // Simple unique ID
        ...formData,
      },
    ])

    // Reset form and close popup
    setFormData({
      costCenterName: "",
      costCenterCode: "",
      description: "",
      manager: "",
      budget: "",
    })
    setIsPopupOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <Building2 className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold">Cost Centers</h2>
        </div>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black" onClick={() => setIsPopupOpen(true)}>
          Add
        </Button>
      </div>

      {/* Table for cost center data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>Cost Center Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Budget</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {costCenters.map((costCenter) => (
              <TableRow key={costCenter.id}>
                <TableCell>{costCenter.costCenterName}</TableCell>
                <TableCell>{costCenter.costCenterCode}</TableCell>
                <TableCell>{costCenter.description}</TableCell>
                <TableCell>{costCenter.manager}</TableCell>
                <TableCell>{costCenter.budget}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Popup with form */}
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title="Add Cost Center" size="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="costCenterName">Cost Center Name</Label>
              <Input
                id="costCenterName"
                name="costCenterName"
                value={formData.costCenterName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costCenterCode">Cost Center Code</Label>
              <Input
                id="costCenterCode"
                name="costCenterCode"
                value={formData.costCenterCode}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Input id="manager" name="manager" value={formData.manager} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input id="budget" name="budget" value={formData.budget} onChange={handleInputChange} required />
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
      </Popup>
    </div>
  )
}

export default CostCenters

