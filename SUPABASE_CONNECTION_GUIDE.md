# Connecting Your Application to Supabase

This guide shows you how to connect your Legacy83 application to your Supabase instance on EasyPanel.

---

## 📋 Prerequisites

Before connecting, you need:

1. ✅ Supabase instance running on EasyPanel
2. ✅ Legacy83 schema deployed (tables created)
3. ✅ Database credentials from EasyPanel
4. ✅ Supabase API keys

---

## 🔑 Step 1: Get Your Credentials from EasyPanel

### Database Connection Details

1. **Open EasyPanel Dashboard**
2. **Navigate to your Supabase service** (e.g., `svp-pgvector`)
3. **Click "Credentials"** in the left sidebar
4. **Copy the following:**
   - Database password
   - Internal hostname (e.g., `svp-pgvector`)
   - Port (usually `5432`)

### Supabase API Keys

You have two options to get API keys:

#### Option A: Via Supabase Dashboard (if accessible)
1. Open Supabase dashboard in EasyPanel
2. Go to **Settings** > **API**
3. Copy:
   - **Project URL** (e.g., `https://your-domain.com`)
   - **anon/public key**
   - **service_role key** (keep this secret!)

#### Option B: Via Environment Variables (if dashboard not accessible)
Check your EasyPanel service environment variables for:
- `ANON_KEY`
- `SERVICE_ROLE_KEY`
- `API_EXTERNAL_URL` or `PUBLIC_REST_URL`

---

## ⚙️ Step 2: Configure Environment Variables

### Create `.env.local` File

If you don't have it yet:

```bash
cp .env.example .env.local
```

### Update `.env.local` with Your Credentials

```env
# Node Environment
NODE_ENV=development

# ============================================================================
# SUPABASE CONFIGURATION (EasyPanel)
# ============================================================================

# Database Direct Connection
# Replace with your actual values from EasyPanel
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@svp-pgvector:5432/postgres

# Supabase API Configuration
# Replace with your actual Supabase URL and keys
NEXT_PUBLIC_SUPABASE_URL=https://your-easypanel-domain.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Important Notes:

**For DATABASE_URL:**
- If running **inside EasyPanel**: Use internal hostname (e.g., `svp-pgvector`)
- If running **locally**: Use external domain (e.g., `your-domain.com:5432`)

**For NEXT_PUBLIC_SUPABASE_URL:**
- This should be your public-facing Supabase API URL
- Format: `https://your-domain.com` or `https://subdomain.your-domain.com`

---

## 🔌 Step 3: Use Supabase in Your Application

The Supabase client is now configured in `lib/supabase.ts`.

### Client-Side Usage (React Components)

```typescript
import { supabase } from '@/lib/supabase';

// Example: Fetch users
async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('is_active', true);
  
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  
  return data;
}

// Example: Create organization
async function createOrganization(name: string) {
  const { data, error } = await supabase
    .from('organizations')
    .insert({ name })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
  
  return data;
}

// Example: Update opportunity
async function updateOpportunity(id: string, updates: any) {
  const { data, error } = await supabase
    .from('opportunities')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating opportunity:', error);
    throw error;
  }
  
  return data;
}
```

### Server-Side Usage (API Routes, Server Components)

```typescript
import { supabaseAdmin } from '@/lib/supabase';

// Example: API Route (app/api/users/route.ts)
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*');
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  
  return Response.json(data);
}

// Example: Server Component
async function UsersPage() {
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Authentication Helpers

```typescript
import { getCurrentUser, isAuthenticated, signOut } from '@/lib/supabase';

// Check if user is logged in
const authenticated = await isAuthenticated();

// Get current user
const user = await getCurrentUser();

// Sign out
await signOut();
```

---

## 🧪 Step 4: Test the Connection

Run the test script to verify everything is working:

```bash
npm run test:db
```

This will:
- ✅ Connect to Supabase
- ✅ Test basic CRUD operations
- ✅ Verify schema access
- ✅ Check authentication setup

---

## 🔄 Migrating from Firebase

If you're migrating from Firebase, here's how to update your code:

### Before (Firebase)

```typescript
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

// Fetch users
const usersRef = collection(db, 'users');
const snapshot = await getDocs(usersRef);
const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

// Create user
await addDoc(collection(db, 'users'), {
  name: 'John Doe',
  email: 'john@example.com',
});
```

### After (Supabase)

```typescript
import { supabase } from '@/lib/supabase';

// Fetch users
const { data: users } = await supabase
  .from('users')
  .select('*');

// Create user
await supabase
  .from('users')
  .insert({
    name: 'John Doe',
    email: 'john@example.com',
  });
