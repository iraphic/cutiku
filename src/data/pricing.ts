export type Band = "domestik-dekat" | "domestik-jauh" | "asean" | "asia" | "menengah" | "jauh";

export interface PricingBand {
  /** Estimasi tiket pesawat PP per orang (min, max) dalam Rupiah */
  flight: [number, number];
  hotel: { budget: number; mid: number; premium: number };
  /** Makan per hari per orang (min, max) */
  meals: [number, number];
  /** Transport lokal per hari (min, max) */
  localTransport: [number, number];
  label: string;
}

const BANDS: Record<Band, PricingBand> = {
  "domestik-dekat": {
    flight: [900_000, 1_800_000],
    hotel: { budget: 250_000, mid: 600_000, premium: 1_500_000 },
    meals: [80_000, 200_000],
    localTransport: [50_000, 150_000],
    label: "Domestik (dekat)",
  },
  "domestik-jauh": {
    flight: [1_800_000, 3_500_000],
    hotel: { budget: 300_000, mid: 750_000, premium: 2_000_000 },
    meals: [90_000, 220_000],
    localTransport: [60_000, 180_000],
    label: "Domestik (jauh)",
  },
  asean: {
    flight: [1_500_000, 4_000_000],
    hotel: { budget: 350_000, mid: 900_000, premium: 2_500_000 },
    meals: [120_000, 350_000],
    localTransport: [80_000, 200_000],
    label: "Asia Tenggara",
  },
  asia: {
    flight: [3_000_000, 8_000_000],
    hotel: { budget: 450_000, mid: 1_200_000, premium: 3_500_000 },
    meals: [150_000, 450_000],
    localTransport: [100_000, 250_000],
    label: "Asia Timur & Selatan",
  },
  menengah: {
    flight: [6_000_000, 10_000_000],
    hotel: { budget: 700_000, mid: 1_800_000, premium: 5_000_000 },
    meals: [250_000, 600_000],
    localTransport: [120_000, 300_000],
    label: "Timur Tengah",
  },
  jauh: {
    flight: [8_000_000, 15_000_000],
    hotel: { budget: 800_000, mid: 2_200_000, premium: 6_000_000 },
    meals: [300_000, 800_000],
    localTransport: [150_000, 400_000],
    label: "Eropa / Australia / Amerika",
  },
};

/** Kota dengan biaya hidup tinggi: naikkan kelas band hotel & makan. */
const HIGH_COST = new Set([
  "Tokyo",
  "Osaka",
  "Singapore",
  "Hong Kong",
  "Paris",
  "London",
  "Amsterdam",
  "Rome",
  "Sydney",
  "Malé",
  "Zurich",
  "Interlaken",
  "Reykjavik",
  "New York",
  "Los Angeles",
  "San Francisco",
  "Honolulu",
  "Dubai",
]);

const COUNTRY_BAND: Record<string, Band> = {
  "Indonesia": "domestik-jauh",
  "Singapore": "asean",
  "Malaysia": "asean",
  "Thailand": "asean",
  "Vietnam": "asean",
  "Cambodia": "asean",
  "Laos": "asean",
  "Philippines": "asean",
  "Myanmar": "asean",
  "Brunei": "asean",
  "Japan": "asia",
  "South Korea": "asia",
  "Hong Kong": "asia",
  "Macau": "asia",
  "Taiwan": "asia",
  "China": "asia",
  "Mongolia": "asia",
  "India": "asia",
  "Nepal": "asia",
  "Sri Lanka": "asean",
  "Maldives": "menengah",
  "Bangladesh": "asia",
  "United Arab Emirates": "menengah",
  "Qatar": "menengah",
  "Turkey": "menengah",
  "Saudi Arabia": "menengah",
  "Jordan": "menengah",
  "Oman": "menengah",
};

const NEAR_DOMESTIC_PAIRS = [
  ["jakarta", "bandung"],
  ["jakarta", "bogor"],
  ["jakarta", "tangerang"],
  ["surabaya", "malang"],
  ["surabaya", "bromo (probolinggo)"],
  ["yogyakarta", "solo"],
  ["yogyakarta", "semarang"],
  ["denpasar (bali)", "lombok"],
  ["medan", "aceh (banda aceh)"],
];

