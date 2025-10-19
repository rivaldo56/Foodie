# 👨‍🍳 ChefConnect - Book Personal Chefs in 3 Taps

ChefConnect is a revolutionary platform connecting busy professionals, families, and event hosts with trusted freelance chefs. Powered by AI for personalized recommendations and multilingual support (English & Swahili).

## ✨ Features

### v2 - AI-Powered Features
- 🤖 **Multilingual AI Chatbot** - Chat in English or Swahili for chef discovery
- 🧠 **RAG-based Recommendations** - Personalized feed powered by vector embeddings
- 🌍 **Language Detection** - Automatic language detection and translation
- 🔍 **Semantic Search** - Find chefs using natural language queries
- 📊 **AI Analytics** - Intent detection and user preference learning

### Core Features
- 👨‍🍳 **Chef Profiles** - Detailed profiles with specialties, ratings, and pricing
- 📅 **3-Tap Booking** - Streamlined booking flow
- 💬 **Real-time Messaging** - In-app chat between clients and chefs
- ⭐ **Reviews & Ratings** - Transparent feedback system
- 💳 **Stripe Integration** - Secure payments with commission handling
- 🏆 **Chef Badges** - Top Chef, 5-Star, Fast Responder, Verified
- 📈 **Enhanced Dashboard** - Earnings analytics, trends, and bookings
- 🗓️ **Google Calendar Sync** - Auto-sync bookings to calendar
- 🖼️ **AI Photo Enhancement** - Replicate API for dish photo enhancement
- 🔔 **Real-time Notifications** - Booking updates, messages, reviews

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase) with pgvector
- **AI/ML**: OpenAI GPT-4o, text-embedding-3-small
- **Payments**: Stripe
- **Image Enhancement**: Replicate API
- **Calendar**: Google Calendar API
- **Auth**: Supabase Auth
- **Real-time**: Supabase Realtime

## 📋 Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account
- OpenAI API key
- Stripe account
- Replicate API token (optional)
- Google Cloud Console project (optional, for calendar sync)

## 🚀 Quick Start

1. **Clone and install dependencies**

```bash
cd /home/rivaldo/codes/Foodie/chefconnect
npm install
```

2. **Set up environment variables**

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Fill in all required environment variables (see Environment Variables section below).

3. **Set up Supabase**

- Create a new Supabase project
- Run the migration files in `supabase/migrations/` in order:
  ```bash
  # In Supabase SQL Editor, run:
  001_add_missing_tables.sql
  002_vector_search_function.sql
  ```
- Enable pgvector extension if not already enabled

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

### Required
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### Optional
```env
# Replicate (for photo enhancement)
REPLICATE_API_TOKEN=your_replicate_token

# Google Calendar
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 Project Structure

```
chefconnect/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── ai/             # AI chatbot endpoints
│   │   │   ├── chef/           # Chef dashboard endpoints
│   │   │   ├── calendar/       # Google Calendar sync
│   │   │   └── images/         # Photo enhancement
│   │   ├── dashboard/          # Chef dashboard
│   │   ├── discover/           # Chef discovery
│   │   └── providers.tsx       # Auth & context providers
│   ├── components/
│   │   ├── AIChatbot.tsx       # Floating AI assistant
│   │   ├── NotificationBell.tsx # Real-time notifications
│   │   ├── PersonalizedFeed.tsx # AI recommendations
│   │   └── ui/                 # Reusable UI components
│   ├── lib/
│   │   ├── ai/                 # OpenAI & RAG logic
│   │   ├── calendar/           # Google Calendar integration
│   │   ├── notifications/      # Notification system
│   │   ├── replicate/          # Image enhancement
│   │   └── supabase/           # Database client & types
│   └── types/                  # TypeScript types
├── supabase/
│   └── migrations/             # Database migrations
└── public/                     # Static assets
```

## 🗄️ Database Schema

Key tables:
- `user_profiles` - User accounts and preferences
- `chef_profiles` - Chef details, pricing, availability
- `bookings` - Booking records with status tracking
- `dishes` - Chef menu items with AI enhancement flags
- `messages` - In-app chat messages
- `ai_conversations` - AI chatbot conversation threads
- `ai_messages` - AI chatbot message history
- `vectors` - Vector embeddings for RAG (1536 dimensions)
- `notifications` - Real-time user notifications
- `chef_badges` - Achievement badges for chefs
- `reviews` - Client reviews and ratings
- `user_activity` - User interaction tracking for ML

## 🤖 AI Features Guide

### Chatbot Usage

The AI chatbot appears as a floating button in the bottom-right corner. It supports:

**English Examples:**
- "Find me a chef for Italian cuisine"
- "I need a chef for tomorrow evening"
- "Show me vegetarian dishes"

**Swahili Examples:**
- "Nataka mpishi wa chakula ya kienyeji"
- "Nionyeshe wapishi bora"
- "Napenda chakula cha Italia"

### RAG Knowledge Base

To index chefs and dishes for semantic search:

```bash
curl -X POST http://localhost:3000/api/ai/index-vectors \
  -H "Content-Type: application/json" \
  -d '{"type": "all"}'
```

This should be run:
- After adding new chefs
- After updating dish information
- Periodically (e.g., via cron job)

## 💳 Payment Flow

1. Client books a chef
2. Payment intent created via Stripe
3. Payment held in escrow
4. Chef completes booking
5. 85% released to chef (15% platform commission)
6. Chef receives payout via Stripe Connect

## 📱 Progressive Web App (PWA)

ChefConnect is PWA-ready. To enable offline functionality, add a service worker and manifest file.

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Set all environment variables in your deployment platform's dashboard.

### Database Migrations

Ensure all migrations are run on your production Supabase instance before deploying.

## 🔧 Configuration

### Badge Criteria

Edit `/src/app/api/chef/badges/route.ts` to customize badge requirements:

```typescript
const BADGE_CRITERIA = {
  top_chef: { minRating: 4.8, minReviews: 20, minBookings: 50 },
  '5_star': { minRating: 5.0, minReviews: 10 },
  // ... add custom badges
};
```

### Commission Rate

Update commission in `/src/app/api/chef/dashboard/route.ts`:

```typescript
const commission = totalEarnings * 0.15; // 15% platform fee
```

## 📚 API Documentation

### AI Chat Endpoint

```
POST /api/ai/chat
Body: {
  message: string
  conversationId?: string
}
```

### Recommendations Endpoint

```
GET /api/recommendations?limit=12
Returns: Personalized chef and dish recommendations
```

### Dashboard Endpoint

```
GET /api/chef/dashboard?days=30
Returns: Chef earnings, stats, and analytics
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@chefconnect.com

## 🎯 Roadmap

### Q1 2024
- [ ] Voice input/output for chatbot (Whisper + TTS)
- [ ] Group booking system for chamas
- [ ] Chef video profiles
- [ ] Advanced filtering (allergies, certifications)

### Q2 2024
- [ ] Mobile apps (React Native)
- [ ] Chef discovery map view
- [ ] Recurring booking subscriptions
- [ ] Referral program

### Q3 2024
- [ ] Multi-language support (add French, Spanish)
- [ ] Chef training platform
- [ ] Virtual cooking classes
- [ ] Corporate catering marketplace

## 🙏 Acknowledgments

- OpenAI for GPT-4o and embeddings
- Supabase for backend infrastructure
- Stripe for payment processing
- Replicate for image enhancement
- The Next.js team for an amazing framework

---

Built with ❤️ for the ChefConnect community
