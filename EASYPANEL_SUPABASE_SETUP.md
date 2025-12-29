# EasyPanel Supabase Deployment Guide

This guide shows how to connect your Legacy83 Platform to Supabase running on EasyPanel and deploy the schema automatically.

## Prerequisites

- ✅ Supabase instance running on EasyPanel (as shown in your screenshot)
- ✅ Access to EasyPanel dashboard
- ✅ Node.js 18+ installed locally

---

## Step 1: Get Supabase Connection Details from EasyPanel

### 1.1 Access Your Supabase Service

From your EasyPanel dashboard (as shown in the screenshot):
1. Navigate to your `supabasevp` service
2. Click on **Credentials** in the left sidebar

### 1.2 Collect Required Information

You'll need the following credentials from EasyPanel:

**Database Connection:**
- **Host**: Usually `supabasevp-db` or the internal service name
- **Port**: `5432` (PostgreSQL default)
- **Database**: `postgres`
- **Username**: `postgres`
- **Password**: (from your EasyPanel credentials)

**API Details:**
- **API URL**: Check the **Expose** section for the public URL
- **Anon Key**: From Supabase dashboard (accessible via the exposed URL)
- **Service Role Key**: From Supabase dashboard

### 1.3 Access Supabase Dashboard

1. In EasyPanel, go to your `supabasevp` service
2. Click **Expose** or **Open** to access the Supabase web interface
3. Navigate to **Project Settings** > **API** to get your keys
4. Navigate to **Project Settings** > **Database** to get connection string

---

## Step 2: Configure Environment Variables

### 2.1 Update `.env.local`

Create or update your `.env.local` file:

```bash
# Copy the example file
cp .env.example .env.local
```

### 2.2 Add Supabase Credentials

Edit `.env.local` with your EasyPanel Supabase details:

```env
# Node Environment
NODE_ENV=development

# Supabase Configuration (from EasyPanel)
NEXT_PUBLIC_SUPABASE_URL=https://your-easypanel-domain.com/supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...

# Database Direct Connection (for migrations)
# Format: postgresql://postgres:password@host:port/database
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@supabasevp-db:5432/postgres

# Alternative: External connection (if accessing from outside EasyPanel)
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@your-easypanel-domain.com:5432/postgres

# UserWay Accessibility Widget
NEXT_PUBLIC_USERWAY_ACCOUNT_ID=your-userway-id

# Mattermost Integration (optional)
MATTERMOST_WEBHOOK_URL=your-webhook-url
```

**Important Notes:**
- Use the **internal hostname** (`supabasevp-db`) if deploying within EasyPanel
- Use the **external domain** if running locally or from outside EasyPanel
- Get the anon key and service role key from the Supabase web UI

---

## Step 3: Install Dependencies

Install the required packages for database migrations:

```bash
# Install Supabase client
npm install @supabase/supabase-js

# Install PostgreSQL client for migrations (optional but recommended)
npm install pg dotenv

# Install development dependencies
npm install --save-dev @types/pg
```

---

## Step 4: Create Automated Migration Script

### 4.1 Create Migration Script

I'll create a Node.js script to automatically deploy the schema:

```bash
# This will be created in the next step
node scripts/deploy-schema.js
```

### 4.2 Alternative: Use Supabase CLI

Install Supabase CLI for easier management:

```bash
# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase (if using cloud)
# For self-hosted, you'll connect directly via DATABASE_URL
```

---

## Step 5: Deploy Schema Automatically

### Method 1: Using the Automated Script (Recommended)

Run the deployment script:

```bash
# Deploy schema to EasyPanel Supabase
npm run deploy:schema
```

This script will:
1. Connect to your EasyPanel Supabase instance
2. Read the migration SQL file
3. Execute it against your database
4. Verify successful deployment
5. Show summary of created tables

### Method 2: Using PostgreSQL Client Directly

```bash
# Using psql (if installed)
psql $DATABASE_URL -f supabase/migrations/20250101000000_initial_schema.sql

# Or using the migration script
node scripts/deploy-schema.js
```

### Method 3: Using Supabase Web UI

