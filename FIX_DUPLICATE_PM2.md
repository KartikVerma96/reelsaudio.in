# 🔧 Fix Duplicate PM2 Process

## ❌ Problem:
You have **2 processes** with the same name:
- **Process 0**: ✅ Correct (using `.next/standalone/server.js`)
- **Process 1**: ❌ Wrong (trying to run `npm start`, which fails with standalone)

## ✅ Solution:

### Step 1: Stop the duplicate errored process
```bash
pm2 delete 1
```

### Step 2: Verify only the correct process is running
```bash
pm2 status
```

**Should show:** Only process 0 (the correct one)

### Step 3: Save the correct configuration
```bash
pm2 save
```

### Step 4: Check logs to confirm everything is fine
```bash
pm2 logs freereelsdownload --lines 10
```

---

## 🚫 What Happened?

You ran:
```bash
pm2 start npm --name "freereelsdownload" -- start
```

This tries to run `npm start`, which **doesn't work** with `output: 'standalone'`.

## ✅ Correct Way to Start (if needed):

If you ever need to restart, use:
```bash
pm2 restart freereelsdownload
```

**NOT:**
```bash
pm2 start npm --name "freereelsdownload" -- start  # ❌ WRONG
```

---

## 📝 Current Status:

- ✅ Process 0 is running correctly
- ❌ Process 1 needs to be deleted
- ✅ Your website is still working (process 0 handles it)

**Run the commands above to clean up!**

