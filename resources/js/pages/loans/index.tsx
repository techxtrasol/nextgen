import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Search,
    CreditCard,
    DollarSign,
    Clock,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Eye,
    Check,
    X,
    Calculator,
    Calendar
} from 'lucide-react';
import { useState } from 'react';

interface Loan {
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
}

interface LoansIndexProps {
    loans: {
        data: Loan[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Loans', href: '/loans' },
];

export default function LoansIndex({ loans }: LoansIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

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
            'pending': Clock,
            'active': CreditCard,
            'completed': CheckCircle,
            'defaulted': AlertTriangle,
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

    const isOverdue = (loan: Loan) => {
        if (!loan.due_date || loan.status !== 'active') return false;
        return new Date() > new Date(loan.due_date);
    };

    const handleApprove = (loanId: number) => {
        router.patch(`/loans/${loanId}/approve`, {}, {
            onSuccess: () => {
                router.reload({ only: ['loans'] });
            }
        });
    };

    const handleReject = (loanId: number) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason) {
            router.patch(`/loans/${loanId}/reject`, { reason }, {
                onSuccess: () => {
                    router.reload({ only: ['loans'] });
                }
            });
        }
    };

    const filteredLoans = loans.data.filter(loan => {
        const matchesSearch = loan.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            loan.purpose.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    // Calculate statistics
    const stats = {
        totalPending: loans.data.filter(l => l.status === 'pending').length,
        totalActive: loans.data.filter(l => l.status === 'active').length,
        totalCompleted: loans.data.filter(l => l.status === 'completed').length,
        totalDefaulted: loans.data.filter(l => l.status === 'defaulted').length,
        totalIssued: loans.data.filter(l => l.status !== 'rejected').reduce((sum, l) => sum + l.principal_amount, 0),
        totalOutstanding: loans.data.filter(l => l.status === 'active').reduce((sum, l) => sum + l.balance, 0),
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Loans" />
            
            <div className="flex-1 space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
                        <p className="text-muted-foreground">Manage loan applications and payments</p>
                    </div>
                    <Button asChild>
                        <Link href="/loans/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Apply for Loan
                        </Link>
                    </Button>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.totalPending}</div>
                            <p className="text-xs text-muted-foreground">Awaiting approval</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active</CardTitle>
                            <CreditCard className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.totalActive}</div>
                            <p className="text-xs text-muted-foreground">Currently repaying</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.totalCompleted}</div>
                            <p className="text-xs text-muted-foreground">Fully repaid</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Defaulted</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.totalDefaulted}</div>
                            <p className="text-xs text-muted-foreground">Overdue payments</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Issued</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.totalIssued)}</div>
                            <p className="text-xs text-muted-foreground">All approved loans</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                            <Calculator className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.totalOutstanding)}</div>
                            <p className="text-xs text-muted-foreground">Total balance due</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filter Loans</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 flex-wrap">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by member name or purpose..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="defaulted">Defaulted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Loans Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Loan Applications</CardTitle>
                        <CardDescription>
                            {filteredLoans.length} of {loans.total} loans
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-4 font-medium">Member</th>
                                        <th className="text-left p-4 font-medium">Amount</th>
                                        <th className="text-left p-4 font-medium">Duration</th>
                                        <th className="text-left p-4 font-medium">Status</th>
                                        <th className="text-left p-4 font-medium">Progress</th>
                                        <th className="text-left p-4 font-medium">Due Date</th>
                                        <th className="text-left p-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLoans.map((loan) => (
                                        <tr key={loan.id} className={`border-b hover:bg-muted/50 ${
                                            isOverdue(loan) ? 'bg-red-50' : ''
                                        }`}>
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium">{loan.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">{loan.purpose}</p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-bold">{formatCurrency(loan.principal_amount)}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Total: {formatCurrency(loan.total_amount)}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span className="text-sm">{loan.duration_weeks} weeks</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {loan.interest_rate}% interest
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    {getStatusBadge(loan.status)}
                                                    {isOverdue(loan) && (
                                                        <Badge variant="outline" className="bg-red-100 text-red-800 text-xs">
                                                            Overdue
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {loan.status === 'active' && (
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-xs">
                                                            <span>Paid: {formatCurrency(loan.amount_paid)}</span>
                                                            <span>Balance: {formatCurrency(loan.balance)}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className="bg-blue-600 h-2 rounded-full" 
                                                                style={{ 
                                                                    width: `${Math.min((loan.amount_paid / loan.total_amount) * 100, 100)}%` 
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                                {loan.status === 'completed' && (
                                                    <div className="text-xs text-green-600 font-medium">
                                                        Fully Repaid
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {loan.due_date ? (
                                                    <div>
                                                        <p className="text-sm">
                                                            {new Date(loan.due_date).toLocaleDateString()}
                                                        </p>
                                                        {isOverdue(loan) && (
                                                            <p className="text-xs text-red-600">
                                                                Overdue by {Math.floor((Date.now() - new Date(loan.due_date).getTime()) / (1000 * 60 * 60 * 24))} days
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">N/A</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={`/loans/${loan.id}`}>
                                                            <Eye className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                    {loan.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleApprove(loan.id)}
                                                                className="text-green-600 hover:text-green-700"
                                                            >
                                                                <Check className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleReject(loan.id)}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredLoans.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No loans found matching your criteria.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}