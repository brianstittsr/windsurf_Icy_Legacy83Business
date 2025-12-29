# Legacy83 Platform - Supabase Deployment Guide

This guide explains how to deploy the Legacy83 platform schema to your Supabase instance on EasyPanel.

## Overview

The **Legacy83** platform maintains the same data structure as the original Strategic Value Plus (SVP) platform but is deployed as a separate database instance. This allows you to:

- Run Legacy83 independently from other platforms
- Maintain data isolation
- Use the same proven schema structure
- Deploy to different environments (staging, production, etc.)

---

## Database Instance Configuration

### Instance Name: Legacy83

When deploying to EasyPanel, you can configure your Supabase instance with the Legacy83 identifier:

**Option 1: Separate Database**
```sql
-- Create a dedicated database for Legacy83
CREATE DATABASE legacy83;
```

**Option 2: Schema Separation (Recommended)**
```sql
-- Use PostgreSQL schemas for logical separation
CREATE SCHEMA legacy83;
SET search_path TO legacy83;
```

**Option 3: Service Name**
- Name your EasyPanel Supabase service: `legacy83-db`
- This keeps it organizationally separate from other instances

---

## Quick Deployment

### Step 1: Configure Environment

Create or update `.env.local`:

```env
# Legacy83 Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@legacy83-db:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://your-domain.com/legacy83
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Specify schema if using schema separation
DATABASE_SCHEMA=legacy83
```

### Step 2: Deploy Schema

```bash
# Install dependencies
npm install

# Deploy Legacy83 schema
npm run deploy:schema
```

The deployment script will:
- Connect to your Legacy83 database instance
- Create all 50+ tables with the same structure
- Set up indexes, triggers, and RLS policies
- Verify successful deployment

### Step 3: Verify Deployment

```bash
# Test connection to Legacy83 instance
npm run test:db
```

---

## Schema Structure

The Legacy83 platform includes the same comprehensive schema:

### Core Business (10 tables)
- `users` - User accounts and profiles
- `organizations` - Company/organization records
- `opportunities` - Sales opportunities
- `projects` - Project management
- `meetings` - Meeting records
- `action_items` - Task tracking
- `rocks` - Strategic initiatives
- `documents` - Document management
- `activities` - Activity logs
- `notes` - Note-taking system

### Traction/EOS System (6 tables)
- `traction_rocks` - EOS Rocks
- `traction_scorecard_metrics` - KPI tracking
- `traction_issues` - Issue tracking
- `traction_todos` - Action items
- `traction_meetings` - EOS meetings
- `traction_team_members` - Team roster

### Affiliate Networking (8 tables)
- `affiliate_biographies` - Member profiles
- `gains_profiles` - GAINS framework
- `contact_spheres` - Contact planning
- `previous_customers` - Customer history
- `one_to_one_meetings` - 1-on-1 scheduling
- `referrals` - Referral tracking
- `affiliate_stats` - Performance metrics
- `ai_match_suggestions` - AI recommendations

### Calendar & Scheduling (6 tables)
- `calendar_events` - Event management
- `one_to_one_queue` - Meeting queue
- `team_member_availability` - Availability tracking
- `bookings` - Booking records
- `events` - Event system
- `book_call_leads` - Lead capture

### Integrations (15 tables)
- Apollo.io integration
- ThomasNet integration
- GoHighLevel CRM
- DocuSeal documents
- Mattermost playbooks

### Licensing & Deployments (3 tables)
- `software_keys` - License management
- `key_activations` - Activation tracking
- `white_label_deployments` - Multi-tenant deployments

---

## Multi-Instance Deployment

If you're running multiple instances (e.g., Legacy83 + SVP Platform):

### Separate Databases Approach

```bash
# Legacy83 instance
DATABASE_URL=postgresql://postgres:password@legacy83-db:5432/postgres

# SVP Platform instance
DATABASE_URL=postgresql://postgres:password@svp-db:5432/postgres
```

### Schema Separation Approach

```sql
-- Deploy to Legacy83 schema
SET search_path TO legacy83;
\i supabase/migrations/20250101000000_initial_schema.sql

-- Deploy to SVP schema
SET search_path TO svp;
\i supabase/migrations/20250101000000_initial_schema.sql
```

### Application Configuration

Update your application to connect to the correct instance:

```typescript
// lib/supabase-legacy83.ts
import { createClient } from '@supabase/supabase-js';

export const legacy83Client = createClient(
  process.env.NEXT_PUBLIC_LEGACY83_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_LEGACY83_SUPABASE_ANON_KEY!
);
```

---

## EasyPanel Configuration

### Service Naming

In EasyPanel, create your Supabase service with Legacy83 naming:

