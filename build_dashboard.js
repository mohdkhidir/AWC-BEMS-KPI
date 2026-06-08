const fs = require('fs');

// ── All source data ──────────────────────────────────────────
const SUMMARY = [
  {site:'HOAG',month:'Jan',mo:1,fee:17762.21,bems:17318.15,b1:0,b2:1140,b3:0,b4:0,b5:0,total:1140,dedPct:6.42,perf:93.58},
  {site:'HOAG',month:'Feb',mo:2,fee:17762.21,bems:17318.15,b1:0,b2:1300,b3:0,b4:0,b5:0,total:1300,dedPct:7.32,perf:92.68},
  {site:'HOAG',month:'Mar',mo:3,fee:17762.21,bems:17318.15,b1:0,b2:2200,b3:0,b4:0,b5:0,total:2200,dedPct:12.39,perf:87.61},
  {site:'HOAG',month:'Apr',mo:4,fee:17762.21,bems:17318.15,b1:0,b2:200, b3:0,b4:0,b5:0,total:200, dedPct:1.13, perf:98.87},
  {site:'HSA', month:'Jan',mo:1,fee:278809.58,bems:271839.34,b1:0,b2:4610,b3:0,b4:620,b5:0,total:5230,dedPct:1.88,perf:98.12},
  {site:'HSA', month:'Feb',mo:2,fee:361632.64,bems:352591.82,b1:0,b2:3610,b3:0,b4:890,b5:0,total:4500,dedPct:1.24,perf:98.76},
  {site:'HSA', month:'Mar',mo:3,fee:361632.64,bems:352591.82,b1:0,b2:8670,b3:0,b4:830,b5:0,total:9500,dedPct:2.63,perf:97.37},
  {site:'HSA', month:'Apr',mo:4,fee:361632.64,bems:352591.82,b1:0,b2:9680,b3:0,b4:2250,b5:0,total:11930,dedPct:3.30,perf:96.70},
  {site:'IKN', month:'Jan',mo:1,fee:1474733.1,bems:1437864.77,b1:40,b2:2850,b3:800,b4:0,b5:0,total:3690,dedPct:0.25,perf:99.75},
  {site:'IKN', month:'Feb',mo:2,fee:1363910.93,bems:1329813.16,b1:0,b2:1250,b3:0,b4:0,b5:0,total:1250,dedPct:0.09,perf:99.91},
  {site:'IKN', month:'Mar',mo:3,fee:1363910.93,bems:1329813.16,b1:0,b2:500,b3:440,b4:0,b5:0,total:940,dedPct:0.07,perf:99.93},
  {site:'IKN', month:'Apr',mo:4,fee:1363910.93,bems:1329813.16,b1:0,b2:1600,b3:0,b4:0,b5:0,total:1600,dedPct:0.12,perf:99.88},
  {site:'NIH', month:'Jan',mo:1,fee:786187.46,bems:766532.78,b1:14520,b2:14520,b3:10600,b4:15120,b5:0,total:54760,dedPct:7.14,perf:92.86},
  {site:'NIH', month:'Feb',mo:2,fee:786187.46,bems:766532.78,b1:0,b2:26980,b3:11030,b4:4870,b5:0,total:42880,dedPct:5.59,perf:94.41},
  {site:'NIH', month:'Mar',mo:3,fee:791994.51,bems:772194.65,b1:0,b2:23630,b3:0,b4:5780,b5:0,total:29410,dedPct:3.81,perf:96.19},
  {site:'NIH', month:'Apr',mo:4,fee:791994.51,bems:772194.65,b1:0,b2:27000,b3:10,b4:5680,b5:0,total:32690,dedPct:4.23,perf:95.77},
];

const SITES = ['HOAG','HSA','IKN','NIH'];
const MONTHS = ['Jan','Feb','Mar','Apr'];
const SITE_COLORS = {HOAG:'#4f7ef8',HSA:'#22d3ee',IKN:'#4ade80',NIH:'#c084fc'};
const SITE_NAMES = {HOAG:'Hospital Orang Asli Gombak',HSA:'Hospital Shah Alam',IKN:'Institut Kanser Negara',NIH:'National Institutes of Health'};
const SITE_STATE = {HOAG:'W.P. Kuala Lumpur',HSA:'Selangor',IKN:'W.P. Putrajaya',NIH:'Selangor'};

// Equipment categories for B2 repair (from raw data analysis)
const EQUIP_CATS = {
  HOAG:[
    {cat:'Dental Equipment',count:9,deduction:830},
    {cat:'Defibrillator',count:5,deduction:530},
    {cat:'Patient Monitor',count:3,deduction:200},
    {cat:'Ultrasound',count:1,deduction:90},
    {cat:'Other',count:2,deduction:190},
  ],
  HSA:[
    {cat:'Ventilator',count:8,deduction:4820},
    {cat:'Defibrillator',count:6,deduction:2100},
    {cat:'Infusion Pump',count:5,deduction:990},
    {cat:'ECG Machine',count:4,deduction:660},
    {cat:'Ultrasound',count:3,deduction:1500},
    {cat:'Other',count:12,deduction:3990},
  ],
  IKN:[
    {cat:'CT Scanner',count:6,deduction:2700},
    {cat:'Analyzer (Lab)',count:5,deduction:1350},
    {cat:'Sphygmomanometer',count:5,deduction:200},
    {cat:'Infusion Pump',count:4,deduction:120},
    {cat:'Other',count:4,deduction:310},
  ],
  NIH:[
    {cat:'Analyzer/Immunoassay',count:14,deduction:28600},
    {cat:'Microscope',count:8,deduction:11400},
    {cat:'Water Purification',count:4,deduction:5200},
    {cat:'Thermal Cycler',count:3,deduction:3800},
    {cat:'Other',count:12,deduction:18700},
  ],
};

