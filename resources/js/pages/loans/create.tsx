import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, Calculator, CheckCircle, CreditCard, Info } from 'lucide-react';
import { useState } from 'react';

interface LoanEligibilityInfo {
  total_contributions: number;
  available_loan_limit: number;
  active_loans: number;
  minimum_contribution: number;
  is_eligible: boolean;
  max_loan_amount: number;
}

interface Props {
  eligibility: LoanEligibilityInfo;
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export default function LoanApplication({ eligibility, auth }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    principal_amount: '',
    purpose: '',
    repayment_period: '',
    collateral_description: '',
    guarantor_name: '',
    guarantor_phone: '',
    guarantor_relationship: '',
  });

  const [calculatedInterest, setCalculatedInterest] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);

  const calculateLoan = (amount: number, months: number) => {
    if (amount && months) {
      const principal = parseFloat(amount);
      const period = parseInt(months);
      const monthlyRate = 0.02; // 2% monthly interest
      const totalInterest = principal * monthlyRate * period;
      const total = principal + totalInterest;
      const monthly = total / period;

      setCalculatedInterest(totalInterest);
      setMonthlyPayment(monthly);
      setTotalRepayment(total);
    }
  };

  const handleAmountChange = (value: string) => {
    setData('principal_amount', value);
    if (value && data.repayment_period) {
      calculateLoan(parseFloat(value), parseInt(data.repayment_period));
    }
  };

  const handlePeriodChange = (value: string) => {
    setData('repayment_period', value);
    if (data.principal_amount && value) {
      calculateLoan(parseFloat(data.principal_amount), parseInt(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/loans');
  };

  return (
    <>
      <Head title="Apply for Loan" />

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Loan Application</h1>
            <p className="text-muted-foreground">
              Apply for a loan based on your contributions and eligibility
            </p>
          </div>

          {/* Eligibility Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Loan Eligibility
              </CardTitle>
              <CardDescription>
                Your current loan eligibility based on your contributions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Total Contributions</Label>
                  <div className="text-2xl font-bold text-green-600">
                    KSH {eligibility.total_contributions.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Available Loan Limit</Label>
                  <div className="text-2xl font-bold text-blue-600">
                    KSH {eligibility.available_loan_limit.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Active Loans</Label>
                  <div className="text-2xl font-bold text-orange-600">
                    {eligibility.active_loans}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Minimum Contribution Required</Label>
                  <div className="text-2xl font-bold text-purple-600">
                    KSH {eligibility.minimum_contribution.toLocaleString()}
                  </div>
                </div>
              </div>

              {!eligibility.is_eligible && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You need to contribute at least KSH {eligibility.minimum_contribution.toLocaleString()}
                    to be eligible for a loan. Your current contribution is KSH {eligibility.total_contributions.toLocaleString()}.
                  </AlertDescription>
                </Alert>
              )}

              {eligibility.is_eligible && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    You are eligible for a loan up to KSH {eligibility.max_loan_amount.toLocaleString()}.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Loan Application Form */}
          {eligibility.is_eligible && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Loan Application Form
                </CardTitle>
                <CardDescription>
                  Fill in the details below to apply for your loan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Loan Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="principal_amount">Loan Amount (KSH)</Label>
                      <Input
                        id="principal_amount"
                        type="number"
                        value={data.principal_amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="Enter loan amount"
                        max={eligibility.max_loan_amount}
                        required
                      />
                      {errors.principal_amount && (
                        <p className="text-sm text-red-600">{errors.principal_amount}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Maximum: KSH {eligibility.max_loan_amount.toLocaleString()}
                      </p>
                    </div>

                    {/* Repayment Period */}
                    <div className="space-y-2">
                      <Label htmlFor="repayment_period">Repayment Period (Months)</Label>
                      <Select value={data.repayment_period} onValueChange={handlePeriodChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 Months</SelectItem>
                          <SelectItem value="6">6 Months</SelectItem>
                          <SelectItem value="12">12 Months</SelectItem>
                          <SelectItem value="18">18 Months</SelectItem>
                          <SelectItem value="24">24 Months</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.repayment_period && (
                        <p className="text-sm text-red-600">{errors.repayment_period}</p>
                      )}
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Loan Purpose</Label>
                    <Textarea
                      id="purpose"
                      value={data.purpose}
                      onChange={(e) => setData('purpose', e.target.value)}
                      placeholder="Describe the purpose of your loan"
                      rows={3}
                      required
                    />
                    {errors.purpose && (
                      <p className="text-sm text-red-600">{errors.purpose}</p>
                    )}
                  </div>

                  {/* Loan Calculator */}
                  {data.principal_amount && data.repayment_period && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-800">
                          <Calculator className="h-5 w-5" />
                          Loan Calculator
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <Label className="text-sm font-medium">Principal Amount</Label>
                            <div className="text-xl font-bold text-blue-600">
                              KSH {parseFloat(data.principal_amount).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-center">
                            <Label className="text-sm font-medium">Total Interest</Label>
                            <div className="text-xl font-bold text-orange-600">
                              KSH {calculatedInterest.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-center">
                            <Label className="text-sm font-medium">Total Repayment</Label>
                            <div className="text-xl font-bold text-green-600">
                              KSH {totalRepayment.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <Label className="text-sm font-medium">Monthly Payment</Label>
                          <div className="text-2xl font-bold text-purple-600">
                            KSH {monthlyPayment.toLocaleString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Separator />

                  {/* Guarantor Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Guarantor Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guarantor_name">Guarantor Name</Label>
                        <Input
                          id="guarantor_name"
                          value={data.guarantor_name}
                          onChange={(e) => setData('guarantor_name', e.target.value)}
                          placeholder="Full name"
                          required
                        />
                        {errors.guarantor_name && (
                          <p className="text-sm text-red-600">{errors.guarantor_name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guarantor_phone">Phone Number</Label>
                        <Input
                          id="guarantor_phone"
                          value={data.guarantor_phone}
                          onChange={(e) => setData('guarantor_phone', e.target.value)}
                          placeholder="Phone number"
                          required
                        />
                        {errors.guarantor_phone && (
                          <p className="text-sm text-red-600">{errors.guarantor_phone}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guarantor_relationship">Relationship</Label>
                        <Input
                          id="guarantor_relationship"
                          value={data.guarantor_relationship}
                          onChange={(e) => setData('guarantor_relationship', e.target.value)}
                          placeholder="e.g., Spouse, Parent"
                          required
                        />
                        {errors.guarantor_relationship && (
                          <p className="text-sm text-red-600">{errors.guarantor_relationship}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Collateral */}
                  <div className="space-y-2">
                    <Label htmlFor="collateral_description">Collateral Description (Optional)</Label>
                    <Textarea
                      id="collateral_description"
                      value={data.collateral_description}
                      onChange={(e) => setData('collateral_description', e.target.value)}
                      placeholder="Describe any collateral you can provide"
                      rows={3}
                    />
                    {errors.collateral_description && (
                      <p className="text-sm text-red-600">{errors.collateral_description}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button type="submit" disabled={processing} className="w-full md:w-auto">
                      {processing ? 'Submitting...' : 'Submit Loan Application'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Loan Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Loan Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Interest Rate</h4>
                <p className="text-sm text-muted-foreground">
                  2% monthly interest rate (24% annually)
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Eligibility Requirements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Minimum contribution of KSH 5,000</li>
                  <li>• No active loans in default</li>
                  <li>• Valid guarantor information</li>
                  <li>• Clear loan purpose</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Repayment</h4>
                <p className="text-sm text-muted-foreground">
                  Monthly payments are required. Late payments may result in additional fees and affect future loan eligibility.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
