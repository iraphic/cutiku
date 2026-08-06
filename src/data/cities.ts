export interface City {
  name: string;
  country: string;
  /** Nama negara dalam Bahasa Indonesia */
  countryId: string;
  popular: boolean;
}

const c = (name: string, country: string, countryId: string, popular = false): City => ({
  name,
  country,
  countryId,
  popular,
});

export const CITIES: City[] = [
  // Indonesia — populer
  c("Jakarta", "Indonesia", "Indonesia", true),
  c("Denpasar (Bali)", "Indonesia", "Indonesia", true),
  c("Yogyakarta", "Indonesia", "Indonesia", true),
  c("Bandung", "Indonesia", "Indonesia", true),
  c("Lombok", "Indonesia", "Indonesia", true),
  c("Labuan Bajo", "Indonesia", "Indonesia", true),
  // Indonesia — lainnya
  c("Surabaya", "Indonesia", "Indonesia"),
  c("Medan", "Indonesia", "Indonesia"),
  c("Makassar", "Indonesia", "Indonesia"),
  c("Semarang", "Indonesia", "Indonesia"),
  c("Palembang", "Indonesia", "Indonesia"),
  c("Balikpapan", "Indonesia", "Indonesia"),
  c("Pontianak", "Indonesia", "Indonesia"),
  c("Manado", "Indonesia", "Indonesia"),
  c("Padang", "Indonesia", "Indonesia"),
  c("Pekanbaru", "Indonesia", "Indonesia"),
  c("Banjarmasin", "Indonesia", "Indonesia"),
  c("Batam", "Indonesia", "Indonesia"),
  c("Solo", "Indonesia", "Indonesia"),
  c("Malang", "Indonesia", "Indonesia"),
  c("Bogor", "Indonesia", "Indonesia"),
  c("Tangerang", "Indonesia", "Indonesia"),
  c("Bekasi", "Indonesia", "Indonesia"),
  c("Depok", "Indonesia", "Indonesia"),
  c("Aceh (Banda Aceh)", "Indonesia", "Indonesia"),
  c("Belitung", "Indonesia", "Indonesia"),
  c("Raja Ampat", "Indonesia", "Indonesia"),
  c("Wakatobi", "Indonesia", "Indonesia"),
  c("Bromo (Probolinggo)", "Indonesia", "Indonesia"),
  c("Banyuwangi", "Indonesia", "Indonesia"),
  c("Kupang", "Indonesia", "Indonesia"),
  c("Ambon", "Indonesia", "Indonesia"),
  c("Jayapura", "Indonesia", "Indonesia"),
  c("Sorong", "Indonesia", "Indonesia"),
  c("Samarinda", "Indonesia", "Indonesia"),
  c("Jambi", "Indonesia", "Indonesia"),
  c("Bengkulu", "Indonesia", "Indonesia"),
  c("Ternate", "Indonesia", "Indonesia"),
  c("Kendari", "Indonesia", "Indonesia"),
  c("Palu", "Indonesia", "Indonesia"),
  c("Gorontalo", "Indonesia", "Indonesia"),
  c("Manokwari", "Indonesia", "Indonesia"),
  c("Tanjung Pinang", "Indonesia", "Indonesia"),
  c("Pangkal Pinang", "Indonesia", "Indonesia"),
  c("Cirebon", "Indonesia", "Indonesia"),
  c("Tasikmalaya", "Indonesia", "Indonesia"),
  c("Jember", "Indonesia", "Indonesia"),
  c("Kediri", "Indonesia", "Indonesia"),
  // Asia Tenggara
  c("Singapore", "Singapore", "Singapura", true),
  c("Kuala Lumpur", "Malaysia", "Malaysia", true),
  c("Bangkok", "Thailand", "Thailand", true),
  c("Phuket", "Thailand", "Thailand"),
  c("Chiang Mai", "Thailand", "Thailand"),
  c("Krabi", "Thailand", "Thailand"),
  c("Penang", "Malaysia", "Malaysia"),
  c("Langkawi", "Malaysia", "Malaysia"),
  c("Kota Kinabalu", "Malaysia", "Malaysia"),
  c("Ho Chi Minh City", "Vietnam", "Vietnam"),
  c("Hanoi", "Vietnam", "Vietnam"),
  c("Da Nang", "Vietnam", "Vietnam"),
  c("Nha Trang", "Vietnam", "Vietnam"),
  c("Siem Reap", "Cambodia", "Kamboja"),
  c("Phnom Penh", "Cambodia", "Kamboja"),
  c("Vientiane", "Laos", "Laos"),
  c("Luang Prabang", "Laos", "Laos"),
  c("Manila", "Philippines", "Filipina"),
  c("Cebu", "Philippines", "Filipina"),
  c("Boracay", "Philippines", "Filipina"),
  c("Yangon", "Myanmar", "Myanmar"),
  c("Bandar Seri Begawan", "Brunei", "Brunei Darussalam"),
  // Asia Timur
  c("Tokyo", "Japan", "Jepang", true),
  c("Osaka", "Japan", "Jepang", true),
  c("Kyoto", "Japan", "Jepang"),
  c("Sapporo", "Japan", "Jepang"),
  c("Fukuoka", "Japan", "Jepang"),
  c("Okinawa", "Japan", "Jepang"),
  c("Seoul", "South Korea", "Korea Selatan", true),
  c("Busan", "South Korea", "Korea Selatan"),
  c("Jeju", "South Korea", "Korea Selatan"),
  c("Hong Kong", "Hong Kong", "Hong Kong", true),
  c("Macau", "Macau", "Makau"),
  c("Taipei", "Taiwan", "Taiwan", true),
  c("Beijing", "China", "Tiongkok"),
  c("Shanghai", "China", "Tiongkok"),
  c("Chengdu", "China", "Tiongkok"),
  c("Guangzhou", "China", "Tiongkok"),
  c("Ulaanbaatar", "Mongolia", "Mongolia"),
  // Asia Selatan & Tengah
  c("New Delhi", "India", "India"),
  c("Mumbai", "India", "India"),
  c("Jaipur", "India", "India"),
  c("Kathmandu", "Nepal", "Nepal"),
  c("Colombo", "Sri Lanka", "Sri Lanka"),
  c("Malé", "Maldives", "Maladewa", true),
  c("Dhaka", "Bangladesh", "Bangladesh"),
  // Timur Tengah
  c("Dubai", "United Arab Emirates", "Uni Emirat Arab", true),
  c("Abu Dhabi", "United Arab Emirates", "Uni Emirat Arab"),
  c("Doha", "Qatar", "Qatar"),
  c("Istanbul", "Turkey", "Turki", true),
  c("Cappadocia", "Turkey", "Turki"),
  c("Riyadh", "Saudi Arabia", "Arab Saudi"),
  c("Jeddah", "Saudi Arabia", "Arab Saudi"),
  c("Amman", "Jordan", "Yordania"),
  c("Muscat", "Oman", "Oman"),
  // Eropa
  c("Paris", "France", "Prancis", true),
  c("London", "United Kingdom", "Inggris", true),
  c("Amsterdam", "Netherlands", "Belanda", true),
  c("Rome", "Italy", "Italia", true),
  c("Venice", "Italy", "Italia"),
  c("Milan", "Italy", "Italia"),
  c("Florence", "Italy", "Italia"),
  c("Barcelona", "Spain", "Spanyol"),
  c("Madrid", "Spain", "Spanyol"),
  c("Lisbon", "Portugal", "Portugal"),
  c("Berlin", "Germany", "Jerman"),
  c("Munich", "Germany", "Jerman"),
  c("Vienna", "Austria", "Austria"),
  c("Prague", "Czech Republic", "Ceko"),
  c("Budapest", "Hungary", "Hungaria"),
  c("Zurich", "Switzerland", "Swiss"),
  c("Interlaken", "Switzerland", "Swiss"),
  c("Athens", "Greece", "Yunani"),
  c("Santorini", "Greece", "Yunani"),
  c("Copenhagen", "Denmark", "Denmark"),
  c("Stockholm", "Sweden", "Swedia"),
  c("Oslo", "Norway", "Norwegia"),
  c("Helsinki", "Finland", "Finlandia"),
  c("Reykjavik", "Iceland", "Islandia"),
  c("Dublin", "Ireland", "Irlandia"),
  c("Edinburgh", "United Kingdom", "Inggris"),
  c("Nice", "France", "Prancis"),
  c("Krakow", "Poland", "Polandia"),
  c("Dubrovnik", "Croatia", "Kroasia"),
  c("Moscow", "Russia", "Rusia"),
  // Australia & Pasifik
  c("Sydney", "Australia", "Australia", true),
  c("Melbourne", "Australia", "Australia"),
  c("Perth", "Australia", "Australia"),
  c("Brisbane", "Australia", "Australia"),
  c("Gold Coast", "Australia", "Australia"),
  c("Cairns", "Australia", "Australia"),
  c("Auckland", "New Zealand", "Selandia Baru"),
  c("Queenstown", "New Zealand", "Selandia Baru"),
  c("Nadi (Fiji)", "Fiji", "Fiji"),
  // Amerika
  c("New York", "United States", "Amerika Serikat"),
  c("Los Angeles", "United States", "Amerika Serikat"),
  c("San Francisco", "United States", "Amerika Serikat"),
  c("Las Vegas", "United States", "Amerika Serikat"),
  c("Honolulu", "United States", "Amerika Serikat"),
  c("Miami", "United States", "Amerika Serikat"),
  c("Orlando", "United States", "Amerika Serikat"),
  c("Vancouver", "Canada", "Kanada"),
  c("Toronto", "Canada", "Kanada"),
  c("Mexico City", "Mexico", "Meksiko"),
  c("Cancún", "Mexico", "Meksiko"),
  c("Rio de Janeiro", "Brazil", "Brasil"),
  c("Buenos Aires", "Argentina", "Argentina"),
  c("Lima", "Peru", "Peru"),
  c("Cusco", "Peru", "Peru"),
  c("Santiago", "Chile", "Chili"),
  // Afrika
  c("Cairo", "Egypt", "Mesir"),
  c("Marrakech", "Morocco", "Maroko"),
  c("Cape Town", "South Africa", "Afrika Selatan"),
  c("Nairobi", "Kenya", "Kenya"),
  c("Zanzibar", "Tanzania", "Tanzania"),
];

export function searchCities(query: string, limit = 8): City[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return CITIES.filter((ct) => ct.popular).slice(0, limit);
  }
  const starts: City[] = [];
  const contains: City[] = [];
  for (const ct of CITIES) {
    const name = ct.name.toLowerCase();
    if (name.startsWith(q)) starts.push(ct);
    else if (
      name.includes(q) ||
      ct.country.toLowerCase().includes(q) ||
      ct.countryId.toLowerCase().includes(q)
    )
      contains.push(ct);
    if (starts.length >= limit) break;
  }
  return [...starts, ...contains].slice(0, limit);
}

export function findCity(name: string): City | undefined {
  const q = name.trim().toLowerCase();
  return CITIES.find((ct) => ct.name.toLowerCase() === q);
}
