# Frontend Deployment Guide

The frontend is a Next.js 14 application deployed on **Vercel**.

## 1. Environment Variables
Set these in your Vercel Project Settings:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase **Anon** Key (Public) |
| `NEXT_PUBLIC_API_URL` | Check below |
| `NEXT_PUBLIC_SITE_URL` | Your website URL |

## 2. Configuring the API URL
### Option A: Monorepo Deployment (Recommended)
If you deploy the whole repo to Vercel and use the provided `vercel.json`:
- Set `NEXT_PUBLIC_API_URL` to `/api/py`
- This uses Vercel Rewrites to talk to the backend in the same project.

### Option B: Separate Backend
If you deploy the backend elsewhere (e.g. Render):
- Set `NEXT_PUBLIC_API_URL` to the full URL (e.g. `https://my-api.onrender.com`)

## 3. Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
