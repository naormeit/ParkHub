import type { ParkingLocation } from "@/types/parking";

export const parkingLocations: ParkingLocation[] = [
  {
    id: "ldn-city-center",
    name: "City Center Smart Parking",
    city: "London",
    country: "United Kingdom",
    address: "1 Bishopsgate, London EC2N 3AQ",
    coordinates: { lat: 51.5155, lng: -0.0827 },
    totalSlots: 320,
    availableSlots: 48,
    hourlyRate: 8.5,
    currency: "gbp",
    amenities: ["covered", "ev_charging", "security", "disabled_access"],
  },
  {
    id: "nyc-midtown",
    name: "Midtown Skyline Parking",
    city: "New York",
    country: "United States",
    address: "250 W 50th St, New York, NY 10019",
    coordinates: { lat: 40.7626, lng: -73.9863 },
    totalSlots: 220,
    availableSlots: 63,
    hourlyRate: 18,
    currency: "usd",
    amenities: ["covered", "security", "valet", "disabled_access"],
  },
  {
    id: "blr-tech-park",
    name: "Tech Park Premium Parking",
    city: "Bengaluru",
    country: "India",
    address: "Outer Ring Road, Marathahalli, Bengaluru, Karnataka",
    coordinates: { lat: 12.9569, lng: 77.7011 },
    totalSlots: 540,
    availableSlots: 132,
    hourlyRate: 150,
    currency: "inr",
    amenities: ["covered", "ev_charging", "security"],
  },
  {
    id: "dubai-marina",
    name: "Marina Waterfront Parking",
    city: "Dubai",
    country: "United Arab Emirates",
    address: "Dubai Marina Walk, Dubai",
    coordinates: { lat: 25.0803, lng: 55.1394 },
    totalSlots: 410,
    availableSlots: 205,
    hourlyRate: 35,
    currency: "usd",
    amenities: ["covered", "security", "valet"],
  },
  {
    id: "berlin-hbf",
    name: "Central Station Mobility Hub",
    city: "Berlin",
    country: "Germany",
    address: "Europaplatz 1, 10557 Berlin",
    coordinates: { lat: 52.5251, lng: 13.3694 },
    totalSlots: 260,
    availableSlots: 91,
    hourlyRate: 6.5,
    currency: "eur",
    amenities: ["covered", "ev_charging", "security", "disabled_access"],
  },
];

const aliases: Record<string, string[]> = {
  bengaluru: ["bangalore", "bengalore", "blr"],
  mumbai: ["bombay"],
  "new york": ["nyc", "new york city"],
  dubai: ["دبي"],
};

function normalize(text: string) {
  return text.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "");
}

export function searchParking(query: string): ParkingLocation[] {
  const q = normalize(query.trim());
  if (!q) return parkingLocations;
  const expanded = new Set<string>([q]);
  for (const [canonical, list] of Object.entries(aliases)) {
    if (canonical === q || list.includes(q)) {
      expanded.add(canonical);
      for (const a of list) expanded.add(a);
      break;
    }
  }
  return parkingLocations.filter((location) => {
    const city = normalize(location.city);
    const country = normalize(location.country);
    const name = normalize(location.name);
    for (const term of expanded) {
      if (
        city.includes(term) ||
        country.includes(term) ||
        name.includes(term)
      ) {
        return true;
      }
    }
    return false;
  });
}
