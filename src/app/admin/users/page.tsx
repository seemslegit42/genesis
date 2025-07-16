
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getFunctions, httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { Skeleton } from '@/components/ui/skeleton';

// This is the expected shape of the user data from our Cloud Function.
interface AppUser {
  uid: string;
  email?: string;
  disabled: boolean;
  creationTime: string;
}

// Define the shape of the Cloud Function's response
interface ListUsersResult extends HttpsCallableResult {
    readonly data: {
        users: AppUser[];
    };
}


// In a real application, you would protect this function call.
// For now, we'll assume the user has access if they can reach this page.
const functions = getFunctions();
const listUsers = httpsCallable(functions, 'listUsers');

export default function UserManagementPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await listUsers() as ListUsersResult;
        setUsers(result.data.users);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.message || 'Failed to fetch users. You may not have the required permissions.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
          <CardDescription>A list of all users fetched directly from Firebase Authentication.</CardDescription>
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
