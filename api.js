// QuoteFlow Pro — api.js

const CLIENT_ID = "3MVG97L7PWbPq6Uzia5iRXCZztIWa4eNJAsRRE1Z07eKRwkIDwu68yuYRskeiLmNy4Kxg2kb.EWUcHL_80D0c";
const REDIRECT_URI = "http://localhost:8081/callback.html";
const SF_VERSION = "v59.0";
const PROXY = "http://localhost:8081";

function isLoggedIn() {
  return !!sessionStorage.getItem("sf_access_token");
}
function getToken() {
  return sessionStorage.getItem("sf_access_token");
}
function getInstanceUrl() {
  return sessionStorage.getItem("sf_instance_url");
}

function connectToSalesforce() {
  const authUrl =
    "https://login.salesforce.com/services/oauth2/authorize" +
    "?response_type=code" +
    "&client_id=" + encodeURIComponent(CLIENT_ID) +
    "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
    "&scope=full+refresh_token";
  window.location.href = authUrl;
}

function logout() {
  sessionStorage.removeItem("sf_access_token");
  sessionStorage.removeItem("sf_instance_url");
  sessionStorage.removeItem("sf_token_type");
  window.location.href = "index.html";
}

async function sfQuery(soql) {
  const token = getToken();
  const instanceUrl = getInstanceUrl();
  if (!token || !instanceUrl) throw new Error("Not authenticated.");

  const res = await fetch(
    PROXY + "/query?q=" + encodeURIComponent(soql),
    {
      headers: {
        Authorization: "Bearer " + token,
        "x-instance-url": instanceUrl,
      },
    }
  );

  if (res.status === 401) { logout(); throw new Error("Session expired."); }
  if (!res.ok) { const err = await res.json(); throw new Error(err[0]?.message || "API error"); }
  return (await res.json()).records;
}

async function fetchProducts() {
  return await sfQuery(`SELECT Id, Name, ProductCode, Description FROM Product2 WHERE IsActive = true ORDER BY Name`);
}

async function fetchQuotes() {
  // Try with Opportunity relationship fields (including Profit Margin) first
  try {
    return await sfQuery(`SELECT Id, Name, SBQQ__Status__c, SBQQ__Account__r.Name, SBQQ__NetAmount__c, SBQQ__ListAmount__c, SBQQ__AdditionalDiscountAmount__c, SBQQ__CustomerDiscount__c, SBQQ__Opportunity2__r.Name, SBQQ__Opportunity2__r.Amount, SBQQ__Opportunity2__r.Profit_Margin__c, CreatedDate FROM SBQQ__Quote__c ORDER BY CreatedDate DESC`);
  } catch (e1) {
    // Profit_Margin__c may not exist — retry without it
    try {
      console.warn("⚠️ Profit_Margin__c not available, retrying without it");
      return await sfQuery(`SELECT Id, Name, SBQQ__Status__c, SBQQ__Account__r.Name, SBQQ__NetAmount__c, SBQQ__ListAmount__c, SBQQ__AdditionalDiscountAmount__c, SBQQ__CustomerDiscount__c, SBQQ__Opportunity2__r.Name, SBQQ__Opportunity2__r.Amount, CreatedDate FROM SBQQ__Quote__c ORDER BY CreatedDate DESC`);
    } catch (e2) {
      console.warn("⚠️ Opportunity fields not available, retrying without them");
      return await sfQuery(`SELECT Id, Name, SBQQ__Status__c, SBQQ__Account__r.Name, SBQQ__NetAmount__c, SBQQ__ListAmount__c, SBQQ__AdditionalDiscountAmount__c, SBQQ__CustomerDiscount__c, CreatedDate FROM SBQQ__Quote__c ORDER BY CreatedDate DESC`);
    }
  }
}

async function fetchAccounts() {
  return await sfQuery(`SELECT Id, Name, Industry, Customer_Segment__c, Phone, BillingCity FROM Account WHERE Name IN ('Infosys', 'Wipro', 'TCS') ORDER BY Name`);
}

async function fetchApprovalHistory() {
  return await sfQuery(`SELECT Id, TargetObject.Name, Status, CreatedDate, LastActor.Name FROM ProcessInstance ORDER BY CreatedDate DESC LIMIT 20`);
}

