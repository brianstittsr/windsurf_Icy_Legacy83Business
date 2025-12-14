import { NextRequest, NextResponse } from "next/server";

const THOMASNET_BASE_URL = "https://www.thomasnet.com";

// Helper to parse search query into ThomasNet search terms
function parseSearchQuery(query: string): { keywords: string; location?: string; category?: string } {
  const lowerQuery = query.toLowerCase();
  
  // Extract location if mentioned
  let location: string | undefined;
  const locationPatterns = [
    /in\s+([a-zA-Z\s]+(?:,\s*[A-Z]{2})?)/i,
    /from\s+([a-zA-Z\s]+(?:,\s*[A-Z]{2})?)/i,
    /near\s+([a-zA-Z\s]+(?:,\s*[A-Z]{2})?)/i,
    /located\s+in\s+([a-zA-Z\s]+(?:,\s*[A-Z]{2})?)/i,
  ];
  
  for (const pattern of locationPatterns) {
    const match = query.match(pattern);
    if (match) {
      location = match[1].trim();
      break;
    }
  }
  
  // Common manufacturing categories
  const categoryKeywords: Record<string, string[]> = {
    "machining": ["machining", "cnc", "milling", "turning", "lathe"],
    "metal-fabrication": ["metal fabrication", "sheet metal", "welding", "fabrication"],
    "plastic": ["plastic", "injection molding", "thermoforming", "extrusion"],
    "electronics": ["electronics", "pcb", "circuit board", "electronic assembly"],
    "automotive": ["automotive", "auto parts", "vehicle", "car parts"],
    "aerospace": ["aerospace", "aircraft", "aviation"],
    "medical": ["medical", "medical device", "healthcare", "surgical"],
    "packaging": ["packaging", "boxes", "containers", "cartons"],
    "rubber": ["rubber", "gaskets", "seals", "o-rings"],
    "casting": ["casting", "foundry", "die casting", "sand casting"],
    "stamping": ["stamping", "metal stamping", "press"],
    "fasteners": ["fasteners", "screws", "bolts", "nuts"],
    "springs": ["springs", "coil springs", "leaf springs"],
    "bearings": ["bearings", "ball bearings", "roller bearings"],
    "valves": ["valves", "fittings", "pipes"],
    "pumps": ["pumps", "hydraulic", "pneumatic"],
    "motors": ["motors", "electric motors", "servo"],
    "sensors": ["sensors", "transducers", "instrumentation"],
    "coatings": ["coatings", "plating", "anodizing", "painting"],
    "assembly": ["assembly", "contract manufacturing", "oem"],
  };
  
  let category: string | undefined;
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => lowerQuery.includes(kw))) {
      category = cat;
      break;
    }
  }
  
  // Clean up keywords - remove location phrases
  let keywords = query;
  for (const pattern of locationPatterns) {
    keywords = keywords.replace(pattern, "");
  }
  keywords = keywords.replace(/suppliers?|manufacturers?|companies?|find|search|looking for|need|want/gi, "").trim();
  
  return { keywords, location, category };
}

