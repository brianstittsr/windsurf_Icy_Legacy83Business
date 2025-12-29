# Installing Supabase Studio on EasyPanel

This guide explains how to install and configure Supabase Studio (the dashboard UI) on EasyPanel.

---

## 🎯 Overview

**Supabase Studio** is the web-based dashboard for managing your Supabase database. On EasyPanel, it runs as a separate Docker container that needs to be properly configured.

---

## 📦 Installation Methods

### **Method 1: Using EasyPanel's Supabase Template (Recommended)**

EasyPanel has a built-in Supabase template that includes Studio.

#### Step 1: Install Supabase from Template

1. **Open EasyPanel Dashboard**
2. Click **"+ Create"** button
3. Select **"App"** → **"From Template"**
4. Search for **"Supabase"**
5. Click **"Deploy"**

#### Step 2: Configure the Template

The template will ask for:

- **Project Name**: `legacy83-supabase` (or your preferred name)
- **Postgres Password**: Choose a strong password
- **JWT Secret**: Auto-generated (or provide your own)
- **Dashboard Password**: Password for Studio access

#### Step 3: Wait for Deployment

EasyPanel will deploy multiple services:
- ✅ `db` - PostgreSQL database
- ✅ `studio` - Supabase Studio (dashboard)
- ✅ `kong` - API Gateway
- ✅ `auth` - Authentication service
- ✅ `rest` - PostgREST API
- ✅ `realtime` - Realtime server
- ✅ `storage` - Storage API
- ✅ `imgproxy` - Image optimization
- ✅ `vector` - Vector/AI extensions

#### Step 4: Access Studio

Once deployed:
1. Find the **studio** service
2. Click on it
3. Click **"Open"** or use the provided URL
4. Login with your dashboard password

---

### **Method 2: Manual Studio Installation**

If you already have a database and just need Studio:

#### Step 1: Create New Service

1. In EasyPanel, go to your project
2. Click **"+ Add Service"**
3. Select **"App"**

#### Step 2: Configure Studio Container

**Basic Settings:**
- **Service Name**: `studio`
- **Docker Image**: `supabase/studio:latest`

**Environment Variables:**
```env
SUPABASE_URL=http://kong:8000
SUPABASE_PUBLIC_URL=https://your-domain.com
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
STUDIO_PG_META_URL=http://rest:3000
POSTGRES_PASSWORD=your-db-password
DEFAULT_ORGANIZATION=Default Organization
DEFAULT_PROJECT=Default Project
SUPABASE_REST_URL=http://rest:3000
```

**Port Configuration:**
- **Container Port**: `3000`
- **Expose Port**: `3000` (or your preferred port)

**Domain Configuration:**
- Add a domain or subdomain (e.g., `studio.your-domain.com`)
- Enable SSL if desired

#### Step 3: Network Configuration

Ensure Studio can communicate with other services:
- Studio needs access to: `kong`, `rest`, `db`
- Use EasyPanel's internal networking
- Services should be in the same project

#### Step 4: Start the Service

1. Click **"Deploy"**
2. Wait for container to start
3. Check logs for any errors

---

## 🔧 Fixing 502 Errors

If you're getting 502 errors, try these fixes:

### **Fix 1: Verify All Services are Running**

1. Go to your Supabase project in EasyPanel
2. Check that ALL services show **green status**:
   - `db` ✅
   - `studio` ✅
   - `kong` ✅
   - `rest` ✅
   - `auth` ✅

If any are red or yellow, click and check logs.

### **Fix 2: Restart Studio Service**

1. Click on **studio** service
2. Click **"Restart"** button
3. Wait 30-60 seconds
4. Try accessing again

### **Fix 3: Check Studio Environment Variables**

Verify these are set correctly:

```env
# Must point to Kong API gateway
SUPABASE_URL=http://kong:8000

# Your public-facing URL
SUPABASE_PUBLIC_URL=https://your-domain.com

# Must match your actual keys
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Must point to PostgREST
STUDIO_PG_META_URL=http://rest:3000
```

### **Fix 4: Check Domain/Port Configuration**

1. Click on **studio** service
2. Go to **"Domains"** tab
3. Verify domain is properly configured
4. Check port mapping: Container `3000` → Host `3000` (or your port)

### **Fix 5: Check Kong Gateway**

Studio communicates through Kong. Verify Kong is working:

1. Click on **kong** service
2. Check logs for errors
3. Verify Kong environment variables:
   ```env
   KONG_DATABASE=off
   KONG_DECLARATIVE_CONFIG=/var/lib/kong/kong.yml
   ```

