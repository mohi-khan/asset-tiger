"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, FileText, Pencil, Plus, Printer } from "lucide-react"

// Dummy data for the asset
const assetData = {
  name: "Chair",
  tagId: "CH1038",
  purchaseDate: "03/28/2025",
  cost: "₹120,000.00",
  brand: "Toshiba",
  model: "MEO39844",
  site: "Headquarters",
  location: "Floor 3, Room 302",
  category: "Equipment",
  department: "Administration",
  assignedTo: "John Smith",
  status: "Available",
  serialNo: "384848485858",
  purchasedFrom: "Business Test Limited",
  assetName: "Executive Chair",
  depreciableCost: "₹110,000.00",
  salvageValue: "₹10,000.00",
  dateAcquired: "03/28/2025",
  assetLife: "120",
  deprMethod: "Declining Balance",
  dateCreated: "03/28/2025 06:08 AM",
  createdBy: "Mohiuddin Khan",
}

// Dummy data for events
const eventsData = [
  {
    id: 1,
    date: "04/02/2025",
    event: "Maintenance Check",
    description: "Regular maintenance check performed",
    performedBy: "Tech Support",
  },
  {
    id: 2,
    date: "03/30/2025",
    event: "Assigned",
    description: "Asset assigned to John Smith",
    performedBy: "HR Department",
  },
  {
    id: 3,
    date: "03/28/2025",
    event: "Purchased",
    description: "Asset purchased and added to inventory",
    performedBy: "Procurement",
  },
]

// Dummy data for photos
const photosData = [
  { id: 1, url: "/placeholder.svg?height=200&width=200", caption: "Front view" },
  { id: 2, url: "/placeholder.svg?height=200&width=200", caption: "Side view" },
  { id: 3, url: "/placeholder.svg?height=200&width=200", caption: "Back view" },
]

// Dummy data for documents
const docsData = [
  {
    id: 1,
    fileName: "Invoice.pdf",
    description: "Purchase invoice",
    fileType: "PDF",
    uploadDate: "03/28/2025",
    uploadedBy: "Finance Dept",
  },
  {
    id: 2,
    fileName: "Warranty.pdf",
    description: "Warranty certificate",
    fileType: "PDF",
    uploadDate: "03/28/2025",
    uploadedBy: "Admin",
  },
  {
    id: 3,
    fileName: "Manual.pdf",
    description: "User manual",
    fileType: "PDF",
    uploadDate: "03/29/2025",
    uploadedBy: "Tech Support",
  },
]

// Dummy data for depreciation
const depreciationData = [
  {
    id: 1,
    period: "2025-2026",
    depreciationAmount: "₹24,000.00",
    accumulatedDepreciation: "₹24,000.00",
    bookValue: "₹96,000.00",
  },
  {
    id: 2,
    period: "2026-2027",
    depreciationAmount: "₹19,200.00",
    accumulatedDepreciation: "₹43,200.00",
    bookValue: "₹76,800.00",
  },
  {
    id: 3,
    period: "2027-2028",
    depreciationAmount: "₹15,360.00",
    accumulatedDepreciation: "₹58,560.00",
    bookValue: "₹61,440.00",
  },
]

// Dummy data for warranty
const warrantyData = [
  {
    id: 1,
    type: "Standard Warranty",
    startDate: "03/28/2025",
    endDate: "03/28/2027",
    provider: "Toshiba",
    description: "2 year standard warranty",
  },
]

// Dummy data for maintenance
const maintenanceData = [
  {
    id: 1,
    date: "06/28/2025",
    type: "Preventive",
    cost: "₹2,000.00",
    description: "Regular maintenance check",
    performedBy: "Tech Support",
  },
  {
    id: 2,
    date: "09/28/2025",
    type: "Preventive",
    cost: "₹2,000.00",
    description: "Regular maintenance check",
    performedBy: "Tech Support",
  },
]

