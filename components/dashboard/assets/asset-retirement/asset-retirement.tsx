"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popup } from "@/utils/popup"
import { Minus } from "lucide-react"
import { format } from "date-fns"
import type { CreateAssetPartialRetirementType, GetAssetPartialRetirementType } from "@/utils/type"
import { createRetirement, getAllRetirements } from "@/utils/api"
import { tokenAtom, useInitializeUser, userDataAtom } from "@/utils/user"
import { useAtom } from "jotai"

const AssetRetirement = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [userData] = useAtom(userDataAtom)

  // State for popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // State for form data
  const [formData, setFormData] = useState<CreateAssetPartialRetirementType>({
    assetId: 0,
    retirementDate: format(new Date(), "yyyy-MM-dd"),
    retiredValue: 0,
    reason: "",
    updatedBookValue: undefined,
    createdBy: userData?.userId || 0,
  })

  // State for table data
  const [retirements, setRetirements] = useState<GetAssetPartialRetirementType[]>([])

  const fetchRetirements = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getAllRetirements(token)
      console.log("🚀 ~ fetchRetirements ~ response:", response)
      setRetirements(response.data ?? [])
    } catch (error) {
      console.error("Error fetching asset retirements:", error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // Fetch retirements on component mount
  useEffect(() => {
    fetchRetirements()
  }, [fetchRetirements])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? Number(value) : name === "assetId" || name === "retiredValue" ? 0 : undefined,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      try {
        const payload = {
          ...formData,
          createdBy: userData?.userId || 0,
        }

        await createRetirement(payload, token)

        // Refresh the retirements list
        fetchRetirements()

        // Reset form and close popup
        resetForm()
      } catch (error) {
        console.error("Error creating asset retirement:", error)
      }
    },
    [formData, userData, token, fetchRetirements],
  )

  const resetForm = () => {
    setFormData({
      assetId: 0,
      retirementDate: format(new Date(), "yyyy-MM-dd"),
      retiredValue: 0,
      reason: "",
      updatedBookValue: undefined,
      createdBy: userData?.userId || 0,
    })
    setIsPopupOpen(false)
  }

  // Format date for display
  const formatDate = (date: string | null | undefined) => {
    if (!date) return "-"
    try {
      return format(new Date(date), "MMM dd, yyyy")
    } catch {
      return date
    }
  }

  // Format currency for display
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "-"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-yellow-100 p-2 rounded-md">
            <Minus className="text-yellow-500" />
          </div>
          <h2 className="text-lg font-semibold">Asset Partial Retirements</h2>
        </div>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black" onClick={() => setIsPopupOpen(true)}>
          Add Retirement
        </Button>
      </div>

      {/* Table for asset retirement data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Asset ID</TableHead>
              <TableHead>Retirement Date</TableHead>
              <TableHead>Retired Value</TableHead>
              <TableHead>Updated Book Value</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading asset retirements...
                </TableCell>
              </TableRow>
            ) : retirements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No asset retirements found
                </TableCell>
              </TableRow>
            ) : (
              retirements.map((retirement) => (
                <TableRow key={retirement.id}>
                  <TableCell>{retirement.id ?? "-"}</TableCell>
                  <TableCell>{retirement.assetId}</TableCell>
                  <TableCell>{formatDate(retirement.retirementDate)}</TableCell>
                  <TableCell>{formatCurrency(retirement.retiredValue)}</TableCell>
                  <TableCell>{formatCurrency(retirement.updatedBookValue)}</TableCell>
                  <TableCell className="max-w-xs truncate">{retirement.reason || "-"}</TableCell>
                  <TableCell>{retirement.createdBy ?? "-"}</TableCell>
                  <TableCell>{retirement.createdAt ? formatDate(retirement.createdAt) : "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Popup with form */}
      <Popup isOpen={isPopupOpen} onClose={resetForm} title="Add Asset Partial Retirement" size="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetId">Asset ID*</Label>
              <Input
                id="assetId"
                name="assetId"
                type="number"
                min="0"
                value={formData.assetId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retirementDate">Retirement Date*</Label>
              <Input
                id="retirementDate"
                name="retirementDate"
                type="date"
                value={formData.retirementDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retiredValue">Retired Value*</Label>
              <Input
                id="retiredValue"
                name="retiredValue"
                type="number"
                min="0"
                step="0.01"
                value={formData.retiredValue}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="updatedBookValue">Updated Book Value</Label>
              <Input
                id="updatedBookValue"
                name="updatedBookValue"
                type="number"
                min="0"
                step="0.01"
                value={formData.updatedBookValue ?? ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                name="reason"
                value={formData.reason ?? ""}
                onChange={handleInputChange}
                placeholder="Reason for retirement..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">Save Retirement</Button>
          </div>
        </form>
      </Popup>
    </div>
  )
}

export default AssetRetirement