### **Fix 6: Rebuild Studio Container**

If all else fails:

1. Click on **studio** service
2. Click **"Settings"**
3. Click **"Rebuild"**
4. Wait for rebuild to complete

---

## 🔐 Accessing Studio

### **Default Access**

After installation, access Studio at:
- **URL**: `https://your-studio-domain.com`
- **Port**: `3000` (if using port-based access)

### **Login Credentials**

**If using template:**
- Use the dashboard password you set during installation

**If manual install:**
- Studio may not require login by default
- Configure authentication via environment variables

---

## 🎨 Studio Features

Once connected, you can:

- ✅ **Table Editor** - View and edit data
- ✅ **SQL Editor** - Run custom queries
- ✅ **Database** - Manage schema, tables, columns
- ✅ **Authentication** - Configure auth providers
- ✅ **Storage** - Manage file uploads
- ✅ **API Docs** - Auto-generated API documentation
- ✅ **Logs** - View database and API logs

---

## 🔍 Troubleshooting

### **Problem: Studio shows blank page**

**Solutions:**
1. Check browser console for errors
2. Verify `SUPABASE_PUBLIC_URL` is correct
3. Clear browser cache
4. Try incognito/private mode

### **Problem: Can't connect to database**

**Solutions:**
1. Verify `STUDIO_PG_META_URL` points to `rest` service
2. Check `rest` service is running
3. Verify database credentials in environment variables

### **Problem: 404 Not Found**

**Solutions:**
1. Check domain configuration
2. Verify port mapping
3. Ensure Studio container is running
4. Check reverse proxy settings

### **Problem: Authentication errors**

**Solutions:**
1. Verify `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_KEY`
2. Check JWT secret matches across services
3. Regenerate keys if needed

---

## 🚀 Alternative: Use PgWeb Instead

If Studio continues to have issues, **PgWeb** is a simpler alternative:

### **Install PgWeb**

1. In EasyPanel, click **"+ Create"**
2. Select **"App"** → **"From Template"**
3. Search for **"PgWeb"**
4. Deploy with your database credentials

### **PgWeb Advantages**

- ✅ Simpler setup (single container)
- ✅ More stable on EasyPanel
- ✅ Direct database connection
- ✅ SQL query interface
- ✅ Table browsing and editing

### **PgWeb Configuration**

```env
DATABASE_URL=postgres://postgres:password@db:5432/postgres?sslmode=disable
```

---

## 📋 Complete Studio Environment Variables

For reference, here's a complete list:

```env
# Core Configuration
SUPABASE_URL=http://kong:8000
SUPABASE_PUBLIC_URL=https://your-domain.com
STUDIO_PG_META_URL=http://rest:3000

# Authentication Keys
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database
POSTGRES_PASSWORD=your-db-password

# Organization/Project
DEFAULT_ORGANIZATION=Legacy83
DEFAULT_PROJECT=Legacy83 Platform

# Optional: Additional URLs
SUPABASE_REST_URL=http://rest:3000
SUPABASE_AUTH_URL=http://auth:9999
SUPABASE_STORAGE_URL=http://storage:5000
SUPABASE_REALTIME_URL=http://realtime:4000
```

---

## ✅ Verification Checklist

After installation, verify:

- [ ] Studio container is running (green status)
- [ ] Domain/port is accessible
- [ ] Can access Studio UI in browser
- [ ] Can see database tables
- [ ] Can run SQL queries
- [ ] All environment variables are set
- [ ] Kong gateway is running
- [ ] PostgREST service is running

---

## 🎯 Recommended Approach

**For EasyPanel Supabase:**

1. **Use the official Supabase template** (easiest)
2. **If template fails**, use PgWeb for database management
3. **If you need Studio specifically**, do manual installation
4. **For production**, consider managed Supabase Cloud instead

**Reality check:** Supabase Studio on EasyPanel can be finicky. Many users find **PgWeb** or **DbGate** more reliable for database management on self-hosted setups.

---

## 📚 Resources

- **Supabase Studio GitHub**: https://github.com/supabase/studio
- **EasyPanel Docs**: https://easypanel.io/docs
- **Supabase Self-Hosting**: https://supabase.com/docs/guides/self-hosting
- **PgWeb**: https://github.com/sosedoff/pgweb

---

## 💡 Pro Tip

**You don't actually need Studio!** Everything can be done via:

- **PgWeb** - Database management UI
- **psql** - Command-line interface
- **Your application** - Using Supabase client
- **SQL migrations** - Version-controlled schema changes

Studio is convenient but not essential for development or production.
