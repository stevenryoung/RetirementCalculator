# 🏦 Retirement Planning Calculator

A comprehensive web application for retirement planning in the United States. This calculator helps you plan your retirement by analyzing multiple account types, projecting growth, and providing detailed insights into your retirement readiness.

![Retirement Calculator Screenshot](https://github.com/user-attachments/assets/e63f406b-17ce-4d18-b045-7d871c1575c9)

## 🌟 Features

### Comprehensive Account Support
- **Traditional 401(k)** - Tax-deferred employer-sponsored retirement accounts
- **Roth 401(k)** - After-tax employer-sponsored retirement accounts  
- **Traditional IRA** - Tax-deferred individual retirement accounts
- **Roth IRA** - After-tax individual retirement accounts
- **HSA (Health Savings Account)** - Triple tax-advantaged health accounts
- **Pensions** - Defined benefit retirement plans
- **Social Security** - Government retirement benefits
- **Taxable Investment Accounts** - Regular investment accounts

### Personal Information & Assumptions
- Age-based planning (current age, retirement age, life expectancy)
- Marital status consideration for tax calculations
- Income tracking for Social Security benefit estimation
- Customizable investment assumptions (return rate, inflation, taxes)

### Advanced Calculations
- **Compound Growth Projections** - Accurate future value calculations with monthly contributions
- **Required Minimum Distributions (RMDs)** - Automatic RMD calculations for tax-deferred accounts
- **Contribution Limits** - 2024 IRS contribution limits with age-based catch-up contributions
- **Tax Considerations** - Federal tax bracket calculations and retirement tax planning
- **4% Withdrawal Rule** - Safe withdrawal rate calculations for retirement income

### Interactive Features
- **Dynamic Account Management** - Add, edit, and remove retirement accounts
- **Real-time Calculations** - Instant updates as you modify inputs
- **Visual Projections** - Interactive charts showing portfolio growth over time
- **Retirement Readiness Assessment** - Color-coded status indicators
- **Detailed Insights** - Comprehensive analysis and recommendations

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/stevenryoung/RetirementCalculator.git
cd RetirementCalculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📊 How It Works

### 1. Personal Information Setup
Enter your basic information including current age, planned retirement age, life expectancy, marital status, and income details.

### 2. Investment Assumptions
Set your expected annual return rate, inflation rate, and expected tax rate in retirement. The calculator provides reasonable defaults based on historical data.

### 3. Account Management
Add your retirement accounts with current balances, annual contributions, and employer matches. The calculator automatically applies current IRS contribution limits.

### 4. Retirement Projections
View comprehensive projections including:
- Total portfolio value at retirement
- Annual and monthly retirement income
- Income replacement percentage
- Account-by-account breakdowns

### 5. Growth Visualization
Interactive charts show your portfolio growth over time, with separate visualization for different account types and total portfolio value.

## 🧮 Calculation Methodology

### Compound Growth
The calculator uses the compound interest formula with monthly contributions:
```
FV = PV × (1 + r)^n + PMT × [((1 + r/12)^(n×12) - 1) / (r/12)]
```

### Required Minimum Distributions
For traditional 401(k) and IRA accounts, RMDs are calculated starting at age 72 using IRS life expectancy tables.

### Tax Calculations
Federal income tax calculations use 2024 tax brackets for both single and married filing jointly status.

### Social Security Benefits
Simplified Social Security benefit calculations based on average indexed monthly earnings and claiming age.

## 🎯 Key Features Explained

### Account Types

| Account Type | Tax Treatment | Contribution Limits (2024) | Special Features |
|-------------|---------------|---------------------------|------------------|
| Traditional 401(k) | Tax-deferred | $23,000 (+$7,500 catch-up) | Employer match, RMDs at 72 |
| Roth 401(k) | After-tax | $23,000 (+$7,500 catch-up) | Tax-free growth, employer match |
| Traditional IRA | Tax-deferred | $7,000 (+$1,000 catch-up) | RMDs at 72 |
| Roth IRA | After-tax | $7,000 (+$1,000 catch-up) | Tax-free growth, no RMDs |
| HSA | Triple tax-advantaged | $4,300 (+$1,000 catch-up at 55) | Medical expenses, retirement account after 65 |

### Retirement Readiness Assessment

- **Excellent (Green)**: 80%+ income replacement
- **Good (Orange)**: 60-79% income replacement  
- **Fair (Yellow)**: 40-59% income replacement
- **Needs Work (Red)**: <40% income replacement

## 🛠 Technology Stack

- **Frontend**: React 18 with modern hooks
- **Build Tool**: Vite for fast development and building
- **Charts**: Recharts for interactive data visualization
- **Icons**: Lucide React for clean, modern icons
- **Styling**: CSS with CSS custom properties for theming
- **Development**: ESLint for code quality

## 📝 Important Disclaimers

⚠️ **This calculator provides estimates for educational purposes only.**

- Projections are based on your inputs and assumptions
- Actual investment returns may vary significantly from projections
- Inflation will reduce purchasing power over time
- Tax laws and contribution limits may change
- Consider consulting with a qualified financial advisor for personalized advice

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔮 Future Enhancements

- State and local tax calculations
- More sophisticated Social Security benefit calculations
- Monte Carlo simulations for risk analysis
- Estate planning considerations
- International retirement account support
- Data persistence and user accounts
- Mobile app version