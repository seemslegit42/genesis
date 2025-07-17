'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';
import { listUsers as listUsersService } from '@/lib/services/admin';
import { useToast } from '@/hooks/use-toast';

interface User {
    uid: string;
    email?: string;
    disabled: boolean;
    creationTime: string;
}

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await listUsersService();
        if (result.success && result.users) {
            setUserCount(result.users.length);
        } else {
            throw new Error(result.error || 'Failed to fetch dashboard data.');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        toast({
            variant: 'destructive',
            title: 'Error Fetching Dashboard Data',
            description: err.message || 'Could not retrieve data from the server.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [toast]);

  const renderStat = (value: number | null, description: string) => {
    if (loading) {
      return <Skeleton className="h-8 w-1/2" />;
    }
    if (error) {
      return <div className="text-sm text-destructive flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Error</div>
    }
    return (
        <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </>
    )
  }

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
            {renderStat(userCount, 'Currently registered Initiates')}
          </CardContent>
        </Card>
        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vows Taken</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {renderStat(userCount, 'Each user makes one Vow')}
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
