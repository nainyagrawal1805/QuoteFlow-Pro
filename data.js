// ============================================================
// QuoteFlow Pro — NovaSync Solutions
// data.js — Central Mock Data Store (v3 — Real Org Aligned)
// Real quotes: Q-00000, Q-00001, Q-00002
// Padded with 4 realistic quotes for dashboard completeness
// Currency: USD ($)
// ============================================================

// ─── COMPANY INFO ───────────────────────────────────────────
const COMPANY = {
  name: "NovaSync Solutions",
  portal: "QuoteFlow Pro",
  tagline: "Smarter Quoting. Faster Closings.",
  email: "sales@novasyncsolutions.com",
  phone: "+91-755-400-1200",
  location: "Bhopal, Madhya Pradesh, India"
};

// ─── PRODUCTS ───────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "P001",
    name: "Basic Plan",
    code: "TP-BASIC-001",
    price: 2000,
    currency: "$",
    description: "Entry level software license for SMB clients.",
    features: [
      "Up to 50 quotes/month",
      "Standard product catalog",
      "Basic pricing rules",
      "Email support",
      "Single currency"
    ],
    badge: null,
    color: "#4A90A4"
  },
  {
    id: "P002",
    name: "Pro Plan",
    code: "TP-Pro-002",
    price: 5000,
    currency: "$",
    description: "Mid-tier software license for growing businesses.",
    features: [
      "Unlimited quotes",
      "Advanced product bundles",
      "Tiered pricing & discounts",
      "Approval workflows",
      "Multi-currency support",
      "API access"
    ],
    badge: "Popular",
    color: "#505081"
  },
  {
    id: "P003",
    name: "Enterprise Plan",
    code: "TP-ENT-003",
    price: 12000,
    currency: "$",
    description: "Full featured enterprise software license for large clients.",
    features: [
      "Everything in Pro",
      "Custom approval chains",
      "Advanced analytics & forecasting",
      "Salesforce CPQ integration",
      "Dedicated account manager",
      "Custom SLA",
      "SSO & audit logs"
    ],
    badge: "Best Value",
    color: "#0A2540"
  },
  {
    id: "P004",
    name: "Support Package",
    code: "TP-SUP-004",
    price: 3000,
    currency: "$",
    description: "Dedicated technical support and maintenance package.",
    features: [
      "24/7 priority support",
      "Dedicated onboarding specialist",
      "Quarterly business reviews",
      "Training sessions (4/year)"
    ],
    badge: "Add-On",
    color: "#0D9488"
  }
];

// ─── CUSTOMERS ──────────────────────────────────────────────
const CUSTOMERS = [
  {
    id: "C001",
    name: "Infosys",
    industry: "IT Services",
    tier: "Enterprise"
  },
  {
    id: "C002",
    name: "Wipro",
    industry: "IT Consulting",
    tier: "Pro"
  },
  {
    id: "C003",
    name: "TCS",
    industry: "IT Services",
    tier: "Enterprise"
  }
];

// ─── DISCOUNT & APPROVAL RULES ──────────────────────────────
const DISCOUNT_RULES = [
  { minQty: 1,   maxQty: 99,   volumeDiscount: 0,  label: "Standard (0%)",    tier: "standard"   },
  { minQty: 100, maxQty: 499,  volumeDiscount: 10, label: "Volume (10%)",     tier: "volume"     },
  { minQty: 500, maxQty: null, volumeDiscount: 20, label: "Enterprise (20%)", tier: "enterprise" }
];

const APPROVAL_RULES = [
  { min: 0,  max: 10,  level: "Auto", label: "Auto-approved — standard discount", color: "#6ee7b7" },
  { min: 10, max: 20,  level: "L1",   label: "Requires L1 Manager approval",      color: "#fde68a" },
  { min: 20, max: 100, level: "L2",   label: "Requires L2 Director approval",     color: "#fca5a5" }
];

// ─── APPROVERS ──────────────────────────────────────────────
const APPROVERS = [
  {
    id: "A001",
    name: "Rahul Sharma",
    role: "Sales Manager (L1)",
    email: "nainyagrawal5@gmail.com",
    maxDiscount: 20
  },
  {
    id: "A002",
    name: "Priya Mehta",
    role: "Sales Director (L2)",
    email: "nainyagrawal5@gmail.com",
    maxDiscount: 100
  }
];

