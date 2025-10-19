# 🚀 ChefConnect Migration Plan

## Overview
Migrating ChefConnect from current structure to match **Foodie Platform Development (3)** with Gemini 2.5 Flash AI.

## ✅ Completed

### 1. Gemini AI Integration
- ✅ Installed `@google/generative-ai`
- ✅ Created `/src/lib/ai/gemini.ts` with all AI functions
- ✅ Updated `/src/app/api/ai/chat/route.ts` to use Gemini
- ✅ Documented in `GEMINI_MIGRATION.md`

## 🔄 App Flow Structure (Reference)

### Landing Page Flow
```
Landing → Auth Dialog → Onboarding → Main App
```

### 1. **Landing Page** (Unauthenticated)
- Hero section with CTA buttons
- DiscoveryGrid (dishes showcase)
- HowItWorks section
- TrustIndicators
- Footer
- Auth Dialog (modal for sign up/in)

### 2. **Onboarding** (First-time users)
- **Client Onboarding**: Collect preferences (cuisines, dietary, budget)
- **Chef Onboarding**: Profile setup (bio, specialties, pricing, portfolio)

### 3. **Main App** (Authenticated)
Pinterest-style bottom navigation with 5 pages:

#### **Home Page**
- Welcome message with user's name
- Quick search bar
- Upcoming bookings widget (if any)
- **AI-Powered Recommendations** (infinite scroll)
  - Dish cards with AI match percentage (e.g., "98% Match")
  - Click to view chef profile & book
  - Favorite heart icon
  - AI reasoning ("Perfect for authentic Kenyan flavors")

#### **Discover Page**
- Full chef/dish browser
- Advanced filters (cuisine, price, dietary, location)
- Grid layout with infinite scroll
- Chef profile modal on click

#### **Calendar Page**
- Upcoming bookings calendar view
- Past bookings history
- Booking details & status

#### **Messages Page**
- Chat list with chefs
- Real-time messaging
- Unread indicators

#### **Profile Page**
- User settings
- Preferences management
- Payment methods
- Order history
- For chefs: Dashboard, earnings, analytics

## 🎨 Key Design Elements

### Navigation
**Pinterest-Style Bottom Nav**:
- Fixed floating pill at bottom
- Rounded corners with backdrop blur
- Icons: Home, Discover, Calendar, Messages, Profile
- Active state with primary color
- Smooth animations
- Desktop: Top bar with logo + user menu

### Components to Port
1. **Navigation.tsx** - Pinterest bottom nav
2. **ClientHome.tsx** - AI recommendations page
3. **ClientOnboarding.tsx** - Preferences setup
4. **ChefOnboarding.tsx** - Chef profile setup
5. **DiscoverPage.tsx** - Browse chefs
6. **CalendarPage.tsx** - Bookings calendar
7. **MessagesPage.tsx** - Chat interface
8. **ProfilePage.tsx** - User settings
9. **ChefProfileDialog.tsx** - Chef details & booking
10. **AIChatbot.tsx** - Floating AI assistant (with Gemini)

## 📋 Migration Tasks

### Phase 1: Core Structure (Priority 1)
- [ ] Update `/src/app/page.tsx` with proper state management
  - Landing, Onboarding, App states
  - User session handling
  - Role-based onboarding routing
- [ ] Create `/src/components/Navigation.tsx` (Pinterest style)
- [ ] Update `/src/app/layout.tsx` to support navigation

### Phase 2: Onboarding (Priority 1)
- [ ] Port `/src/components/ClientOnboarding.tsx`
- [ ] Port `/src/components/ChefOnboarding.tsx`
- [ ] Create API routes for onboarding data
- [ ] Update database schema if needed

### Phase 3: Main Pages (Priority 2)
- [ ] Update `/src/app/home/page.tsx` (rename from current structure)
  - AI recommendations with match %
  - Infinite scroll
  - Upcoming bookings widget
- [ ] Update `/src/app/discover/page.tsx`
  - Match reference design
  - Chef profile dialog
- [ ] Port `/src/app/calendar/page.tsx`
- [ ] Port `/src/app/messages/page.tsx`
- [ ] Update `/src/app/profile/page.tsx`

### Phase 4: AI Integration (Priority 1)
- [ ] Update AIChatbot to use Gemini
- [ ] Create AI recommendation API with Gemini
- [ ] Implement AI match percentage calculation
- [ ] Add AI reasoning generation

### Phase 5: Components & Features (Priority 2)
- [ ] Port ChefProfileDialog with booking flow
- [ ] Update booking flow (3-tap process)
- [ ] Add favorite/like functionality
- [ ] Implement real-time notifications

### Phase 6: Polish & Testing (Priority 3)
- [ ] Responsive design testing
- [ ] Animation improvements
- [ ] Performance optimization
- [ ] Error handling
- [ ] Loading states

## 🔧 Technical Changes

### Directory Structure
```
src/
├── app/
│   ├── (auth)/          # Auth pages (optional groups)
│   ├── (app)/           # Protected app routes
│   │   ├── home/
│   │   ├── discover/
│   │   ├── calendar/
│   │   ├── messages/
│   │   └── profile/
│   ├── api/
│   │   ├── ai/          # Gemini AI endpoints
│   │   ├── onboarding/  # NEW
│   │   └── ...
│   ├── page.tsx         # Landing + state management
│   └── layout.tsx       # Root layout with navigation
├── components/
│   ├── Navigation.tsx    # NEW - Bottom nav
│   ├── ClientOnboarding.tsx # NEW
│   ├── ChefOnboarding.tsx   # NEW
│   ├── ChefProfileDialog.tsx # UPDATE
│   ├── AIChatbot.tsx     # UPDATE with Gemini
│   └── ...
└── lib/
    └── ai/
        ├── gemini.ts     # ✅ DONE
        └── recommendations.ts # NEW
```

### State Management
Use React Context or state management for:
- **App State**: `landing` | `onboarding` | `app`
- **User Data**: Profile, role, preferences
- **Navigation**: Current page
- **Session**: Auth status

### API Routes to Create
- `POST /api/onboarding/client` - Save client preferences
- `POST /api/onboarding/chef` - Save chef profile
- `GET /api/recommendations` - AI-powered recommendations (Gemini)
- `GET /api/chef-profile/:id` - Chef details for dialog

## 🎯 Success Criteria

- ✅ Gemini AI fully integrated (chat, recommendations, intents)
- ✅ Pinterest-style navigation on mobile
- ✅ Proper landing → onboarding → app flow
- ✅ AI recommendations with match percentages
- ✅ Infinite scroll on home & discover
- ✅ 3-tap booking process
- ✅ All pages functional and responsive
- ✅ Clean, modern UI matching reference

## 📝 Notes

### Environment Variables Needed
```env
# Gemini AI (instead of OpenAI)
GEMINI_API_KEY=AIzaSy...

# Existing
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
```

### Key Differences from Current App
1. **State Management**: Single-page app state vs Next.js routing
2. **Navigation**: Bottom nav (Pinterest) vs top nav
3. **Onboarding**: Required for new users
4. **AI Integration**: Gemini 2.5 Flash vs OpenAI
5. **Home Page**: AI recommendations focus vs generic feed
6. **Booking Flow**: Dialog-based vs separate pages

## 🚀 Next Steps

1. **Start with Phase 1** - Core structure
2. **Get user feedback** on navigation style
3. **Iterate on AI recommendations** algorithm
4. **Test booking flow** thoroughly
5. **Deploy and monitor** usage

---

**Timeline**: 2-3 days for core migration, 1 week for full polish

**Priority**: Phase 1 & 4 (Core + AI) first, then Phase 2 & 3
