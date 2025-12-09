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

    // Apollo uses api_key in the request body, not headers
    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    };

    switch (action) {
      case "test_connection": {
        // Test connection by making a simple search request
        // Apollo doesn't have a dedicated health endpoint, so we use a minimal search
        try {
          const response = await fetch(`${APOLLO_API_BASE}/mixed_people/search`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              api_key: apiKey,
              page: 1,
              per_page: 1,
            }),
          });

          const data = await response.json();
          
          if (response.ok || data.people !== undefined) {
            return NextResponse.json({ connected: true, message: "Connected to Apollo" });
          } else {
            return NextResponse.json(
              { connected: false, error: data.error || data.message || "Failed to connect to Apollo" },
              { status: response.status }
            );
          }
        } catch (err) {
          return NextResponse.json(
            { connected: false, error: "Network error connecting to Apollo" },
            { status: 500 }
          );
        }
      }

      case "search_people": {
        // Search for people/contacts - Apollo requires api_key in body
        const searchBody: Record<string, unknown> = {
          api_key: apiKey,
          page: searchParams?.page || 1,
          per_page: searchParams?.per_page || 25,
        };

        // Only add non-empty arrays/strings
        if (searchParams?.titles?.length > 0) {
          searchBody.person_titles = searchParams.titles;
        }
        if (searchParams?.locations?.length > 0) {
          searchBody.person_locations = searchParams.locations;
        }
        if (searchParams?.industries?.length > 0) {
          searchBody.q_organization_keyword_tags = searchParams.industries;
        }
        if (searchParams?.keywords && searchParams.keywords.trim()) {
          searchBody.q_keywords = searchParams.keywords;
        }
        if (searchParams?.employee_ranges?.length > 0) {
          searchBody.organization_num_employees_ranges = searchParams.employee_ranges;
        }

        const response = await fetch(`${APOLLO_API_BASE}/mixed_people/search`, {
          method: "POST",
          headers,
          body: JSON.stringify(searchBody),
        });

        const data = await response.json();

        if (response.ok && data.people) {
          return NextResponse.json({
            connected: true,
            results: data.people || [],
            pagination: data.pagination || {},
            total: data.pagination?.total_entries || 0,
          });
        } else {
          return NextResponse.json(
            { connected: false, error: data.error || data.message || "Search failed", results: [] },
            { status: response.status }
          );
        }
      }

      case "search_companies": {
        // Search for companies/organizations - Apollo requires api_key in body
        const companySearchBody: Record<string, unknown> = {
          api_key: apiKey,
          page: searchParams?.page || 1,
          per_page: searchParams?.per_page || 25,
        };

        if (searchParams?.locations?.length > 0) {
          companySearchBody.organization_locations = searchParams.locations;
        }
        if (searchParams?.employee_ranges?.length > 0) {
          companySearchBody.organization_num_employees_ranges = searchParams.employee_ranges;
        }
        if (searchParams?.industries?.length > 0) {
          companySearchBody.q_organization_keyword_tags = searchParams.industries;
        }
        if (searchParams?.keywords && searchParams.keywords.trim()) {
          companySearchBody.q_keywords = searchParams.keywords;
        }

        const response = await fetch(`${APOLLO_API_BASE}/mixed_companies/search`, {
          method: "POST",
          headers,
          body: JSON.stringify(companySearchBody),
        });

        const data = await response.json();

        if (response.ok && data.organizations) {
          return NextResponse.json({
            connected: true,
            results: data.organizations || [],
            pagination: data.pagination || {},
            total: data.pagination?.total_entries || 0,
          });
        } else {
          return NextResponse.json(
            { connected: false, error: data.error || data.message || "Search failed", results: [] },
            { status: response.status }
          );
        }
      }

      case "enrich_person": {
        // Enrich a person's data - Apollo requires api_key in body
        const enrichBody: Record<string, unknown> = {
          api_key: apiKey,
        };

        if (searchParams?.email) enrichBody.email = searchParams.email;
        if (searchParams?.first_name) enrichBody.first_name = searchParams.first_name;
        if (searchParams?.last_name) enrichBody.last_name = searchParams.last_name;
        if (searchParams?.company) enrichBody.organization_name = searchParams.company;
        if (searchParams?.linkedin_url) enrichBody.linkedin_url = searchParams.linkedin_url;

        const response = await fetch(`${APOLLO_API_BASE}/people/match`, {
          method: "POST",
          headers,
          body: JSON.stringify(enrichBody),
        });

        const data = await response.json();

        if (response.ok && data.person) {
          return NextResponse.json({
            connected: true,
            person: data.person || null,
          });
        } else {
          return NextResponse.json(
            { connected: false, error: data.error || data.message || "Enrichment failed" },
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