async function fetchQuoteLines() {
  return await sfQuery(`SELECT Id, SBQQ__Quote__r.Name, SBQQ__Product__r.Name, SBQQ__Quantity__c, SBQQ__NetPrice__c, SBQQ__Discount__c, SBQQ__ListPrice__c FROM SBQQ__QuoteLine__c ORDER BY SBQQ__Quote__r.Name`);
}

function updateAuthButton() {
  const btn = document.getElementById("connectBtn");
  if (!btn) return;
  if (isLoggedIn()) {
    btn.textContent = "🟢 Connected";
    btn.onclick = logout;
    btn.style.background = "#00d084";
    btn.style.color = "#000";
  } else {
    btn.textContent = "Connect to Salesforce";
    btn.onclick = connectToSalesforce;
    btn.style.background = "";
    btn.style.color = "";
  }
}

function mapSFStatus(s) {
  if (!s) return "Draft";
  s = s.toLowerCase();
  if (s.includes("approved")) return "Approved";
  if (s.includes("review") || s.includes("presented")) return "In Review";
  if (s.includes("rejected") || s.includes("denied")) return "Rejected";
  return "Draft";
}

function showDataSource(type) {
  let el = document.getElementById("data-source-badge");
  if (!el) {
    el = document.createElement("div");
    el.id = "data-source-badge";
    el.style.cssText = "position:fixed;bottom:16px;right:16px;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;z-index:9999;box-shadow:0 2px 8px rgba(0,0,0,0.15);cursor:pointer;";
    el.title = "Live Salesforce demo available on request";
    el.onclick = () => alert("Live Salesforce integration available.\nContact for a connected demo on localhost.");
    document.body.appendChild(el);
  }
  if (type === "live") { el.style.background = "#D1FAE5"; el.style.color = "#059669"; el.textContent = "🟢 Live: Salesforce Connected"; }
  else if (type === "loading") { el.style.background = "#FEF3C7"; el.style.color = "#B8860B"; el.textContent = "⏳ Connecting..."; }
  else if (type === "error") { el.style.background = "#FEE2E2"; el.style.color = "#DC2626"; el.textContent = "⚠️ SF Connection Error"; }
  else { el.style.background = "#EEF2FF"; el.style.color = "#505081"; el.textContent = "🔵 Demo Mode"; }
}

