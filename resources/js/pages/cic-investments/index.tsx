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
  TrendingUp
} from 'lucide-react';

interface CicInvestment {
  id: number;
  amount: number;
  current_value: number;
  interest_rate: number;
  investment_date: string;
  maturity_date?: string;
  status: 'active' | 'matured';
  investment_reference: string;
  notes?: string;
  recorded_by: {
    id: number;
    name: string;
  };
}

interface CicInvestmentsIndexProps {
  investments: {
    data: CicInvestment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  totalInvested: number;
  totalCurrentValue: number;
  totalInterestEarned: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'CIC Investments', href: '/cic-investments' },
];

export default function CicInvestmentsIndex({
  investments,
  totalInvested,
  totalCurrentValue,
  totalInterestEarned
}: CicInvestmentsIndexProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'bg-green-100 text-green-800 border-green-200',
      'matured': 'bg-blue-100 text-blue-800 border-blue-200',
    };

    const icons = {
      'active': Clock,
      'matured': CheckCircle,
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const calculateMonthlyInterest = (investment: CicInvestment) => {
    return (investment.current_value * investment.interest_rate) / 100;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="CIC Investments" />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CIC Investments</h1>
            <p className="text-muted-foreground">Manage CIC investment portfolio</p>
          </div>
          <Button asChild>
            <Link href="/cic-investments/create">
              <Plus className="h-4 w-4 mr-2" />
              New Investment
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
              <p className="text-xs text-muted-foreground">Principal amount</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCurrentValue)}</div>
              <p className="text-xs text-muted-foreground">Including interest</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interest Earned</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalInterestEarned)}</div>
              <p className="text-xs text-muted-foreground">Total earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Investments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Portfolio</CardTitle>
            <CardDescription>
              {investments.data.length} of {investments.total} investments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Reference</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium">Current Value</th>
                    <th className="text-left p-4 font-medium">Interest Rate</th>
                    <th className="text-left p-4 font-medium">Monthly Interest</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.data.map((investment) => (
                    <tr key={investment.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {investment.investment_reference}
                        </code>
                      </td>
                      <td className="p-4">
                        <span className="font-bold">{formatCurrency(investment.amount)}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-green-600">{formatCurrency(investment.current_value)}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold">{investment.interest_rate}%</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-purple-600">{formatCurrency(calculateMonthlyInterest(investment))}</span>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(investment.status)}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm">
                            {new Date(investment.investment_date).toLocaleDateString()}
                          </p>
                          {investment.maturity_date && (
                            <p className="text-xs text-muted-foreground">
                              Matures: {new Date(investment.maturity_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/cic-investments/${investment.id}`}>
                              <Eye className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {investments.data.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No investments found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
