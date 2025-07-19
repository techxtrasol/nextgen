import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    TrendingUp, 
    Users, 
    DollarSign, 
    CreditCard, 
    PiggyBank, 
    Target,
    ArrowUpRight,
    CalendarDays,
    CheckCircle,
    Clock,
    AlertTriangle
} from 'lucide-react';

interface DashboardProps {
    totalMembers: number;
    totalContributions: number;
    totalLoansIssued: number;
    activeLoans: number;
    totalCicInvestments: number;
    userContributions: number;
    userActiveLoans: any[];
    userLoanLimit: number;
    recentContributions: any[];
    recentLoans: any[];
    activeMilestones: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    totalMembers,
    totalContributions,
    totalLoansIssued,
    activeLoans,
    totalCicInvestments,
    userContributions,
    userActiveLoans,
    userLoanLimit,
    recentContributions,
    recentLoans,
    activeMilestones
}: DashboardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', { 
            style: 'currency', 
            currency: 'KES',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            'active': 'bg-green-100 text-green-800 border-green-200',
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'completed': 'bg-blue-100 text-blue-800 border-blue-200',
            'defaulted': 'bg-red-100 text-red-800 border-red-200',
            'approved': 'bg-green-100 text-green-800 border-green-200',
            'rejected': 'bg-red-100 text-red-800 border-red-200',
        };
        
        return (
            <Badge variant="outline" className={variants[status] || 'bg-gray-100 text-gray-800'}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex-1 space-y-6 p-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
                        <p className="text-muted-foreground">Here's what's happening with your welfare association today.</p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalMembers}</div>
                            <p className="text-xs text-muted-foreground">Active members</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalContributions)}</div>
                            <p className="text-xs text-muted-foreground">All approved contributions</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Loans Issued</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalLoansIssued)}</div>
                            <p className="text-xs text-muted-foreground">{activeLoans} active loans</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">CIC Investments</CardTitle>
                            <PiggyBank className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalCicInvestments)}</div>
                            <p className="text-xs text-muted-foreground">Current value</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Your Loan Limit</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(userLoanLimit)}</div>
                            <p className="text-xs text-muted-foreground">Based on contributions</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Personal Summary */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Your Summary
                            </CardTitle>
                            <CardDescription>Your personal welfare association status</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Total Contributions</span>
                                <span className="font-bold text-green-600">{formatCurrency(userContributions)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Available Loan Limit</span>
                                <span className="font-bold text-blue-600">{formatCurrency(userLoanLimit)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Active Loans</span>
                                <span className="font-bold">{userActiveLoans.length}</span>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Button asChild className="w-full">
                                    <Link href="/contributions/create">
                                        <DollarSign className="h-4 w-4 mr-2" />
                                        Make Contribution
                                    </Link>
                                </Button>
                                {userLoanLimit > 0 && userActiveLoans.length === 0 && (
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href="/loans/create">
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            Apply for Loan
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5" />
                                Recent Activity
                            </CardTitle>
                            <CardDescription>Latest contributions and loan applications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Recent Contributions</h4>
                                    <div className="space-y-2">
                                        {recentContributions.slice(0, 3).map((contribution: any) => (
                                            <div key={contribution.id} className="flex items-center justify-between p-2 rounded-lg border">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                                    <div>
                                                        <p className="text-sm font-medium">{contribution.user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{contribution.description}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-green-600">{formatCurrency(contribution.amount)}</p>
                                                    {getStatusBadge(contribution.status)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Recent Loans</h4>
                                    <div className="space-y-2">
                                        {recentLoans.slice(0, 3).map((loan: any) => (
                                            <div key={loan.id} className="flex items-center justify-between p-2 rounded-lg border">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                                    <div>
                                                        <p className="text-sm font-medium">{loan.user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{loan.purpose}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-blue-600">{formatCurrency(loan.principal_amount)}</p>
                                                    {getStatusBadge(loan.status)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Milestones */}
                {activeMilestones.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Active Milestones
                            </CardTitle>
                            <CardDescription>Current goals and targets for the association</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {activeMilestones.map((milestone: any) => (
                                    <div key={milestone.id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-sm">{milestone.title}</h4>
                                            <Badge variant="outline" className="bg-blue-50 text-blue-600">
                                                {milestone.progress}%
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-3">{milestone.description}</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span>Target: {formatCurrency(milestone.target_amount)}</span>
                                                <span>Current: {formatCurrency(milestone.current_amount)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                                    style={{ width: `${Math.min(milestone.progress, 100)}%` }}
                                                ></div>
                                            </div>
                                            {milestone.target_date && (
                                                <p className="text-xs text-muted-foreground">
                                                    Due: {new Date(milestone.target_date).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and navigation</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Button asChild variant="outline" className="h-20 flex-col gap-2">
                                <Link href="/contributions">
                                    <DollarSign className="h-6 w-6" />
                                    <span>View Contributions</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-20 flex-col gap-2">
                                <Link href="/loans">
                                    <CreditCard className="h-6 w-6" />
                                    <span>Manage Loans</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-20 flex-col gap-2">
                                <Link href="/cic-investments">
                                    <PiggyBank className="h-6 w-6" />
                                    <span>CIC Investments</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-20 flex-col gap-2">
                                <Link href="/milestones">
                                    <Target className="h-6 w-6" />
                                    <span>Milestones</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
