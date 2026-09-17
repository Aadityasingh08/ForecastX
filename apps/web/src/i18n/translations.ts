export interface TranslationDict {
  // Brand
  brand_tagline: string;
  live_badge: string;
  detecting_gps: string;
  search_placeholder: string;
  sign_in: string;
  sign_out: string;
  user_portal: string;

  // Sidebar
  nav_dashboard: string;
  nav_live_map: string;
  nav_search: string;
  nav_warnings: string;
  nav_cyclones: string;
  nav_rainfall: string;
  nav_agri: string;
  nav_marine: string;
  nav_aviation: string;
  nav_climate: string;
  nav_resources: string;
  nav_settings: string;
  nav_admin: string;

  // Dashboard
  view_more_cities: string;
  interactive_map_title: string;
  active_warnings_title: string;
  view_all_warnings: string;
  cyclone_tracking_title: string;
  view_details: string;
  quick_access_title: string;

  // Map Tabs
  map_live_radar: string;
  map_rainfall: string;
  map_temperature: string;
  map_wind: string;
  map_clouds: string;
  map_layers: string;
  map_locate: string;
  map_status_live: string;

  // Chat
  ask_forecastx: string;
  chat_subtitle: string;
  try_asking: string;
  chat_input_placeholder: string;
  chat_listening: string;
  chat_voice: string;
  chat_upload_image: string;
  authoritative_sources: string;

  // Quick Access Cards
  qa_agri_title: string;
  qa_agri_desc: string;
  qa_marine_title: string;
  qa_marine_desc: string;
  qa_aviation_title: string;
  qa_aviation_desc: string;
  qa_climate_title: string;
  qa_climate_desc: string;

  // Resources Page
  res_title: string;
  res_subtitle: string;
  res_search_placeholder: string;
  res_filter_all: string;
  res_filter_protocols: string;
  res_filter_alerts: string;
  res_filter_satellite: string;
  res_filter_sop: string;
  res_view_spec: string;
  res_download_sample: string;
  res_copy_schema: string;
  res_close: string;

  // Footer
  footer_powered_by: string;
  footer_mission: string;
  footer_made_by: string;

  // Theme
  theme_light: string;
  theme_dark: string;
}

export const TRANSLATIONS: Record<string, TranslationDict> = {
  en: {
    brand_tagline: 'Conversational Weather Intelligence for a Safer India',
    live_badge: 'Live',
    detecting_gps: 'Detecting GPS...',
    search_placeholder: 'Search city, district or ask a weather question...',
    sign_in: 'Sign In',
    sign_out: 'Sign Out',
    user_portal: 'User Portal',

    nav_dashboard: 'Dashboard',
    nav_live_map: 'Live Map',
    nav_search: 'Weather Search',
    nav_warnings: 'Warnings & Alerts',
    nav_cyclones: 'Cyclones',
    nav_rainfall: 'Rainfall & Nowcast',
    nav_agri: 'Agri Advisory',
    nav_marine: 'Marine & Coastal',
    nav_aviation: 'Aviation',
    nav_climate: 'Climate & Analysis',
    nav_resources: 'Resources & Specs',
    nav_settings: 'Settings',
    nav_admin: 'Admin & Feeds',

    view_more_cities: 'View More Cities',
    interactive_map_title: 'India Interactive Weather Radar',
    active_warnings_title: 'Active Warnings',
    view_all_warnings: 'View All',
    cyclone_tracking_title: 'Cyclone Tracking',
    view_details: 'View Details',
    quick_access_title: 'Quick Access',

    map_live_radar: 'Live Radar',
    map_rainfall: 'Rainfall',
    map_temperature: 'Temperature',
    map_wind: 'Wind Stream',
    map_clouds: 'Clouds (INSAT)',
    map_layers: 'Layers',
    map_locate: 'Locate Me',
    map_status_live: 'Radar Network: Operational & Live',

    ask_forecastx: 'Ask ForecastX',
    chat_subtitle: 'Your AI assistant for trusted weather information',
    try_asking: 'Try asking:',
    chat_input_placeholder: 'Type your question...',
    chat_listening: 'Listening...',
    chat_voice: 'Voice',
    chat_upload_image: 'Upload Image',
    authoritative_sources: 'Authoritative Sources',

    qa_agri_title: 'Agri Advisory',
    qa_agri_desc: 'Crop-specific guidance & spray alerts',
    qa_marine_title: 'Marine Forecast',
    qa_marine_desc: 'Coastal & ocean alert advisories',
    qa_aviation_title: 'Aviation Weather',
    qa_aviation_desc: 'Airport forecasts & METAR reports',
    qa_climate_title: 'Climate Insights',
    qa_climate_desc: 'Trends & historical anomaly data',

    res_title: 'Meteorological Reference Documents & Specifications',
    res_subtitle: 'Official schemas, public safety protocols, XML/JSON schemas and satellite manuals',
    res_search_placeholder: 'Filter documents by name or keyword...',
    res_filter_all: 'All Documents',
    res_filter_protocols: 'APIs & Schemas',
    res_filter_alerts: 'CAP Alerts',
    res_filter_satellite: 'Satellite & Radar',
    res_filter_sop: 'Disaster SOPs',
    res_view_spec: 'View Full Spec',
    res_download_sample: 'Download Sample File',
    res_copy_schema: 'Copy Schema',
    res_close: 'Close',

    footer_powered_by: 'Powered by IMD • ISRO MOSDAC • WMO • ECMWF • NOAA',
    footer_mission: 'Made for a Safer, Resilient India',
    footer_made_by: 'Made by Aditya Singh',

    theme_light: 'Light Mode',
    theme_dark: 'Dark Mode',
  },

  hi: {
    brand_tagline: 'सुरक्षित भारत के लिए संवादात्मक मौसम आसूचना',
    live_badge: 'लाइव',
    detecting_gps: 'जीपीएस पता लगा रहे हैं...',
    search_placeholder: 'शहर, जिला खोजें या मौसम संबंधी प्रश्न पूछें...',
    sign_in: 'साइन इन करें',
    sign_out: 'साइन आउट',
    user_portal: 'यूज़र पोर्टल',

    nav_dashboard: 'डैशबोर्ड',
    nav_live_map: 'लाइव मौसम मैप',
    nav_search: 'मौसम खोज',
    nav_warnings: 'चेतावनियाँ और अलर्ट',
    nav_cyclones: 'चक्रवात ट्रैकिंग',
    nav_rainfall: 'वर्षा और नाउकास्ट',
    nav_agri: 'कृषि मौसम सलाह',
    nav_marine: 'समुद्री व तटीय मौसम',
    nav_aviation: 'विमानन मौसम',
    nav_climate: 'जलवायु और विश्लेषण',
    nav_resources: 'संसाधन व दस्तावेज़',
    nav_settings: 'सेटिंग्स',
    nav_admin: 'एडमिन और डेटा फीड्स',

    view_more_cities: 'अधिक शहर देखें',
    interactive_map_title: 'भारत इंटरएक्टिव वेदर राडार',
    active_warnings_title: 'सक्रिय मौसम चेतावनियाँ',
    view_all_warnings: 'सभी देखें',
    cyclone_tracking_title: 'चक्रवात ट्रैकिंग',
    view_details: 'विवरण देखें',
    quick_access_title: 'त्वरित सेवाएं',

    map_live_radar: 'लाइव राडार',
    map_rainfall: 'वर्षा राडार',
    map_temperature: 'तापमान',
    map_wind: 'हवा की गति',
    map_clouds: 'बादल (इनसेट)',
    map_layers: 'लेयर्स',
    map_locate: 'मेरी लोकेशन',
    map_status_live: 'राडार नेटवर्क: लाइव और सक्रिय',

    ask_forecastx: 'पूछें ForecastX से',
    chat_subtitle: 'मौसम की विश्वसनीय जानकारी के लिए आपका एआई सहायक',
    try_asking: 'ये पूछ कर देखें:',
    chat_input_placeholder: 'अपना सवाल यहाँ टाइप करें...',
    chat_listening: 'सुन रहे हैं...',
    chat_voice: 'आवाज से पूछें',
    chat_upload_image: 'इमेज अपलोड करें',
    authoritative_sources: 'आधिकारिक स्रोत',

    qa_agri_title: 'कृषि सलाह',
    qa_agri_desc: 'फसल विशेष मार्गदर्शन व छिड़काव अलर्ट',
    qa_marine_title: 'समुद्री मौसम',
    qa_marine_desc: 'तटीय व गहरे समुद्र की चेतावनी',
    qa_aviation_title: 'विमानन मौसम',
    qa_aviation_desc: 'हवाई अड्डा पूर्वानुमान और METAR',
    qa_climate_title: 'जलवायु विश्लेषण',
    qa_climate_desc: 'ऐतिहासिक विसंगतियां व रुझान',

    res_title: 'मौसम विज्ञान संदर्भ दस्तावेज़ और विनिर्देश',
    res_subtitle: 'आधिकारिक स्कीमा, सार्वजनिक सुरक्षा प्रोटोकॉल और उपग्रह डेटा मैनुअल',
    res_search_placeholder: 'दस्तावेज़ खोजें...',
    res_filter_all: 'सभी दस्तावेज़',
    res_filter_protocols: 'एपीआई और स्कीमा',
    res_filter_alerts: 'सीएपी अलर्ट्स',
    res_filter_satellite: 'सैटेलाइट व राडार',
    res_filter_sop: 'आपदा प्रबंधन एसओपी',
    res_view_spec: 'पूर्ण विनिर्देश देखें',
    res_download_sample: 'सैंपल डाउनलोड करें',
    res_copy_schema: 'स्कीमा कॉपी करें',
    res_close: 'बंद करें',

    footer_powered_by: 'आईएमडी • इसरो मोसडैक • डब्ल्यूएमओ • ईसीएमडब्ल्यूएफ द्वारा संचालित',
    footer_mission: 'सुरक्षित और सशक्त भारत के लिए निर्मित',
    footer_made_by: 'निर्माता: आदित्य सिंह',

    theme_light: 'लाइट मोड',
    theme_dark: 'डार्क मोड',
  },

  bn: {
    brand_tagline: 'একটি নিরাপদ ভারতের জন্য আবহাওয়া বুদ্ধিমত্তা',
    live_badge: 'লাইভ',
    detecting_gps: 'জিপিএস শনাক্ত হচ্ছে...',
    search_placeholder: 'শহর খুঁজুন বা আবহাওয়া প্রশ্ন করুন...',
    sign_in: 'সাইন ইন',
    sign_out: 'সাইন আউট',
    user_portal: 'ইউজার পোর্টাল',

    nav_dashboard: 'ড্যাশবোর্ড',
    nav_live_map: 'লাইভ মানচিত্র',
    nav_search: 'আবহাওয়া অনুসন্ধান',
    nav_warnings: 'সতর্কতা ও সংকেত',
    nav_cyclones: 'ঘূর্ণিঝড় ট্র্যাকিং',
    nav_rainfall: 'বৃষ্টিপাত ও পূর্বাভাস',
    nav_agri: 'কৃষি পরামর্শ',
    nav_marine: 'উপকূলীয় আবহাওয়া',
    nav_aviation: 'বিমান চলাচল আবহাওয়া',
    nav_climate: 'জলবায়ু ও বিশ্লেষণ',
    nav_resources: 'সম্পদ ও স্পেসিফিকেশন',
    nav_settings: 'সেটিংস',
    nav_admin: 'অ্যাডমিন',

    view_more_cities: 'আরও শহর দেখুন',
    interactive_map_title: 'ভারত আবহাওয়া রাডার মানচিত্র',
    active_warnings_title: 'সক্রিয় সতর্কতা',
    view_all_warnings: 'সব দেখুন',
    cyclone_tracking_title: 'ঘূর্ণিঝড় ট্র্যাকিং',
    view_details: 'বিস্তারিত দেখুন',
    quick_access_title: 'দ্রুত সেবা',

    map_live_radar: 'লাইভ রাডার',
    map_rainfall: 'বৃষ্টিপাত',
    map_temperature: 'তাপমাত্রা',
    map_wind: 'বায়ু প্রবাহ',
    map_clouds: 'মেঘের বিস্তার',
    map_layers: 'স্তরসমূহ',
    map_locate: 'আমার অবস্থান',
    map_status_live: 'রাডার নেটওয়ার্ক: সক্রিয়',

    ask_forecastx: 'ForecastX কে জিজ্ঞাসা করুন',
    chat_subtitle: 'আপনার আবহাওয়া এআই সহকারী',
    try_asking: 'জিজ্ঞাসা করে দেখুন:',
    chat_input_placeholder: 'আপনার প্রশ্ন লিখুন...',
    chat_listening: 'শুনছি...',
    chat_voice: 'কণ্ঠস্বর',
    chat_upload_image: 'ছবি আপলোড',
    authoritative_sources: 'অনুমোদিত উৎস',

    qa_agri_title: 'কৃষি পরামর্শ',
    qa_agri_desc: 'ফসল ভিত্তিক পরামর্শ',
    qa_marine_title: 'সমুদ্র পূর্বাভাস',
    qa_marine_desc: 'উপকূলীয় সতর্কতা',
    qa_aviation_title: 'বিমান আবহাওয়া',
    qa_aviation_desc: 'বিমানবন্দর পূর্বাভাস',
    qa_climate_title: 'জলবায়ু অন্তর্দৃষ্টি',
    qa_climate_desc: 'ঐতিহাসিক তথ্য ও প্রবণতা',

    res_title: 'আবহাওয়া সংক্রান্ত রেফারেন্স ও নথিপত্র',
    res_subtitle: 'অফিসিয়াল স্কিমা, দুর্যোগ প্রোটোকল ও স্যাটেলাইট গাইড',
    res_search_placeholder: 'নথিপত্র খুঁজুন...',
    res_filter_all: 'সকল নথি',
    res_filter_protocols: 'এপিআই স্কিমা',
    res_filter_alerts: 'সিএপি সতর্কতা',
    res_filter_satellite: 'স্যাটেলাইট ও রাডার',
    res_filter_sop: 'দুর্যোগ এসওপি',
    res_view_spec: 'বিস্তারিত দেখুন',
    res_download_sample: 'নমুনা ডাউনলোড',
    res_copy_schema: 'স্কিমা কপি',
    res_close: 'বন্ধ করুন',

    footer_powered_by: 'আইএমডি • ইসরো • ডাব্লুএমও দ্বারা চালিত',
    footer_mission: 'নিরাপদ ভারতের জন্য নির্মিত',
    footer_made_by: 'তৈরিতে আদিত্য সিং',

    theme_light: 'লাইট মোড',
    theme_dark: 'ডার্ক মোড',
  },

  ta: {
    brand_tagline: 'பாதுகாப்பான இந்தியாவுக்கான வானிலை நுண்ணறிவு',
    live_badge: 'நேரலை',
    detecting_gps: 'ஜிபிஎஸ் கண்டறிகிறது...',
    search_placeholder: 'நகரத்தைத் தேடுங்கள் அல்லது வானிலை கேள்வி கேட்கவும்...',
    sign_in: 'உள்நுழைக',
    sign_out: 'வெளியேறு',
    user_portal: 'பயனர் தளம்',

    nav_dashboard: 'முகப்பு பலகை',
    nav_live_map: 'நேரலை வரைபடம்',
    nav_search: 'வானிலை தேடல்',
    nav_warnings: 'எச்சரிக்கைகள்',
    nav_cyclones: 'புயல் கண்காணிப்பு',
    nav_rainfall: 'மழைப்பொழிவு',
    nav_agri: 'விவசாய ஆலோசனை',
    nav_marine: 'கடல் வானிலை',
    nav_aviation: 'விமான வானிலை',
    nav_climate: 'காலநிலை ஆய்வு',
    nav_resources: 'ஆவணங்கள்',
    nav_settings: 'அமைப்புகள்',
    nav_admin: 'நிர்வாகம்',

    view_more_cities: 'மேலும் நகரங்கள்',
    interactive_map_title: 'இந்திய வானிலை ரேடார்',
    active_warnings_title: 'செயலில் உள்ள எச்சரிக்கைகள்',
    view_all_warnings: 'அனைத்தையும் காண்க',
    cyclone_tracking_title: 'புயல் கண்காணிப்பு',
    view_details: 'விவரங்கள்',
    quick_access_title: 'விரைவு அணுகல்',

    map_live_radar: 'நேரலை ரேடார்',
    map_rainfall: 'மழைப்பொழிவு',
    map_temperature: 'வெப்பநிலை',
    map_wind: 'காற்று வேகம்',
    map_clouds: 'மேகங்கள்',
    map_layers: 'அடுக்குகள்',
    map_locate: 'என் இடம்',
    map_status_live: 'ரேடார் நெட்வொர்க்: நேரலை',

    ask_forecastx: 'ForecastX-யிடம் கேளுங்கள்',
    chat_subtitle: 'உங்கள் வானிலை ஏஐ உதவியாளர்',
    try_asking: 'கேட்டு பாருங்கள்:',
    chat_input_placeholder: 'கேள்வியை தட்டச்சு செய்க...',
    chat_listening: 'கேட்கிறது...',
    chat_voice: 'குரல்',
    chat_upload_image: 'படம் பதிவேற்று',
    authoritative_sources: 'அங்கீகரிக்கப்பட்ட ஆதாரங்கள்',

    qa_agri_title: 'விவசாய ஆலோசனை',
    qa_agri_desc: 'பயிர் பாதுகாப்பு வழிகாட்டுதல்',
    qa_marine_title: 'கடல் வானிலை',
    qa_marine_desc: 'கடலோர எச்சரிக்கைகள்',
    qa_aviation_title: 'விமான வானிலை',
    qa_aviation_desc: 'விமான நிலைய தகவல்கள்',
    qa_climate_title: 'காலநிலை தகவல்',
    qa_climate_desc: 'வரலாற்று போக்குகள்',

    res_title: 'வானிலை குறிப்பு ஆவணங்கள் மற்றும் விவரக்குறிப்புகள்',
    res_subtitle: 'அதிகாரப்பூர்வ நெறிமுறைகள் மற்றும் செயற்கைக்கோள் கையேடுகள்',
    res_search_placeholder: 'ஆவணங்களை தேடுங்கள்...',
    res_filter_all: 'அனைத்து ஆவணங்கள்',
    res_filter_protocols: 'ஏபிஐ நெறிமுறைகள்',
    res_filter_alerts: 'எச்சரிக்கை நெறிமுறைகள்',
    res_filter_satellite: 'செயற்கைக்கோள் & ரேடார்',
    res_filter_sop: 'பேரிடர் வழிகாட்டுதல்',
    res_view_spec: 'முழு விவரம்',
    res_download_sample: 'மாதிரி பதிவிறக்கம்',
    res_copy_schema: 'நகலெடு',
    res_close: 'மூடு',

    footer_powered_by: 'IMD • ISRO • WMO ஆதரவுடன்',
    footer_mission: 'பாதுகாப்பான இந்தியாவுக்காக உருவாக்கப்பட்டது',
    footer_made_by: 'ஆதித்யா சிங் உருவாக்கியது',

    theme_light: 'ஒளி பயன்முறை',
    theme_dark: 'இருள் பயன்முறை',
  },

  te: {
    brand_tagline: 'సురక్షితమైన భారతదేశం కోసం వాతావరణ సమాచారం',
    live_badge: 'లైవ్',
    detecting_gps: 'జీపీఎస్ గుర్తిస్తోంది...',
    search_placeholder: 'నగరాన్ని వెతకండి లేదా వాతావరణ ప్రశ్న అడగండి...',
    sign_in: 'సైన్ ఇన్',
    sign_out: 'సైన్ అవుట్',
    user_portal: 'యూజర్ పోర్టల్',

    nav_dashboard: 'డాష్‌బోర్డ్',
    nav_live_map: 'లైవ్ మ్యాప్',
    nav_search: 'వాతావరణ శోధన',
    nav_warnings: 'హెచ్చరికలు & అలర్ట్‌లు',
    nav_cyclones: 'తుఫాను ట్రాకింగ్',
    nav_rainfall: 'వర్షపాతం & అంచనా',
    nav_agri: 'వ్యవసాయ సలహాలు',
    nav_marine: 'సముద్ర వాతావరణం',
    nav_aviation: 'విమానయాన వాతావరణం',
    nav_climate: 'వాతావరణ విశ్లేషణ',
    nav_resources: 'వనరులు & డాక్యుమెంట్లు',
    nav_settings: 'సెట్టింగ్‌లు',
    nav_admin: 'అడ్మిన్',

    view_more_cities: 'మరిన్ని నగరాలు',
    interactive_map_title: 'భారత వాతావరణ రాడార్',
    active_warnings_title: 'ప్రస్తుత హెచ్చరికలు',
    view_all_warnings: 'అన్నీ చూడండి',
    cyclone_tracking_title: 'తుఫాను ట్రాకింగ్',
    view_details: 'వివరాలు చూడండి',
    quick_access_title: 'త్వరిత సేవలు',

    map_live_radar: 'లైవ్ రాడార్',
    map_rainfall: 'వర్షపాతం',
    map_temperature: 'ఉష్ణోగ్రత',
    map_wind: 'గాలి వేగం',
    map_clouds: 'మేఘాలు',
    map_layers: 'లేయర్‌లు',
    map_locate: 'నా లొకేషన్',
    map_status_live: 'రాడార్ నెట్‌వర్క్: ప్రత్యక్ష ప్రసారం',

    ask_forecastx: 'ForecastX ను అడగండి',
    chat_subtitle: 'మీ విశ్వసనీయ వాతావరణ ఏఐ సహాయకుడు',
    try_asking: 'ఇలా అడగండి:',
    chat_input_placeholder: 'మీ ప్రశ్నను టైప్ చేయండి...',
    chat_listening: 'వింటున్నాను...',
    chat_voice: 'వాయిస్',
    chat_upload_image: 'చిత్రం అప్‌లోడ్',
    authoritative_sources: 'అధికారిక మూలాలు',

    qa_agri_title: 'వ్యవసాయ సలహాలు',
    qa_agri_desc: 'పంటల సంరక్షణ మార్గదర్శకాలు',
    qa_marine_title: 'సముద్ర సూచన',
    qa_marine_desc: 'తీరప్రాంత హెచ్చరికలు',
    qa_aviation_title: 'విమానయాన వాతావరణం',
    qa_aviation_desc: 'విమానాశ్రయ నివేదికలు',
    qa_climate_title: 'వాతావరణ విశ్లేషణ',
    qa_climate_desc: 'చారిత్రక ధోరణులు',

    res_title: 'వాతావరణ సూచన పత్రాలు మరియు వివరణలు',
    res_subtitle: 'అధికారిక విధానాలు, విపత్తు ప్రోటోకాల్‌లు మరియు మాన్యువల్స్',
    res_search_placeholder: 'పత్రాలను శోధించండి...',
    res_filter_all: 'అన్ని పత్రాలు',
    res_filter_protocols: 'ఏపీఐ ప్రోటోకాల్స్',
    res_filter_alerts: 'అలర్ట్ ప్రమాణాలు',
    res_filter_satellite: 'ఉపగ్రహం & రాడార్',
    res_filter_sop: 'విపత్తు మార్గదర్శకాలు',
    res_view_spec: 'పూర్తి వివరణ',
    res_download_sample: 'నమూనా డౌన్‌లోడ్',
    res_copy_schema: 'కాపీ చేయండి',
    res_close: 'మూసివేయి',

    footer_powered_by: 'IMD • ISRO • WMO ఆధారితం',
    footer_mission: 'సురక్షిత భారతదేశం కోసం రూపొందించబడింది',
    footer_made_by: 'ఆదిత్య సింగ్ రూపొందించారు',

    theme_light: 'లైట్ మోడ్',
    theme_dark: 'డార్క్ మోడ్',
  },

  mr: {
    brand_tagline: 'सुरक्षित भारतासाठी हवामान बुद्धिमत्ता',
    live_badge: 'लाइव्ह',
    detecting_gps: 'जीपीएस शोधत आहे...',
    search_placeholder: 'शहर, जिल्हा शोधा किंवा हवामानाचा प्रश्न विचारा...',
    sign_in: 'साइन इन',
    sign_out: 'साइन आउट',
    user_portal: 'वापरकर्ता पोर्टल',

    nav_dashboard: 'डॅशबोर्ड',
    nav_live_map: 'थेट नकाशा',
    nav_search: 'हवामान शोध',
    nav_warnings: 'इशारे आणि सूचना',
    nav_cyclones: 'चक्रीवादळ ट्रॅकिंग',
    nav_rainfall: 'पाऊस आणि अंदाज',
    nav_agri: 'कृषी सल्लागार',
    nav_marine: 'सागरी हवामान',
    nav_aviation: 'विमान वाहतूक',
    nav_climate: 'हवामान बदल विश्लेषण',
    nav_resources: 'संसाधने व दस्तऐवज',
    nav_settings: 'सेटिंग्ज',
    nav_admin: 'अॅडमिन',

    view_more_cities: 'अधिक शहरे पहा',
    interactive_map_title: 'भारतीय हवामान रडार नकाशा',
    active_warnings_title: 'सक्रिय इशारे',
    view_all_warnings: 'सर्व पहा',
    cyclone_tracking_title: 'चक्रीवादळ ट्रॅकिंग',
    view_details: 'तपशील पहा',
    quick_access_title: 'त्वरित सेवा',

    map_live_radar: 'थेट रडार',
    map_rainfall: 'पाऊस',
    map_temperature: 'तापमान',
    map_wind: 'वाऱ्याचा वेग',
    map_clouds: 'ढग',
    map_layers: 'स्तरे',
    map_locate: 'माझे स्थान',
    map_status_live: 'रडार नेटवर्क: थेट व सक्रिय',

    ask_forecastx: 'ForecastX ला विचारा',
    chat_subtitle: 'तुमचा विश्वासार्ह हवामान एआय सहाय्यक',
    try_asking: 'हे विचारून पहा:',
    chat_input_placeholder: 'तुमचा प्रश्न टाइप करा...',
    chat_listening: 'ऐकत आहे...',
    chat_voice: 'आवाज',
    chat_upload_image: 'फोटो अपलोड',
    authoritative_sources: 'अधिकृत स्रोत',

    qa_agri_title: 'कृषी सल्लागार',
    qa_agri_desc: 'पिकांसाठी मार्गदर्शन व फवारणी इशारे',
    qa_marine_title: 'सागरी अंदाज',
    qa_marine_desc: 'किनारपट्टीचे इशारे',
    qa_aviation_title: 'विमान वाहतूक हवामान',
    qa_aviation_desc: 'विमानतळ हवामान अहवाल',
    qa_climate_title: 'हवामान विश्लेषण',
    qa_climate_desc: 'ऐतिहासिक माहिती व कल',

    res_title: 'हवामान संदर्भ दस्तऐवज आणि तपशील',
    res_subtitle: 'अधिकृत स्कीमा, आपत्ती व्यवस्थापन नियम व उपग्रह मार्गदर्शक',
    res_search_placeholder: 'दस्तऐवज शोधा...',
    res_filter_all: 'सर्व दस्तऐवज',
    res_filter_protocols: 'एपीआय स्कीमा',
    res_filter_alerts: 'इशारे मानके',
    res_filter_satellite: 'उपग्रह व रडार',
    res_filter_sop: 'आपत्ती एसओपी',
    res_view_spec: 'पूर्ण माहिती पहा',
    res_download_sample: 'नमुना डाउनलोड',
    res_copy_schema: 'कॉपी करा',
    res_close: 'बंद करा',

    footer_powered_by: 'आयएमडी • इस्रो • डब्ल्यूएमओ द्वारे संचालित',
    footer_mission: 'सुरक्षित भारतासाठी निर्मित',
    footer_made_by: 'निर्माता: आदित्य सिंह',

    theme_light: 'लाइट मोड',
    theme_dark: 'डार्क मोड',
  },

  gu: {
    brand_tagline: 'સુરક્ષિત ભારત માટે હવામાન બુદ્ધિ',
    live_badge: 'લાઇવ',
    detecting_gps: 'જીપીએસ શોધી રહ્યું છે...',
    search_placeholder: 'શહેર શોધો અથવા હવામાન પ્રશ્ન પૂછો...',
    sign_in: 'સાઇન ઇન',
    sign_out: 'સાઇન આઉટ',
    user_portal: 'યુઝર પોર્ટલ',

    nav_dashboard: 'ડેશબોર્ડ',
    nav_live_map: 'લાઈવ નકશો',
    nav_search: 'હવામાન શોધ',
    nav_warnings: 'ચેતવણીઓ અને એલર્ટ્સ',
    nav_cyclones: 'વાવાઝોડું ટ્રેકિંગ',
    nav_rainfall: 'વરસાદ અને અનુમાન',
    nav_agri: 'કૃષિ સલાહકાર',
    nav_marine: 'દરિયાઈ હવામાન',
    nav_aviation: 'વિમાન સેવા હવામાન',
    nav_climate: 'આબોહવા વિશ્લેષણ',
    nav_resources: 'સંસાધનો અને દસ્તાવેજો',
    nav_settings: 'સેટિંગ્સ',
    nav_admin: 'એડમિન',

    view_more_cities: 'વધુ શહેરો જુઓ',
    interactive_map_title: 'ભારતીય હવામાન રડાર',
    active_warnings_title: 'સક્રિય ચેતવણીઓ',
    view_all_warnings: 'બધા જુઓ',
    cyclone_tracking_title: 'વાવાઝોડું ટ્રેકિંગ',
    view_details: 'વિગત જુઓ',
    quick_access_title: 'ઝડપી સેવાઓ',

    map_live_radar: 'લાઇવ રડાર',
    map_rainfall: 'વરસાદ',
    map_temperature: 'તાપમાન',
    map_wind: 'પવનની ગતિ',
    map_clouds: 'વાદળો',
    map_layers: 'સ્તરો',
    map_locate: 'મારું સ્થાન',
    map_status_live: 'રડાર નેટવર્ક: સક્રિય',

    ask_forecastx: 'ForecastX ને પૂછો',
    chat_subtitle: 'તમારા વિશ્વાસપાત્ર હવામાન એઆઈ સહાયક',
    try_asking: 'આ પૂછી જુઓ:',
    chat_input_placeholder: 'તમારો પ્રશ્ન લખો...',
    chat_listening: 'સાંભળી રહ્યું છે...',
    chat_voice: 'અવાજ',
    chat_upload_image: 'ઇમેજ અપલોડ',
    authoritative_sources: 'સત્તાવાર સ્ત્રોતો',

    qa_agri_title: 'કૃષિ સલાહ',
    qa_agri_desc: 'પાક માર્ગદર્શન અને છંટકાવ ચેતવણી',
    qa_marine_title: 'દરિયાઈ અનુમાન',
    qa_marine_desc: 'દરિયાકાંઠાની ચેતવણીઓ',
    qa_aviation_title: 'વિમાન સેવા હવામાન',
    qa_aviation_desc: 'એરપોર્ટ રિપોર્ટ્સ',
    qa_climate_title: 'આબોહવા વિશ્લેષણ',
    qa_climate_desc: 'ઐતિહાસિક ડેટા અને વલણો',

    res_title: 'હવામાન સંદર્ભ દસ્તાવેજો અને વિશિષ્ટતાઓ',
    res_subtitle: 'સત્તાવાર પ્રોટોકોલ, આપત્તિ માર્ગદર્શિકા અને સેટેલાઇટ મેન્યુઅલ',
    res_search_placeholder: 'દસ્તાવેજ શોધો...',
    res_filter_all: 'બધા દસ્તાવેજો',
    res_filter_protocols: 'એપીઆઈ સ્કીમા',
    res_filter_alerts: 'એલર્ટ ધોરણો',
    res_filter_satellite: 'સેટેલાઇટ અને રડાર',
    res_filter_sop: 'આપત્તિ એસઓપી',
    res_view_spec: 'સંપૂર્ણ વિગત જુઓ',
    res_download_sample: 'સેમ્પલ ડાઉનલોડ',
    res_copy_schema: 'કોપી કરો',
    res_close: 'બંધ કરો',

    footer_powered_by: 'આઈએમડી • ઇસરો • ડબલ્યુએમઓ દ્વારા સંચાલિત',
    footer_mission: 'સુરક્ષિત ભારત માટે નિર્મિત',
    footer_made_by: 'નિર્માતા: આદિત્ય સિંહ',

    theme_light: 'લાઇટ મોડ',
    theme_dark: 'ડાર્ક મોડ',
  },
};

export function getTranslation(lang: string = 'en'): TranslationDict {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
