# EasyPanel Supabase Troubleshooting Guide

## Issue: Supabase Dashboard Not Opening

### Problem
The Supabase web dashboard (Studio) is not accessible from EasyPanel. You see the service running but can't access the UI.

### Root Cause
Supabase Studio needs to be exposed through a domain or port mapping in EasyPanel. By default, it runs on port 3000 internally but isn't accessible externally.

---

## Solutions

### Solution 1: Expose Supabase Studio via Domain (Recommended)

1. **In EasyPanel, go to your `supabasevp` service**

2. **Click on "Expose" in the left sidebar**

3. **Add a new domain exposure:**
   - **Service**: Select `supabase-studio` or the Studio container
   - **Port**: `3000` (Supabase Studio default port)
   - **Domain**: Choose one of these options:
     - Use EasyPanel subdomain: `supabase.your-easypanel-domain.com`
     - Use custom domain: `supabase.yourdomain.com`
   - **Enable HTTPS**: Yes (recommended)

4. **Save and wait for deployment** (30-60 seconds)

5. **Access the dashboard:**
   - Navigate to `https://supabase.your-easypanel-domain.com`
   - You should see the Supabase login screen

### Solution 2: Use Port Forwarding (Development Only)

If you're running locally and want quick access:

1. **In EasyPanel, find the Supabase Studio container**

2. **Note the internal port** (usually 3000)

3. **Set up port forwarding:**
   ```bash
   # SSH into your EasyPanel server
   ssh user@your-easypanel-server
   
   # Forward port 3000 from the container
   docker port <supabase-studio-container-id>
   ```

4. **Access via:** `http://localhost:3000`

**Note:** This is temporary and only works while SSH session is active.

### Solution 3: Access via PostgreSQL Tools (Alternative)

If you can't access the web UI, you can still manage your database using PostgreSQL tools:

#### Option A: Using pgAdmin

