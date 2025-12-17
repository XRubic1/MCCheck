# Deployment Guide for MC App

This guide will help you deploy your MC App to the web.

## Option 1: Deploy to Vercel (Recommended - Easiest)

Vercel is the easiest way to deploy a Vite React app.

### Steps:

1. **Push to GitHub** (if not already done):
   ```bash
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/mc-app.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [https://vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings
   - **Important**: Add your environment variables:
     - `VITE_SUPABASE_URL` - Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
   - Click "Deploy"
   - Your app will be live in minutes!

3. **Update Environment Variables** (if needed later):
   - Go to your project in Vercel
   - Settings → Environment Variables
   - Add or update variables

## Option 2: Deploy to Netlify

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**:
   - Go to [https://netlify.com](https://netlify.com)
   - Sign up/Login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy site"

## Option 3: Deploy to GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**:
   Add these scripts:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Update vite.config.js**:
   ```js
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: '/mc-app/' // Replace with your repo name
   })
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

## Environment Variables

**IMPORTANT**: Make sure to add these environment variables in your hosting platform:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

## Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test login functionality
- [ ] Test adding entries
- [ ] Test Excel import
- [ ] Test MC Search
- [ ] Verify database connection

## Custom Domain (Optional)

Both Vercel and Netlify support custom domains:
- Vercel: Project Settings → Domains
- Netlify: Site Settings → Domain Management

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify environment variables are set
- Check build logs for specific errors

### App Works Locally but Not Deployed
- Verify environment variables are set in deployment platform
- Check that Supabase RLS policies allow public access
- Review browser console for errors

### Database Connection Issues
- Verify Supabase URL and key are correct
- Check Supabase project is active (not paused)
- Review RLS policies in Supabase