// ─── QUOTES ─────────────────────────────────────────────────
// Q-00000, Q-00001, Q-00002 = REAL from Salesforce org
// Q-00003 to Q-00006 = realistic padded data for dashboard
const QUOTES = [
  {
    // ✅ REAL — Infosys Enterprise License Deal
    id: "Q-00000",
    customer: "Infosys",
    customerId: "C001",
    product: "Enterprise Plan",
    productId: "P003",
    unitPrice: 12000,
    quantity: 525,
    volumeDiscount: 20,
    additionalDiscount: 5,
    listAmount: 6300000,
    netAmount: 5070000,
    status: "Approved",
    approver: null,
    approvalLevel: null,
    submittedDate: "2026-04-06",
    approvedDate: "2026-04-06",
    notes: "Enterprise license deal for Infosys. Auto-approved (5% discount).",
    opportunityName: "Infosys — Enterprise License Deal"
  },
  {
    // ✅ REAL — TCS Bulk Enterprise Deal
    id: "Q-00001",
    customer: "TCS",
    customerId: "C003",
    product: "Enterprise Plan",
    productId: "P003",
    unitPrice: 12000,
    quantity: 95,
    volumeDiscount: 0,
    additionalDiscount: 5,
    listAmount: 1140000,
    netAmount: 776250,
    status: "Approved",
    approver: null,
    approvalLevel: null,
    submittedDate: "2026-04-08",
    approvedDate: "2026-04-08",
    notes: "Bulk enterprise deal for TCS. Auto-approved (5% discount).",
    opportunityName: "TCS - Bulk Enterprise Deal"
  },
  {
    // ✅ REAL — Wipro Pro License Deal
    id: "Q-00002",
    customer: "Wipro",
    customerId: "C002",
    product: "Pro Plan",
    productId: "P002",
    unitPrice: 5000,
    quantity: 590,
    volumeDiscount: 20,
    additionalDiscount: 25,
    listAmount: 2950000,
    netAmount: 1991250,
    status: "In Review",
    approver: "Priya Mehta",
    approvalLevel: "L2",
    submittedDate: "2026-04-19",
    approvedDate: null,
    notes: "Discount >20% — escalated to L2 Director. Pending approval.",
    opportunityName: "Wipro-Pro License Deal"
  },
  {
    // 🔵 PADDED — Infosys Support Add-On
    id: "Q-00003",
    customer: "Infosys",
    customerId: "C001",
    product: "Support Package",
    productId: "P004",
    unitPrice: 3000,
    quantity: 100,
    volumeDiscount: 10,
    additionalDiscount: 8,
    listAmount: 300000,
    netAmount: 248400,
    status: "Approved",
    approver: null,
    approvalLevel: null,
    submittedDate: "2026-04-10",
    approvedDate: "2026-04-11",
    notes: "Support add-on for existing Infosys enterprise contract. Auto-approved.",
    opportunityName: "Infosys — Support Renewal 2026"
  },
  {
    // 🔵 PADDED — TCS Basic Volume Deal
    id: "Q-00004",
    customer: "TCS",
    customerId: "C003",
    product: "Basic Plan",
    productId: "P001",
    unitPrice: 2000,
    quantity: 200,
    volumeDiscount: 10,
    additionalDiscount: 12,
    listAmount: 400000,
    netAmount: 316800,
    status: "Approved",
    approver: "Rahul Sharma",
    approvalLevel: "L1",
    submittedDate: "2026-04-12",
    approvedDate: "2026-04-13",
    notes: "Volume deal for TCS internal tooling team.",
    opportunityName: "TCS — Basic Volume Deal"
  },
  {
    // 🔵 PADDED — Wipro Enterprise Expansion
    id: "Q-00005",
    customer: "Wipro",
    customerId: "C002",
    product: "Enterprise Plan",
    productId: "P003",
    unitPrice: 12000,
    quantity: 50,
    volumeDiscount: 0,
    additionalDiscount: 22,
    listAmount: 600000,
    netAmount: 421200,
    status: "Rejected",
    approver: "Priya Mehta",
    approvalLevel: "L2",
    submittedDate: "2026-04-14",
    approvedDate: "2026-04-15",
    notes: "Rejected at L2 — margin below threshold for this deal size.",
    opportunityName: "Wipro — Enterprise Expansion Q2"
  },
  {
    // 🔵 PADDED — Infosys Pro Draft
    id: "Q-00006",
    customer: "Infosys",
    customerId: "C001",
    product: "Pro Plan",
    productId: "P002",
    unitPrice: 5000,
    quantity: 80,
    volumeDiscount: 0,
    additionalDiscount: 0,
    listAmount: 400000,
    netAmount: 400000,
    status: "Draft",
    approver: null,
    approvalLevel: null,
    submittedDate: "2026-04-21",
    approvedDate: null,
    notes: "Draft quote for Infosys new business unit. Not yet submitted.",
    opportunityName: "Infosys — Pro Pilot 2026"
  }
];

