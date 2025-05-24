'use client'

import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import {
  createAssetDepreciationSchema,
  CreateAssetDepreciationType,
  GetCompanyType,
  GetDepreciationBookType,
} from '@/utils/type'
import {
  createAssetDepreciation,
  getAllCompany,
  getAllDepreciationBook,
} from '@/utils/api'
import { CustomCombobox } from '@/utils/custom-combobox'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser } from '@/utils/user'

export default function AssetDepreciation() {
  // Mock token - replace with your actual token management
  useInitializeUser()
  const [token] = useAtom(tokenAtom)

  // State variables
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companies, setCompanies] = useState<GetCompanyType[]>([])
  const [depreciationBooks, setDepreciationBooks] = useState<
    GetDepreciationBookType[]
  >([])
  const [previewData, setPreviewData] = useState<[] | null>(null)
  const [formData, setFormData] = useState<CreateAssetDepreciationType | null>(
    null
  )

  // Form setup
  const form = useForm<CreateAssetDepreciationType>({
    resolver: zodResolver(createAssetDepreciationSchema),
    defaultValues: {
      company_id: 1,
      depreciation_date: '',
      book_id: 0,
      saveToDatabase: false,
    },
  })

  // Fetch companies
  const fetchCompanies = useCallback(async () => {
    // if (!token) return
    try {
      const response = await getAllCompany(token)
      if (response.data) {
        setCompanies(response.data)
        console.log('🚀 ~ fetchCompanies ~ response.data:', response.data)
      } else {
        setCompanies([])
        if (response.error) {
          toast({
            title: 'Error',
            description: response.error.message,
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch companies',
        variant: 'destructive',
      })
    }
  }, [token])

  // Fetch depreciation books
  const fetchDepreciationBooks = useCallback(async () => {
    if (!token) return
    try {
      const response = await getAllDepreciationBook(token)
      if (response.data) {
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
  }, [token])

  useEffect(() => {
    fetchCompanies()
    fetchDepreciationBooks()
  }, [fetchCompanies, fetchDepreciationBooks])

  // Handle preview request
  const onPreview = async (data: CreateAssetDepreciationType) => {
    setIsLoading(true)
    setPreviewData(null)

    try {
      const response = await createAssetDepreciation(
        {
          ...data,
          saveToDatabase: false,
        },
        token
      )

      if (response.error || !response.data) {
        throw new Error(
          response.error?.message || 'Failed to preview depreciation schedule'
        )
      }

      setPreviewData(response.data)
      setFormData(data)

      toast({
        title: 'Preview Generated',
        description: 'Review the depreciation schedule below before submitting',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle final submission to database
  const onSubmit = async () => {
    if (!formData) return

    setIsSubmitting(true)
    try {
      const response = await createAssetDepreciation(
        {
          ...formData,
          saveToDatabase: true,
        },
        token
      )

      if (response.error) {
        throw new Error(
          response.error.message || 'Failed to create depreciation schedule'
        )
      }

      toast({
        title: 'Success',
        description: 'Asset depreciation schedule created successfully',
      })

      // Reset the form and preview data after successful submission
      form.reset()
      setPreviewData(null)
      setFormData(null)
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to create asset depreciation schedule',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Asset Depreciation</CardTitle>
          <CardDescription>
            Create a new asset depreciation schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit(onPreview)(e)
              }}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="company_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <CustomCombobox
                        items={companies.map((company) => ({
                          id: (
                            company.companyId || company.companyId
                          ).toString(),
                          name:
                            company.companyName ||
                            company.address ||
                            'Unnamed Company',
                        }))}
                        value={
                          field.value
                            ? {
                                id: field.value.toString(),
                                name:
                                  companies.find(
                                    (c) =>
                                      (c.companyId || c.companyId) ===
                                      field.value
                                  )?.companyName ||
                                  companies.find(
                                    (c) =>
                                      (c.companyId || c.companyId) ===
                                      field.value
                                  )?.companyName ||
                                  '',
                              }
                            : null
                        }
                        onChange={(value) =>
                          field.onChange(
                            value ? Number.parseInt(value.id, 10) : 0
                          )
                        }
                        placeholder="Select company"
                      />
                    </FormControl>
                    <FormDescription>
                      Select the company for this depreciation schedule
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="book_id"
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
                    <FormDescription>
                      Select the depreciation book for this schedule
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="depreciation_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depreciation Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="w-full" />
                    </FormControl>
                    <FormDescription>
                      Select the date for the depreciation schedule
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                className="w-full"
                disabled={isLoading}
                onClick={form.handleSubmit(onPreview)}
              >
                {isLoading
                  ? 'Generating Preview...'
                  : 'Run Depreciation Schedule'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Preview Data Table */}
      {previewData && previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Depreciation Schedule Preview</CardTitle>
            <CardDescription>
              Review the calculated depreciation schedule before submitting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset ID</TableHead>
                    <TableHead>Depreciation Method</TableHead>
                    <TableHead>Depreciation Date</TableHead>
                    <TableHead className="text-right">
                      Depreciation Amount
                    </TableHead>
                    <TableHead className="text-right">
                      Accumulated Depreciation
                    </TableHead>
                    <TableHead className="text-right">
                      Remaining Value
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.asset_id}</TableCell>
                      <TableCell>{item.depreciation_method || 'N/A'}</TableCell>
                      <TableCell>
                        {formatDate(item.depreciation_date)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          Number.parseFloat(item.depreciation_amount)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          Number.parseFloat(item.accumulated_depreciation)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          Number.parseFloat(item.remaining_value)
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? 'Saving...' : 'Save Depreciation'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No data message */}
      {previewData && previewData.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                No depreciation schedules to generate for the selected criteria.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
