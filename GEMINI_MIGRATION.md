# 🚀 Gemini Flash 2.5 Migration Guide

ChefConnect has been migrated from OpenAI to **Google Gemini 2.0 Flash** for all AI features.

## ✅ What Changed

### AI Models
- **Chat & Responses**: `gpt-4o` → `gemini-2.0-flash-exp`
- **Language Detection**: `gpt-4o-mini` → `gemini-2.0-flash-exp`
- **Intent Classification**: `gpt-4o-mini` → `gemini-2.0-flash-exp`
- **Embeddings**: `text-embedding-3-small` → `text-embedding-004`

### Files Updated
1. `/src/lib/ai/gemini.ts` - New Gemini integration (replaces openai.ts)
2. `/src/app/api/ai/chat/route.ts` - Updated to use Gemini
3. Package added: `@google/generative-ai`

### Key Benefits
✅ **Faster responses** - Gemini 2.0 Flash is optimized for speed  
✅ **Better multilingual support** - Improved Swahili translations  
✅ **Cost-effective** - More affordable API pricing  
✅ **2M token context window** - Handle longer conversations  

## 🔧 Setup Instructions

### Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Get API Key"**
3. Select your project or create a new one
4. Copy your API key (starts with `AIza...`)

### Step 2: Update Environment Variables

Add to your `.env.local` file:

```env
# Replace OpenAI with Gemini
GEMINI_API_KEY=AIzaSy...your_key_here

# You can remove these (no longer needed):
# OPENAI_API_KEY=sk-proj-...
```

### Step 3: Verify Installation

```bash
# Install dependencies if not already done
npm install

# Start the development server
npm run dev
```

### Step 4: Test AI Features

1. **Open the app**: http://localhost:3000
2. **Sign in** to your account
3. **Click the AI chatbot** button (bottom-right)
4. **Test queries**:
   - English: "Find me a chef for Italian cuisine"
   - Swahili: "Nataka mpishi wa chakula ya Italia"

## 📊 API Comparison

| Feature | OpenAI | Gemini 2.0 Flash |
|---------|--------|------------------|
| **Speed** | ~2-3s | ~1-2s |
| **Context** | 128K tokens | 2M tokens |
| **Multilingual** | Good | Excellent |
| **Cost** | $5/1M tokens | $0.075/1M tokens |
| **Embeddings** | 1536 dims | 768 dims |

## 🔄 Migration Checklist

- [x] Install `@google/generative-ai` package
- [x] Create `/src/lib/ai/gemini.ts` with all AI functions
- [x] Update chat API route to use Gemini
- [x] Test language detection (EN/SW)
- [x] Test intent classification
- [ ] Update vector embeddings (see below)
- [ ] Test all AI chatbot features
- [ ] Update documentation

## ⚠️ Important Notes

### Vector Embeddings Dimension Change

Gemini embeddings are **768 dimensions** vs OpenAI's **1536 dimensions**.

**If you already have vectors indexed:**

You need to:
1. Update your database schema to support 768-dimensional vectors
2. Re-index all chefs and dishes

```sql
-- Update vector column dimension
ALTER TABLE vectors 
  DROP COLUMN embedding;

ALTER TABLE vectors 
  ADD COLUMN embedding vector(768);
```

3. Re-run vector indexing:
```bash
curl -X POST http://localhost:3000/api/ai/index-vectors \
  -H "Content-Type: application/json" \
  -d '{"type": "all"}'
```

### Backwards Compatibility

The old OpenAI integration file (`/src/lib/ai/openai.ts`) is still present but not used. You can:
- Keep it as a backup
- Remove it to clean up the codebase

## 🚨 Troubleshooting

### Error: "Missing GEMINI_API_KEY"
**Solution**: Make sure you added `GEMINI_API_KEY` to `.env.local`

### Error: "Invalid API Key"
**Solution**: 
1. Check your API key is correct
2. Ensure it starts with `AIza...`
3. Verify it's enabled in Google AI Studio

### Slow Responses
**Solution**: 
1. Check your internet connection
2. Gemini 2.0 Flash should be faster than OpenAI
3. Consider using caching for repeated queries

### Swahili Not Working
**Solution**:
1. Gemini handles Swahili natively
2. Test with simple phrases first
3. Check conversation history isn't in English

## 📚 Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini 2.0 Flash Model Card](https://ai.google.dev/gemini-api/docs/models/gemini-v2)
- [Google AI Studio](https://aistudio.google.com/)
- [Pricing](https://ai.google.dev/pricing)

## 🎉 Next Steps

1. ✅ Get your Gemini API key
2. ✅ Update environment variables
3. ✅ Test the chatbot
4. 📧 Share feedback with the team!

---

**Need help?** Contact the development team or check the main [README.md](./README.md)
