import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import { tokenAtom, useInitializeUser } from "@/utils/user";
import { getDisposeReport } from "@/utils/api";
import { GetDisposeType } from "@/utils/type";
import { format } from "date-fns";

export default function AssetDisposalReport() {
  useInitializeUser();
  const [token] = useAtom(tokenAtom);

  const [disposeDate, setDisposeDate] = useState("");
  const [disposeData, setDisposeData] = useState<GetDisposeType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDisposeData = useCallback(async () => {
    if (!token || !disposeDate) return;

    try {
      setLoading(true);
      const response = await getDisposeReport(token, disposeDate);
      setDisposeData(response.data || []);
    } catch (error) {
      console.error("Error fetching disposal data:", error);
    } finally {
      setLoading(false);
    }
  }, [token, disposeDate]);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Asset Disposal Report</h1>
        <Button onClick={handlePrint} className="print:hidden">
          Print
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 print:hidden items-end">
        <div>
          <Label className="mb-1 block">Dispose Date</Label>
          <Input
            type="date"
            value={disposeDate}
            onChange={(e) => setDisposeDate(e.target.value)}
          />
        </div>
        <Button onClick={fetchDisposeData} className="px-4 py-2">
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
                  <TableHead>Date</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Disposal Method</TableHead>
                  <TableHead>Disposal Value (BDT)</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Performed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disposeData.length > 0 ? (
                  disposeData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(item.dispose_date)}</TableCell>
                      <TableCell>{item.asset_name}</TableCell>
                      <TableCell>{item.method}</TableCell>
                      <TableCell>{item.value}</TableCell>
                      <TableCell>{item.remarks || "-"}</TableCell>
                      <TableCell>{item.performed_by}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">
                      No data found for this date.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