// Generate mock results based on search criteria (since ThomasNet doesn't have a public API)
function generateMockResults(searchParams: { keywords: string; location?: string; category?: string }): SupplierResult[] {
  const { keywords, location, category } = searchParams;
  
  // Base mock companies that match various categories
  const mockCompanies: SupplierResult[] = [
    {
      id: "tn-001",
      companyName: "Precision Manufacturing Inc.",
      description: "Full-service precision machining and CNC manufacturing. ISO 9001:2015 certified with 50+ years of experience serving aerospace, defense, and medical industries.",
      location: "Cleveland, OH",
      city: "Cleveland",
      state: "OH",
      phone: "(216) 555-0123",
      website: "www.precisionmfginc.com",
      categories: ["CNC Machining", "Precision Manufacturing", "Aerospace Parts"],
      certifications: ["ISO 9001:2015", "AS9100D", "ITAR Registered"],
      employeeCount: "100-249",
      thomasnetUrl: "https://www.thomasnet.com/profile/precision-manufacturing",
    },
    {
      id: "tn-002",
      companyName: "Advanced Metal Fabricators",
      description: "Custom metal fabrication, sheet metal work, and welding services. Specializing in stainless steel and aluminum fabrication for industrial applications.",
      location: "Detroit, MI",
      city: "Detroit",
      state: "MI",
      phone: "(313) 555-0456",
      website: "www.advancedmetalfab.com",
      categories: ["Metal Fabrication", "Sheet Metal", "Welding Services"],
      certifications: ["ISO 9001:2015", "AWS Certified"],
      employeeCount: "50-99",
      thomasnetUrl: "https://www.thomasnet.com/profile/advanced-metal-fab",
    },
    {
      id: "tn-003",
      companyName: "TechPlast Solutions",
      description: "Injection molding and plastic manufacturing specialists. High-volume production capabilities with in-house tooling and design services.",
      location: "Chicago, IL",
      city: "Chicago",
      state: "IL",
      phone: "(312) 555-0789",
      website: "www.techplastsolutions.com",
      categories: ["Injection Molding", "Plastic Manufacturing", "Tooling"],
      certifications: ["ISO 9001:2015", "ISO 14001"],
      employeeCount: "250-499",
      thomasnetUrl: "https://www.thomasnet.com/profile/techplast-solutions",
    },
    {
      id: "tn-004",
      companyName: "ElectroAssembly Corp",
      description: "Electronic contract manufacturing and PCB assembly. Surface mount and through-hole capabilities with full testing and quality inspection.",
      location: "San Jose, CA",
      city: "San Jose",
      state: "CA",
      phone: "(408) 555-0234",
      website: "www.electroassembly.com",
      categories: ["PCB Assembly", "Electronic Manufacturing", "Contract Assembly"],
      certifications: ["ISO 9001:2015", "IPC-A-610", "J-STD-001"],
      employeeCount: "100-249",
      thomasnetUrl: "https://www.thomasnet.com/profile/electroassembly",
    },
    {
      id: "tn-005",
      companyName: "MedDevice Manufacturing",
      description: "FDA-registered medical device contract manufacturer. Cleanroom assembly, precision machining, and complete device assembly services.",
      location: "Minneapolis, MN",
      city: "Minneapolis",
      state: "MN",
      phone: "(612) 555-0567",
      website: "www.meddevicemfg.com",
      categories: ["Medical Device Manufacturing", "Cleanroom Assembly", "FDA Registered"],
      certifications: ["ISO 13485", "FDA Registered", "ISO 9001:2015"],
      employeeCount: "100-249",
      thomasnetUrl: "https://www.thomasnet.com/profile/meddevice-mfg",
    },
    {
      id: "tn-006",
      companyName: "AutoParts Precision",
      description: "Automotive parts supplier specializing in precision-machined components. Tier 2 supplier to major OEMs with JIT delivery capabilities.",
      location: "Louisville, KY",
      city: "Louisville",
      state: "KY",
      phone: "(502) 555-0890",
      website: "www.autopartsprecision.com",
      categories: ["Automotive Parts", "Precision Machining", "OEM Supplier"],
      certifications: ["IATF 16949", "ISO 9001:2015"],
      employeeCount: "250-499",
      thomasnetUrl: "https://www.thomasnet.com/profile/autoparts-precision",
    },
    {
      id: "tn-007",
      companyName: "AeroComponents LLC",
      description: "Aerospace component manufacturing with AS9100 certification. Complex machining, assembly, and special processes for commercial and defense aerospace.",
      location: "Phoenix, AZ",
      city: "Phoenix",
      state: "AZ",
      phone: "(602) 555-0345",
      website: "www.aerocomponents.com",
      categories: ["Aerospace Manufacturing", "Defense Contractor", "Complex Machining"],
      certifications: ["AS9100D", "NADCAP", "ITAR Registered"],
      employeeCount: "100-249",
      thomasnetUrl: "https://www.thomasnet.com/profile/aerocomponents",
    },
    {
      id: "tn-008",
      companyName: "PackRight Industries",
      description: "Custom packaging solutions including corrugated boxes, foam inserts, and protective packaging. Design services and rapid prototyping available.",
      location: "Atlanta, GA",
      city: "Atlanta",
      state: "GA",
      phone: "(404) 555-0678",
      website: "www.packrightind.com",
      categories: ["Custom Packaging", "Corrugated Boxes", "Protective Packaging"],
      certifications: ["ISO 9001:2015", "FSC Certified"],
      employeeCount: "50-99",
      thomasnetUrl: "https://www.thomasnet.com/profile/packright-industries",
    },
    {
      id: "tn-009",
      companyName: "RubberTech Sealing",
      description: "Custom rubber molding and sealing solutions. Specializing in O-rings, gaskets, and custom molded rubber parts for industrial applications.",
      location: "Akron, OH",
      city: "Akron",
      state: "OH",
      phone: "(330) 555-0901",
      website: "www.rubbertechsealing.com",
      categories: ["Rubber Molding", "O-Rings", "Gaskets", "Seals"],
      certifications: ["ISO 9001:2015", "TS 16949"],
      employeeCount: "50-99",
      thomasnetUrl: "https://www.thomasnet.com/profile/rubbertech-sealing",
    },
    {
      id: "tn-010",
      companyName: "CastMaster Foundry",
      description: "Full-service foundry offering sand casting, investment casting, and die casting. Ferrous and non-ferrous metals with complete finishing services.",
      location: "Milwaukee, WI",
      city: "Milwaukee",
      state: "WI",
      phone: "(414) 555-0234",
      website: "www.castmasterfoundry.com",
      categories: ["Sand Casting", "Investment Casting", "Die Casting", "Foundry"],
      certifications: ["ISO 9001:2015"],
      employeeCount: "100-249",
      thomasnetUrl: "https://www.thomasnet.com/profile/castmaster-foundry",
    },
    {
      id: "tn-011",
      companyName: "Rocky Mountain Electronics",
      description: "Electronic manufacturing services including PCB assembly, cable assemblies, and box builds. Serving aerospace, defense, and telecommunications industries in Colorado.",
      location: "Denver, CO",
      city: "Denver",
      state: "CO",
      phone: "(303) 555-1234",
      website: "www.rockymtnelectronics.com",
      categories: ["Electronic Manufacturing", "PCB Assembly", "Cable Assembly", "Box Build"],
      certifications: ["ISO 9001:2015", "IPC-A-610", "AS9100D"],
      employeeCount: "50-99",
      thomasnetUrl: "https://www.thomasnet.com/profile/rocky-mountain-electronics",
    },
    {
      id: "tn-012",
      companyName: "Colorado Precision CNC",
      description: "High-precision CNC machining and turning services. Specializing in aerospace and medical components with tight tolerances.",
      location: "Colorado Springs, CO",
      city: "Colorado Springs",
      state: "CO",
      phone: "(719) 555-2345",
      website: "www.coloradoprecisioncnc.com",
      categories: ["CNC Machining", "Precision Turning", "Aerospace Parts", "Medical Components"],
      certifications: ["ISO 9001:2015", "AS9100D", "ISO 13485"],
      employeeCount: "25-49",
      thomasnetUrl: "https://www.thomasnet.com/profile/colorado-precision-cnc",
    },
    {
      id: "tn-013",
      companyName: "Front Range Metal Works",
      description: "Custom metal fabrication and welding services. Sheet metal, structural steel, and aluminum fabrication for commercial and industrial applications.",
      location: "Boulder, CO",
      city: "Boulder",
      state: "CO",
      phone: "(303) 555-3456",
      website: "www.frontrangemetalworks.com",
      categories: ["Metal Fabrication", "Sheet Metal", "Welding", "Structural Steel"],
      certifications: ["ISO 9001:2015", "AWS Certified"],
      employeeCount: "25-49",
      thomasnetUrl: "https://www.thomasnet.com/profile/front-range-metal-works",
    },
    {
      id: "tn-014",
      companyName: "Mile High Circuit Systems",
      description: "Full-service electronics contract manufacturer. SMT and through-hole assembly, prototyping, and production. Quick-turn capabilities available.",
      location: "Aurora, CO",
      city: "Aurora",
      state: "CO",
      phone: "(720) 555-4567",
      website: "www.milehighcircuits.com",
      categories: ["Electronic Manufacturing", "PCB Assembly", "SMT Assembly", "Prototyping"],
      certifications: ["ISO 9001:2015", "IPC-A-610 Class 3", "ITAR Registered"],
      employeeCount: "50-99",
      thomasnetUrl: "https://www.thomasnet.com/profile/mile-high-circuits",
    },
    {
      id: "tn-015",
      companyName: "Texas Electronic Assembly",
      description: "Electronic contract manufacturing with full turnkey capabilities. PCB assembly, testing, and fulfillment services.",
      location: "Austin, TX",
      city: "Austin",
      state: "TX",
      phone: "(512) 555-5678",
      website: "www.texaselectronicassembly.com",
      categories: ["Electronic Manufacturing", "PCB Assembly", "Contract Manufacturing"],
      certifications: ["ISO 9001:2015", "IPC-A-610"],
      employeeCount: "100-249",
      thomasnetUrl: "https://www.thomasnet.com/profile/texas-electronic-assembly",
    },
  ];
  
  // Filter based on keywords and location
  let results = mockCompanies;
  
  if (keywords && keywords.trim()) {
    const searchTerms = keywords.toLowerCase().split(/\s+/);
    results = results.filter(company => {
      const searchableText = [
        company.companyName,
        company.description,
        ...(company.categories || []),
      ].join(" ").toLowerCase();
      
      return searchTerms.some(term => searchableText.includes(term));
    });
  }
  
  if (location) {
    const locationLower = location.toLowerCase();
    // Handle state abbreviations and full names
    const stateMap: Record<string, string> = {
      "colorado": "co", "co": "co",
      "california": "ca", "ca": "ca",
      "texas": "tx", "tx": "tx",
      "ohio": "oh", "oh": "oh",
      "michigan": "mi", "mi": "mi",
      "illinois": "il", "il": "il",
      "minnesota": "mn", "mn": "mn",
      "kentucky": "ky", "ky": "ky",
      "arizona": "az", "az": "az",
      "georgia": "ga", "ga": "ga",
      "wisconsin": "wi", "wi": "wi",
    };
    
    const normalizedLocation = stateMap[locationLower] || locationLower;
    
    results = results.filter(company => {
      const companyState = company.state?.toLowerCase() || "";
      const companyCity = company.city?.toLowerCase() || "";
      const companyLocation = company.location?.toLowerCase() || "";
      
      return companyState === normalizedLocation ||
        companyState.includes(locationLower) ||
        companyCity.includes(locationLower) ||
        companyLocation.includes(locationLower);
    });
  }
  
  // Return empty array if no matches - don't show unrelated results
  return results;
}

interface SupplierResult {
  id: string;
  companyName: string;
  description?: string;
  location?: string;
  city?: string;
  state?: string;
  phone?: string;
  website?: string;
  categories?: string[];
  certifications?: string[];
  employeeCount?: string;
  thomasnetUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, searchParams } = body;

    switch (action) {
      case "search_suppliers": {
        const query = searchParams?.query || "";
        const location = searchParams?.location || "";
        const category = searchParams?.category || "";
        
        // Parse the natural language query
        const parsed = parseSearchQuery(query);
        
        // Merge with explicit params
        const searchCriteria = {
          keywords: parsed.keywords || query,
          location: location || parsed.location,
          category: category || parsed.category,
        };
        
        // Generate results (mock data since ThomasNet doesn't have public API)
        const results = generateMockResults(searchCriteria);
        
        return NextResponse.json({
          success: true,
          results,
          searchCriteria,
          total: results.length,
          message: `Found ${results.length} suppliers matching your criteria`,
        });
      }

      case "search_by_category": {
        const category = searchParams?.category || "";
        const location = searchParams?.location || "";
        
        const results = generateMockResults({
          keywords: category,
          location: location || undefined,
          category,
        });
        
        return NextResponse.json({
          success: true,
          results,
          total: results.length,
        });
      }

      case "get_supplier_details": {
        const supplierId = searchParams?.supplierId;
        
        if (!supplierId) {
          return NextResponse.json(
            { error: "Supplier ID is required", success: false },
            { status: 400 }
          );
        }
        
        // Return mock detailed data
        const allSuppliers = generateMockResults({ keywords: "" });
        const supplier = allSuppliers.find(s => s.id === supplierId);
        
        if (supplier) {
          return NextResponse.json({
            success: true,
            supplier: {
              ...supplier,
              // Add additional details that would come from the detail page
              yearFounded: "1985",
              annualRevenue: "$10M - $50M",
              ownership: "Privately Held",
              primaryContact: "John Smith, Sales Manager",
              email: "sales@" + (supplier.website?.replace("www.", "") || "company.com"),
            },
          });
        }
        
        return NextResponse.json(
          { error: "Supplier not found", success: false },
          { status: 404 }
        );
      }

      case "ai_search": {
        // AI-powered natural language search
        const query = searchParams?.query || "";
        
        if (!query.trim()) {
          return NextResponse.json({
            success: true,
            results: [],
            message: "Please provide a search query",
            suggestions: [
              "Find CNC machining suppliers in Ohio",
              "Metal fabrication companies near Detroit",
              "ISO certified plastic injection molding",
              "Aerospace parts manufacturers with AS9100",
              "Medical device contract manufacturers",
            ],
          });
        }
        
        // Parse and search
        const parsed = parseSearchQuery(query);
        const results = generateMockResults(parsed);
        
        // Generate AI response
        const aiResponse = {
          interpretation: `I understood you're looking for ${parsed.keywords || "suppliers"}${parsed.location ? ` in ${parsed.location}` : ""}${parsed.category ? ` in the ${parsed.category} category` : ""}.`,
          results,
          total: results.length,
          refinementSuggestions: [
            results.length > 5 ? "Add a location to narrow results" : null,
            results.length === 0 ? "Try broader search terms" : null,
            "Filter by certification (ISO, AS9100, etc.)",
            "Specify employee count or company size",
          ].filter(Boolean),
        };
        
        return NextResponse.json({
          success: true,
          ...aiResponse,
        });
      }

      default:
        return NextResponse.json(
          { error: "Unknown action", success: false },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("ThomasNet API error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "ThomasNet Supplier Search API",
    endpoints: {
      search_suppliers: "Search for suppliers by keywords and location",
      search_by_category: "Search suppliers by category",
      get_supplier_details: "Get detailed supplier information",
      ai_search: "AI-powered natural language supplier search",
    },
  });
}
