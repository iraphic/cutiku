export type Language = "id" | "en";

export const LANGUAGES: Language[] = ["id", "en"];

export function formatTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

export const TEXT: Record<Language, {
  header: {
    navForm: string;
    navResults: string;
    navAbout: string;
    languageLabel: string;
    languageId: string;
    languageEn: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    ctaStart: string;
    ctaHow: string;
    stats: Array<{ value: string; label: string }>;
  };
  form: {
    title: string;
    subtitle: string;
    days: string;
    dayLabel: string;
    startDate: string;
    style: string;
    decreaseLeaveDays: string;
    increaseLeaveDays: string;
    origin: string;
    destination: string;
    destinationMulticity: string;
    addButton: string;
    routeMulti: string;
    backToSingle: string;
    buildPlan: string;
    resultSummary: string;
    holidayNearby: string;
    noRouteError: string;
    originRequired: string;
    destinationRequired: string;
    destinationDifferent: string;
    sameOriginStop: string;
    duplicateStop: string;
    route: {
      originFallback: string;
      returnSuffix: string;
      emptyHint: string;
      moveEarlier: string;
      moveLater: string;
      removeFromRoute: string;
    };
  };
  dateOptions: {
    userChoice: string;
    suggested: string;
    selected: string;
    totalDaysOff: string;
    leaveDaysUsed: string;
    holidaysMore: string;
  };
  itinerary: {
    swapHint: string;
    swapLabel: string;
    noAlternatives: string;
    replaceActivity: string;
    mealDetail: string;
    ticketLabel: string;
    transitTag: string;
    transitDaySuffix: string;
    singleCityTitle: string;
    multiCityTitle: string;
    multiCitySubtitle: string;
  };
  budget: {
    title: string;
    nights: string;
    hotelTier: {
      budget: string;
      mid: string;
      premium: string;
    };
    hotelRecommendation: string;
    transportHeader: string;
    transportSelectedTag: string;
    transportNoteBudget: string;
    transportNotePremium: string;
    flightLabelSingle: string;
    flightLabelMulti: string;
    hotelLine: string;
    hotelLineCity: string;
    mealsLine: string;
    mealsLineCity: string;
    localTransportLine: string;
    localTransportLineCity: string;
    attractionTicketsLine: string;
    emergencyFundLine: string;
    totalLabel: string;
    footerNote: string;
    tableCaption: string;
    tableComponent: string;
    tableEstimate: string;
    hotelPerNight: string;
    emergencyFund: string;
    defaultHotel: string;
  };
  savedPlans: {
    title: string;
    empty: string;
    savedOn: string;
    dateLocale: string;
    removeLabel: string;
    saveButton: string;
    saveSuccess: string;
    savedCount: string;
  };
  footer: {
    about: string;
    howItWorksTitle: string;
    howItWorksSteps: string[];
    disclaimerTitle: string;
    disclaimer: string;
    copyright: string;
  };
}>
= {
  id: {
    header: {
      navForm: "Form",
      navResults: "Hasil",
      navAbout: "Tentang",
      languageLabel: "Bahasa",
      languageId: "Indonesia",
      languageEn: "English",
      logoLabel: "CutiKu — kembali ke atas",
    },
    hero: {
      badge: "✈️ Libur nasional 2025–2026 sudah terpasang",
      titleLine1: "Rencanakan Cuti Impianmu,",
      titleLine2: "Tanpa Ribet.",
      description:
        "Pilih lama cuti, tanggal, dan kota tujuan. CutiKu menghitung tanggal paling efektif berdasarkan tanggal merah, menyusun itinerary harian, dan menaksir budget lengkap dalam Rupiah.",
      ctaStart: "Mulai Merencanakan",
      ctaHow: "Cara Kerja",
      stats: [
        { value: "140+", label: "Kota tujuan" },
        { value: "50+", label: "Tanggal merah" },
        { value: "3", label: "Opsi terbaik" },
      ],
    },
    form: {
      title: "Atur Rencana Cutimu",
      subtitle: "Isi 4 hal di bawah — sisanya biar CutiKu yang mikir.",
      days: "Lama Cuti",
      dayLabel: "hari",
      startDate: "Tanggal Mulai",
      style: "Gaya Perjalanan",
      decreaseLeaveDays: "Kurangi hari cuti",
      increaseLeaveDays: "Tambah hari cuti",
      styleOptions: {
        santai: "Santai",
        padat: "Padat",
        explore: "Full Explore",
        santaiDesc: "Aktivitas lebih sedikit & fleksibel, banyak waktu bebas",
        padatDesc: "Itinerary penuh pagi–malam, seimbang",
        exploreDesc: "Maksimalkan destinasi, termasuk day trip",
      },
      origin: "Kota Asal",
      destination: "Kota Tujuan",
      destinationMulticity: "Kota Tujuan (bisa lebih dari satu)",
      originPlaceholder: "Mis. Jakarta",
      destinationPlaceholder: "Mis. Denpasar (Bali), Tokyo, Gili Trawangan…",
      destinationMulticityPlaceholder: "Ketik kota apa pun lalu tekan Tambah — mis. Gili Trawangan…",
      addButton: "Tambah",
      routeMulti: "Rute multi-kota (mis. Singapore → Johor Bahru → Kuala Lumpur)",
      backToSingle: "← Kembali ke satu kota tujuan",
      buildPlan: "Buat Rencana ✈️",
      building: "Menyusun rencana terbaikmu…",
      resultSummary: "{days} hari total · {workdays} hari kerja · {free} hari libur{holidays}",
      holidayNearby: "Tanggal merah terdekat:",
      emptyResults:
        "Hasil rencanamu akan muncul di sini — usulan tanggal terbaik, itinerary harian, dan estimasi budget. 🌴",
      noRouteError: "Tambahkan minimal 1 kota tujuan ke rute.",
      originRequired: "Kota asal wajib diisi.",
      destinationRequired: "Kota tujuan wajib diisi.",
      destinationDifferent: "Kota tujuan harus berbeda dari kota asal.",
      sameOriginStop: "Kota tujuan tidak boleh sama dengan kota asal.",
      duplicateStop: "Kota ini sudah ada di rute perjalananmu.",
      autocomplete: {
        useOption: "Gunakan “{value}”",
        freeNote: "Destinasi bebas — CutiKu menyusun rencana dengan profil generik",
      },
      route: {
        originFallback: "Kota asal",
        returnSuffix: " (pulang)",
        emptyHint: "Tambahkan kota tujuan untuk membangun rute perjalananmu.",
        moveEarlier: "Pindahkan {city} lebih awal",
        moveLater: "Pindahkan {city} lebih akhir",
        removeFromRoute: "Hapus {city} dari rute",
      },
    },
    dateOptions: {
      userChoice: "Tanggal Pilihanmu",
      suggested: "Usulan CutiKu",
      selected: "Terpilih",
      sectionTitle: "Usulan Tanggal Terbaik",
      sectionSubtitle: "Berdasarkan kalender libur nasional Indonesia 2025–2026. Klik kartu untuk memilih.",
      totalDaysOff: "hari libur total",
      leaveDaysUsed: "hari cuti dipakai",
      holidaysMore: "+{count} lagi",
    },
    itinerary: {
      swapHint:
        "💡 Setiap aktivitas bisa diganti — klik tombol Ganti pada slot untuk melihat usulan alternatif. Estimasi tiket & budget ikut diperbarui.",
      swapLabel: "Ganti",
      noAlternatives: "Belum ada alternatif lain untuk slot ini di kota {city}.",
      replaceActivity: "Ganti aktivitas {time}: {title}",
      mealDetail: "Kuliner pilihan di {city} ({priceRange}).",
      ticketLabel: "tiket ±{price}",
      transitTag: "Transit {city}",
      transitDaySuffix: " + {count} hari transit",
      singleCityTitle: "Itinerary {days} Hari di",
      multiCityTitle: "Itinerary {days} Hari",
      multiCitySubtitle: "{count} kota tujuan, hari perpindahan dihitung sebagai transit ringan",
    },
    budget: {
      title: "Estimasi Budget",
      nights: "malam menginap · per orang",
      hotelTier: {
        budget: "Hemat ★★",
        mid: "Mid ★★★",
        premium: "Premium ★★★★+",
      },
      hotelRecommendation: "Rekomendasi Hotel",
      transportHeader: "Opsi transportasi per leg rute",
      transportSelectedTag: "dipakai di total",
      transportNoteBudget:
        "💡 Kelas Hemat: total memakai opsi transport termurah tiap leg — kereta, bus, atau feri bila tersedia.",
      transportNotePremium:
        "💡 Kelas ini memprioritaskan pesawat/moda tercepat tiap leg; alternatif darat/laut tetap tersedia.",
      flightLabelSingle: "Transport PP — {route}",
      flightLabelMulti: "Transport antar kota ({legs} leg rute)",
      hotelLine: "Hotel {tier} — {nights} malam",
      hotelLineCity: "Hotel {tier} di {city} — {nights} malam",
      mealsLine: "Makan — {days} hari",
      mealsLineCity: "Makan di {city} — {days} hari",
      localTransportLine: "Transport lokal",
      localTransportLineCity: "Transport lokal di {city}",
      attractionTicketsLine: "Tiket atraksi (sesuai itinerary)",
      emergencyFundLine: "Dana darurat (10%)",
      groundHint:
        "💡 Alternatif hemat: {label} sekitar {price} untuk rute dekat ini.",
      totalLabel: "Total estimasi per orang",
      footerNote:
        "Estimasi simulasi berdasarkan rata-rata harga OTA dan referensi publik. Harga aktual bervariasi tergantung musim, maskapai, dan waktu pemesanan.",
      hotelPerNight: "{label}: {price}/malam × {nights} malam",
      emergencyFund: "Dana darurat (10%)",
      defaultHotel: "Rekomendasi: {name} ({stars}★)",
      tableCaption: "Rincian komponen budget",
      tableComponent: "Komponen",
      tableEstimate: "Perkiraan",
    },
    savedPlans: {
      title: "Rencana Tersimpan",
      empty:
        "Belum ada rencana tersimpan. Buat rencana lalu klik “Simpan Rencana” — tersimpan aman di browser-mu.",
      savedOn: "Disimpan {date}",
      removeLabel: "Hapus rencana {label}",
      saveButton: "Simpan Rencana",
      saveSuccess: "Tersimpan ✓",
      savedCount: "{count}",
    },
    footer: {
      about:
        "Perencana cuti & liburan untuk pekerja Indonesia: tanggal efektif, itinerary harian, dan estimasi budget dalam Rupiah.",
      howItWorksTitle: "Cara Kerja",
      howItWorksSteps: [
        "Pilih lama cuti, tanggal mulai, kota asal & tujuan.",
        "CutiKu memindai kalender libur nasional untuk tanggal paling efektif.",
        "Dapatkan itinerary harian + rincian budget, lalu simpan rencanamu.",
      ],
      disclaimerTitle: "Disclaimer",
      disclaimer:
        "Seluruh data destinasi, harga tiket, hotel, dan atraksi merupakan simulasi realistis — bukan penawaran harga aktual. Kalender libur mengacu pada SKB 3 Menteri 2025–2026. Selalu verifikasi harga di OTA dan jadwal resmi sebelum memesan.",
      copyright: "© {year} CutiKu v1.0.0 — dibuat dengan ☀️ untuk para pemburu long weekend.",
    },
  },
  en: {
    header: {
      navForm: "Form",
      navResults: "Results",
      navAbout: "About",
      languageLabel: "Language",
      languageId: "Indonesia",
      languageEn: "English",
      logoLabel: "CutiKu — back to top",
    },
    hero: {
      badge: "✈️ National holidays 2025–2026 already included",
      titleLine1: "Plan your dream holiday,",
      titleLine2: "Without the fuss.",
      description:
        "Choose leave length, dates, and destinations. CutiKu scans the holiday calendar, builds a daily itinerary, and estimates your budget in Rupiah.",
      ctaStart: "Start Planning",
      ctaHow: "How It Works",
      stats: [
        { value: "140+", label: "Destinations" },
        { value: "50+", label: "Holiday dates" },
        { value: "3", label: "Best options" },
      ],
    },
    form: {
      title: "Set Up Your Holiday Plan",
      subtitle: "Fill 4 items below — leave the rest to CutiKu.",
      days: "Leave Length",
      dayLabel: "days",
      startDate: "Start Date",
      style: "Travel Style",
      decreaseLeaveDays: "Reduce leave days",
      increaseLeaveDays: "Add leave days",
      styleOptions: {
        santai: "Relaxed",
        padat: "Balanced",
        explore: "Full Explore",
        santaiDesc: "Fewer activities, more flexible downtime",
        padatDesc: "Full morning-to-night itinerary, balanced",
        exploreDesc: "Maximize the destination, including day trips",
      },
      origin: "Origin City",
      destination: "Destination City",
      destinationMulticity: "Destination City (multiple allowed)",
      originPlaceholder: "e.g. Jakarta",
      destinationPlaceholder: "e.g. Denpasar (Bali), Tokyo, Gili Trawangan…",
      destinationMulticityPlaceholder: "Type any city and press Add — e.g. Gili Trawangan…",
      addButton: "Add",
      routeMulti: "Multi-city route (e.g. Singapore → Johor Bahru → Kuala Lumpur)",
      backToSingle: "← Back to single destination",
      buildPlan: "Create Plan ✈️",
      building: "Planning your best trip…",
      resultSummary: "{days} total days · {workdays} workdays · {free} holiday days{holidays}",
      holidayNearby: "Upcoming public holidays:",
      emptyResults:
        "Your plan will appear here — best dates, a daily itinerary, and a full budget estimate. 🌴",
      noRouteError: "Add at least one destination city to the route.",
      originRequired: "Origin city is required.",
      destinationRequired: "Destination city is required.",
      destinationDifferent: "Destination must differ from origin.",
      sameOriginStop: "Destination city cannot match origin.",
      duplicateStop: "This city is already in your route.",
      autocomplete: {
        useOption: "Use “{value}”",
        freeNote: "Free destination — CutiKu will build a generic profile for your trip",
      },
      route: {
        originFallback: "Origin city",
        returnSuffix: " (return)",
        emptyHint: "Add destination cities to build your route.",
        moveEarlier: "Move {city} earlier",
        moveLater: "Move {city} later",
        removeFromRoute: "Remove {city} from route",
      },
    },
    dateOptions: {
      userChoice: "Your Chosen Dates",
      suggested: "CutiKu Suggested",
      selected: "Selected",
      sectionTitle: "Best Date Suggestions",
      sectionSubtitle: "Based on the Indonesian national holiday calendar 2025–2026. Tap a card to select.",
      totalDaysOff: "total leave days",
      leaveDaysUsed: "leave days used",
      holidaysMore: "+{count} more",
    },
    itinerary: {
      swapHint:
        "💡 Every activity can be swapped — click Ganti on a slot to see relevant alternatives. Ticket & budget estimates update automatically.",
      swapLabel: "Swap",
      noAlternatives: "No alternatives available for this slot in {city}.",
      replaceActivity: "Swap activity {time}: {title}",
      mealDetail: "Recommended dining in {city} ({priceRange}).",
      ticketLabel: "ticket approx {price}",
      transitTag: "Transit {city}",
    },
    budget: {
      title: "Budget Estimate",
      nights: "nights stay · per person",
      hotelTier: {
        budget: "Budget ★★",
        mid: "Mid ★★★",
        premium: "Premium ★★★★+",
      },
      hotelRecommendation: "Hotel Recommendations",
      transportHeader: "Transportation options per route leg",
      transportSelectedTag: "used in total",
      transportNoteBudget:
        "💡 Budget class selects the cheapest option for each leg — train, bus, or ferry when available.",
      transportNotePremium:
        "💡 This class prioritizes the fastest/main transport; land/sea alternatives remain visible.",
      flightLabelSingle: "Round-trip transport — {route}",
      flightLabelMulti: "Inter-city transport ({legs} route legs)",
      hotelLine: "Hotel {tier} — {nights} nights",
      hotelLineCity: "Hotel {tier} in {city} — {nights} nights",
      mealsLine: "Meals — {days} days",
      mealsLineCity: "Meals in {city} — {days} days",
      localTransportLine: "Local transport",
      localTransportLineCity: "Local transport in {city}",
      attractionTicketsLine: "Attraction tickets (per itinerary)",
      emergencyFundLine: "Emergency fund (10%)",
      groundHint:
        "💡 Budget alternative: {label} around {price} for this nearby route.",
      totalLabel: "Total estimate per person",
      footerNote:
        "A simulated estimate based on OTA averages and public references. Actual prices vary by season, airline, and booking time.",
      hotelPerNight: "{label}: {price}/night × {nights} nights",
      emergencyFund: "Emergency fund (10%)",
      defaultHotel: "Recommendation: {name} ({stars}★)",
      tableCaption: "Budget component breakdown",
      tableComponent: "Component",
      tableEstimate: "Estimate",
    },
    savedPlans: {
      title: "Saved Plans",
      empty:
        "No saved plans yet. Create one and click “Save Plan” — stored securely in your browser.",
      savedOn: "Saved {date}",
      dateLocale: "en-US",
      removeLabel: "Delete plan {label}",
      saveButton: "Save Plan",
      saveSuccess: "Saved ✓",
      savedCount: "{count}",
    },
    footer: {
      about:
        "Leave and holiday planner for Indonesian travelers: effective dates, daily itinerary, and budget estimates in Rupiah.",
      howItWorksTitle: "How It Works",
      howItWorksSteps: [
        "Choose leave length, start date, origin & destination.",
        "CutiKu scans the national holiday calendar for optimal dates.",
        "Get a daily itinerary + budget breakdown, then save your plan.",
      ],
      disclaimerTitle: "Disclaimer",
      disclaimer:
        "All destination, ticket, hotel, and attraction data are realistic simulations — not actual offers. Holiday dates follow the 2025–2026 SKB 3 Menteri. Always verify prices on OTA platforms and official schedules before booking.",
      copyright: "© {year} CutiKu v1.0.0 — made with ☀️ for long weekend seekers.",
    },
  },
};
