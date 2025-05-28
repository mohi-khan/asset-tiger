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
import { Eye, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import type { CreateDepreciationInfoType, GetAssetType } from '@/utils/type'
import { createDepreciationInfo, getAllAssets } from '@/utils/api'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createDepreciationInfoSchema } from '@/utils/type'
import { useRouter } from 'next/navigation'

const Assets = () => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [userData] = useAtom(userDataAtom)

  const router = useRouter()

  // State for assets data
  const [assets, setAssets] = useState<GetAssetType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // State for dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null)

  // Form setup
  const form = useForm<CreateDepreciationInfoType>({
    resolver: zodResolver(createDepreciationInfoSchema),
    defaultValues: {
      depreciationMethod: 'Straight Line',
      startingValue: 0,
      depreciationRate: 0, // Add default value
      usefulLifeMonths: 0, // Add default value
      residualValue: 0, // Add default value
      effectiveDate: new Date().toISOString().split('T')[0],
      createdBy: userData?.userId,
    },
  })

  // Fetch assets on component mount
  const fetchAssets = useCallback(async () => {
    if(!token) return
    try {
      const data = await getAllAssets(token)
      console.log('🚀 ~ fetchAssets ~ data:', data)
      if (data?.error?.status === 401) {
      router.push('/unauthorized-access')
      return
    }
    else{
      setAssets(data.data || [])
    }
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

  // Open dialog with asset ID
  const handleOpenDepreciationDialog = (assetId: number) => {
    setSelectedAssetId(assetId)
    form.reset({
      assetId: assetId,
      bookId: 1, // Default book ID, adjust as needed
      depreciationMethod: 'Straight Line',
      startingValue: 0,
      depreciationRate: 0, // Add default value
      usefulLifeMonths: 0, // Add default value
      residualValue: 0, // Add default value
      effectiveDate: new Date().toISOString().split('T')[0],
      createdBy: userData?.userId,
    })
    setIsDialogOpen(true)
  }

  // Handle form submission
  const onSubmit = async (data: CreateDepreciationInfoType) => {
    try {
      const response = await createDepreciationInfo(data, token)
      toast({
        title: 'Success',
        description: 'Depreciation information created successfully.',
      })
      setIsDialogOpen(false)
      // Optionally refresh assets
      fetchAssets()
    } catch (error) {
      console.error('Failed to create depreciation info:', error)
      toast({
        title: 'Error',
        description: 'Failed to create depreciation information.',
        variant: 'destructive',
      })
    }
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
                    <TableCell className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/assets/assets/asset-details/${asset.id}`}
                      >
                        <Eye className="h-5 w-5 cursor-pointer text-amber-600 hover:text-amber-800" />
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-5 w-5 text-amber-600 hover:text-amber-800" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              if (asset.id !== undefined) {
                                handleOpenDepreciationDialog(asset.id)
                              }
                            }}
                            className="cursor-pointer"
                          >
                            Create Depreciation Info
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Depreciation Info Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Depreciation Information</DialogTitle>
            <DialogDescription>
              Enter the depreciation details for this asset.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="depreciationMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depreciation Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Straight Line">
                          Straight Line
                        </SelectItem>
                        <SelectItem value="Declining Balance">
                          Declining Balance
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startingValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="depreciationRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depreciation Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usefulLifeMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Useful Life (Months)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="residualValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residual Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="effectiveDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effective Date</FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        value={
                          field.value
                            ? typeof field.value === 'string'
                              ? field.value
                              : field.value instanceof Date
                              ? field.value.toISOString().split('T')[0]
                              : ''
                            : ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Assets
