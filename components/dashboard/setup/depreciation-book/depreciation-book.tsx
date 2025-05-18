"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popup } from "@/utils/popup"
import { BookOpen } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import type { CreateDepreciationBookType, GetDepreciationBookType } from "@/utils/type"
import { createDepreciationBook, getAllDepreciationBook } from "@/utils/api"
import { tokenAtom, useInitializeUser, userDataAtom } from "@/utils/user"
import { useAtom } from "jotai"

const DepreciationBook = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [userData] = useAtom(userDataAtom)

  // State for popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // State for form data
  const [formData, setFormData] = useState<CreateDepreciationBookType>({
    name: "",
    description: null,
    isActive: true,
    createdBy: userData?.userId || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  // State for table data
  const [depreciationBooks, setDepreciationBooks] = useState<GetDepreciationBookType[]>([])

  const fetchDepreciationBooks = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getAllDepreciationBook(token)
      console.log("🚀 ~ fetchDepreciationBooks ~ response:", response)
      setDepreciationBooks(response.data ?? [])
    } catch (error) {
      console.error("Error fetching depreciation books:", error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // Fetch depreciation books on component mount
  useEffect(() => {
    fetchDepreciationBooks()
  }, [fetchDepreciationBooks])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }))
  }

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      try {
        const payload = {
          ...formData,
          createdBy: userData?.userId || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        await createDepreciationBook(payload, token)

        // Refresh the depreciation books list
        fetchDepreciationBooks()

        // Reset form and close popup
        resetForm()
      } catch (error) {
        console.error("Error creating depreciation book:", error)
      }
    },
    [formData, userData, token, fetchDepreciationBooks],
  )

  const resetForm = () => {
    setFormData({
      name: "",
      description: null,
      isActive: true,
      createdBy: userData?.userId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    setIsPopupOpen(false)
  }

  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-"
    return format(new Date(dateString), "MMM dd, yyyy")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <BookOpen className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold">Depreciation Books</h2>
        </div>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black" onClick={() => setIsPopupOpen(true)}>
          Add
        </Button>
      </div>

      {/* Table for depreciation book data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading depreciation books...
                </TableCell>
              </TableRow>
            ) : depreciationBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No depreciation books found
                </TableCell>
              </TableRow>
            ) : (
              depreciationBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.id}</TableCell>
                  <TableCell>{book.name}</TableCell>
                  <TableCell>{book.description || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${book.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {book.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(book.createdAt)}</TableCell>
                  <TableCell>{formatDate(book.updatedAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Popup with form */}
      <Popup isOpen={isPopupOpen} onClose={resetForm} title="Add Depreciation Book" size="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="isActive" checked={formData.isActive} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Popup>
    </div>
  )
}

export default DepreciationBook
