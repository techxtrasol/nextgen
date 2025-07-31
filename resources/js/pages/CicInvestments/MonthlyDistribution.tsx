import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Calculator,
  AlertCircle,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';

interface MonthlyDistributionProps {
  totalInvested: number;
  activeMembers: number;
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export default function MonthlyDistribution({ totalInvested, activeMembers, auth }: MonthlyDistributionProps) {
  const [totalInterestEarned, setTotalInterestEarned] = useState('');
  const [interestRate, setInterestRate] = useState('9.75');
  const [distributionMonth, setDistributionMonth] = useState('');
  const [distributionDate, setDistributionDate] = useState('');

  const { data, setData, post, processing, errors } = useForm({
    distribution_month: '',
    total_interest_earned: '',
    interest_rate: '9.75',
    distribution_date: '',
  });

  const calculateFees = () => {
    const interest = parseFloat(totalInterestEarned) || 0;
    const rate = parseFloat(interestRate) || 0;

    const monthlyManagementFee = interest * (0.02 / 12); // 2% annually
    const withholdingTax = interest * 0.15; // 15%
    const netInterest = interest - monthlyManagementFee - withholdingTax;
    const perMember = netInterest / activeMembers;

    return {
      monthlyManagementFee,
      withholdingTax,
      netInterest,
      perMember
    };
  };

  const fees = calculateFees();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData({
      distribution_month: distributionMonth,
      total_interest_earned: totalInterestEarned,
      interest_rate: interestRate,
      distribution_date: distributionDate,
    });
    post('/cic-investments/monthly-distribution');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  return (
    <>
      <Head title="Monthly Interest Distribution" />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Monthly Interest Distribution
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Distribute CIC Money Market Fund interest to all active members
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6" />
                    Distribution Form
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Enter the monthly interest details for distribution
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Distribution Month */}
                    <div className="space-y-2">
                      <Label htmlFor="distribution_month" className="text-base font-semibold">
                        Distribution Month
                      </Label>
                      <Input
                        id="distribution_month"
                        type="month"
                        value={distributionMonth}
                        onChange={(e) => setDistributionMonth(e.target.value)}
                        className="h-12 text-lg"
                        required
                      />
                      {errors.distribution_month && (
                        <p className="text-red-500 text-sm">{errors.distribution_month}</p>
                      )}
                    </div>

                    {/* Distribution Date */}
                    <div className="space-y-2">
                      <Label htmlFor="distribution_date" className="text-base font-semibold">
                        Distribution Date
                      </Label>
                      <Input
                        id="distribution_date"
                        type="date"
                        value={distributionDate}
                        onChange={(e) => setDistributionDate(e.target.value)}
                        className="h-12 text-lg"
                        required
                      />
                      {errors.distribution_date && (
                        <p className="text-red-500 text-sm">{errors.distribution_date}</p>
                      )}
                    </div>

                    {/* Total Interest Earned */}
                    <div className="space-y-2">
                      <Label htmlFor="total_interest_earned" className="text-base font-semibold">
                        Total Interest Earned (KES)
                      </Label>
                      <Input
                        id="total_interest_earned"
                        type="number"
                        value={totalInterestEarned}
                        onChange={(e) => setTotalInterestEarned(e.target.value)}
                        placeholder="Enter total interest earned"
                        className="h-12 text-lg"
                        min="0"
                        step="0.01"
                        required
                      />
                      {errors.total_interest_earned && (
                        <p className="text-red-500 text-sm">{errors.total_interest_earned}</p>
                      )}
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-2">
                      <Label htmlFor="interest_rate" className="text-base font-semibold">
                        Interest Rate (%)
                      </Label>
                      <Input
                        id="interest_rate"
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        placeholder="Enter interest rate"
                        className="h-12 text-lg"
                        min="0"
                        max="50"
                        step="0.01"
                        required
                      />
                      {errors.interest_rate && (
                        <p className="text-red-500 text-sm">{errors.interest_rate}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={processing || !totalInterestEarned || !distributionMonth || !distributionDate}
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    >
                      {processing ? 'Processing...' : 'Distribute Interest'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Calculations & Info */}
            <div className="space-y-6">
              {/* Calculation Summary */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Calculation Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  {totalInterestEarned ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Interest:</span>
                        <span className="font-semibold">{formatCurrency(parseFloat(totalInterestEarned))}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Interest Rate:</span>
                        <span className="font-semibold">{interestRate}%</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Management Fee:</span>
                        <span className="font-semibold text-orange-600">
                          {formatCurrency(fees.monthlyManagementFee)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Withholding Tax:</span>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(fees.withholdingTax)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Net Interest:</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(fees.netInterest)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Per Member:</span>
                        <span className="font-semibold text-blue-600">
                          {formatCurrency(fees.perMember)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Enter interest amount to see calculations
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* System Information */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    System Information
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Invested:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(totalInvested)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Active Members:</span>
                      <span className="font-semibold text-blue-600">
                        {activeMembers}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Important Information */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Important Information
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>2% annual management fee is deducted</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>15% withholding tax is applied</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Net interest is distributed equally to all active members</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Interest is added to member contributions</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Distribution is processed immediately</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
