# 🚀 ChefConnect Setup Guide

Complete guide to set up ChefConnect locally and in production.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [API Keys Configuration](#api-keys-configuration)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- Node.js 18+ ([Download](https://nodejs.org/))
- npm, yarn, or pnpm
- Git

### Required Accounts
1. **Supabase** - [Sign up](https://supabase.com/)
2. **OpenAI** - [Get API key](https://platform.openai.com/)
3. **Stripe** - [Create account](https://stripe.com/)

### Optional Accounts
4. **Replicate** - [Sign up](https://replicate.com/) for photo enhancement
5. **Google Cloud** - [Console](https://console.cloud.google.com/) for calendar sync

## Environment Setup

### 1. Clone the Repository

```bash
cd /home/rivaldo/codes/Foodie/chefconnect
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Create Environment File

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

### 4. Configure Environment Variables

Add the following to your `.env.local`:

```env
# ==========================================
# SUPABASE CONFIGURATION (Required)
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ==========================================
# OPENAI CONFIGURATION (Required)
# ==========================================
OPENAI_API_KEY=sk-proj-...

# ==========================================
# STRIPE CONFIGURATION (Required)
# ==========================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ==========================================
# REPLICATE (Optional - Photo Enhancement)
# ==========================================
REPLICATE_API_TOKEN=r8_...

# ==========================================
# GOOGLE CALENDAR (Optional)
# ==========================================
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...

# ==========================================
# APP CONFIGURATION
# ==========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Setup

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Fill in:
   - Project name: `chefconnect`
   - Database password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be created (~2 minutes)

### Step 2: Enable pgvector Extension

1. In your Supabase project, go to **SQL Editor**
2. Run this command:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

3. Click "Run"

### Step 3: Run Database Migrations

In the SQL Editor, run each migration file in order:

#### Migration 1: Core Tables

Copy and paste the entire content of `supabase/migrations/001_add_missing_tables.sql` and click "Run".

#### Migration 2: Vector Search Function

Copy and paste the entire content of `supabase/migrations/002_vector_search_function.sql` and click "Run".

### Step 4: Verify Setup

Run this query to verify tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see tables like:
- user_profiles
- chef_profiles
- bookings
- dishes
- vectors
- ai_conversations
- notifications
- etc.

## API Keys Configuration

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Navigate to **API Keys**
3. Click "Create new secret key"
4. Name it "ChefConnect"
5. Copy the key (starts with `sk-proj-...`)
6. Add to `.env.local` as `OPENAI_API_KEY`

**Billing:** Add payment method at [Billing](https://platform.openai.com/account/billing) to use the API.

### Stripe Setup

#### 1. Get API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Click **Developers** → **API keys**
3. Copy "Publishable key" → Add as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Copy "Secret key" → Add as `STRIPE_SECRET_KEY`

#### 2. Enable Stripe Connect (for chef payouts)

1. In Stripe Dashboard, go to **Connect** → **Settings**
2. Enable "Express" account type
3. Configure branding and settings

#### 3. Set Up Webhooks (for production)

1. Go to **Developers** → **Webhooks**
2. Click "Add endpoint"
3. URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`
5. Copy webhook secret → Add as `STRIPE_WEBHOOK_SECRET`

### Replicate API (Optional)

1. Sign up at [Replicate](https://replicate.com/)
2. Go to [Account Settings](https://replicate.com/account)
3. Copy API token (starts with `r8_...`)
4. Add as `REPLICATE_API_TOKEN`

### Google Calendar (Optional)

#### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "ChefConnect"
3. Enable **Google Calendar API**

#### 2. Configure OAuth Consent

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose "External"
3. Fill in app information
4. Add scopes: `https://www.googleapis.com/auth/calendar.events`
5. Add test users

#### 3. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Authorized redirect URIs:
   - `http://localhost:3000/api/calendar/callback` (development)
   - `https://your-domain.com/api/calendar/callback` (production)
5. Copy Client ID → Add as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
6. Copy Client Secret → Add as `GOOGLE_CLIENT_SECRET`

## Running Locally

### 1. Start Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 2. Verify Setup

1. **Homepage loads** - Check that the main page renders
2. **Auth works** - Try signing up/in (if auth is configured)
3. **Database connection** - Check browser console for errors
4. **AI Chatbot appears** - Look for floating chat button (after login)

### 3. Seed Test Data (Optional)

Create a file `scripts/seed.ts` to add sample chefs and dishes, then run:

```bash
npm run seed
```

### 4. Index Vectors for AI

After adding chefs/dishes, index them for semantic search:

```bash
curl -X POST http://localhost:3000/api/ai/index-vectors \
  -H "Content-Type: application/json" \
  -d '{"type": "all"}'
```

## Deployment

### Deploy to Vercel

#### 1. Install Vercel CLI

```bash
npm i -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Deploy

```bash
vercel
```

Follow the prompts:
- Link to existing project? **No**
- Project name: **chefconnect**
- Directory: **.**
- Override settings? **No**

#### 4. Add Environment Variables

In Vercel Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add all variables from `.env.local`
3. Redeploy: `vercel --prod`

### Deploy to Other Platforms

ChefConnect can also be deployed to:
- **Netlify** - Add `netlify.toml` configuration
- **Railway** - Deploy from GitHub
- **DigitalOcean App Platform** - Use Docker or buildpacks
- **AWS Amplify** - Connect GitHub repository

## Troubleshooting

### Database Connection Issues

**Error:** "Failed to connect to Supabase"

**Solution:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the anon key (not service role)
3. Ensure project is not paused (check Supabase dashboard)

### OpenAI API Errors

**Error:** "Insufficient quota" or "Rate limit exceeded"

**Solution:**
1. Add payment method to OpenAI account
2. Check usage at [OpenAI Usage](https://platform.openai.com/account/usage)
3. Increase rate limits or add credits

### Vector Search Not Working

**Error:** "Function match_vectors does not exist"

**Solution:**
1. Verify pgvector extension is enabled:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
2. Re-run migration `002_vector_search_function.sql`
3. Check function exists:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'match_vectors';
   ```

### Build Errors

**Error:** TypeScript errors during build

**Solution:**
1. Run type checking: `npm run typecheck`
2. Fix any type errors shown
3. If using `any` types, add proper type definitions

### Stripe Webhook Issues

**Error:** Webhook signature verification failed

**Solution:**
1. Ensure `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
2. For local testing, use Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

### Performance Issues

**Slow page loads or API responses**

**Optimization steps:**
1. Enable caching for API routes
2. Optimize database queries (add indexes)
3. Use `getStaticProps` for static pages
4. Enable Next.js Image Optimization
5. Add Redis for session/cache storage

## Next Steps

After setup is complete:

1. **Test all features**
   - User registration and login
   - Chef profile creation
   - Booking flow
   - Payment processing
   - AI chatbot
   - Notifications

2. **Customize branding**
   - Update colors in `tailwind.config.js`
   - Replace logo in `public/`
   - Customize email templates

3. **Set up monitoring**
   - Sentry for error tracking
   - Google Analytics for user analytics
   - LogRocket for session replay

4. **Configure backups**
   - Supabase automatic backups
   - Database export scripts
   - User data export compliance

5. **Launch checklist**
   - [ ] All environment variables in production
   - [ ] SSL certificate configured
   - [ ] Error tracking enabled
   - [ ] Analytics set up
   - [ ] Stripe webhooks working
   - [ ] Email notifications configured
   - [ ] Terms of service and privacy policy added
   - [ ] Contact/support page created

## Support

For additional help:
- Check the main [README.md](./README.md)
- Review [API Documentation](./API.md)
- Contact: support@chefconnect.com

---

Happy building! 🚀👨‍🍳
