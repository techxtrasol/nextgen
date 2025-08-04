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
    Filter,
    DollarSign,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    Check,
    X
} from 'lucide-react';
import { useState } from 'react';

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

interface ContributionsIndexProps {
    contributions: {
        data: Contribution[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contributions', href: '/contributions' },
];

export default function ContributionsIndex({ contributions }: ContributionsIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

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

    const handleApprove = (contributionId: number) => {
        router.patch(`/contributions/${contributionId}/approve`, {}, {
            onSuccess: () => {
                // Refresh the page data
                router.reload({ only: ['contributions'] });
            }
        });
    };

    const handleReject = (contributionId: number) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason) {
            router.patch(`/contributions/${contributionId}/reject`, { reason }, {
                onSuccess: () => {
                    router.reload({ only: ['contributions'] });
                }
            });
        }
    };

    const filteredContributions = contributions.data.filter(contribution => {
        const matchesSearch = contribution.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            contribution.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            contribution.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || contribution.status === statusFilter;
        const matchesType = typeFilter === 'all' || contribution.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const totalApproved = contributions.data
        .filter(c => c.status === 'approved' && c.type === 'deposit')
        .reduce((sum, c) => sum + c.amount, 0);

    const totalPending = contributions.data.filter(c => c.status === 'pending').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contributions" />

            <div className="flex-1 space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-3">Contributions</h1>
                        <p className="text-muted-foreground text-lg">Manage member contributions and withdrawals</p>
                    </div>
                    <Button asChild>
                        <Link href="/contributions/create">
                            <Plus className="h-4 w-4 mr-2" />
                            New Contribution
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <Card className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalApproved)}</div>
                            <p className="text-xs text-muted-foreground">Approved deposits</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{totalPending}</div>
                            <p className="text-xs text-muted-foreground">Awaiting approval</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{contributions.total}</div>
                            <p className="text-xs text-muted-foreground">All time</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="hover:shadow-md transition-shadow duration-200 mb-8">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Filter Contributions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-6 flex-wrap">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name, reference, or description..."
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
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="deposit">Deposit</SelectItem>
                                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Contributions Table */}
                <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-4">
                        <CardTitle>Contributions History</CardTitle>
                        <CardDescription>
                            {filteredContributions.length} of {contributions.total} contributions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-4 font-medium">Member</th>
                                        <th className="text-left p-4 font-medium">Reference</th>
                                        <th className="text-left p-4 font-medium">Type</th>
                                        <th className="text-left p-4 font-medium">Amount</th>
                                        <th className="text-left p-4 font-medium">Status</th>
                                        <th className="text-left p-4 font-medium">Date</th>
                                        <th className="text-left p-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredContributions.map((contribution) => (
                                        <tr key={contribution.id} className="border-b hover:bg-muted/50 transition-colors duration-150">
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium">{contribution.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">{contribution.user.email}</p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                                    {contribution.reference_number}
                                                </code>
                                            </td>
                                            <td className="p-4">
                                                {getTypeBadge(contribution.type)}
                                            </td>
                                            <td className="p-4">
                                                <span className={`font-bold ${
                                                    contribution.type === 'deposit' ? 'text-green-600' : 'text-red-600'
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
                                                <div className="flex gap-2">
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={`/contributions/${contribution.id}`}>
                                                            <Eye className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                    {contribution.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleApprove(contribution.id)}
                                                                className="text-green-600 hover:text-green-700"
                                                            >
                                                                <Check className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleReject(contribution.id)}
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

                        {filteredContributions.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">No contributions found matching your criteria.</p>
                                <p className="text-sm mt-2">Try adjusting your search or filter settings.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
