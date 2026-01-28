import { NextResponse } from "next/server";
import type { ParkingLocation, CurrencyCode, Coordinates, ParkingAmenity } from "@/types/parking";

type NominatimPlace = {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    state_district?: string;
    country?: string;
    country_code?: string;
    postcode?: string;
  };
};

function currencyFromCountryCode(cc?: string): CurrencyCode {
  const code = (cc || "").toUpperCase();
  switch (code) {
    case "US":
      return "usd";
    case "GB":
      return "gbp";
    case "IN":
      return "inr";
    default:
      return "eur";
  }
}

function getRandomCoordinates(base: Coordinates, radiusKm: number): Coordinates {
  // 1 degree latitude ~= 111 km
  // 1 degree longitude ~= 111 km * cos(latitude)
  const r = Math.sqrt(Math.random()) * radiusKm; // Square root for uniform distribution
  const theta = Math.random() * 2 * Math.PI;

  const dy = (r * Math.cos(theta)) / 111;
  const dx = (r * Math.sin(theta)) / (111 * Math.cos(base.lat * (Math.PI / 180)));

  return {
    lat: base.lat + dy,
    lng: base.lng + dx,
  };
}

function generateParkingAround(
  base: Coordinates,
  city: string,
  country: string,
  currency: CurrencyCode,
  radiusKm: number
): ParkingLocation[] {
  const templates = [
    { name: "Mall & Retail Parking", suffixes: ["Mall", "Plaza", "Shopping Center", "Retail Park"], rateMult: 0.8 },
    { name: "Business District", suffixes: ["Towers", "Business Park", "Corporate Center", "Office Complex"], rateMult: 1.2 },
    { name: "Transit Hubs", suffixes: ["Metro Station", "Terminal", "Transit Center", "Railway Station"], rateMult: 0.6 },
    { name: "City Parking", suffixes: ["Street Garage", "Municipal Lot", "City Center", "Public Square"], rateMult: 1.0 },
    { name: "Premium & Valet", suffixes: ["Grand Hotel", "Luxury Suites", "Valet Service", "Executive Garage"], rateMult: 2.5 },
    { name: "Event Parking", suffixes: ["Stadium", "Arena", "Convention Center", "Expo Hall"], rateMult: 1.5 },
  ];
  
  // Ultra-high density: 15-25 spots per km radius
  const density = 15 + Math.random() * 10;
  const count = Math.max(20, Math.floor(radiusKm * density));

  return Array.from({ length: count }).map((_, i) => {
    const coords = getRandomCoordinates(base, radiusKm);
    
    // Pick a random type
    const template = templates[Math.floor(Math.random() * templates.length)];
    const suffix = template.suffixes[Math.floor(Math.random() * template.suffixes.length)];
    
    // More natural names
    const directions = ["North", "South", "East", "West", "Central", "Upper", "Lower"];
    const direction = Math.random() > 0.7 ? `${directions[Math.floor(Math.random() * directions.length)]} ` : "";
    const name = `${direction}${city} ${suffix}`;
    
    const total = 50 + Math.floor(Math.random() * 800);
    // Varies availability widely
    const utilization = 0.2 + Math.random() * 0.75; // 20% to 95% full
    const available = Math.floor(total * (1 - utilization));
    
    const baseRate = currency === "inr" ? 40 : currency === "gbp" ? 4 : currency === "eur" ? 3 : 5;
    const hourlyRate = Math.round((baseRate + Math.random() * baseRate) * template.rateMult * 10) / 10;

    const allAmenities = ["covered", "ev_charging", "security", "valet", "disabled_access"];
    const amenities = allAmenities.filter(() => Math.random() > 0.5) as ParkingAmenity[];

    return {
      id: `loc-${city.toLowerCase().replace(/\W/g, "")}-${i}-${Date.now()}`,
      name,
      city,
      country,
      address: `${Math.floor(Math.random() * 999) + 1} ${["Main St", "Park Ave", "Broadway", "High St", "Market Rd", "Station Rd"][Math.floor(Math.random() * 6)]}`,
      coordinates: coords,
      totalSlots: total,
      availableSlots: available,
      hourlyRate,
      currency,
      amenities,
    };
  });
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  const radius = Math.min(10, Math.max(2, Number(searchParams.get("radius") || "5")));
  const rawLat = searchParams.get("lat");
  const rawLng = searchParams.get("lng");

  console.log(`[API] Searching: q="${q}", lat=${rawLat}, lng=${rawLng}, radius=${radius}km`);

  try {
    let lat: number;
    let lng: number;
    let city: string;
    let country: string;
    let currency: CurrencyCode;

    if (rawLat && rawLng) {
      // Use provided coordinates directly
      lat = Number(rawLat);
      lng = Number(rawLng);
      city = "Nearby Location"; // Fallback name
      country = "Unknown";
      currency = "usd"; // Default

      // Optionally try to reverse geocode to get city name/currency, but not strictly required for spots
      try {
         const reverseUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2`;
         const reverseRes = await fetch(reverseUrl, {
            headers: {
              "User-Agent": "ParkHub/1.0 (strict-contact: help@parkhub.com)",
              "Referer": "https://parkhub.com"
            }
         });
         if (reverseRes.ok) {
           const place = await reverseRes.json();
           city = place.address?.city || place.address?.town || place.address?.village || "Current Location";
           country = place.address?.country || "Unknown";
           currency = currencyFromCountryCode(place.address?.country_code);
         }
      } catch {
        // Ignore reverse geocoding errors
      }

    } else if (q) {
      // Geocode the query
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("q", q);
      url.searchParams.set("addressdetails", "1");
      url.searchParams.set("limit", "1");

      const res = await fetch(url.toString(), {
        headers: {
          "User-Agent": "ParkHub/1.0 (strict-contact: help@parkhub.com)",
          "Referer": "https://parkhub.com"
        },
        cache: "no-store",
      });

      if (!res.ok) {
        return NextResponse.json({ locations: [] }, { status: 200 });
      }

      const places = (await res.json()) as NominatimPlace[];
      const top = places[0];
      if (!top) {
        return NextResponse.json({ locations: [] }, { status: 200 });
      }

      lat = Number.parseFloat(top.lat);
      lng = Number.parseFloat(top.lon);
      city = top.address?.city || top.address?.town || top.address?.village || top.address?.state_district || top.display_name.split(",")[0];
      country = top.address?.country || top.display_name.split(",").pop() || "Unknown";
      currency = currencyFromCountryCode(top.address?.country_code);
    } else {
      // No query and no coords
      return NextResponse.json({ locations: [] }, { status: 200 });
    }

    const base = { lat, lng };
    const generated = generateParkingAround(base, city, country, currency, radius);
    
    return NextResponse.json({ locations: generated }, { status: 200 });
  } catch (error) {
    console.error(`[API] Unexpected error:`, error);
    return NextResponse.json({ locations: [] }, { status: 200 });
  }
}
