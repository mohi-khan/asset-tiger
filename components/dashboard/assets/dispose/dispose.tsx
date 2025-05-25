"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popup } from "@/utils/popup"
import { Trash2 } from "lucide-react"
import { format } from "date-fns"
import type { CreateDisposeType, GetDisposeType } from "@/utils/type"
import { createDispose, getAllDispose } from "@/utils/api"
import { tokenAtom, useInitializeUser, userDataAtom } from "@/utils/user"
import { useAtom } from "jotai"

const Dispose = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [userData] = useAtom(userDataAtom)

  // State for popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // State for form data
  const [formData, setFormData] = useState<CreateDisposeType>({
    asset_id: 0,
    dispose_date: format(new Date(), "yyyy-MM-dd"),
    reason: "",
    method: "Sell",
    value: "",
    remarks: "",
    performed_by: userData?.username || "",
  })

  // State for table data
  const [disposes, setDisposes] = useState<GetDisposeType[]>([])

  const fetchDisposes = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getAllDispose(token)
      console.log("🚀 ~ fetchDisposes ~ response:", response)
      setDisposes(response.data ?? [])
    } catch (error) {
      console.error("Error fetching disposes:", error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // Fetch disposes on component mount
  useEffect(() => {
    fetchDisposes()
  }, [fetchDisposes])

  // Update performed_by when userData changes
  useEffect(() => {
    if (userData?.username) {
      setFormData((prev) => ({
        ...prev,
        performed_by: userData.username,
      }))
    }
  }, [userData])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? Number(value) : 0,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Handle select change for method
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      method: value as "Sell" | "Scrap" | "Donate" | "Transfer",
    }))
  }

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      try {
        await createDispose(formData, token)

        // Refresh the disposes list
        fetchDisposes()

        // Reset form and close popup
        resetForm()
      } catch (error) {
        console.error("Error creating dispose:", error)
      }
    },
    [formData, token, fetchDisposes],
  )

  const resetForm = () => {
    setFormData({
      asset_id: 0,
      dispose_date: format(new Date(), "yyyy-MM-dd"),
      reason: "",
      method: "Sell",
      value: "",
      remarks: "",
      performed_by: userData?.username || "",
    })
    setIsPopupOpen(false)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return format(new Date(dateString), "MMM dd, yyyy")
  }

  // Format currency value
  const formatValue = (value: string) => {
    if (!value) return "-"
    return `$${Number.parseFloat(value).toFixed(2)}`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-red-100 p-2 rounded-md">
            <Trash2 className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold">Asset Disposal</h2>
        </div>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black" onClick={() => setIsPopupOpen(true)}>
          Add Disposal
        </Button>
      </div>

      {/* Table for dispose data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Asset ID</TableHead>
              <TableHead>Dispose Date</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Performed By</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading disposal records...
                </TableCell>
              </TableRow>
            ) : disposes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No disposal records found
                </TableCell>
              </TableRow>
            ) : (
              disposes.map((dispose) => (
                <TableRow key={dispose.id}>
                  <TableCell>{dispose.id}</TableCell>
                  <TableCell>{dispose.asset_id}</TableCell>
                  <TableCell>{formatDate(dispose.dispose_date)}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={dispose.reason}>
                    {dispose.reason}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        dispose.method === "Sell"
                          ? "bg-green-100 text-green-800"
                          : dispose.method === "Donate"
                            ? "bg-blue-100 text-blue-800"
                            : dispose.method === "Transfer"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {dispose.method}
                    </span>
                  </TableCell>
                  <TableCell>{formatValue(dispose.value)}</TableCell>
                  <TableCell>{dispose.performed_by}</TableCell>
                  <TableCell className="max-w-[150px] truncate" title={dispose.remarks || ""}>
                    {dispose.remarks || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Popup with form */}
      <Popup isOpen={isPopupOpen} onClose={resetForm} title="Add Asset Disposal" size="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset_id">Asset ID*</Label>
              <Input
                id="asset_id"
                name="asset_id"
                type="number"
                value={formData.asset_id || ""}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dispose_date">Disposal Date*</Label>
              <Input
                id="dispose_date"
                name="dispose_date"
                type="date"
                value={formData.dispose_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason*</Label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                placeholder="Enter reason for disposal..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Disposal Method*</Label>
              <Select value={formData.method} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select disposal method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sell">Sell</SelectItem>
                  <SelectItem value="Scrap">Scrap</SelectItem>
                  <SelectItem value="Donate">Donate</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Value*</Label>
              <Input
                id="value"
                name="value"
                type="text"
                value={formData.value}
                onChange={handleInputChange}
                required
                placeholder="0.00"
                pattern="^\d+(\.\d{1,2})?$"
                title="Enter a valid decimal number with up to 2 decimal places"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="performed_by">Performed By*</Label>
              <Input
                id="performed_by"
                name="performed_by"
                value={formData.performed_by}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                name="remarks"
                value={formData.remarks || ""}
                onChange={handleInputChange}
                placeholder="Additional notes (optional)..."
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">Save Disposal</Button>
          </div>
        </form>
      </Popup>
    </div>
  )
}

export default Dispose
