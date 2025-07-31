import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Eye, EyeOff, XCircle } from 'lucide-react';
import { useState } from 'react';

interface LoanDetailsProps {
  loan: {
    id: number;
    principal_amount: number;
    duration_weeks: number;
    interest_rate: number;
    total_amount: number;
    amount_paid: number;
    balance: number;
    status: 'pending' | 'active' | 'completed' | 'defaulted' | 'rejected';
    application_date: string;
    approval_date?: string;
    due_date?: string;
    purpose: string;
    rejection_reason?: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
    approved_by?: {
      id: number;
      name: string;
    };
    payments?: any[];
  };
}

export default function LoanDetails({ loan }: LoanDetailsProps) {
  const [showReason, setShowReason] = useState(false);

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
      'active': 'bg-blue-100 text-blue-800 border-blue-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'defaulted': 'bg-red-100 text-red-800 border-red-200',
      'rejected': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    const icons = {
      'pending': Eye,
      'active': Eye,
      'completed': Eye,
      'defaulted': XCircle,
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

  return (
    <AppLayout>
      <Head title={`Loan #${loan.id}`} />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Loan Details
              {getStatusBadge(loan.status)}
            </CardTitle>
            <CardDescription>
              View all details for this loan application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Amount</div>
                <div className="font-bold text-lg">{formatCurrency(loan.principal_amount)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Repayment</div>
                <div className="font-bold text-lg">{formatCurrency(loan.total_amount)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-bold">{loan.duration_weeks} weeks</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Interest Rate</div>
                <div className="font-bold">{loan.interest_rate}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div>{getStatusBadge(loan.status)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Purpose</div>
                <div className="font-medium">{loan.purpose}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Applied On</div>
                <div>{new Date(loan.application_date).toLocaleDateString()}</div>
              </div>
              {loan.due_date && (
                <div>
                  <div className="text-sm text-gray-500">Due Date</div>
                  <div>{new Date(loan.due_date).toLocaleDateString()}</div>
                </div>
              )}
            </div>

            {/* Rejection Reason Toggle */}
            {loan.status === 'rejected' && loan.rejection_reason && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="mb-2"
                  onClick={() => setShowReason((v) => !v)}
                >
                  {showReason ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {showReason ? 'Hide' : 'Show'} Rejection Reason
                </Button>
                {showReason && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      <strong>Reason for Rejection:</strong> {loan.rejection_reason}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
