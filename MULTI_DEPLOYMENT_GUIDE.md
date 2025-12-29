# Multi-Deployment Guide - Legacy83 Platform

This guide explains how to deploy multiple instances of the Legacy83 platform schema to the same PostgreSQL database without conflicts.

---

## 🎯 Overview

You can deploy the **same schema structure** multiple times using PostgreSQL schemas (namespaces). Each deployment is completely isolated:

- ✅ **No table name conflicts** - Each schema has its own tables
- ✅ **Same database** - Easier management and backups
- ✅ **Independent data** - Complete isolation between deployments
- ✅ **Shared resources** - Connection pooling, extensions

---

## 🚀 Quick Start

### Deploy Multiple Instances

```bash
# Deploy Legacy83 instance
npm run deploy:schema:multi legacy83

# Deploy SVP Platform instance
npm run deploy:schema:multi svp_platform

# Deploy Client Alpha instance
npm run deploy:schema:multi client_alpha
```

Each command creates a separate schema with the full table structure.

---

## 📊 Schema Architecture

### What Gets Created

When you run `deploy:schema:multi <schema_name>`, the script:

1. **Creates schema** if it doesn't exist
2. **Sets search path** to the new schema
3. **Deploys all tables** (50+ tables)
4. **Creates indexes** (40+ indexes)
5. **Creates functions** (triggers, utilities)
6. **Enables RLS** on all tables
7. **Verifies deployment** with test operations

### Example: Three Deployments

```
postgres database
├── legacy83 schema
│   ├── users
│   ├── organizations
│   ├── opportunities
│   └── ... (50+ tables)
├── svp_platform schema
│   ├── users
│   ├── organizations
│   ├── opportunities
│   └── ... (50+ tables)
└── client_alpha schema
    ├── users
    ├── organizations
    ├── opportunities
    └── ... (50+ tables)
```

---

## 🔧 Configuration

### Environment Variables

Use the **same** `.env.local` for all deployments:

```env
# Single database connection for all schemas
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@host:5432/postgres

# API configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Application Configuration

Configure your application to connect to specific schemas:

```typescript
// lib/database-legacy83.ts
import { Client } from 'pg';

export async function getLegacy83Client() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query('SET search_path TO legacy83');
  return client;
}

// lib/database-svp.ts
export async function getSVPClient() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query('SET search_path TO svp_platform');
  return client;
}
```

---

## 📋 Deployment Workflows

### Scenario 1: Multi-Tenant SaaS

Deploy a separate schema for each client:

```bash
# Client deployments
npm run deploy:schema:multi client_acme
npm run deploy:schema:multi client_globex
npm run deploy:schema:multi client_initech
```

**Application routing:**
```typescript
function getClientSchema(subdomain: string): string {
  return `client_${subdomain}`;
}

// Set schema based on subdomain
await client.query(`SET search_path TO ${getClientSchema(subdomain)}`);
```

### Scenario 2: Environment Separation

Deploy separate schemas for dev/staging/production:

```bash
# Environment deployments
npm run deploy:schema:multi legacy83_dev
npm run deploy:schema:multi legacy83_staging
npm run deploy:schema:multi legacy83_prod
```

### Scenario 3: Feature Branches

Deploy schemas for testing new features:

```bash
# Feature branch deployments
npm run deploy:schema:multi legacy83_feature_auth
npm run deploy:schema:multi legacy83_feature_billing
```

---

## 🔍 Managing Multiple Schemas

### List All Schemas

```sql
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
ORDER BY schema_name;
```

### Check Tables in Schema

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'legacy83'
ORDER BY table_name;
```

### Get Schema Size

```sql
SELECT 
  schema_name,
  pg_size_pretty(sum(pg_total_relation_size(quote_ident(schemaname) || '.' || quote_ident(tablename)))::bigint) as size
FROM pg_tables
WHERE schemaname = 'legacy83'
GROUP BY schema_name;
```

### Drop Schema

```sql
-- Drop schema and all its tables
DROP SCHEMA legacy83 CASCADE;
```

---

## 🔐 Security & Access Control

### Schema-Level Permissions

Grant access to specific schemas:

```sql
-- Create role for Legacy83
CREATE ROLE legacy83_app;

-- Grant schema access
GRANT USAGE ON SCHEMA legacy83 TO legacy83_app;
GRANT ALL ON ALL TABLES IN SCHEMA legacy83 TO legacy83_app;
GRANT ALL ON ALL SEQUENCES IN SCHEMA legacy83 TO legacy83_app;

-- Future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA legacy83
  GRANT ALL ON TABLES TO legacy83_app;
```

### Connection Strings per Schema

```env
# Legacy83 connection (using role)
LEGACY83_DATABASE_URL=postgresql://legacy83_app:password@host:5432/postgres?options=-c%20search_path=legacy83

# SVP Platform connection
SVP_DATABASE_URL=postgresql://svp_app:password@host:5432/postgres?options=-c%20search_path=svp_platform
```

---

## 📊 Data Migration Between Schemas

### Copy Data from One Schema to Another

```sql
-- Copy users from legacy83 to svp_platform
INSERT INTO svp_platform.users
SELECT * FROM legacy83.users;

-- Copy with transformation
INSERT INTO svp_platform.organizations (id, name, created_at)
SELECT id, name, created_at 
FROM legacy83.organizations
WHERE is_active = true;
```

