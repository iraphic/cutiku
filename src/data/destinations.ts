export interface Attraction {
  name: string;
  desc: string;
  /** Estimasi tiket masuk per orang dalam Rupiah */
  ticket: number;
}

export interface Food {
  name: string;
  priceRange: string;
}

export interface DestinationProfile {
  city: string;
  tagline: string;
  attractions: Attraction[];
  foods: Food[];
  photos: { url: string; alt: string }[];
  transportNote: string;
  /** Rekomendasi hotel simulasi per kelas (hemat/mid/premium) */
  hotels: HotelSuggestion[];
}

export interface HotelSuggestion {
  name: string;
  stars: number;
  tier: "budget" | "mid" | "premium";
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

// ---------------------------------------------------------------------------
// Rekomendasi hotel simulasi per kota & kelas
// ---------------------------------------------------------------------------

const HOTEL_OVERRIDES: Record<string, [string, string, string]> = {
  "denpasar (bali)": ["POP! Hotel Kuta Beach", "Grand Hyatt Bali", "The St. Regis Bali Resort"],
  yogyakarta: ["Ibis Styles Yogyakarta", "Meliá Purosani Yogyakarta", "Hyatt Regency Yogyakarta"],
  bandung: ["Bobobox Pods Dago", "Hilton Bandung", "The Trans Luxury Hotel"],
  jakarta: ["Ibis Budget Jakarta Cikini", "Hotel Indonesia Kempinski", "The Ritz-Carlton Mega Kuningan"],
  surabaya: ["POP! Hotel Gubeng", "JW Marriott Surabaya", "Shangri-La Surabaya"],
  singapore: ["Capsule Pod Boutique Hostel", "Village Hotel Bugis", "Marina Bay Sands"],
  "kuala lumpur": ["BackHome KL", "Hilton Garden Inn KL", "Mandarin Oriental KL"],
  bangkok: ["Lub d Bangkok Siam", "Novotel Bangkok Siam", "Mandarin Oriental Bangkok"],
  tokyo: ["Nine Hours Shinjuku", "Hotel Gracery Shinjuku", "Aman Tokyo"],
  osaka: ["The Pax Hostel Osaka", "Hotel Hankyu Osaka", "The Ritz-Carlton Osaka"],
  malé: ["The Beehive Malé", "Kurumba Maldives", "Baros Maldives"],
  dubai: ["Rove Downtown Dubai", "Hilton Dubai Jumeirah", "Burj Al Arab Jumeirah"],
  paris: ["Hôtel Jeanne d'Arc Marais", "Hôtel Le Bristol Paris", "The Ritz Paris"],
  london: ["YHA London Central", "The Savoy London", "Claridge's London"],
};

function simpleName(cityName: string): string {
  return cityName.replace(/\s*\(.*?\)\s*/g, "").trim();
}

function hotelSuggestions(cityName: string): HotelSuggestion[] {
  const key = cityName.toLowerCase();
  const [budget, mid, premium] = HOTEL_OVERRIDES[key] ?? [
    `POP! Hotel ${simpleName(cityName)}`,
    `Grand Mercure ${simpleName(cityName)}`,
    `The Royal ${simpleName(cityName)} Resort & Spa`,
  ];
  return [
    { name: budget, stars: 2, tier: "budget" },
    { name: mid, stars: 3, tier: "mid" },
    { name: premium, stars: 5, tier: "premium" },
  ];
}

const p = (
  city: string,
  tagline: string,
  attractions: Attraction[],
  foods: Food[],
  photoIds: [string, string, string],
  photoAlt: string,
  transportNote: string,
): DestinationProfile => ({
  city,
  tagline,
  attractions,
  foods,
  photos: [
    { url: unsplash(photoIds[0]), alt: `${photoAlt} — pemandangan 1` },
    { url: unsplash(photoIds[1]), alt: `${photoAlt} — pemandangan 2` },
    { url: unsplash(photoIds[2]), alt: `${photoAlt} — pemandangan 3` },
  ],
  transportNote,
  hotels: hotelSuggestions(city),
});

const PROFILES: DestinationProfile[] = [
  p(
    "Denpasar (Bali)",
    "Pulau Dewata: pantai, pura, dan sawah terasering",
    [
      { name: "Pantai Kuta", desc: "Sunset legendaris dan ombak ramah pemula untuk surfing.", ticket: 0 },
      { name: "Pura Uluwatu", desc: "Pura di tebing setinggi 70 m dengan tari Kecak saat senja.", ticket: 50000 },
      { name: "Tegallalang Rice Terrace", desc: "Sawah terasering ikonik, spot foto terbaik di Ubud.", ticket: 25000 },
      { name: "Ubud Monkey Forest", desc: "Hutan suci dengan ratusan kera ekor panjang.", ticket: 120000 },
      { name: "Nusa Penida (Kelingking Beach)", desc: "Tur sehari ke tebing berbentuk T-Rex dan air laut sebening kristal.", ticket: 450000 },
      { name: "Tanah Lot", desc: "Pura di atas batu karang, ikon matahari terbenam Bali.", ticket: 60000 },
      { name: "Pantai Sanur", desc: "Pantai tenang untuk bersepeda pagi dan sunrise.", ticket: 0 },
      { name: "Campuhan Ridge Walk", desc: "Trekking ringan di punggung bukit hijau Ubud.", ticket: 0 },
    ],
    [
      { name: "Babi Guling Ibu Oka", priceRange: "Rp50.000–75.000/porsi" },
      { name: "Ayam Betutu Men Tempeh", priceRange: "Rp40.000–60.000/porsi" },
      { name: "Nasi Campur Bali", priceRange: "Rp25.000–45.000/porsi" },
      { name: "Seafood Jimbaran", priceRange: "Rp150.000–300.000/orang" },
    ],
    ["photo-1537996194471-e657df975ab4", "photo-1512100356356-de1b84283e18", "photo-1604999333679-b86d54738315"],
    "Bali",
    "Sewa skuter ±Rp80.000/hari atau mobil + sopir ±Rp550.000/hari; ojek online tersedia di area wisata utama.",
  ),
  p(
    "Yogyakarta",
    "Kota budaya: candi, keraton, dan gudeg hangat",
    [
      { name: "Candi Borobudur", desc: "Candi Buddha terbesar di dunia, magis saat sunrise.", ticket: 120000 },
      { name: "Candi Prambanan", desc: "Kompleks candi Hindu megah dengan pertunjukan Ramayana.", ticket: 100000 },
      { name: "Keraton Yogyakarta", desc: "Istana Sultan yang masih aktif, pusat budaya Jawa.", ticket: 15000 },
      { name: "Malioboro", desc: "Jalan belanja legendaris, angkringan, dan becak.", ticket: 0 },
      { name: "Gumuk Pasir Parangkusumo", desc: "Sandboarding di gurun mini tepi pantai selatan.", ticket: 70000 },
      { name: "Goa Pindul", desc: "Cave tubing menyusuri sungai bawah tanah.", ticket: 60000 },
      { name: "Taman Sari", desc: "Bekas taman air kerajaan yang fotogenik.", ticket: 15000 },
      { name: "Lava Tour Merapi", desc: "Jeep adventure di lereng Gunung Merapi.", ticket: 400000 },
    ],
    [
      { name: "Gudeg Yu Djum", priceRange: "Rp25.000–45.000/porsi" },
      { name: "Sate Klathak Pak Pong", priceRange: "Rp30.000–50.000/porsi" },
      { name: "Bakpia Pathok 25", priceRange: "Rp35.000–60.000/kotak" },
      { name: "Kopi Joss Angkringan", priceRange: "Rp5.000–15.000/gelas" },
    ],
    ["photo-1596402184320-417e7178b2cd", "photo-1620549146396-9024d914cd99", "photo-1589308078059-be1415eab4c3"],
    "Yogyakarta",
    "Trans Jogja Rp3.500/perjalanan; sewa motor ±Rp75.000/hari; andong & becak untuk jarak pendek di Malioboro.",
  ),
  p(
    "Bandung",
    "Paris van Java: kawah, kafe, dan factory outlet",
    [
      { name: "Kawah Putih Ciwidey", desc: "Danau kawah berwarna toska yang sureal.", ticket: 50000 },
      { name: "Tangkuban Perahu", desc: "Kawah gunung berapi aktif yang bisa dilihat dari bibirnya.", ticket: 30000 },
      { name: "Dusun Bambu Lembang", desc: "Taman wisata keluarga dengan restoran di tepi danau.", ticket: 40000 },
      { name: "Floating Market Lembang", desc: "Pasar terapung dengan jajanan khas Sunda.", ticket: 35000 },
      { name: "Jalan Braga", desc: "Kawasan heritage penuh kafe dan galeri seni.", ticket: 0 },
      { name: "Orchid Forest Cikole", desc: "Hutan anggrek dengan jembatan gantung dan lampu malam.", ticket: 40000 },
      { name: "Gedung Sate", desc: "Ikon arsitektur kolonial Bandung.", ticket: 0 },
      { name: "The Great Asia Africa", desc: "Taman miniatur 7 negara, spot foto populer.", ticket: 50000 },
    ],
    [
      { name: "Batagor Kingsley", priceRange: "Rp25.000–40.000/porsi" },
      { name: "Sate Maranggi Cibungur", priceRange: "Rp40.000–60.000/porsi" },
      { name: "Surabi Enhaii", priceRange: "Rp15.000–30.000/porsi" },
      { name: "Mie Kocok Bandung", priceRange: "Rp20.000–35.000/mangkuk" },
    ],
    ["photo-1596436889106-be35e843f974", "photo-1628151015968-3a4429e9ef04", "photo-1570804489748-3e9a2a12c9b3"],
    "Bandung",
    "Angkot Rp5.000–10.000; ojek online melimpah; untuk area Lembang/Ciwidey lebih nyaman sewa mobil ±Rp500.000/hari.",
  ),
  p(
    "Lombok",
    "Gili, pantai pink, dan kaki Gunung Rinjani",
    [
      { name: "Gili Trawangan", desc: "Pulau bebas kendaraan bermotor, snorkeling dan sunset.", ticket: 85000 },
      { name: "Pantai Kuta Mandalika", desc: "Pasir putih dan bukit merese, dekat sirkuit MotoGP.", ticket: 0 },
      { name: "Pantai Pink (Tangsi)", desc: "Salah satu dari sedikit pantai berpasir merah muda di dunia.", ticket: 50000 },
      { name: "Air Terjun Sendang Gile", desc: "Air terjun megah di kaki Rinjani, Senaru.", ticket: 20000 },
      { name: "Bukit Selong", desc: "Viewpoint hamparan sawah berpetak warna-warni.", ticket: 10000 },
      { name: "Desa Sade", desc: "Desa adat Suku Sasak dengan rumah tradisional.", ticket: 20000 },
      { name: "Gili Meno & Gili Air", desc: "Island hopping, patung bawah laut Nest.", ticket: 120000 },
      { name: "Tanjung Aan", desc: "Pantai pasir merica dengan bukit pandang 360°.", ticket: 10000 },
    ],
    [
      { name: "Ayam Taliwang", priceRange: "Rp45.000–70.000/porsi" },
      { name: "Plecing Kangkung", priceRange: "Rp15.000–25.000/porsi" },
      { name: "Sate Rembiga", priceRange: "Rp30.000–50.000/porsi" },
      { name: "Nasi Balap Puyung", priceRange: "Rp20.000–35.000/porsi" },
    ],
    ["photo-1570789210967-2cac24afeb00", "photo-1544644181-1484b3fdfc62", "photo-1516690561799-46d8f74f9abf"],
    "Lombok",
    "Sewa motor ±Rp75.000/hari; fast boat ke Gili ±Rp85.000/sekali jalan; mobil + sopir ±Rp600.000/hari.",
  ),
  p(
    "Labuan Bajo",
    "Gerbang Taman Nasional Komodo",
    [
      { name: "Pulau Padar", desc: "Viewpoint tiga teluk ikonik, terbaik saat sunrise.", ticket: 150000 },
      { name: "Pulau Komodo", desc: "Trekking melihat komodo di habitat aslinya bersama ranger.", ticket: 300000 },
      { name: "Pink Beach", desc: "Pantai berpasir pink dengan terumbu karang dangkal.", ticket: 100000 },
      { name: "Manta Point", desc: "Snorkeling bersama pari manta.", ticket: 200000 },
      { name: "Pulau Kelor", desc: "Bukit kecil dengan panorama laut biru.", ticket: 50000 },
      { name: "Gua Rangko", desc: "Gua dengan kolam air asin sebening kaca.", ticket: 100000 },
      { name: "Bukit Sylvia", desc: "Spot sunset terbaik di kota Labuan Bajo.", ticket: 0 },
      { name: "Desa Wae Rebo (overland)", desc: "Desa adat di atas awan, rumah kerucut Mbaru Niang.", ticket: 350000 },
    ],
    [
      { name: "Ikan Bakar Kampung Ujung", priceRange: "Rp60.000–120.000/porsi" },
      { name: "Jagung Bose", priceRange: "Rp15.000–25.000/porsi" },
      { name: "Se'i Sapi", priceRange: "Rp40.000–60.000/porsi" },
      { name: "Kopi Flores Bajawa", priceRange: "Rp15.000–30.000/cangkir" },
    ],
    ["photo-1573790387438-4da905039392", "photo-1589302168068-964664d93dc0", "photo-1559827260-dc66d52bef19"],
    "Labuan Bajo",
    "Open trip sailing 3D2N ±Rp3.000.000–4.500.000/orang sudah termasuk kapal & makan; ojek dan travel lokal untuk dalam kota.",
  ),
  p(
    "Jakarta",
    "Ibu kota: kuliner, museum, dan skyline metropolitan",
    [
      { name: "Monas & Kota Tua", desc: "Ikon nasional plus kawasan heritage Batavia.", ticket: 20000 },
      { name: "Taman Mini Indonesia Indah", desc: "Miniatur budaya 38 provinsi dalam satu taman.", ticket: 35000 },
      { name: "Ancol & Dufan", desc: "Theme park terbesar di Indonesia di tepi laut.", ticket: 250000 },
      { name: "Kepulauan Seribu", desc: "Trip sehari ke pulau berpasir putih utara Jakarta.", ticket: 400000 },
      { name: "Museum Nasional", desc: "Museum gajah, koleksi arkeologi terlengkap.", ticket: 25000 },
      { name: "PIK Pantjoran & Pantai Indah Kapuk", desc: "Kuliner modern dan mangrove boardwalk.", ticket: 0 },
      { name: "Sarinah & Bundaran HI", desc: "Belanja dan city walk di jantung kota.", ticket: 0 },
      { name: "Ragunan", desc: "Kebun binatang tertua, rumah pusat primata Schmutzer.", ticket: 5000 },
    ],
    [
      { name: "Soto Betawi H. Ma'ruf", priceRange: "Rp35.000–55.000/mangkuk" },
      { name: "Nasi Uduk Kebon Kacang", priceRange: "Rp20.000–40.000/porsi" },
      { name: "Kerak Telor", priceRange: "Rp25.000–35.000/porsi" },
      { name: "Street food Pecenongan", priceRange: "Rp30.000–80.000/orang" },
    ],
    ["photo-1555899434-94d1368aa7af", "photo-1596401057633-54a8fe8ef647", "photo-1600121848594-d8644e57abab"],
    "Jakarta",
    "MRT/KRL/TransJakarta Rp3.500–14.000; ojek online mudah; hindari jam sibuk 07.00–09.00 & 17.00–19.00.",
  ),
  p(
    "Singapore",
    "Kota taman futuristik di persimpangan Asia",
    [
      { name: "Gardens by the Bay", desc: "Supertree Grove dan Cloud Forest yang ikonik.", ticket: 350000 },
      { name: "Marina Bay Sands SkyPark", desc: "Observatorium 57 lantai di atas kota.", ticket: 300000 },
      { name: "Universal Studios Singapore", desc: "Theme park kelas dunia di Sentosa.", ticket: 950000 },
      { name: "Sentosa & Pantai Siloso", desc: "Pulau resort: pantai, luge, dan cable car.", ticket: 150000 },
      { name: "Merlion Park", desc: "Ikon Singapura dengan latar Marina Bay.", ticket: 0 },
      { name: "Chinatown & Little India", desc: "Kawasan budaya dan kuliner kaki lima legendaris.", ticket: 0 },
      { name: "Singapore Zoo & Night Safari", desc: "Kebun binatang terbuka terbaik dunia.", ticket: 600000 },
      { name: "Jewel Changi", desc: "Air terjun indoor tertinggi dunia di bandara.", ticket: 0 },
    ],
    [
      { name: "Hainanese Chicken Rice (Maxwell)", priceRange: "Rp60.000–90.000/porsi" },
      { name: "Laksa Katong", priceRange: "Rp70.000–100.000/mangkuk" },
      { name: "Chilli Crab", priceRange: "Rp500.000–900.000/porsi (sharing)" },
      { name: "Kaya Toast & Kopi", priceRange: "Rp40.000–70.000/set" },
    ],
    ["photo-1525625293386-3f8f99389edd", "photo-1565967511849-76a60a516170", "photo-1496939376851-89342e90adcd"],
    "Singapore",
    "MRT + EZ-Link/SimplyGo ±Rp120.000–200.000/hari; Grab tersedia; kota sangat walkable.",
  ),
  p(
    "Kuala Lumpur",
    "Menara kembar dan surga kuliner kaki lima",
    [
      { name: "Petronas Twin Towers", desc: "Skybridge menara kembar ikonik di KLCC.", ticket: 350000 },
      { name: "Batu Caves", desc: "Kuil Hindu dalam gua kapur dengan 272 anak tangga.", ticket: 0 },
      { name: "KL Tower", desc: "Menara pandang 421 m dengan sky deck.", ticket: 200000 },
      { name: "Bukit Bintang & Jalan Alor", desc: "Distrik belanja dan food street paling ramai.", ticket: 0 },
      { name: "Dataran Merdeka", desc: "Lapangan kemerdekaan dan bangunan kolonial.", ticket: 0 },
      { name: "Central Market & Petaling Street", desc: "Pasar seni dan Chinatown.", ticket: 0 },
      { name: "KL Bird Park", desc: "Taman burung free-flight terbesar di Asia.", ticket: 250000 },
      { name: "Sunway Lagoon", desc: "Theme park air & petualangan terbesar Malaysia.", ticket: 550000 },
    ],
    [
      { name: "Nasi Lemak Village Park", priceRange: "Rp35.000–55.000/porsi" },
      { name: "Char Kway Teow", priceRange: "Rp30.000–50.000/porsi" },
      { name: "Roti Canai & Teh Tarik", priceRange: "Rp15.000–30.000/set" },
      { name: "Satay Kajang", priceRange: "Rp40.000–70.000/porsi" },
    ],
    ["photo-1596422846543-75c6fc197f07", "photo-1598299805716-90f2f9a1dd56", "photo-1570168007204-dfb528c6958f"],
    "Kuala Lumpur",
    "LRT/MRT/monorel Rp10.000–25.000/trip; Grab murah dan melimpah; GoKL bus gratis di pusat kota.",
  ),
  p(
    "Bangkok",
    "Kuil emas, street food, dan kota yang tak pernah tidur",
    [
      { name: "Grand Palace & Wat Phra Kaew", desc: "Istana raja dan kuil Buddha Zamrud.", ticket: 250000 },
      { name: "Wat Arun", desc: "Kuil fajar di tepi Chao Phraya, magis saat senja.", ticket: 50000 },
      { name: "Wat Pho", desc: "Kuil Buddha berbaring raksasa, rumah pijat Thai.", ticket: 100000 },
      { name: "Chatuchak Weekend Market", desc: "Pasar akhir pekan dengan 15.000 kios.", ticket: 0 },
      { name: "Khao San Road", desc: "Jalan backpacker paling legendaris se-Asia.", ticket: 0 },
      { name: "Iconsiam & Sungai Chao Phraya", desc: "Mal mewah tepi sungai plus river cruise.", ticket: 150000 },
      { name: "Damnoen Saduak Floating Market", desc: "Pasar terapung klasik di luar kota.", ticket: 300000 },
      { name: "Jim Thompson House", desc: "Museum rumah kayu jati dan sutra Thailand.", ticket: 100000 },
    ],
    [
      { name: "Pad Thai Thipsamai", priceRange: "Rp50.000–80.000/porsi" },
      { name: "Tom Yum Goong", priceRange: "Rp60.000–100.000/mangkuk" },
      { name: "Mango Sticky Rice", priceRange: "Rp30.000–50.000/porsi" },
      { name: "Boat Noodle Victory Monument", priceRange: "Rp15.000–25.000/mangkuk" },
    ],
    ["photo-1508009603885-50cf7c579365", "photo-1563492065599-3520f775eeed", "photo-1552465011-b4e21bf6e79a"],
    "Bangkok",
    "BTS/MRT Rp20.000–50.000/trip; tuk-tuk tawar-menawar; Grab & boat express sungai sangat praktis.",
  ),
  p(
    "Tokyo",
    "Metropolis neon dan tradisi seribu tahun",
    [
      { name: "Shibuya Crossing & Hachiko", desc: "Persimpangan tersibuk di dunia.", ticket: 0 },
      { name: "Senso-ji Asakusa", desc: "Kuil tertua Tokyo dengan gerbang Kaminarimon.", ticket: 0 },
      { name: "Tokyo Skytree", desc: "Menara 634 m dengan panorama sampai Gunung Fuji.", ticket: 250000 },
      { name: "teamLab Planets", desc: "Museum seni digital imersif.", ticket: 400000 },
      { name: "Meiji Jingu & Harajuku", desc: "Kuil hutan suci + jalan mode Takeshita.", ticket: 0 },
      { name: "Shinjuku Gyoen", desc: "Taman nasional terindah, spot sakura & momiji.", ticket: 60000 },
      { name: "Akihabara & Nakano", desc: "Surga anime, game, dan elektronik.", ticket: 0 },
      { name: "Day trip: Gunung Fuji / Hakone", desc: "Danau, onsen, dan pemandangan Fuji.", ticket: 600000 },
    ],
    [
      { name: "Sushi Tsukiji Outer Market", priceRange: "Rp150.000–400.000/orang" },
      { name: "Ramen Ichiran", priceRange: "Rp120.000–180.000/mangkuk" },
      { name: "Gyukatsu & Tonkatsu", priceRange: "Rp130.000–250.000/porsi" },
      { name: "Onigiri & Bento Konbini", priceRange: "Rp30.000–80.000/orang" },
    ],
    ["photo-1540959733332-eab4deabeeaf", "photo-1542931287-023b922fa89b", "photo-1493976040374-85c8e12f0c0e"],
    "Tokyo",
    "Suica/Pasmo untuk metro ±Rp100.000–200.000/hari; kereta sangat tepat waktu; hindari rush hour 07.30–09.30.",
  ),
  p(
    "Osaka",
    "Dapur Jepang: kastil, dotonbori, dan takoyaki",
    [
      { name: "Osaka Castle", desc: "Kastil legendaris dengan taman luas.", ticket: 80000 },
      { name: "Dotonbori", desc: "Kanal neon Glico Man, pusat kuliner malam.", ticket: 0 },
      { name: "Universal Studios Japan", desc: "Super Nintendo World dan Wizarding World.", ticket: 900000 },
      { name: "Shinsekai & Tsutenkaku", desc: "Distrik retro dengan menara pandang.", ticket: 100000 },
      { name: "Kuromon Ichiba Market", desc: "Pasar dapur Osaka: seafood dan wagyu skewer.", ticket: 0 },
      { name: "Umeda Sky Building", desc: "Observatorium terapung 173 m.", ticket: 200000 },
      { name: "Day trip: Nara", desc: "Rusa jinak dan Buddha raksasa Todai-ji.", ticket: 100000 },
      { name: "Day trip: Kyoto (Fushimi Inari)", desc: "Seribu gerbang torii merah.", ticket: 0 },
    ],
    [
      { name: "Takoyaki Juhachiban", priceRange: "Rp50.000–80.000/porsi" },
      { name: "Okonomiyaki Mizuno", priceRange: "Rp100.000–160.000/porsi" },
      { name: "Kushikatsu Daruma", priceRange: "Rp90.000–150.000/orang" },
      { name: "Kuromon Seafood", priceRange: "Rp100.000–300.000/orang" },
    ],
    ["photo-1590559899731-a382839e5549", "photo-1593640408182-31c70c8268f5", "photo-1569051399758-4f0b8b6a6b3f"],
    "Osaka",
    "ICOCA card untuk metro; Osaka Amazing Pass hemat untuk banyak atraksi; banyak area walkable.",
  ),
  p(
    "Seoul",
    "Istana dinasti, K-pop, dan kafe estetik",
    [
      { name: "Gyeongbokgung", desc: "Istana utama Dinasti Joseon + pergantian penjaga.", ticket: 40000 },
      { name: "Bukchon Hanok Village", desc: "Desa rumah tradisional hanok di tengah kota.", ticket: 0 },
      { name: "N Seoul Tower", desc: "Menara Namsan dengan gembok cinta.", ticket: 150000 },
      { name: "Myeongdong", desc: "Surga belanja skincare dan street food.", ticket: 0 },
      { name: "Hongdae", desc: "Distrik anak muda, busking, dan nightlife.", ticket: 0 },
      { name: "Sungai Han & Banpo Bridge", desc: "Piknik tepi sungai + air mancur pelangi.", ticket: 0 },
      { name: "DMZ Tour (sehari)", desc: "Tur perbatasan Korea yang bersejarah.", ticket: 600000 },
      { name: "Lotte World", desc: "Theme park indoor-outdoor terbesar Korea.", ticket: 500000 },
    ],
    [
      { name: "Korean BBQ Mapo", priceRange: "Rp150.000–300.000/orang" },
      { name: "Bibimbap Jeonju", priceRange: "Rp80.000–130.000/porsi" },
      { name: "Tteokbokki Sindang-dong", priceRange: "Rp50.000–90.000/porsi" },
      { name: "Ayam Goreng Korea & Chimaek", priceRange: "Rp120.000–200.000/orang" },
    ],
    ["photo-1517154421773-0529f29ea451", "photo-1538485399081-7191377e8241", "photo-1548115184-bc6544d06a58"],
    "Seoul",
    "T-money card untuk subway ±Rp60.000–120.000/hari; subway luas dan berbahasa Inggris; Kakao T untuk taksi.",
  ),
  p(
    "Hong Kong",
    "Kota vertikal: skyline, dim sum, dan feri bintang",
    [
      { name: "Victoria Peak", desc: "Panorama skyline dari puncak tertinggi pulau.", ticket: 200000 },
      { name: "Star Ferry & Tsim Sha Tsui", desc: "Feri legendaris + Avenue of Stars.", ticket: 30000 },
      { name: "Symphony of Lights", desc: "Pertunjukan cahaya gedung pencakar langit.", ticket: 0 },
      { name: "Ngong Ping 360 & Tian Tan Buddha", desc: "Cable car ke patung Buddha raksasa.", ticket: 350000 },
      { name: "Temple Street Night Market", desc: "Pasar malam klasik Kowloon.", ticket: 0 },
      { name: "Hong Kong Disneyland", desc: "Taman Disney dengan kastil termungil.", ticket: 900000 },
      { name: "Ocean Park", desc: "Theme park + akuarium di tepi laut.", ticket: 600000 },
      { name: "Wong Tai Sin Temple", desc: "Kuil paling ramai dan penuh warna.", ticket: 0 },
    ],
    [
      { name: "Dim Sum Tim Ho Wan", priceRange: "Rp100.000–200.000/orang" },
      { name: "Roast Goose Yat Lok", priceRange: "Rp120.000–250.000/porsi" },
      { name: "Egg Tart & Milk Tea", priceRange: "Rp30.000–60.000/set" },
      { name: "Wonton Noodle Mak's", priceRange: "Rp70.000–120.000/mangkuk" },
    ],
    ["photo-1536599018102-9f803c140fc1", "photo-1507941097613-9f2157b69235", "photo-1555881400-74d7acaacd8b"],
    "Hong Kong",
    "Octopus card untuk MRT/tram/feri ±Rp100.000–180.000/hari; ding-ding tram murah meriah di Hong Kong Island.",
  ),
  p(
    "Taipei",
    "Kota teh, pasar malam, dan Taipei 101",
    [
      { name: "Taipei 101", desc: "Gedung ikonik dengan lift tercepat dunia.", ticket: 350000 },
      { name: "Shilin Night Market", desc: "Pasar malam terbesar dan terlengkap.", ticket: 0 },
      { name: "Chiang Kai-shek Memorial Hall", desc: "Monumen megah dengan pergantian penjaga.", ticket: 0 },
      { name: "Jiufen Old Street", desc: "Desa lereng bukit inspirasi Spirited Away.", ticket: 0 },
      { name: "Elephant Mountain (Xiangshan)", desc: "Hiking singkat, view Taipei 101 terbaik.", ticket: 0 },
      { name: "Longshan Temple", desc: "Kuil tua paling spiritual di Taipei.", ticket: 0 },
      { name: "National Palace Museum", desc: "Koleksi artefak kekaisaran Tiongkok terbesar.", ticket: 250000 },
      { name: "Tamsui", desc: "Kota tepi sungai untuk sunset dan street snack.", ticket: 0 },
    ],
    [
      { name: "Beef Noodle Yongkang", priceRange: "Rp80.000–140.000/mangkuk" },
      { name: "Xiao Long Bao Din Tai Fung", priceRange: "Rp150.000–300.000/orang" },
      { name: "Bubble Tea Chun Shui Tang", priceRange: "Rp40.000–70.000/gelas" },
      { name: "Fried Chicken Shilin", priceRange: "Rp40.000–70.000/porsi" },
    ],
    ["photo-1470004914212-05527e49370b", "photo-1552993873-0dd1110e025f", "photo-1508248467877-aec1b08de376"],
    "Taipei",
    "EasyCard untuk MRT/bus ±Rp60.000–120.000/hari; YouBike murah; kereta cepat ke Jiufen mudah.",
  ),
  p(
    "Malé",
    "Gerbang resor dan atol Maladewa",
    [
      { name: "Resort Day Pass", desc: "Nikmati resor mewah sehari tanpa menginap.", ticket: 1200000 },
      { name: "Sandbank Picnic Trip", desc: "Gosong pasir putih di tengah laut biru.", ticket: 800000 },
      { name: "Snorkeling Banana Reef", desc: "Terumbu karang warna-warni dekat Malé.", ticket: 600000 },
      { name: "Hukuru Miskiy & Fish Market", desc: "Masjid karang tua dan pasar ikan lokal.", ticket: 0 },
      { name: "Dolphin Sunset Cruise", desc: "Kapal dhoni melihat lumba-lumba senja hari.", ticket: 700000 },
      { name: "Pulau Maafushi", desc: "Pulau lokal dengan guesthouse terjangkau.", ticket: 100000 },
    ],
    [
      { name: "Mas Huni (sarapan khas)", priceRange: "Rp40.000–70.000/porsi" },
      { name: "Garudhiya (sup ikan)", priceRange: "Rp50.000–90.000/mangkuk" },
      { name: "Seafood BBQ tepi pantai", priceRange: "Rp150.000–350.000/orang" },
    ],
    ["photo-1514282401047-d79a71a590e8", "photo-1573843981267-be1999ff37cd", "photo-1540202404-a2f29016b523"],
    "Maladewa",
    "Speedboat antar-pulau Rp200.000–800.000; public ferry lokal sangat murah namun terbatas jadwalnya.",
  ),
  p(
    "Dubai",
    "Gurun emas dan gedung tertinggi di dunia",
    [
      { name: "Burj Khalifa", desc: "Observatorium lantai 124–125 gedung tertinggi dunia.", ticket: 700000 },
      { name: "Desert Safari", desc: "Dune bashing, BBQ, dan tari perut di gurun.", ticket: 650000 },
      { name: "Dubai Mall & Fountain", desc: "Mal terbesar + air mancur menari.", ticket: 0 },
      { name: "Old Dubai: Al Fahidi & Abra", desc: "Kota tua dan perahu kayu menyeberangi creek.", ticket: 10000 },
      { name: "Palm Jumeirah & Atlantis", desc: "Pulau buatan berbentuk palem.", ticket: 300000 },
      { name: "Dubai Miracle Garden", desc: "Taman bunga terbesar dunia (Nov–Apr).", ticket: 300000 },
      { name: "Global Village", desc: "Festival budaya 90+ negara (musiman).", ticket: 150000 },
      { name: "Museum of the Future", desc: "Museum arsitektur paling fotogenik.", ticket: 700000 },
    ],
    [
      { name: "Shawarma Al Mallah", priceRange: "Rp50.000–90.000/porsi" },
      { name: "Mandi & Kabsa", priceRange: "Rp120.000–200.000/porsi" },
      { name: "Karak Chai & Luqaimat", priceRange: "Rp30.000–60.000/set" },
      { name: "Buffet Jumat (Friday Brunch)", priceRange: "Rp400.000–900.000/orang" },
    ],
    ["photo-1512453979798-5ea266f8880c", "photo-1518684079-3c830dcef090", "photo-1526495124232-a04e184ab8c8"],
    "Dubai",
    "Nol card untuk metro & tram ±Rp80.000–150.000/hari; Careem/Uber nyaman; metro menghubungkan bandara–Marina.",
  ),
  p(
    "Istanbul",
    "Dua benua, masjid megah, dan bazar seribu toko",
    [
      { name: "Hagia Sophia", desc: "Mahakarya Bizantium–Ottoman 1.500 tahun.", ticket: 250000 },
      { name: "Blue Mosque (Sultanahmet)", desc: "Masjid enam menara dengan keramik biru Iznik.", ticket: 0 },
      { name: "Topkapi Palace", desc: "Istana sultan Ottoman di tepi Bosphorus.", ticket: 350000 },
      { name: "Grand Bazaar", desc: "Salah satu pasar tertua dunia, 4.000 toko.", ticket: 0 },
      { name: "Bosphorus Cruise", desc: "Pelayaran membelah Eropa dan Asia.", ticket: 150000 },
      { name: "Galata Tower & Karaköy", desc: "Menara batu abad pertengahan + distrik hipster.", ticket: 200000 },
      { name: "Balat & Fener", desc: "Rumah warna-warni paling Instagramable.", ticket: 0 },
      { name: "Basilica Cistern", desc: "Istana bawah tanah berpilar ratusan.", ticket: 250000 },
    ],
    [
      { name: "Kebab Testi & Adana", priceRange: "Rp100.000–200.000/porsi" },
      { name: "Baklava Karaköy Güllüoğlu", priceRange: "Rp60.000–120.000/porsi" },
      { name: "Balık Ekmek Eminönü", priceRange: "Rp50.000–90.000/porsi" },
      { name: "Turkish Breakfast (Kahvaltı)", priceRange: "Rp100.000–200.000/orang" },
    ],
    ["photo-1524231757912-21f4fe3a7200", "photo-1527838832700-5059252407fa", "photo-1541432901042-2d8bd64b4a9b"],
    "Istanbul",
    "Istanbulkart untuk tram/metro/feri ±Rp50.000–100.000/hari; feri Bosphorus murah dan indah.",
  ),
  p(
    "Paris",
    "Kota cahaya: menara, museum, dan croissant",
    [
      { name: "Menara Eiffel", desc: "Ikon dunia, berkilau tiap jam malam.", ticket: 350000 },
      { name: "Museum Louvre", desc: "Mona Lisa dan piramida kaca.", ticket: 400000 },
      { name: "Montmartre & Sacré-Cœur", desc: "Bukit seniman dan basilika putih.", ticket: 0 },
      { name: "Seine River Cruise", desc: "Berlayar melewati Notre-Dame dan Orsay.", ticket: 250000 },
      { name: "Champs-Élysées & Arc de Triomphe", desc: "Bulevar termasyhur dan gapura kemenangan.", ticket: 250000 },
      { name: "Jardin du Luxembourg", desc: "Taman kota paling romantis.", ticket: 0 },
      { name: "Le Marais", desc: "Distrik vintage, falafel, dan galeri.", ticket: 0 },
      { name: "Day trip: Versailles", desc: "Istana emas Raja Matahari.", ticket: 500000 },
    ],
    [
      { name: "Croissant & Café au Lait", priceRange: "Rp70.000–120.000/set" },
      { name: "Crêpe Nutella pinggir jalan", priceRange: "Rp60.000–100.000/buah" },
      { name: "Boeuf Bourguignon bistro", priceRange: "Rp250.000–450.000/porsi" },
      { name: "Macaron Ladurée", priceRange: "Rp50.000–90.000/buah" },
    ],
    ["photo-1502602898657-3e91760cbb34", "photo-1499856871958-5b9627545d1a", "photo-1467269204594-9661b134dd2b"],
    "Paris",
    "Navigo/Easy pass untuk metro ±Rp120.000–200.000/hari; pusat kota sangat nyaman dijelajahi jalan kaki.",
  ),
  p(
    "London",
    "Kota kerajaan, bus merah, dan museum gratis",
    [
      { name: "London Eye", desc: "Bianglala raksasa di tepi Thames.", ticket: 600000 },
      { name: "Tower of London & Tower Bridge", desc: "Benteng mahkota dan jembatan ikonik.", ticket: 550000 },
      { name: "British Museum", desc: "Rosetta Stone dan artefak dunia, gratis.", ticket: 0 },
      { name: "Buckingham Palace", desc: "Pergantian penjaga istana raja.", ticket: 0 },
      { name: "Westminster & Big Ben", desc: "Parlemen dan menara jam legendaris.", ticket: 0 },
      { name: "Camden Market", desc: "Pasar alternatif paling unik di London.", ticket: 0 },
      { name: "Notting Hill & Portobello Road", desc: "Rumah pastel dan pasar antik.", ticket: 0 },
      { name: "West End Musical", desc: "Teater musikal kelas dunia.", ticket: 700000 },
    ],
    [
      { name: "Fish & Chips Poppies", priceRange: "Rp150.000–250.000/porsi" },
      { name: "English Breakfast", priceRange: "Rp150.000–300.000/porsi" },
      { name: "Sunday Roast di pub", priceRange: "Rp250.000–450.000/porsi" },
      { name: "Afternoon Tea", priceRange: "Rp400.000–900.000/orang" },
    ],
    ["photo-1513635269975-59663e0ac1ad", "photo-1486299267070-83823f5448dd", "photo-1533929736458-ca588d08c8be"],
    "London",
    "Oyster/contactless untuk tube ±Rp120.000–220.000/hari (ada daily cap); bus tingkat ikonik dan murah.",
  ),
  p(
    "Amsterdam",
    "Kota kanal, sepeda, dan rumah berleher angsa",
    [
      { name: "Canal Cruise", desc: "Menyusuri kanal warisan UNESCO.", ticket: 250000 },
      { name: "Rijksmuseum", desc: "Night Watch karya Rembrandt.", ticket: 400000 },
      { name: "Van Gogh Museum", desc: "Koleksi Van Gogh terlengkap dunia.", ticket: 400000 },
      { name: "Anne Frank House", desc: "Rumah persembunyian bersejarah (wajib booking).", ticket: 250000 },
      { name: "Jordaan", desc: "Distrik paling fotogenik penuh kafe.", ticket: 0 },
      { name: "Vondelpark", desc: "Taman kota untuk piknik dan sepedaan.", ticket: 0 },
      { name: "Day trip: Zaanse Schans", desc: "Desa kincir angin klasik Belanda.", ticket: 150000 },
      { name: "Keukenhof (musiman, Mar–Mei)", desc: "Taman tulip terbesar dunia.", ticket: 350000 },
    ],
    [
      { name: "Stroopwafel segar", priceRange: "Rp40.000–70.000/buah" },
      { name: "Bitterballen di brown café", priceRange: "Rp100.000–180.000/porsi" },
      { name: "Haring (ikan mentah khas)", priceRange: "Rp60.000–100.000/porsi" },
      { name: "Rijsttafel Indonesia-Belanda", priceRange: "Rp300.000–600.000/orang" },
    ],
    ["photo-1534351590666-13e3e96b5017", "photo-1558551649-e44c8f992010", "photo-1512470876302-972faa2aa9a4"],
    "Amsterdam",
    "Sewa sepeda ±Rp150.000/hari; GVB day pass tram/metro ±Rp130.000; pusat kota compact dan walkable.",
  ),
  p(
    "Rome",
    "Kota abadi: koloseum, gelato, dan seribu air mancur",
    [
      { name: "Colosseum & Roman Forum", desc: "Amfiteater gladiator dan jantung Romawi kuno.", ticket: 350000 },
      { name: "Vatican: St. Peter & Museum Vatikan", desc: "Basilika terbesar + Kapel Sistina.", ticket: 400000 },
      { name: "Trevi Fountain", desc: "Lempar koin ke air mancur paling indah dunia.", ticket: 0 },
      { name: "Pantheon", desc: "Kuil kuno dengan kubah beton tertua.", ticket: 100000 },
      { name: "Piazza Navona & Campo de' Fiori", desc: "Alun-alun barok dan pasar pagi.", ticket: 0 },
      { name: "Trastevere", desc: "Gang batu paling romantis untuk makan malam.", ticket: 0 },
      { name: "Spanish Steps & Villa Borghese", desc: "Tangga ikonik dan taman kota.", ticket: 0 },
      { name: "Castel Sant'Angelo", desc: "Kastil malaikat di tepi Tiber.", ticket: 250000 },
    ],
    [
      { name: "Carbonara asli Roma", priceRange: "Rp150.000–250.000/porsi" },
      { name: "Pizza al taglio", priceRange: "Rp60.000–120.000/porsi" },
      { name: "Gelato artigianale", priceRange: "Rp50.000–90.000/cup" },
      { name: "Supplì (arancini Roma)", priceRange: "Rp30.000–60.000/buah" },
    ],
    ["photo-1552832230-c0197dd311b5", "photo-1531572753322-ad063cecc140", "photo-1525874684015-58379d421a52"],
    "Rome",
    "Metro A/B/B1 Rp25.000/trip; pusat kota terbaik dijelajahi jalan kaki; waspada pencopet di area ramai.",
  ),
  p(
    "Sydney",
    "Opera house, pantai bondi, dan pelabuhan tercantik",
    [
      { name: "Sydney Opera House & Circular Quay", desc: "Ikon arsitektur dunia di tepi pelabuhan.", ticket: 0 },
      { name: "Sydney Harbour Bridge Climb", desc: "Mendaki jembatan pelabuhan legendaris.", ticket: 2500000 },
      { name: "Bondi Beach & Bondi–Coogee Walk", desc: "Pantai selancar dan jalur tebing 6 km.", ticket: 0 },
      { name: "Darling Harbour", desc: "Akuarium, restoran, dan fireworks Sabtu malam.", ticket: 0 },
      { name: "Manly Ferry", desc: "Feri termurah dengan pemandangan terbaik.", ticket: 150000 },
      { name: "Taronga Zoo", desc: "Kebun binatang dengan view skyline.", ticket: 600000 },
      { name: "The Rocks", desc: "Distrik tertua Sydney, pasar akhir pekan.", ticket: 0 },
      { name: "Day trip: Blue Mountains", desc: "Three Sisters dan tebing biru mistis.", ticket: 500000 },
    ],
    [
      { name: "Meat pie & sausage roll", priceRange: "Rp60.000–110.000/buah" },
      { name: "Brunch kafe Surry Hills", priceRange: "Rp200.000–350.000/orang" },
      { name: "Seafood Sydney Fish Market", priceRange: "Rp200.000–500.000/orang" },
      { name: "Flat white khas Australia", priceRange: "Rp50.000–80.000/cangkir" },
    ],
    ["photo-1506973035872-a4ec16b8e8d9", "photo-1523482580672-f109ba8cb9be", "photo-1524293581917-878a6d017c71"],
    "Sydney",
    "Opal/contactless untuk feri/kereta/bus ±Rp150.000–250.000/hari; feri Manly wajib dicoba.",
  ),
];

const byCity = new Map(PROFILES.map((pr) => [pr.city, pr]));

const GENERIC_ATTRACTIONS: Omit<Attraction, "ticket">[] = [
  { name: "Landmark & alun-alun kota", desc: "Ikon utama kota — mulai dari sini untuk orientasi." },
  { name: "Museum kota", desc: "Kenali sejarah dan budaya lokal dalam 1–2 jam." },
  { name: "Pasar tradisional", desc: "Berburu jajanan lokal dan oleh-oleh khas." },
  { name: "Taman kota & riverside", desc: "Ruas hijau favorit warga untuk sore santai." },
  { name: "Kawasan kuliner malam", desc: "Street food dan resto lokal paling ramai." },
  { name: "Viewpoint / observatorium", desc: "Panorama kota dari ketinggian." },
  { name: "Kawasan heritage", desc: "Bangunan tua dan spot foto klasik." },
  { name: "Wisata alam sekitar kota", desc: "Day trip singkat ke alam terbuka terdekat." },
];

function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33 + str.charCodeAt(i)) >>> 0;
  return h;
}

