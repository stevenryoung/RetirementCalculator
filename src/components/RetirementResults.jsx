import { } from 'react';
import { ACCOUNT_TYPES } from '../utils/calculations';

const RetirementResults = ({ results, userProfile, accounts }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const yearsToRetirement = userProfile.retirementAge - userProfile.currentAge;
  const yearsInRetirement = userProfile.deathAge - userProfile.retirementAge;

  // Calculate account type summaries
  const accountSummary = accounts.reduce((summary, account) => {
    const type = account.type;
    if (!summary[type]) {
      summary[type] = { balance: 0, contribution: 0, count: 0 };
    }
    summary[type].balance += account.currentBalance || 0;
    summary[type].contribution += account.annualContribution || 0;
    summary[type].count += 1;
    return summary;
  }, {});

  const accountTypeLabels = {
    [ACCOUNT_TYPES.TRADITIONAL_401K]: '401(k) Traditional',
    [ACCOUNT_TYPES.ROTH_401K]: '401(k) Roth',
    [ACCOUNT_TYPES.TRADITIONAL_IRA]: 'IRA Traditional',
    [ACCOUNT_TYPES.ROTH_IRA]: 'IRA Roth',
    [ACCOUNT_TYPES.HSA]: 'HSA',
    [ACCOUNT_TYPES.PENSION]: 'Pension',
    [ACCOUNT_TYPES.SOCIAL_SECURITY]: 'Social Security',
    [ACCOUNT_TYPES.TAXABLE]: 'Taxable Accounts'
  };

  // Calculate replacement ratio
  const replacementRatio = results.totalAnnualIncome / userProfile.currentIncome;
  const replacementPercentage = (replacementRatio * 100).toFixed(1);

  // Retirement readiness assessment
  const getReadinessAssessment = () => {
    if (replacementRatio >= 0.8) {
      return { status: 'excellent', color: '#28a745', message: 'Excellent! You\'re on track for a comfortable retirement.' };
    } else if (replacementRatio >= 0.6) {
      return { status: 'good', color: '#fd7e14', message: 'Good progress! Consider increasing contributions if possible.' };
    } else if (replacementRatio >= 0.4) {
      return { status: 'fair', color: '#ffc107', message: 'Fair start. You may want to increase savings significantly.' };
    } else {
      return { status: 'needs-work', color: '#dc3545', message: 'Consider significantly increasing your retirement savings.' };
    }
  };

  const assessment = getReadinessAssessment();

  return (
    <div>
      <div style={{ 
        background: assessment.color, 
        color: 'white', 
        padding: '15px', 
        borderRadius: '6px', 
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>
          Retirement Readiness: {assessment.status.replace('-', ' ').toUpperCase()}
        </h3>
        <p style={{ margin: 0 }}>{assessment.message}</p>
      </div>

      <div className="results-grid">
        <div className="result-item">
          <h3>Total at Retirement</h3>
          <div className="result-value">{formatCurrency(results.totalBalance)}</div>
          <small>{yearsToRetirement} years from now</small>
        </div>

        <div className="result-item">
          <h3>Annual Income</h3>
          <div className="result-value">{formatCurrency(results.totalAnnualIncome)}</div>
          <small>From all sources</small>
        </div>

        <div className="result-item">
          <h3>Monthly Income</h3>
          <div className="result-value">{formatCurrency(results.monthlyIncome)}</div>
          <small>Available each month</small>
        </div>

        <div className="result-item">
          <h3>Income Replacement</h3>
          <div className="result-value">{replacementPercentage}%</div>
          <small>Of current income</small>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>💰 Income Breakdown</h3>
        <div className="results-grid">
          <div className="result-item">
            <h3>Investment Withdrawals</h3>
            <div className="result-value">{formatCurrency(results.safeWithdrawalAmount)}</div>
            <small>4% withdrawal rule</small>
          </div>

          <div className="result-item">
            <h3>Guaranteed Income</h3>
            <div className="result-value">{formatCurrency(results.annualIncomeStreams)}</div>
            <small>Pensions & Social Security</small>
          </div>
        </div>
      </div>

      {Object.keys(accountSummary).length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>📈 Account Summary</h3>
          <div className="account-list">
            {Object.entries(accountSummary).map(([type, data]) => (
              <div key={type} className="account-item">
                <h4>{accountTypeLabels[type]} ({data.count})</h4>
                <p><strong>Current Balance:</strong> {formatCurrency(data.balance)}</p>
                <p><strong>Annual Contributions:</strong> {formatCurrency(data.contribution)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '20px', background: '#e3f2fd', borderRadius: '6px' }}>
        <h3>📋 Key Insights</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>You have <strong>{yearsToRetirement} years</strong> until retirement</li>
          <li>Your retirement phase will last approximately <strong>{yearsInRetirement} years</strong></li>
          <li>You'll replace <strong>{replacementPercentage}%</strong> of your current income</li>
          <li>
            Safe withdrawal amount assumes a <strong>4% withdrawal rate</strong> from investment accounts
          </li>
          {results.totalBalance > 1000000 && (
            <li>🎉 Congratulations! You're projected to be a retirement millionaire!</li>
          )}
          {replacementRatio < 0.7 && (
            <li>💡 Consider increasing contributions or delaying retirement to improve your outcome</li>
          )}
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '6px', fontSize: '14px' }}>
        <strong>Important Notes:</strong>
        <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
          <li>These projections are estimates based on your inputs and assumptions</li>
          <li>Actual returns may vary significantly from projected returns</li>
          <li>Inflation will reduce purchasing power over time</li>
          <li>Tax laws and contribution limits may change</li>
          <li>Consider consulting with a financial advisor for personalized advice</li>
        </ul>
      </div>
    </div>
  );
};

export default RetirementResults;