1. Access your Supabase dashboard via EasyPanel
2. Navigate to **SQL Editor**
3. Click **New query**
4. Copy contents of `supabase/migrations/20250101000000_initial_schema.sql`
5. Paste and click **Run**

---

## Step 6: Verify Deployment

### 6.1 Check Tables via Supabase UI

1. Open Supabase dashboard (via EasyPanel)
2. Go to **Table Editor**
3. Verify all tables are created:
   - users
   - organizations
   - opportunities
   - projects
   - (and 50+ more tables)

### 6.2 Test Connection from Your App

Create a test file `test-connection.js`:

```javascript
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  console.log('🔄 Testing Supabase connection...\n');
  
  try {
    // Test query
    const { data, error } = await supabase
      .from('platform_settings')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }

    console.log('✅ Connection successful!');
    console.log('📊 Platform settings:', data);
    
    // List all tables
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    console.log(`\n📋 Total tables created: ${tables?.length || 0}`);
    
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
```

Run the test:

```bash
node test-connection.js
```

---

## Step 7: Configure Application

### 7.1 Create Supabase Client Utility

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role (for admin operations)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

### 7.2 Update Package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "deploy:schema": "node scripts/deploy-schema.js",
    "test:db": "node test-connection.js"
  }
}
```

---

## EasyPanel-Specific Configuration

### Network Configuration

If your Next.js app is also deployed on EasyPanel:

1. **Internal Communication**: Use internal service names
   ```env
   DATABASE_URL=postgresql://postgres:password@supabasevp-db:5432/postgres
   NEXT_PUBLIC_SUPABASE_URL=http://supabasevp:8000
   ```

2. **External Access**: Use exposed domains
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-domain.com/supabase
   ```

### Service Dependencies

In EasyPanel, ensure your app service depends on Supabase:
1. Go to your app service settings
2. Add `supabasevp` as a dependency
3. This ensures Supabase starts before your app

---

## Troubleshooting

### Issue: Cannot Connect to Database

**Check:**
- Database is running in EasyPanel
- Credentials are correct
- Port 5432 is accessible
- Using correct hostname (internal vs external)

**Solution:**
```bash
# Test connection manually
psql "postgresql://postgres:password@supabasevp-db:5432/postgres" -c "SELECT version();"
```

### Issue: Migration Fails

**Check:**
- SQL syntax errors
- Permissions on database
- Extensions are available

**Solution:**
```bash
# Check PostgreSQL logs in EasyPanel
# Look for specific error messages
```

### Issue: Tables Not Visible

**Check:**
- Migration completed successfully
- Using correct database
- Schema is 'public'

**Solution:**
```sql
-- List all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Issue: RLS Blocking Queries

**Temporary Fix:**
```sql
-- Disable RLS for testing (re-enable after!)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

---

## Production Deployment Checklist

Before deploying to production on EasyPanel:

- [ ] Database password is strong and secure
- [ ] Environment variables are set in EasyPanel
- [ ] RLS policies are enabled and tested
- [ ] Backups are configured in EasyPanel
- [ ] SSL/TLS is enabled for database connections
- [ ] Service role key is kept secret (server-side only)
- [ ] CORS is configured properly
- [ ] Rate limiting is enabled
- [ ] Monitoring is set up

---

## Automated Deployment Workflow

For continuous deployment:

1. **Local Development**:
   ```bash
   npm run dev
   ```

2. **Test Database Connection**:
   ```bash
   npm run test:db
   ```

3. **Deploy Schema Changes**:
   ```bash
   npm run deploy:schema
   ```

4. **Deploy to EasyPanel**:
   - Push to Git repository
   - EasyPanel auto-deploys from Git
   - Environment variables are already set in EasyPanel

---

## Next Steps

1. ✅ Run the automated deployment script
2. ✅ Verify all tables are created
3. ✅ Test connection from your application
4. ✅ Configure authentication
5. ✅ Set up storage buckets
6. ✅ Deploy your Next.js app to EasyPanel

---

## Additional Resources

- **EasyPanel Docs**: https://easypanel.io/docs
- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

**Ready to deploy?** Run `npm run deploy:schema` to get started! 🚀
