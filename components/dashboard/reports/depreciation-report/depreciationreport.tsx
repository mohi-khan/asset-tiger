import React, { useEffect, useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { getDepreciationReport } from '@/utils/api'
import { GetDepTranType } from '@/utils/type'
import { tokenAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'

export default function DepreciationReport() {
  const [token] = useAtom(tokenAtom)

  const router = useRouter()
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [depreciationData, setDepreciationData] = useState<GetDepTranType[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    if (!token) return
    try {
      setLoading(true)
      const response = await getDepreciationReport(token, transactionDate)
      if (response?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else {
        setDepreciationData(response.data || [])
        console.log('🚀 ~ fetchData ~ response.data:', response.data)
      }
    } catch (error) {
      console.error('Error fetching depreciation report:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [transactionDate])

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
            Transaction Date
          </label>
          <Input
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
          />
        </div>
      </div>

      <Card className="shadow-md">
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
