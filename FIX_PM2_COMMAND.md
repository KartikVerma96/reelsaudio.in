# 🔧 Fix PM2 - Use Standalone Server

## ❌ Current Issue:
PM2 is still running `npm start` (which runs `next start`) instead of the standalone server.

## ✅ Complete Fix:

### Step 1: Stop and delete PM2 process
```bash
pm2 stop freereelsdownload
pm2 delete freereelsdownload
```

### Step 2: Navigate to project directory
```bash
cd /var/www/freereelsdownload
```

### Step 3: Verify standalone server exists
```bash
ls -la .next/standalone/server.js
```

**Should show:** The file exists

### Step 4: Start PM2 with standalone server (CORRECT way)
```bash
pm2 start .next/standalone/server.js --name "freereelsdownload"
```

**OR if that doesn't work, use:**
```bash
pm2 start node --name "freereelsdownload" -- .next/standalone/server.js
```

### Step 5: Save PM2 configuration
```bash
pm2 save
```

### Step 6: Check status
```bash
pm2 status
pm2 logs freereelsdownload --lines 20
```

**Should show:** No warnings, just "Ready" messages

### Step 7: Test
```bash
curl http://localhost:3000
```

---

## 🔍 Verify PM2 is using correct command:

```bash
pm2 describe freereelsdownload
```

**Should show:** `script: .next/standalone/server.js` (NOT `npm start`)

---

## 🚨 If standalone server doesn't exist:

You might need to rebuild:

```bash
cd /var/www/freereelsdownload
npm run build
ls -la .next/standalone/server.js
```

Then start PM2 again with the command above.

