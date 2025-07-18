import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ArrowLeft,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Info,
    Calculator
} from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contributions', href: '/contributions' },
    { title: 'Create', href: '/contributions/create' },
];

export default function CreateContribution() {
    const [calculatedAmount, setCalculatedAmount] = useState(0);
    
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        type: 'deposit',
        description: '',
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', { 
            style: 'currency', 
            currency: 'KES',
            minimumFractionDigits: 0
        }).format(amount);
    };

    useEffect(() => {
        const amount = parseFloat(data.amount) || 0;
        setCalculatedAmount(amount);
    }, [data.amount]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contributions', {
            onSuccess: () => {
                // Will redirect to index with success message
            }
        });
    };

    const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Contribution" />
            
            <div className="flex-1 space-y-6 p-6 max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/contributions">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Contribution</h1>
                        <p className="text-muted-foreground">Submit a new contribution or withdrawal request</p>
                    </div>
                </div>

                {/* Info Banner */}
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Important Information</p>
                                <ul className="space-y-1 text-xs">
                                    <li>• All contributions require approval from an administrator or treasurer</li>
                                    <li>• Minimum contribution amount is KES 100</li>
                                    <li>• Your loan limit is based on your total approved contributions</li>
                                    <li>• You'll receive a reference number for tracking</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Contribution Details
                        </CardTitle>
                        <CardDescription>
                            Fill in the details for your contribution request
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Type Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="type">Transaction Type</Label>
                                <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select transaction type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="deposit">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4 text-green-600" />
                                                Deposit - Add money to your contribution
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="withdrawal">
                                            <div className="flex items-center gap-2">
                                                <TrendingDown className="h-4 w-4 text-red-600" />
                                                Withdrawal - Remove money from your contribution
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-sm text-red-600">{errors.type}</p>
                                )}
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (KES)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="Enter amount"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        className="pl-10"
                                        min="100"
                                        step="0.01"
                                    />
                                </div>
                                {errors.amount && (
                                    <p className="text-sm text-red-600">{errors.amount}</p>
                                )}
                                
                                {/* Quick Amount Buttons */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-sm text-muted-foreground self-center">Quick amounts:</span>
                                    {quickAmounts.map((amount) => (
                                        <Button
                                            key={amount}
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setData('amount', amount.toString())}
                                        >
                                            {formatCurrency(amount)}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount Preview */}
                            {calculatedAmount > 0 && (
                                <Card className="bg-muted/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Calculator className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Amount Preview</p>
                                                <p className="text-lg font-bold">
                                                    {data.type === 'deposit' ? '+' : '-'}{formatCurrency(calculatedAmount)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    This {data.type} will {data.type === 'deposit' ? 'increase' : 'decrease'} your contribution balance
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Input
                                    id="description"
                                    placeholder="e.g., Monthly contribution, Emergency withdrawal, etc."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Provide additional context for this transaction (optional)
                                </p>
                            </div>

                            <Separator />

                            {/* Submit Actions */}
                            <div className="flex gap-4 justify-end">
                                <Button asChild variant="outline">
                                    <Link href="/contributions">
                                        Cancel
                                    </Link>
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={processing || !data.amount || parseFloat(data.amount) < 100}
                                    className="min-w-[120px]"
                                >
                                    {processing ? 'Submitting...' : `Submit ${data.type === 'deposit' ? 'Deposit' : 'Withdrawal'}`}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Help Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Need Help?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p><strong>Deposits:</strong> Add money to your welfare association contribution. This increases your available loan limit.</p>
                            <p><strong>Withdrawals:</strong> Request to withdraw money from your contributions. Subject to association rules and approval.</p>
                            <p><strong>Processing:</strong> All requests are reviewed by administrators or treasurers before approval.</p>
                            <p><strong>Tracking:</strong> You'll receive a reference number to track your request status.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}