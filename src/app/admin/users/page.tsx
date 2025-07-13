
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// This is mock data. In a real application, you would fetch this from your database.
const users = [
  {
    id: '1',
    email: 'initiate@example.com',
    status: 'Active',
    vow: 'Architect',
    createdAt: new Date().toISOString(),
  },
];

export default function UserManagementPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display">User Management</h1>
        <p className="text-muted-foreground">View and manage all registered users.</p>
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
                <TableHead>Status</TableHead>
                <TableHead>Vow</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'default' : 'destructive'} className="bg-green-500/80 text-white">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.vow}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
