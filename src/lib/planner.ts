import type { City } from "#/data/cities";
import type { DestinationProfile, HotelSuggestion } from "#/data/destinations";
import { getProfile } from "#/data/destinations";
import { HOLIDAYS, holidayOn } from "#/data/holidays";
import {
  getBand,
  getPricing,
  groundOption,
  jitter,
  legTransports,
} from "#/data/pricing";
import { addDays, diffDays, isWeekend, parseISO, toISODate } from "#/lib/dateUtils";
import { formatTemplate, TEXT, type Language } from "#/lib/i18n";

const holidayDates = new Set(HOLIDAYS.map((h) => h.date));

// ---------------------------------------------------------------------------
// Date suggestions
// ---------------------------------------------------------------------------

export interface DateOption {
  id: "pilihan" | "optimal-1" | "optimal-2";
  start: Date;
  end: Date;
  /** Hari libur gratis (Sabtu/Minggu/tanggal merah) yang ikut dalam rentang */
  freeDays: number;
  totalDaysOff: number;
  leaveDaysUsed: number;
  holidaysCovered: { date: string; name: string }[];
  reason: string;
  score: number;
  isUserChoice: boolean;
}

interface Window {
  start: Date;
  end: Date;
  leave: number;
  total: number;
  holidays: { date: string; name: string }[];
}

function analyzeWindow(start: Date, leaveDays: number): Window {
  const end = addDays(start, leaveDays - 1);
  let leave = 0;
  const holidays: { date: string; name: string }[] = [];
  for (let i = 0; i < leaveDays; i++) {
    const d = addDays(start, i);
    const iso = toISODate(d);
    const h = holidayOn(iso);
    if (h) holidays.push({ date: iso, name: h.name });
    if (!isWeekend(d) && !holidayDates.has(iso)) leave++;
  }
  return { start, end, leave, total: leaveDays, holidays };
}

/**
 * Perluas rentang ke kiri/kanan menelan weekend & tanggal merah yang berdempetan,
 * sehingga total hari libur > hari cuti yang dipakai.
 */
function bridgeWindow(start: Date, leaveDays: number): Window {
  let s = start;
  let e = addDays(start, leaveDays - 1);
  const isFree = (d: Date) => isWeekend(d) || holidayDates.has(toISODate(d));
  while (isFree(addDays(s, -1))) s = addDays(s, -1);
  while (isFree(addDays(e, 1))) e = addDays(e, 1);
  const w = analyzeWindow(s, diffDays(s, e) + 1);
  return w;
}

function windowScore(w: Window, leaveDaysRequested: number): number {
  const freeDays = w.total - w.leave;
  const efficiency = w.leave === 0 ? w.total * 2 : w.total / w.leave;
  // Penalti bila cuti yang dipakai jauh melebihi permintaan
  const overuse = Math.max(0, w.leave - leaveDaysRequested);
  return efficiency * 10 + freeDays * 2 + w.holidays.length * 1.5 - overuse * 8;
}

function reasonFor(w: Window, leaveDaysRequested: number): string {
  const freeDays = w.total - w.leave;
  const names = w.holidays.map((h) => h.name);
  const holidayPhrase =
    names.length > 0
      ? ` ${names.length > 1 ? "Menyambung rangkaian" : "Menempel"} ${names[0]}${names.length > 1 ? " dan tanggal merah lainnya" : ""}.`
      : " Menyambung akhir pekan.";
  const harpitnas = freeDays >= 3 && w.leave <= Math.max(2, leaveDaysRequested - 1);
  const base = harpitnas
    ? "Strategi harpitnas maksimal: ambil cuti di hari yang terjepit."
    : names.length > 0
      ? "Memanfaatkan tanggal merah agar cuti lebih panjang."
      : "Mengapit akhir pekan sehingga hari kerja yang dipakai minimal.";
  return `${base}${holidayPhrase} Total ${w.total} hari libur cukup dengan ${w.leave} hari cuti.`;
}

