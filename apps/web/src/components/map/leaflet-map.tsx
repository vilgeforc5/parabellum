'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTheme } from 'next-themes';
import type { ConflictEvent, DestroyedEquipment } from '@/lib/strapi/types';

const TILES = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
} as const;

/** Watches the map container for size changes and calls invalidateSize. */
function MapResizer() {
  const map = useMap();

  useEffect(() => {
    map.attributionControl.setPrefix('Parabellum');
  }, []);

  useEffect(() => {
    const container = map.getContainer();
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(container);
    return () => ro.disconnect();
  }, [map]);
  return null;
}

// Fix Leaflet's default icon URLs broken by webpack
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)[
    '_getIconUrl'
  ];
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
};

const STATUS_COLORS: Record<string, string> = {
  destroyed: '#ef4444',
  damaged: '#f97316',
  captured: '#3b82f6',
  abandoned: '#a855f7',
};

const EVENT_COLORS: Record<string, string> = {
  battle: '#ef4444',
  airstrike: '#f97316',
  naval: '#3b82f6',
  artillery: '#eab308',
  ground: '#22c55e',
  evacuation: '#a855f7',
  other: '#6b7280',
};

const EVENT_ICONS: Record<string, string> = {
  battle: '⚔️',
  airstrike: '✈️',
  naval: '🚢',
  artillery: '💥',
  ground: '🪖',
  evacuation: '🏥',
  other: '📍',
};

function createEventIcon(category: string) {
  const color = EVENT_COLORS[category] ?? EVENT_COLORS.other;
  const emoji = EVENT_ICONS[category] ?? EVENT_ICONS.other;
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 32px; height: 32px;
      background: ${color};
      border: 2px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
    "><span style="transform: rotate(45deg); font-size: 14px; display: block; text-align: center; line-height: 28px;">${emoji}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

export interface LeafletMapProps {
  equipment: DestroyedEquipment[];
  events: ConflictEvent[];
  showEquipment: boolean;
  showEvents: boolean;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
}

export function LeafletMap({
  equipment,
  events,
  showEquipment,
  showEvents,
  centerLat = 49.0,
  centerLng = 31.0,
  zoom = 6,
}: LeafletMapProps) {
  const { resolvedTheme } = useTheme();
  const tileUrl = resolvedTheme === 'light' ? TILES.light : TILES.dark;

  useEffect(() => {
    fixLeafletIcons();
  }, []);

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={zoom}
      className="h-full w-full"
      zoomControl={false}
    >
      <MapResizer />
      <TileLayer
        key={tileUrl}
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url={tileUrl}
        subdomains="abcd"
        maxZoom={19}
      />

      {showEquipment &&
        equipment.map((item) => {
          if (item.latitude == null || item.longitude == null) return null;
          const color = STATUS_COLORS[item.status?.slug ?? ''] ?? '#6b7280';
          return (
            <CircleMarker
              key={item.documentId}
              center={[item.latitude, item.longitude]}
              radius={6}
              pathOptions={{
                color: 'white',
                weight: 1,
                fillColor: color,
                fillOpacity: 0.85,
              }}
            >
              <Popup>
                <div className="min-w-[160px] space-y-1">
                  <p className="font-semibold text-sm leading-snug">
                    {item.equipmentLabel ??
                      item.equipment?.name ??
                      'Unknown Equipment'}
                  </p>
                  {item.equipment?.type && (
                    <p className="text-xs text-gray-600">
                      {item.equipment.type.name}
                    </p>
                  )}
                  {item.status && (
                    <span
                      className="inline-block rounded px-1.5 py-0.5 text-xs font-medium text-white"
                      style={{ backgroundColor: color }}
                    >
                      {item.status.name}
                    </span>
                  )}
                  {item.country && (
                    <p className="text-xs text-gray-500">{item.country.name}</p>
                  )}
                  {item.region && (
                    <p className="text-xs text-gray-400">{item.region.name}</p>
                  )}
                  {item.eventDate && (
                    <p className="text-xs text-gray-400">
                      {new Date(item.eventDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

      {showEvents &&
        events.map((event) => (
          <Marker
            key={event.documentId}
            position={[event.latitude, event.longitude]}
            icon={createEventIcon(event.category)}
          >
            <Popup>
              <div className="min-w-[180px] space-y-1.5">
                <p className="font-semibold text-sm leading-snug">
                  {event.name}
                </p>
                <span
                  className="inline-block rounded px-1.5 py-0.5 text-xs font-medium capitalize text-white"
                  style={{ backgroundColor: EVENT_COLORS[event.category] }}
                >
                  {event.category}
                </span>
                {event.description && (
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                )}
                {event.date && (
                  <p className="text-xs text-gray-400">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