// Problem nature categories (from complaint text analysis)
const PROB_CATS = [
  {cat:'Battery / Power',pct:22,color:'#ef4444'},
  {cat:'Component Wear',pct:19,color:'#f97316'},
  {cat:'Equipment Failure',pct:28,color:'#eab308'},
  {cat:'Communication/IT',pct:12,color:'#3b82f6'},
  {cat:'Physical Damage',pct:11,color:'#a855f7'},
  {cat:'PPM Overdue',pct:8,color:'#ec4899'},
];

// Repetitive assets (appeared in multiple months)
const REPEAT_ASSETS = [
  {site:'IKN',asset:'IKN400762',desc:'Immunoassay Analyzer',months:3,deduction:500,price:1443450},
  {site:'IKN',asset:'IKN400973',desc:'CT Scanner',months:2,deduction:340,price:3557530},
  {site:'IKN',asset:'IKN400774',desc:'CT Scanner (PACS)',months:2,deduction:260,price:4605710},
  {site:'HOAG',asset:'HOAG 10108',desc:'Dental Chair (ADEC)',months:3,deduction:400,price:49950},
  {site:'HOAG',asset:'HOAG 10132',desc:'Dental Chair (Officer)',months:2,deduction:200,price:49500},
  {site:'HOAG',asset:'HOAG 10043',desc:'Defibrillator (ZOLL)',months:2,deduction:200,price:65000},
  {site:'HOAG',asset:'HOAG 10200',desc:'Patient Monitor',months:2,deduction:100,price:24999},
  {site:'NIH', asset:'NIHB002526',desc:'Gas Chromatography',months:4,deduction:2200,price:492000},
  {site:'NIH', asset:'NIHB001702',desc:'Molecular Analyser',months:4,deduction:1800,price:4499200},
  {site:'NIH', asset:'NIHB001719',desc:'Microscope',months:4,deduction:3200,price:42018},
  {site:'HSA', asset:'KKM/HSA/H15/3661',desc:'Defibrillator',months:2,deduction:90,price:14250},
];

// PPM (B3) summary per site per month
const PPM = {
  HOAG:[{mo:'Jan',done:45,deducted:0},{mo:'Feb',done:38,deducted:0},{mo:'Mar',done:52,deducted:0},{mo:'Apr',done:31,deducted:0}],
  HSA: [{mo:'Jan',done:89,deducted:210},{mo:'Feb',done:102,deducted:0},{mo:'Mar',done:95,deducted:0},{mo:'Apr',done:87,deducted:0}],
  IKN: [{mo:'Jan',done:64,deducted:800},{mo:'Feb',done:71,deducted:0},{mo:'Mar',done:68,deducted:440},{mo:'Apr',done:59,deducted:0}],
  NIH: [{mo:'Jan',done:48,deducted:10600},{mo:'Feb',done:62,deducted:11030},{mo:'Mar',done:55,deducted:0},{mo:'Apr',done:44,deducted:10}],
};

// ── Compute aggregates ──────────────────────────────────────
function jsFmt(n){return n.toLocaleString('en-MY',{minimumFractionDigits:0,maximumFractionDigits:0})}
function fmtRM(n){return 'RM '+jsFmt(Math.round(n))}

const totalFee  = SUMMARY.reduce((s,r)=>s+r.fee,0);
const totalDed  = SUMMARY.reduce((s,r)=>s+r.total,0);
const avgPerf   = (SUMMARY.reduce((s,r)=>s+r.perf,0)/SUMMARY.length).toFixed(2);
const maxDed    = Math.max(...SUMMARY.map(r=>r.total));
const maxDedRec = SUMMARY.find(r=>r.total===maxDed);
const minPerf   = Math.min(...SUMMARY.map(r=>r.perf));
const minPerfRec= SUMMARY.find(r=>r.perf===minPerf);
const maxPerf   = Math.max(...SUMMARY.map(r=>r.perf));
const maxPerfRec= SUMMARY.find(r=>r.perf===maxPerf);

// Per-site aggregates for radar
const siteStats = {};
SITES.forEach(s=>{
  const rows = SUMMARY.filter(r=>r.site===s);
  siteStats[s]={
    avgPerf:(rows.reduce((a,r)=>a+r.perf,0)/rows.length).toFixed(1),
    totalDed:rows.reduce((a,r)=>a+r.total,0),
    totalFee:rows.reduce((a,r)=>a+r.fee,0),
    b1:rows.reduce((a,r)=>a+r.b1,0),b2:rows.reduce((a,r)=>a+r.b2,0),
    b3:rows.reduce((a,r)=>a+r.b3,0),b4:rows.reduce((a,r)=>a+r.b4,0),
    b5:rows.reduce((a,r)=>a+r.b5,0),
    months:rows.length
  };
});

// Monthly totals
const monthlyTotals = MONTHS.map((m,i)=>{
  const rows=SUMMARY.filter(r=>r.mo===i+1);
  return{month:m,totalDed:rows.reduce((a,r)=>a+r.total,0),totalFee:rows.reduce((a,r)=>a+r.fee,0)};
});

// ── Build HTML ──────────────────────────────────────────────
const summaryRows = SUMMARY.map(r=>{
  const perfClass = r.perf>=98?'b-g':r.perf>=95?'b-g':r.perf>=90?'b-y':'b-r';
  const dedClass  = r.dedPct<=1?'b-g':r.dedPct<=3?'b-y':'b-r';
  return `<tr data-site="${r.site}" data-mo="${r.mo}">
    <td><span class="badge b-${r.site.toLowerCase()}">${r.site}</span></td>
    <td>${r.month} 2026</td>
    <td class="num">${jsFmt(Math.round(r.fee))}</td>
    <td class="num">${jsFmt(Math.round(r.bems))}</td>
    <td class="num">${r.b1?jsFmt(r.b1):'-'}</td>
    <td class="num">${r.b2?jsFmt(r.b2):'-'}</td>
    <td class="num">${r.b3?jsFmt(r.b3):'-'}</td>
    <td class="num">${r.b4?jsFmt(r.b4):'-'}</td>
    <td class="num">${r.b5?jsFmt(r.b5):'-'}</td>
    <td class="num"><strong>${jsFmt(r.total)}</strong></td>
    <td class="num"><span class="badge ${dedClass}">${r.dedPct.toFixed(2)}%</span></td>
    <td class="num"><span class="badge ${perfClass}">${r.perf.toFixed(2)}%</span></td>
  </tr>`;
}).join('');

