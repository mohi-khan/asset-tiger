"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popup } from "@/utils/popup"
import { Users } from "lucide-react"

const Departments = () => {
  // State for popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  // State for form data
  const [formData, setFormData] = useState({
    departmentName: "",
    departmentCode: "",
    location: "",
    manager: "",
    employeeCount: "",
  })

  // State for table data
  const [departments, setDepartments] = useState([
    // Sample data
    {
      id: 1,
      departmentName: "Human Resources",
      departmentCode: "HR-001",
      location: "Headquarters",
      manager: "Jane Doe",
      employeeCount: "12",
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

    // Add new department to the table
    setDepartments((prev) => [
      ...prev,
      {
        id: Date.now(), // Simple unique ID
        ...formData,
      },
    ])

    // Reset form and close popup
    setFormData({
      departmentName: "",
      departmentCode: "",
      location: "",
      manager: "",
      employeeCount: "",
    })
    setIsPopupOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <Users className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold">Departments</h2>
        </div>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black" onClick={() => setIsPopupOpen(true)}>
          Add
        </Button>
      </div>

      {/* Table for department data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>Department Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Employee Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.departmentName}</TableCell>
                <TableCell>{department.departmentCode}</TableCell>
                <TableCell>{department.location}</TableCell>
                <TableCell>{department.manager}</TableCell>
                <TableCell>{department.employeeCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Popup with form */}
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title="Add Department" size="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="departmentName">Department Name</Label>
              <Input
                id="departmentName"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departmentCode">Department Code</Label>
              <Input
                id="departmentCode"
                name="departmentCode"
                value={formData.departmentCode}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleInputChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Input id="manager" name="manager" value={formData.manager} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCount">Employee Count</Label>
                <Input
                  id="employeeCount"
                  name="employeeCount"
                  value={formData.employeeCount}
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
      </Popup>
    </div>
  )
}

export default Departments

