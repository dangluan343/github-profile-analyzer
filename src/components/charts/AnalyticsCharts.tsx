'use client';

import * as React from 'react';
import { RepoAnalytics } from '@/types/github';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useTheme } from 'next-themes';
import { PieChart as PieIcon, BarChart2, CalendarDays } from 'lucide-react';

interface AnalyticsChartsProps {
  analytics: RepoAnalytics;
}

export function AnalyticsCharts({ analytics }: AnalyticsChartsProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-aware colors
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#262626' : '#e5e5e5';
  const textColor = isDark ? '#a3a3a3' : '#525252';
  const tooltipBg = isDark ? '#0a0a0a' : '#ffffff';
  const tooltipBorder = isDark ? '#262626' : '#e5e5e5';

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[400px]">
        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-3xl h-[400px] flex items-center justify-center">
          <p className="text-sm text-neutral-400">Loading charts...</p>
        </Card>
        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-3xl h-[400px] flex items-center justify-center">
          <p className="text-sm text-neutral-400">Loading charts...</p>
        </Card>
      </div>
    );
  }

  // 1. Pie Chart Data
  const pieData = analytics.languageStats.map((stat) => ({
    name: stat.language,
    value: stat.count,
    percentage: stat.percentage,
    color: stat.color,
  }));

  // 2. Bar Chart Data (Stars by repo)
  const barData = analytics.starsTimeline;

  // 3. Timeline data (Creation timeline)
  const areaData = analytics.timeline;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Chart Group 1: Stars & Timeline */}
      <Card className="border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-lg font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-indigo-500" />
            Stars by Repository
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400 dark:text-neutral-500">
            Top 8 repositories compared by stars count
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {barData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-neutral-400 italic">
              No repository stars data available
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke={textColor}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => (val.length > 12 ? `${val.substring(0, 10)}...` : val)}
                  />
                  <YAxis
                    stroke={textColor}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: '12px',
                      color: isDark ? '#ffffff' : '#000000',
                    }}
                    cursor={{ fill: isDark ? '#1f1f1f' : '#f5f5f5', opacity: 0.4 }}
                  />
                  <Bar dataKey="stars" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart Group 2: Creation Timeline */}
      <Card className="border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-lg font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-indigo-500" />
            Repository Creation Timeline
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400 dark:text-neutral-500">
            Chronological growth of repositories (grouped by year/month)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {areaData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-neutral-400 italic">
              No timeline data available
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={areaData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke={textColor}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={textColor}
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: '12px',
                      color: isDark ? '#ffffff' : '#000000',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Repos Created"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#areaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart Group 3: Pie Chart (Span Full width on large screen) */}
      <Card className="border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl overflow-hidden xl:col-span-2">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-lg font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
            <PieIcon className="h-5 w-5 text-indigo-500" />
            Language Share Distribution
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400 dark:text-neutral-500">
            Breakdown of programming languages by repository count
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-around gap-6">
          {pieData.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-neutral-400 italic w-full">
              No language chart data available
            </div>
          ) : (
            <>
              <div className="h-[250px] w-full md:w-[350px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div
                              style={{
                                backgroundColor: tooltipBg,
                                borderColor: tooltipBorder,
                                borderWidth: '1px',
                                borderRadius: '12px',
                                padding: '8px 12px',
                                fontSize: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                              }}
                            >
                              <span className="font-bold" style={{ color: data.color }}>
                                {data.name}
                              </span>
                              : {data.value} {data.value === 1 ? 'repo' : 'repos'} ({data.percentage}%)
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
                {pieData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-50 dark:border-neutral-800/40 bg-neutral-50/50 dark:bg-neutral-900/30"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                        {item.value} {item.value === 1 ? 'repo' : 'repos'} ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
