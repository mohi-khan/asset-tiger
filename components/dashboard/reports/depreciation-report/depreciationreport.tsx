import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { getAllDepreciationBook, getAllDepreciationTransactions, getDepreciationReport } from '@/utils/api'
import { GetDepreciationBookType, GetDepTranType } from '@/utils/type'
import { tokenAtom, useInitializeUser} from '@/utils/user'
import { useAtom } from 'jotai'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'

export default function DepreciationReport() {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  console.log("🚀 ~ DepreciationReport ~ token:", token)

  const router = useRouter()
  const [selectedBookId, setSelectedBookId] = useState<number>(0)
  const [selectedDepPeriod, setSelectedDepPeriod] = useState<number>(0)
  const [periodId, setPeriodId] = useState<number>(0)
  const [depreciationData, setDepreciationData] = useState<any[]>([])
  const [bookData, setBookData] = useState<GetDepreciationBookType[]>([])
  const [depTranData, setDepTranData] = useState<GetDepTranType[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const response = await getDepreciationReport(token, periodId, selectedBookId)
      if (response?.error?.status === 401) {
        // router.push('/unauthorized-access')
        return
      } else {
        setDepreciationData(response.data || [])
        console.log('🚀 ~ fetchData ~ response.data:', response.data)
      }
    } catch (error) {
      console.error('Error fetching selectDep report:', error)
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
        // router.push('/unauthorized-access')
        return
      } else {
        setBookData(response.data || [])
        console.log('🚀 ~ fetchData ~ response.data:', response.data)
      }
    } catch (error) {
      console.error('Error fetching depreciation report:', error)
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
        // router.push('/unauthorized-access')
        return
      } else {
        setDepTranData(response.data || [])
        console.log("🚀 ~ fetchDepTran ~ response.data:", response.data)
      }
    } catch (error) {
      console.error('Error fetching depreciation report:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchData()
    fetchBookData()
    fetchDepTran()
  }, [periodId, selectedBookId, fetchData, fetchBookData, fetchDepTran])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Depreciation Report</h1>
        <Button onClick={handlePrint} className="print:hidden">
          Print
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 print:hidden">
        <div>
          <label className="block text-sm font-medium mb-1">
            Period
          </label>
          <Select value={periodId ? periodId.toString() : undefined} onValueChange={(value) => setPeriodId(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {depTranData.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Book
          </label>
          <Select value={selectedBookId ? selectedBookId.toString() : undefined} onValueChange={(value) => setSelectedBookId(Number(value))}>
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
        <div className="flex items-end">
          <Button onClick={fetchData} className="px-4 py-2">
            Show
          </Button>
        </div>

      </div>      <Card className="shadow-md">
        <CardContent className="overflow-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Book Name</TableHead>
                  <TableHead>Transaction Date</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Depreciation (BDT)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depreciationData.length > 0 ? (
                  depreciationData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.asset_id}</TableCell>
                      <TableCell>{item.asset_name}</TableCell>
                      <TableCell>{item.book_name}</TableCell>
                      <TableCell>{item.transaction_date}</TableCell>
                      <TableCell>{item.period}</TableCell>
                      <TableCell>{item.depreciation_amount}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-500"
                    >
                      No data found for this date
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
