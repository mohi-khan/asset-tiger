import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockDepreciationData = [
  {
    id: "A001",
    name: "Laptop Dell XPS 15",
    acquisitionCost: 150000,
    depreciationMethod: "Straight Line",
    usefulLife: 5,
    accumulatedDepreciation: 30000,
    currentDepreciation: 15000,
    bookValue: 105000,
  },
  {
    id: "A002",
    name: "Office Chair",
    acquisitionCost: 8000,
    depreciationMethod: "Reducing Balance",
    usefulLife: 8,
    accumulatedDepreciation: 1200,
    currentDepreciation: 600,
    bookValue: 6200,
  },
  // Add more mock data if needed
];

export default function DepreciationReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Depreciation Report (Demo)</h1>
        <Button onClick={handlePrint} className="print:hidden">Print</Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 print:hidden">
        <div>
          <label className="block text-sm font-medium mb-1">Period Start</label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Period End</label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      <Card className="shadow-md">
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Acquisition Cost (BDT)</TableHead>
                <TableHead>Depreciation Method</TableHead>
                <TableHead>Useful Life (yrs)</TableHead>
                <TableHead>Accumulated Depreciation</TableHead>
                <TableHead>Depreciation This Period</TableHead>
                <TableHead>Book Value (BDT)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDepreciationData.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.id}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.acquisitionCost}</TableCell>
                  <TableCell>{asset.depreciationMethod}</TableCell>
                  <TableCell>{asset.usefulLife}</TableCell>
                  <TableCell>{asset.accumulatedDepreciation}</TableCell>
                  <TableCell>{asset.currentDepreciation}</TableCell>
                  <TableCell>{asset.bookValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