export function suggestDates(leaveDays: number, preferredStart: Date): DateOption[] {
  const user = bridgeWindow(preferredStart, leaveDays);
  const options: DateOption[] = [
    {
      id: "pilihan",
      start: user.start,
      end: user.end,
      freeDays: user.total - user.leave,
      totalDaysOff: user.total,
      leaveDaysUsed: user.leave,
      holidaysCovered: user.holidays,
      reason:
        user.holidays.length > 0 || user.total - user.leave > 2
          ? `Pilihanmu sudah lumayan: rentang ini menyentuh ${user.holidays.length > 0 ? `${user.holidays[0].name} dan ` : ""}akhir pekan. Total ${user.total} hari libur dengan ${user.leave} hari cuti.`
          : `Tanggal pilihanmu sendiri — ${user.total} hari penuh dengan ${user.leave} hari cuti, tanpa bonus tanggal merah.`,
      score: windowScore(user, leaveDays),
      isUserChoice: true,
    },
  ];

  // Pindai window kandidat di sekitar tanggal pilihan (±35 hari)
  const seen = new Set<string>([toISODate(user.start)]);
  const candidates: Window[] = [];
  for (let offset = -35; offset <= 35; offset++) {
    if (offset === 0) continue;
    const w = bridgeWindow(addDays(preferredStart, offset), leaveDays);
    const key = toISODate(w.start);
    if (seen.has(key)) continue;
    seen.add(key);
    // Hanya kandidat yang benar-benar punya bonus (tanggal merah atau jembatan panjang)
    const bonus = w.total - w.leave - countWeekendsIn(w.start, leaveDays);
    if (w.holidays.length === 0 && bonus <= 0 && w.total - w.leave <= 2) continue;
    candidates.push(w);
  }
  candidates.sort((a, b) => windowScore(b, leaveDays) - windowScore(a, leaveDays));

  for (const w of candidates.slice(0, 2)) {
    options.push({
      id: options.length === 1 ? "optimal-1" : "optimal-2",
      start: w.start,
      end: w.end,
      freeDays: w.total - w.leave,
      totalDaysOff: w.total,
      leaveDaysUsed: w.leave,
      holidaysCovered: w.holidays,
      reason: reasonFor(w, leaveDays),
      score: windowScore(w, leaveDays),
      isUserChoice: false,
    });
  }

  // Tandai skor tertinggi; jika pilihan user menang, tukar urutan tetap tapi badge ikut skor
  return options.slice(0, 3);
}

function countWeekendsIn(start: Date, days: number): number {
  let n = 0;
  for (let i = 0; i < days; i++) if (isWeekend(addDays(start, i))) n++;
  return n;
}

// ---------------------------------------------------------------------------
// Itinerary
// ---------------------------------------------------------------------------

export type TravelStyle = "santai" | "padat" | "explore";

export const STYLE_LABEL: Record<TravelStyle, string> = {
  santai: "Santai",
  padat: "Padat",
  explore: "Full Explore",
};

export interface Activity {
  id?: string;
  time: "Pagi" | "Siang" | "Sore" | "Malam";
  title: string;
  detail: string;
  ticket: number;
  /** Slot kuliner — alternatifnya diambil dari daftar makanan kota */
  kind?: "food";
  /** Slot perjalanan/logistik — tidak bisa diganti */
  locked?: boolean;
}

export interface ItineraryDay {
  day: number;
  date: Date;
  activities: Activity[];
  photos: { url: string; alt: string }[];
  /** Nama kota tempat aktivitas hari ini (mode multi-kota) */
  city?: string;
  /** Hari perpindahan antar kota dengan aktivitas ringan */
  transit?: boolean;
}

/** Satu segmen kota dalam itinerary multi-kota. */
export interface ItinerarySegment {
  city: string;
  country: string;
  profile: DestinationProfile;
  days: ItineraryDay[];
  /** Sisa hari setelah segmen ini (0 untuk kota terakhir). */
  remainingAfter: number;
}

function transitActivities(fromCity: string, toCity: string): Activity[] {
  return [
    {
      time: "Pagi",
      title: `Check-out di ${fromCity}`,
      detail: "Sarapan santai, packing, lalu menuju terminal/bandara lebih awal.",
      ticket: 0,
      locked: true,
    },
    {
      time: "Siang",
      title: `Perjalanan menuju ${toCity}`,
      detail: `Nikmati perjalanan antar kota dari ${fromCity} ke ${toCity} — siapkan camilan dan power bank.`,
      ticket: 0,
      locked: true,
    },
    {
      time: "Sore",
      title: `Tiba di ${toCity} & check-in`,
      detail: "Istirahat sebentar di penginapan, lalu jelajah ringan area sekitar.",
      ticket: 0,
      locked: true,
    },
    {
      time: "Malam",
      title: "Makan malam & santai",
      detail: `Cicipi kuliner lokal pertama di ${toCity}, lalu tidur lebih awal agar segar esok hari.`,
      ticket: 0,
      kind: "food",
    },
  ];
}

