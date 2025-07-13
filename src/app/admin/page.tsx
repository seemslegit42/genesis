import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-display">Admin Dashboard</h1>
      <p className="text-muted-foreground">Welcome to the control center for BEEP: Genesis.</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Currently registered</p>
          </CardContent>
        </Card>
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Vows Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Across all users</p>
          </CardContent>
        </Card>
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-2xl font-bold text-green-400">Operational</p>
             <p className="text-xs text-muted-foreground">All systems normal</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
