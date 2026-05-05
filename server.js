const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = 8081;

// MIME types for static file serving
const MIME_TYPES = {
  ".html": "text/html",
  ".css":  "text/css",
  ".js":   "application/javascript",
  ".json": "application/json",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
};

const server = http.createServer((req, res) => {
  // ── CORS headers ──
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-instance-url");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // ── POST /token — OAuth token exchange ──
  if (req.method === "POST" && req.url === "/token") {
    let body = "";
    req.on("data", chunk => { body += chunk.toString(); });
    req.on("end", () => {
      console.log("📨 Token request received");
      const options = {
        hostname: "login.salesforce.com",
        path: "/services/oauth2/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      };
      const sfReq = https.request(options, sfRes => {
        let data = "";
        sfRes.on("data", chunk => { data += chunk; });
        sfRes.on("end", () => {
          console.log("🔁 Token status:", sfRes.statusCode);
          res.writeHead(sfRes.statusCode, { "Content-Type": "application/json" });
          res.end(data);
        });
      });
      sfReq.on("error", err => {
        console.error("❌ Token error:", err.message);
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
      });
      sfReq.write(body);
      sfReq.end();
    });

  // ── GET /query — Salesforce REST API proxy ──
  } else if (req.method === "GET" && req.url.startsWith("/query")) {
    const token = req.headers.authorization;
    const instanceUrl = req.headers["x-instance-url"];

    if (!token || !instanceUrl) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "Missing token or instance URL" }));
      return;
    }

    const soql = req.url.replace("/query?q=", "");
    const sfUrl = new URL(instanceUrl + "/services/data/v59.0/query?q=" + soql);

    console.log("📡 Querying Salesforce:", decodeURIComponent(soql).substring(0, 100) + "...");

    const options = {
      hostname: sfUrl.hostname,
      path: sfUrl.pathname + sfUrl.search,
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };

    const sfReq = https.request(options, sfRes => {
      let data = "";
      sfRes.on("data", chunk => { data += chunk; });
      sfRes.on("end", () => {
        console.log("🔁 Query status:", sfRes.statusCode);
        res.writeHead(sfRes.statusCode, { "Content-Type": "application/json" });
        res.end(data);
      });
    });

    sfReq.on("error", err => {
      console.error("❌ Query error:", err.message);
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    });

    sfReq.end();

  // ── Static file serving ──
  } else {
    let filePath = req.url.split("?")[0]; // strip query params
    if (filePath === "/") filePath = "/index.html";

    const fullPath = path.join(__dirname, filePath);
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(fullPath, (err, content) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.writeHead(404);
          res.end("Not found: " + filePath);
        } else {
          res.writeHead(500);
          res.end("Server error");
        }
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`\n✅ QuoteFlow Pro running at http://localhost:${PORT}`);
  console.log(`   📁 Static files served from: ${__dirname}`);
  console.log(`   🔑 OAuth proxy: /token`);
  console.log(`   📡 SOQL proxy:  /query\n`);
});