function exploreDay(
  profile: DestinationProfile,
  nextAttraction: () => AttractionEntry,
  nextFood: () => { name: string; priceRange: string },
  style: TravelStyle = "padat",
): Activity[] {
  const a1 = nextAttraction();
  const f = nextFood();

  if (style === "santai") {
    return [
      {
        time: "Pagi",
        title: "Pagi santai & sarapan lesehan",
        detail: "Tanpa alarm — nikmati sarapan di hotel atau kafe dekat penginapan.",
        ticket: 0,
        locked: true,
      },
      {
        time: "Siang",
        title: a1.name,
        detail: `${a1.desc} Makan siang: coba ${f.name} (${f.priceRange}).`,
        ticket: a1.ticket,
      },
      {
        time: "Sore",
        title: "Waktu bebas / santai di hotel",
        detail: `Sore fleksibel — bisa spa, renang, atau sekadar jalan santai menikmati ${profile.city}.`,
        ticket: 0,
        locked: true,
      },
      {
        time: "Malam",
        title: "Santai & jelajah malam",
        detail: `Nikmati suasana malam ${profile.city} di sekitar penginapan, tanpa jadwal ketat.`,
        ticket: 0,
        kind: "food",
      },
    ];
  }

  const a2 = nextAttraction();
  if (style === "explore") {
    const a3 = nextAttraction();
    const a4 = nextAttraction();
    return [
      {
        time: "Pagi",
        title: a1.name,
        detail: `${a1.desc} Berangkat sepagi mungkin untuk memaksimalkan hari.`,
        ticket: a1.ticket,
      },
      {
        time: "Siang",
        title: a2.name,
        detail: `${a2.desc} Makan siang cepat: coba ${f.name} (${f.priceRange}).`,
        ticket: a2.ticket,
      },
      {
        time: "Sore",
        title: `Day trip: ${a3.name}`,
        detail: `${a3.desc} Perjalanan sore yang masih terjangkau dari pusat kota.`,
        ticket: a3.ticket,
      },
      {
        time: "Malam",
        title: a4.name,
        detail: `${a4.desc} Tutup hari penuh dengan pengalaman malam khas ${profile.city}.`,
        ticket: a4.ticket,
      },
    ];
  }

  const a3 = nextAttraction();
  return [
    {
      time: "Pagi",
      title: a1.name,
      detail: `${a1.desc} Datang pagi agar lebih sepi.`,
      ticket: a1.ticket,
    },
    {
      time: "Siang",
      title: a2.name,
      detail: `${a2.desc} Makan siang: coba ${f.name} (${f.priceRange}).`,
      ticket: a2.ticket,
    },
    {
      time: "Sore",
      title: a3.name,
      detail: a3.desc,
      ticket: a3.ticket,
    },
    {
      time: "Malam",
      title: "Santai & jelajah malam",
      detail: `Kembali ke hotel atau nikmati suasana malam ${profile.city} di sekitar penginapan.`,
      ticket: 0,
      kind: "food",
    },
  ];
}

type AttractionEntry = { name: string; desc: string; ticket: number };

/**
 * Bangun itinerary tersegmentasi per kota. Transit days ditempatkan tepat
 * setelah hari eksplorasi sebuah kota (kecuali kota terakhir).
 */
