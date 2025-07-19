import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Plus,
  TrendingDown,
  TrendingUp,
  XCircle
} from 'lucide-react';

interface Contribution {
  id: number;
  amount: number;
  type: 'deposit' | 'withdrawal';
  description: string;
  reference_number: string;
  status: 'pending' | 'approved' | 'rejected';
  transaction_date: string;
  approved_at?: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  approved_by?: {
    id: number;
    name: string;
  };
}

interface MyContributionsProps {
  contributions: {
    data: Contribution[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  totalContributions: number;
  totalWithdrawals: number;
  netContributions: number;
  potentialMonthlyInterest: number;
  potentialYearlyInterest: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'My Contributions', href: '/my-contributions' },
];

export default function MyContributions({
  contributions,
  totalContributions,
  totalWithdrawals,
  netContributions,
  potentialMonthlyInterest,
  potentialYearlyInterest
}: MyContributionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'approved': 'bg-green-100 text-green-800 border-green-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200',
    };

    const icons = {
      'pending': Clock,
      'approved': CheckCircle,
      'rejected': XCircle,
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      'deposit': 'bg-green-50 text-green-700 border-green-200',
      'withdrawal': 'bg-red-50 text-red-700 border-red-200',
    };

    const icons = {
      'deposit': TrendingUp,
      'withdrawal': TrendingDown,
    };

    const Icon = icons[type as keyof typeof icons];

    return (
      <Badge variant="outline" className={variants[type as keyof typeof variants]}>
        <Icon className="h-3 w-3 mr-1" />
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="My Contributions" />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Contributions</h1>
            <p className="text-muted-foreground">View your contribution history and totals</p>
          </div>
          <Button asChild>
            <Link href="/contributions/create">
              <Plus className="h-4 w-4 mr-2" />
              New Contribution
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalContributions)}</div>
              <p className="text-xs text-muted-foreground">Approved deposits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalWithdrawals)}</div>
              <p className="text-xs text-muted-foreground">Approved withdrawals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Contributions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netContributions >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netContributions)}
              </div>
              <p className="text-xs text-muted-foreground">Current balance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Monthly Interest</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(potentialMonthlyInterest)}</div>
              <p className="text-xs text-muted-foreground">At 9.75% monthly</p>
            </CardContent>
          </Card>
        </div>

        {/* Contributions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Contribution History</CardTitle>
            <CardDescription>
              {contributions.data.length} of {contributions.total} contributions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Reference</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.data.map((contribution) => (
                    <tr key={contribution.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {contribution.reference_number}
                        </code>
                      </td>
                      <td className="p-4">
                        {getTypeBadge(contribution.type)}
                      </td>
                      <td className="p-4">
                        <span className={`font-bold ${contribution.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {contribution.type === 'deposit' ? '+' : '-'}{formatCurrency(contribution.amount)}
                        </span>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(contribution.status)}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm">
                            {new Date(contribution.transaction_date).toLocaleDateString()}
                          </p>
                          {contribution.approved_at && (
                            <p className="text-xs text-muted-foreground">
                              Approved: {new Date(contribution.approved_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/contributions/${contribution.id}`}>
                            <Eye className="h-3 w-3" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {contributions.data.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No contributions found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
