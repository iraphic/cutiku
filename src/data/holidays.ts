export interface Holiday {
  /** ISO date, e.g. "2025-03-31" */
  date: string;
  name: string;
  type: "libur" | "cuti-bersama";
}

/** Hari libur nasional & cuti bersama Indonesia 2025–2026 (SKB 3 Menteri). */
export const HOLIDAYS: Holiday[] = [
  // ---- 2025 ----
  { date: "2025-01-01", name: "Tahun Baru 2025 Masehi", type: "libur" },
  { date: "2025-01-27", name: "Isra Mikraj Nabi Muhammad SAW", type: "libur" },
  { date: "2025-01-28", name: "Cuti Bersama Tahun Baru Imlek 2576", type: "cuti-bersama" },
  { date: "2025-01-29", name: "Tahun Baru Imlek 2576 Kongzili", type: "libur" },
  { date: "2025-03-28", name: "Cuti Bersama Hari Suci Nyepi", type: "cuti-bersama" },
  { date: "2025-03-29", name: "Hari Suci Nyepi (Tahun Baru Saka 1947)", type: "libur" },
  { date: "2025-03-31", name: "Hari Raya Idul Fitri 1446 H", type: "libur" },
  { date: "2025-04-01", name: "Hari Raya Idul Fitri 1446 H", type: "libur" },
  { date: "2025-04-02", name: "Cuti Bersama Idul Fitri 1446 H", type: "cuti-bersama" },
  { date: "2025-04-03", name: "Cuti Bersama Idul Fitri 1446 H", type: "cuti-bersama" },
  { date: "2025-04-04", name: "Cuti Bersama Idul Fitri 1446 H", type: "cuti-bersama" },
  { date: "2025-04-07", name: "Cuti Bersama Idul Fitri 1446 H", type: "cuti-bersama" },
  { date: "2025-04-08", name: "Cuti Bersama Idul Fitri 1446 H", type: "cuti-bersama" },
  { date: "2025-04-18", name: "Wafat Isa Al Masih (Jumat Agung)", type: "libur" },
  { date: "2025-04-20", name: "Kebangkitan Isa Al Masih (Paskah)", type: "libur" },
  { date: "2025-05-01", name: "Hari Buruh Internasional", type: "libur" },
  { date: "2025-05-12", name: "Hari Raya Waisak 2569 BE", type: "libur" },
  { date: "2025-05-13", name: "Cuti Bersama Hari Raya Waisak", type: "cuti-bersama" },
  { date: "2025-05-29", name: "Kenaikan Isa Al Masih", type: "libur" },
  { date: "2025-05-30", name: "Cuti Bersama Kenaikan Isa Al Masih", type: "cuti-bersama" },
  { date: "2025-06-01", name: "Hari Lahir Pancasila", type: "libur" },
  { date: "2025-06-06", name: "Hari Raya Idul Adha 1446 H", type: "libur" },
  { date: "2025-06-09", name: "Cuti Bersama Idul Adha 1446 H", type: "cuti-bersama" },
  { date: "2025-06-27", name: "Tahun Baru Islam 1447 H", type: "libur" },
  { date: "2025-08-17", name: "Hari Kemerdekaan RI", type: "libur" },
  { date: "2025-09-05", name: "Maulid Nabi Muhammad SAW", type: "libur" },
  { date: "2025-12-25", name: "Hari Raya Natal", type: "libur" },
  { date: "2025-12-26", name: "Cuti Bersama Hari Raya Natal", type: "cuti-bersama" },
  // ---- 2026 ----
  { date: "2026-01-01", name: "Tahun Baru 2026 Masehi", type: "libur" },
  { date: "2026-01-16", name: "Isra Mikraj Nabi Muhammad SAW", type: "libur" },
  { date: "2026-02-16", name: "Cuti Bersama Tahun Baru Imlek 2577", type: "cuti-bersama" },
  { date: "2026-02-17", name: "Tahun Baru Imlek 2577 Kongzili", type: "libur" },
  { date: "2026-03-18", name: "Cuti Bersama Hari Suci Nyepi", type: "cuti-bersama" },
  { date: "2026-03-19", name: "Hari Suci Nyepi (Tahun Baru Saka 1948)", type: "libur" },
  { date: "2026-03-20", name: "Hari Raya Idul Fitri 1447 H", type: "libur" },
  { date: "2026-03-21", name: "Hari Raya Idul Fitri 1447 H", type: "libur" },
  { date: "2026-03-23", name: "Cuti Bersama Idul Fitri 1447 H", type: "cuti-bersama" },
  { date: "2026-03-24", name: "Cuti Bersama Idul Fitri 1447 H", type: "cuti-bersama" },
  { date: "2026-04-03", name: "Wafat Isa Al Masih (Jumat Agung)", type: "libur" },
  { date: "2026-04-05", name: "Kebangkitan Isa Al Masih (Paskah)", type: "libur" },
  { date: "2026-05-01", name: "Hari Buruh Internasional", type: "libur" },
  { date: "2026-05-14", name: "Kenaikan Isa Al Masih", type: "libur" },
  { date: "2026-05-15", name: "Cuti Bersama Kenaikan Isa Al Masih", type: "cuti-bersama" },
  { date: "2026-05-27", name: "Hari Raya Idul Adha 1447 H", type: "libur" },
  { date: "2026-05-28", name: "Cuti Bersama Idul Adha 1447 H", type: "cuti-bersama" },
  { date: "2026-05-31", name: "Hari Raya Waisak 2570 BE", type: "libur" },
  { date: "2026-06-01", name: "Hari Lahir Pancasila", type: "libur" },
  { date: "2026-06-16", name: "Tahun Baru Islam 1448 H", type: "libur" },
  { date: "2026-08-17", name: "Hari Kemerdekaan RI", type: "libur" },
  { date: "2026-08-25", name: "Maulid Nabi Muhammad SAW", type: "libur" },
  { date: "2026-12-25", name: "Hari Raya Natal", type: "libur" },
  { date: "2026-12-28", name: "Cuti Bersama Hari Raya Natal", type: "cuti-bersama" },
];

const holidayMap = new Map(HOLIDAYS.map((h) => [h.date, h]));

export function holidayOn(isoDate: string): Holiday | undefined {
  return holidayMap.get(isoDate);
}
