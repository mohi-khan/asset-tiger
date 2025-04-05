import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mockDisposalData = [
  {
    date: "2024-03-01",
    assetId: "A001",
    name: "Laptop Dell XPS 15",
    disposalType: "Sold",
    disposalValue: 75000,
    bookValue: 90000,
    remarks: "Sold to employee"
  },
  {
    date: "2024-02-10",
    assetId: "A003",
    name: "Air Conditioner",
    disposalType: "Scrapped",
    disposalValue: 0,
    bookValue: 12000,
    remarks: "Completely non-functional"
  },
];

export default function AssetDisposalReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assetIdFilter, setAssetIdFilter] = useState("");

  const handlePrint = () => {
    window.print();
  };

  const filteredDisposals = mockDisposalData.filter((item) => {
    const matchDate = !startDate || !endDate || (item.date >= startDate && item.date <= endDate);
    const matchAsset = !assetIdFilter || item.assetId.toLowerCase().includes(assetIdFilter.toLowerCase());
    return matchDate && matchAsset;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Asset Disposal Report (Demo)</h1>
        <Button onClick={handlePrint} className="print:hidden">Print</Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 print:hidden">
        <div>
          <Label className="mb-1 block">Period Start</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <Label className="mb-1 block">Period End</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div>
          <Label className="mb-1 block">Asset ID</Label>
          <Input type="text" placeholder="e.g. A001" value={assetIdFilter} onChange={(e) => setAssetIdFilter(e.target.value)} />
        </div>
      </div>

      <Card className="shadow-md">
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Asset ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Disposal Type</TableHead>
                <TableHead>Disposal Value (BDT)</TableHead>
                <TableHead>Book Value (BDT)</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisposals.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.assetId}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.disposalType}</TableCell>
                  <TableCell>{item.disposalValue}</TableCell>
                  <TableCell>{item.bookValue}</TableCell>
                  <TableCell>{item.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
