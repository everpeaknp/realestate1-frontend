"use client";

import MapLibreGL, { type PopupOptions, type MarkerOptions } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X, Minus, Plus, Locate, Maximize, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type MapContextValue = {
  map: MapLibreGL.Map | null;
  isLoaded: boolean;
};

const MapContext = createContext<MapContextValue | null>(null);

function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a Map component");
  }
  return context;
}

const defaultStyles = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

type MapStyleOption = string | MapLibreGL.StyleSpecification;

type MapProps = {
  children?: ReactNode;
  styles?: {
    light?: MapStyleOption;
    dark?: MapStyleOption;
  };
} & Omit<MapLibreGL.MapOptions, "container" | "style">;

const DefaultLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="flex gap-1">
      <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse" />
      <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:150ms]" />
      <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:300ms]" />
    </div>
  </div>
);

function Map({ children, styles, ...props }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreGL.Map | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const { resolvedTheme } = useTheme();

  const mapStyles = useMemo(
    () => ({
      dark: styles?.dark ?? defaultStyles.dark,
      light: styles?.light ?? defaultStyles.light,
    }),
    [styles]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    const mapStyle =
      resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;

    const mapInstance = new MapLibreGL.Map({
      container: containerRef.current,
      style: mapStyle,
      renderWorldCopies: false,
      attributionControl: { compact: true },
      ...props,
    });

    const styleDataHandler = () => setIsStyleLoaded(true);
    const loadHandler = () => setIsLoaded(true);

    mapInstance.on("load", loadHandler);
    mapInstance.on("styledata", styleDataHandler);
    mapRef.current = mapInstance;

    return () => {
      mapInstance.off("load", loadHandler);
      mapInstance.off("styledata", styleDataHandler);
      mapInstance.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  useEffect(() => {
    if (mapRef.current) {
      setIsStyleLoaded(false);
      mapRef.current.setStyle(
        resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light,
        { diff: true }
      );
    }
  }, [resolvedTheme, mapStyles]);

  const isLoading = !isMounted || !isLoaded || !isStyleLoaded;

  return (
    <MapContext.Provider
      value={{ map: mapRef.current, isLoaded: isMounted && isLoaded && isStyleLoaded }}
    >
      <div ref={containerRef} className="relative w-full h-full">
        {isLoading && <DefaultLoader />}
        {isMounted && children}
      </div>
    </MapContext.Provider>
  );
}

// ─── Marker ──────────────────────────────────────────────────────────────────

type MarkerContextValue = {
  markerRef: React.RefObject<MapLibreGL.Marker | null>;
  markerElementRef: React.RefObject<HTMLDivElement | null>;
  map: MapLibreGL.Map | null;
  isReady: boolean;
};

const MarkerContext = createContext<MarkerContextValue | null>(null);

function useMarkerContext() {
  const context = useContext(MarkerContext);
  if (!context) throw new Error("Marker components must be used within MapMarker");
  return context;
}

type MapMarkerProps = {
  longitude: number;
  latitude: number;
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
  onDragStart?: (lngLat: { lng: number; lat: number }) => void;
  onDrag?: (lngLat: { lng: number; lat: number }) => void;
  onDragEnd?: (lngLat: { lng: number; lat: number }) => void;
} & Omit<MarkerOptions, "element">;

function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onDragStart,
  onDrag,
  onDragEnd,
  draggable = false,
  ...markerOptions
}: MapMarkerProps) {
  const { map, isLoaded } = useMap();
  const markerRef = useRef<MapLibreGL.Marker | null>(null);
  const markerElementRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoaded || !map) return;

    const container = document.createElement("div");
    markerElementRef.current = container;

    const marker = new MapLibreGL.Marker({
      ...markerOptions,
      element: container,
      draggable,
    })
      .setLngLat([longitude, latitude])
      .addTo(map);

    markerRef.current = marker;

    const handleClick = (e: MouseEvent) => onClick?.(e);
    const handleMouseEnter = (e: MouseEvent) => onMouseEnter?.(e);
    const handleMouseLeave = (e: MouseEvent) => onMouseLeave?.(e);

    container.addEventListener("click", handleClick);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    const handleDragStart = () => { const l = marker.getLngLat(); onDragStart?.({ lng: l.lng, lat: l.lat }); };
    const handleDrag = () => { const l = marker.getLngLat(); onDrag?.({ lng: l.lng, lat: l.lat }); };
    const handleDragEnd = () => { const l = marker.getLngLat(); onDragEnd?.({ lng: l.lng, lat: l.lat }); };

    marker.on("dragstart", handleDragStart);
    marker.on("drag", handleDrag);
    marker.on("dragend", handleDragEnd);

    setIsReady(true);

    return () => {
      container.removeEventListener("click", handleClick);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      marker.off("dragstart", handleDragStart);
      marker.off("drag", handleDrag);
      marker.off("dragend", handleDragEnd);
      marker.remove();
      markerRef.current = null;
      markerElementRef.current = null;
      setIsReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, isLoaded]);

  useEffect(() => { markerRef.current?.setLngLat([longitude, latitude]); }, [longitude, latitude]);
  useEffect(() => { markerRef.current?.setDraggable(draggable); }, [draggable]);

  return (
    <MarkerContext.Provider value={{ markerRef, markerElementRef, map, isReady }}>
      {children}
    </MarkerContext.Provider>
  );
}

