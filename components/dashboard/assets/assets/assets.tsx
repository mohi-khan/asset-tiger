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
import type {
  CreateDepreciationInfoType,
  GetAssetType,
  CreateAssetCapexAdditionType,
  CreateAssetPartialRetirementType,
  GetDepreciationBookType,
} from '@/utils/type'
import {
  createDepreciationInfo,
  getAllAssets,
  createAddition,
  createRetirement,
  getAllDepreciationBook,
} from '@/utils/api'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  createDepreciationInfoSchema,
  createAssetCapexAdditionSchema,
  createAssetPartialRetirementSchema,
} from '@/utils/type'
import { useRouter } from 'next/navigation'
import { CustomCombobox } from '@/utils/custom-combobox'
import { format } from 'date-fns'

const Assets = () => {
  useInitializeUser()
  const [userData] = useAtom(userDataAtom)
  const [token] = useAtom(tokenAtom)

  const router = useRouter()

  useEffect(() => {
    const checkUserData = () => {
      const storedUserData = localStorage.getItem('currentUser')
      const storedToken = localStorage.getItem('authToken')

      if (!storedUserData || !storedToken) {
        console.log('No user data or token found in localStorage')
        router.push('/signin')
        return
      }
    }

    checkUserData()
  }, [userData, token, router])

  // State for assets data
  const [assets, setAssets] = useState<GetAssetType[]>([])
  const [depreciationBooks, setDepreciationBooks] = useState<
    GetDepreciationBookType[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // State for dialogs
  const [isDepreciationDialogOpen, setIsDepreciationDialogOpen] =
    useState(false)
  const [isAdditionDialogOpen, setIsAdditionDialogOpen] = useState(false)
  const [isRetirementDialogOpen, setIsRetirementDialogOpen] = useState(false)
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null)

  // Filter assets based on search term
  const filteredAssets = assets.filter((asset) =>
    Object.values(asset).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAssets = filteredAssets.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  // Rest of your existing form setups...
  const depreciationForm = useForm<CreateDepreciationInfoType>({
    resolver: zodResolver(createDepreciationInfoSchema),
    defaultValues: {
      depreciationMethod: 'Straight Line',
      startingValue: 0,
      depreciationRate: 0,
      bookId: 0,
      usefulLifeMonths: 0,
      accDepValue: 0,
      residualValue: 0,
      effectiveDate: new Date().toISOString().split('T')[0],
      createdBy: userData?.userId,
    },
  })

  const additionForm = useForm<CreateAssetCapexAdditionType>({
    resolver: zodResolver(createAssetCapexAdditionSchema),
    defaultValues: {
      assetId: 0,
      additionDate: new Date().toISOString().split('T')[0],
      addedValue: 0,
      description: '',
      newBookValue: 0,
      createdBy: userData?.userId,
    },
  })

  const retirementForm = useForm<CreateAssetPartialRetirementType>({
    resolver: zodResolver(createAssetPartialRetirementSchema),
    defaultValues: {
      assetId: 0,
      retirementDate: new Date().toISOString().split('T')[0],
      retiredValue: 0,
      reason: '',
      updatedBookValue: 0,
      createdBy: userData?.userId,
    },
  })

  // Your existing fetchAssets and other functions...
  const fetchAssets = useCallback(async () => {
    if (!token) return
    try {
      console.log(token)
      const data = await getAllAssets(token)
      console.log('🚀 ~ fetchAssets ~ data:', data)
      if (data?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else {
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
  }, [toast, token, router])

  const fetchDepreciationBooks = useCallback(async () => {
    if (!token) return
    try {
      const response = await getAllDepreciationBook(token)
      if (response?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else if (response.data) {
        setDepreciationBooks(response.data)
      } else {
        setDepreciationBooks([])
        if (response.error) {
          toast({
            title: 'Error',
            description: response.error.message,
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch depreciation books:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch depreciation books',
        variant: 'destructive',
      })
    }
  }, [token, router, toast])

  useEffect(() => {
    fetchAssets()
    fetchDepreciationBooks()
  }, [fetchAssets, fetchDepreciationBooks])

  // Dialog handlers
  const handleOpenDepreciationDialog = (assetId: number) => {
    setSelectedAssetId(assetId)
    depreciationForm.reset({
      assetId: assetId,
      bookId: 1,
      depreciationMethod: 'Straight Line',
      startingValue: 0,
      depreciationRate: 0,
      usefulLifeMonths: 0,
      residualValue: 0,
      effectiveDate: new Date().toISOString().split('T')[0],
      createdBy: userData?.userId,
    })
    setIsDepreciationDialogOpen(true)
  }

  const handleOpenAdditionDialog = (assetId: number) => {
    setSelectedAssetId(assetId)
    additionForm.reset({
      assetId: assetId,
      additionDate: new Date().toISOString().split('T')[0],
      addedValue: 0,
      description: '',
      newBookValue: 0,
      createdBy: userData?.userId,
    })
    setIsAdditionDialogOpen(true)
  }

  const handleOpenRetirementDialog = (assetId: number) => {
    setSelectedAssetId(assetId)
    retirementForm.reset({
      assetId: assetId,
      retirementDate: new Date().toISOString().split('T')[0],
      retiredValue: 0,
      reason: '',
      updatedBookValue: 0,
      createdBy: userData?.userId,
    })
    setIsRetirementDialogOpen(true)
  }

  // Form submission handlers
  const onDepreciationSubmit = async (data: CreateDepreciationInfoType) => {
    try {
      const response = await createDepreciationInfo(data, token)
      toast({
        title: 'Success',
        description: 'Depreciation information created successfully.',
      })
      setIsDepreciationDialogOpen(false)
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

  const onAdditionSubmit = async (data: CreateAssetCapexAdditionType) => {
    try {
      const response = await createAddition(data, token)
      toast({
        title: 'Success',
        description: 'Asset addition created successfully.',
      })
      setIsAdditionDialogOpen(false)
      fetchAssets()
    } catch (error) {
      console.error('Failed to create addition:', error)
      toast({
        title: 'Error',
        description: 'Failed to create asset addition.',
        variant: 'destructive',
      })
    }
  }

  const onRetirementSubmit = async (data: CreateAssetPartialRetirementType) => {
    try {
      const response = await createRetirement(data, token)
      toast({
        title: 'Success',
        description: 'Asset retirement created successfully.',
      })
      setIsRetirementDialogOpen(false)
      fetchAssets()
    } catch (error) {
      console.error('Failed to create retirement:', error)
      toast({
        title: 'Error',
        description: 'Failed to create asset retirement.',
        variant: 'destructive',
      })
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return format(new Date(dateString), 'MMM dd, yyyy')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with title, search, and add button */}
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
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-64"
          />
          <Link href={'/dashboard/assets/add-assets'}>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
              Add
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <>
          {/* Table for asset data */}
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
                {paginatedAssets.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-6 text-gray-500"
                    >
                      No assets found. Add your first asset to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAssets.map((asset) => (
                    // Your existing asset row code...
                    <TableRow key={asset.id}>
                      <TableCell>{asset.assetCode}</TableCell>
                      <TableCell>{asset.assetName}</TableCell>
                      <TableCell>{formatDate(asset.purDate)}</TableCell>
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
                            <DropdownMenuItem
                              onClick={() => {
                                if (asset.id !== undefined) {
                                  handleOpenAdditionDialog(asset.id)
                                }
                              }}
                              className="cursor-pointer"
                            >
                              Create Addition
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                if (asset.id !== undefined) {
                                  handleOpenRetirementDialog(asset.id)
                                }
                              }}
                              className="cursor-pointer"
                            >
                              Create Retirement
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

          {/* Pagination controls */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Depreciation Info Dialog */}
      <Dialog
        open={isDepreciationDialogOpen}
        onOpenChange={setIsDepreciationDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Depreciation Information</DialogTitle>
            <DialogDescription>
              Enter the depreciation details for this asset.
            </DialogDescription>
          </DialogHeader>

          <Form {...depreciationForm}>
            <form
              onSubmit={depreciationForm.handleSubmit(onDepreciationSubmit)}
              className="space-y-4"
            >
              <FormField
                control={depreciationForm.control}
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
                control={depreciationForm.control}
                name="bookId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depreciation Book</FormLabel>
                    <FormControl>
                      <CustomCombobox
                        items={depreciationBooks.map((book) => ({
                          id: book.id.toString(),
                          name: book.name,
                        }))}
                        value={
                          field.value
                            ? {
                                id: field.value.toString(),
                                name:
                                  depreciationBooks.find(
                                    (b) => b.id === field.value
                                  )?.name || '',
                              }
                            : null
                        }
                        onChange={(value) =>
                          field.onChange(
                            value ? Number.parseInt(value.id, 10) : 0
                          )
                        }
                        placeholder="Select depreciation book"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={depreciationForm.control}
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
                control={depreciationForm.control}
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
                control={depreciationForm.control}
                name="accDepValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Depreciation Value</FormLabel>
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
                control={depreciationForm.control}
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
                control={depreciationForm.control}
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
                control={depreciationForm.control}
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
                  onClick={() => setIsDepreciationDialogOpen(false)}
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

      {/* Addition Dialog */}
      <Dialog
        open={isAdditionDialogOpen}
        onOpenChange={setIsAdditionDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Asset Addition</DialogTitle>
            <DialogDescription>
              Enter the addition details for this asset.
            </DialogDescription>
          </DialogHeader>

          <Form {...additionForm}>
            <form
              onSubmit={additionForm.handleSubmit(onAdditionSubmit)}
              className="space-y-4"
            >
              <FormField
                control={additionForm.control}
                name="additionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Addition Date</FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={additionForm.control}
                name="addedValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Added Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
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
                control={additionForm.control}
                name="newBookValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Book Value (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
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
                control={additionForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description of the addition..."
                        {...field}
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
                  onClick={() => setIsAdditionDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Create Addition
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Retirement Dialog */}
      <Dialog
        open={isRetirementDialogOpen}
        onOpenChange={setIsRetirementDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Asset Retirement</DialogTitle>
            <DialogDescription>
              Enter the retirement details for this asset.
            </DialogDescription>
          </DialogHeader>

          <Form {...retirementForm}>
            <form
              onSubmit={retirementForm.handleSubmit(onRetirementSubmit)}
              className="space-y-4"
            >
              <FormField
                control={retirementForm.control}
                name="retirementDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retirement Date</FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={retirementForm.control}
                name="retiredValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retired Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
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
                control={retirementForm.control}
                name="updatedBookValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Updated Book Value (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
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
                control={retirementForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter reason for retirement..."
                        {...field}
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
                  onClick={() => setIsRetirementDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Create Retirement
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
