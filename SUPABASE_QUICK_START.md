# Supabase Quick Start Guide

**5-Minute Setup for SVP Platform Database**

## Prerequisites
- Supabase account (free tier works)
- 5 minutes of your time

---

## Step-by-Step Deployment

### 1. Create Supabase Project (2 minutes)

1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Fill in:
   - **Name**: `svp-platform`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (e.g., `us-east-1`)
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### 2. Deploy Database Schema (2 minutes)

1. In Supabase Dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open this file: `supabase/migrations/20250101000000_initial_schema.sql`
4. Copy **all** contents and paste into SQL Editor
5. Click **"Run"** (or press `Ctrl+Enter`)
6. Wait 30-60 seconds for completion
7. ✅ Check for "Success" message

### 3. Get Your Credentials (1 minute)

1. Go to **"Project Settings"** > **"API"**
2. Copy these values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

3. Update your `.env.local` file:

```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Add Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

### 4. Verify Deployment (30 seconds)

1. In Supabase Dashboard, click **"Table Editor"**
2. You should see 50+ tables listed
3. Click on `users` table to verify structure
4. ✅ Done!

---

## What Was Created?

Your database now includes:

✅ **Core Tables**: users, organizations, opportunities, projects, meetings  
✅ **Traction/EOS**: rocks, scorecard metrics, issues, todos  
✅ **Affiliate System**: biographies, referrals, one-to-one meetings  
✅ **Calendar**: events, bookings, availability  
✅ **Integrations**: Apollo, ThomasNet, GoHighLevel, DocuSeal, Mattermost  
✅ **Security**: Row Level Security (RLS) enabled  
✅ **Performance**: 40+ indexes for fast queries  

---

## Next Steps

### Option A: Start Fresh (New Project)
1. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Create `lib/supabase.ts`:
   ```typescript
   import { createClient } from '@supabase/supabase-js';

   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );
   ```

3. Start using:
   ```typescript
   import { supabase } from '@/lib/supabase';

   // Query data
   const { data, error } = await supabase
     .from('users')
     .select('*');
   ```

### Option B: Migrate from Firebase
1. Export your Firestore data
2. Transform to PostgreSQL format
3. Import using SQL Editor
4. Update app code to use Supabase SDK

See [SUPABASE_DEPLOYMENT_GUIDE.md](./SUPABASE_DEPLOYMENT_GUIDE.md) for detailed migration instructions.

---

## Common Tasks

### Create a User
```typescript
const { data, error } = await supabase
  .from('users')
  .insert({
    email: 'user@example.com',
    name: 'John Doe',
    role: 'team',
    status: 'active'
  })
  .select()
  .single();
```

### Query Opportunities
```typescript
const { data, error } = await supabase
  .from('opportunities')
  .select('*, organizations(*)')
  .eq('stage', 'qualified')
  .order('created_at', { ascending: false });
```

### Update a Record
```typescript
const { data, error } = await supabase
  .from('projects')
  .update({ status: 'completed', progress: 100 })
  .eq('id', projectId)
  .select()
  .single();
```

### Delete a Record
```typescript
const { error } = await supabase
  .from('action_items')
  .delete()
  .eq('id', actionItemId);
```

---

## Setup Authentication (Optional)

1. In Supabase Dashboard, go to **"Authentication"** > **"Providers"**
2. Enable **Email** provider
3. Configure redirect URLs:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password'
});
```

### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
});
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

---

## Setup Storage (Optional)

1. In Supabase Dashboard, go to **"Storage"**
2. Create buckets:
   - `documents` (private)
   - `avatars` (public)
   - `logos` (public)

### Upload File
```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file);
```

### Get Public URL
```typescript
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.png`);

console.log(data.publicUrl);
```

---

## Troubleshooting

**❌ Migration fails with errors**
- Check SQL syntax in migration file
- Ensure you copied the entire file
- Try running in smaller chunks

**❌ Can't connect from app**
- Verify `.env.local` has correct credentials
- Check Supabase URL format
- Ensure anon key is correct

**❌ Queries return empty**
- Check RLS policies (may be blocking access)
- Verify data exists in table
- Test with service role key

**❌ "relation does not exist" error**
- Migration didn't complete
- Re-run migration SQL
- Check Table Editor for tables

---

## Need Help?

📖 **Full Guide**: [SUPABASE_DEPLOYMENT_GUIDE.md](./SUPABASE_DEPLOYMENT_GUIDE.md)  
📚 **Schema Docs**: [supabase/README.md](./supabase/README.md)  
🌐 **Supabase Docs**: https://supabase.com/docs  
💬 **Discord**: https://discord.supabase.com  

---

## Security Checklist

Before going to production:

- [ ] Change default database password
- [ ] Enable RLS on all tables
- [ ] Configure proper RLS policies
- [ ] Set up authentication
- [ ] Configure CORS settings
- [ ] Enable database backups
- [ ] Set up monitoring/alerts
- [ ] Review and limit API key permissions
- [ ] Configure rate limiting
- [ ] Test security policies

---

**You're all set!** 🎉

Your Supabase database is ready to use. Start building your application with a production-ready PostgreSQL database.
