"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAtom } from "jotai"
import { tokenAtom, useInitializeUser } from "@/utils/user"
import {
  getAllCompanies,
  getAllDepreciationBook,
  getAllDepreciationTransactions,
  getGlDepreciationReport,
} from "@/utils/api"
import type { GetCompanyType, GLDepreciationReportType, GetDepreciationBookType, GetDepTranType } from "@/utils/type"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function GLDepreciationReport() {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)

  const [depreciationData, setDepreciationData] = useState<GLDepreciationReportType[]>([])
  const [companyData, setCompanyData] = useState<GetCompanyType[]>([])
  const [selectedBookId, setSelectedBookId] = useState<number>(0)
  const [periodId, setPeriodId] = useState<string>("")
  const [bookData, setBookData] = useState<GetDepreciationBookType[]>([])
  const [depTranData, setDepTranData] = useState<GetDepTranType[]>([])
  const [companyId, setCompanyId] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  const fetchDepreciationData = useCallback(async () => {
    if (!companyId || !selectedBookId || !periodId) {
      console.log("Missing required parameters")
      return
    }

    try {
      setLoading(true)
      const response = await getGlDepreciationReport(token, companyId, selectedBookId, periodId)
      setDepreciationData(response.data || [])
      console.log("🚀 ~ fetchDepreciationData ~ response.data:", response.data)
    } catch (error) {
      console.error("Error fetching GL depreciation data:", error)
    } finally {
      setLoading(false)
    }
  }, [token, companyId, selectedBookId, periodId])

  const fetchCompanyData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAllCompanies(token)
      setCompanyData(response.data || [])
      console.log("🚀 ~ fetchCompanyData ~ response.data:", response.data)
    } catch (error) {
      console.error("Error fetching company data:", error)
    } finally {
      setLoading(false)
    }
  }, [token])

  const fetchBookData = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const response = await getAllDepreciationBook(token)
      if (response?.error?.status === 401) {
        return
      } else {
        setBookData(response.data || [])
        console.log("🚀 ~ fetchBookData ~ response.data:", response.data)
      }
    } catch (error) {
      console.error("Error fetching book data:", error)
    } finally {
      setLoading(false)
    }
  }, [token])

  const fetchDepTran = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const response = await getAllDepreciationTransactions(token)
      if (response?.error?.status === 401) {
        return
      } else {
        const uniquePeriods =
          response.data?.filter((item, index, self) => index === self.findIndex((t) => t.period === item.period)) || []
        setDepTranData(uniquePeriods)
        console.log("🚀 ~ fetchDepTran ~ uniquePeriods:", uniquePeriods)
      }
    } catch (error) {
      console.error("Error fetching depreciation transactions:", error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchCompanyData()
    fetchBookData()
    fetchDepTran()
  }, [fetchCompanyData, fetchBookData, fetchDepTran])

  const handlePrint = () => {
    window.print()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">GL Depreciation Report</h1>
        <Button onClick={handlePrint} className="print:hidden">
          Print
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 print:hidden items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Period</label>
          <Select value={periodId} onValueChange={(value) => setPeriodId(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {depTranData.map((item) => (
                <SelectItem key={item.id} value={item.period}>
                  {item.period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">Company</Label>
          <Select
            onValueChange={(value) => setCompanyId(Number(value))}
            value={companyId ? companyId.toString() : undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companyData.map((company) => (
                <SelectItem key={company.companyId} value={company.companyId.toString()}>
                  {company.companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Book</label>
          <Select value={selectedBookId.toString()} onValueChange={(value) => setSelectedBookId(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select book" />
            </SelectTrigger>
            <SelectContent>
              {bookData.map((book) => (
                <SelectItem key={book.id} value={book.id.toString()}>
                  {book.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={fetchDepreciationData} className="px-4 py-2">
          Show
        </Button>
      </div>

      <Card className="shadow-md">
        <CardContent className="overflow-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Asset GL</TableHead>
                  <TableHead>Cost Center Code</TableHead>
                  <TableHead>Total Depreciation (BDT)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depreciationData.length > 0 ? (
                  depreciationData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.period}</TableCell>
                      <TableCell>{item.asset_gl}</TableCell>
                      <TableCell>{item.costCenterCode}</TableCell>
                      <TableCell>{formatCurrency(item.totalDepreciation)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No data found for the selected criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {depreciationData.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Depreciation:</span>
            <span className="font-bold text-lg">
              {formatCurrency(depreciationData.reduce((sum, item) => sum + item.totalDepreciation, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