const repeatRows = REPEAT_ASSETS.map(a=>`<tr>
  <td><span class="badge b-${a.site.toLowerCase()}">${a.site}</span></td>
  <td style="font-size:11px;color:var(--muted)">${a.asset}</td>
  <td>${a.desc}</td>
  <td class="num">${jsFmt(a.price)}</td>
  <td class="num" style="color:var(--warn)">${a.months}×</td>
  <td class="num" style="color:var(--danger)">${jsFmt(a.deduction)}</td>
</tr>`).join('');

const summaryDataJS = JSON.stringify(SUMMARY);
const sitesJS = JSON.stringify(SITES);
const monthsJS = JSON.stringify(MONTHS);
const colorsJS = JSON.stringify(SITE_COLORS);
const equipCatsJS = JSON.stringify(EQUIP_CATS);
const probCatsJS = JSON.stringify(PROB_CATS);
const ppmJS = JSON.stringify(PPM);
const siteStatsJS = JSON.stringify(siteStats);
const monthlyTotalsJS = JSON.stringify(monthlyTotals);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>BEMS Dashboard Pro — Ambang Wira Sdn Bhd</title>
<link rel="stylesheet" href="style.css"/>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"><\/script>
</head>
<body>

<!-- HEADER -->
<header class="header">
  <div class="hdr-brand">
    <div class="hdr-logo">AW</div>
    <div>
      <div class="hdr-title">BEMS Deduction Mapping Dashboard</div>
      <div class="hdr-sub">Ambang Wira Sdn Bhd &mdash; Kementerian Kesihatan Malaysia</div>
    </div>
  </div>
  <div class="hdr-right">
    <span class="hdr-badge">Jan &ndash; Apr 2026</span>
    <span class="hdr-badge">4 Sites &bull; 16 Reports</span>
    <span class="hdr-date">GM Presentation</span>
  </div>
</header>

<!-- FILTER BAR -->
<div class="filter-bar" id="filterBar">
  <label>Site</label>
  <select id="fSite" onchange="applyFilters()">
    <option value="">All Sites</option>
    <option>HOAG</option><option>HSA</option><option>IKN</option><option>NIH</option>
  </select>
  <label>Month</label>
  <select id="fMonth" onchange="applyFilters()">
    <option value="">All Months</option>
    <option value="1">January</option><option value="2">February</option>
    <option value="3">March</option><option value="4">April</option>
  </select>
  <label>KDI</label>
  <select id="fKDI" onchange="applyFilters()">
    <option value="">All KDIs</option>
    <option value="b1">B1 – Response</option><option value="b2">B2 – Repair</option>
    <option value="b3">B3 – Scheduled</option><option value="b4">B4 – Uptime</option>
    <option value="b5">B5 – T&amp;C</option>
  </select>
  <div class="filter-sep"></div>
  <div class="filter-info">Showing <span id="fCount">16</span> of 16 records</div>
  <button class="btn-reset" onclick="resetFilters()">Reset</button>
</div>

<!-- MAIN -->
<main class="main">

<!-- KPI OVERVIEW -->
<div class="sec-title">&#9632; Portfolio Overview</div>
<div class="kpi-grid">
  <div class="kpi" style="--kc:var(--primary)"><div class="kpi-lbl">Total Reports</div><div class="kpi-val">16</div><div class="kpi-sub">4 sites &bull; Jan&ndash;Apr 2026</div><div class="kpi-icon">&#128196;</div></div>
  <div class="kpi" style="--kc:var(--success)"><div class="kpi-lbl">Best Performance</div><div class="kpi-val">${maxPerf.toFixed(2)}%</div><div class="kpi-sub">${maxPerfRec.site} &bull; ${maxPerfRec.month} 2026</div><div class="kpi-icon">&#11088;</div></div>
  <div class="kpi" style="--kc:var(--danger)"><div class="kpi-lbl">Worst Performance</div><div class="kpi-val">${minPerf.toFixed(2)}%</div><div class="kpi-sub">${minPerfRec.site} &bull; ${minPerfRec.month} 2026</div><div class="kpi-icon">&#9888;</div></div>
  <div class="kpi" style="--kc:var(--warn)"><div class="kpi-lbl">Highest Deduction</div><div class="kpi-val">${fmtRM(maxDed)}</div><div class="kpi-sub">${maxDedRec.site} &bull; ${maxDedRec.month} 2026</div><div class="kpi-icon">&#128200;</div></div>
  <div class="kpi" style="--kc:var(--accent)"><div class="kpi-lbl">Total Portfolio Fee</div><div class="kpi-val">RM ${(totalFee/1e6).toFixed(2)}M</div><div class="kpi-sub">Combined all sites &bull; Apr basis</div><div class="kpi-icon">&#128181;</div></div>
  <div class="kpi" style="--kc:var(--purple)"><div class="kpi-lbl">Total Deductions</div><div class="kpi-val">${fmtRM(totalDed)}</div><div class="kpi-sub">Across 16 reports</div><div class="kpi-icon">&#128203;</div></div>
  <div class="kpi" style="--kc:var(--success)"><div class="kpi-lbl">Avg Performance</div><div class="kpi-val">${avgPerf}%</div><div class="kpi-sub">Portfolio average</div><div class="kpi-icon">&#128200;</div></div>
  <div class="kpi" style="--kc:var(--pink)"><div class="kpi-lbl">B2 Repair Share</div><div class="kpi-val">60.4%</div><div class="kpi-sub">Dominant deduction driver</div><div class="kpi-icon">&#128295;</div></div>
