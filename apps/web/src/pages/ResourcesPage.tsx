import React, { useState } from 'react';
import {
  FileCode,
  Download,
  Copy,
  Check,
  Search,
  BookOpen,
  Filter,
  ExternalLink,
  Shield,
  Layers,
  Radio,
  FileText,
  X,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { getTranslation } from '@/i18n/translations';

interface ResourceDoc {
  id: string;
  title: string;
  category: 'protocols' | 'alerts' | 'satellite' | 'sop';
  agency: string;
  version: string;
  format: 'JSON' | 'XML' | 'NetCDF' | 'HDF5' | 'GeoJSON';
  summary: string;
  description: string;
  lastUpdated: string;
  fields: { name: string; type: string; desc: string; sample: string }[];
  samplePayload: string;
  fileExtension: string;
}

const RESOURCE_DOCS: ResourceDoc[] = [
  {
    id: 'imd-aws-schema',
    title: 'IMD AWS Data Schema & API Guide',
    category: 'protocols',
    agency: 'India Meteorological Department (IMD)',
    version: 'v2.4.1',
    format: 'JSON',
    summary: 'Official protocol specs for Synoptic and Automatic Weather Stations (AWS/ARG) reporting hourly telemetry.',
    description:
      'Standardized telemetry transmission schema for Automatic Weather Stations (AWS) and Automatic Rain Gauges (ARG) deployed across 36 Indian meteorological sub-divisions. Governs surface observations including temperature, relative humidity, barometric pressure, wind vector, and hourly cumulative precipitation.',
    lastUpdated: 'August 2024',
    fileExtension: 'json',
    fields: [
      { name: 'station_id', type: 'string', desc: 'WMO / IMD 5-digit station code', sample: '"42182"' },
      { name: 'timestamp_utc', type: 'ISO-8601', desc: 'Universal observation timestamp', sample: '"2026-09-17T12:00:00Z"' },
      { name: 'temp_dry_bulb_c', type: 'float', desc: 'Air temperature at 1.5m height (°C)', sample: '32.4' },
      { name: 'temp_wet_bulb_c', type: 'float', desc: 'Wet-bulb psychrometric reading (°C)', sample: '27.1' },
      { name: 'humidity_percent', type: 'float', desc: 'Relative atmospheric humidity (%)', sample: '78.5' },
      { name: 'wind_dir_deg', type: 'integer', desc: 'Anemometer wind direction (0-360°)', sample: '135' },
      { name: 'wind_speed_kmh', type: 'float', desc: 'Surface sustained wind velocity (km/h)', sample: '18.2' },
      { name: 'rainfall_accum_mm', type: 'float', desc: 'Tipping-bucket cumulative rain (mm)', sample: '14.6' },
      { name: 'pressure_hpa', type: 'float', desc: 'Station level barometric pressure (hPa)', sample: '1004.2' },
      { name: 'battery_v', type: 'float', desc: 'Solar battery supply voltage (V DC)', sample: '12.6' },
    ],
    samplePayload: JSON.stringify(
      {
        header: {
          organization: 'India Meteorological Department',
          network: 'National Automatic Weather Station Network (NAWS)',
          schema_version: '2.4.1',
        },
        observation: {
          station_id: '42182',
          station_name: 'New Delhi (Safdarjung Observatory)',
          state: 'Delhi NCR',
          latitude: 28.5847,
          longitude: 77.2066,
          elevation_m: 216.0,
          timestamp_utc: '2026-09-17T12:00:00Z',
          sensors: {
            temp_dry_bulb_c: 32.4,
            temp_wet_bulb_c: 27.1,
            humidity_percent: 78.5,
            dew_point_c: 24.8,
            wind_speed_kmh: 18.2,
            wind_gust_kmh: 26.5,
            wind_direction_deg: 135,
            rainfall_1h_mm: 4.2,
            rainfall_24h_mm: 14.6,
            pressure_station_hpa: 1004.2,
            pressure_msl_hpa: 1011.8,
            solar_radiation_wm2: 642.0,
            uv_index: 6.2,
          },
          telemetry: {
            battery_voltage_v: 12.6,
            signal_rssi_dbm: -74,
            status: 'HEALTHY_CALIBRATED',
          },
        },
      },
      null,
      2
    ),
  },
  {
    id: 'oasis-cap-v12',
    title: 'OASIS Common Alerting Protocol (CAP-IN v1.2)',
    category: 'alerts',
    agency: 'National Disaster Management Authority (NDMA)',
    version: 'v1.2 (India Profile)',
    format: 'XML',
    summary: 'Standard XML/JSON schema for public safety disaster alerts and cellular broadcast dissemination.',
    description:
      'The Indian Profile of the OASIS Common Alerting Protocol (CAP-IN v1.2) is the designated standard for automated multi-hazard early warning dissemination in India. Implemented across NDMA, IMD, CWC, and INCOIS for public alerts via SMS, Cell Broadcast, Siren systems, and Internet dashboards.',
    lastUpdated: 'July 2024',
    fileExtension: 'xml',
    fields: [
      { name: 'identifier', type: 'string', desc: 'Globally unique alert ID string', sample: '"IN-NDMA-2026-09-CYC-004"' },
      { name: 'sender', type: 'string', desc: 'Authorized agency broadcast handle', sample: '"imd.alerts@imd.gov.in"' },
      { name: 'status', type: 'enum', desc: 'Actual | Exercise | System | Test', sample: '"Actual"' },
      { name: 'msgType', type: 'enum', desc: 'Alert | Update | Cancel | Ack', sample: '"Alert"' },
      { name: 'scope', type: 'enum', desc: 'Public | Restricted | Private', sample: '"Public"' },
      { name: 'info.category', type: 'enum', desc: 'Met | Geo | Safety | Rescue | Fire', sample: '"Met"' },
      { name: 'info.event', type: 'string', desc: 'Severe weather event category title', sample: '"Severe Cyclonic Storm"' },
      { name: 'info.urgency', type: 'enum', desc: 'Immediate | Expected | Future | Past', sample: '"Immediate"' },
      { name: 'info.severity', type: 'enum', desc: 'Extreme | Severe | Moderate | Minor', sample: '"Severe"' },
      { name: 'info.certainty', type: 'enum', desc: 'Observed | Likely | Possible | Unlikely', sample: '"Likely"' },
      { name: 'info.area.polygon', type: 'coordinates', desc: 'Geo-fencing bounding polygon (lat,lon)', sample: '"19.2,85.1 20.4,86.9..."' },
    ],
    samplePayload: `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>IN-NDMA-IMD-2026-CYC-082</identifier>
  <sender>imd.bulletin@imd.gov.in</sender>
  <sent>2026-09-17T12:00:00+05:30</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <code>CAP-IN-v1.2</code>
  <info>
    <language>en-IN</language>
    <category>Met</category>
    <event>Severe Cyclonic Storm Warning</event>
    <urgency>Immediate</urgency>
    <severity>Severe</severity>
    <certainty>Likely</certainty>
    <eventCode>
      <valueName>IMD_DISASTER_CODE</valueName>
      <value>CYC_SCS</value>
    </eventCode>
    <headline>Severe Cyclonic Storm Alert for Coastal Odisha and West Bengal</headline>
    <description>The severe cyclonic storm in the Bay of Bengal is advancing NW at 12 km/h. Gale winds of 110-130 km/h with heavy to very heavy rainfall expected across coastal belts.</description>
    <instruction>Fishermen advised not to venture into deep sea. Coastal residents in low-lying areas should relocate to cyclone shelters.</instruction>
    <area>
      <areaDesc>Coastal districts of Kendrapara, Jagatsinghpur, Balasore (Odisha) and Purba Medinipur, South 24 Parganas (West Bengal)</areaDesc>
      <polygon>19.82,85.81 20.91,86.92 21.65,87.52 22.10,88.20 21.30,88.90 19.82,85.81</polygon>
    </area>
  </info>
</alert>`,
  },
  {
    id: 'wmo-wis2-spec',
    title: 'WMO WIS2 Architecture & Global Exchange',
    category: 'protocols',
    agency: 'World Meteorological Organization (WMO)',
    version: 'WIS 2.0 Spec',
    format: 'JSON',
    summary: 'WMO Information System 2.0 data exchange standards using MQTT pub/sub and GeoJSON metadata.',
    description:
      'The World Meteorological Organization Information System 2.0 (WIS2) replaces GTS/GISC architectures with modern HTTP/3 and MQTT publish-subscribe brokers. It enables national meteorological and hydrological services (NMHS) like IMD to broadcast and ingest real-time synoptic observations and NWP model grids globally.',
    lastUpdated: 'June 2024',
    fileExtension: 'json',
    fields: [
      { name: 'wis2_version', type: 'string', desc: 'WIS2 notification engine version', sample: '"2.0"' },
      { name: 'topic', type: 'string', desc: 'Hierarchical topic (origin/format/data)', sample: '"origin/a/wis2/in-imd/data/core"' },
      { name: 'pubtime', type: 'ISO-8601', desc: 'Broker publishing timestamp', sample: '"2026-09-17T12:00:00Z"' },
      { name: 'id', type: 'UUID', desc: 'Unique record identifier', sample: '"urn:wmo:md:in-imd:nwp_gfs_0p25"' },
      { name: 'geometry', type: 'GeoJSON', desc: 'Spatial bounding box coverage', sample: '{"type":"Polygon",...}' },
    ],
    samplePayload: JSON.stringify(
      {
        wis2_version: '2.0',
        topic: 'origin/a/wis2/in-imd/data/core/weather/surface-based-observations/synop',
        pubtime: '2026-09-17T12:00:02Z',
        id: 'urn:wmo:md:in-imd:surface_synop_42182_202609171200',
        geometry: {
          type: 'Point',
          coordinates: [77.2066, 28.5847, 216.0],
        },
        properties: {
          data_id: 'in-imd-delhi-synop-20260917-1200',
          datetime: '2026-09-17T12:00:00Z',
          data_category: 'core',
          content: {
            encoding: 'base64',
            media_type: 'application/x-bufr',
            size_bytes: 4096,
          },
        },
        links: [
          {
            rel: 'canonical',
            type: 'application/x-bufr',
            href: 'https://wis2.imd.gov.in/data/synop/202609171200_42182.bufr4',
          },
        ],
      },
      null,
      2
    ),
  },
  {
    id: 'isro-mosdac-satellite',
    title: 'ISRO MOSDAC Satellite Ingestion Pipeline',
    category: 'satellite',
    agency: 'Space Applications Centre (ISRO / SAC)',
    version: 'MOSDAC v3.2',
    format: 'HDF5',
    summary: 'INSAT-3DR, INSAT-3DS and Oceansat sensor processing pipelines and thermal infrared radiance products.',
    description:
      'Technical specification for automated downlink and ingestion of geo-stationary meteorological payload streams from INSAT-3DR and INSAT-3DS satellites. Covers multispectral imager bands (Visible, Short Wave Infrared, Middle Infrared, Thermal Infrared-1, Thermal Infrared-2, Water Vapor) and atmospheric sounder vertical profiles.',
    lastUpdated: 'September 2024',
    fileExtension: 'json',
    fields: [
      { name: 'satellite_id', type: 'string', desc: 'Spacecraft mission identifier', sample: '"INSAT-3DR"' },
      { name: 'sensor_type', type: 'string', desc: 'Active sensor (IMAGER | SOUNDER)', sample: '"6-Channel Multispectral Imager"' },
      { name: 'product_code', type: 'string', desc: 'MOSDAC standard product code', sample: '"3RIMG_L1B_STD"' },
      { name: 'spatial_res_km', type: 'float', desc: 'Sub-satellite pixel footprint resolution', sample: '1.0' },
      { name: 'calibration', type: 'string', desc: 'On-board blackbody radiance calibration', sample: '"GSICS_CALIBRATED"' },
    ],
    samplePayload: JSON.stringify(
      {
        dataset_meta: {
          product_name: 'INSAT-3DR Multispectral Calibrated Radiance L1B',
          mission: 'ISRO INSAT-3DR',
          facility: 'MOSDAC Ahmedabad',
          projection: 'Geostationary Indian Sector (-49.5 to +49.5 deg)',
          center_longitude_deg: 74.0,
          capture_time_utc: '2026-09-17T12:00:00Z',
        },
        channels: [
          { name: 'VIS (Visible)', band_um: '0.55 - 0.75', resolution_km: 1.0, data_type: 'uint16' },
          { name: 'SWIR (Short-Wave IR)', band_um: '1.55 - 1.70', resolution_km: 1.0, data_type: 'uint16' },
          { name: 'MIR (Middle IR)', band_um: '3.80 - 4.00', resolution_km: 4.0, data_type: 'uint16' },
          { name: 'WV (Water Vapor)', band_um: '6.50 - 7.10', resolution_km: 8.0, data_type: 'uint16' },
          { name: 'TIR-1 (Thermal IR 1)', band_um: '10.2 - 11.3', resolution_km: 4.0, data_type: 'uint16' },
          { name: 'TIR-2 (Thermal IR 2)', band_um: '11.5 - 12.5', resolution_km: 4.0, data_type: 'uint16' },
        ],
        derived_geophysical_products: [
          'HEM (Hydro-Estimator Precipitation Rate)',
          'CMV (Cloud Motion Vectors)',
          'SST (Sea Surface Temperature)',
          'OLR (Outgoing Longwave Radiation)',
        ],
      },
      null,
      2
    ),
  },
  {
    id: 'ndma-cyclone-sop',
    title: 'NDMA Cyclone Early Warning & SOP v3.0',
    category: 'sop',
    agency: 'National Disaster Management Authority (NDMA)',
    version: 'SOP 2024 Edition',
    format: 'GeoJSON',
    summary: 'Standard Operating Procedure for 4-Stage Tropical Cyclone Warning, evacuation corridors and emergency relief.',
    description:
      'Operational guidelines issued by NDMA in coordination with the Cyclone Warning Division (IMD) for State Disaster Management Authorities (SDMAs). Details the structured 4-stage warning system: Pre-Cyclone Watch (72h), Cyclone Alert (48h), Cyclone Warning (24h), and Post-Landfall Outlook (12h).',
    lastUpdated: 'May 2024',
    fileExtension: 'json',
    fields: [
      { name: 'warning_stage', type: 'enum', desc: 'Watch (72h) | Alert (48h) | Warning (24h)', sample: '"Cyclone Warning (Stage 3)"' },
      { name: 'cyclone_name', type: 'string', desc: 'Official RSMC Tropical Cyclone Name', sample: '"Cyclone Dana"' },
      { name: 'estimated_central_pressure', type: 'integer', desc: 'Central core pressure (hPa)', sample: '978' },
      { name: 'max_sustained_wind_speed', type: 'integer', desc: '3-minute average wind speed (knots)', sample: '65' },
      { name: 'evacuation_protocol', type: 'string', desc: 'State emergency mobilization grade', sample: '"RED_STAGE_MANDATORY_EVACUATION"' },
    ],
    samplePayload: JSON.stringify(
      {
        sop_standard: 'NDMA / IMD 4-Stage Cyclone Alerting Matrix',
        protocol_level: 'STAGE_3_CYCLONE_WARNING',
        lead_time_hours: 24,
        operational_directives: {
          stage_1_pre_cyclone_watch: {
            lead_time: '72 Hours prior to inception',
            issuing_authority: 'IMD RSMC New Delhi',
            actions: ['National Crisis Management Committee (NCMC) review', 'State control rooms activated'],
          },
          stage_2_cyclone_alert: {
            lead_time: '48 Hours prior to landfall',
            actions: ['Fishermen advisories broadcasted', 'NDRF search & rescue battalions prepositioned'],
          },
          stage_3_cyclone_warning: {
            lead_time: '24 Hours prior to landfall',
            actions: [
              'Mandatory evacuation within 5km coastal buffer',
              'Ports hoist Danger Signal 8/9/10',
              'Power grids and telecom base stations secured',
            ],
          },
          stage_4_post_landfall_outlook: {
            lead_time: '12 Hours prior to landfall until depression phase',
            actions: ['Inland flooding response', 'Road clearance and restoration teams active'],
          },
        },
      },
      null,
      2
    ),
  },
  {
    id: 'imd-dwr-netcdf',
    title: 'Indian Doppler Weather Radar (DWR) NetCDF Spec',
    category: 'satellite',
    agency: 'IMD Radar Operations Division',
    version: 'CF-Radial 2.0',
    format: 'NetCDF',
    summary: 'S-Band and C-Band radar radial velocity, reflectivity (dBZ) and polarimetric nowcast standards.',
    description:
      'Standardized binary encoding format for raw and gridded radar moments produced by IMD S-Band and C-Band Doppler Weather Radars deployed across Delhi, Mumbai, Chennai, Kolkata, Visakhapatnam, Paradip, and Patna. Used for storm cell tracking, microburst detection, and quantitative precipitation estimation (QPE).',
    lastUpdated: 'July 2024',
    fileExtension: 'json',
    fields: [
      { name: 'site_id', type: 'string', desc: 'Radar station 4-letter identifier', sample: '"VDEL"' },
      { name: 'frequency_ghz', type: 'float', desc: 'Radar transmitter carrier frequency (GHz)', sample: '2.85' },
      { name: 'beamwidth_deg', type: 'float', desc: '3dB conical beamwidth (degrees)', sample: '0.98' },
      { name: 'sweep_mode', type: 'enum', desc: 'PPI (Plan Position) | RHI (Range Height)', sample: '"azimuth_surveillance"' },
      { name: 'reflectivity_var', type: 'string', desc: 'CF variable for equivalent reflectivity factor', sample: '"DBZ"' },
      { name: 'radial_velocity_var', type: 'string', desc: 'CF variable for Doppler velocity (m/s)', sample: '"VR"' },
    ],
    samplePayload: JSON.stringify(
      {
        conventions: 'CF-Radial-2.0 / WMO-Radar',
        station_information: {
          station_name: 'DWR New Delhi (Mausam Bhavan)',
          callsign: 'VDEL',
          frequency_band: 'S-Band (2.85 GHz)',
          latitude: 28.588,
          longitude: 77.221,
          altitude_above_msl_m: 232.0,
        },
        sweep_data: {
          elevation_angles_deg: [0.5, 1.5, 2.5, 4.0, 6.0, 9.0, 14.0, 21.0],
          range_resolution_m: 250,
          max_unambiguous_range_km: 250,
          nyquist_velocity_mps: 34.5,
          moment_fields: {
            DBZ: 'Equivalent radar reflectivity factor (dBZ)',
            VR: 'Radial Doppler velocity (m/s)',
            WR: 'Doppler spectrum width (m/s)',
            ZDR: 'Differential reflectivity (dB) for hydrometeor classification',
            RHOHV: 'Copolar correlation coefficient',
            KDP: 'Specific differential phase (deg/km)',
          },
        },
      },
      null,
      2
    ),
  },
];

interface ResourcesPageProps {
  selectedLanguage?: string;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ selectedLanguage = 'en' }) => {
  const t = getTranslation(selectedLanguage);
  const [activeFilter, setActiveFilter] = useState<'all' | 'protocols' | 'alerts' | 'satellite' | 'sop'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<ResourceDoc | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  const filterOptions = [
    { id: 'all', label: t.res_filter_all },
    { id: 'protocols', label: t.res_filter_protocols },
    { id: 'alerts', label: t.res_filter_alerts },
    { id: 'satellite', label: t.res_filter_satellite },
    { id: 'sop', label: t.res_filter_sop },
  ];

  const filteredDocs = RESOURCE_DOCS.filter((doc) => {
    const matchesFilter = activeFilter === 'all' || doc.category === activeFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      doc.title.toLowerCase().includes(query) ||
      doc.agency.toLowerCase().includes(query) ||
      doc.summary.toLowerCase().includes(query) ||
      doc.format.toLowerCase().includes(query) ||
      doc.version.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });

  const handleCopy = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopyToast(`${label} copied to clipboard!`);
    setTimeout(() => {
      setCopiedId(null);
      setCopyToast(null);
    }, 2500);
  };

  const handleDownload = (doc: ResourceDoc) => {
    const mimeType = doc.format === 'XML' ? 'application/xml' : 'application/json';
    const blob = new Blob([doc.samplePayload], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.id}-sample.${doc.fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'protocols':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800';
      case 'alerts':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800';
      case 'satellite':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800';
      case 'sop':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {copyToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold border border-slate-700 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                <BookOpen className="w-5 h-5" />
              </span>
              <h1 className="text-xl lg:text-2xl font-black text-[#0f2942] dark:text-slate-100 tracking-tight">
                {t.res_title}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {t.res_subtitle}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{RESOURCE_DOCS.length} Certified Specifications Available</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setActiveFilter(opt.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === opt.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.res_search_placeholder}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Card Top Meta */}
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border uppercase ${getCategoryBadgeClass(doc.category)}`}>
                  {doc.category}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
                  {doc.format} • {doc.version}
                </span>
              </div>

              {/* Title & Agency */}
              <div>
                <h3 className="text-sm font-extrabold text-[#0f2942] dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {doc.title}
                </h3>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                  {doc.agency}
                </p>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {doc.summary}
              </p>

              {/* Key fields preview tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {doc.fields.slice(0, 4).map((f) => (
                  <span
                    key={f.name}
                    className="text-[10px] font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded"
                  >
                    {f.name}
                  </span>
                ))}
                {doc.fields.length > 4 && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium px-1 py-0.5">
                    +{doc.fields.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedDoc(doc)}
                className="flex-1 px-3 py-2 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t.res_view_spec}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopy(doc.samplePayload, doc.id, doc.title)}
                title={t.res_copy_schema}
                className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                {copiedId === doc.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleDownload(doc)}
                title={t.res_download_sample}
                className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-700 dark:text-slate-300">No specifications found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search query or filter tags.</p>
        </div>
      )}

      {/* Document Specification Modal Viewer */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border uppercase ${getCategoryBadgeClass(selectedDoc.category)}`}>
                    {selectedDoc.category}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    {selectedDoc.format} • {selectedDoc.version}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Updated: {selectedDoc.lastUpdated}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-[#0f2942] dark:text-slate-100">
                  {selectedDoc.title}
                </h2>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                  Authoritative Body: {selectedDoc.agency}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
              {/* Detailed Overview */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Operational Description & Scope
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80">
                  {selectedDoc.description}
                </p>
              </div>

              {/* Data Schema Dictionary Table */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Schema Fields Dictionary ({selectedDoc.fields.length} Parameters)
                </h4>
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-[11px] border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">Field Name</th>
                        <th className="p-3">Data Type</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Sample Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {selectedDoc.fields.map((field) => (
                        <tr key={field.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {field.name}
                          </td>
                          <td className="p-3 font-mono text-slate-500 dark:text-slate-400">
                            {field.type}
                          </td>
                          <td className="p-3 text-slate-700 dark:text-slate-300">
                            {field.desc}
                          </td>
                          <td className="p-3 font-mono text-slate-500 dark:text-slate-400">
                            {field.sample}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sample Payload Code Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Authoritative Transmission Sample Payload ({selectedDoc.format})
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedDoc.samplePayload, selectedDoc.id, 'Payload')}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    {copiedId === selectedDoc.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{t.res_copy_schema}</span>
                  </button>
                </div>

                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-72">
                  <pre>{selectedDoc.samplePayload}</pre>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors"
              >
                {t.res_close}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(selectedDoc.samplePayload, selectedDoc.id, 'Schema')}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.res_copy_schema}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(selectedDoc)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.res_download_sample}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
