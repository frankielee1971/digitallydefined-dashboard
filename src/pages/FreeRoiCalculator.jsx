import React, { useState } from "react";

const FreeRoiCalculator = () => {
  const [traffic, setTraffic] = useState(100);
  const [value, setValue] = useState(500);
  const [closeRate, setCloseRate] = useState(20);
  const [ppcCost, setPpcCost] = useState(25);

  // Basic free-version math
  const estimatedLeads = Math.round((traffic * closeRate) / 100);
  const estimatedRevenue = estimatedLeads * value;
  const estimatedSavings = Math.round(traffic * ppcCost);

  return (
    <div className="dd-card">
      <h2 className="dd-card-title">Free 10x ROI Calculator</h2>
      <p className="dd-card-body">
        A quick snapshot of the revenue potential of your digital property.
      </p>

      <div className="dd-calculator-grid">

        {/* TRAFFIC */}
        <div className="dd-calculator-control">
          <label>Monthly Traffic</label>
          <input
            type="range"
            min="50"
            max="2000"
            value={traffic}
            onChange={(e) => setTraffic(Number(e.target.value))}
          />
          <div>{traffic} visits</div>
        </div>

        {/* VALUE */}
        <div className="dd-calculator-control">
          <label>Avg Job Value</label>
          <input
            type="range"
            min="100"
            max="5000"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
          <div>${value}</div>
        </div>

        {/* CLOSE RATE */}
        <div className="dd-calculator-control">
          <label>Close Rate (%)</label>
          <input
            type="range"
            min="5"
            max="60"
            value={closeRate}
            onChange={(e) => setCloseRate(Number(e.target.value))}
          />
          <div>{closeRate}%</div>
        </div>

        {/* PPC COST */}
        <div className="dd-calculator-control">
          <label>Market PPC Cost</label>
          <input
            type="range"
            min="5"
            max="75"
            value={ppcCost}
            onChange={(e) => setPpcCost(Number(e.target.value))}
          />
          <div>${ppcCost} per click</div>
        </div>
      </div>

      {/* RESULTS */}
      <div className="dd-calculator-results">
        <h3>Estimated Monthly Impact</h3>
        <p><strong>Leads:</strong> {estimatedLeads}</p>
        <p><strong>Revenue:</strong> ${estimatedRevenue.toLocaleString()}</p>
        <p><strong>PPC Savings:</strong> ${estimatedSavings.toLocaleString()}</p>
      </div>

      {/* CTA */}
      <div className="dd-calculator-cta">
        <a href="/tools/roi-calculator" className="dd-button-primary">
          Unlock the Full Calculator →
        </a>
      </div>
    </div>
  );
};

export default FreeRoiCalculator;