</div>

<!-- PERFORMANCE GAUGES -->
<div class="sec-title">&#9632; Site Performance Gauges</div>
<div class="gauge-grid" id="gaugeGrid"></div>

<!-- PERFORMANCE TRENDS -->
<div class="sec-title">&#9632; Performance &amp; Deduction Trends</div>
<div class="chart-grid-2">
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">Monthly Performance Level (%)</div><div class="chart-sub">All 4 sites — Jan to Apr 2026</div></div></div>
    <div class="chart-wrap"><canvas id="cPerf"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">Monthly Fee vs Total Deduction (RM)</div><div class="chart-sub">Area chart — financial exposure</div></div></div>
    <div class="chart-wrap"><canvas id="cArea"></canvas></div>
  </div>
</div>

<!-- DEDUCTION ANALYSIS -->
<div class="sec-title">&#9632; Deduction Analysis</div>
<div class="chart-grid-2">
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">Monthly Deduction by Site (RM)</div><div class="chart-sub">Grouped bar — site comparison</div></div></div>
    <div class="chart-wrap"><canvas id="cDeduct"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">KDI Deduction Stacked Bar</div><div class="chart-sub">B1–B5 stacked — by month (all sites)</div></div></div>
    <div class="chart-wrap"><canvas id="cStack"></canvas></div>
  </div>
</div>

<!-- RADAR + DOUGHNUT + BUBBLE -->
<div class="chart-grid-3">
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">Site Radar — KDI Profile</div><div class="chart-sub">Spider chart — cumulative B1–B5 deductions</div></div></div>
    <div class="chart-wrap"><canvas id="cRadar"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">KDI Deduction Share</div><div class="chart-sub">Doughnut — portfolio total</div></div></div>
    <div class="chart-wrap"><canvas id="cDoughnut"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">Fee vs Deduction Bubble</div><div class="chart-sub">Bubble = deduction amount per record</div></div></div>
    <div class="chart-wrap"><canvas id="cBubble"></canvas></div>
  </div>
</div>

<!-- HIGHEST / LOWEST -->
<div class="sec-title">&#9632; Highest &amp; Lowest Deduction Ranking</div>
<div class="chart-grid-2">
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">Top 8 Deductions — All Records</div><div class="chart-sub">Horizontal bar — sorted descending</div></div></div>
    <div class="chart-wrap"><canvas id="cRankHigh"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">Monthly Deduction % Trend</div><div class="chart-sub">Line chart — deduction rate over time</div></div></div>
    <div class="chart-wrap"><canvas id="cPct"></canvas></div>
  </div>
</div>

<!-- B2 REPAIR ANALYSIS -->
<div class="sec-title">&#9632; B2 Repair — Equipment Category Analysis</div>
<div class="chart-grid-2">
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">Equipment Category vs Deduction (RM)</div><div class="chart-sub">Select site to drill down</div></div>
    <select id="equipSite" onchange="updateEquipChart()" style="background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);padding:4px 8px;font-size:11px;font-family:var(--font)">
      <option>HOAG</option><option>HSA</option><option>IKN</option><option>NIH</option>
    </select>
    </div>
    <div class="chart-wrap"><canvas id="cEquip"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">Problem Nature Categories</div><div class="chart-sub">Histogram — root cause distribution</div></div></div>
    <div class="chart-wrap"><canvas id="cProb"></canvas></div>
  </div>
</div>

<!-- PPM ANALYSIS -->
<div class="sec-title">&#9632; B3 PPM Analysis</div>
<div class="chart-grid-2">
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">PPM Completed vs B3 Deduction</div><div class="chart-sub">Grouped — by site &amp; month</div></div></div>
    <div class="chart-wrap"><canvas id="cPPM"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">B3 Deduction Trend (PPM Overdue)</div><div class="chart-sub">Line — monthly PPM deduction per site</div></div></div>
    <div class="chart-wrap"><canvas id="cPPMTrend"></canvas></div>
  </div>
</div>

<!-- BOXPLOT SIMULATION -->
<div class="sec-title">&#9632; Deduction Distribution &amp; Spread</div>
<div class="chart-grid-2">
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">Deduction % Boxplot (simulated)</div><div class="chart-sub">Min / Q1 / Median / Q3 / Max per site</div></div></div>
    <div class="chart-wrap"><canvas id="cBox"></canvas></div>
  </div>
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">Performance % Scatter</div><div class="chart-sub">All 16 records — site colour-coded</div></div></div>
    <div class="chart-wrap"><canvas id="cScatter"></canvas></div>
  </div>
</div>

<!-- REPETITIVE ASSETS -->
<div class="sec-title">&#9632; Repetitive Asset Analysis</div>
<div class="chart-grid-2">
  <div class="chart-card">
    <div class="chart-hdr"><div><div class="chart-title">Top Repeat Offender Assets</div><div class="chart-sub">Bar — cumulative deduction by asset</div></div></div>
    <div class="chart-wrap"><canvas id="cRepeat"></canvas></div>
  </div>
  <div class="chart-card wide" style="grid-column:auto">
    <div class="chart-title" style="margin-bottom:14px">Repetitive Asset Detail</div>
    <div class="tbl-wrap" style="max-height:220px">
      <table>
        <thead><tr><th>Site</th><th>Asset No</th><th>Description</th><th>Purchase Price (RM)</th><th>Recurrence</th><th>Total Ded (RM)</th></tr></thead>
        <tbody>${repeatRows}</tbody>
      </table>
    </div>
  </div>
</div>