export default function AssetDetails() {
  const [photos, setPhotos] = useState(photosData)
  const [docs, setDocs] = useState(docsData)
  const [depreciation, setDepreciation] = useState(depreciationData)
  const [warranty, setWarranty] = useState(warrantyData)
  const [maintenance, setMaintenance] = useState(maintenanceData)

  // Add new photo
  const handleAddPhoto = (photoData: { url: string; caption: string }) => {
    setPhotos([...photos, { id: photos.length + 1, ...photoData }])
  }

  // Add new document
  const handleAddDoc = (docData: { fileName: string; description: string; fileType: string }) => {
    setDocs([
      ...docs,
      {
        id: docs.length + 1,
        ...docData,
        uploadDate: new Date().toLocaleDateString(),
        uploadedBy: "Current User",
      },
    ])
  }

  // Add new depreciation
  const handleAddDepreciation = (depData: {
    period: string
    depreciationAmount: string
    accumulatedDepreciation: string
    bookValue: string
  }) => {
    setDepreciation([...depreciation, { id: depreciation.length + 1, ...depData }])
  }

  // Add new warranty
  const handleAddWarranty = (warrantyData: {
    type: string
    startDate: string
    endDate: string
    provider: string
    description: string
  }) => {
    setWarranty([...warranty, { id: warranty.length + 1, ...warrantyData }])
  }

  // Add new maintenance
  const handleAddMaintenance = (maintenanceData: {
    date: string
    type: string
    cost: string
    description: string
    performedBy: string
  }) => {
    setMaintenance([...maintenance, { id: maintenance.length + 1, ...maintenanceData }])
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="text-primary mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-medium">Asset View</h1>
      </div>

      {/* Asset Title and Actions */}
      <div className="flex justify-between items-center mb-4 border-b pb-4">
        <h2 className="text-xl font-medium">{assetData.name}</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Pencil className="h-4 w-4" />
            Edit Asset
          </Button>
          <Button className="flex items-center gap-1">
            More Actions
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Asset Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-1 border rounded-md p-4 flex items-center justify-center">
          <Image
            src="/placeholder.svg?height=250&width=250"
            alt="Asset Image"
            width={250}
            height={250}
            className="object-contain"
          />
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="border-b pb-2">
            <div className="text-sm text-muted-foreground">Asset Tag ID</div>
            <div>{assetData.tagId}</div>
          </div>
          <div className="border-b pb-2">
            <div className="text-sm text-muted-foreground">Site</div>
            <div>{assetData.site}</div>
          </div>
          <div className="border-b pb-2">
            <div className="text-sm text-muted-foreground">Purchase Date</div>
            <div>{assetData.purchaseDate}</div>
          </div>
          <div className="border-b pb-2">
            <div className="text-sm text-muted-foreground">Location</div>
            <div>{assetData.location}</div>
          </div>
          <div className="border-b pb-2">
            <div className="text-sm text-muted-foreground">Cost</div>
            <div>{assetData.cost}</div>
          </div>
          <div className="border-b pb-2">
            <div className="text-sm text-muted-foreground">Category</div>
            <div>{assetData.category}</div>
          </div>
          <div className="border-b pb-2">
            <div className="text-sm text-muted-foreground">Brand</div>
            <div>{assetData.brand}</div>
          </div>
          <div className="border-b pb-2">
            <div className="text-sm text-muted-foreground">Department</div>
            <div>{assetData.department}</div>
          </div>
          <div className="border-b pb-2">
            <div className="text-sm text-muted-foreground">Model</div>
            <div>{assetData.model}</div>
          </div>
          <div className="border-b pb-2">
            <div className="text-sm text-muted-foreground">Assigned to</div>
            <div>{assetData.assignedTo}</div>
          </div>
          <div className="col-span-1"></div>
          <div className="border-b pb-2">
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="text-green-600">{assetData.status}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="details"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            Events
          </TabsTrigger>
          <TabsTrigger
            value="photos"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            Photos
          </TabsTrigger>
          <TabsTrigger
            value="docs"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            Docs
          </TabsTrigger>
          <TabsTrigger
            value="depreciation"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            Depreciation
          </TabsTrigger>
          <TabsTrigger
            value="warranty"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            Warranty
          </TabsTrigger>
          <TabsTrigger
            value="maintenance"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            Maint.
          </TabsTrigger>
        </TabsList>

        {/* Details Tab Content */}
        <TabsContent value="details" className="mt-6">
          <h3 className="text-lg font-medium mb-4">Asset Details</h3>

          <div className="mb-6">
            <h4 className="text-primary font-medium mb-2">Miscellaneous</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-b pb-2">
                <div className="text-sm text-muted-foreground">Serial No</div>
                <div>{assetData.serialNo}</div>
              </div>
              <div className="border-b pb-2">
                <div className="text-sm text-muted-foreground">Purchased from</div>
                <div>{assetData.purchasedFrom}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-primary font-medium mb-2">Custom fields</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-b pb-2">
                <div className="text-sm text-muted-foreground">Asset Name</div>
                <div>{assetData.assetName}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-primary font-medium mb-2">Depreciation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-b pb-2">
                <div className="text-sm text-muted-foreground">Depreciable Cost</div>
                <div>{assetData.depreciableCost}</div>
              </div>
              <div className="border-b pb-2">
                <div className="text-sm text-muted-foreground">Asset Life (months)</div>
                <div>{assetData.assetLife}</div>
              </div>
              <div className="border-b pb-2">
                <div className="text-sm text-muted-foreground">Salvage Value</div>
                <div>{assetData.salvageValue}</div>
              </div>
              <div className="border-b pb-2">
                <div className="text-sm text-muted-foreground">Depr. Method</div>
                <div>{assetData.deprMethod}</div>
              </div>
              <div className="border-b pb-2">
                <div className="text-sm text-muted-foreground">Date Acquired</div>
                <div>{assetData.dateAcquired}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-primary font-medium mb-2">Creation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-b pb-2">
                <div className="text-sm text-muted-foreground">Date Created</div>
                <div>{assetData.dateCreated}</div>
              </div>
              <div className="border-b pb-2">
                <div className="text-sm text-muted-foreground">Created by</div>
                <div>{assetData.createdBy}</div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Events Tab Content */}
        <TabsContent value="events" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Events</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Performed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventsData.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.event}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>{event.performedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Photos Tab Content */}
        <TabsContent value="photos" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Photos</h3>
            <AddPhotoDialog onAddPhoto={handleAddPhoto} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="border rounded-md overflow-hidden">
                <Image
                  src={photo.url || "/placeholder.svg"}
                  alt={photo.caption}
                  width={200}
                  height={200}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2 text-sm">{photo.caption}</div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Docs Tab Content */}
        <TabsContent value="docs" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Documents</h3>
            <AddDocDialog onAddDoc={handleAddDoc} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>File Type</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {doc.fileName}
                  </TableCell>
                  <TableCell>{doc.description}</TableCell>
                  <TableCell>{doc.fileType}</TableCell>
                  <TableCell>{doc.uploadDate}</TableCell>
                  <TableCell>{doc.uploadedBy}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Depreciation Tab Content */}
        <TabsContent value="depreciation" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Depreciation</h3>
            <AddDepreciationDialog onAddDepreciation={handleAddDepreciation} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Depreciation Amount</TableHead>
                <TableHead>Accumulated Depreciation</TableHead>
                <TableHead>Book Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depreciation.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.period}</TableCell>
                  <TableCell>{item.depreciationAmount}</TableCell>
                  <TableCell>{item.accumulatedDepreciation}</TableCell>
                  <TableCell>{item.bookValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Warranty Tab Content */}
        <TabsContent value="warranty" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Warranty</h3>
            <AddWarrantyDialog onAddWarranty={handleAddWarranty} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warranty.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.startDate}</TableCell>
                  <TableCell>{item.endDate}</TableCell>
                  <TableCell>{item.provider}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Maintenance Tab Content */}
        <TabsContent value="maintenance" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Maintenance</h3>
            <AddMaintenanceDialog onAddMaintenance={handleAddMaintenance} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Performed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenance.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.cost}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.performedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Add Photo Dialog Component
