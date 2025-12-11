# Supabase Setup Guide

This guide will help you set up Supabase for the MC App.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: MC App (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the closest region
5. Click "Create new project" and wait for it to be set up

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 3: Set Up Environment Variables

1. Create a `.env` file in the root of your project (copy from `.env.example`)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:** Never commit your `.env` file to version control. It's already in `.gitignore`.

## Step 4: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `database/schema.sql`
4. Click "Run" to execute the SQL
5. Verify the tables were created by going to **Table Editor**

## Step 5: Add Users (Optional - for testing)

You can add test users directly in the Supabase dashboard:

1. Go to **Table Editor** → **users**
2. Click "Insert" → "Insert row"
3. Add a username (e.g., "admin", "user1")
4. Click "Save"

Or use SQL:

```sql
INSERT INTO users (username) VALUES ('admin');
INSERT INTO users (username) VALUES ('user1');
```

## Step 6: Configure Row Level Security (RLS)

The schema.sql file already includes RLS policies, but if you need to adjust them:

1. Go to **Authentication** → **Policies** in Supabase dashboard
2. Review the policies for `users` and `entries` tables
3. Adjust as needed for your security requirements

## Step 7: Test the Application

1. Start your development server:
   ```bash
   npm install
   npm run dev
   ```

2. Try logging in with a username you created in the database
3. Add some test entries
4. Verify data appears in Supabase **Table Editor** → **entries**

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env` file exists and has the correct variable names
- Restart your development server after creating/updating `.env`

### "Username not found" error
- Make sure you've added the username to the `users` table in Supabase
- Check that the username matches exactly (case-sensitive)

### RLS Policy Errors
- If you get permission errors, check your RLS policies in Supabase
- You may need to adjust policies based on your authentication setup

### Connection Issues
- Verify your Supabase project URL and API key are correct
- Check that your Supabase project is active (not paused)

## Next Steps

- Set up an admin panel to manage users
- Add more sophisticated authentication if needed
- Configure backups and monitoring in Supabase dashboard

