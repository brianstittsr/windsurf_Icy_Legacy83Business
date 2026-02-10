import OpenAI from "openai";

// Cache settings to avoid repeated Firebase reads
let cachedSettings: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60000; // 1 minute cache

/**
 * Get all platform settings from Firebase (cached)
 * Uses dynamic import to avoid issues with Firebase in API routes
 * Falls back to Firebase Admin SDK for server-side access
 */
async function getSettings(): Promise<any | null> {
  // Check cache first
  if (cachedSettings && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log("[openai-config] Using cached settings");
    return cachedSettings;
  }

  // Try Firebase Client SDK first
  try {
    console.log("[openai-config] Attempting to fetch from Firebase Client SDK...");
    const { db } = await import("@/lib/firebase");
    const { doc, getDoc } = await import("firebase/firestore");
    const { COLLECTIONS } = await import("@/lib/schema");
    
    console.log("[openai-config] Firebase client db exists:", !!db);
    
    if (db) {
      const docRef = doc(db, COLLECTIONS.PLATFORM_SETTINGS, "global");
      console.log("[openai-config] Fetching document from client SDK...");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        cachedSettings = docSnap.data();
        cacheTimestamp = Date.now();
        console.log("[openai-config] Settings fetched successfully via client SDK, has llmConfig:", !!cachedSettings?.llmConfig);
        return cachedSettings;
      } else {
        console.log("[openai-config] Settings document does not exist in client SDK");
      }
    } else {
      console.log("[openai-config] Firebase client db is null, trying Admin SDK...");
    }
  } catch (error) {
    console.error("[openai-config] Error fetching from Firebase Client SDK:", error);
    console.log("[openai-config] Falling back to Admin SDK...");
  }

  // Fallback: Try Firebase Admin SDK
  try {
    console.log("[openai-config] Attempting to fetch from Firebase Admin SDK...");
    const { adminDb } = await import("@/lib/firebase-admin");
    const { COLLECTIONS } = await import("@/lib/schema");
    
    console.log("[openai-config] Firebase adminDb exists:", !!adminDb);
    
    if (adminDb) {
      const docRef = adminDb.collection(COLLECTIONS.PLATFORM_SETTINGS).doc("global");
      console.log("[openai-config] Fetching document from Admin SDK...");
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        cachedSettings = docSnap.data();
        cacheTimestamp = Date.now();
        console.log("[openai-config] Settings fetched successfully via Admin SDK, has llmConfig:", !!cachedSettings?.llmConfig);
        return cachedSettings;
      } else {
        console.log("[openai-config] Settings document does not exist in Admin SDK");
      }
    } else {
      console.log("[openai-config] Firebase Admin SDK not available");
    }
  } catch (adminError) {
    console.error("[openai-config] Error fetching from Firebase Admin SDK:", adminError);
  }

  console.log("[openai-config] All Firebase SDKs failed, returning null");
  return null;
}

/**
 * Get OpenAI API key from environment variable (primary for API routes) or Firebase settings (fallback)
 * In API routes, env vars are more reliable. Firebase settings are for client-side configuration.
 */
export async function getOpenAIApiKey(): Promise<string | null> {
  console.log("[getOpenAIApiKey] Checking environment variable...");
  
  // Primary for API routes: Environment variable (most reliable in server context)
  const envKey = process.env.OPENAI_API_KEY;
  console.log("[getOpenAIApiKey] Env var exists:", !!envKey, "length:", envKey?.length || 0);
  
  if (envKey && envKey.trim().length > 0) {
    console.log("[getOpenAIApiKey] Using environment variable");
    return envKey;
  }

  console.log("[getOpenAIApiKey] Env var not found, checking Firebase...");
  
  // Fallback: Try Firebase settings
  try {
    const settings = await getSettings();
    console.log("[getOpenAIApiKey] Settings fetched:", !!settings);
    console.log("[getOpenAIApiKey] llmConfig exists:", !!settings?.llmConfig);
    console.log("[getOpenAIApiKey] apiKey exists:", !!settings?.llmConfig?.apiKey);
    
    const firebaseKey = settings?.llmConfig?.apiKey;
    if (firebaseKey && firebaseKey.trim().length > 0) {
      console.log("[getOpenAIApiKey] Using Firebase settings, key length:", firebaseKey.length);
      return firebaseKey;
    }
    console.log("[getOpenAIApiKey] Firebase key is empty or not set");
  } catch (error) {
    console.error("[getOpenAIApiKey] Error fetching from Firebase:", error);
  }

  console.log("[getOpenAIApiKey] No API key found anywhere");
  return null;
}

/**
 * Get Apollo API key from Firebase settings
 */
export async function getApolloApiKey(): Promise<{ apiKey: string; accountId?: string } | null> {
  const settings = await getSettings();
  
  if (settings?.integrations?.apollo?.apiKey) {
    return {
      apiKey: settings.integrations.apollo.apiKey,
      accountId: settings.integrations.apollo.accountId,
    };
  }

  // Fallback: Environment variable
  if (process.env.APOLLO_API_KEY) {
    return {
      apiKey: process.env.APOLLO_API_KEY,
      accountId: process.env.APOLLO_ACCOUNT_ID,
    };
  }

  return null;
}