export function buildRouteItinerary(
  start: Date,
  allocations: number[],
  profiles: DestinationProfile[],
  originName: string,
  style: TravelStyle = "padat",
): ItinerarySegment[] {
  const segments: ItinerarySegment[] = [];
  let dayIdx = 0;

  for (let s = 0; s < allocations.length; s++) {
    const explore = allocations[s];
    const remaining = allocations.slice(s + 1).reduce((a, b) => a + b, 0);
    const isLast = s === allocations.length - 1;
    const profile = profiles[s];
    const days: ItineraryDay[] = [];
    let attractionIdx = 0;
    let foodIdx = 0;
    const nextAttraction = (): AttractionEntry => {
      const a = profile.attractions[attractionIdx % profile.attractions.length];
      attractionIdx++;
      return a;
    };
    const nextFood = () => {
      const f = profile.foods[foodIdx % profile.foods.length];
      foodIdx++;
      return f;
    };

    for (let j = 0; j < explore; j++) {
      const global = dayIdx;
      const date = addDays(start, global);
      const photos = [pick(profile.photos, global), pick(profile.photos, global + 1)];
      const totalExplore = allocations.reduce((a, b) => a + b, 0);
      const isFirst = global === 0;
      // Hari terakhir = eksplorasi terakhir di kota terakhir (tidak ada transit setelahnya)
      const isFinalDay = isLast && j === explore - 1 && global === totalExplore - 1;
      let activities: Activity[];

      if (isFirst) {
        // Hari pertama: berangkat dari asal & tiba di kota pertama
        const a1 = nextAttraction();
        const f = nextFood();
        activities = [
          {
            time: "Pagi",
            title: `Berangkat dari ${originName}`,
            detail: "Check-in lebih awal, siapkan dokumen perjalanan, dan sarapan sebelum berangkat.",
            ticket: 0,
            locked: true,
          },
          {
            time: "Siang",
            title: `Tiba di ${profile.city} & check-in hotel`,
            detail: "Istirahat sebentar lalu mulai eksplorasi area sekitar penginapan.",
            ticket: 0,
            locked: true,
          },
          { time: "Sore", title: a1.name, detail: a1.desc, ticket: a1.ticket },
          {
            time: "Malam",
            title: `Makan malam: ${f.name}`,
            detail: `Kuliner khas wajib coba (${f.priceRange}). Lalu istirahat untuk hari penuh besok.`,
            ticket: 0,
            kind: "food",
          },
        ];
      } else if (isFinalDay) {
        // Hari terakhir seluruh perjalanan: kembali ke kota asal
        const f = nextFood();
        activities = [
          {
            time: "Pagi",
            title: "Sarapan santai & packing",
            detail: "Nikmati pagi terakhir, check-out hotel, titip koper bila perlu.",
            ticket: 0,
            locked: true,
          },
          {
            time: "Siang",
            title: "Belanja oleh-oleh",
            detail: `Mampir ke ${nextAttraction().name} atau pusat oleh-oleh khas ${profile.city}.`,
            ticket: 0,
          },
          {
            time: "Sore",
            title: `Kembali ke ${originName}`,
            detail: "Menuju bandara/terminal lebih awal untuk antisipasi antrean.",
            ticket: 0,
            locked: true,
          },
          {
            time: "Malam",
            title: `Tiba di ${originName}`,
            detail: `Perjalanan selesai — sempurna ditutup dengan ${f.name} jika masih sempat.`,
            ticket: 0,
            kind: "food",
          },
        ];
      } else {
        activities = exploreDay(profile, nextAttraction, nextFood, style);
      }

      days.push({ day: global + 1, date, activities, photos, city: profile.city });
      dayIdx++;
    }

    // Hari transit setelah segmen ini bila masih ada kota berikutnya
    if (!isLast) {
      const nextProfile = profiles[s + 1];
      const global = dayIdx;
      const date = addDays(start, global);
      days.push({
        day: global + 1,
        date,
        activities: transitActivities(profile.city, nextProfile.city),
        photos: [pick(nextProfile.photos, global), pick(profile.photos, global + 1)],
        city: `${profile.city} → ${nextProfile.city}`,
        transit: true,
      });
      dayIdx++;
    }

    segments.push({
      city: profile.city,
      country: "",
      profile,
      days,
      remainingAfter: remaining,
    });
  }

  return segments;
}

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

export function buildItinerary(
  start: Date,
  days: number,
  profile: DestinationProfile,
  originName: string,
  style: TravelStyle = 'padat',
): ItineraryDay[] {
  return buildRouteItinerary(start, [days], [profile], originName, style)[0].days;
}

// ---------------------------------------------------------------------------
// Budget
// ---------------------------------------------------------------------------

export type HotelTier = "budget" | "mid" | "premium";

/** Estimasi satu leg perjalanan (sekali jalan, per orang). */
export interface LegCost {
  from: string;
  to: string;
  options: { label: string; price: [number, number]; duration?: string; primary?: boolean }[];
}

/** Estimasi hotel per kota tujuan. */
export interface CityHotel {
  city: string;
  nights: number;
  perNight: Record<HotelTier, number>;
  /** Rekomendasi hotel simulasi per kelas */
  suggestions: HotelSuggestion[];
}

export interface BudgetRow {
  label: string;
  min: number;
  max: number;
}

export interface BudgetBreakdown {
  flightLabel: string;
  flight: [number, number];
  ground?: { label: string; price: [number, number] };
  hotelPerNight: Record<HotelTier, number>;
  /** Rekomendasi hotel untuk kelas terpilih (mode satu kota) */
  hotelSuggestion?: HotelSuggestion;
  nights: number;
  meals: [number, number];
  localTransport: [number, number];
  attractionTickets: number;
  bufferRate: number;
  /** Mode multi-kota: rincian per leg rute */
  legs?: LegCost[];
  routeNames?: string[];
  hotels?: CityHotel[];
  total: (tier: HotelTier) => { min: number; max: number };
  rows: (tier: HotelTier) => BudgetRow[];
}

export function estimateBudget(
  origin: City,
  destinationName: string,
  destinationCountry: string,
  days: number,
  itinerary: ItineraryDay[],
): BudgetBreakdown {
  const pricing = getPricing(destinationName, destinationCountry, origin.name);
  const band = getBand(destinationName, destinationCountry, origin.name);
  const seed = `${origin.name}->${destinationName}`;
  const nights = Math.max(0, days - 1);

  const flight: [number, number] = [
    jitter(seed + "f0", pricing.flight[0]),
    jitter(seed + "f1", pricing.flight[1]),
  ];
  const ground = groundOption(band);
  const groundJittered = ground
    ? { label: ground.label, price: [jitter(seed + "g0", ground.price[0]), jitter(seed + "g1", ground.price[1])] as [number, number] }
    : undefined;

  const routeLegs = legTransports(origin.name, origin.country, destinationName, destinationCountry).map((o) => ({
    label: o.label,
    price: [
      jitter(seed + "|" + o.label + "0", o.price[0]),
      jitter(seed + "|" + o.label + "1", o.price[1]),
    ] as [number, number],
    duration: o.duration,
    primary: o.primary,
  }));

  const legs: LegCost[] | undefined =
    routeLegs.length > 0
      ? [{ from: origin.name, to: destinationName, options: routeLegs }]
      : undefined;

  const meals: [number, number] = [
    jitter(seed + "m0", pricing.meals[0] * days),
    jitter(seed + "m1", pricing.meals[1] * days),
  ];
  const localTransport: [number, number] = [
    jitter(seed + "t0", pricing.localTransport[0] * days),
    jitter(seed + "t1", pricing.localTransport[1] * days),
  ];
  const attractionTickets = itinerary.reduce(
    (sum, d) => sum + d.activities.reduce((s, a) => s + a.ticket, 0),
    0,
  );

  const hotelPerNight: Record<HotelTier, number> = {
    budget: jitter(seed + "hb", pricing.hotel.budget),
    mid: jitter(seed + "hm", pricing.hotel.mid),
    premium: jitter(seed + "hp", pricing.hotel.premium),
  };

  const bufferRate = 0.1;
  const hotelCost = (tier: HotelTier) => hotelPerNight[tier] * nights;

  const chooseLegCost = (tier: HotelTier) =>
    legs?.[0]
      ? chooseLegOption(legs[0], tier)?.price ?? flight
      : flight;

  const total = (tier: HotelTier) => {
    const legCost = chooseLegCost(tier);
    const min = Math.round((legCost[0] + hotelCost(tier) + meals[0] + localTransport[0] + attractionTickets) * (1 + bufferRate));
    const max = Math.round((legCost[1] + hotelCost(tier) + meals[1] + localTransport[1] + attractionTickets) * (1 + bufferRate));
    return { min, max };
  };

  const rows = (tier: HotelTier) => {
    const hc = hotelCost(tier);
    const legCost = chooseLegCost(tier);
    const flightLabel = legs?.[0]
      ? `Transport PP — ${chooseLegOption(legs[0], tier)?.label ?? "transport"} (${origin.name} ⇄ ${destinationName})`
      : `Transport PP — pesawat (${origin.name} ⇄ ${destinationName})`;
    const base: BudgetRow[] = [
      { label: flightLabel, min: legCost[0], max: legCost[1] },
      { label: `Hotel ${tierLabel(tier)} — ${nights} malam`, min: hc, max: hc },
      { label: `Makan — ${days} hari`, min: meals[0], max: meals[1] },
      { label: "Transport lokal", min: localTransport[0], max: localTransport[1] },
      { label: "Tiket atraksi (sesuai itinerary)", min: attractionTickets, max: attractionTickets },
    ];
    const subMin = base.reduce((s, r) => s + r.min, 0);
    const subMax = base.reduce((s, r) => s + r.max, 0);
    base.push({
      label: "Dana darurat (10%)",
      min: Math.round(subMin * bufferRate),
      max: Math.round(subMax * bufferRate),
    });
    return base;
  };

  const hotels: CityHotel[] = [
    {
      city: destinationName,
      nights,
      perNight: hotelPerNight,
      suggestions: getProfile(destinationName).hotels,
    },
  ];

  return {
    flightLabel: legs?.[0]
      ? `Transport PP — ${chooseLegOption(legs[0], "mid")?.label ?? "transport"}`
      : "Pesawat PP (estimasi OTA)",
    flight,
    ground: groundJittered,
    hotelPerNight,
    hotelSuggestion: getProfile(destinationName).hotels.find((s) => s.tier === "mid"),
    nights,
    meals,
    localTransport,
    attractionTickets,
    bufferRate,
    legs,
    hotels,
    total,
    rows,
  };
}

function buildMultiCityBudget(
  origin: City,
  route: RouteCity[],
  allocations: number[],
  itinerary: ItineraryDay[],
): BudgetBreakdown {
  const routeNames = route.map((r) => r.name);
  const legs: LegCost[] = [];
  for (let i = 0; i <= route.length; i++) {
    const fromName = i === 0 ? origin.name : route[i - 1].name;
    const fromCountry = i === 0 ? origin.country : route[i - 1].country;
    const toName = i === route.length ? origin.name : route[i].name;
    const toCountry = i === route.length ? origin.country : route[i].country;
    const seed = `${fromName}->${toName}`;
    const opts = legTransports(fromName, fromCountry, toName, toCountry).map((o) => ({
      label: o.label,
      price: [
        jitter(seed + "|" + o.label + "0", o.price[0]),
        jitter(seed + "|" + o.label + "1", o.price[1]),
      ] as [number, number],
      duration: o.duration,
      primary: o.primary,
    }));
    legs.push({ from: fromName, to: toName, options: opts });
  }

  const hotels: CityHotel[] = route.map((r, i) => {
    const pricing = getPricing(r.name, r.country, origin.name);
    const seed = `${origin.name}->${r.name}`;
    const perNight: Record<HotelTier, number> = {
      budget: jitter(seed + "hb", pricing.hotel.budget),
      mid: jitter(seed + "hm", pricing.hotel.mid),
      premium: jitter(seed + "hp", pricing.hotel.premium),
    };
    return { city: r.name, nights: allocations[i], perNight, suggestions: getProfile(r.name).hotels };
  });
  const hotelRows = (tier: HotelTier) =>
    hotels
      .filter((h) => h.nights > 0)
      .map((h) => ({
        label: `Hotel ${tierLabel(tier)} di ${h.city} — ${h.nights} malam`,
        min: h.perNight[tier] * h.nights,
        max: h.perNight[tier] * h.nights,
      }));

  const mealsRows = route.map((r, i) => {
    const pricing = getPricing(r.name, r.country, origin.name);
    const seed = `${origin.name}->${r.name}`;
    return {
      label: `Makan di ${r.name} — ${allocations[i]} hari`,
      min: jitter(seed + "m0", pricing.meals[0] * allocations[i]),
      max: jitter(seed + "m1", pricing.meals[1] * allocations[i]),
    };
  });

  const localRows = route.map((r, i) => {
    const pricing = getPricing(r.name, r.country, origin.name);
    const seed = `${origin.name}->${r.name}`;
    return {
      label: `Transport lokal di ${r.name}`,
      min: jitter(seed + "t0", pricing.localTransport[0] * allocations[i]),
      max: jitter(seed + "t1", pricing.localTransport[1] * allocations[i]),
    };
  });

  const attractionTickets = itinerary.reduce(
    (sum, d) => sum + d.activities.reduce((s, a) => s + a.ticket, 0),
    0,
  );

  const bufferRate = 0.1;
  const nights = Math.max(
    0,
    allocations.reduce((a, b) => a + b, 0) - (route.length - 1),
  );

  const buildRows = (tier: HotelTier) => {
    const rows: BudgetRow[] = [
      ...legs.map((leg) => {
        const chosen = chooseLegOption(leg, tier);
        return {
          label: `${leg.from} → ${leg.to} — ${chosen?.label ?? "transport"}`,
          min: chosen?.price[0] ?? 0,
          max: chosen?.price[1] ?? 0,
        };
      }),
      ...hotelRows(tier),
      ...mealsRows,
      ...localRows,
      { label: "Tiket atraksi (sesuai itinerary)", min: attractionTickets, max: attractionTickets },
    ];
    const subMin = rows.reduce((s, r) => s + r.min, 0);
    const subMax = rows.reduce((s, r) => s + r.max, 0);
    rows.push({
      label: "Dana darurat (10%)",
      min: Math.round(subMin * bufferRate),
      max: Math.round(subMax * bufferRate),
    });
    return rows;
  };

  const total = (tier: HotelTier) => {
    const rows = buildRows(tier);
    return {
      min: rows.reduce((s, r) => s + r.min, 0),
      max: rows.reduce((s, r) => s + r.max, 0),
    };
  };

  const flight: [number, number] = [
    legs.reduce((s, leg) => s + (chooseLegOption(leg, "mid")?.price[0] ?? 0), 0),
    legs.reduce((s, leg) => s + (chooseLegOption(leg, "mid")?.price[1] ?? 0), 0),
  ];

  return {
    flightLabel: `Transport antar kota (${legs.length} leg rute)`,
    flight,
    hotelPerNight: hotels[0]?.perNight ?? { budget: 0, mid: 0, premium: 0 },
    nights,
    meals: [mealsRows.reduce((s, r) => s + r.min, 0), mealsRows.reduce((s, r) => s + r.max, 0)],
    localTransport: [
      localRows.reduce((s, r) => s + r.min, 0),
      localRows.reduce((s, r) => s + r.max, 0),
    ],
    attractionTickets,
    bufferRate,
    legs,
    routeNames,
    hotels,
    rows: buildRows,
    total,
  };
}

export function tierLabel(tier: HotelTier): string {
  return tier === "budget" ? "Hemat ★★" : tier === "mid" ? "Mid-range ★★★" : "Premium ★★★★+";
}

/** Kelas Hemat memakai opsi transport termurah; Mid/Premium memprioritaskan pesawat/moda utama. */
export function chooseLegOption(leg: LegCost, tier: HotelTier): LegCost["options"][number] | undefined {
  if (leg.options.length === 0) return undefined;
  if (tier === "budget") {
    return leg.options.reduce((a, b) => (a.price[0] <= b.price[0] ? a : b));
  }
  return leg.options.find((o) => o.primary) ?? leg.options[0];
}

// ---------------------------------------------------------------------------
// Alternatif aktivitas (itinerary yang bisa diubah)
// ---------------------------------------------------------------------------

/** Usulan alternatif untuk satu slot aktivitas, relevan dengan kota & waktunya. */
export function alternativesFor(activity: Activity, profile: DestinationProfile): Activity[] {
  if (activity.kind === "food") {
    return profile.foods
      .filter((f) => !activity.title.includes(f.name))
      .slice(0, 4)
      .map((f) => ({
        time: activity.time,
        title: `Makan: ${f.name}`,
        detail: `Kuliner pilihan di ${profile.city} (${f.priceRange}).`,
        ticket: 0,
        kind: "food" as const,
      }));
  }
  return profile.attractions
    .filter((a) => a.name !== activity.title)
    .slice(0, 4)
    .map((a) => ({
      time: activity.time,
      title: a.name,
      detail: a.desc,
      ticket: a.ticket,
    }));
}