/**
 * Heuristik nama yang "terdengar Indonesia" untuk destinasi bebas yang tidak
 * ada di daftar kota — dipakai untuk menebak negara & band harga default.
 */
const INDONESIAN_HINTS = [
  "gili",
  "pulau",
  "pantai",
  "gunung",
  "kawah",
  "bromo",
  "raja ampat",
  "labuan bajo",
  "komodo",
  "flores",
  "belitung",
  "karimunjawa",
  "bunaken",
  "wakatobi",
  "bintan",
  "batam",
  "tanjung",
  "bukittinggi",
  "sabang",
  "derawan",
  "toraja",
  "dieng",
  "puncak",
  "anyer",
  "pangandaran",
  "pacitan",
  "jepara",
  "kudus",
  "cirebon",
  "sukabumi",
  "garut",
  "tasikmalaya",
  "purwokerto",
  "tegal",
  "pekalongan",
  "magelang",
  "klaten",
  "madiun",
  "kediri",
  "blitar",
  "jember",
  "banyuwangi",
  "probolinggo",
  "pasuruan",
  "batu",
  "lombok",
  "sumbawa",
  "kupang",
  "ambon",
  "ternate",
  "manokwari",
  "jayapura",
  "sorong",
  "balikpapan",
  "samarinda",
  "pontianak",
  "banjarmasin",
  "palangkaraya",
  "makassar",
  "palu",
  "kendari",
  "manado",
  "gorontalo",
  "padang",
  "pekanbaru",
  "jambi",
  "palembang",
  "lampung",
  "serang",
  "bogor",
  "depok",
  "bekasi",
];

export function soundsIndonesian(name: string): boolean {
  const n = name.trim().toLowerCase();
  return INDONESIAN_HINTS.some((hint) => n.includes(hint));
}

/**
 * Tebak negara untuk destinasi bebas (tidak ada di daftar kota):
 * asumsikan Indonesia bila namanya terdengar Indonesia, selain itu pakai
 * negara kota asal sebagai kategori jarak yang wajar.
 */
export function guessCountry(name: string, originCountry = "Indonesia"): string {
  return soundsIndonesian(name) ? "Indonesia" : originCountry;
}

export function getBand(cityName: string, country: string, originName: string): Band {
  if (country === "Indonesia") {
    const a = originName.toLowerCase();
    const b = cityName.toLowerCase();
    if (
      NEAR_DOMESTIC_PAIRS.some(
        ([x, y]) => (a === x && b === y) || (a === y && b === x),
      )
    ) {
      return "domestik-dekat";
    }
    return "domestik-jauh";
  }
  return COUNTRY_BAND[country] ?? "jauh";
}

export function getPricing(cityName: string, country: string, originName: string): PricingBand {
  const band = getBand(cityName, country, originName);
  const base = BANDS[band];
  if (HIGH_COST.has(cityName)) {
    return {
      ...base,
      hotel: {
        budget: Math.round(base.hotel.budget * 1.5),
        mid: Math.round(base.hotel.mid * 1.5),
        premium: Math.round(base.hotel.premium * 1.5),
      },
      meals: [Math.round(base.meals[0] * 1.4), Math.round(base.meals[1] * 1.4)],
      localTransport: [
        Math.round(base.localTransport[0] * 1.2),
        Math.round(base.localTransport[1] * 1.2),
      ],
    };
  }
  return base;
}

/** Opsi transportasi darat/laut untuk rute domestik dekat. */
export function groundOption(band: Band): { label: string; price: [number, number] } | undefined {
  if (band !== "domestik-dekat") return undefined;
  return { label: "Kereta / travel antar kota (PP)", price: [200_000, 600_000] };
}

// ---------------------------------------------------------------------------
// Transportasi per leg rute multi-kota (sekali jalan, per orang)
// ---------------------------------------------------------------------------

export interface LegTransport {
  label: string;
  price: [number, number];
  /** Estimasi durasi perjalanan, mis. "±3 jam" */
  duration?: string;
  /** true = moda cepat/utama (pesawat), false = moda hemat */
  primary?: boolean;
}

const normCity = (s: string) => s.trim().toLowerCase();

const PAIR_TRANSPORTS: [string, string, LegTransport[]][] = [
  [
    "singapore",
    "johor bahru",
    [
      { label: "Bus lintas batas / KTM Shuttle Tebrau", price: [50_000, 150_000], duration: "±1 jam" },
      { label: "Taksi / mobil sewa via Causeway", price: [300_000, 600_000], duration: "±1 jam", primary: true },
    ],
  ],
  [
    "johor bahru",
    "kuala lumpur",
    [
      { label: "Bus antar kota (Larkin → TBS)", price: [150_000, 300_000], duration: "±4,5 jam" },
      { label: "Kereta ETS", price: [200_000, 400_000], duration: "±4 jam" },
      { label: "Pesawat domestik", price: [400_000, 900_000], duration: "±1 jam", primary: true },
    ],
  ],
  [
    "singapore",
    "kuala lumpur",
    [
      { label: "Bus malam antar negara", price: [300_000, 600_000], duration: "±5 jam" },
      { label: "Pesawat low-cost", price: [500_000, 1_200_000], duration: "±1 jam", primary: true },
    ],
  ],
  [
    "jakarta",
    "bandung",
    [
      { label: "Travel / shuttle point-to-point", price: [100_000, 250_000], duration: "±3 jam" },
      { label: "Kereta Whoosh / Argo Parahyangan", price: [150_000, 350_000], duration: "±45 menit–3 jam", primary: true },
    ],
  ],
  [
    "yogyakarta",
    "solo",
    [{ label: "Kereta Prameks / KRL", price: [20_000, 80_000], duration: "±1 jam", primary: true }],
  ],
  [
    "denpasar (bali)",
    "lombok",
    [
      { label: "Feri publik (Padang Bai → Lembar)", price: [100_000, 200_000], duration: "±4–5 jam" },
      { label: "Fast boat via Padang Bai", price: [250_000, 500_000], duration: "±1,5 jam" },
      { label: "Pesawat domestik", price: [600_000, 1_200_000], duration: "±40 menit", primary: true },
    ],
  ],
];

/** Estimasi opsi transportasi sekali jalan untuk satu leg rute. */
export function legTransports(
  fromName: string,
  fromCountry: string,
  toName: string,
  toCountry: string,
): LegTransport[] {
  const a = normCity(fromName);
  const b = normCity(toName);
  for (const [x, y, opts] of PAIR_TRANSPORTS) {
    if ((a === x && b === y) || (a === y && b === x)) return opts;
  }
  if (fromCountry === toCountry && fromCountry === "Indonesia") {
    const band = getBand(toName, toCountry, fromName);
    if (band === "domestik-dekat") {
      return [
        { label: "Bus AKAP / travel antar kota", price: [100_000, 300_000], duration: "±2–4 jam" },
        { label: "Kereta antar kota", price: [150_000, 400_000], duration: "±2–4 jam" },
        { label: "Pesawat domestik", price: [500_000, 1_100_000], duration: "±1 jam", primary: true },
      ];
    }
    return [
      { label: "Bus AKAP malam", price: [300_000, 800_000], duration: "±10–20 jam" },
      { label: "Kereta eksekutif jarak jauh", price: [400_000, 1_000_000], duration: "±8–14 jam" },
      { label: "Kapal feri/Pelni (rute laut)", price: [350_000, 900_000], duration: "±1–2 hari" },
      { label: "Pesawat domestik", price: [450_000, 1_800_000], duration: "±1–2 jam", primary: true },
    ];
  }
  if (fromCountry === toCountry) {
    return [
      { label: "Kereta / bus antar kota", price: [200_000, 700_000], duration: "±3–6 jam" },
      { label: "Pesawat domestik", price: [600_000, 2_000_000], duration: "±1–2 jam", primary: true },
    ];
  }
  return [
    { label: "Bus / kereta lintas negara (jika memungkinkan)", price: [500_000, 1_500_000], duration: "±6–24 jam" },
    { label: "Pesawat (estimasi OTA)", price: [800_000, 3_500_000], duration: "±2–8 jam", primary: true },
  ];
}

function hashStr(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = (h ^ str.charCodeAt(i)) * 16777619 >>> 0;
  return h;
}

/** Jitter deterministik 0.94–1.10 agar angka terlihat realistis namun stabil. */
export function jitter(seed: string, base: number): number {
  const h = hashStr(seed);
  const factor = 0.94 + ((h % 1000) / 1000) * 0.16;
  return Math.round((base * factor) / 1000) * 1000;
}

export function formatIDR(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}