function AddPhotoDialog({ onAddPhoto }: { onAddPhoto: (data: any) => void }) {
  const [open, setOpen] = useState(false)
  const [caption, setCaption] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddPhoto({
      url: "/placeholder.svg?height=200&width=200",
      caption: caption,
    })
    setCaption("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Photo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Photo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <div className="flex flex-col items-center">
                <div className="mb-2">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="Upload preview"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
                <Button type="button" variant="outline" size="sm">
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Supported formats: JPG, PNG, GIF</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a caption for this photo"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Photo</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Add Document Dialog Component
function AddDocDialog({ onAddDoc }: { onAddDoc: (data: any) => void }) {
  const [open, setOpen] = useState(false)
  const [fileName, setFileName] = useState("")
  const [description, setDescription] = useState("")
  const [fileType, setFileType] = useState("PDF")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddDoc({
      fileName,
      description,
      fileType,
    })
    setFileName("")
    setDescription("")
    setFileType("PDF")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Document File</Label>
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <Button type="button" variant="outline">
                Choose File
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Supported formats: PDF, DOC, DOCX, XLS, XLSX</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter document description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fileType">File Type</Label>
            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger>
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="DOC">DOC</SelectItem>
                <SelectItem value="DOCX">DOCX</SelectItem>
                <SelectItem value="XLS">XLS</SelectItem>
                <SelectItem value="XLSX">XLSX</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Document</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Add Depreciation Dialog Component
function AddDepreciationDialog({ onAddDepreciation }: { onAddDepreciation: (data: any) => void }) {
  const [open, setOpen] = useState(false)
  const [period, setPeriod] = useState("")
  const [depreciationAmount, setDepreciationAmount] = useState("")
  const [accumulatedDepreciation, setAccumulatedDepreciation] = useState("")
  const [bookValue, setBookValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddDepreciation({
      period,
      depreciationAmount,
      accumulatedDepreciation,
      bookValue,
    })
    setPeriod("")
    setDepreciationAmount("")
    setAccumulatedDepreciation("")
    setBookValue("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Depreciation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Depreciation Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Input
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="e.g. 2025-2026"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="depreciationAmount">Depreciation Amount</Label>
            <Input
              id="depreciationAmount"
              value={depreciationAmount}
              onChange={(e) => setDepreciationAmount(e.target.value)}
              placeholder="e.g. ₹10,000.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accumulatedDepreciation">Accumulated Depreciation</Label>
            <Input
              id="accumulatedDepreciation"
              value={accumulatedDepreciation}
              onChange={(e) => setAccumulatedDepreciation(e.target.value)}
              placeholder="e.g. ₹25,000.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bookValue">Book Value</Label>
            <Input
              id="bookValue"
              value={bookValue}
              onChange={(e) => setBookValue(e.target.value)}
              placeholder="e.g. ₹75,000.00"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Entry</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Add Warranty Dialog Component
function AddWarrantyDialog({ onAddWarranty }: { onAddWarranty: (data: any) => void }) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [provider, setProvider] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddWarranty({
      type,
      startDate,
      endDate,
      provider,
      description,
    })
    setType("")
    setStartDate("")
    setEndDate("")
    setProvider("")
    setDescription("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Warranty
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Warranty Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Warranty Type</Label>
            <Input
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g. Standard, Extended"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="MM/DD/YYYY"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="MM/DD/YYYY"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider">Provider</Label>
            <Input
              id="provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g. Manufacturer name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter warranty details"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Warranty</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Add Maintenance Dialog Component
function AddMaintenanceDialog({ onAddMaintenance }: { onAddMaintenance: (data: any) => void }) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState("")
  const [type, setType] = useState("")
  const [cost, setCost] = useState("")
  const [description, setDescription] = useState("")
  const [performedBy, setPerformedBy] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddMaintenance({
      date,
      type,
      cost,
      description,
      performedBy,
    })
    setDate("")
    setType("")
    setCost("")
    setDescription("")
    setPerformedBy("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Maintenance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Maintenance Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="MM/DD/YYYY" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select maintenance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Preventive">Preventive</SelectItem>
                <SelectItem value="Corrective">Corrective</SelectItem>
                <SelectItem value="Condition-based">Condition-based</SelectItem>
                <SelectItem value="Predictive">Predictive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="e.g. ₹2,000.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter maintenance details"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="performedBy">Performed By</Label>
            <Input
              id="performedBy"
              value={performedBy}
              onChange={(e) => setPerformedBy(e.target.value)}
              placeholder="e.g. Tech Support"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Record</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

