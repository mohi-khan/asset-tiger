"use client"
import { Settings, BarChart3, Wallet, ShoppingCart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { tokenAtom, useInitializeUser, userDataAtom } from "@/utils/user"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const DashboardOverview = () => {
  useInitializeUser()
  const [userData] = useAtom(userDataAtom)
  const [token] = useAtom(tokenAtom)

  const router = useRouter()
  
  const isLoading = userData === undefined || token === undefined

  useEffect(() => {
    if (!isLoading && (!userData || !token)) {
      router.push('/signin')
    }
  }, [isLoading, userData, token, router])
  
  // if (userData === undefined) {
  //   // still initializing
  //   return <div>Loading...</div>;
  // }
  // Sample data for the pie chart
  const pieData = [
    { name: "Equipment", value: 95 },
    { name: "Other", value: 5 },
  ]

  const COLORS = ["#2e6b2e", "#e5e7eb"]

  // Current month and year for the calendar
  const currentMonth = "APRIL"
  const currentYear = "2025"

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <span className="text-gray-500">dashboard & statistics</span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 - Number of Active Assets */}
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Number of Active Assets</p>
              <p className="text-3xl font-bold mt-2">1</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-md transform hover:rotate-45 duration-200">
              <Settings className="h-6 w-6 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2 - NAV: Net Asset Value */}
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">NAV · Net Asset Value</p>
              <p className="text-3xl font-bold mt-2">฿120,000</p>
            </div>
            <div className="bg-emerald-500 p-3 rounded-md transform hover:rotate-45 duration-200">
              <BarChart3 className="h-6 w-6 text-white transform" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3 - Value of Assets */}
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Value of Assets</p>
              <p className="text-3xl font-bold mt-2">฿120,000</p>
            </div>
            <div className="bg-red-500 p-3 rounded-md transform hover:rotate-45 duration-200">
              <Wallet className="h-6 w-6 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4 - Purchases in Fiscal Year */}
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Purchases in Fiscal Year</p>
              <p className="text-3xl font-bold mt-2">฿120,000</p>
              <p className="text-sm text-gray-500">1 Asset</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-md transform hover:rotate-45 duration-200">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Value by Category Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-semibold">Asset Value</h2>
              <span className="text-sm text-gray-500 ml-2">by Category</span>
            </div>

            <div className="flex">
              <div className="h-64 w-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius="90%"
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="ml-4 flex items-center">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-800 mr-2"></div>
                  <span>Equipment</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Section */}
        <Card className="col-span-1">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <button className="p-1 rounded-md hover:bg-gray-100">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="p-1 rounded-md hover:bg-gray-100">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center">
                <h2 className="text-lg font-semibold">
                  {currentMonth} {currentYear}
                </h2>
                <div className="ml-2 bg-yellow-500 text-xs px-2 py-1 rounded">month</div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {/* Days of the week */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center p-2 text-sm font-medium">
                  {day}
                </div>
              ))}

              {/* Previous month days */}
              <div className="text-center p-2 text-sm text-gray-400">30</div>
              <div className="text-center p-2 text-sm text-gray-400">31</div>

              {/* Current month days */}
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <div key={day} className={`text-center p-2 text-sm ${day === 3 ? "bg-yellow-100" : ""}`}>
                  {day}
                </div>
              ))}

              {/* Next month days */}
              {Array.from({ length: 3 }, (_, i) => i + 1).map((day) => (
                <div key={`next-${day}`} className="text-center p-2 text-sm text-gray-400">
                  {day}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardOverview

