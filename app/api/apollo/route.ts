import { NextRequest, NextResponse } from "next/server";

const APOLLO_API_BASE = "https://api.apollo.io/v1";

// Apollo API endpoints
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, apiKey, searchParams } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Apollo API key is required", connected: false },
        { status: 400 }
      );
    }

    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "X-Api-Key": apiKey,
    };

    switch (action) {
      case "test_connection": {
        // Test connection by fetching account info
        const response = await fetch(`${APOLLO_API_BASE}/auth/health`, {
          method: "GET",
          headers,
        });

        if (response.ok) {
          return NextResponse.json({ connected: true, message: "Connected to Apollo" });
        } else {
          const errorData = await response.json().catch(() => ({}));
          return NextResponse.json(
            { connected: false, error: errorData.message || "Failed to connect to Apollo" },
            { status: response.status }
          );
        }
      }

      case "search_people": {
        // Search for people/contacts
        const response = await fetch(`${APOLLO_API_BASE}/mixed_people/search`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            page: searchParams?.page || 1,
            per_page: searchParams?.per_page || 25,
            person_titles: searchParams?.titles || [],
            person_locations: searchParams?.locations || [],
            organization_locations: searchParams?.company_locations || [],
            organization_num_employees_ranges: searchParams?.employee_ranges || [],
            q_organization_keyword_tags: searchParams?.industries || [],
            q_keywords: searchParams?.keywords || "",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            connected: true,
            results: data.people || [],
            pagination: data.pagination || {},
            total: data.pagination?.total_entries || 0,
          });
        } else {
          const errorData = await response.json().catch(() => ({}));
          return NextResponse.json(
            { connected: false, error: errorData.message || "Search failed", results: [] },
            { status: response.status }
          );
        }
      }

      case "search_companies": {
        // Search for companies/organizations
        const response = await fetch(`${APOLLO_API_BASE}/mixed_companies/search`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            page: searchParams?.page || 1,
            per_page: searchParams?.per_page || 25,
            organization_locations: searchParams?.locations || [],
            organization_num_employees_ranges: searchParams?.employee_ranges || [],
            q_organization_keyword_tags: searchParams?.industries || [],
            q_keywords: searchParams?.keywords || "",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            connected: true,
            results: data.organizations || [],
            pagination: data.pagination || {},
            total: data.pagination?.total_entries || 0,
          });
        } else {
          const errorData = await response.json().catch(() => ({}));
          return NextResponse.json(
            { connected: false, error: errorData.message || "Search failed", results: [] },
            { status: response.status }
          );
        }
      }

      case "enrich_person": {
        // Enrich a person's data
        const response = await fetch(`${APOLLO_API_BASE}/people/match`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            email: searchParams?.email,
            first_name: searchParams?.first_name,
            last_name: searchParams?.last_name,
            organization_name: searchParams?.company,
            linkedin_url: searchParams?.linkedin_url,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            connected: true,
            person: data.person || null,
          });
        } else {
          const errorData = await response.json().catch(() => ({}));
          return NextResponse.json(
            { connected: false, error: errorData.message || "Enrichment failed" },
            { status: response.status }
          );
        }
      }

      default:
        return NextResponse.json(
          { error: "Unknown action", connected: false },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Apollo API error:", error);
    return NextResponse.json(
      { error: "Internal server error", connected: false },
      { status: 500 }
    );
  }
}

// GET endpoint to check connection status
export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("x-apollo-api-key");

  if (!apiKey) {
    return NextResponse.json({ connected: false, error: "No API key provided" });
  }

  try {
    const response = await fetch(`${APOLLO_API_BASE}/auth/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
    });

    if (response.ok) {
      return NextResponse.json({ connected: true });
    } else {
      return NextResponse.json({ connected: false, error: "Invalid API key or connection failed" });
    }
  } catch (error) {
    return NextResponse.json({ connected: false, error: "Failed to connect to Apollo" });
  }
}
