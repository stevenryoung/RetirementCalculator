import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { projectAccountBalance, ACCOUNT_TYPES } from '../utils/calculations';

const ProjectionChart = ({ accounts, userProfile, assumptions }) => {
  const chartData = useMemo(() => {
    const currentAge = userProfile.currentAge;
    const retirementAge = userProfile.retirementAge;
    const deathAge = userProfile.deathAge;
    const projectionYears = deathAge - currentAge;

    // Create data points for each year
    const data = [];
    
    for (let year = 0; year <= projectionYears; year++) {
      const age = currentAge + year;
      const dataPoint = {
        year,
        age,
        totalBalance: 0,
        traditional401k: 0,
        roth401k: 0,
        traditionalIRA: 0,
        rothIRA: 0,
        hsa: 0,
        taxable: 0,
        isRetired: age >= retirementAge
      };

      // Calculate projections for each account
      accounts.forEach(account => {
        if (account.type === ACCOUNT_TYPES.PENSION || account.type === ACCOUNT_TYPES.SOCIAL_SECURITY) {
          return; // Skip income-based accounts for balance projections
        }

        const projections = projectAccountBalance(account, currentAge, projectionYears, assumptions);
        const yearProjection = projections[year];
        
        if (yearProjection) {
          const balance = yearProjection.balance;
          dataPoint.totalBalance += balance;

          // Add to specific account type
          switch (account.type) {
            case ACCOUNT_TYPES.TRADITIONAL_401K:
              dataPoint.traditional401k += balance;
              break;
            case ACCOUNT_TYPES.ROTH_401K:
              dataPoint.roth401k += balance;
              break;
            case ACCOUNT_TYPES.TRADITIONAL_IRA:
              dataPoint.traditionalIRA += balance;
              break;
            case ACCOUNT_TYPES.ROTH_IRA:
              dataPoint.rothIRA += balance;
              break;
            case ACCOUNT_TYPES.HSA:
              dataPoint.hsa += balance;
              break;
            case ACCOUNT_TYPES.TAXABLE:
              dataPoint.taxable += balance;
              break;
          }
        }
      });

      data.push(dataPoint);
    }

    return data;
  }, [accounts, userProfile, assumptions]);

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatTooltipCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip" style={{
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
            Age {data.age} ({data.isRetired ? 'Retired' : 'Working'})
          </p>
          <p style={{ margin: '0 0 5px 0', color: '#28a745' }}>
            Total: {formatTooltipCurrency(data.totalBalance)}
          </p>
          {payload.map((entry, index) => {
            if (entry.dataKey === 'totalBalance') return null;
            return (
              <p key={index} style={{ margin: '0 0 2px 0', color: entry.color, fontSize: '12px' }}>
                {entry.name}: {formatTooltipCurrency(entry.value)}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Find retirement point for reference line
  const retirementYear = userProfile.retirementAge - userProfile.currentAge;

  return (
    <div>
      <div className="chart-container">
        <h3>Portfolio Growth Over Time</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="age" 
              type="number"
              domain={['dataMin', 'dataMax']}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Retirement line */}
            <Line 
              type="monotone" 
              dataKey={() => null}
              stroke="red" 
              strokeDasharray="5 5"
              dot={false}
              name="Retirement"
            />
            
            <Area
              type="monotone"
              dataKey="traditional401k"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
              name="Traditional 401(k)"
            />
            <Area
              type="monotone"
              dataKey="roth401k"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
              name="Roth 401(k)"
            />
            <Area
              type="monotone"
              dataKey="traditionalIRA"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
              fillOpacity={0.6}
              name="Traditional IRA"
            />
            <Area
              type="monotone"
              dataKey="rothIRA"
              stackId="1"
              stroke="#ff7300"
              fill="#ff7300"
              fillOpacity={0.6}
              name="Roth IRA"
            />
            <Area
              type="monotone"
              dataKey="hsa"
              stackId="1"
              stroke="#00ff00"
              fill="#00ff00"
              fillOpacity={0.6}
              name="HSA"
            />
            <Area
              type="monotone"
              dataKey="taxable"
              stackId="1"
              stroke="#ff0000"
              fill="#ff0000"
              fillOpacity={0.6}
              name="Taxable"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container" style={{ marginTop: '20px' }}>
        <h3>Total Portfolio Value</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="age" 
              type="number"
              domain={['dataMin', 'dataMax']}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Line 
              type="monotone" 
              dataKey="totalBalance" 
              stroke="#2563eb" 
              strokeWidth={3}
              dot={false}
              name="Total Portfolio"
            />
            
            {/* Add retirement milestone line */}
            {chartData[retirementYear] && (
              <Line
                type="monotone"
                dataKey={() => chartData[retirementYear].totalBalance}
                stroke="red"
                strokeDasharray="5 5"
                dot={false}
                name={`Retirement (Age ${userProfile.retirementAge})`}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <div className="result-item">
          <h3>At Retirement (Age {userProfile.retirementAge})</h3>
          <div className="result-value">
            {formatTooltipCurrency(chartData[retirementYear]?.totalBalance || 0)}
          </div>
        </div>
        
        <div className="result-item">
          <h3>Peak Portfolio Value</h3>
          <div className="result-value">
            {formatTooltipCurrency(Math.max(...chartData.map(d => d.totalBalance)))}
          </div>
        </div>

        <div className="result-item">
          <h3>Final Balance (Age {userProfile.deathAge})</h3>
          <div className="result-value">
            {formatTooltipCurrency(chartData[chartData.length - 1]?.totalBalance || 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectionChart;