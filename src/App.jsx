import { useState, useEffect } from 'react';
import UserProfileForm from './components/UserProfileForm';
import AccountManager from './components/AccountManager';
import RetirementResults from './components/RetirementResults';
import ProjectionChart from './components/ProjectionChart';
import { calculateRetirementIncome } from './utils/calculations';

function App() {
  const [userProfile, setUserProfile] = useState({
    currentAge: 30,
    retirementAge: 65,
    deathAge: 85,
    maritalStatus: 'single',
    currentIncome: 75000
  });

  const [accounts, setAccounts] = useState([]);
  
  const [assumptions, setAssumptions] = useState({
    returnRate: 0.07,
    inflationRate: 0.03
  });

  const [results, setResults] = useState(null);

  // Calculate results whenever inputs change
  useEffect(() => {
    if (accounts.length > 0 || userProfile.currentAge) {
      const calculatedResults = calculateRetirementIncome(accounts, userProfile, assumptions);
      setResults(calculatedResults);
    }
  }, [accounts, userProfile, assumptions]);

  const addAccount = (account) => {
    setAccounts(prev => [...prev, { ...account, id: Date.now() }]);
  };

  const updateAccount = (id, updatedAccount) => {
    setAccounts(prev => 
      prev.map(account => account.id === id ? { ...updatedAccount, id } : account)
    );
  };

  const removeAccount = (id) => {
    setAccounts(prev => prev.filter(account => account.id !== id));
  };

  return (
    <div className="retirement-calculator">
      <header>
        <h1>🏦 Retirement Planning Calculator</h1>
        <p>Plan your retirement with comprehensive account analysis for the United States</p>
      </header>

      <div className="section">
        <h2>👤 Personal Information</h2>
        <UserProfileForm 
          userProfile={userProfile} 
          onUpdate={setUserProfile}
          assumptions={assumptions}
          onUpdateAssumptions={setAssumptions}
        />
      </div>

      <div className="section">
        <h2>💰 Retirement Accounts</h2>
        <AccountManager
          accounts={accounts}
          onAddAccount={addAccount}
          onUpdateAccount={updateAccount}
          onRemoveAccount={removeAccount}
          userProfile={userProfile}
        />
      </div>

      {results && (
        <>
          <div className="section results-section">
            <h2>📊 Retirement Projection</h2>
            <RetirementResults 
              results={results} 
              userProfile={userProfile}
              accounts={accounts}
            />
          </div>

          <div className="section">
            <h2>📈 Growth Projection Chart</h2>
            <ProjectionChart
              accounts={accounts}
              userProfile={userProfile}
              assumptions={assumptions}
            />
          </div>
        </>
      )}

      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        <p>
          <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only. 
          Consult with a qualified financial advisor for personalized retirement planning advice.
        </p>
      </footer>
    </div>
  );
}

export default App;