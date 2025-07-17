
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { listUsers as listUsersService } from '@/lib/services/admin';
import { useToast } from '@/hooks/use-toast';

interface User {
    uid: string;
    email?: string;
    disabled: boolean;
    creationTime: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await listUsersService();
        if (result.success && result.users) {
            setUsers(result.users);
        } else {
            throw new Error(result.error || 'Failed to fetch users.');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        toast({
            variant: 'destructive',
            title: 'Error Fetching Users',
            description: err.message || 'Could not retrieve user list from the server.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);


  const renderBody = () => {
    if (loading) {
      return Array.from({ length: 3 }).map((_, index) => (
         <TableRow key={index}>
          <TableCell><Skeleton className="h-5 w-48" /></TableCell>
          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        </TableRow>
      ));
    }
    if (error) {
       return (
        <TableRow>
          <TableCell colSpan={4} className="text-center text-destructive">
            {error}
          </TableCell>
        </TableRow>
      );
    }
    if (users.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center text-muted-foreground">
            No users found.
          </TableCell>
        </TableRow>
      );
    }
    return users.map((user) => (
      <TableRow key={user.uid}>
        <TableCell className="font-medium">{user.email || 'N/A'}</TableCell>
        <TableCell className="font-mono text-xs text-muted-foreground">{user.uid}</TableCell>
        <TableCell>
          <Badge variant={!user.disabled ? 'default' : 'destructive'} className={cn(!user.disabled ? "bg-green-500/80 text-white" : "", "border-transparent")}>
            {!user.disabled ? 'Active' : 'Disabled'}
          </Badge>
        </TableCell>
        <TableCell>{new Date(user.creationTime).toLocaleDateString()}</TableCell>
      </TableRow>
    ));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display">User Management</h1>
        <p className="text-muted-foreground">View and manage all registered users in the system.</p>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
          <CardDescription>A list of all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderBody()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