1. **Install pgAdmin** (https://www.pgadmin.org/)

2. **Create new server connection:**
   - **Host**: Your EasyPanel domain or IP
   - **Port**: `5432`
   - **Database**: `postgres`
   - **Username**: `postgres`
   - **Password**: From EasyPanel credentials

3. **Connect and manage** tables, run queries, etc.

#### Option B: Using DBeaver

1. **Install DBeaver** (https://dbeaver.io/)

2. **Create PostgreSQL connection:**
   - **Host**: Your EasyPanel domain
   - **Port**: `5432`
   - **Database**: `postgres`
   - **Username**: `postgres`
   - **Password**: From EasyPanel credentials

3. **Connect and use** visual query builder

#### Option C: Using psql (Command Line)

```bash
# Connect directly to database
psql "postgresql://postgres:YOUR_PASSWORD@your-easypanel-domain:5432/postgres"

# List all tables
\dt

# Describe a table
\d users

# Run queries
SELECT * FROM users LIMIT 10;
```

---

## Verifying Supabase Components

### Check Which Services Are Running

In EasyPanel, your Supabase installation should have these containers:

1. **supabase-db** (PostgreSQL database) - Port 5432
2. **supabase-studio** (Web dashboard) - Port 3000
3. **supabase-kong** (API gateway) - Port 8000
4. **supabase-auth** (Authentication service) - Port 9999
5. **supabase-rest** (PostgREST API) - Port 3000
6. **supabase-realtime** (Realtime service) - Port 4000
7. **supabase-storage** (Storage service) - Port 5000

### Verify Services in EasyPanel

1. Go to your `supabasevp` service
2. Check the **Overview** tab
3. Verify all containers show green status
4. Check logs for any errors

---

## Getting API Keys Without Dashboard

If you can't access the dashboard but need API keys:

### Method 1: Check Environment Variables

1. **In EasyPanel, go to your service**
2. **Click "Environment" or "Variables"**
3. **Look for these variables:**
   - `ANON_KEY` - Your public anon key
   - `SERVICE_ROLE_KEY` - Your service role key
   - `JWT_SECRET` - Used to generate keys

### Method 2: Generate Keys from JWT Secret

If you have the JWT_SECRET, you can generate keys:

```javascript
// Create a file: generate-keys.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-jwt-secret-from-easypanel';

// Generate anon key
const anonKey = jwt.sign(
  {
    role: 'anon',
    iss: 'supabase',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60) // 10 years
  },
  JWT_SECRET
);

// Generate service role key
const serviceRoleKey = jwt.sign(
  {
    role: 'service_role',
    iss: 'supabase',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60) // 10 years
  },
  JWT_SECRET
);

console.log('Anon Key:', anonKey);
console.log('Service Role Key:', serviceRoleKey);
```

Run it:
```bash
npm install jsonwebtoken
node generate-keys.js
```

### Method 3: Check Docker Container Logs

```bash
# SSH into EasyPanel server
ssh user@your-server

# Find Supabase containers
docker ps | grep supabase

# Check Kong container logs (API gateway shows keys on startup)
docker logs <kong-container-id> 2>&1 | grep -i "key"
```

---

## Alternative: Deploy Schema Without Dashboard

You can deploy your schema without accessing the dashboard:

### Using the Automated Script

```bash
# 1. Get database credentials from EasyPanel
# 2. Update .env.local with DATABASE_URL
# 3. Run deployment script

npm run deploy:schema
```

### Using psql Directly

```bash
# Get your DATABASE_URL from EasyPanel
# Format: postgresql://postgres:password@host:5432/postgres

# Deploy schema
psql "$DATABASE_URL" -f supabase/migrations/20250101000000_initial_schema.sql

# Verify
psql "$DATABASE_URL" -c "\dt"
```

### Using Docker Exec

```bash
# SSH into EasyPanel server
ssh user@your-server

# Find database container
docker ps | grep postgres

# Copy migration file to container
docker cp supabase/migrations/20250101000000_initial_schema.sql <container-id>:/tmp/

# Execute migration
docker exec -i <container-id> psql -U postgres -d postgres -f /tmp/20250101000000_initial_schema.sql
```

---

## Common EasyPanel Configuration Issues

### Issue 1: Port Not Exposed

**Symptom:** Service running but can't access web interface

**Solution:**
1. Go to service settings
2. Add port exposure for 3000 (Studio)
3. Add domain mapping
4. Enable HTTPS

### Issue 2: Wrong Container Selected

**Symptom:** Getting 404 or connection refused

**Solution:**
- Make sure you're exposing the `supabase-studio` container, not the database
- Studio runs on port 3000, database on 5432

### Issue 3: Network Isolation

**Symptom:** Services can't communicate

**Solution:**
1. Check that all Supabase services are in the same network
2. In EasyPanel, verify network settings
3. Ensure services can resolve each other by name

### Issue 4: Missing Environment Variables

**Symptom:** Services start but don't work properly

**Solution:**
1. Check all required environment variables are set
2. Verify JWT_SECRET is consistent across services
3. Check database connection strings

---

## Quick Diagnostic Checklist

Run through this checklist:

- [ ] All Supabase containers are running (green status)
- [ ] Database container is accessible on port 5432
- [ ] Studio container is running on port 3000
- [ ] Domain is configured and pointing to Studio
- [ ] HTTPS is enabled (if using custom domain)
- [ ] Environment variables are set correctly
- [ ] Network connectivity between containers works
- [ ] Firewall allows traffic on required ports

---

## Getting Help

If none of these solutions work:

1. **Check EasyPanel Logs:**
   - Go to your service
   - Click "Logs" tab
   - Look for error messages

2. **Check Container Logs:**
   ```bash
   docker logs <container-id> --tail 100
   ```

3. **Verify Database Connection:**
   ```bash
   npm run test:db
   ```

4. **EasyPanel Support:**
   - Check EasyPanel documentation
   - Visit EasyPanel Discord/Forum
   - Contact EasyPanel support

5. **Supabase Community:**
   - Supabase Discord: https://discord.supabase.com
   - GitHub Discussions: https://github.com/supabase/supabase/discussions

---

## Workaround: Use Direct Database Access

While troubleshooting dashboard access, you can still work with your database:

### 1. Deploy Schema
```bash
npm run deploy:schema
```

### 2. Test Connection
```bash
npm run test:db
```

### 3. Use Your Application
Your Next.js app can connect directly to the database using the Supabase client, even without dashboard access.

### 4. Manage via SQL
Use any PostgreSQL client to run queries and manage your database.

---

## Success Criteria

You'll know it's working when:

✅ You can access Supabase Studio at your configured domain  
✅ You can log in with your credentials  
✅ You see the Table Editor with your tables  
✅ You can run SQL queries in the SQL Editor  
✅ API keys are visible in Settings > API  

---

**Need immediate access?** Use the automated deployment script (`npm run deploy:schema`) to deploy your schema without the dashboard, then troubleshoot dashboard access separately.