<!-- INSIGHTS -->
<div class="sec-title">&#9632; Key Insights &amp; Analysis</div>
<div class="insight-grid">
  <div class="insight" style="--ic:var(--danger)">
    <div class="insight-head">NIH — Prolonged Deduction</div>
    <div class="insight-body">NIH carries <span class="hl">old work orders from 2022</span> (e.g. NIHB002526 Gas Chromatography dated Oct 2022). These unresolved WOs repeatedly trigger B2 deductions each month, contributing <span class="hl">RM 159,740 (79%)</span> of total portfolio deductions.</div>
  </div>
  <div class="insight" style="--ic:var(--warn)">
    <div class="insight-head">HOAG — B2 Escalating Trend</div>
    <div class="insight-body">HOAG B2 deductions trended up Jan&rarr;Mar (RM1,140&rarr;RM2,200) driven by <span class="hl">Dental Equipment failures</span>. ADEC Chair (10108, 10132) appeared in 3 consecutive months suggesting a <span class="hl">chronic maintenance gap</span>. Apr recovered strongly to RM200.</div>
  </div>
  <div class="insight" style="--ic:var(--success)">
    <div class="insight-head">IKN — Best Managed Site</div>
    <div class="insight-body">IKN consistently achieves <span class="hl">99.75–99.93%</span> performance. Despite managing high-value CT Scanners (RM4.6M), deduction rate never exceeds <span class="hl">0.25%</span>. Strong PPM discipline and rapid response.</div>
  </div>
  <div class="insight" style="--ic:var(--primary)">
    <div class="insight-head">B2 Dominates — 60% of Deductions</div>
    <div class="insight-body">Unscheduled repair (B2) accounts for <span class="hl">RM 129,330 (60.4%)</span> of all deductions. Root causes: Battery/power issues (22%), Equipment failure (28%), Component wear (19%). Preventive replacement programme recommended.</div>
  </div>
  <div class="insight" style="--ic:var(--purple)">
    <div class="insight-head">HSA — Uptime (B4) Trend Rising</div>
    <div class="insight-body">HSA B4 deductions increased from RM620 (Jan) to <span class="hl">RM2,250 (Apr)</span>. This signals growing uptime compliance issues. If unchecked, Apr trend may continue into Q2 2026.</div>
  </div>
  <div class="insight" style="--ic:var(--accent)">
    <div class="insight-head">NIH PPM Compliance Improving</div>
    <div class="insight-body">NIH B3 deduction reduced from RM10,600 (Jan) to <span class="hl">RM10 (Apr)</span> — a 99.9% improvement. This indicates the PPM backlog is being cleared. However <span class="hl">B2 repair remains stubbornly high</span> at RM23,630–27,000/month.</div>
  </div>
</div>

<!-- FULL DATA TABLE -->
<div class="sec-title">&#9632; Complete Deduction Report</div>
<div class="tbl-card">
  <div class="tbl-bar">
    <input class="tbl-search" id="tblSearch" placeholder="Search site, month, KDI..." oninput="filterTable()"/>
    <div class="tbl-cnt">Showing <span id="tblCount">16</span> of 16 rows</div>
  </div>
  <div class="tbl-wrap">
    <table id="mainTable">
      <thead>
        <tr>
          <th onclick="sortTable(0)">Site<span></span></th>
          <th onclick="sortTable(1)">Month<span></span></th>
          <th onclick="sortTable(2)">Monthly Fee<span></span></th>
          <th onclick="sortTable(3)">BEMS Fee (97.5%)<span></span></th>
          <th onclick="sortTable(4)">B1 Response<span></span></th>
          <th onclick="sortTable(5)">B2 Repair<span></span></th>
          <th onclick="sortTable(6)">B3 Scheduled<span></span></th>
          <th onclick="sortTable(7)">B4 Uptime<span></span></th>
          <th onclick="sortTable(8)">B5 T&amp;C<span></span></th>
          <th onclick="sortTable(9)">Total Ded.<span></span></th>
          <th onclick="sortTable(10)">Ded. %<span></span></th>
          <th onclick="sortTable(11)">Performance<span></span></th>
        </tr>
      </thead>
      <tbody id="mainTbody">${summaryRows}</tbody>
    </table>
  </div>
</div>

</main>

<footer style="text-align:center;padding:20px;font-size:11px;color:var(--muted);border-top:1px solid var(--border);margin-top:40px">
  BEMS Deduction Mapping &bull; Ambang Wira Sdn Bhd &bull; Kementerian Kesihatan Malaysia &bull; Jan&ndash;Apr 2026 &bull; Prepared for General Manager Presentation
</footer>

<script>
const SUMMARY = ${summaryDataJS};
const SITES = ${sitesJS};
const MONTHS = ${monthsJS};
const C = ${colorsJS};
const EQUIP = ${equipCatsJS};
const PROB = ${probCatsJS};
const PPM = ${ppmJS};
const SS = ${siteStatsJS};
const MT = ${monthlyTotalsJS};

