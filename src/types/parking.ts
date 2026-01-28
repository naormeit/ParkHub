export type ParkingAmenity =
  | "covered"
  | "ev_charging"
  | "security"
  | "valet"
  | "disabled_access";

export type CurrencyCode = "usd" | "eur" | "gbp" | "inr";

export type Coordinates = {
  lat: number;
  lng: number;
};

export type ParkingLocation = {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  coordinates: Coordinates;
  totalSlots: number;
  availableSlots: number;
  hourlyRate: number;
  currency: CurrencyCode;
  amenities: ParkingAmenity[];
  distanceKm?: number;
};

export type BookingPayload = {
  parkingId: string;
  parkingName: string;
  city: string;
  country: string;
  address: string;
  arrivalTime: string;
  durationHours: number;
  baseAmount: number;
  lateFeeAmount: number;
  totalAmount: number;
  currency: CurrencyCode;
};

