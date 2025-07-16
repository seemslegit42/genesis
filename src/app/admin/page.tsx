
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, ShieldCheck, Activity } from 'lucide-react';

// This is a mock implementation for the dashboard.
// In a future step, we will connect this to live data.

export default function AdminDashboard() {
  const loading = false; // Set to false to show mock data
  const userCount = 1; // Mock data

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the control center for BEEP: Genesis.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{userCount}</div>
            )}
            <p className="text-xs text-muted-foreground">Currently registered Initiates</p>
          </CardContent>
        </Card>
        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vows Taken</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{userCount}</div>
            )}
            <p className="text-xs text-muted-foreground">Each user makes one Vow</p>
          </CardContent>
        </Card>
        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold text-green-400">Operational</div>
             <p className="text-xs text-muted-foreground">All systems normal</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
