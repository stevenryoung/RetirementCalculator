import { } from 'react';

const UserProfileForm = ({ userProfile, onUpdate, assumptions, onUpdateAssumptions }) => {
  const handleProfileChange = (field, value) => {
    onUpdate(prev => ({
      ...prev,
      [field]: field.includes('Age') || field.includes('Income') ? parseInt(value) || 0 : value
    }));
  };

  const handleAssumptionChange = (field, value) => {
    onUpdateAssumptions(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="currentAge">Current Age</label>
          <input
            type="number"
            id="currentAge"
            value={userProfile.currentAge}
            onChange={(e) => handleProfileChange('currentAge', e.target.value)}
            min="18"
            max="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="retirementAge">Planned Retirement Age</label>
          <input
            type="number"
            id="retirementAge"
            value={userProfile.retirementAge}
            onChange={(e) => handleProfileChange('retirementAge', e.target.value)}
            min="50"
            max="75"
          />
        </div>

        <div className="form-group">
          <label htmlFor="deathAge">Life Expectancy</label>
          <input
            type="number"
            id="deathAge"
            value={userProfile.deathAge}
            onChange={(e) => handleProfileChange('deathAge', e.target.value)}
            min="65"
            max="100"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="maritalStatus">Marital Status</label>
          <select
            id="maritalStatus"
            value={userProfile.maritalStatus}
            onChange={(e) => handleProfileChange('maritalStatus', e.target.value)}
          >
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
            <option value="marriedSeparate">Married Filing Separately</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="currentIncome">Current Annual Income</label>
          <input
            type="number"
            id="currentIncome"
            value={userProfile.currentIncome}
            onChange={(e) => handleProfileChange('currentIncome', e.target.value)}
            min="0"
            step="1000"
            placeholder="e.g., 75000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="averageIncome">Average Career Income (for Social Security)</label>
          <input
            type="number"
            id="averageIncome"
            value={userProfile.averageIncome}
            onChange={(e) => handleProfileChange('averageIncome', e.target.value)}
            min="0"
            step="1000"
            placeholder="e.g., 75000"
          />
        </div>
      </div>

      <h3>📈 Investment Assumptions</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="returnRate">Expected Annual Return</label>
          <input
            type="number"
            id="returnRate"
            value={(assumptions.returnRate * 100).toFixed(1)}
            onChange={(e) => handleAssumptionChange('returnRate', (parseFloat(e.target.value) || 0) / 100)}
            min="0"
            max="15"
            step="0.1"
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            Typical range: 6-8% for diversified portfolios
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="inflationRate">Expected Inflation Rate</label>
          <input
            type="number"
            id="inflationRate"
            value={(assumptions.inflationRate * 100).toFixed(1)}
            onChange={(e) => handleAssumptionChange('inflationRate', (parseFloat(e.target.value) || 0) / 100)}
            min="0"
            max="10"
            step="0.1"
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            Historical average: ~3%
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="taxRate">Expected Tax Rate in Retirement</label>
          <input
            type="number"
            id="taxRate"
            value={(assumptions.taxRate * 100).toFixed(0)}
            onChange={(e) => handleAssumptionChange('taxRate', (parseFloat(e.target.value) || 0) / 100)}
            min="0"
            max="50"
            step="1"
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            Your marginal tax rate in retirement
          </small>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;