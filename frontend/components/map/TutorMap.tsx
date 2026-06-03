"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { api, getApiErrorMessage } from "@/lib/api";
import { loadGoogleMaps } from "@/lib/maps";
import { sampleTutors } from "@/lib/sample-data";
import type { Tutor } from "@/types";
import { TutorCard } from "@/components/tutor/TutorCard";

export function TutorMap({ tutors: initialTutors = sampleTutors }: { tutors?: Tutor[] }) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [searchError, setSearchError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [tutors, setTutors] = React.useState<Tutor[]>(initialTutors);
  const [subject, setSubject] = React.useState("Math");
  const [classLevel, setClassLevel] = React.useState("10");
  const [radius, setRadius] = React.useState(10);
  const [maxRate, setMaxRate] = React.useState(1000);
  const [mode, setMode] = React.useState("BOTH");
  const [minRating, setMinRating] = React.useState("4");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  async function applyFilters() {
    setLoading(true);
    setSearchError(null);
    try {
      const response = await api.get("/search/tutors", {
        params: {
          subject,
          classLevel,
          lat: 32.7266,
          lng: 74.857,
          radius,
          mode,
          maxRate,
          minRating,
          sortBy: "smart_score"
        }
      });
      setTutors(response.data.data.tutors);
    } catch (requestError) {
      setSearchError(getApiErrorMessage(requestError, "Could not search tutors."));
      setTutors(initialTutors);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (!mapRef.current) return;
    loadGoogleMaps(apiKey)
      .then((googleApi) => {
        const center = { lat: tutors[0]?.latitude || 32.7266, lng: tutors[0]?.longitude || 74.857 };
        const map = new googleApi.maps.Map(mapRef.current!, {
          center,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false
        });
        tutors.forEach((tutor) => {
          const marker = new googleApi.maps.Marker({
            position: { lat: tutor.latitude, lng: tutor.longitude },
            map,
            title: tutor.user?.name || "Tutor",
            icon: tutor.verificationLevel >= 3 ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png" : tutor.verificationLevel > 0 ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" : undefined
          });
          const info = new googleApi.maps.InfoWindow({
            content: `<strong>${tutor.user?.name || "Tutor"}</strong><br/>${tutor.subjects.join(", ")}<br/>${tutor.ratingAvg} rating`
          });
          marker.addListener("click", () => info.open({ map, anchor: marker }));
        });
      })
      .catch((mapError) => setError(mapError.message));
  }, [apiKey, tutors]);

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <Card className="border-amber-100 bg-[#fffaf3]/90 p-4 shadow-[0_20px_55px_rgba(15,23,42,0.1)]">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Subject</label>
            <Select value={subject} onChange={(event) => setSubject(event.target.value)}>
              {["Math", "Physics", "Chemistry", "Biology", "English", "Hindi", "History"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold">Class level</label>
            <Select value={classLevel} onChange={(event) => setClassLevel(event.target.value)}>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "JEE", "NEET"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold">Distance radius: {radius} km</label>
            <input type="range" min={1} max={25} value={radius} onChange={(event) => setRadius(Number(event.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="text-sm font-semibold">Max hourly rate</label>
            <Input type="number" value={maxRate} onChange={(event) => setMaxRate(Number(event.target.value))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Select value={mode} onChange={(event) => setMode(event.target.value)}>
              <option value="BOTH">Both</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </Select>
            <Select value={minRating} onChange={(event) => setMinRating(event.target.value)}>
              <option value="0">Any rating</option>
              <option value="4">4+ stars</option>
              <option value="4.5">4.5+ stars</option>
            </Select>
          </div>
          {searchError ? <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">{searchError}</p> : null}
          <Button className="w-full" onClick={applyFilters} disabled={loading}>
            {loading ? "Searching..." : "Apply filters"}
          </Button>
        </div>
      </Card>
      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Card className="min-h-[520px] overflow-hidden border-amber-100 bg-[#fffaf3]/90">
          {error ? (
            <div className="flex h-[520px] flex-col items-center justify-center gap-3 bg-slate-100 p-6 text-center">
              <MapPin className="h-10 w-10 text-primary" />
              <p className="font-semibold">Map preview needs a Google Maps key</p>
              <p className="max-w-md text-sm text-muted-foreground">{error}. The tutor list remains fully usable and will switch to the live map when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is configured.</p>
            </div>
          ) : (
            <div ref={mapRef} className="h-[520px] w-full" />
          )}
        </Card>
        <div className="space-y-4">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      </div>
    </div>
  );
}
