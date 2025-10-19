# ⚡ ChefConnect - Quick Start Guide

Get ChefConnect running in 5 minutes!

## 🚀 One-Command Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Start dev server
npm run dev
```

## 🔑 Minimum Required Config

Add these to `.env.local`:

```env
# Supabase (Get from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# OpenAI (Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-...

# Stripe (Get from https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🗄️ Database Setup (2 minutes)

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)
2. Copy/paste `supabase/migrations/001_add_missing_tables.sql`
3. Click **Run**
4. Copy/paste `supabase/migrations/002_vector_search_function.sql`
5. Click **Run**

Done! ✅

## 🤖 Enable AI Features

After adding sample chefs/dishes, index them:

```bash
curl -X POST http://localhost:3000/api/ai/index-vectors \
  -H "Content-Type: application/json" \
  -d '{"type": "all"}'
```

## ✅ Verify Everything Works

Open http://localhost:3000 and check:

- [x] Homepage loads
- [x] Sign up works
- [x] AI chatbot appears (bottom-right)
- [x] Dashboard accessible
- [x] No console errors

## 🎯 Test AI Chatbot

Click the chat button and try:

**English:**
```
"Find me a chef for Italian food"
"I need someone for tomorrow"
```

**Swahili:**
```
"Nataka mpishi wa chakula ya kienyeji"
"Nionyeshe wapishi bora"
```

## 📦 Optional Services

### Photo Enhancement (Replicate)
```env
REPLICATE_API_TOKEN=r8_...
```

### Calendar Sync (Google)
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
```

## 🐛 Troubleshooting

### Can't connect to Supabase?
- Check URL format: `https://xxx.supabase.co` (no trailing slash)
- Use **anon key**, not service role key

### OpenAI errors?
- Add payment method at https://platform.openai.com/account/billing
- Check API key starts with `sk-proj-`

### Build errors?
```bash
rm -rf .next
npm run build
```

## 📚 Full Documentation

- **Setup:** SETUP.md
- **Features:** FEATURES.md
- **Implementation:** IMPLEMENTATION_SUMMARY.md
- **README:** README.md

## 🚀 Deploy

```bash
vercel
```

That's it! Happy building! 🎉
