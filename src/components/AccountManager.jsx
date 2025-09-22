import { useState } from 'react';
import { ACCOUNT_TYPES, getContributionLimit } from '../utils/calculations';
import { Plus, Trash2, Edit3 } from 'lucide-react';

const AccountManager = ({ accounts, onAddAccount, onUpdateAccount, onRemoveAccount, userProfile }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    type: ACCOUNT_TYPES.TRADITIONAL_401K,
    name: '',
    currentBalance: 0,
    annualContribution: 0,
    employerMatch: 0,
    monthlyBenefit: 0, // For pensions
    description: ''
  });

  const accountTypeLabels = {
    [ACCOUNT_TYPES.TRADITIONAL_401K]: '401(k) Traditional',
    [ACCOUNT_TYPES.ROTH_401K]: '401(k) Roth',
    [ACCOUNT_TYPES.TRADITIONAL_IRA]: 'IRA Traditional',
    [ACCOUNT_TYPES.ROTH_IRA]: 'IRA Roth',
    [ACCOUNT_TYPES.HSA]: 'Health Savings Account (HSA)',
    [ACCOUNT_TYPES.PENSION]: 'Pension',
    [ACCOUNT_TYPES.SOCIAL_SECURITY]: 'Social Security',
    [ACCOUNT_TYPES.TAXABLE]: 'Taxable Investment Account'
  };

  const resetForm = () => {
    setNewAccount({
      type: ACCOUNT_TYPES.TRADITIONAL_401K,
      name: '',
      currentBalance: 0,
      annualContribution: 0,
      employerMatch: 0,
      monthlyBenefit: 0,
      description: ''
    });
    setEditingAccount(null);
    setShowAddForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const accountData = {
      ...newAccount,
      currentBalance: parseFloat(newAccount.currentBalance) || 0,
      annualContribution: parseFloat(newAccount.annualContribution) || 0,
      employerMatch: parseFloat(newAccount.employerMatch) || 0,
      monthlyBenefit: parseFloat(newAccount.monthlyBenefit) || 0
    };

    if (editingAccount) {
      onUpdateAccount(editingAccount.id, accountData);
    } else {
      onAddAccount(accountData);
    }
    
    resetForm();
  };

  const startEdit = (account) => {
    setNewAccount(account);
    setEditingAccount(account);
    setShowAddForm(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getContributionLimitInfo = (accountType) => {
    const limit = getContributionLimit(accountType, userProfile.currentAge);
    return limit > 0 ? `(Limit: ${formatCurrency(limit)})` : '';
  };

  const isPensionOrSS = (type) => 
    type === ACCOUNT_TYPES.PENSION || type === ACCOUNT_TYPES.SOCIAL_SECURITY;

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Your Accounts ({accounts.length})</h3>
        <button 
          className="button"
          onClick={() => setShowAddForm(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          Add Account
        </button>
      </div>

      {accounts.length === 0 && !showAddForm && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          color: '#666'
        }}>
          <p>No retirement accounts added yet.</p>
          <p>Click "Add Account" to get started with your retirement planning.</p>
        </div>
      )}

      <div className="account-list">
        {accounts.map((account) => (
          <div key={account.id} className="account-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h4>{account.name || accountTypeLabels[account.type]}</h4>
                <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                  {accountTypeLabels[account.type]}
                </p>
                
                {!isPensionOrSS(account.type) && (
                  <>
                    <p style={{ margin: '5px 0' }}>
                      <strong>Balance:</strong> {formatCurrency(account.currentBalance)}
                    </p>
                    <p style={{ margin: '5px 0' }}>
                      <strong>Annual Contribution:</strong> {formatCurrency(account.annualContribution)}
                    </p>
                    {account.employerMatch > 0 && (
                      <p style={{ margin: '5px 0' }}>
                        <strong>Employer Match:</strong> {formatCurrency(account.employerMatch)}
                      </p>
                    )}
                  </>
                )}

                {isPensionOrSS(account.type) && account.monthlyBenefit > 0 && (
                  <p style={{ margin: '5px 0' }}>
                    <strong>Monthly Benefit:</strong> {formatCurrency(account.monthlyBenefit)}
                  </p>
                )}

                {account.description && (
                  <p style={{ margin: '5px 0', fontSize: '12px', color: '#888' }}>
                    {account.description}
                  </p>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => startEdit(account)}
                  className="button secondary"
                  style={{ padding: '6px', minWidth: 'auto' }}
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => onRemoveAccount(account.id)}
                  className="button secondary"
                  style={{ padding: '6px', minWidth: 'auto', background: '#dc3545' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="account-item" style={{ marginTop: '20px', border: '2px solid #007bff' }}>
          <h4>{editingAccount ? 'Edit Account' : 'Add New Account'}</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Account Type</label>
                <select
                  value={newAccount.type}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, type: e.target.value }))}
                  required
                >
                  {Object.entries(accountTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Account Name (Optional)</label>
                <input
                  type="text"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Fidelity 401k, Wells Fargo IRA"
                />
              </div>
            </div>

            {!isPensionOrSS(newAccount.type) && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Current Balance</label>
                    <input
                      type="number"
                      value={newAccount.currentBalance}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, currentBalance: e.target.value }))}
                      min="0"
                      step="100"
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Annual Contribution {getContributionLimitInfo(newAccount.type)}
                    </label>
                    <input
                      type="number"
                      value={newAccount.annualContribution}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, annualContribution: e.target.value }))}
                      min="0"
                      step="100"
                      placeholder="0"
                    />
                  </div>
                </div>

                {(newAccount.type.includes('401k') || newAccount.type === ACCOUNT_TYPES.HSA) && (
                  <div className="form-group">
                    <label>Employer Match (Annual)</label>
                    <input
                      type="number"
                      value={newAccount.employerMatch}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, employerMatch: e.target.value }))}
                      min="0"
                      step="100"
                      placeholder="0"
                    />
                  </div>
                )}
              </>
            )}

            {isPensionOrSS(newAccount.type) && (
              <div className="form-group">
                <label>Expected Monthly Benefit</label>
                <input
                  type="number"
                  value={newAccount.monthlyBenefit}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, monthlyBenefit: e.target.value }))}
                  min="0"
                  step="100"
                  placeholder="0"
                />
              </div>
            )}

            <div className="form-group">
              <label>Description (Optional)</label>
              <input
                type="text"
                value={newAccount.description}
                onChange={(e) => setNewAccount(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional notes about this account"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="button">
                {editingAccount ? 'Update Account' : 'Add Account'}
              </button>
              <button 
                type="button" 
                className="button secondary" 
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountManager;