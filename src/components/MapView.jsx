import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const truckIcon = L.divIcon({
  html: '<div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">🚛</div>',
  className: 'truck-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const pickupIcon = L.divIcon({
  html: '<div style="font-size:24px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">📦</div>',
  className: 'pickup-marker',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const dropIcon = L.divIcon({
  html: '<div style="font-size:24px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">📍</div>',
  className: 'drop-marker',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function MapView({
  pickupCoords,
  dropCoords,
  truckCoords,
  height = '400px',
  className = '',
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const truckMarkerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([11.5, 78.5], 7);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous layers except tile
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    const bounds = [];

    // Pickup marker
    if (pickupCoords) {
      L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon })
        .addTo(map)
        .bindPopup(`<b>Pickup</b><br/>${pickupCoords.city || ''}`);
      bounds.push([pickupCoords.lat, pickupCoords.lng]);
    }

    // Drop marker
    if (dropCoords) {
      L.marker([dropCoords.lat, dropCoords.lng], { icon: dropIcon })
        .addTo(map)
        .bindPopup(`<b>Drop</b><br/>${dropCoords.city || ''}`);
      bounds.push([dropCoords.lat, dropCoords.lng]);
    }

    // Route line
    if (pickupCoords && dropCoords) {
      L.polyline(
        [[pickupCoords.lat, pickupCoords.lng], [dropCoords.lat, dropCoords.lng]],
        { color: '#4c6ef5', weight: 3, opacity: 0.7, dashArray: '8, 8' }
      ).addTo(map);
    }

    // Truck marker
    if (truckCoords) {
      const marker = L.marker([truckCoords.lat, truckCoords.lng], { icon: truckIcon })
        .addTo(map)
        .bindPopup('<b>Truck Location</b>');
      truckMarkerRef.current = marker;
      bounds.push([truckCoords.lat, truckCoords.lng]);
    }

    // Fit bounds
    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 10);
    }

    return () => {};
  }, [pickupCoords, dropCoords, truckCoords]);

  // Update truck position smoothly
  useEffect(() => {
    if (truckMarkerRef.current && truckCoords) {
      truckMarkerRef.current.setLatLng([truckCoords.lat, truckCoords.lng]);
    }
  }, [truckCoords]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%' }}
      className={`rounded-xl overflow-hidden ${className}`}
    />
  );
}