```

---

## 🎯 Common Queries

### Fetch with Filters

```typescript
// Get active users
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('is_active', true);

// Get opportunities by stage
const { data } = await supabase
  .from('opportunities')
  .select('*')
  .eq('stage', 'proposal')
  .order('created_at', { ascending: false });
```

### Joins (Foreign Keys)

```typescript
// Get opportunities with organization details
const { data } = await supabase
  .from('opportunities')
  .select(`
    *,
    organization:organizations(*)
  `);

// Get projects with team members
const { data } = await supabase
  .from('projects')
  .select(`
    *,
    owner:users!owner_id(name, email)
  `);
```

### Insert with Relations

```typescript
// Create opportunity with organization
const { data } = await supabase
  .from('opportunities')
  .insert({
    title: 'New Deal',
    organization_id: 'org-uuid',
    owner_id: 'user-uuid',
    stage: 'discovery',
    expected_close_date: '2025-12-31',
  })
  .select();
```

### Real-time Subscriptions

```typescript
// Subscribe to new opportunities
const channel = supabase
  .channel('opportunities-changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'legacy83',
      table: 'opportunities',
    },
    (payload) => {
      console.log('New opportunity:', payload.new);
    }
  )
  .subscribe();

// Unsubscribe when done
channel.unsubscribe();
```

---

## 🔐 Security: Row Level Security (RLS)

Currently, RLS is **enabled** but **no policies are active**. This means:

⚠️ **Tables are not accessible via the anon key** until you add policies.

### Option 1: Use Service Role Key (Server-Side Only)

```typescript
import { supabaseAdmin } from '@/lib/supabase';

// This bypasses RLS - use only in API routes
const { data } = await supabaseAdmin.from('users').select('*');
```

### Option 2: Add RLS Policies

```sql
-- Allow authenticated users to read their own data
CREATE POLICY "Users can view own data" ON legacy83.users
  FOR SELECT
  USING (auth.uid()::text = firebase_uid);

-- Allow all reads (development only!)
CREATE POLICY "Allow all reads" ON legacy83.users
  FOR SELECT
  USING (true);
```

---

## 🚨 Troubleshooting

### Error: "getaddrinfo ENOTFOUND supabasevp-db"

**Problem**: Can't connect to database

**Solutions**:
1. Check `DATABASE_URL` in `.env.local`
2. If running **locally**, use external domain instead of internal hostname
3. Verify database service is running in EasyPanel (green status)

**Fix for local development:**
```env
# Change from internal hostname
DATABASE_URL=postgresql://postgres:password@svp-pgvector:5432/postgres

# To external domain
DATABASE_URL=postgresql://postgres:password@your-domain.com:5432/postgres
```

### Error: "Invalid API key"

**Problem**: Wrong or missing Supabase keys

**Solutions**:
1. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
2. Check keys in EasyPanel environment variables
3. Ensure keys are complete (they're very long JWT tokens)

### Error: "relation does not exist"

**Problem**: Schema not set correctly

**Solutions**:
1. Verify schema was created: `SELECT schema_name FROM information_schema.schemata;`
2. Check `lib/supabase.ts` has `schema: 'legacy83'` configured
3. Redeploy schema: `npm run deploy:schema`

### Error: "permission denied for table"

**Problem**: RLS is blocking access

**Solutions**:
1. Use `supabaseAdmin` for server-side operations
2. Add RLS policies for client-side access
3. Temporarily disable RLS for testing: `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`

---

## 📚 Next Steps

1. **Configure Authentication**
   - Set up Supabase Auth providers
   - Add login/signup pages
   - Implement protected routes

2. **Add RLS Policies**
   - Define access rules for each table
   - Test policies thoroughly
   - Document security model

3. **Optimize Queries**
   - Add indexes for frequently queried fields
   - Use select() to fetch only needed columns
   - Implement pagination for large datasets

4. **Set Up Real-time**
   - Enable real-time for collaborative features
   - Subscribe to relevant table changes
   - Handle connection states

---

## 🔗 Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase JS Client**: https://supabase.com/docs/reference/javascript
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security
- **Database Functions**: https://supabase.com/docs/guides/database/functions

---

## ✅ Connection Checklist

- [ ] `.env.local` created with correct credentials
- [ ] `DATABASE_URL` points to correct database
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set (for server-side)
- [ ] Test connection passes: `npm run test:db`
- [ ] Can query tables from application
- [ ] RLS policies configured (or using service role key)
- [ ] Authentication working (if needed)

---

**Your application is now connected to Supabase!** 🎉

Use the `supabase` client in your components and `supabaseAdmin` in API routes to interact with your Legacy83 database.
