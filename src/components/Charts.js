import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, BoxPlot, BarChart, Bar, ComposedChart, Area, AreaChart } from 'recharts';

const RoadSafetyCharts = () => {
  const [activeChart, setActiveChart] = useState('trends');

  // Your data
  const data = [
    {year: 2000, yearIndex: 0, freeways_collision: 20531, freeways_rate: 0.6, kings_collision: 11879, kings_rate: 0.7, secondary_collision: 953, secondary_rate: 1.1},
    {year: 2001, yearIndex: 1, freeways_collision: 18947, freeways_rate: 0.6, kings_collision: 11924, kings_rate: 0.7, secondary_collision: 947, secondary_rate: 1.1},
    {year: 2002, yearIndex: 2, freeways_collision: 20347, freeways_rate: 0.6, kings_collision: 13441, kings_rate: 0.8, secondary_collision: 1074, secondary_rate: 1.2},
    {year: 2003, yearIndex: 3, freeways_collision: 22467, freeways_rate: 0.6, kings_collision: 13405, kings_rate: 0.8, secondary_collision: 1107, secondary_rate: 1.3},
    {year: 2004, yearIndex: 4, freeways_collision: 21360, freeways_rate: 0.6, kings_collision: 13104, kings_rate: 0.8, secondary_collision: 1016, secondary_rate: 1.2},
    {year: 2005, yearIndex: 5, freeways_collision: 21625, freeways_rate: 0.6, kings_collision: 12937, kings_rate: 0.8, secondary_collision: 973, secondary_rate: 1.1},
    {year: 2006, yearIndex: 6, freeways_collision: 19385, freeways_rate: 0.5, kings_collision: 12382, kings_rate: 0.7, secondary_collision: 1015, secondary_rate: 1.2},
    {year: 2007, yearIndex: 7, freeways_collision: 22149, freeways_rate: 0.6, kings_collision: 12783, kings_rate: 0.7, secondary_collision: 1022, secondary_rate: 1.2},
    {year: 2008, yearIndex: 8, freeways_collision: 21936, freeways_rate: 0.6, kings_collision: 12344, kings_rate: 0.7, secondary_collision: 918, secondary_rate: 1.2},
    {year: 2009, yearIndex: 9, freeways_collision: 19755, freeways_rate: 0.5, kings_collision: 11093, kings_rate: 0.7, secondary_collision: 824, secondary_rate: 1.0},
    {year: 2010, yearIndex: 10, freeways_collision: 18870, freeways_rate: 0.5, kings_collision: 10394, kings_rate: 0.6, secondary_collision: 828, secondary_rate: 1.0},
    {year: 2011, yearIndex: 11, freeways_collision: 20900, freeways_rate: 0.5, kings_collision: 11370, kings_rate: 0.7, secondary_collision: 873, secondary_rate: 1.1},
    {year: 2012, yearIndex: 12, freeways_collision: 18982, freeways_rate: 0.5, kings_collision: 11076, kings_rate: 0.6, secondary_collision: 945, secondary_rate: 1.3},
    {year: 2013, yearIndex: 13, freeways_collision: 22348, freeways_rate: 0.6, kings_collision: 12015, kings_rate: 0.7, secondary_collision: 896, secondary_rate: 1.1},
    {year: 2014, yearIndex: 14, freeways_collision: 23143, freeways_rate: 0.6, kings_collision: 11250, kings_rate: 0.6, secondary_collision: 765, secondary_rate: 1.0},
    {year: 2015, yearIndex: 15, freeways_collision: 22711, freeways_rate: 0.5, kings_collision: 10300, kings_rate: 0.6, secondary_collision: 773, secondary_rate: 1.0},
    {year: 2016, yearIndex: 16, freeways_collision: 23528, freeways_rate: 0.6, kings_collision: 10900, kings_rate: 0.6, secondary_collision: 815, secondary_rate: 1.0},
    {year: 2017, yearIndex: 17, freeways_collision: 24442, freeways_rate: 0.6, kings_collision: 11083, kings_rate: 0.6, secondary_collision: 757, secondary_rate: 1.0},
    {year: 2018, yearIndex: 18, freeways_collision: 25826, freeways_rate: 0.6, kings_collision: 11341, kings_rate: 0.6, secondary_collision: 821, secondary_rate: 0.9},
    {year: 2019, yearIndex: 19, freeways_collision: 26688, freeways_rate: 0.6, kings_collision: 11747, kings_rate: 0.6, secondary_collision: 755, secondary_rate: 0.9}
  ];

  // Create box plot data
  const boxPlotData = [
    {
      name: 'Freeways',
      mean: 0.57,
      q1: 0.5,
      median: 0.6,
      q3: 0.6,
      min: 0.5,
      max: 0.6,
      values: data.map(d => d.freeways_rate)
    },
    {
      name: "King's Highways",
      mean: 0.68,
      q1: 0.6,
      median: 0.7,
      q3: 0.7,
      min: 0.6,
      max: 0.8,
      values: data.map(d => d.kings_rate)
    },
    {
      name: 'Secondary Highways',
      mean: 1.095,
      q1: 1.0,
      median: 1.1,
      q3: 1.2,
      min: 0.9,
      max: 1.3,
      values: data.map(d => d.secondary_rate)
    }
  ];

  // Linear regression calculation for freeway rates
  const n = data.length;
  const sumX = data.reduce((sum, d) => sum + d.yearIndex, 0);
  const sumY = data.reduce((sum, d) => sum + d.freeways_rate, 0);
  const sumXY = data.reduce((sum, d) => sum + d.yearIndex * d.freeways_rate, 0);
  const sumX2 = data.reduce((sum, d) => sum + d.yearIndex * d.yearIndex, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const regressionData = data.map(d => ({
    ...d,
    regression: intercept + slope * d.yearIndex
  }));

  const chartButtons = [
    { id: 'trends', label: 'Collision Rate Trends' },
    { id: 'counts', label: 'Collision Count Trends' },
    { id: 'regression', label: 'Freeway Rate with Regression' },
    { id: 'scatter', label: 'Freeway Counts vs Rates' },
    { id: 'comparison', label: 'Rate Comparison' },
    { id: 'boxplot', label: 'Rate Distribution' },
    { id: 'combined', label: 'Combined Analysis' }
  ];

  const renderChart = () => {
    switch(activeChart) {
      case 'trends':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Collision Rates Over Time (2000-2019)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Collision Rate (per MVKM)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="freeways_rate" stroke="#2563eb" strokeWidth={2} name="Freeways" />
                <Line type="monotone" dataKey="kings_rate" stroke="#dc2626" strokeWidth={2} name="King's Highways" />
                <Line type="monotone" dataKey="secondary_rate" stroke="#059669" strokeWidth={2} name="Secondary Highways" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'counts':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Collision Counts Over Time (2000-2019)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Number of Collisions', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="freeways_collision" stroke="#2563eb" strokeWidth={2} name="Freeways" />
                <Line type="monotone" dataKey="kings_collision" stroke="#dc2626" strokeWidth={2} name="King's Highways" />
                <Line type="monotone" dataKey="secondary_collision" stroke="#059669" strokeWidth={2} name="Secondary Highways" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'regression':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Freeway Collision Rates with Linear Regression</h3>
            <div className="mb-2 text-sm text-gray-600">
              Regression equation: Rate = {intercept.toFixed(4)} + {slope.toFixed(6)} × Year Index
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={regressionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Collision Rate (per MVKM)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="freeways_rate" stroke="#2563eb" strokeWidth={2} name="Actual Rates" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="regression" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Linear Regression" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'scatter':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Freeway Collision Counts vs Rates</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="freeways_collision" name="Collision Count" label={{ value: 'Collision Count', position: 'bottom' }} />
                <YAxis dataKey="freeways_rate" name="Collision Rate" label={{ value: 'Collision Rate (per MVKM)', angle: -90, position: 'insideLeft' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => [value, name === 'freeways_rate' ? 'Rate' : 'Count']} />
                <Scatter name="Freeway Data" dataKey="freeways_rate" fill="#2563eb" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );

      case 'comparison':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Average Collision Rates by Road Type (2000-2019)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={[
                { name: 'Freeways', rate: 0.57, std: 0.047 },
                { name: "King's Highways", rate: 0.68, std: 0.077 },
                { name: 'Secondary Highways', rate: 1.095, std: 0.119 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Average Collision Rate (per MVKM)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="rate" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600">
              <p>Mean rates: Freeways (0.57), King's Highways (0.68), Secondary Highways (1.095)</p>
              <p>ANOVA: F(2,57) = 209, p &lt; 0.00001 - Significant difference between road types</p>
            </div>
          </div>
        );

      case 'boxplot':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Distribution of Collision Rates by Road Type</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {boxPlotData.map((roadType) => (
                <div key={roadType.name} className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium text-center mb-2">{roadType.name}</h4>
                  <div className="text-sm space-y-1">
                    <div>Mean: {roadType.mean}</div>
                    <div>Median: {roadType.median}</div>
                    <div>Min: {roadType.min}</div>
                    <div>Max: {roadType.max}</div>
                    <div>Q1: {roadType.q1}</div>
                    <div>Q3: {roadType.q3}</div>
                  </div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={boxPlotData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Collision Rate Range', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="min" stackId="a" fill="#e5e7eb" />
                <Bar dataKey="q1" stackId="a" fill="#9ca3af" />
                <Bar dataKey="median" stackId="a" fill="#374151" />
                <Bar dataKey="q3" stackId="a" fill="#9ca3af" />
                <Bar dataKey="max" stackId="a" fill="#e5e7eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'combined':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Combined Analysis: Counts and Rates</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" label={{ value: 'Collision Count', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Collision Rate', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="freeways_collision" fill="#93c5fd" name="Freeway Collisions" />
                <Line yAxisId="right" type="monotone" dataKey="freeways_rate" stroke="#2563eb" strokeWidth={3} name="Freeway Rate" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Ontario Road Safety Data Visualization (2000-2019)
        </h1>
        <p className="text-gray-600">
          Interactive charts for analyzing collision trends across different road types in Ontario
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {chartButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => setActiveChart(button.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeChart === button.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        {renderChart()}
      </div>

      <div className="mt-6 text-sm text-gray-600 space-y-2">
        <h4 className="font-semibold">Key Statistics:</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <strong>Freeways:</strong><br/>
            Mean Rate: 0.57<br/>
            Range: 0.5 - 0.6<br/>
            Std Dev: 0.047
          </div>
          <div>
            <strong>King's Highways:</strong><br/>
            Mean Rate: 0.68<br/>
            Range: 0.6 - 0.8<br/>
            Std Dev: 0.077
          </div>
          <div>
            <strong>Secondary Highways:</strong><br/>
            Mean Rate: 1.095<br/>
            Range: 0.9 - 1.3<br/>
            Std Dev: 0.119
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadSafetyCharts;