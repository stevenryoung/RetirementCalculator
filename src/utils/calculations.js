// Retirement calculation utilities

// Account types
export const ACCOUNT_TYPES = {
  TRADITIONAL_401K: 'traditional_401k',
  ROTH_401K: 'roth_401k',
  TRADITIONAL_IRA: 'traditional_ira',
  ROTH_IRA: 'roth_ira',
  HSA: 'hsa',
  PENSION: 'pension',
  SOCIAL_SECURITY: 'social_security',
  TAXABLE: 'taxable'
};

// 2024 contribution limits
export const CONTRIBUTION_LIMITS = {
  [ACCOUNT_TYPES.TRADITIONAL_401K]: { base: 23000, catchup: 7500, catchupAge: 50 },
  [ACCOUNT_TYPES.ROTH_401K]: { base: 23000, catchup: 7500, catchupAge: 50 },
  [ACCOUNT_TYPES.TRADITIONAL_IRA]: { base: 7000, catchup: 1000, catchupAge: 50 },
  [ACCOUNT_TYPES.ROTH_IRA]: { base: 7000, catchup: 1000, catchupAge: 50 },
  [ACCOUNT_TYPES.HSA]: { 
    single: { base: 4300, catchup: 1000, catchupAge: 55 },
    family: { base: 8550, catchup: 1000, catchupAge: 55 }
  }
};

// Tax brackets for 2024 (simplified)
export const TAX_BRACKETS_2024 = {
  single: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 }
  ],
  marriedJoint: [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 }
  ]
};

// Calculate federal income tax
export function calculateFederalTax(income, filingStatus = 'single') {
  const brackets = TAX_BRACKETS_2024[filingStatus] || TAX_BRACKETS_2024.single;
  let tax = 0;
  let remainingIncome = income;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    
    const taxableAtThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableAtThisBracket * bracket.rate;
    remainingIncome -= taxableAtThisBracket;
  }

  return tax;
}

// Calculate compound growth
export function calculateCompoundGrowth(principal, rate, years, monthlyContribution = 0) {
  if (monthlyContribution === 0) {
    return principal * Math.pow(1 + rate, years);
  }
  
  // Future value of annuity plus compound interest on principal
  const monthlyRate = rate / 12;
  const months = years * 12;
  
  const futureValuePrincipal = principal * Math.pow(1 + rate, years);
  const futureValueAnnuity = monthlyContribution * 
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  
  return futureValuePrincipal + futureValueAnnuity;
}

// Calculate required minimum distribution (RMD)
export function calculateRMD(accountBalance, age) {
  // Simplified RMD calculation based on IRS life expectancy tables
  const lifeExpectancyFactors = {
    72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0,
    79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0,
    86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8,
    93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4
  };
  
  if (age < 72) return 0;
  
  const factor = lifeExpectancyFactors[Math.min(age, 100)] || 6.4;
  return accountBalance / factor;
}

// Calculate Social Security benefits (simplified)
export function calculateSocialSecurityBenefit(averageIndexedMonthlyEarnings, claimAge = 67) {
  // Simplified calculation - actual calculation is much more complex
  const fullRetirementAge = 67;
  const primaryInsuranceAmount = Math.min(
    averageIndexedMonthlyEarnings * 0.9 * 12, // 90% of first $1,174/month
    44000 // Approximate maximum benefit
  );
  
  // Adjustment for claiming age
  let adjustmentFactor = 1.0;
  if (claimAge < fullRetirementAge) {
    adjustmentFactor = 0.75 + (claimAge - 62) * 0.05; // Simplified early retirement reduction
  } else if (claimAge > fullRetirementAge) {
    adjustmentFactor = 1.0 + (claimAge - fullRetirementAge) * 0.08; // Delayed retirement credit
  }
  
  return primaryInsuranceAmount * adjustmentFactor;
}

// Calculate portfolio withdrawal using 4% rule
export function calculateSafeWithdrawalAmount(portfolioValue, withdrawalRate = 0.04) {
  return portfolioValue * withdrawalRate;
}

// Project account balance over time
export function projectAccountBalance(account, currentAge, projectionYears, assumptions) {
  const projections = [];
  let balance = account.currentBalance;
  
  for (let year = 0; year <= projectionYears; year++) {
    const age = currentAge + year;
    const contributionLimit = getContributionLimit(account.type, age, account.hsaType);
    const annualContribution = Math.min(account.annualContribution || 0, contributionLimit);
    
    // Add contribution at beginning of year
    balance += annualContribution;
    
    // Apply growth
    balance *= (1 + (assumptions.returnRate || 0.07));
    
    // Handle RMDs for tax-deferred accounts
    if (account.type === ACCOUNT_TYPES.TRADITIONAL_401K || 
        account.type === ACCOUNT_TYPES.TRADITIONAL_IRA) {
      const rmd = calculateRMD(balance, age);
      balance -= rmd;
    }
    
    projections.push({
      year: year,
      age: age,
      balance: Math.max(0, balance),
      contribution: annualContribution,
      rmd: age >= 72 ? calculateRMD(balance + (age >= 72 ? 0 : 0), age) : 0
    });
  }
  
  return projections;
}

// Get contribution limit for account type and age
export function getContributionLimit(accountType, age, hsaType = 'single') {
  const limits = CONTRIBUTION_LIMITS[accountType];
  if (!limits) return 0;
  
  // Handle HSA special case with family/single distinction
  if (accountType === ACCOUNT_TYPES.HSA) {
    const hsaLimits = limits[hsaType] || limits.single;
    return age >= hsaLimits.catchupAge ? hsaLimits.base + hsaLimits.catchup : hsaLimits.base;
  }
  
  const baseLimit = limits.base;
  const catchupAge = limits.catchupAge;
  const catchupAmount = limits.catchup;
  
  return age >= catchupAge ? baseLimit + catchupAmount : baseLimit;
}

// Calculate total retirement income
export function calculateRetirementIncome(accounts, userProfile, assumptions) {
  const retirementAge = userProfile.retirementAge || 65;
  const currentAge = userProfile.currentAge || 30;
  const yearsToRetirement = retirementAge - currentAge;
  
  let totalRetirementBalance = 0;
  let annualIncomeStreams = 0;
  
  accounts.forEach(account => {
    const projections = projectAccountBalance(account, currentAge, yearsToRetirement, assumptions);
    const balanceAtRetirement = projections[projections.length - 1]?.balance || 0;
    
    if (account.type === ACCOUNT_TYPES.PENSION) {
      annualIncomeStreams += account.monthlyBenefit * 12;
    } else if (account.type === ACCOUNT_TYPES.SOCIAL_SECURITY) {
      const ssaBenefit = calculateSocialSecurityBenefit(
        userProfile.currentIncome / 12, 
        retirementAge
      );
      annualIncomeStreams += ssaBenefit;
    } else {
      totalRetirementBalance += balanceAtRetirement;
    }
  });
  
  const safeWithdrawalAmount = calculateSafeWithdrawalAmount(totalRetirementBalance);
  const totalAnnualIncome = safeWithdrawalAmount + annualIncomeStreams;
  
  return {
    totalBalance: totalRetirementBalance,
    safeWithdrawalAmount,
    annualIncomeStreams,
    totalAnnualIncome,
    monthlyIncome: totalAnnualIncome / 12
  };
}