1. **Service Name**: `legacy83-supabase` or `legacy83-db`
2. **Database Name**: `legacy83` (or use default `postgres`)
3. **Internal Hostname**: `legacy83-db` (for internal connections)

### Environment Variables in EasyPanel

Set these in your EasyPanel service configuration:

```env
POSTGRES_DB=legacy83
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
ANON_KEY=your-anon-key
SERVICE_ROLE_KEY=your-service-role-key
```

### Network Configuration

**Internal Access (from other EasyPanel services):**
```
postgresql://postgres:password@legacy83-db:5432/postgres
```

**External Access (from outside EasyPanel):**
```
postgresql://postgres:password@your-domain.com:5432/postgres
```

---

## Data Migration

If you're migrating data from an existing SVP instance to Legacy83:

### Export from Source

```bash
# Export data from existing instance
pg_dump -h source-host -U postgres -d svp_platform -Fc -f legacy83_backup.dump
```

### Import to Legacy83

```bash
# Restore to Legacy83 instance
pg_restore -h legacy83-db -U postgres -d postgres -c legacy83_backup.dump
```

### Selective Migration

```sql
-- Copy specific tables
INSERT INTO legacy83.users SELECT * FROM svp.users;
INSERT INTO legacy83.organizations SELECT * FROM svp.organizations;
-- etc.
```

---

## Maintenance & Operations

### Backups

```bash
# Automated backup script
pg_dump -h legacy83-db -U postgres -d postgres \
  -Fc -f "legacy83_backup_$(date +%Y%m%d_%H%M%S).dump"
```

### Monitoring

Monitor your Legacy83 instance:
- Database size and growth
- Connection pool usage
- Query performance
- RLS policy effectiveness

### Updates

When updating the schema:

1. Create a new migration file:
   ```
   supabase/migrations/20250120000000_legacy83_update.sql
   ```

2. Apply the migration:
   ```bash
   psql $DATABASE_URL -f supabase/migrations/20250120000000_legacy83_update.sql
   ```

---

## Troubleshooting

### Connection Issues

**Problem**: Can't connect to Legacy83 instance

**Solutions**:
- Verify service name in EasyPanel matches your connection string
- Check that database is running (green status in EasyPanel)
- Confirm credentials are correct
- Test with `psql` directly:
  ```bash
  psql "postgresql://postgres:password@legacy83-db:5432/postgres"
  ```

### Schema Conflicts

**Problem**: Tables already exist

**Solutions**:
- Drop existing schema: `DROP SCHEMA legacy83 CASCADE;`
- Use a different schema name
- Clear the database and redeploy

### Performance Issues

**Problem**: Slow queries

**Solutions**:
- Check indexes are created: `\di` in psql
- Analyze query plans: `EXPLAIN ANALYZE SELECT ...`
- Update table statistics: `ANALYZE;`
- Review RLS policies for performance impact

---

## Security Considerations

### Row Level Security (RLS)

All tables have RLS enabled by default. Configure policies for Legacy83:

```sql
-- Example: Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Example: Admins can see all data
CREATE POLICY "Admins can view all" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### API Keys

- **Anon Key**: Use for client-side operations (respects RLS)
- **Service Role Key**: Use for server-side operations (bypasses RLS)
- **Never expose** service role key to clients

### Network Security

- Use SSL/TLS for all database connections in production
- Restrict database access to known IP addresses
- Use strong passwords (minimum 16 characters)
- Rotate credentials regularly

---

## Production Checklist

Before deploying Legacy83 to production:

- [ ] Database instance is properly named (legacy83-db)
- [ ] Strong passwords are set
- [ ] SSL/TLS is enabled
- [ ] Backups are configured and tested
- [ ] RLS policies are enabled and tested
- [ ] Monitoring is set up
- [ ] Connection pooling is configured
- [ ] Environment variables are secured
- [ ] API keys are generated and stored securely
- [ ] Schema migration is tested in staging
- [ ] Performance benchmarks are acceptable
- [ ] Documentation is updated

---

## Support & Resources

- **Schema Documentation**: `supabase/README.md`
- **Deployment Guide**: `EASYPANEL_SUPABASE_SETUP.md`
- **Troubleshooting**: `EASYPANEL_TROUBLESHOOTING.md`
- **Quick Start**: `SUPABASE_QUICK_START.md`

---

## Summary

The Legacy83 platform uses the same robust schema as SVP Platform but deployed as an independent instance. This provides:

✅ **Data Isolation** - Separate database for Legacy83  
✅ **Same Structure** - Proven schema design  
✅ **Easy Deployment** - Automated scripts  
✅ **Flexible Configuration** - Multiple deployment options  
✅ **Production Ready** - Security and performance built-in  

Deploy with: `npm run deploy:schema`