### Export Schema Data

```bash
# Export single schema
pg_dump -h host -U postgres -n legacy83 -Fc postgres > legacy83_backup.dump

# Restore to different schema
pg_restore -h host -U postgres -n svp_platform -d postgres legacy83_backup.dump
```

---

## 🧪 Testing Multiple Deployments

### Test Script for Multi-Schema

```javascript
// test-multi-schema.js
const { Client } = require('pg');

async function testSchema(schemaName) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  await client.connect();
  await client.query(`SET search_path TO ${schemaName}`);
  
  // Test operations
  const result = await client.query('SELECT COUNT(*) FROM users');
  console.log(`${schemaName}: ${result.rows[0].count} users`);
  
  await client.end();
}

// Test all schemas
Promise.all([
  testSchema('legacy83'),
  testSchema('svp_platform'),
  testSchema('client_alpha'),
]);
```

---

## 🎯 Best Practices

### Naming Conventions

**Good schema names:**
- ✅ `legacy83` - Clear, concise
- ✅ `client_acme` - Descriptive
- ✅ `legacy83_staging` - Environment suffix

**Avoid:**
- ❌ `schema1`, `schema2` - Not descriptive
- ❌ `Legacy-83` - No hyphens
- ❌ `LEGACY83` - Use lowercase

### Schema Management

1. **Document each schema** - Keep a registry of what each schema is for
2. **Monitor schema sizes** - Track growth over time
3. **Regular backups** - Backup each schema separately
4. **Clean up unused schemas** - Drop old feature/test schemas
5. **Use consistent naming** - Follow a naming convention

### Performance Considerations

- **Shared indexes** - Each schema has its own indexes (no sharing)
- **Connection pooling** - Use separate pools per schema if needed
- **Query performance** - Same as single schema (no overhead)
- **Backup time** - Increases with more schemas

---

## 🚨 Troubleshooting

### Problem: Tables Already Exist

**Error:**
```
ERROR: relation "users" already exists
```

**Solutions:**
1. Use a different schema name
2. Drop existing schema: `DROP SCHEMA schema_name CASCADE;`
3. Check if deployment already completed

### Problem: Can't Find Tables

**Error:**
```
ERROR: relation "users" does not exist
```

**Solution:**
```sql
-- Set search path
SET search_path TO legacy83;

-- Or use fully qualified names
SELECT * FROM legacy83.users;
```

### Problem: Permission Denied

**Error:**
```
ERROR: permission denied for schema legacy83
```

**Solution:**
```sql
-- Grant schema access
GRANT USAGE ON SCHEMA legacy83 TO your_user;
GRANT ALL ON ALL TABLES IN SCHEMA legacy83 TO your_user;
```

---

## 📈 Monitoring & Maintenance

### Monitor All Schemas

```sql
-- Get statistics for all schemas
SELECT 
  schemaname,
  COUNT(*) as table_count,
  pg_size_pretty(SUM(pg_total_relation_size(schemaname || '.' || tablename))) as total_size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
GROUP BY schemaname
ORDER BY schemaname;
```

### Vacuum All Schemas

```bash
# Vacuum each schema
psql $DATABASE_URL -c "VACUUM ANALYZE legacy83.users;"
psql $DATABASE_URL -c "VACUUM ANALYZE svp_platform.users;"
```

---

## 🎓 Advanced Usage

### Cross-Schema Queries

```sql
-- Join data across schemas
SELECT 
  l.name as legacy_name,
  s.name as svp_name
FROM legacy83.users l
FULL OUTER JOIN svp_platform.users s ON l.email = s.email;
```

### Schema Templates

```sql
-- Create template schema
CREATE SCHEMA template_legacy83;
-- Deploy to template
-- Clone for new deployments
CREATE SCHEMA client_new (LIKE template_legacy83 INCLUDING ALL);
```

### Dynamic Schema Switching

```typescript
// Middleware to set schema based on request
export async function schemaMiddleware(req, res, next) {
  const schema = req.headers['x-schema'] || 'legacy83';
  await db.query(`SET search_path TO ${schema}`);
  next();
}
```

---

## ✅ Deployment Checklist

Before deploying a new schema:

- [ ] Choose descriptive schema name
- [ ] Verify database connection
- [ ] Check available disk space
- [ ] Document schema purpose
- [ ] Run deployment: `npm run deploy:schema:multi <name>`
- [ ] Verify tables created
- [ ] Test basic operations
- [ ] Configure application access
- [ ] Set up monitoring
- [ ] Create backup schedule

---

## 📚 Summary

**Multi-schema deployment allows you to:**

✅ Deploy unlimited instances without conflicts  
✅ Isolate data per client/environment/feature  
✅ Use single database for easier management  
✅ Share connection pooling and resources  
✅ Maintain separate backups per schema  
✅ Scale horizontally with ease  

**Deploy your next instance:**
```bash
npm run deploy:schema:multi your_schema_name
```

---

## 🔗 Related Documentation

- **Single Deployment**: `LEGACY83_DEPLOYMENT.md`
- **EasyPanel Setup**: `EASYPANEL_SUPABASE_SETUP.md`
- **Schema Reference**: `supabase/README.md`
- **Troubleshooting**: `EASYPANEL_TROUBLESHOOTING.md`
