"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popup } from "@/utils/popup"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FolderOpen } from "lucide-react"
import { Category, initialCategories } from "@/app/type"

const Categories = () => {
  // State for popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  // State for form data
  const [formData, setFormData] = useState({
    categoryName: "",
    assetAccountingCode: "",
    depreciationAccountingCode: "",
    depreciationMethod: "",
  })

  // State for table data
  const [categories, setCategories] =useState<Category[]>(initialCategories)

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle select change for depreciation method
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      depreciationMethod: value,
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Add new category to the table
    setCategories((prev) => [
      ...prev,
      {
        id: Date.now(), // Simple unique ID
        ...formData,
      },
    ])

    // Reset form and close popup
    setFormData({
      categoryName: "",
      assetAccountingCode: "",
      depreciationAccountingCode: "",
      depreciationMethod: "",
    })
    setIsPopupOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <FolderOpen className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold">Categories</h2>
        </div>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black" onClick={() => setIsPopupOpen(true)}>
          Add
        </Button>
      </div>

      {/* Table for category data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Asset Accounting Code</TableHead>
              <TableHead>Depreciation Accounting Code</TableHead>
              <TableHead>Depreciation Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.categoryName}</TableCell>
                <TableCell>{category.assetAccountingCode}</TableCell>
                <TableCell>{category.depreciationAccountingCode}</TableCell>
                <TableCell>{category.depreciationMethod}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Popup with form */}
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title="Add Category" size="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetAccountingCode">Asset Accounting Code</Label>
              <Input
                id="assetAccountingCode"
                name="assetAccountingCode"
                value={formData.assetAccountingCode}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depreciationAccountingCode">Depreciation Accounting Code</Label>
              <Input
                id="depreciationAccountingCode"
                name="depreciationAccountingCode"
                value={formData.depreciationAccountingCode}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depreciationMethod">Depreciation Method</Label>
              <Select value={formData.depreciationMethod} onValueChange={handleSelectChange} required>
                <SelectTrigger id="depreciationMethod">
                  <SelectValue placeholder="Select depreciation method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reducing Balance Method">Reducing Balance Method</SelectItem>
                  <SelectItem value="Straight Line Method">Straight Line Method</SelectItem>
                </SelectContent>
              </Select>
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

export default Categories

