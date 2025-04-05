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
import { Eye } from 'lucide-react'
import Link from 'next/link'

const Assets = () => {
  // State for popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  // State for form data
  const [formData, setFormData] = useState({
    description: '',
    assetTagId: '',
    company: '',
    purchaseDate: '',
    cost: '',
    purchaseFrom: '',
    brand: '',
    model: '',
    serialNo: '',
    assetName: '',
    attachment: null as File | null,
  })

  // State for table data
  const [assets, setAssets] = useState([
    // Sample data, you can start with an empty array if preferred
    {
      id: 1,
      description: 'Office Laptop',
      assetTagId: 'AST001',
      company: 'Acme Inc',
      purchaseDate: '2023-05-15',
      cost: '1200.00',
      purchaseFrom: 'TechStore',
      brand: 'Dell',
      model: 'XPS 13',
      serialNo: 'DL12345678',
      assetName: 'Developer Laptop',
    },
  ])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target

    if (type === 'file' && files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Add new asset to the table
    setAssets((prev) => [
      ...prev,
      {
        id: Date.now(), // Simple unique ID
        ...formData,
        attachment: formData.attachment ? formData.attachment.name : null,
      },
    ])

    // Reset form and close popup
    setFormData({
      description: '',
      assetTagId: '',
      company: '',
      purchaseDate: '',
      cost: '',
      purchaseFrom: '',
      brand: '',
      model: '',
      serialNo: '',
      assetName: '',
      attachment: null,
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
          <h2 className="text-lg font-semibold">Asset Details</h2>
        </div>
        <Button
          className="bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={() => setIsPopupOpen(true)}
        >
          Add
        </Button>
      </div>

      {/* Table for asset data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>Asset Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Asset Tag ID</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.assetName}</TableCell>
                <TableCell>{asset.description}</TableCell>
                <TableCell>{asset.assetTagId}</TableCell>
                <TableCell>{asset.company}</TableCell>
                <TableCell>{asset.purchaseDate}</TableCell>
                <TableCell>{asset.cost}</TableCell>
                <TableCell>{asset.brand}</TableCell>
                <TableCell>{asset.model}</TableCell>
                <TableCell>
                  <Link href={'/dashboard/assets/assets/asset-details/1'}><Eye /></Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Popup with form */}
      <Popup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title="Add Asset"
        size="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetName">Asset Name</Label>
              <Input
                id="assetName"
                name="assetName"
                value={formData.assetName}
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

            <div className="space-y-2">
              <Label htmlFor="assetTagId">Asset Tag ID</Label>
              <Input
                id="assetTagId"
                name="assetTagId"
                value={formData.assetTagId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
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

            <div className="space-y-2">
              <Label htmlFor="attachment">Attachment</Label>
              <Input
                id="attachment"
                name="attachment"
                type="file"
                onChange={handleInputChange}
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

export default Assets
