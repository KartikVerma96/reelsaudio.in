# 📝 How to Create .env.production File

## ✅ Method 1: Using nano (Creates file if it doesn't exist)

```bash
nano .env.production
```

**Then:**
1. Type or paste this content:
   ```env
   NEXT_PUBLIC_SITE_URL=https://freereelsdownload.com
   NODE_ENV=production
   ```

2. Save: Press `Ctrl+X`, then `Y`, then `Enter`

---

## ✅ Method 2: Using echo (Faster - Creates file directly)

```bash
cat > .env.production << EOF
NEXT_PUBLIC_SITE_URL=https://freereelsdownload.com
NODE_ENV=production
EOF
```

**This creates the file instantly!**

---

## ✅ Method 3: Using printf

```bash
printf "NEXT_PUBLIC_SITE_URL=https://freereelsdownload.com\nNODE_ENV=production\n" > .env.production
```

---

## ✅ Verify the file was created:

```bash
cat .env.production
```

**Should show:**
```
NEXT_PUBLIC_SITE_URL=https://freereelsdownload.com
NODE_ENV=production
```

---

## 💡 Recommended: Use Method 2 (echo)

It's the fastest and easiest!

```bash
cd /var/www/freereelsdownload
cat > .env.production << EOF
NEXT_PUBLIC_SITE_URL=https://freereelsdownload.com
NODE_ENV=production
EOF
```

Then verify:
```bash
cat .env.production
```

