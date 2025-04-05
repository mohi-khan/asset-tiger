'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Popup } from '@/utils/popup'

const CompanyInfo = () => {
  // State for popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  // State for form data
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  })

  // State for table data
  const [companies, setCompanies] = useState([
    // Sample data, you can start with an empty array if preferred
    {
      id: 1,
      companyName: 'Acme Inc',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
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

    // Add new company to the table
    setCompanies((prev) => [
      ...prev,
      {
        id: Date.now(), // Simple unique ID
        ...formData,
      },
    ])

    // Reset form and close popup
    setFormData({
      companyName: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
    })
    setIsPopupOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-600"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Company Details</h2>
        </div>
        <Button
          className="bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={() => setIsPopupOpen(true)}
        >
          Add
        </Button>
      </div>

      {/* Table for company data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Postal Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.companyName}</TableCell>
                <TableCell>{company.address}</TableCell>
                <TableCell>{company.city}</TableCell>
                <TableCell>{company.state}</TableCell>
                <TableCell>{company.postalCode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Company Logo Upload Section */}
      <div className="mt-8 border rounded-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-600"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Company Logo</h2>
        </div>

        <p className="mb-4">
          Upload your organization&apos;s logo to make this space your own.
        </p>

        <div
          className="border-2 border-dashed rounded-md p-12 flex items-center justify-center bg-gray-50 cursor-pointer"
          onClick={() => document.getElementById('logo-upload')?.click()}
        >
          <p className="text-gray-600">Drop your image here</p>
          <input
            type="file"
            id="logo-upload"
            className="hidden"
            accept=".jpg,.jpeg,.gif,.png"
          />
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Only (JPG, GIF, PNG) are allowed
        </p>

        <div className="flex gap-4 mt-6">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
            Submit
          </Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>

      {/* Popup with form */}
      <Popup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title="Add Company"
        size="sm:max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPopupOpen(false)}
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

export default CompanyInfo
