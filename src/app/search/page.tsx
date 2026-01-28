'use client';

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { searchParking, parkingLocations as localParking } from "@/data/parkingLocations";
import type { BookingPayload, ParkingLocation } from "@/types/parking";

type BookingValidation = {
  isValid: boolean;
  message?: string;
};

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function toLocalDateTimeValue(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function validateArrivalTime(value: string): BookingValidation {
  if (!value) {
    return { isValid: false, message: "Select an arrival time." };
  }
  const selected = new Date(value);
  const now = new Date();
  const diffMs = selected.getTime() - now.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  if (diffMinutes < 30) {
    return {
      isValid: false,
      message: "Arrival must be at least 30 minutes from now.",
    };
  }
  return { isValid: true };
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function getOsmEmbedUrl({ lat, lng }: { lat: number; lng: number }) {
  const delta = 0.01;
  const minLng = lng - delta;
  const minLat = lat - delta;
  const maxLng = lng + delta;
  const maxLat = lat + delta;
  const bbox = `${minLng},${minLat},${maxLng},${maxLat}`;
  const marker = `${lat},${lng}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${encodeURIComponent(marker)}`;
}

function getGoogleMapsDirectionsUrl({ lat, lng }: { lat: number; lng: number }) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Set initial query from URL only once
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
    }
    setIsInitialLoad(false);
  }, [searchParams]);

  // Try to get user location if no query is provided
  useEffect(() => {
    if (!query && !isInitialLoad && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, [query, isInitialLoad]);

  const [selectedParkingId, setSelectedParkingId] = useState<string | null>(
    null
  );
  const [arrivalTime, setArrivalTime] = useState(
    (() => {
      const base = new Date();
      base.setMinutes(base.getMinutes() + 60);
      return toLocalDateTimeValue(base);
    })()
  );
  const [durationHours, setDurationHours] = useState(2);
  const [includeLateFee, setIncludeLateFee] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [radius, setRadius] = useState(Number(searchParams.get("radius")) || 5);

  const [results, setResults] = useState<ParkingLocation[]>(localParking);

  useEffect(() => {
    const q = query.trim();
    if (!q && !userLocation) {
      setResults(localParking);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      let apiLocations: ParkingLocation[] = [];
      try {
        let url = `/api/parking/search?radius=${radius}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        } else if (userLocation) {
          url += `&lat=${userLocation.lat}&lng=${userLocation.lng}`;
        }

        const res = await fetch(url, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = (await res.json()) as { locations: ParkingLocation[] };
          if (data.locations && data.locations.length > 0) {
            apiLocations = data.locations;
          }
        }
      } catch {
        // ignore fetch errors
      }

      const localResults = q ? searchParking(q) : [];
      
      // Combine results, prioritizing API results but including local matches
      // Deduplicate by ID just in case
      const combined = [...apiLocations, ...localResults].filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i
      );
      
      // If we have no API results but we have local results, use local.
      // If we have API results, we use them (plus local).
      // If combined is empty, we effectively show nothing found.
      if (combined.length > 0) {
         setResults(combined);
      } else if (!q && !userLocation) {
         setResults(localParking);
      } else {
         setResults([]);
      }
    }, 250);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, radius, userLocation]);

  useEffect(() => {
    if (!results.length) {
      setSelectedParkingId(null);
      return;
    }
    if (!selectedParkingId) {
      setSelectedParkingId(results[0].id);
      return;
    }
    const stillExists = results.some((p) => p.id === selectedParkingId);
    if (!stillExists) {
      setSelectedParkingId(results[0].id);
    }
  }, [results, selectedParkingId]);

  const selectedParking = useMemo<ParkingLocation | null>(() => {
    if (!selectedParkingId) return null;
    return results.find((p) => p.id === selectedParkingId) ?? null;
  }, [results, selectedParkingId]);

  const bookingValidation = useMemo(
    () => validateArrivalTime(arrivalTime),
    [arrivalTime]
  );

  const pricing = useMemo(() => {
    if (!selectedParking) {
      return {
        baseAmount: 0,
        lateFeeAmount: 0,
        totalAmount: 0,
        currency: "usd",
      };
    }
    const safeDuration = Math.max(1, durationHours);
    const baseAmount = selectedParking.hourlyRate * safeDuration;
    const lateFeeAmount = includeLateFee ? baseAmount * 0.4 : 0;
    const totalAmount = baseAmount + lateFeeAmount;
    return {
      baseAmount,
      lateFeeAmount,
      totalAmount,
      currency: selectedParking.currency,
    };
  }, [selectedParking, durationHours, includeLateFee]);

  async function handleCheckout() {
    if (!selectedParking) return;
    const validation = validateArrivalTime(arrivalTime);
    if (!validation.isValid) {
      setBookingError(validation.message ?? "Invalid arrival time.");
      return;
    }
    setBookingError(null);
    setIsCheckingOut(true);
    try {
      const payload: BookingPayload = {
        parkingId: selectedParking.id,
        parkingName: selectedParking.name,
        city: selectedParking.city,
        country: selectedParking.country,
        address: selectedParking.address,
        arrivalTime,
        durationHours: Math.max(1, durationHours),
        baseAmount: pricing.baseAmount,
        lateFeeAmount: pricing.lateFeeAmount,
        totalAmount: pricing.totalAmount,
        currency: selectedParking.currency,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message =
          response.status === 500
            ? "Payment is temporarily unavailable. Check Stripe configuration."
            : "Unable to start payment. Try again.";
        setBookingError(message);
        return;
      }

      const data = (await response.json()) as { url?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setBookingError("Payment session could not be created.");
      }
    } catch {
      setBookingError("Unexpected error while starting payment.");
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
              <span className="text-xl font-semibold text-slate-950">P</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                ParkHub Global
              </span>
              <span className="text-xs text-slate-400">
                Smart parking, anywhere in the world
              </span>
            </div>
          </Link>
          <div className="hidden items-center gap-3 text-xs font-medium text-slate-300 md:flex">
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1">
              Live availability
            </span>
            <span className="rounded-full border border-slate-700/60 bg-slate-900/80 px-3 py-1">
              Secure Stripe payments
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 lg:flex-row">
        <section className="w-full space-y-6 lg:w-[45%]">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Find the perfect parking spot
            </h1>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Search trusted garages and smart parking hubs across the globe.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-4 shadow-lg shadow-slate-900/40">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Search
                </p>
                <p className="text-sm text-slate-300">
                  City, country or parking name
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="inline-flex h-6 items-center rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3">
                  World-wide coverage
                </span>
              </div>
            </div>
            <div className="relative flex items-center">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “London”, “New York”, “Dubai Marina”…"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 pl-3 pr-20 py-3 text-sm outline-none ring-emerald-500/40 transition focus:border-emerald-400 focus:ring-2"
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                <button
                   title="Use my location"
                   onClick={() => {
                     setQuery("");
                     if ("geolocation" in navigator) {
                       navigator.geolocation.getCurrentPosition(
                         (position) => {
                           setUserLocation({
                             lat: position.coords.latitude,
                             lng: position.coords.longitude,
                           });
                         }
                       );
                     }
                   }}
                   className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                >
                  📍
                </button>
                <span className="pointer-events-none flex items-center text-slate-500 px-1">
                  ⌕
                </span>
              </div>
            </div>

            <div className="mt-4 border-t border-white/5 pt-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Search radius</span>
                <span className="font-medium text-emerald-400">{radius} km</span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-emerald-500 hover:accent-emerald-400"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                <span>2km</span>
                <span>10km</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                {results.length}{" "}
                {results.length === 1 ? "location" : "locations"} found
              </span>
              <span>Showing live slot availability</span>
            </div>

            <div className="flex flex-col gap-3">
              {results.map((parking) => {
                const isSelected = parking.id === selectedParkingId;
                const utilization =
                  100 -
                  Math.round((parking.availableSlots / parking.totalSlots) * 100);
                const availabilityLabel =
                  parking.availableSlots === 0
                    ? "Full"
                    : parking.availableSlots < parking.totalSlots * 0.15
                    ? "Filling fast"
                    : "Good availability";
                
                const distance = userLocation ? getDistanceFromLatLonInKm(
                  userLocation.lat,
                  userLocation.lng,
                  parking.coordinates.lat,
                  parking.coordinates.lng
                ).toFixed(1) : null;

                return (
                  <button
                    key={parking.id}
                    type="button"
                    onClick={() => setSelectedParkingId(parking.id)}
                    className={`flex w-full items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-emerald-400 bg-emerald-500/10 shadow-md shadow-emerald-900/50"
                        : "border-slate-700/80 bg-slate-900/70 hover:border-emerald-500/40 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {parking.name}
                        </span>
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-slate-300">
                          {parking.city}, {parking.country}
                        </span>
                        {distance && (
                           <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                             {distance} km
                           </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{parking.address}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                        <span className="rounded-full border border-emerald-400/50 bg-emerald-500/10 px-2 py-0.5 font-medium">
                          {parking.availableSlots} free of {parking.totalSlots} slots
                        </span>
                        <span className="rounded-full bg-slate-800 px-2 py-0.5">
                          {availabilityLabel}
                        </span>
                        <span className="rounded-full bg-slate-900 px-2 py-0.5">
                          From {formatCurrency(parking.hourlyRate, parking.currency)}
                          /hr
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-emerald-400"
                            style={{ width: `${utilization}%` }}
                          />
                        </div>
                        <span>{utilization}% full</span>
                      </div>
                      {isSelected && (
                        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-semibold text-slate-950">
                          Selected
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="w-full lg:w-[55%]">
          <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/5 bg-slate-900/80 p-4 shadow-xl shadow-slate-900/70">
            {selectedParking ? (
              <>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                      Booking overview
                    </p>
                    <h2 className="text-lg font-semibold">
                      {selectedParking.name}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {selectedParking.address}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right text-xs text-slate-300">
                    <span>
                      {selectedParking.city}, {selectedParking.country}
                    </span>
                    <span className="rounded-full bg-slate-800 px-3 py-1 font-medium">
                      {selectedParking.availableSlots} slots available now
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-300">
                        Arrival time
                      </label>
                      <input
                        type="datetime-local"
                        value={arrivalTime}
                        onChange={(event) => setArrivalTime(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-emerald-500/40 transition focus:border-emerald-400 focus:ring-2"
                      />
                      <p className="mt-1 text-[11px] text-slate-400">
                        Must be at least 30 minutes from now.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300">
                        Duration
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          max={24}
                          value={durationHours}
                          onChange={(event) =>
                            setDurationHours(
                              Number.parseInt(event.target.value || "1", 10)
                            )
                          }
                          className="w-20 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-emerald-500/40 transition focus:border-emerald-400 focus:ring-2"
                        />
                        <span className="text-xs text-slate-300">hours</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">
                        Pricing is calculated per full hour.
                      </p>
                    </div>

                    <div className="mt-2 flex items-start gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-3">
                      <button
                        type="button"
                        onClick={() => setIncludeLateFee((current) => !current)}
                        className={`mt-0.5 flex h-5 w-9 items-center rounded-full border px-0.5 transition ${
                          includeLateFee
                            ? "border-emerald-400 bg-emerald-500"
                            : "border-slate-600 bg-slate-800"
                        }`}
                      >
                        <span
                          className={`h-3.5 w-3.5 rounded-full bg-slate-950 transition ${
                            includeLateFee ? "translate-x-4" : ""
                          }`}
                        />
                      </button>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs font-medium text-slate-200">
                          Late arrival protection
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Adds 40% of the original fee so your spot is held even
                          if you are delayed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                      <div className="h-40 w-full bg-slate-950">
                        <iframe
                          title="Parking map preview"
                          src={getOsmEmbedUrl(selectedParking.coordinates)}
                          className="h-full w-full border-0"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 border-t border-slate-800 px-3 py-2">
                        <p className="text-[11px] text-slate-400">
                          Navigate with your preferred maps app.
                        </p>
                        <a
                          href={getGoogleMapsDirectionsUrl(
                            selectedParking.coordinates
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                          Open directions
                        </a>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-700 bg-slate-950 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Price summary
                      </p>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex items-center justify-between text-slate-300">
                          <span>
                            Base ({Math.max(1, durationHours)} hours)
                          </span>
                          <span>
                            {formatCurrency(
                              pricing.baseAmount,
                              pricing.currency
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Late arrival protection</span>
                          <span>
                            {includeLateFee
                              ? formatCurrency(
                                  pricing.lateFeeAmount,
                                  pricing.currency
                                )
                              : "Not added"}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-dashed border-slate-700 pt-2 text-sm font-semibold">
                          <span>Total due now</span>
                          <span className="text-emerald-400">
                            {formatCurrency(
                              pricing.totalAmount,
                              pricing.currency
                            )}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] text-slate-400">
                        Payments are processed securely with Stripe. Your card
                        details never touch ParkHub servers.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {bookingValidation.message && (
                        <p className="text-[11px] text-amber-400">
                          {bookingValidation.message}
                        </p>
                      )}
                      {bookingError && (
                        <p className="text-[11px] text-red-400">{bookingError}</p>
                      )}
                      <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={
                          !bookingValidation.isValid || isCheckingOut || !pricing.totalAmount
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-900/70 transition enabled:hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
                      >
                        <Image
                          src="/file.svg"
                          alt=""
                          width={16}
                          height={16}
                          className="opacity-80"
                        />
                        {isCheckingOut
                          ? "Connecting to Stripe…"
                          : "Reserve and pay with Stripe"}
                      </button>
                      <p className="text-[11px] text-slate-500">
                        You can manage your reservation and apply additional late
                        fees from the confirmation email if your plans change.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No locations match your search yet. Try another city or region.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
