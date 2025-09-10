'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useDatabase } from '@/lib/db/database-context'
import { getPostsTimeSeries, getPostsByHour } from '@/lib/db/queries'

export function TrendChart() {
  const { isInitialized } = useDatabase()
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([])
  const [hourlyData, setHourlyData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('daily')

  useEffect(() => {
    if (isInitialized) {
      // Get time series data for last 30 days
      const tsData = getPostsTimeSeries(30)
      const formattedTsData = tsData.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        posts: item.count,
        avgScore: Math.round(item.avgScore || 0),
        avgComments: Math.round(item.avgComments || 0)
      })).reverse()
      setTimeSeriesData(formattedTsData)

      // Get hourly distribution for last 7 days
      const hourData = getPostsByHour(7)
      const formattedHourData = hourData.map(item => ({
        hour: `${item.hour}:00`,
        posts: item.count,
        avgScore: Math.round(item.avgScore || 0)
      }))
      setHourlyData(formattedHourData)
    }
  }, [isInitialized])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Trends</CardTitle>
        <CardDescription>Post activity and engagement over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="daily">Daily Activity</TabsTrigger>
            <TabsTrigger value="hourly">Hourly Distribution</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="posts" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorPosts)"
                  name="Posts"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="hourly" className="space-y-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="hour" 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="posts" 
                  fill="#82ca9d"
                  name="Posts"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avgScore" 
                  stroke="#ff7300"
                  name="Avg Score"
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgComments" 
                  stroke="#387908"
                  name="Avg Comments"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}