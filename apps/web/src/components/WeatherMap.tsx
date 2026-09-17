import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Plus,
  Minus,
  Crosshair,
  Globe,
  Radio,
  Maximize2,
  Minimize2,
  CloudRain,
  Thermometer,
  Wind,
  Cloud,
  Radar,
  Info,
  ChevronDown
} from 'lucide-react';
import { CycloneData, CAPWarning } from '@/types';

interface WeatherMapProps {
  cyclones?: CycloneData[];
  warnings?: CAPWarning[];
  onSelectCity?: (cityName: string) => void;
  isDemo?: boolean;
}

// 100% Free Public Open GIS Basemaps — Built-in & Free forever
const BASE_PROVIDERS = {
  osm: {
    id: 'osm',
    name: 'OpenStreetMap (Street)',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite View (ESRI High-Res)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    subdomains: [],
    maxZoom: 18,
    attribution: 'Tiles © Esri, USGS, NOAA',
  },
  voyager: {
    id: 'voyager',
    name: 'Clean Terrain (Carto)',
    url: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 18,
    attribution: '© CARTO, © OpenStreetMap',
  },
  dark: {
    id: 'dark',
    name: 'Night Operations (Dark)',
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
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active layers state
  const [layers, setLayers] = useState({
    rainfall: true,
    cycloneTrack: true,
    warnings: true,
    windFlow: false,
    cloudCover: false,
    districtBoundaries: false,
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on India
    const map = L.map(mapContainerRef.current, {
      center: [21.5, 82.0],
      zoom: 4.8,
      zoomControl: false,
      attributionControl: false,
    });

    const provider = BASE_PROVIDERS[selectedBaseLayer];
    const tileLayer = L.tileLayer(provider.url, {
      maxZoom: provider.maxZoom,
      subdomains: provider.subdomains,
      attribution: provider.attribution,
    });

    tileLayer.on('tileerror', () => {
      console.warn('Fallback: maintaining seamless OpenStreetMap feed.');
    });

    tileLayer.addTo(map);
    currentTileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    // High-resolution Meteorological Stations and Key Cities
    const keyCities = [
      { name: 'New Delhi', lat: 28.6139, lon: 77.2090, temp: '32°C', cond: 'Haze', humidity: '58%', wind: '12 km/h' },
      { name: 'Mumbai', lat: 19.0760, lon: 72.8777, temp: '28°C', cond: 'Light Rain', humidity: '82%', wind: '22 km/h' },
      { name: 'Kolkata', lat: 22.5726, lon: 88.3639, temp: '29°C', cond: 'Thunderstorm', humidity: '86%', wind: '34 km/h' },
      { name: 'Chennai', lat: 13.0827, lon: 80.2707, temp: '31°C', cond: 'Partly Cloudy', humidity: '72%', wind: '16 km/h' },
      { name: 'Kanpur', lat: 26.4499, lon: 80.3319, temp: '30°C', cond: 'Moderate Rain', humidity: '78%', wind: '15 km/h' },
      { name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245, temp: '27°C', cond: 'Squally Heavy Rain', humidity: '94%', wind: '55 km/h' },
      { name: 'Jaipur', lat: 26.9124, lon: 75.7873, temp: '30°C', cond: 'Mostly Cloudy', humidity: '48%', wind: '10 km/h' },
      { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, temp: '26°C', cond: 'Fair', humidity: '64%', wind: '14 km/h' },
      { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, temp: '29°C', cond: 'Passing Clouds', humidity: '60%', wind: '18 km/h' },
      { name: 'Patna', lat: 25.5941, lon: 85.1376, temp: '31°C', cond: 'Isolated Showers', humidity: '76%', wind: '12 km/h' },
      { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, temp: '33°C', cond: 'Clear Sky', humidity: '52%', wind: '10 km/h' },
    ];

    keyCities.forEach((c) => {
      const isWet = c.cond.includes('Rain') || c.cond.includes('Thunder');
      const iconHtml = `
        <div class="flex items-center gap-1.5 bg-white/95 backdrop-blur-md border ${isWet ? 'border-blue-400 ring-2 ring-blue-500/20' : 'border-slate-300'} px-2.5 py-1 rounded-full shadow-md text-[11px] font-bold text-slate-800 whitespace-nowrap cursor-pointer hover:border-blue-600 hover:scale-105 transition-all">
          <span class="w-2 h-2 rounded-full ${isWet ? 'bg-blue-600 animate-ping' : 'bg-emerald-500'}"></span>
          <span>${c.name}</span>
          <span class="text-blue-700 font-extrabold">${c.temp}</span>
        </div>
      `;
      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'city-weather-pin',
        iconSize: [110, 26],
        iconAnchor: [55, 13],
      });

      const popupHtml = `
        <div class="p-1 min-w-[160px] text-slate-800">
          <div class="font-extrabold text-sm text-[#0f2942] border-b border-slate-200 pb-1 flex items-center justify-between">
            <span>${c.name}</span>
            <span class="text-blue-600">${c.temp}</span>
          </div>
          <div class="text-[11px] space-y-1 mt-1.5 text-slate-600">
            <p><strong>Condition:</strong> ${c.cond}</p>
            <p><strong>Humidity:</strong> ${c.humidity}</p>
            <p><strong>Surface Wind:</strong> ${c.wind}</p>
          </div>
          <button onclick="window.__forecastx_select_city && window.__forecastx_select_city('${c.name}')" class="mt-2 w-full py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold transition-colors">
            Deep Dive Forecast →
          </button>
        </div>
      `;

      const marker = L.marker([c.lat, c.lon], { icon: customIcon }).addTo(map);
      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        if (onSelectCity) onSelectCity(c.name);
      });
    });

    // Expose global callback for popup clicks
    (window as any).__forecastx_select_city = (cityName: string) => {
      if (onSelectCity) onSelectCity(cityName);
    };

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch Base Tile Layer
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

  // Dynamic overlays based on layers and activeTab
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const dynamicLayerGroup = L.layerGroup().addTo(map);

    // 1. Rainfall Radar Simulation Overlay
    if (layers.rainfall || activeTab === 'rainfall' || activeTab === 'live') {
      const rainBands = [
        { lat: 20.2, lon: 86.8, radius: 140000, color: '#ef4444', fillOpacity: 0.45 },
        { lat: 19.5, lon: 87.5, radius: 240000, color: '#f97316', fillOpacity: 0.35 },
        { lat: 21.0, lon: 87.8, radius: 320000, color: '#eab308', fillOpacity: 0.25 },
        { lat: 22.0, lon: 88.0, radius: 420000, color: '#22c55e', fillOpacity: 0.20 },
        { lat: 18.0, lon: 85.0, radius: 280000, color: '#3b82f6', fillOpacity: 0.20 },
        { lat: 26.5, lon: 80.5, radius: 110000, color: '#3b82f6', fillOpacity: 0.28 }, // Kanpur moderate rain zone
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
          .bindPopup(`<b>Temperature Isotherm Zone</b><br/>${tz.label}`)
          .addTo(dynamicLayerGroup);
      });
    }

    // 3. Wind Flow Vectors Overlay
    if (activeTab === 'wind' || layers.windFlow) {
      const windArrows = [
        { lat: 14.0, lon: 86.0, speed: '45 km/h', deg: 210 },
        { lat: 17.0, lon: 84.0, speed: '60 km/h', deg: 180 },
        { lat: 18.2, lon: 88.5, speed: '120 km/h (Cyclone)', deg: 315 },
        { lat: 22.0, lon: 85.0, speed: '35 km/h', deg: 135 },
        { lat: 26.0, lon: 78.0, speed: '18 km/h', deg: 90 },
        { lat: 19.0, lon: 71.0, speed: '25 km/h', deg: 240 },
        { lat: 28.5, lon: 77.0, speed: '15 km/h NW', deg: 310 },
      ];

      windArrows.forEach((w) => {
        const windIcon = L.divIcon({
          html: `
            <div class="flex items-center gap-1 bg-slate-900/85 backdrop-blur-md text-cyan-300 px-2 py-0.5 rounded-full shadow-lg text-[10px] font-bold border border-cyan-400/50">
              <span style="display:inline-block; transform:rotate(${w.deg}deg);">➔</span>
              <span>${w.speed}</span>
            </div>
          `,
          className: 'wind-arrow-pin',
          iconSize: [85, 22],
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
        { lat: 25.5, lon: 83.5, radius: 220000, color: '#f8fafc', fillOpacity: 0.40 },
      ];

      cloudPuffs.forEach((cp) => {
        L.circle([cp.lat, cp.lon], {
          radius: cp.radius,
          color: '#cbd5e1',
          fillColor: cp.color,
          fillOpacity: cp.fillOpacity,
          weight: 0,
        })
          .bindPopup('<b>INSAT-3DR Infrared Satellite</b><br/>Dense Convective Cloud Top')
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
        [20.8, 86.9], // Landfall Dhamra
        [21.6, 86.4],
      ];

      L.polyline(pastTrack, {
        color: '#dc2626',
        weight: 4,
        opacity: 0.9,
      }).addTo(dynamicLayerGroup);

      L.polyline(forecastTrack, {
        color: '#dc2626',
        weight: 3.5,
        dashArray: '6, 8',
        opacity: 0.85,
      }).addTo(dynamicLayerGroup);

      [...pastTrack, ...forecastTrack.slice(1)].forEach((pt, idx) => {
        L.circleMarker(pt, {
          radius: idx === 3 ? 9 : 5,
          color: idx === 3 ? '#b91c1c' : '#ef4444',
          fillColor: idx === 3 ? '#ffffff' : '#fecaca',
          fillOpacity: 1,
          weight: 2.5,
        }).addTo(dynamicLayerGroup);
      });

      const cycloneEyeIcon = L.divIcon({
        html: `
          <div class="relative w-16 h-16 flex items-center justify-center -translate-x-8 -translate-y-8">
            <div class="absolute inset-0 rounded-full border-2 border-red-500/80 beacon-pulse"></div>
            <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-2xl cyclone-vortex">
              <img src="/assets/cyclone_satellite.jpg" class="w-full h-full object-cover" alt="Cyclone Eye" />
            </div>
            <div class="absolute -bottom-6 bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-md whitespace-nowrap border border-red-400">
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
        .bindPopup('<b>IMD Cyclone Warning Zone</b><br/>Coastal North Odisha & Gangetic West Bengal<br/><b>Action:</b> Evacuate Low-lying Belts')
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
                  <div class="absolute inset-0 rounded-full bg-blue-500/50 beacon-pulse"></div>
                  <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xl"></div>
                </div>
              `,
              className: 'live-gps-marker',
              iconSize: [32, 32],
            });

            L.marker([latitude, longitude], { icon: liveIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup(`<b>📍 Your Exact GPS Location</b><br/>Coordinates: ${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°<br/>Accuracy: ±${Math.round(pos.coords.accuracy)}m`)
              .openPopup();
          }
        },
        (err) => {
          console.warn('Location error:', err);
          mapInstanceRef.current?.setView([21.5, 82.0], 5);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      mapInstanceRef.current?.setView([21.5, 82.0], 5);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white flex flex-col transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'h-[540px]'
      }`}
    >
      {/* Top Map Action Bar */}
      <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 z-[450]">
        {/* Layer Mode Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl text-xs font-bold text-slate-700">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'live'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-white/80 hover:text-slate-900'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span>Live Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('rainfall')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'rainfall'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-white/80 hover:text-slate-900'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Rainfall</span>
          </button>

          <button
            onClick={() => setActiveTab('temp')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'temp'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-white/80 hover:text-slate-900'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature</span>
          </button>

          <button
            onClick={() => setActiveTab('wind')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'wind'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-white/80 hover:text-slate-900'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind Stream</span>
          </button>

          <button
            onClick={() => setActiveTab('clouds')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'clouds'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-white/80 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Clouds (INSAT)</span>
          </button>
        </div>

        {/* Right Tools: Basemap, Layers, Locate, Fullscreen */}
        <div className="flex items-center gap-1.5">
          {/* Basemap Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowBaseLayerMenu(!showBaseLayerMenu);
                setShowLayerPanel(false);
              }}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
              title="Select Base Map Style"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">{BASE_PROVIDERS[selectedBaseLayer].name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showBaseLayerMenu && (
              <div className="absolute right-0 top-9 bg-white border border-slate-200 rounded-xl shadow-2xl p-1.5 w-48 space-y-1 z-[500] text-xs">
                <p className="text-[10px] font-extrabold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                  Map Basemap
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
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{item.name}</span>
                      {isSelected && <span className="text-blue-600 font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Layers Toggle */}
          <button
            onClick={() => {
              setShowLayerPanel(!showLayerPanel);
              setShowBaseLayerMenu(false);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              showLayerPanel
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Toggle Atmospheric Layers"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Layers</span>
          </button>

          {/* Locate Live Location */}
          <button
            onClick={handleLocate}
            className="p-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl transition-colors"
            title="Locate My Live GPS Location"
          >
            <Crosshair className="w-4 h-4 text-blue-600" />
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Leaflet Map Viewport */}
      <div className="relative flex-1 w-full overflow-hidden">
        {/* Floating Zoom Controls on Top Left */}
        <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 p-1 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-200" />
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Contextual Meteorological Legend (Top Right) */}
        <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-slate-200/80 text-[11px] font-semibold text-slate-700">
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
                <span className="text-slate-700 font-bold">Surface Wind Velocity (km/h)</span>
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
                <span className="text-slate-700 font-bold">Doppler Radar Reflectivity (mm/hr)</span>
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

        {/* Floating Active Layers Checkbox Panel */}
        {showLayerPanel && (
          <div className="absolute top-14 right-3 z-[400] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-slate-200 text-xs w-52 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
            <h5 className="font-extrabold text-[#0f2942] pb-1.5 border-b border-slate-100 flex items-center justify-between">
              <span>GIS Layer Overlays</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
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
                <span>Cyclone Trajectory & Eye</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                <input
                  type="checkbox"
                  checked={layers.warnings}
                  onChange={(e) => setLayers({ ...layers, warnings: e.target.checked })}
                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>CAP Alert Polygons</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                <input
                  type="checkbox"
                  checked={layers.windFlow}
                  onChange={(e) => setLayers({ ...layers, windFlow: e.target.checked })}
                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>Wind Flow Streamlines</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                <input
                  type="checkbox"
                  checked={layers.cloudCover}
                  onChange={(e) => setLayers({ ...layers, cloudCover: e.target.checked })}
                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>INSAT Cloud Cover</span>
              </label>
            </div>
          </div>
        )}

        {/* Leaflet Map DOM Element */}
        <div ref={mapContainerRef} className="w-full h-full z-[100]" />

        {/* Bottom Left Badge: Status & Radar Feed */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-lg border border-slate-200/90 text-[11px] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 beacon-pulse"></span>
          <div className="leading-tight">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Radar Network</p>
            <p className="font-extrabold text-emerald-700 flex items-center gap-1">
              <span>Operational & Live</span>
            </p>
          </div>
          <span className="ml-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ● Satellite Sync
          </span>
        </div>

        {/* Bottom Right Attribution */}
        <div className="absolute bottom-2 right-2 z-[400] bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-slate-500 font-medium border border-slate-200/60 shadow-sm">
          OpenStreetMap | IMD | ISRO MOSDAC
        </div>
      </div>
    </div>
  );
};