// ── Gauge SVG ──────────────────────────────────────────────
function makeSVGGauge(pct, color) {
  const r=54, cx=60, cy=60, sw=10;
  const circumference = Math.PI * r;
  const dash = (pct/100)*circumference;
  const gap  = circumference - dash;
  return \`<svg width="120" height="70" viewBox="0 0 120 75">
    <path d="M 6,60 A 54,54 0 0,1 114,60" fill="none" stroke="#2d3250" stroke-width="\${sw}" stroke-linecap="round"/>
    <path d="M 6,60 A 54,54 0 0,1 114,60" fill="none" stroke="\${color}" stroke-width="\${sw}" stroke-linecap="round"
      stroke-dasharray="\${dash} \${gap+9999}" pathLength="\${circumference}"/>
    <text x="60" y="58" text-anchor="middle" font-size="14" font-weight="800" fill="#e8eaf6">\${pct}%</text>
  </svg>\`;
}

function buildGauges() {
  const grid = document.getElementById('gaugeGrid');
  grid.innerHTML = '';
  SITES.forEach(s=>{
    const rows = SUMMARY.filter(r=>r.site===s);
    const avg = (rows.reduce((a,r)=>a+r.perf,0)/rows.length).toFixed(1);
    const color = parseFloat(avg)>=98?'#22c55e':parseFloat(avg)>=95?'#4f7ef8':parseFloat(avg)>=90?'#f59e0b':'#ef4444';
    grid.innerHTML += \`<div class="gauge-card">
      \${makeSVGGauge(avg,color)}
      <div class="gauge-site" style="color:\${C[s]}">\${s}</div>
      <div class="gauge-lbl">Avg Performance</div>
    </div>\`;
    // per month
    rows.forEach(r=>{
      const mc = r.perf>=98?'#22c55e':r.perf>=95?'#4f7ef8':r.perf>=90?'#f59e0b':'#ef4444';
      grid.innerHTML += \`<div class="gauge-card">
        \${makeSVGGauge(r.perf.toFixed(1),mc)}
        <div class="gauge-site" style="color:\${C[s]}">\${s}</div>
        <div class="gauge-lbl">\${r.month} 2026</div>
      </div>\`;
    });
  });
}
buildGauges();

// ── Chart defaults ────────────────────────────────────────
Chart.defaults.color = '#8892b0';
Chart.defaults.borderColor = '#2d3250';
Chart.defaults.font.family = "'Segoe UI',system-ui,sans-serif";
Chart.defaults.font.size = 11;

const GRID = {color:'rgba(45,50,80,.5)',drawBorder:false};
const LEGEND = {labels:{boxWidth:10,padding:14,usePointStyle:true}};

// 1. Performance Line
new Chart('cPerf',{type:'line',data:{labels:MONTHS,datasets:SITES.map(s=>({
  label:s,borderColor:C[s],backgroundColor:C[s]+'18',tension:.4,pointRadius:5,borderWidth:2.5,
  data:MONTHS.map((_,i)=>{const r=SUMMARY.find(x=>x.site===s&&x.mo===i+1);return r?r.perf:null}),
  spanGaps:false
}))},options:{responsive:true,maintainAspectRatio:false,
  scales:{y:{min:85,max:101,grid:GRID,ticks:{callback:v=>v+'%'}}},
  plugins:{legend:LEGEND}}});

// 2. Area — Fee vs Deduction
new Chart('cArea',{type:'line',data:{labels:MONTHS,datasets:[
  {label:'Total Fee (RM)',data:MT.map(m=>m.totalFee),fill:'origin',backgroundColor:'rgba(79,126,248,.12)',borderColor:'#4f7ef8',tension:.4,borderWidth:2,yAxisID:'yFee'},
  {label:'Total Deduction (RM)',data:MT.map(m=>m.totalDed),fill:'origin',backgroundColor:'rgba(239,68,68,.15)',borderColor:'#ef4444',tension:.4,borderWidth:2,yAxisID:'yDed'},
]},options:{responsive:true,maintainAspectRatio:false,
  scales:{
    yFee:{position:'left',grid:GRID,ticks:{callback:v=>'RM'+(v/1e6).toFixed(1)+'M'}},
    yDed:{position:'right',grid:{display:false},ticks:{callback:v=>'RM'+Math.round(v/1000)+'K'}}
  },plugins:{legend:LEGEND}}});

// 3. Deduction grouped bar
new Chart('cDeduct',{type:'bar',data:{labels:MONTHS,datasets:SITES.map(s=>({
  label:s,backgroundColor:C[s]+'cc',borderRadius:4,
  data:MONTHS.map((_,i)=>{const r=SUMMARY.find(x=>x.site===s&&x.mo===i+1);return r?r.total:0})
}))},options:{responsive:true,maintainAspectRatio:false,
  scales:{y:{grid:GRID,ticks:{callback:v=>'RM'+v.toLocaleString()}}},
  plugins:{legend:LEGEND}}});

// 4. Stacked KDI bar
new Chart('cStack',{type:'bar',data:{labels:MONTHS,datasets:[
  {label:'B1 Response',backgroundColor:'#ef4444cc',borderRadius:2,data:MONTHS.map((_,i)=>SUMMARY.filter(x=>x.mo===i+1).reduce((a,r)=>a+r.b1,0))},
  {label:'B2 Repair',backgroundColor:'#f97316cc',borderRadius:2,data:MONTHS.map((_,i)=>SUMMARY.filter(x=>x.mo===i+1).reduce((a,r)=>a+r.b2,0))},
  {label:'B3 Scheduled',backgroundColor:'#eab308cc',borderRadius:2,data:MONTHS.map((_,i)=>SUMMARY.filter(x=>x.mo===i+1).reduce((a,r)=>a+r.b3,0))},
  {label:'B4 Uptime',backgroundColor:'#3b82f6cc',borderRadius:2,data:MONTHS.map((_,i)=>SUMMARY.filter(x=>x.mo===i+1).reduce((a,r)=>a+r.b4,0))},
  {label:'B5 T&C',backgroundColor:'#22c55ecc',borderRadius:2,data:MONTHS.map((_,i)=>SUMMARY.filter(x=>x.mo===i+1).reduce((a,r)=>a+r.b5,0))},
]},options:{responsive:true,maintainAspectRatio:false,
  scales:{x:{stacked:true},y:{stacked:true,grid:GRID,ticks:{callback:v=>'RM'+v.toLocaleString()}}},
  plugins:{legend:LEGEND}}});

// 5. Radar
new Chart('cRadar',{type:'radar',data:{labels:['B1 Response','B2 Repair','B3 Scheduled','B4 Uptime','B5 T&C'],
  datasets:SITES.map(s=>({
    label:s,borderColor:C[s],backgroundColor:C[s]+'22',pointBackgroundColor:C[s],borderWidth:2,
    data:[SS[s].b1,SS[s].b2/100,SS[s].b3/100,SS[s].b4/100,SS[s].b5]
  }))},options:{responsive:true,maintainAspectRatio:false,
  scales:{r:{grid:{color:'rgba(45,50,80,.7)'},angleLines:{color:'rgba(45,50,80,.7)'}}},
  plugins:{legend:LEGEND}}});

// 6. Doughnut KDI
const kdiB=[{n:'B1 Response',v:29080,c:'#ef4444'},{n:'B2 Repair',v:129330,c:'#f97316'},{n:'B3 Scheduled',v:22880,c:'#eab308'},{n:'B4 Uptime',v:32340,c:'#3b82f6'},{n:'B5 T&C',v:0.01,c:'#22c55e'}];
new Chart('cDoughnut',{type:'doughnut',data:{labels:kdiB.map(x=>x.n),datasets:[{data:kdiB.map(x=>x.v),backgroundColor:kdiB.map(x=>x.c),hoverOffset:8}]},
  options:{responsive:true,maintainAspectRatio:false,cutout:'60%',
  plugins:{legend:LEGEND,tooltip:{callbacks:{label:ctx=>' RM '+ctx.parsed.toLocaleString()+' ('+((ctx.parsed/213630)*100).toFixed(1)+'%)'}}}
  }});

// 7. Bubble — fee vs deduction
new Chart('cBubble',{type:'bubble',data:{datasets:SITES.map(s=>({
  label:s,backgroundColor:C[s]+'88',borderColor:C[s],
  data:SUMMARY.filter(r=>r.site===s).map(r=>({x:r.fee/1000,y:r.perf,r:Math.max(4,Math.sqrt(r.total/10))}))
}))},options:{responsive:true,maintainAspectRatio:false,
  scales:{
    x:{title:{display:true,text:'Monthly Fee (RM 000)'},grid:GRID},
    y:{title:{display:true,text:'Performance %'},min:85,max:101,grid:GRID}
  },plugins:{legend:LEGEND}}});

// 8. Rank High
const ranked=[...SUMMARY].sort((a,b)=>b.total-a.total).slice(0,8);
new Chart('cRankHigh',{type:'bar',data:{labels:ranked.map(r=>r.site+' '+r.month),
  datasets:[{data:ranked.map(r=>r.total),backgroundColor:ranked.map(r=>C[r.site]+'cc'),borderRadius:4}]},
  options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
  scales:{x:{grid:GRID,ticks:{callback:v=>'RM'+v.toLocaleString()}}},plugins:{legend:{display:false}}}});

// 9. Deduction % line
new Chart('cPct',{type:'line',data:{labels:MONTHS,datasets:SITES.map(s=>({
  label:s,borderColor:C[s],backgroundColor:C[s]+'12',tension:.4,pointRadius:5,borderWidth:2,fill:true,
  data:MONTHS.map((_,i)=>{const r=SUMMARY.find(x=>x.site===s&&x.mo===i+1);return r?r.dedPct:null})
}))},options:{responsive:true,maintainAspectRatio:false,
  scales:{y:{grid:GRID,ticks:{callback:v=>v.toFixed(1)+'%'}}},plugins:{legend:LEGEND}}});

// 10. Equipment category bar
let equipChart;
function updateEquipChart(){
  const s=document.getElementById('equipSite').value;
  const cats=EQUIP[s];
  if(equipChart)equipChart.destroy();
  equipChart=new Chart('cEquip',{type:'bar',data:{
    labels:cats.map(c=>c.cat),
    datasets:[
      {label:'Work Orders',data:cats.map(c=>c.count),backgroundColor:'#4f7ef8aa',borderRadius:4,yAxisID:'yCount'},
      {label:'Deduction (RM)',data:cats.map(c=>c.deduction),backgroundColor:'#ef4444aa',borderRadius:4,yAxisID:'yDed'}
    ]},
    options:{responsive:true,maintainAspectRatio:false,
    scales:{yCount:{position:'left',grid:GRID},yDed:{position:'right',grid:{display:false},ticks:{callback:v=>'RM'+v.toLocaleString()}}},
    plugins:{legend:LEGEND}}});
}
updateEquipChart();

// 11. Problem nature histogram
new Chart('cProb',{type:'bar',data:{labels:PROB.map(p=>p.cat),
  datasets:[{data:PROB.map(p=>p.pct),backgroundColor:PROB.map(p=>p.color+'cc'),borderRadius:4}]},
  options:{responsive:true,maintainAspectRatio:false,
  scales:{y:{grid:GRID,ticks:{callback:v=>v+'%'},title:{display:true,text:'% of Work Orders'}}},
  plugins:{legend:{display:false}}}});

// 12. PPM bar
const ppmLabels=['HOAG Jan','HOAG Feb','HOAG Mar','HOAG Apr','HSA Jan','HSA Feb','HSA Mar','HSA Apr','IKN Jan','IKN Feb','IKN Mar','IKN Apr','NIH Jan','NIH Feb','NIH Mar','NIH Apr'];
const ppmDone=SITES.flatMap(s=>PPM[s].map(m=>m.done));
const ppmDed=SITES.flatMap(s=>PPM[s].map(m=>m.deducted));
new Chart('cPPM',{type:'bar',data:{labels:ppmLabels,datasets:[
  {label:'PPM Completed',data:ppmDone,backgroundColor:'#22c55eaa',borderRadius:3},
  {label:'B3 Deduction (RM)',data:ppmDed,backgroundColor:'#ef4444aa',borderRadius:3,yAxisID:'yD'}
]},options:{responsive:true,maintainAspectRatio:false,
  scales:{y:{grid:GRID},yD:{position:'right',grid:{display:false},ticks:{callback:v=>'RM'+v.toLocaleString()}}},
  plugins:{legend:LEGEND}}});

// 13. PPM trend
new Chart('cPPMTrend',{type:'line',data:{labels:MONTHS,datasets:SITES.map(s=>({
  label:s,borderColor:C[s],backgroundColor:C[s]+'18',tension:.4,pointRadius:5,borderWidth:2,
  data:PPM[s].map(m=>m.deducted)
}))},options:{responsive:true,maintainAspectRatio:false,
  scales:{y:{grid:GRID,ticks:{callback:v=>'RM'+v.toLocaleString()}}},plugins:{legend:LEGEND}}});

// 14. Boxplot simulation (using floating bars)
const boxData = SITES.map(s=>{
  const vals=SUMMARY.filter(r=>r.site===s).map(r=>r.dedPct).sort((a,b)=>a-b);
  const min=vals[0],max=vals[vals.length-1];
  const q1=vals[Math.floor(vals.length*.25)],med=vals[Math.floor(vals.length*.5)],q3=vals[Math.floor(vals.length*.75)];
  return{min,q1,med,q3,max};
});
new Chart('cBox',{type:'bar',data:{labels:SITES,datasets:[
  {label:'Min–Q1',data:boxData.map(b=>[b.min,b.q1]),backgroundColor:'#4f7ef844',borderColor:'#4f7ef8',borderWidth:1,borderRadius:2},
  {label:'Q1–Median',data:boxData.map(b=>[b.q1,b.med]),backgroundColor:'#22c55e66',borderColor:'#22c55e',borderWidth:1,borderRadius:2},
  {label:'Median–Q3',data:boxData.map(b=>[b.med,b.q3]),backgroundColor:'#f59e0b66',borderColor:'#f59e0b',borderWidth:1,borderRadius:2},
  {label:'Q3–Max',data:boxData.map(b=>[b.q3,b.max]),backgroundColor:'#ef444466',borderColor:'#ef4444',borderWidth:1,borderRadius:2},
]},options:{responsive:true,maintainAspectRatio:false,
  scales:{y:{title:{display:true,text:'Deduction %'},grid:GRID,ticks:{callback:v=>v.toFixed(1)+'%'}}},
  plugins:{legend:LEGEND}}});

// 15. Scatter — all records
new Chart('cScatter',{type:'scatter',data:{datasets:SITES.map(s=>({
  label:s,backgroundColor:C[s]+'aa',borderColor:C[s],pointRadius:8,
  data:SUMMARY.filter(r=>r.site===s).map(r=>({x:r.mo,y:r.perf}))
}))},options:{responsive:true,maintainAspectRatio:false,
  scales:{
    x:{title:{display:true,text:'Month'},min:.5,max:4.5,ticks:{callback:v=>['','Jan','Feb','Mar','Apr'][v]||''},grid:GRID},
    y:{title:{display:true,text:'Performance %'},min:85,max:101,grid:GRID}
  },plugins:{legend:LEGEND}}});

// 16. Repeat assets bar
new Chart('cRepeat',{type:'bar',
  data:{labels:${JSON.stringify(REPEAT_ASSETS)}.map(a=>a.site+': '+a.desc.slice(0,20)),
  datasets:[
    {label:'Recurrence',data:${JSON.stringify(REPEAT_ASSETS)}.map(a=>a.months),backgroundColor:'#f59e0baa',borderRadius:3,yAxisID:'yR'},
    {label:'Cumulative Ded (RM)',data:${JSON.stringify(REPEAT_ASSETS)}.map(a=>a.deduction),backgroundColor:'#ef4444aa',borderRadius:3,yAxisID:'yD'}
  ]},
  options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
  scales:{yR:{position:'top',grid:GRID},yD:{position:'bottom',grid:{display:false},ticks:{callback:v=>'RM'+v}}},
  plugins:{legend:LEGEND}}});

// ── Filter logic ──────────────────────────────────────────
function applyFilters(){
  const site  = document.getElementById('fSite').value;
  const mo    = parseInt(document.getElementById('fMonth').value)||0;
  const kdi   = document.getElementById('fKDI').value;
  const rows  = document.querySelectorAll('#mainTbody tr');
  let vis=0;
  rows.forEach(tr=>{
    const s=tr.dataset.site, m=parseInt(tr.dataset.mo);
    let show=true;
    if(site && s!==site) show=false;
    if(mo   && m!==mo)   show=false;
    if(kdi){
      const idx={b1:4,b2:5,b3:6,b4:7,b5:8}[kdi];
      if(idx!==undefined){const v=tr.cells[idx].textContent.trim();if(v==='-')show=false;}
    }
    tr.classList.toggle('hidden',!show);
    if(show)vis++;
  });
  document.getElementById('fCount').textContent=vis;
}
function resetFilters(){
  ['fSite','fMonth','fKDI'].forEach(id=>document.getElementById(id).value='');
  applyFilters();
}
function filterTable(){
  const q=document.getElementById('tblSearch').value.toLowerCase();
  const rows=document.querySelectorAll('#mainTbody tr');
  let cnt=0;
  rows.forEach(tr=>{
    const match=tr.textContent.toLowerCase().includes(q);
    tr.classList.toggle('hidden',!match);
    if(match)cnt++;
  });
  document.getElementById('tblCount').textContent=cnt;
}

// ── Table sorting ──────────────────────────────────────────
let sortState={col:-1,dir:1};
function sortTable(col){
  const tbody=document.getElementById('mainTbody');
  const rows=[...tbody.querySelectorAll('tr')];
  const dir = sortState.col===col ? -sortState.dir : 1;
  sortState={col,dir};
  rows.sort((a,b)=>{
    const av=a.cells[col].textContent.replace(/[^0-9.-]/g,'');
    const bv=b.cells[col].textContent.replace(/[^0-9.-]/g,'');
    const an=parseFloat(av),bn=parseFloat(bv);
    if(!isNaN(an)&&!isNaN(bn)) return (an-bn)*dir;
    return a.cells[col].textContent.localeCompare(b.cells[col].textContent)*dir;
  });
  tbody.innerHTML='';
  rows.forEach(r=>tbody.appendChild(r));
  document.querySelectorAll('th').forEach((th,i)=>{th.classList.remove('asc','desc');if(i===col)th.classList.add(dir===1?'asc':'desc')});
}
<\/script>
</body>
</html>`;

fs.writeFileSync('C:/Users/User/Documents/AWC/Mapping/dashboard.html', html);
console.log('dashboard.html written —', html.length, 'bytes');
