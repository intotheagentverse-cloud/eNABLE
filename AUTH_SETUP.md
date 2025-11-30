# Authentication Setup Guide

This guide explains how to set up the authentication infrastructure and create test users for the eNABLE Quality MS application.

## Prerequisites

- Supabase project configured (check `.env.local` for credentials)
- Node.js and npm installed
- Database access to your Supabase instance

## Step 1: Set Up Database Schema

You need to run the authentication schema SQL in your Supabase database:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to **SQL Editor**
4. Copy the contents of `auth_schema.sql`
5. Paste and run the SQL

This will create:
- `labs` table - for laboratory organizations
- `users` table - for user profiles
- `user_labs` table - for user-lab relationships (multi-tenancy)
- Foreign key constraints linking existing tables to labs

## Step 2: Install Dependencies

```bash
npm install
```

This installs `tsx` which is needed to run the TypeScript seed scripts.

## Step 3: Create Test Users

### Option A: Create Both Test Users

```bash
npm run seed:all
```

### Option B: Create Individual Test Users

**Tier 1 Solo Lab User:**
```bash
npm run seed:tier1
```

**Tier 2 Multi-Lab Manager:**
```bash
npm run seed:tier2
```

## Test User Credentials

### Tier 1 User (Solo Lab)
- **Email:** priya.sharma@example.com
- **Password:** password123
- **Lab:** PathLab Diagnostics (Small diagnostic lab)
- **Equipment:** 3 items (Hematology Analyzer, Chemistry Analyzer, Microscope)
- **Staff:** 3 members
- **QC Data:** 30 days of test results

### Tier 2 User (Multi-Lab Manager)
- **Email:** rajesh.kumar@example.com
- **Password:** password123
- **Labs:** 5 locations (MediPath Central, North, South, East, Collection Center)
- **Equipment:** 10 items across all labs
- **Staff:** 10 members distributed across labs
- **QC Data:** 60 days of test results across labs

## Step 4: Test the Login

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: http://localhost:3000/login

3. Log in with either test account

4. Verify you can access the dashboard and see the appropriate data

## Troubleshooting

### "User already exists" error
If you've already run the seed scripts, you'll need to either:
1. Delete the existing users from Supabase Auth
2. Use different email addresses in the seed scripts

### "Foreign key constraint" errors
Make sure you ran the `auth_schema.sql` first before running the seed scripts.

### "Missing environment variables" error
Check that your `.env.local` file has:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Database Schema Overview

```
users (extends Supabase auth.users)
  ├── id (UUID, references auth.users)
  ├── full_name
  ├── email
  └── role

labs
  ├── id (UUID)
  ├── lab_name
  ├── lab_code
  ├── lab_tier (TIER_1, TIER_2, TIER_3)
  └── ... (contact info, NABL details)

user_labs (many-to-many relationship)
  ├── user_id (references users)
  ├── lab_id (references labs)
  ├── role (OWNER, MANAGER, TECHNICIAN, VIEWER)
  └── is_primary (boolean)

equipment, qc_tests, documents, etc.
  └── lab_id (references labs)
```

## Next Steps

After setting up authentication:

1. **Update Constants**: Replace `TEST_LAB_ID` usage with actual user lab context
2. **Add Lab Switcher**: Implement UI for Tier 2 users to switch between labs
3. **Protect Routes**: Add authentication middleware to protect dashboard routes
4. **Session Management**: Implement proper session handling and token refresh

## Files Created

- `auth_schema.sql` - Database schema for authentication
- `src/app/actions/auth.ts` - Server actions for authentication
- `src/app/login/page.tsx` - Login page
- `src/app/signup/page.tsx` - Signup page
- `scripts/seed-tier1-user.ts` - Tier 1 test user seed script
- `scripts/seed-tier2-user.ts` - Tier 2 test user seed script