/**
 * Get GoHighLevel API key from Firebase settings
 */
export async function getGoHighLevelApiKey(): Promise<{ apiKey: string; locationId?: string; agencyId?: string } | null> {
  const settings = await getSettings();
  
  if (settings?.integrations?.gohighlevel?.apiKey) {
    return {
      apiKey: settings.integrations.gohighlevel.apiKey,
      locationId: settings.integrations.gohighlevel.locationId,
      agencyId: settings.integrations.gohighlevel.agencyId,
    };
  }

  // Fallback: Environment variable
  if (process.env.GOHIGHLEVEL_API_KEY) {
    return {
      apiKey: process.env.GOHIGHLEVEL_API_KEY,
      locationId: process.env.GOHIGHLEVEL_LOCATION_ID,
      agencyId: process.env.GOHIGHLEVEL_AGENCY_ID,
    };
  }

  return null;
}

/**
 * Get Mattermost config from Firebase settings
 */
export async function getMattermostConfig(): Promise<{ apiKey: string; webhookUrl?: string; serverUrl?: string; teamId?: string } | null> {
  const settings = await getSettings();
  
  if (settings?.integrations?.mattermost?.apiKey) {
    return {
      apiKey: settings.integrations.mattermost.apiKey,
      webhookUrl: settings.integrations.mattermost.webhookUrl,
      serverUrl: settings.integrations.mattermost.serverUrl,
      teamId: settings.integrations.mattermost.teamId,
    };
  }

  // Fallback: Environment variables
  if (process.env.MATTERMOST_TOKEN) {
    return {
      apiKey: process.env.MATTERMOST_TOKEN,
      webhookUrl: process.env.MATTERMOST_WEBHOOK_URL,
      serverUrl: process.env.MATTERMOST_SERVER_URL,
      teamId: process.env.MATTERMOST_TEAM_ID,
    };
  }

  return null;
}

/**
 * Get Zoom config from Firebase settings
 */
export async function getZoomConfig(): Promise<{ apiKey: string; apiSecret?: string; accountId?: string } | null> {
  const settings = await getSettings();
  
  if (settings?.integrations?.zoom?.apiKey) {
    return {
      apiKey: settings.integrations.zoom.apiKey,
      apiSecret: settings.integrations.zoom.apiSecret,
      accountId: settings.integrations.zoom.accountId,
    };
  }

  // Fallback: Environment variables
  if (process.env.ZOOM_API_KEY) {
    return {
      apiKey: process.env.ZOOM_API_KEY,
      apiSecret: process.env.ZOOM_API_SECRET,
      accountId: process.env.ZOOM_ACCOUNT_ID,
    };
  }

  return null;
}

/**
 * Get DocuSeal config from Firebase settings
 */
export async function getDocuSealConfig(): Promise<{ apiKey: string; webhookSecret?: string } | null> {
  const settings = await getSettings();
  
  if (settings?.integrations?.docuseal?.apiKey) {
    return {
      apiKey: settings.integrations.docuseal.apiKey,
      webhookSecret: settings.integrations.docuseal.webhookSecret,
    };
  }

  // Fallback: Environment variable
  if (process.env.DOCUSEAL_API_KEY) {
    return {
      apiKey: process.env.DOCUSEAL_API_KEY,
      webhookSecret: process.env.DOCUSEAL_WEBHOOK_SECRET,
    };
  }

  return null;
}

/**
 * Get LinkedIn config from Firebase settings
 */
export async function getLinkedInConfig(): Promise<{ accessToken: string; clientId?: string; clientSecret?: string; organizationId?: string } | null> {
  const settings = await getSettings();
  
  if (settings?.integrations?.linkedin?.apiKey) {
    return {
      accessToken: settings.integrations.linkedin.apiKey,
      clientId: settings.integrations.linkedin.clientId,
      clientSecret: settings.integrations.linkedin.clientSecret,
      organizationId: settings.integrations.linkedin.organizationId,
    };
  }

  // Fallback: Environment variables
  if (process.env.LINKEDIN_ACCESS_TOKEN) {
    return {
      accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      organizationId: process.env.LINKEDIN_ORGANIZATION_ID,
    };
  }

  return null;
}

/**
 * Create an OpenAI client with the configured API key
 */
export async function createOpenAIClient(): Promise<OpenAI | null> {
  try {
    const apiKey = await getOpenAIApiKey();
    
    if (!apiKey) {
      console.log("No OpenAI API key found");
      return null;
    }

    return new OpenAI({ apiKey });
  } catch (error) {
    console.error("Error creating OpenAI client:", error);
    return null;
  }
}

/**
 * Clear the cached settings (call this when settings are updated)
 */
export function clearSettingsCache(): void {
  cachedSettings = null;
  cacheTimestamp = 0;
}