async function tryLoadLiveData() {
  updateAuthButton();

  if (!isLoggedIn()) {
    showDataSource("mock");
    return false;
  }

  showDataSource("loading");

  try {
    // Fetch quotes and quote lines in parallel
    const [sfQuotes, sfLines] = await Promise.all([
      fetchQuotes(),
      fetchQuoteLines()
    ]);

    // Log first raw line for debugging
    if (sfLines.length > 0) {
      const sample = sfLines[0];
      console.log("📋 Raw SF QuoteLine sample:", JSON.stringify({
        Quote: sample.SBQQ__Quote__r?.Name,
        Product: sample.SBQQ__Product__r?.Name,
        Qty: sample.SBQQ__Quantity__c,
        ListPrice: sample.SBQQ__ListPrice__c,
        NetPrice: sample.SBQQ__NetPrice__c,
        Discount: sample.SBQQ__Discount__c
      }));
    }

    // Log ALL raw quote fields for debugging
    if (sfQuotes.length > 0) {
      sfQuotes.forEach(sq => {
        console.log(`📋 RAW QUOTE ${sq.Name}:`, JSON.stringify({
          Status: sq.SBQQ__Status__c,
          NetAmount: sq.SBQQ__NetAmount__c,
          ListAmount: sq.SBQQ__ListAmount__c,
          AdditionalDiscountAmount: sq.SBQQ__AdditionalDiscountAmount__c,
          CustomerDiscount: sq.SBQQ__CustomerDiscount__c
        }));
      });
    }

    // Build lookup: quote name → ALL line items
    const lineMap = {};
    sfLines.forEach(l => {
      const qn = l.SBQQ__Quote__r?.Name;
      if (!qn) return;
      if (!lineMap[qn]) lineMap[qn] = [];
      lineMap[qn].push({
        product: l.SBQQ__Product__r?.Name || "—",
        qty: l.SBQQ__Quantity__c || 0,
        netPrice: l.SBQQ__NetPrice__c || 0,
        listPrice: l.SBQQ__ListPrice__c || 0,
        discount: l.SBQQ__Discount__c
      });
    });

    // Clear QUOTES and fill with live data
    QUOTES.length = 0;
    sfQuotes.forEach(q => {
      const lines = lineMap[q.Name] || [];
      const productNames = lines.length
        ? lines.map(l => l.product).join(", ")
        : "—";
      const totalQty = lines.reduce((s, l) => s + l.qty, 0);
      const totalListAmount = lines.reduce((s, l) => s + (l.listPrice * l.qty), 0);
      const netAmount = q.SBQQ__NetAmount__c || 0;
      const sfListAmount = q.SBQQ__ListAmount__c || totalListAmount;
      const addlDiscAmt = q.SBQQ__AdditionalDiscountAmount__c;
      const custDiscount = q.SBQQ__CustomerDiscount__c;

      // --- Get additional discount percentage ---
      let additionalDiscountPct = 0;

      // Priority 1: SBQQ__CustomerDiscount__c (percentage field on Quote header)
      if (custDiscount !== null && custDiscount !== undefined && custDiscount > 0 && custDiscount <= 100) {
        additionalDiscountPct = Math.round(custDiscount);
      }

      // Priority 2: Compute from AdditionalDiscountAmount (dollar) using correct CPQ formula
      // In CPQ, additional discount is applied AFTER volume discount
      // So: PostVolumeAmount = NetAmount + AdditionalDiscountAmount
      // And: AdditionalDiscount% = AdditionalDiscountAmount / PostVolumeAmount * 100
      if (additionalDiscountPct === 0 && addlDiscAmt !== null && addlDiscAmt !== undefined && addlDiscAmt > 0 && netAmount > 0) {
        const postVolumeAmount = netAmount + addlDiscAmt;
        additionalDiscountPct = Math.round((addlDiscAmt / postVolumeAmount) * 100);
      }

      // Priority 3: Calculate from list vs net amounts (total discount)
      if (additionalDiscountPct === 0 && sfListAmount > 0 && sfListAmount > netAmount) {
        additionalDiscountPct = Math.round((1 - netAmount / sfListAmount) * 100);
      }

      // Get opportunity name, amount, and profit margin from relationship (if available)
      const oppName = q.SBQQ__Opportunity2__r?.Name || q.Name;
      const oppAmount = q.SBQQ__Opportunity2__r?.Amount || netAmount;
      const oppProfitMargin = q.SBQQ__Opportunity2__r?.Profit_Margin__c ?? null;

      console.log(`  → ${q.Name}: opp="${oppName}", oppAmt=${oppAmount}, custDisc=${custDiscount}, addlDiscAmt=${addlDiscAmt}, → final=${additionalDiscountPct}%`);

      const mappedStatus = mapSFStatus(q.SBQQ__Status__c);

      // Build approval history from live status
      const submittedDate = q.CreatedDate ? q.CreatedDate.substring(0, 10) : null;
      const approvalInfo = getApprovalLevel(additionalDiscountPct);

      QUOTES.push({
        id: q.Name || q.Id,
        customer: q.SBQQ__Account__r?.Name || "Unknown",
        customerId: "",
        product: productNames,
        productId: "",
        unitPrice: 0,
        quantity: totalQty,
        volumeDiscount: 0,
        additionalDiscount: additionalDiscountPct,
        listAmount: totalListAmount,
        netAmount: netAmount,
        status: mappedStatus,
        approver: approvalInfo.level === "Auto" ? null : (approvalInfo.level === "L1" ? "Rahul Sharma" : "Priya Mehta"),
        approvalLevel: approvalInfo.level === "Auto" ? null : approvalInfo.level,
        submittedDate: submittedDate,
        approvedDate: mappedStatus === "Approved" ? submittedDate : null,
        notes: "",
        opportunityName: oppName,
        opportunityAmount: oppAmount,
        opportunityProfitMargin: oppProfitMargin,
        // Store raw lines for detail view
        lines: lines,
        // Store the raw SF status for timeline
        sfStatus: q.SBQQ__Status__c
      });
    });

    // ── Rebuild ANALYTICS from live QUOTES ──
    rebuildAnalyticsFromQuotes();

    // ── Rebuild APPROVAL_HISTORY from live QUOTES ──
    rebuildApprovalHistory();

    // ── Update homepage stats from live data ──
    updateHomepageStats();

    console.log("✅ Live data loaded:", QUOTES.length, "quotes");
    showDataSource("live");
    return true;

  } catch (err) {
    console.warn("⚠️ SF fetch failed, using mock data:", err.message);
    showDataSource("error");
    return false;
  }
}

