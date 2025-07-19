import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    HandCoins
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
    activeMilestones,
}: DashboardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'KES',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="space-y-6">
                {/* Welcome Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome to your Dashboard</h1>
                    <p className="text-muted-foreground">Here's an overview of the association's activities and your account.</p>
                </div>

                {/* Key Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalMembers}</div>
                            <p className="text-xs text-muted-foreground">Active members</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalContributions)}</div>
                            <p className="text-xs text-muted-foreground">All time contributions</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeLoans}</div>
                            <p className="text-xs text-muted-foreground">Currently active</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">CIC Investments</CardTitle>
                            <PiggyBank className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalCicInvestments)}</div>
                            <p className="text-xs text-muted-foreground">Total invested</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Your Account Summary */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <HandCoins className="h-5 w-5" />
                                Your Contributions
                            </CardTitle>
                            <CardDescription>Your contribution summary</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {formatCurrency(userContributions)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">Total contributions to date</p>
                            <Button asChild className="w-full">
                                <Link href="/contributions">
                                    View All Contributions
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Your Loans
                            </CardTitle>
                            <CardDescription>Your loan information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Loans</p>
                                    <p className="text-2xl font-bold">{userActiveLoans.length}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Available Loan Limit</p>
                                    <p className="text-lg font-semibold text-blue-600">{formatCurrency(userLoanLimit)}</p>
                                </div>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/loans">
                                        Manage Loans
                                        <ArrowUpRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Navigate to key sections</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Button asChild variant="outline" className="h-20 flex-col gap-2">
                                <Link href="/contributions">
                                    <HandCoins className="h-6 w-6" />
                                    <span>Contributions</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-20 flex-col gap-2">
                                <Link href="/loans">
                                    <CreditCard className="h-6 w-6" />
                                    <span>Loans</span>
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

                {/* Recent Activity Summary */}
                {(recentContributions.length > 0 || recentLoans.length > 0) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest activities in the association</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {recentContributions.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Recent Contributions</h4>
                                        <div className="space-y-2">
                                            {recentContributions.slice(0, 3).map((contribution: any) => (
                                                <div key={contribution.id} className="flex items-center justify-between text-sm">
                                                    <span>{contribution.user.name}</span>
                                                    <span className="font-medium text-green-600">{formatCurrency(contribution.amount)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Button asChild variant="link" size="sm" className="p-0 mt-2">
                                            <Link href="/contributions">View all contributions</Link>
                                        </Button>
                                    </div>
                                )}

                                {recentLoans.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Recent Loans</h4>
                                        <div className="space-y-2">
                                            {recentLoans.slice(0, 3).map((loan: any) => (
                                                <div key={loan.id} className="flex items-center justify-between text-sm">
                                                    <span>{loan.user.name}</span>
                                                    <span className="font-medium text-blue-600">{formatCurrency(loan.principal_amount)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Button asChild variant="link" size="sm" className="p-0 mt-2">
                                            <Link href="/loans">View all loans</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