// ─── APPROVAL HISTORY ───────────────────────────────────────
// Based on real org approval history screenshots
const APPROVAL_HISTORY = [
  {
    // Q-00000: Infosys — Auto-Approved (5% discount, within 0-10% range)
    quoteId: "Q-00000",
    steps: [
      { step: "Approval Request Submitted", actor: "Nainy Agrawal",  date: "2026-04-06", comment: "Submitted for approval", status: "Completed" },
      { step: "Auto-Approval",              actor: "System",         date: "2026-04-06", comment: "Standard discount (5%). Auto-approved.", status: "Approved" }
    ]
  },
  {
    // Q-00001: TCS — Auto-Approved (5% discount, within 0-10% range)
    quoteId: "Q-00001",
    steps: [
      { step: "Approval Request Submitted", actor: "Nainy Agrawal",  date: "2026-04-08", comment: "Submitted for approval", status: "Completed" },
      { step: "Auto-Approval",              actor: "System",         date: "2026-04-08", comment: "Standard discount (5%). Auto-approved.", status: "Approved" }
    ]
  },
  {
    // Q-00002: Wipro — L2 Pending (25% discount > 20%)
    quoteId: "Q-00002",
    steps: [
      { step: "Approval Request Submitted", actor: "Nainy Agrawal",  date: "2026-04-19", comment: "Submitted for approval", status: "Completed" },
      { step: "L1 Manager Approval",        actor: "Rahul Sharma",   date: "2026-04-19", comment: "Discount >20%. Escalating to Director.", status: "Escalated" },
      { step: "L2 Director Approval",       actor: "Priya Mehta",    date: null,         comment: "Pending Director review", status: "Pending" }
    ]
  },
  {
    // Q-00003: Infosys Support — Auto-Approved (8% discount, within 0-10% range)
    quoteId: "Q-00003",
    steps: [
      { step: "Approval Request Submitted", actor: "Nainy Agrawal",  date: "2026-04-10", comment: "Submitted for approval", status: "Completed" },
      { step: "Auto-Approval",              actor: "System",         date: "2026-04-11", comment: "Standard discount (8%). Auto-approved.", status: "Approved" }
    ]
  },
  {
    // Q-00004: TCS Basic — L1 Approved (12% discount, 10-20% range)
    quoteId: "Q-00004",
    steps: [
      { step: "Approval Request Submitted", actor: "Nainy Agrawal",  date: "2026-04-12", comment: "Submitted for approval", status: "Completed" },
      { step: "L1 Manager Approval",        actor: "Rahul Sharma",   date: "2026-04-13", comment: "12% discount within L1 range. Approved.", status: "Approved" }
    ]
  },
  {
    // Q-00005: Wipro Enterprise — L2 Rejected (22% discount > 20%)
    quoteId: "Q-00005",
    steps: [
      { step: "Approval Request Submitted", actor: "Nainy Agrawal",  date: "2026-04-14", comment: "Submitted for approval", status: "Completed" },
      { step: "L1 Manager Approval",        actor: "Rahul Sharma",   date: "2026-04-14", comment: "Discount >20%. Escalating to Director.", status: "Escalated" },
      { step: "L2 Director Approval",       actor: "Priya Mehta",    date: "2026-04-15", comment: "Margin too low for deal size. Rejected.", status: "Rejected" }
    ]
  }
];

// ─── ANALYTICS ──────────────────────────────────────────────
// Dynamically computed from QUOTES data — ensures consistency
// Recalculated for live data in api.js rebuildAnalyticsFromQuotes()
const ANALYTICS = (function() {
  const statusColors = { "Approved": "#059669", "In Review": "#D97706", "Rejected": "#DC2626", "Draft": "#6B7280" };

  // Revenue by Product
  const revByProd = {};
  QUOTES.forEach(q => {
    revByProd[q.product] = (revByProd[q.product] || 0) + (q.netAmount || 0);
  });

  // Quotes by Status
  const statusCounts = {};
  const statusDiscountSums = {};
  QUOTES.forEach(q => {
    statusCounts[q.status] = (statusCounts[q.status] || 0) + 1;
    statusDiscountSums[q.status] = (statusDiscountSums[q.status] || 0) + (q.additionalDiscount || 0);
  });

  // Margin by Opportunity — deduplicate by opportunity name
  // Multiple quotes on the same opportunity should only be counted once
  const seenOpps = {};
  QUOTES.forEach(q => {
    const oppName = q.opportunityName || q.id;
    if (!seenOpps[oppName]) {
      let profitMargin = 0;
      if (q.opportunityProfitMargin !== null && q.opportunityProfitMargin !== undefined) {
        profitMargin = parseFloat(q.opportunityProfitMargin) || 0;
      } else if (q.listAmount > 0) {
        profitMargin = Math.round(((q.listAmount - q.netAmount) / q.listAmount) * 1000) / 10;
      }
      seenOpps[oppName] = { margin: profitMargin };
    }
  });

  // Revenue by Account — deduplicate by opportunity name per account
  // If multiple quotes share the same opportunity, count the amount only once
  const seenOppsByAcct = {};
  const revByAcct = {};
  QUOTES.forEach(q => {
    const oppName = q.opportunityName || q.id;
    const acctName = q.customer;
    const key = acctName + '|||' + oppName;
    if (seenOppsByAcct[key]) return;
    seenOppsByAcct[key] = true;
    const amount = q.opportunityAmount || q.netAmount || 0;
    revByAcct[acctName] = (revByAcct[acctName] || 0) + amount;
  });

  return {
    revenueByProduct: Object.entries(revByProd).map(([product, revenue]) => ({ product, revenue })),
    quotesByStatus: Object.entries(statusCounts).map(([status, count]) => ({
      status, count, discountSum: statusDiscountSums[status] || 0, color: statusColors[status] || "#6B7280"
    })),
    marginByOpportunity: Object.entries(seenOpps).map(([opportunity, data]) => ({
      opportunity, margin: Math.round(data.margin * 10) / 10
    })),
    revenueByAccount: Object.entries(revByAcct).map(([account, revenue]) => ({ account, revenue }))
  };
})();