// ── Rebuild ANALYTICS from live QUOTES data ──
function rebuildAnalyticsFromQuotes() {
  // Revenue by Product: sum of (netPrice × qty) per product across all quote lines
  const revByProd = {};
  QUOTES.forEach(q => {
    if (q.lines && q.lines.length) {
      q.lines.forEach(l => {
        // netPrice is per-unit — must multiply by quantity for total revenue
        revByProd[l.product] = (revByProd[l.product] || 0) + ((l.netPrice || 0) * (l.qty || 0));
      });
    } else {
      // Fallback for mock data without lines — use quote netAmount
      revByProd[q.product] = (revByProd[q.product] || 0) + (q.netAmount || 0);
    }
  });
  ANALYTICS.revenueByProduct = Object.entries(revByProd).map(([product, revenue]) => ({ product, revenue }));

  // Quotes by Status (doughnut) — uses additionalDiscount sum per status
  const statusCounts = {};
  const statusDiscountSums = {};
  const statusColors = { "Approved": "#059669", "In Review": "#D97706", "Rejected": "#DC2626", "Draft": "#6B7280" };
  QUOTES.forEach(q => {
    statusCounts[q.status] = (statusCounts[q.status] || 0) + 1;
    statusDiscountSums[q.status] = (statusDiscountSums[q.status] || 0) + (q.additionalDiscount || 0);
  });
  ANALYTICS.quotesByStatus = Object.entries(statusCounts).map(([status, count]) => ({
    status, count, discountSum: statusDiscountSums[status] || 0, color: statusColors[status] || "#6B7280"
  }));

  // ── Margin by Opportunity ──
  // Deduplicate by opportunity name: multiple quotes on the same opportunity
  // should only be counted once. Uses Opportunity.Profit_Margin__c if available,
  // otherwise falls back to computing from quote list/net amounts.
  const seenOpps = {};  // oppName → { margin, amount, count }
  QUOTES.forEach(q => {
    const oppName = q.opportunityName || q.id;
    if (!seenOpps[oppName]) {
      // First time seeing this opportunity — calculate or use fetched margin
      let profitMargin = 0;
      if (q.opportunityProfitMargin !== null && q.opportunityProfitMargin !== undefined) {
        // Use the Opportunity's Profit Margin field directly (from SF)
        profitMargin = parseFloat(q.opportunityProfitMargin) || 0;
      } else if (q.listAmount > 0) {
        // Fallback: calculate from quote list vs net amounts
        profitMargin = Math.round(((q.listAmount - q.netAmount) / q.listAmount) * 1000) / 10;
      }
      seenOpps[oppName] = { margin: profitMargin, amount: q.opportunityAmount || q.netAmount || 0, count: 1 };
    }
    // If we've already seen this opp, skip (deduplicate)
  });
  ANALYTICS.marginByOpportunity = Object.entries(seenOpps).map(([opportunity, data]) => ({
    opportunity,
    margin: Math.round(data.margin * 10) / 10
  }));

  // ── Revenue by Account ──
  // Deduplicate by opportunity name: if multiple quotes share the same opportunity,
  // count that opportunity's amount only once (matches Salesforce "Sum of Opportunity: Amount").
  const seenOppsByAcct = {};  // track which opps we've already counted
  const revByAcct = {};
  QUOTES.forEach(q => {
    const oppName = q.opportunityName || q.id;
    const acctName = q.customer;
    const key = acctName + '|||' + oppName;
    if (seenOppsByAcct[key]) return;  // already counted this opp for this account
    seenOppsByAcct[key] = true;
    const amount = q.opportunityAmount || q.netAmount || 0;
    revByAcct[acctName] = (revByAcct[acctName] || 0) + amount;
  });
  ANALYTICS.revenueByAccount = Object.entries(revByAcct).map(([account, revenue]) => ({ account, revenue }));
}

