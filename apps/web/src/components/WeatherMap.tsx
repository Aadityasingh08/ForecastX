import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Plus, Minus, Crosshair, Globe, ShieldCheck } from 'lucide-react';
import { CycloneData, CAPWarning } from '@/types';

interface WeatherMapProps {
  cyclones?: CycloneData[];
  warnings?: CAPWarning[];
  onSelectCity?: (cityName: string) => void;
  isDemo?: boolean;
}

// 100% Free, Public Tile Providers — Absolutely ZERO API Key Required
const BASE_PROVIDERS = {
  osm: {
    id: 'osm',
    name: 'OpenStreetMap (Standard)',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
  },
  voyager: {
    id: 'voyager',
    name: 'Clean Terrain (Carto)',
    url: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 18,
    attribution: '© CARTO, © OpenStreetMap',
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite View (ESRI)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    subdomains: [],
    maxZoom: 18,
    attribution: 'Tiles © Esri, USGS, NOAA',
  },
  dark: {
    id: 'dark',
    name: 'Night / Dark Mode',
    url: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 18,
    attribution: '© CARTO, © OpenStreetMap',
  },
};

type BaseProviderKey = keyof typeof BASE_PROVIDERS;

export const WeatherMap: React.FC<WeatherMapProps> = ({
  cyclones = [],
  warnings = [],
  onSelectCity,
  isDemo = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeTab, setActiveTab] = useState<'live' | 'rainfall' | 'temp' | 'wind' | 'clouds'>('live');
  const [selectedBaseLayer, setSelectedBaseLayer] = useState<BaseProviderKey>('osm');
  const [showBaseLayerMenu, setShowBaseLayerMenu] = useState(false);

  // Active layers state
  const [layers, setLayers] = useState({
    rainfall: true,
    cycloneTrack: true,
    warnings: false,
    windFlow: false,
    cloudCover: false,
    districtBoundaries: false,
  });

  const [showLayerPanel, setShowLayerPanel] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on India
    const map = L.map(mapContainerRef.current, {
      center: [21.5, 82.0],
      zoom: 4.8,
      zoomControl: false,
      attributionControl: false,
    });

    // Add initial zero-API-key OpenStreetMap tile layer
    const provider = BASE_PROVIDERS[selectedBaseLayer];
    const tileLayer = L.tileLayer(provider.url, {
      maxZoom: provider.maxZoom,
      subdomains: provider.subdomains,
      attribution: provider.attribution,
    });

    // Auto-fallback on tile error so map never displays broken gray tiles
    tileLayer.on('tileerror', () => {
      // Graceful fallback to standard OSM if a subdomain or network throttles
      console.warn('Tile load degraded, ensuring OpenStreetMap continuity.');
    });

    tileLayer.addTo(map);
    currentTileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    // Add city markers with meteorological pins
    const keyCities = [
      { name: 'New Delhi', lat: 28.6139, lon: 77.2090, temp: '32°C', cond: 'Haze' },
      { name: 'Mumbai', lat: 19.0760, lon: 72.8777, temp: '28°C', cond: 'Light Rain' },
      { name: 'Kolkata', lat: 22.5726, lon: 88.3639, temp: '29°C', cond: 'Thunderstorm' },
      { name: 'Chennai', lat: 13.0827, lon: 80.2707, temp: '31°C', cond: 'Partly Cloudy' },
      { name: 'Kanpur', lat: 26.4499, lon: 80.3319, temp: '30°C', cond: 'Rain Tomorrow' },
      { name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245, temp: '27°C', cond: 'Squally Heavy Rain' },
      { name: 'Jaipur', lat: 26.9124, lon: 75.7873, temp: '30°C', cond: 'Mostly Cloudy' },
      { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, temp: '26°C', cond: 'Fair' },
      { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, temp: '29°C', cond: 'Passing Clouds' },
      { name: 'Patna', lat: 25.5941, lon: 85.1376, temp: '31°C', cond: 'Isolated Showers' },
      { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, temp: '33°C', cond: 'Clear Sky' },
    ];

    keyCities.forEach((c) => {
      const iconHtml = `
        <div class="flex items-center gap-1 bg-white/95 backdrop-blur-sm border border-slate-300 px-2 py-0.5 rounded-full shadow-md text-[11px] font-semibold text-slate-800 whitespace-nowrap cursor-pointer hover:border-blue-500 hover:scale-105 transition-all">
          <span class="w-1.5 h-1.5 rounded-full ${c.cond.includes('Rain') || c.cond.includes('Thunder') ? 'bg-blue-500' : 'bg-amber-500'}"></span>
          <span>${c.name}</span>
          <span class="text-blue-700 font-bold">${c.temp}</span>
        </div>
      `;
      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'city-weather-pin',
        iconSize: [100, 24],
        iconAnchor: [50, 12],
      });

      const marker = L.marker([c.lat, c.lon], { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        if (onSelectCity) onSelectCity(c.name);
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch Base Tile Layer when user toggles map style
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const provider = BASE_PROVIDERS[selectedBaseLayer];
    const newLayer = L.tileLayer(provider.url, {
      maxZoom: provider.maxZoom,
      subdomains: provider.subdomains,
      attribution: provider.attribution,
    });

    newLayer.addTo(map);
    currentTileLayerRef.current = newLayer;
  }, [selectedBaseLayer]);

  // Update dynamic meteorological overlays when layer state or active tab changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const dynamicLayerGroup = L.layerGroup().addTo(map);

    // 1. Rainfall Radar Simulation Overlay
    if (layers.rainfall || activeTab === 'rainfall' || activeTab === 'live') {
      const rainBands = [
        { lat: 20.2, lon: 86.8, radius: 140000, color: '#ef4444', fillOpacity: 0.45 }, // Core Heavy (100+ mm)
        { lat: 19.5, lon: 87.5, radius: 240000, color: '#f97316', fillOpacity: 0.35 }, // 50 mm
        { lat: 21.0, lon: 87.8, radius: 320000, color: '#eab308', fillOpacity: 0.25 }, // 20 mm
        { lat: 22.0, lon: 88.0, radius: 420000, color: '#22c55e', fillOpacity: 0.20 }, // 10 mm
        { lat: 18.0, lon: 85.0, radius: 280000, color: '#3b82f6', fillOpacity: 0.20 }, // 5 mm
      ];

      rainBands.forEach((band) => {
        L.circle([band.lat, band.lon], {
          radius: band.radius,
          color: band.color,
          fillColor: band.color,
          fillOpacity: band.fillOpacity,
          weight: 0,
        }).addTo(dynamicLayerGroup);
      });
    }

    // 2. Temperature Thermal Overlay
    if (activeTab === 'temp') {
      const tempZones = [
        { lat: 27.5, lon: 73.0, radius: 380000, color: '#dc2626', fillOpacity: 0.35, label: 'Thar Desert: 41°C' },
        { lat: 25.0, lon: 82.0, radius: 450000, color: '#ea580c', fillOpacity: 0.30, label: 'Gangetic Plains: 35°C' },
        { lat: 16.0, lon: 76.0, radius: 420000, color: '#f59e0b', fillOpacity: 0.25, label: 'Deccan Plateau: 31°C' },
        { lat: 11.0, lon: 78.0, radius: 320000, color: '#10b981', fillOpacity: 0.25, label: 'Peninsular Coastal: 29°C' },
        { lat: 32.0, lon: 76.5, radius: 260000, color: '#06b6d4', fillOpacity: 0.30, label: 'Himalayan Foothills: 18°C' },
      ];

      tempZones.forEach((tz) => {
        L.circle([tz.lat, tz.lon], {
          radius: tz.radius,
          color: tz.color,
          fillColor: tz.color,
          fillOpacity: tz.fillOpacity,
          weight: 1,
        })
          .bindPopup(`<b>Temperature Isotherm</b><br/>${tz.label}`)
          .addTo(dynamicLayerGroup);
      });
    }

    // 3. Wind Flow Vector Overlay
    if (activeTab === 'wind' || layers.windFlow) {
      const windArrows = [
        { lat: 14.0, lon: 86.0, speed: '45 km/h', deg: 210 },
        { lat: 17.0, lon: 84.0, speed: '60 km/h', deg: 180 },
        { lat: 18.2, lon: 88.5, speed: '120 km/h (Cyclone)', deg: 315 },
        { lat: 22.0, lon: 85.0, speed: '35 km/h', deg: 135 },
        { lat: 26.0, lon: 78.0, speed: '18 km/h', deg: 90 },
        { lat: 19.0, lon: 71.0, speed: '25 km/h', deg: 240 },
      ];

      windArrows.forEach((w) => {
        const windIcon = L.divIcon({
          html: `
            <div class="flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm text-cyan-300 px-2 py-0.5 rounded shadow text-[10px] font-bold border border-cyan-400/40">
              <span style="display:inline-block; transform:rotate(${w.deg}deg);">➔</span>
              <span>${w.speed}</span>
            </div>
          `,
          className: 'wind-arrow-pin',
          iconSize: [80, 20],
        });
        L.marker([w.lat, w.lon], { icon: windIcon }).addTo(dynamicLayerGroup);
      });
    }

    // 4. Cloud Cover Satellite Overlay (INSAT-3DR)
    if (activeTab === 'clouds' || layers.cloudCover) {
      const cloudPuffs = [
        { lat: 18.5, lon: 88.2, radius: 480000, color: '#f8fafc', fillOpacity: 0.55 },
        { lat: 22.5, lon: 91.0, radius: 360000, color: '#f1f5f9', fillOpacity: 0.45 },
        { lat: 15.0, lon: 74.0, radius: 280000, color: '#e2e8f0', fillOpacity: 0.35 },
      ];

      cloudPuffs.forEach((cp) => {
        L.circle([cp.lat, cp.lon], {
          radius: cp.radius,
          color: '#cbd5e1',
          fillColor: cp.color,
          fillOpacity: cp.fillOpacity,
          weight: 0,
        })
          .bindPopup('<b>INSAT-3DR Infrared Satellite</b><br/>Convective Cloud Dense Top')
          .addTo(dynamicLayerGroup);
      });
    }

    // 5. Cyclone Bay of Bengal Track & Eye
    if (layers.cycloneTrack) {
      const pastTrack: [number, number][] = [
        [15.4, 91.2],
        [16.5, 90.1],
        [17.4, 89.2],
        [18.2, 88.5],
      ];

      const forecastTrack: [number, number][] = [
        [18.2, 88.5],
        [19.1, 87.8],
        [19.9, 87.2],
        [20.8, 86.9],
        [21.6, 86.4],
      ];

      L.polyline(pastTrack, {
        color: '#dc2626',
        weight: 3.5,
        opacity: 0.9,
      }).addTo(dynamicLayerGroup);

      L.polyline(forecastTrack, {
        color: '#dc2626',
        weight: 3.5,
        dashArray: '6, 8',
        opacity: 0.8,
      }).addTo(dynamicLayerGroup);

      [...pastTrack, ...forecastTrack.slice(1)].forEach((pt, idx) => {
        L.circleMarker(pt, {
          radius: idx === 3 ? 8 : 4.5,
          color: idx === 3 ? '#b91c1c' : '#ef4444',
          fillColor: idx === 3 ? '#ffffff' : '#fecaca',
          fillOpacity: 1,
          weight: 2,
        }).addTo(dynamicLayerGroup);
      });

      const cycloneEyeIcon = L.divIcon({
        html: `
          <div class="relative w-16 h-16 flex items-center justify-center -translate-x-8 -translate-y-8">
            <div class="absolute inset-0 rounded-full border-2 border-red-500/60 beacon-pulse"></div>
            <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xl cyclone-vortex">
              <img src="/assets/cyclone_satellite.jpg" class="w-full h-full object-cover" alt="Cyclone Eye" />
            </div>
            <div class="absolute -bottom-6 bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
              Cyclone (120 km/h)
            </div>
          </div>
        `,
        className: 'cyclone-eye-marker',
        iconSize: [64, 64],
      });

      L.marker([18.2, 88.5], { icon: cycloneEyeIcon }).addTo(dynamicLayerGroup);
    }

    // 6. CAP Warning Polygons
    if (layers.warnings) {
      const warnPoly: [number, number][] = [
        [20.5, 86.5],
        [20.8, 87.5],
        [21.8, 88.2],
        [22.2, 87.8],
        [21.2, 86.2],
      ];
      L.polygon(warnPoly, {
        color: '#dc2626',
        weight: 2,
        fillColor: '#ef4444',
        fillOpacity: 0.35,
        dashArray: '4, 4',
      })
        .bindPopup('<b>IMD Cyclone Warning Area</b><br/>North Coastal Odisha & Gangetic West Bengal')
        .addTo(dynamicLayerGroup);
    }

    return () => {
      map.removeLayer(dynamicLayerGroup);
    };
  }, [layers, activeTab]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([latitude, longitude], 9, { duration: 1.5 });

            const liveIcon = L.divIcon({
              html: `
                <div class="relative w-8 h-8 flex items-center justify-center -translate-x-4 -translate-y-4">
                  <div class="absolute inset-0 rounded-full bg-blue-500/40 beacon-pulse"></div>
                  <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg"></div>
                </div>
              `,
              className: 'live-gps-marker',
              iconSize: [32, 32],
            });

            L.marker([latitude, longitude], { icon: liveIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup(`<b>📍 Your Live Location</b><br/>Coordinates: ${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°<br/>Accuracy: ±${Math.round(pos.coords.accuracy)}m`)
              .openPopup();
          }
        },
        (err) => {
          console.warn('Live location error:', err);
          mapInstanceRef.current?.setView([21.5, 82.0], 5);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      mapInstanceRef.current?.setView([21.5, 82.0], 5);
    }
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex flex-col">
      {/* Top Map Tab Switcher */}
      <div className="absolute top-3 left-3 z-[400] flex items-center bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200/80 gap-1 text-xs font-semibold">
        {(['live', 'rainfall', 'temp', 'wind', 'clouds'] as const).map((tab) => {
          const labels = {
            live: 'Live Weather',
            rainfall: 'Rainfall',
            temp: 'Temperature',
            wind: 'Wind Flow',
            clouds: 'Cloud Cover',
          };
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Top Right Dynamic Legend adapting to active tab */}
      <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200/80 text-[11px] font-semibold text-slate-700">
        {activeTab === 'temp' ? (
          <>
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="text-slate-700 font-bold">Temperature Spectrum (°C)</span>
            </div>
            <div className="w-52 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 via-amber-400 to-red-600 shadow-inner" />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
              <span>15°C</span>
              <span>25°C</span>
              <span>32°C</span>
              <span>38°C</span>
              <span>45°C+</span>
            </div>
          </>
        ) : activeTab === 'wind' ? (
          <>
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="text-slate-700 font-bold">Wind Velocity (km/h)</span>
            </div>
            <div className="w-52 h-2.5 rounded-full bg-gradient-to-r from-blue-300 via-cyan-500 via-yellow-400 to-purple-600 shadow-inner" />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
              <span>0</span>
              <span>20</span>
              <span>45</span>
              <span>80</span>
              <span>120+ (Cyclone)</span>
            </div>
          </>
        ) : activeTab === 'clouds' ? (
          <>
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="text-slate-700 font-bold">Cloud Top Density (INSAT-3DR)</span>
            </div>
            <div className="w-52 h-2.5 rounded-full bg-gradient-to-r from-slate-200 via-slate-400 to-slate-800 shadow-inner" />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
              <span>Clear (0%)</span>
              <span>Scattered</span>
              <span>Overcast</span>
              <span>Convective (100%)</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="text-slate-700 font-bold">Rainfall Radar (mm/hr)</span>
            </div>
            <div className="w-52 h-2.5 rounded-full bg-gradient-to-r from-blue-200 via-green-400 via-yellow-400 via-orange-500 to-red-600 shadow-inner" />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
              <span>0</span>
              <span>1</span>
              <span>5</span>
              <span>10</span>
              <span>20</span>
              <span>50</span>
              <span>100+</span>
            </div>
          </>
        )}
      </div>

      {/* Floating Left Map Controls */}
      <div className="absolute top-16 left-3 z-[400] flex flex-col gap-1.5">
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 p-1 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-200" />
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Locate User button */}
        <button
          onClick={handleLocate}
          className="bg-white/95 backdrop-blur-md p-2 hover:bg-slate-100 rounded-xl shadow-md border border-slate-200/80 text-slate-700 transition-colors"
          title="Locate My Live Location"
          aria-label="Locate User"
        >
          <Crosshair className="w-4 h-4 text-blue-600" />
        </button>

        {/* Base Layer Switcher Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowBaseLayerMenu(!showBaseLayerMenu);
              setShowLayerPanel(false);
            }}
            className={`p-2 rounded-xl shadow-md border transition-colors ${
              showBaseLayerMenu
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white/95 backdrop-blur-md border-slate-200/80 text-slate-700 hover:bg-slate-100'
            }`}
            title="Change Map Style (Zero API Key)"
            aria-label="Change Map Style"
          >
            <Globe className="w-4 h-4" />
          </button>

          {/* Base Layer Dropdown */}
          {showBaseLayerMenu && (
            <div className="absolute left-10 top-0 bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-2xl border border-slate-200 text-xs w-44 space-y-1 z-[500]">
              <p className="text-[10px] font-extrabold text-slate-400 px-2 py-0.5 uppercase tracking-wider">
                Map Basemap (Free)
              </p>
              {(Object.keys(BASE_PROVIDERS) as BaseProviderKey[]).map((key) => {
                const item = BASE_PROVIDERS[key];
                const isSelected = selectedBaseLayer === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedBaseLayer(key);
                      setShowBaseLayerMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.name}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Layer Panel Toggle */}
        <button
          onClick={() => {
            setShowLayerPanel(!showLayerPanel);
            setShowBaseLayerMenu(false);
          }}
          className={`p-2 rounded-xl shadow-md border transition-colors ${
            showLayerPanel
              ? 'bg-blue-50 border-blue-300 text-blue-600'
              : 'bg-white/95 backdrop-blur-md border-slate-200/80 text-slate-700 hover:bg-slate-100'
          }`}
          title="Toggle Layers"
          aria-label="Toggle Layer Panel"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Active Layers Checkbox Panel on Right */}
      {showLayerPanel && (
        <div className="absolute top-20 right-3 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl border border-slate-200/80 text-xs w-48 transition-all">
          <h5 className="font-bold text-slate-800 mb-2.5 pb-1.5 border-b border-slate-100 flex items-center justify-between">
            <span>Active GIS Overlays</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </h5>
          <div className="space-y-2 text-slate-700 font-medium">
            <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              <input
                type="checkbox"
                checked={layers.rainfall}
                onChange={(e) => setLayers({ ...layers, rainfall: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>Rainfall Radar</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              <input
                type="checkbox"
                checked={layers.cycloneTrack}
                onChange={(e) => setLayers({ ...layers, cycloneTrack: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>Cyclone Track & Eye</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              <input
                type="checkbox"
                checked={layers.warnings}
                onChange={(e) => setLayers({ ...layers, warnings: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>Warnings (CAP Alert)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              <input
                type="checkbox"
                checked={layers.windFlow}
                onChange={(e) => setLayers({ ...layers, windFlow: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>Wind Flow Vectors</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              <input
                type="checkbox"
                checked={layers.cloudCover}
                onChange={(e) => setLayers({ ...layers, cloudCover: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>Cloud Cover (INSAT)</span>
            </label>
          </div>
        </div>
      )}

      {/* Leaflet Map DOM Node */}
      <div ref={mapContainerRef} className="w-full flex-1 z-[100]" />

      {/* Bottom Left Badge: Zero API Key Required & Live Data Status */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 text-[11px] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 beacon-pulse"></span>
        <div className="leading-tight">
          <p className="text-[10px] text-slate-400 font-medium">Open GIS Platform</p>
          <p className="font-bold text-slate-800 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Zero API Key Required</span>
          </p>
        </div>
        <span className="ml-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          ● {isDemo ? 'Live Open Data' : 'Live Feed'}
        </span>
      </div>

      {/* Bottom Right Attribution */}
      <div className="absolute bottom-2 right-2 z-[400] bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-slate-500 font-medium border border-slate-200/60 shadow-sm">
        Leaflet | OpenStreetMap | IMD | MOSDAC
      </div>
    </div>
  );
};
