# AWC BEMS KPI Dashboard

**Biomedical Engineering Maintenance Services (BEMS) - Performance & Deduction Analysis**

A comprehensive interactive dashboard for analyzing BEMS performance across 4 healthcare facilities in Malaysia.

---

## 📊 Live Dashboard

**[View Dashboard Online](https://mohdkhidir.github.io/AWC-BEMS-KPI/dashboard.html)**

---

## 📋 Overview

This dashboard provides complete analysis of BEMS services across:
- **IKN** - Institut Kanser Negara
- **HSA** - Hospital Selangor
- **NIH** - National Institute of Health
- **HOAG** - Hospital Orang Asli Gombak

**Data Period:** January – May 2026 (17 monthly reports)

---

## 📈 Dashboard Features

### Interactive Visualizations
- **Performance Gauges** - Site-by-site performance tracking
- **Monthly Trends** - Performance and deduction trends over time
- **Deduction Analysis** - Breakdown by site and KDI indicator
- **KDI Indicators** - B1-B5 deduction analysis (Response, Repair, Scheduled, Uptime, T&C)
- **Radar Chart** - Multi-dimensional KDI profile comparison
- **Equipment Analysis** - B2 repair category deep-dive
- **PPM Analysis** - Preventive Maintenance Program compliance
- **Scatter & Distribution** - Performance scatter plots and boxplots

### Interactive Controls
- **Site Filter** - Filter by individual facilities or all sites
- **Month Filter** - View specific months or all periods
- **KDI Filter** - Focus on specific deduction indicators
- **Searchable Data Table** - Sort and search all 17 records
- **Performance Insights** - Key findings and analysis

---

## 📁 Data Files

Monthly BEMS deduction reports (Excel format):
```
├── HOAG - BEMS_HOAG JAN 2026.xlsx
├── HOAG - BEMS_HOAG FEB 2026.xlsx
├── HOAG - BEMS_HOAG MAR 2026.xlsx
├── HOAG - BEMS APRIL 2026.xlsx
│
├── HSA - BEMS JAN 2026_CONFIRM.xlsx
├── HSA - BEMS FEB 2026_CONFIRM.xlsx
├── HSA - BEMS MARCH 2026_CONFIRM.xlsx
├── HSA - BEMS APRIL 2026.xlsx
│
├── IKN - BEMS_JAN_2026.xlsx
├── IKN - BEMS_FEB_2026.xlsx
├── IKN - BEMS_MAR_2026.xlsx
├── IKN - BEMS APRIL 2026.xlsx
├── IKN - BEMS_MAY_2026.xlsx
│
├── NIH - BEMS JANUARY 2026.xlsx
├── NIH - BEMS FEBRUARY 2026.xlsx
├── NIH - BEMS JANUARY 2026.xlsx
└── NIH - BEMS APRIL 2026.xlsx
```

---

## 🔍 Key Metrics

| Metric | Value | Details |
|--------|-------|---------|
| **Total Reports** | 17 | 4 sites, 5 months (Jan-May 2026) |
| **Best Performance** | 99.93% | IKN, March 2026 |
| **Worst Performance** | 87.61% | HOAG, March 2026 |
| **Highest Deduction** | RM 54,760 | NIH, January 2026 |
| **Total Portfolio Fee** | RM 10.16M | Combined baseline |
| **Total Deductions** | RM 203K+ | Across all reports |
| **Avg Performance** | 96.40% | Portfolio average |
| **B2 Repair Share** | 60.4% | Dominant deduction driver |

---

## 📊 Chart Library

1. **Performance Level** - Line chart (monthly trends by site)
2. **Monthly Fee vs Deduction** - Area chart (financial exposure)
3. **Deduction by Site** - Grouped bar chart (site comparison)
4. **KDI Stacked Bar** - B1-B5 deduction composition
5. **Site Radar** - Spider chart (KDI profiles)
6. **KDI Share** - Doughnut chart (deduction breakdown)
7. **Fee vs Deduction Bubble** - Bubble chart (scatter analysis)
8. **Top Deductions** - Horizontal bar chart (ranking)
9. **Deduction % Trend** - Line chart (rate over time)
10. **Equipment Analysis** - Bar chart (B2 category drill-down)
11. **Problem Nature** - Histogram (root cause distribution)
12. **PPM Compliance** - Grouped bar (completed vs deducted)
13. **PPM Trend** - Line chart (deduction by site/month)
14. **Distribution Boxplot** - Statistical box plot
15. **Performance Scatter** - Scatter plot (all records)
16. **Repeat Assets** - Bar chart (top offenders)

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Charts:** Chart.js 4.4.4
- **Hosting:** GitHub Pages
- **Data Format:** Excel (XLSX)
- **Responsive Design:** Mobile & Desktop optimized

---

## 📌 Key Insights

### IKN - Best Managed Site
- Consistently achieves **99.75–99.93%** performance
- Manages high-value CT Scanners (RM 4.6M+)
- Deduction rate never exceeds **0.25%**
- Strong PPM discipline and rapid response

### HOAG - B2 Escalating Trend
- B2 deductions increased Jan→Mar (RM 1,140 → RM 2,200)
- Dental equipment failures recurring (ADEC Chair)
- Shows **chronic maintenance gap**
- Recovery in April (RM 200)

### HSA - Uptime Rising
- B4 deductions increased from RM 620 (Jan) to RM 2,250 (Apr)
- Growing uptime compliance issues
- Trend may continue into Q2 2026

### NIH - High Deduction Volume
- Carries old work orders from 2022
- Unresolved WOs trigger repeated B2 deductions
- Contributes **RM 159,740 (79%)** of portfolio deductions
- PPM compliance improving (B3 down 99.9%)

---

## 📖 Usage

1. **Open Dashboard:** Visit [https://mohdkhidir.github.io/AWC-BEMS-KPI/dashboard.html](https://mohdkhidir.github.io/AWC-BEMS-KPI/dashboard.html)
2. **Filter Data:** Use Site, Month, and KDI dropdowns to slice data
3. **Explore Charts:** Hover over charts for details, click legend items to toggle series
4. **Search Table:** Use the search box to find specific records
5. **Sort Table:** Click column headers to sort ascending/descending

---

## 📧 Contact

**Prepared by:** Ambang Wira Sdn Bhd  
**For:** Kementerian Kesihatan Malaysia  
**Purpose:** General Manager Presentation - BEMS Performance Review

---

## 📄 License

Internal use only - Ambang Wira Sdn Bhd & Ministry of Health Malaysia

---

**Last Updated:** June 9, 2026  
**Data Period:** January – May 2026
