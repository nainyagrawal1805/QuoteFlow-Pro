# ⚡ QuoteFlow Pro — B2B CPQ Portal

### *A premium Salesforce CPQ frontend portal by [NovaSync Solutions](https://github.com/nainyagrawal1805)*

<p align="center">
  <img src="https://img.shields.io/badge/Salesforce-CPQ-00A1E0?style=for-the-badge&logo=salesforce&logoColor=white" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" />
</p>

---

## 🌐 Live Demo

🔗 **[Open QuoteFlow Pro →](https://nainyagrawal1805.github.io/QuoteFlow-Pro/)**

> Simply click the link above to explore the live portal — no installation needed!

---
## ⚡ Demo vs Live Mode

| Mode | Where | Data Source |
|------|-------|-------------|
| 🔵 **Demo Mode** | GitHub Pages (this link) | Built-in mock data — no setup needed |
| 🟢 **Live Mode** | Localhost only | Real Salesforce org via OAuth 2.0 |

> **GitHub Pages** shows fully functional portal with realistic B2B mock data  
> (Infosys, TCS, Wipro accounts with quotes, approvals, and analytics).
>
> **For a live Salesforce demo** — clone the repo, add your Connected App credentials,  
> run `node server.js` and connect via OAuth. All CPQ data loads from a real Salesforce org.
>
> 📩 Want to see the live demo? Contact me on GitHub.

## 📋 What is QuoteFlow Pro?

**QuoteFlow Pro** is a fully functional, static B2B **Configure, Price, Quote (CPQ)** frontend portal that demonstrates real-world Salesforce CPQ concepts. Built for **NovaSync Solutions**, it showcases the entire quote-to-cash lifecycle — from browsing a product catalog and building quotes to managing multi-level discount approvals and viewing business analytics dashboards.

This project is designed as a **portfolio-grade demonstration** of Salesforce CPQ skills, modern frontend design, and B2B SaaS application architecture.

---

## ✨ Key Features

| Module | Description |
|--------|-------------|
| 🏠 **Home / Landing Page** | Hero section with animated stats counter, platform module cards, and recent quotes table |
| 📦 **Product Catalog** | Four pricing tiers (Basic, Professional, Enterprise, Premium Support) with feature comparisons and tier cards |
| 🧮 **Quote Calculator** | Real-time pricing engine with quantity selectors, volume discount tiers (0%/10%/20%), additional discount input, and live approval-level indicators |
| ✅ **Approval Dashboard** | Filterable quotes table with status badges, slide-in approval timeline panel, and multi-level workflow visualization |
| 📊 **Analytics Dashboard** | Four interactive Chart.js visualizations — Revenue by Account, Discount Distribution, Margin by Opportunity, and Monthly Trends |
| 👥 **Customer Accounts** | Customer cards with per-account revenue, quote count, average discount stats, and direct quote filtering |
| ⚙️ **Configuration** | System rules reference — product pricing table, volume discount tier cards, and approval workflow flow diagram |

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **HTML5** — Semantic markup with SEO meta tags
- **CSS3** — Custom design system using CSS custom properties (variables), responsive grid layouts, glassmorphism effects, scroll-triggered animations
- **Vanilla JavaScript** — DOM manipulation, dynamic rendering, IntersectionObserver for scroll animations, animated stat counters

### External Libraries (CDN)
- **[Chart.js v4](https://www.chartjs.org/)** — Interactive dashboard charts
- **[Lucide Icons](https://lucide.dev/)** — Lightweight SVG icon library
- **[Google Fonts](https://fonts.google.com/)** — Josefin Sans typeface

### Salesforce Integration (Optional)
- **OAuth 2.0** callback flow via `callback.html`
- **REST API proxy** via `server.js` + `api.js` for live Salesforce data
- Graceful **fallback to mock data** when not connected

---

## 📁 Project Structure

```
QuoteFlow Pro/
├── index.html          → Landing page — hero, animated stats, module cards, recent quotes
├── catalog.html        → Product catalog — 4 pricing tiers with feature comparison
├── calculator.html     → Quote calculator — live pricing with volume discounts & approval indicators
├── approval.html       → Approval dashboard — filterable table + slide-in approval timeline
├── dashboards.html     → Analytics — 4 interactive Chart.js visualizations
├── customers.html      → Customer accounts — per-account stats and quote history
├── configuration.html  → System config — pricing rules, discount tiers, approval workflow
├── callback.html       → Salesforce OAuth callback handler
├── style.css           → Complete design system (CSS custom properties, responsive grid, animations)
├── data.js             → Mock data layer — quotes, products, customers, discount rules, approvers
├── api.js              → Salesforce API integration layer with fallback logic
├── server.js           → Local Node.js proxy server for Salesforce REST API calls
├── .gitignore          → Standard ignores (node_modules, .env, OS files)
└── README.md           → This file
```

---

## 🎨 Design System

| Element   | Value |
|-----------|-------|
| **Primary** | `#0A2540` — Deep Blue |
| **Accent**  | `#505081` — Muted Indigo |
| **Success** | `#00C48C` — Green |
| **Warning** | `#FFB800` — Amber |
| **Danger**  | `#FF4757` — Red |
| **Font**    | [Josefin Sans](https://fonts.google.com/specimen/Josefin+Sans) (Google Fonts) |
| **Style**   | Flat, corporate B2B SaaS with glassmorphism accents |

---

## 🚀 Getting Started

### Option 1: Open directly (simplest)
Just open `index.html` in any modern browser — all pages work out of the box with built-in mock data.

### Option 2: Local HTTP server
```bash
# Using npx (no install needed)
npx http-server . -p 8080 --cors

# Then visit http://localhost:8080
```

### Option 3: With Salesforce Integration (Local Only)

```bash
# 1. Install dependencies
npm install

# 2. Open callback.html and replace placeholders with your credentials
#    CLIENT_ID = 'your_connected_app_client_id'
#    CLIENT_SECRET = 'your_connected_app_client_secret'

# 3. Start the proxy server
node server.js

# 4. Visit http://localhost:3000 and click "Connect to Salesforce"
```

> ⚠️ Requires your own Salesforce Connected App credentials.  
> Works with any Salesforce org that has CPQ installed.

---

## 💡 CPQ Concepts Demonstrated

This project demonstrates the following **Salesforce CPQ** concepts:

- **Product Catalog Management** — Structured product tiers with feature-level differentiation
- **Price Book & List Pricing** — Centralized pricing with per-product unit costs
- **Volume-Based Discount Schedules** — Tiered automatic discounts (Standard 0%, Volume 10%, Bulk 20%)
- **Additional / Discretionary Discounts** — Sales rep-entered discounts beyond volume tiers
- **Multi-Level Approval Workflows** — Auto-approve (0–10%), L1 Manager (10–25%), L2 Director (25%+)
- **Quote Lifecycle Management** — Draft → In Review → Approved/Rejected status transitions
- **Revenue & Margin Analytics** — Per-account revenue breakdown and per-opportunity margin analysis
- **Customer Account Hierarchy** — Account-level aggregation of quotes, revenue, and discount history

---

## 👤 Author

**Nainy Agrawal** — 3rd Year Engineering Student | Aspiring Salesforce CPQ Developer

- 🎓 Oriental Institute of Science & Technology Student, Bhopal
- 💼 Focused on Salesforce CPQ & Revenue Cloud Advanced (RCA)

- GitHub: [@nainyagrawal1805](https://github.com/nainyagrawal1805)

---

## 📄 License

This project is for **portfolio and demonstration purposes**.  
Feel free to explore, learn from, and reference the code.

---

<p align="center">
  Built with ❤️ by <strong>NovaSync Solutions</strong>
</p>