// ── Rebuild APPROVAL_HISTORY from live QUOTES ──
function rebuildApprovalHistory() {
  APPROVAL_HISTORY.length = 0;
  QUOTES.forEach(q => {
    const steps = [];
    // Step 1: Submission
    if (q.status !== "Draft") {
      steps.push({
        step: "Approval Request Submitted",
        actor: "Nainy Agrawal",
        date: q.submittedDate,
        comment: "Submitted for approval",
        status: "Completed"
      });
    }

    const addlDisc = q.additionalDiscount || 0;

    if (q.status === "Approved") {
      if (addlDisc > 20) {
        // L2 path: L1 escalated, then L2 approved
        steps.push({
          step: "L1 Manager Approval",
          actor: "Rahul Sharma",
          date: q.submittedDate,
          comment: "Discount >" + "20%. Escalating to Director.",
          status: "Escalated"
        });
        steps.push({
          step: "L2 Director Approval",
          actor: "Priya Mehta",
          date: q.approvedDate,
          comment: "Approved at Director level.",
          status: "Approved"
        });
      } else if (addlDisc > 10) {
        // L1 approved
        steps.push({
          step: "L1 Manager Approval",
          actor: "Rahul Sharma",
          date: q.approvedDate,
          comment: "Additional discount within L1 range. Approved.",
          status: "Approved"
        });
      } else {
        // Auto-approved
        steps.push({
          step: "Auto-Approval",
          actor: "System",
          date: q.approvedDate,
          comment: "Standard discount. Auto-approved.",
          status: "Approved"
        });
      }
    } else if (q.status === "In Review") {
      if (addlDisc > 20) {
        steps.push({
          step: "L1 Manager Approval",
          actor: "Rahul Sharma",
          date: q.submittedDate,
          comment: "Discount >" + "20%. Escalating to Director.",
          status: "Escalated"
        });
        steps.push({
          step: "L2 Director Approval",
          actor: "Priya Mehta",
          date: null,
          comment: "Pending Director review",
          status: "Pending"
        });
      } else if (addlDisc > 10) {
        steps.push({
          step: "L1 Manager Approval",
          actor: "Rahul Sharma",
          date: null,
          comment: "Pending Manager review",
          status: "Pending"
        });
      }
    } else if (q.status === "Rejected") {
      if (addlDisc > 20) {
        steps.push({
          step: "L1 Manager Approval",
          actor: "Rahul Sharma",
          date: q.submittedDate,
          comment: "Discount >" + "20%. Escalating to Director.",
          status: "Escalated"
        });
        steps.push({
          step: "L2 Director Approval",
          actor: "Priya Mehta",
          date: q.approvedDate,
          comment: "Margin too low. Rejected.",
          status: "Rejected"
        });
      } else {
        steps.push({
          step: "L1 Manager Approval",
          actor: "Rahul Sharma",
          date: q.approvedDate,
          comment: "Rejected at L1.",
          status: "Rejected"
        });
      }
    }

    if (steps.length > 0) {
      APPROVAL_HISTORY.push({ quoteId: q.id, steps });
    }
  });
}

// ── Calculate and update homepage stat counters ──
function updateHomepageStats() {
  const totalRevenue = QUOTES.reduce((s, q) => s + (q.netAmount || 0), 0);
  const totalQuotes = QUOTES.length;
  const totalProducts = typeof PRODUCTS !== "undefined" ? PRODUCTS.length : 4;

  // Average margin: (listAmount - netAmount) / listAmount * 100
  const totalList = QUOTES.reduce((s, q) => s + (q.listAmount || 0), 0);
  const totalNet = QUOTES.reduce((s, q) => s + (q.netAmount || 0), 0);
  const avgMargin = totalList > 0 ? Math.round(((totalList - totalNet) / totalList) * 100) : 0;

  const revEl = document.getElementById("stat-revenue");
  const qEl = document.getElementById("stat-quotes");
  const mEl = document.getElementById("stat-margin");
  const pEl = document.getElementById("stat-products");

  if (revEl) revEl.dataset.counter = Math.round(totalRevenue);
  if (qEl) qEl.dataset.counter = totalQuotes;
  if (mEl) mEl.dataset.counter = avgMargin;
  if (pEl) pEl.dataset.counter = totalProducts;
}