// ---------------------------------------------------------------------------
// Combined plan
// ---------------------------------------------------------------------------

export interface RouteCity {
  name: string;
  country: string;
}

export interface TripInput {
  days: number;
  startDate: Date;
  origin: City;
  destination: string; // nama kota (bisa dari autocomplete atau bebas)
  destinationCountry: string;
  /** Rute kota tujuan berurutan; kosong = mode satu kota (perilaku lama) */
  route?: RouteCity[];
  /** Gaya perjalanan; default "padat" */
  style?: TravelStyle;
}

export interface TripPlan {
  input: TripInput;
  options: DateOption[];
  profile: DestinationProfile;
  /** Profil tiap kota rute (mode multi-kota) */
  profiles?: DestinationProfile[];
  /** Alokasi hari eksplorasi per kota rute (tanpa hari transit) */
  allocations?: number[];
  /** Override aktivitas pengguna: id slot ("day-time") → aktivitas pengganti */
  overrides?: Record<string, Activity>;
}

/**
 * Bagi total hari cuti ke tiap kota: proporsional merata, kota pertama &
 * terakhir diprioritaskan saat pembulatan. Hari perpindahan antar kota
 * dihitung sebagai hari transit (bukan hari eksplorasi).
 */
export function allocateDays(totalDays: number, cityCount: number): number[] {
  const transit = Math.max(0, cityCount - 1);
  const explore = Math.max(cityCount, totalDays - transit);
  const base = Math.floor(explore / cityCount);
  const rem = explore - base * cityCount;
  const order = [0, cityCount - 1, ...Array.from({ length: cityCount - 2 }, (_, i) => i + 1)];
  const result = Array.from({ length: cityCount }, () => base);
  for (let i = 0; i < rem; i++) result[order[i % order.length]]++;
  return result;
}

export function createPlan(input: TripInput): TripPlan {
  const plan: TripPlan = {
    input,
    options: suggestDates(input.days, input.startDate),
    profile: getProfile(input.destination),
  };
  if (input.route && input.route.length > 1) {
    plan.profiles = input.route.map((r) => getProfile(r.name));
    plan.allocations = allocateDays(input.days, input.route.length);
  }
  return plan;
}

/** Terapkan id slot & override pengguna ke semua segmen. */
function finalizeSegments(segments: ItinerarySegment[], plan: TripPlan): ItinerarySegment[] {
  const overrides = plan.overrides ?? {};
  return segments.map((seg) => ({
    ...seg,
    days: seg.days.map((d) => ({
      ...d,
      activities: d.activities.map((a) => {
        const id = `${d.day}-${a.time}`;
        const base = { ...a, id };
        const o = overrides[id];
        return o ? { ...o, id, time: a.time } : base;
      }),
    })),
  }));
}

export function itineraryFor(plan: TripPlan, option: DateOption): ItineraryDay[] {
  return itinerarySegmentsFor(plan, option).flatMap((seg) => seg.days);
}

/** Itinerary terkelompok per segmen kota (mode multi-kota). */
export function itinerarySegmentsFor(plan: TripPlan, option: DateOption): ItinerarySegment[] {
  const start = option.isUserChoice ? plan.input.startDate : option.start;
  const style = plan.input.style ?? "padat";
  if (plan.profiles && plan.allocations) {
    return finalizeSegments(
      buildRouteItinerary(start, plan.allocations, plan.profiles, plan.input.origin.name, style),
      plan,
    );
  }
  return finalizeSegments(
    [
      {
        city: plan.profile.city,
        country: plan.input.destinationCountry,
        profile: plan.profile,
        days: buildItinerary(start, plan.input.days, plan.profile, plan.input.origin.name, style),
        remainingAfter: 0,
      },
    ],
    plan,
  );
}

export function budgetFor(plan: TripPlan, option: DateOption): BudgetBreakdown {
  const it = itineraryFor(plan, option);
  if (plan.profiles && plan.allocations && plan.input.route) {
    return buildMultiCityBudget(plan.input.origin, plan.input.route, plan.allocations, it);
  }
  return estimateBudget(
    plan.input.origin,
    plan.input.destination,
    plan.input.destinationCountry,
    plan.input.days,
    it,
  );
}

/** Alias agar tidak ada unused import */
export { parseISO };
