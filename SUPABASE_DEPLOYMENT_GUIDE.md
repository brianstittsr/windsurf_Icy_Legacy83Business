# Supabase Deployment Guide for SVP Platform

This guide provides step-by-step instructions for deploying the Strategic Value Plus Platform schema to Supabase.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Database Schema Deployment](#database-schema-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Authentication Setup](#authentication-setup)
6. [Storage Configuration](#storage-configuration)
7. [Testing the Deployment](#testing-the-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- [ ] A Supabase account (sign up at https://supabase.com)
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Access to this repository
- [ ] Basic knowledge of PostgreSQL and SQL

---

## Supabase Project Setup

### Step 1: Create a New Supabase Project

1. **Log in to Supabase Dashboard**
   - Go to https://app.supabase.com
   - Sign in with your account

2. **Create New Project**
   - Click "New Project"
   - Fill in the project details:
     - **Name**: `svp-platform` (or your preferred name)
     - **Database Password**: Create a strong password (save this securely!)
     - **Region**: Choose the region closest to your users (e.g., `us-east-1`)
     - **Pricing Plan**: Select your plan (Free tier works for development)
   - Click "Create new project"
   - Wait 2-3 minutes for project provisioning

3. **Save Project Credentials**
   - Once created, go to **Project Settings** > **API**
   - Save the following values (you'll need them later):
     - **Project URL**: `https://[your-project-ref].supabase.co`
     - **Project API Key (anon public)**: `eyJhbGc...`
     - **Project API Key (service_role)**: `eyJhbGc...` (keep this secret!)
   - Go to **Project Settings** > **Database**
   - Save the **Connection String** (you'll need this for migrations)

---

## Database Schema Deployment

### Step 2: Install Supabase CLI (Optional but Recommended)

The Supabase CLI makes managing migrations easier.

```bash
# Install Supabase CLI globally
npm install -g supabase

# Verify installation
supabase --version
```

### Step 3: Deploy Schema Using SQL Editor (Web UI Method)

**This is the easiest method for first-time deployment:**

1. **Open SQL Editor**
   - In your Supabase Dashboard, navigate to **SQL Editor**
   - Click "New query"

2. **Copy and Paste Migration SQL**
   - Open the file: `supabase/migrations/20250101000000_initial_schema.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

3. **Execute the Migration**
   - Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
   - Wait for execution to complete (may take 30-60 seconds)
   - Check for any errors in the output panel

4. **Verify Schema Creation**
   - Go to **Table Editor** in the sidebar
   - You should see all tables listed (users, organizations, opportunities, etc.)
   - Click on a few tables to verify structure

### Step 4: Deploy Schema Using Supabase CLI (Advanced Method)

**Alternative method using CLI:**

```bash
# Navigate to your project directory
cd c:\Users\Buyer\Documents\CascadeProjects\IcyWilliams\svp-platform

# Initialize Supabase in your project (if not already done)
supabase init

# Link to your remote Supabase project
supabase link --project-ref [your-project-ref]
# You'll be prompted for your database password

# Push the migration to Supabase
supabase db push

# Verify migration status
supabase migration list
```

---

## Environment Configuration

### Step 5: Update Environment Variables

1. **Copy Environment Template**
   ```bash
   cp .env.example .env.local
   ```

2. **Update `.env.local` with Supabase Credentials**

   Replace the Firebase configuration with Supabase configuration:

   ```env
   # Node Environment
   NODE_ENV=development

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...

   # UserWay Accessibility Widget
   NEXT_PUBLIC_USERWAY_ACCOUNT_ID=your-userway-id

   # Optional: Database Direct Connection (for server-side operations)
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[your-project-ref].supabase.co:5432/postgres

   # Mattermost Integration (if using)
   MATTERMOST_WEBHOOK_URL=your-webhook-url
   ```

3. **Keep `.env.local` Secure**
   - Never commit `.env.local` to version control
   - Ensure it's listed in `.gitignore`

---

## Authentication Setup

### Step 6: Configure Supabase Authentication

1. **Enable Authentication Providers**
   - In Supabase Dashboard, go to **Authentication** > **Providers**
   - Enable the providers you need:
     - **Email**: Enable for email/password authentication
     - **Google**: Configure OAuth if needed
     - **GitHub**: Configure OAuth if needed

2. **Configure Email Templates** (Optional)
   - Go to **Authentication** > **Email Templates**
   - Customize confirmation, password reset, and magic link emails
   - Update sender name and email address

3. **Set Up Authentication Policies**
   - The migration already includes basic RLS policies
   - Review and customize in **Authentication** > **Policies**

4. **Configure Redirect URLs**
   - Go to **Authentication** > **URL Configuration**
   - Add your application URLs:
     - Development: `http://localhost:3000`
     - Production: `https://your-domain.com`

---

## Storage Configuration

### Step 7: Set Up File Storage Buckets

The application uses storage for documents, avatars, and other files.

1. **Create Storage Buckets**
   - Go to **Storage** in the Supabase Dashboard
   - Create the following buckets:

   **Bucket 1: `documents`**
   - Click "New bucket"
   - Name: `documents`
   - Public: `false` (private)
   - File size limit: `50 MB`
   - Allowed MIME types: `application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain`

   **Bucket 2: `avatars`**
   - Click "New bucket"
   - Name: `avatars`
   - Public: `true` (public)
   - File size limit: `2 MB`
   - Allowed MIME types: `image/jpeg, image/png, image/gif, image/webp`

   **Bucket 3: `logos`**
   - Click "New bucket"
   - Name: `logos`
   - Public: `true` (public)
   - File size limit: `5 MB`
   - Allowed MIME types: `image/jpeg, image/png, image/svg+xml, image/webp`

2. **Configure Storage Policies**
   - For each bucket, set up RLS policies:
   
   **Documents Bucket Policies:**
   ```sql
   -- Users can upload their own documents
   CREATE POLICY "Users can upload documents"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'documents');

   -- Users can view documents they have access to
   CREATE POLICY "Users can view accessible documents"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (bucket_id = 'documents');
   ```

   **Avatars Bucket Policies:**
   ```sql
   -- Anyone can view avatars (public)
   CREATE POLICY "Public avatars are viewable"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'avatars');

   -- Authenticated users can upload avatars
   CREATE POLICY "Users can upload avatars"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'avatars');
   ```

---

## Testing the Deployment

### Step 8: Verify Database Connection

1. **Test Connection from Application**

   Create a test file: `test-supabase-connection.js`

   ```javascript
   const { createClient } = require('@supabase/supabase-js');

   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

   const supabase = createClient(supabaseUrl, supabaseKey);

   async function testConnection() {
     try {
       // Test query
       const { data, error } = await supabase
         .from('platform_settings')
         .select('*')
         .limit(1);

       if (error) {
         console.error('❌ Error:', error.message);
       } else {
         console.log('✅ Connection successful!');
         console.log('Data:', data);
       }
     } catch (err) {
       console.error('❌ Connection failed:', err.message);
     }
   }

   testConnection();
   ```

   Run the test:
   ```bash
   node test-supabase-connection.js
   ```

2. **Test CRUD Operations**

   ```javascript
   // Create a test user
   const { data: user, error: userError } = await supabase
     .from('users')
     .insert({
       email: 'test@example.com',
       name: 'Test User',
       role: 'team',
       status: 'active'
     })
     .select()
     .single();

   console.log('Created user:', user);

   // Read the user
   const { data: fetchedUser } = await supabase
     .from('users')
     .select('*')
     .eq('email', 'test@example.com')
     .single();

   console.log('Fetched user:', fetchedUser);

   // Update the user
   const { data: updatedUser } = await supabase
     .from('users')
     .update({ name: 'Updated Test User' })
     .eq('id', user.id)
     .select()
     .single();

   console.log('Updated user:', updatedUser);

   // Delete the user
   await supabase
     .from('users')
     .delete()
     .eq('id', user.id);

   console.log('User deleted');
   ```

### Step 9: Install Supabase Client Library

If you haven't already, install the Supabase JavaScript client:

```bash
npm install @supabase/supabase-js
```

---

## Migrating from Firebase to Supabase

### Step 10: Update Application Code

You'll need to replace Firebase calls with Supabase calls throughout your application.

**Example: Replace Firebase Authentication**

**Before (Firebase):**
```typescript
import { auth } from './lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const user = await signInWithEmailAndPassword(auth, email, password);
```

**After (Supabase):**
```typescript
import { supabase } from './lib/supabase';

const { data: { user }, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

**Example: Replace Firestore Queries**

**Before (Firestore):**
```typescript
import { db } from './lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const q = query(
  collection(db, 'opportunities'),
  where('stage', '==', 'qualified')
);
const snapshot = await getDocs(q);
const opportunities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

**After (Supabase):**
```typescript
import { supabase } from './lib/supabase';

const { data: opportunities, error } = await supabase
  .from('opportunities')
  .select('*')
  .eq('stage', 'qualified');
```

### Step 11: Create Supabase Client Utility

Create a new file: `lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type-safe helpers
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: string;
          // ... add other fields
        };
        Insert: {
          email: string;
          name: string;
          role: string;
          // ... add other fields
        };
        Update: {
          email?: string;
          name?: string;
          role?: string;
          // ... add other fields
        };
      };
      // ... add other tables
    };
  };
};
```

---

## Advanced Configuration

### Step 12: Set Up Row Level Security (RLS) Policies

The migration includes basic RLS policies. You may need to customize them:

1. **Review Existing Policies**
   - Go to **Authentication** > **Policies** in Supabase Dashboard
   - Review policies for each table

2. **Add Custom Policies**

   Example: Allow users to view organizations they're associated with:

   ```sql
   -- In SQL Editor
   CREATE POLICY "Users can view their organizations"
   ON organizations
   FOR SELECT
   TO authenticated
   USING (
     id IN (
       SELECT unnest(contact_ids)
       FROM organizations
     )
     OR
     EXISTS (
       SELECT 1 FROM users
       WHERE users.id = auth.uid()::uuid
       AND users.role = 'admin'
     )
   );
   ```

3. **Test Policies**
   - Use the SQL Editor to test queries as different users
   - Verify that data access is properly restricted

### Step 13: Set Up Database Functions (Optional)

Create custom PostgreSQL functions for complex operations:

```sql
-- Example: Function to calculate affiliate engagement score
CREATE OR REPLACE FUNCTION calculate_engagement_score(affiliate_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Add points for profile completion
  SELECT 
    CASE WHEN biography_complete THEN 20 ELSE 0 END +
    CASE WHEN gains_profile_complete THEN 20 ELSE 0 END +
    CASE WHEN contact_sphere_complete THEN 20 ELSE 0 END +
    (one_to_ones_this_quarter * 2) +
    (referrals_given * 5)
  INTO score
  FROM affiliate_stats
  WHERE affiliate_id = affiliate_uuid;
  
  RETURN COALESCE(score, 0);
END;
$$ LANGUAGE plpgsql;
```

### Step 14: Set Up Realtime Subscriptions (Optional)

Enable realtime for tables that need live updates:

1. **Enable Realtime**
   - Go to **Database** > **Replication** in Supabase Dashboard
   - Enable replication for tables:
     - `activities`
     - `calendar_events`
     - `traction_todos`
     - `one_to_one_meetings`

2. **Subscribe to Changes in Your App**

   ```typescript
   // Subscribe to new activities
   const subscription = supabase
     .channel('activities-channel')
     .on(
       'postgres_changes',
       {
         event: 'INSERT',
         schema: 'public',
         table: 'activities'
       },
       (payload) => {
         console.log('New activity:', payload.new);
         // Update your UI
       }
     )
     .subscribe();

   // Cleanup
   // subscription.unsubscribe();
   ```

---

## Production Deployment Checklist

### Step 15: Pre-Production Checklist

Before deploying to production:

- [ ] **Database**
  - [ ] All migrations applied successfully
  - [ ] Indexes created for performance
  - [ ] RLS policies tested and verified
  - [ ] Backup strategy configured

- [ ] **Authentication**
  - [ ] Email provider configured
  - [ ] OAuth providers configured (if using)
  - [ ] Password policies set
  - [ ] Email templates customized

- [ ] **Storage**
  - [ ] All buckets created
  - [ ] Storage policies configured
  - [ ] File size limits set appropriately

- [ ] **Security**
  - [ ] Environment variables secured
  - [ ] API keys rotated (if needed)
  - [ ] CORS settings configured
  - [ ] Rate limiting enabled

- [ ] **Monitoring**
  - [ ] Database performance monitoring enabled
  - [ ] Error tracking configured
  - [ ] Backup schedule verified

---

## Troubleshooting

### Common Issues and Solutions

**Issue 1: Migration Fails with "relation already exists"**
- **Solution**: Drop the existing tables or create a new Supabase project
- **Command**: 
  ```sql
  DROP SCHEMA public CASCADE;
  CREATE SCHEMA public;
  -- Then re-run migration
  ```

**Issue 2: RLS Policies Blocking Queries**
- **Solution**: Temporarily disable RLS to test
  ```sql
  ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
  ```
- **Note**: Re-enable after testing!

**Issue 3: Connection Timeout**
- **Solution**: Check your connection string and firewall settings
- **Verify**: Test connection using `psql` or a database client

**Issue 4: "permission denied for schema public"**
- **Solution**: Ensure you're using the correct database role
- **Fix**: Grant necessary permissions:
  ```sql
  GRANT ALL ON SCHEMA public TO postgres;
  GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
  ```

**Issue 5: Slow Queries**
- **Solution**: Check if indexes are created
- **Verify**: Run `EXPLAIN ANALYZE` on slow queries
- **Fix**: Add missing indexes

---

## Next Steps

After successful deployment:

1. **Migrate Data** (if coming from Firebase)
   - Export data from Firestore
   - Transform to match PostgreSQL schema
   - Import using Supabase SQL Editor or CLI

2. **Update Application Code**
   - Replace all Firebase SDK calls with Supabase
   - Update authentication flows
   - Test all CRUD operations

3. **Set Up CI/CD**
   - Configure automated migrations
   - Set up staging environment
   - Implement database backup automation

4. **Monitor Performance**
   - Use Supabase Dashboard analytics
   - Set up alerts for errors
   - Monitor query performance

---

## Additional Resources

- **Supabase Documentation**: https://supabase.com/docs
- **Supabase CLI Reference**: https://supabase.com/docs/reference/cli
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Supabase Discord Community**: https://discord.supabase.com

---

## Support

If you encounter issues:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Search [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)
3. Ask in [Supabase Discord](https://discord.supabase.com)
4. Review this project's documentation in `/docs`

---

**Deployment Guide Version**: 1.0  
**Last Updated**: December 2024  
**Compatible with**: Supabase v2.x, Next.js 14+