const GENERIC_PHOTO_POOL: [string, string, string][] = [
  ["photo-1477959858617-67f85cf4f1df", "photo-1480714378408-67cf0d13bc1b", "photo-1449824913935-59a10b8d2000"],
  ["photo-1514565131-fce0801e5785", "photo-1494522855154-9297ac14b55f", "photo-1519501025264-65ba15a82390"],
  ["photo-1478860409698-8707f313ee8b", "photo-1444723121867-7a241cacace9", "photo-1500835556837-99ac94a94552"],
];

export function getProfile(cityName: string): DestinationProfile {
  const hit = byCity.get(cityName);
  if (hit) return hit;
  const h = hash(cityName);
  const attractions: Attraction[] = GENERIC_ATTRACTIONS.map((a, i) => ({
    ...a,
    name: i === 0 ? `Landmark utama ${cityName}` : a.name,
    ticket: [0, 25000, 0, 0, 0, 50000, 10000, 100000][i] ?? 0,
  }));
  const ids = GENERIC_PHOTO_POOL[h % GENERIC_PHOTO_POOL.length];
  return {
    city: cityName,
    tagline: `Jelajahi sisi terbaik ${cityName}`,
    attractions,
    foods: [
      { name: "Hidangan khas lokal", priceRange: "Rp30.000–70.000/porsi" },
      { name: "Street food favorit warga", priceRange: "Rp15.000–40.000/porsi" },
      { name: "Dessert & kopi lokal", priceRange: "Rp20.000–50.000/porsi" },
    ],
    photos: [
      { url: unsplash(ids[0]), alt: `${cityName} — pemandangan 1` },
      { url: unsplash(ids[1]), alt: `${cityName} — pemandangan 2` },
      { url: unsplash(ids[2]), alt: `${cityName} — pemandangan 3` },
    ],
    transportNote:
      "Kombinasikan transportasi publik lokal, ojek/taksi online, dan jalan kaki di pusat kota.",
    hotels: hotelSuggestions(cityName),
  };
}