type MarkerContentProps = { children?: ReactNode; className?: string };

function MarkerContent({ children, className }: MarkerContentProps) {
  const { markerElementRef, isReady } = useMarkerContext();
  if (!isReady || !markerElementRef.current) return null;
  return createPortal(
    <div className={cn("relative cursor-pointer", className)}>
      {children || <DefaultMarkerIcon />}
    </div>,
    markerElementRef.current
  );
}

function DefaultMarkerIcon() {
  return <div className="relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" />;
}

// ─── Marker Popup ─────────────────────────────────────────────────────────────

type MarkerPopupProps = {
  children: ReactNode;
  className?: string;
  closeButton?: boolean;
} & Omit<PopupOptions, "className">;

function MarkerPopup({ children, className, closeButton = false, ...popupOptions }: MarkerPopupProps) {
  const { markerRef, isReady } = useMarkerContext();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<MapLibreGL.Popup | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isReady || !markerRef.current) return;
    const container = document.createElement("div");
    containerRef.current = container;
    const popup = new MapLibreGL.Popup({ offset: 16, ...popupOptions, closeButton: false })
      .setMaxWidth("none")
      .setDOMContent(container);
    popupRef.current = popup;
    markerRef.current.setPopup(popup);
    setMounted(true);
    return () => {
      popup.remove();
      popupRef.current = null;
      containerRef.current = null;
      setMounted(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  const handleClose = () => popupRef.current?.remove();
  if (!mounted || !containerRef.current) return null;

  return createPortal(
    <div className={cn("relative rounded-md border bg-popover p-3 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95", className)}>
      {closeButton && (
        <button type="button" onClick={handleClose} className="absolute top-1 right-1 z-10 rounded-sm opacity-70 hover:opacity-100" aria-label="Close popup">
          <X className="h-4 w-4" />
        </button>
      )}
      {children}
    </div>,
    containerRef.current
  );
}

// ─── Map Popup ────────────────────────────────────────────────────────────────

type MapPopupProps = {
  longitude: number;
  latitude: number;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
  closeButton?: boolean;
} & Omit<PopupOptions, "className">;

function MapPopup({ longitude, latitude, onClose, children, className, closeButton = false, ...popupOptions }: MapPopupProps) {
  const { map } = useMap();
  const popupRef = useRef<MapLibreGL.Popup | null>(null);
  const container = useMemo(() => document.createElement("div"), []);

  useEffect(() => {
    if (!map) return;
    const popup = new MapLibreGL.Popup({ offset: 16, ...popupOptions, closeButton: false })
      .setMaxWidth("none")
      .setDOMContent(container)
      .setLngLat([longitude, latitude])
      .addTo(map);
    const onCloseProp = () => onClose?.();
    popup.on("close", onCloseProp);
    popupRef.current = popup;
    return () => {
      popup.off("close", onCloseProp);
      if (popup.isOpen()) popup.remove();
      popupRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => { popupRef.current?.setLngLat([longitude, latitude]); }, [longitude, latitude]);

  const handleClose = () => { popupRef.current?.remove(); onClose?.(); };

  return createPortal(
    <div className={cn("relative rounded-md border bg-popover p-3 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95", className)}>
      {closeButton && (
        <button type="button" onClick={handleClose} className="absolute top-1 right-1 z-10 rounded-sm opacity-70 hover:opacity-100" aria-label="Close popup">
          <X className="h-4 w-4" />
        </button>
      )}
      {children}
    </div>,
    container
  );
}

// ─── Map Controls ─────────────────────────────────────────────────────────────

type MapControlsProps = {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showZoom?: boolean;
  showLocate?: boolean;
  showFullscreen?: boolean;
  className?: string;
  onLocate?: (coords: { longitude: number; latitude: number }) => void;
};

const positionClasses = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "bottom-right": "bottom-10 right-2",
};

function ControlGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-md border border-border bg-background shadow-sm overflow-hidden [&>button:not(:last-child)]:border-b [&>button:not(:last-child)]:border-border">
      {children}
    </div>
  );
}

