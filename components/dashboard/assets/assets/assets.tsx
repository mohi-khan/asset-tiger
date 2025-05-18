'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { GetAssetType } from '@/utils/type'
import { getAllAssets } from '@/utils/api'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import { useAtom } from 'jotai'

const Assets = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)

  // State for assets data
  const [assets, setAssets] = useState<GetAssetType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch assets on component mount
  const fetchAssets = useCallback(async () => {
    try {
      const data = await getAllAssets(token)
      console.log("🚀 ~ fetchAssets ~ data:", data)
      setAssets(data.data || [])
    } catch (error) {
      console.error('Failed to fetch assets:', error)
      toast({
        title: 'Error',
        description: 'Failed to load assets. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, token])

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

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
        <Link href={'/dashboard/assets/add-assets'}>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
            Add
          </Button>
        </Link>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        /* Table for asset data */
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-amber-100">
              <TableRow>
                <TableHead>Asset Code</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Asset Value</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Serial No.</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-6 text-gray-500"
                  >
                    No assets found. Add your first asset to get started.
                  </TableCell>
                </TableRow>
              ) : (
                assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.assetCode}</TableCell>
                    <TableCell>{asset.assetName}</TableCell>
                    <TableCell>{asset.purDate}</TableCell>
                    <TableCell>{asset.assetValue}</TableCell>
                    <TableCell>{asset.currentValue || 'N/A'}</TableCell>
                    <TableCell>{asset.status || 'Active'}</TableCell>
                    <TableCell>{asset.model || 'N/A'}</TableCell>
                    <TableCell>{asset.slNo || 'N/A'}</TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/assets/assets/asset-details/${asset.id}`}
                      >
                        <Eye className="h-5 w-5 cursor-pointer text-amber-600 hover:text-amber-800" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default Assets
