let loaderPromise: Promise<typeof google> | null = null;

export function loadGoogleMaps(apiKey?: string) {
  if (typeof window === "undefined") return Promise.reject(new Error("Maps can only load in the browser"));
  if (window.google?.maps) return Promise.resolve(window.google);
  if (!apiKey) return Promise.reject(new Error("Google Maps API key is not configured"));
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });

  return loaderPromise;
}