function ControlButton({ onClick, label, children, disabled = false }: { onClick: () => void; label: string; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button onClick={onClick} aria-label={label} type="button" disabled={disabled}
      className={cn("flex items-center justify-center size-8 hover:bg-accent transition-colors", disabled && "opacity-50 pointer-events-none")}>
      {children}
    </button>
  );
}

function MapControls({ position = "bottom-right", showZoom = true, showLocate = false, showFullscreen = false, className, onLocate }: MapControlsProps) {
  const { map, isLoaded } = useMap();
  const [waitingForLocation, setWaitingForLocation] = useState(false);

  const handleZoomIn = useCallback(() => { map?.zoomTo(map.getZoom() + 1, { duration: 300 }); }, [map]);
  const handleZoomOut = useCallback(() => { map?.zoomTo(map.getZoom() - 1, { duration: 300 }); }, [map]);

  const handleLocate = useCallback(() => {
    setWaitingForLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { longitude: pos.coords.longitude, latitude: pos.coords.latitude };
          map?.flyTo({ center: [coords.longitude, coords.latitude], zoom: 14, duration: 1500 });
          onLocate?.(coords);
          setWaitingForLocation(false);
        },
        () => setWaitingForLocation(false)
      );
    }
  }, [map, onLocate]);

  const handleFullscreen = useCallback(() => {
    const container = map?.getContainer();
    if (!container) return;
    document.fullscreenElement ? document.exitFullscreen() : container.requestFullscreen();
  }, [map]);

  if (!isLoaded) return null;

  return (
    <div className={cn("absolute z-10 flex flex-col gap-1.5", positionClasses[position], className)}>
      {showZoom && (
        <ControlGroup>
          <ControlButton onClick={handleZoomIn} label="Zoom in"><Plus className="size-4" /></ControlButton>
          <ControlButton onClick={handleZoomOut} label="Zoom out"><Minus className="size-4" /></ControlButton>
        </ControlGroup>
      )}
      {showLocate && (
        <ControlGroup>
          <ControlButton onClick={handleLocate} label="Find my location" disabled={waitingForLocation}>
            {waitingForLocation ? <Loader2 className="size-4 animate-spin" /> : <Locate className="size-4" />}
          </ControlButton>
        </ControlGroup>
      )}
      {showFullscreen && (
        <ControlGroup>
          <ControlButton onClick={handleFullscreen} label="Toggle fullscreen"><Maximize className="size-4" /></ControlButton>
        </ControlGroup>
      )}
    </div>
  );
}

// ─── Map Route ────────────────────────────────────────────────────────────────

type MapRouteProps = {
  coordinates: [number, number][];
  color?: string;
  width?: number;
  opacity?: number;
  dashArray?: [number, number];
};

function MapRoute({ coordinates, color = "#4285F4", width = 3, opacity = 0.8, dashArray }: MapRouteProps) {
  const { map, isLoaded } = useMap();
  const id = useId();
  const sourceId = `route-source-${id}`;
  const layerId = `route-layer-${id}`;

  useEffect(() => {
    if (!isLoaded || !map) return;
    map.addSource(sourceId, { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } } });
    map.addLayer({ id: layerId, type: "line", source: sourceId, layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": color, "line-width": width, "line-opacity": opacity, ...(dashArray && { "line-dasharray": dashArray }) } });
    return () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch { /* ignore */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map, sourceId, layerId]);

  useEffect(() => {
    if (!isLoaded || !map || coordinates.length < 2) return;
    const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
    source?.setData({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates } });
  }, [isLoaded, map, coordinates, sourceId]);

  return null;
}

export { Map, useMap, MapMarker, MarkerContent, MarkerPopup, MapPopup, MapControls, MapRoute };