// ─── STATUS CONFIG ───────────────────────────────────────────
const STATUS_CONFIG = {
  "Draft":     { color: "#6B7280", bg: "#F3F4F6", label: "Draft"     },
  "In Review": { color: "#D97706", bg: "#FEF3C7", label: "In Review" },
  "Approved":  { color: "#059669", bg: "#D1FAE5", label: "Approved"  },
  "Rejected":  { color: "#DC2626", bg: "#FEE2E2", label: "Rejected"  }
};

// ─── CPQ Modules (Landing Page Cards) ─────────────────────────
const MODULES = [
  { icon: "box", title: "Product Catalog", description: "Centralized product & pricing management", link: "catalog.html" },
  { icon: "calculator", title: "Quote Calculator", description: "Real-time pricing with discount tiers", link: "calculator.html" },
  { icon: "check-circle", title: "Approval Engine", description: "Multi-level automated approval workflows", link: "approval.html" },
  { icon: "bar-chart-3", title: "Analytics Hub", description: "Revenue, margin & discount analytics", link: "dashboards.html" },
  { icon: "users", title: "Customer Accounts", description: "360° customer visibility & history", link: "customers.html" },
  { icon: "settings", title: "Configuration", description: "Rules engine & guided selling setup", link: "configuration.html" }
];

// ─── BACKWARD-COMPATIBLE ALIAS ──────────────────────────────
const DISCOUNT_TIERS = DISCOUNT_RULES.map(r => ({
  min: r.minQty,
  max: r.maxQty === null ? Infinity : r.maxQty,
  discount: r.volumeDiscount,
  label: r.label
}));

// ─── Helper Functions ──────────────────────────────────────────
function getDiscountTier(quantity) {
  return DISCOUNT_TIERS.find(t => quantity >= t.min && quantity <= t.max) || DISCOUNT_TIERS[0];
}

// NOTE: Approval is determined solely by ADDITIONAL discount, NOT volume+additional.
function getApprovalLevel(additionalDiscountPercent) {
  return APPROVAL_RULES.find(r => additionalDiscountPercent >= r.min && additionalDiscountPercent < r.max)
    || APPROVAL_RULES[APPROVAL_RULES.length - 1];
}

function calculateNetPrice(listPrice, quantity, volumeDiscountPercent, additionalDiscountPercent) {
  const subtotal = listPrice * quantity;
  const totalDiscount = Math.min(volumeDiscountPercent + additionalDiscountPercent, 100);
  return subtotal * (1 - totalDiscount / 100);
}

// ─── Utility Functions ─────────────────────────────────────────
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatNumber(num) {
  return new Intl.NumberFormat("en-US").format(num);
}

// ─── Animated Counter ──────────────────────────────────────────
function animateCounter(element, target, duration = 1500) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    if (element.dataset.format === "currency") {
      element.textContent = formatCurrency(current);
    } else if (element.dataset.format === "percent") {
      element.textContent = current + "%";
    } else {
      element.textContent = formatNumber(current);
    }
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initStatCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.counter));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(el => observer.observe(el));
}

// ─── Shared App Init ───────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Mobile navbar toggle
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("active");
      toggle.classList.toggle("active");
    });
    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("active");
        toggle.classList.remove("active");
      });
    });
  }

  // Active nav link highlighting
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // Scroll-triggered fade-in animations
  const fadeElements = document.querySelectorAll(".fade-in");
  if (fadeElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    fadeElements.forEach(el => observer.observe(el));
  }
});
