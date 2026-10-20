# Free Deployment Guide — No Local Machine Needed

All three services are **100% free**. No credit card required.

```
Frontend  →  Vercel     (free)    https://vercel.com
Backend   →  Render     (free)    https://render.com
Database  →  Neon       (free)    https://neon.tech
```

Total setup time: ~20 minutes.

---

## STEP 1 — Push code to GitHub (required by Render + Vercel)

### 1A. Create a GitHub account (if you don't have one)
Go to https://github.com → Sign up → free account.

### 1B. Create a new repository
1. Click the **+** icon → **New repository**
2. Name it: `architect-portfolio`
3. Keep it **Public** (free deployment needs public repo on free tiers)
4. Click **Create repository**
5. GitHub shows you commands — copy the repo URL (looks like `https://github.com/yourname/architect-portfolio.git`)

### 1C. Upload code to GitHub
You have two options:

**Option A — GitHub web upload (easiest, no Git needed):**
1. Extract `architect-portfolio.zip` on your computer.
2. On your GitHub repo page, click **uploading an existing file**.
3. Drag the entire `architect-portfolio` folder contents.
4. Click **Commit changes**.

**Option B — Git command line:**
```bash
cd architect-portfolio
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOURNAME/architect-portfolio.git
git push -u origin main
```

---

## STEP 2 — Set up Free PostgreSQL on Neon

1. Go to https://neon.tech → **Sign up** (free, use GitHub login)
2. Click **New Project** → give it a name → **Create project**
3. On the dashboard, find **Connection Details**
4. Select **Connection string** → copy the string:
   ```
   postgresql://user:password@ep-xxx-xxx.neon.tech/neondb?sslmode=require
   ```
5. **Save these 3 values** (you'll need them in Step 3):
   - Full connection string (starts with `postgresql://`)
   - Username (after `postgresql://`)
   - Password (after the `:` before `@`)

   > **Tip:** Neon shows a **JDBC URL** toggle — click it to get the `jdbc:postgresql://...` format which Spring Boot needs directly.

---

## STEP 3 — Deploy Backend on Render

1. Go to https://render.com → **Sign up** (use GitHub login — easiest)
2. Click **New +** → **Web Service**
3. Connect your GitHub repo `architect-portfolio`
4. Fill in these settings:

   | Field            | Value                                             |
   |------------------|---------------------------------------------------|
   | Name             | `architect-portfolio-api`                         |
   | Runtime          | `Java`                                            |
   | Build Command    | `cd backend && mvn clean package -DskipTests`     |
   | Start Command    | `java -Dspring.profiles.active=prod -jar backend/target/architect-portfolio-1.0.0.jar` |
   | Instance Type    | **Free**                                          |

5. Scroll down to **Environment Variables** → click **Add Environment Variable** for each:

   | Key                      | Value                                      |
   |--------------------------|--------------------------------------------|
   | `SPRING_PROFILES_ACTIVE` | `prod`                                     |
   | `DATABASE_URL`           | Your Neon JDBC URL (jdbc:postgresql://...) |
   | `DB_USERNAME`            | Your Neon username                         |
   | `DB_PASSWORD`            | Your Neon password                         |
   | `FRONTEND_URL`           | (leave blank for now, fill after Step 4)   |

6. Click **Create Web Service**
7. Render will build and deploy — takes **3–5 minutes** first time.
8. When done, you'll see a URL like:
   ```
   https://architect-portfolio-api.onrender.com
   ```
9. Test it: open `https://architect-portfolio-api.onrender.com/api/projects` in browser.
   You should see: `{"success":true,"message":"OK","data":[]}`

> ⚠️ **Free Render services sleep after 15 min of inactivity.** First request after sleep takes ~30 seconds. This is normal on the free tier.

---

## STEP 4 — Deploy Frontend on Vercel

### 4A. Update vercel.json with your Render URL
Before deploying, edit `frontend/vercel.json` and replace:
```
https://architect-portfolio-api.onrender.com
```
with your actual Render URL from Step 3.

Commit and push this change to GitHub.

### 4B. Deploy on Vercel
1. Go to https://vercel.com → **Sign up** (use GitHub login)
2. Click **Add New Project**
3. Select your `architect-portfolio` GitHub repo
4. Configure:

   | Field            | Value                |
   |------------------|----------------------|
   | Framework Preset | `Vite`               |
   | Root Directory   | `frontend`           |
   | Build Command    | `npm run build`      |
   | Output Directory | `dist`               |

5. Click **Deploy**
6. Vercel builds and deploys in ~2 minutes.
7. You get a URL like: `https://architect-portfolio-xyz.vercel.app`

---

## STEP 5 — Connect frontend URL to backend (CORS)

1. Go back to **Render dashboard** → your service → **Environment**
2. Update `FRONTEND_URL` = `https://architect-portfolio-xyz.vercel.app` (your Vercel URL)
3. Click **Save Changes** — Render auto-redeploys.

---

## STEP 6 — Test the live site

1. Open your Vercel URL in a browser.
2. Wait ~30 seconds on first load (Render free tier waking up).
3. The email gate modal should appear.
4. Go to `/admin` → add a project → upload an image.
5. Return to home — project appears.

**Share your Vercel URL on WhatsApp.** When someone opens it:
- They see the portfolio
- Email capture modal appears
- Their email is stored in Neon PostgreSQL
- You can view all visitor emails at `/admin` → Visitors tab

---

## STEP 7 — Custom domain (optional, free on Vercel)

If your friend has a domain (e.g. `arjunmehta.in`):
1. Go to Vercel → your project → **Settings → Domains**
2. Add the domain → follow DNS instructions
3. Free SSL certificate is automatic.

---

## Summary of free URLs after deployment

| Service   | URL                                               |
|-----------|---------------------------------------------------|
| Website   | `https://your-app.vercel.app`                     |
| API       | `https://architect-portfolio-api.onrender.com`    |
| Database  | Neon dashboard at `https://console.neon.tech`     |
| Admin     | `https://your-app.vercel.app/admin`               |

---

## Troubleshooting

| Problem                        | Fix                                                                     |
|-------------------------------|-------------------------------------------------------------------------|
| API returns 502 on Vercel      | Render service is sleeping — wait 30s and retry                        |
| CORS error in browser          | Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly     |
| Images not showing             | Render free tier has ephemeral storage — images reset on restart. For permanent images, integrate Cloudinary (free tier available). |
| Build fails on Render          | Check Java version — add env var `JAVA_VERSION=11` if needed           |
| Vercel shows blank page        | Check Root Directory is set to `frontend` in Vercel project settings   |
