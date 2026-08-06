import { Palmtree } from "lucide-react";

export default function Footer() {
  return (
    <footer id="tentang" className="scroll-mt-24 bg-night-900 text-white/80">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-sunset-500 to-plum-600 text-white">
                <Palmtree className="size-5" aria-hidden />
              </span>
              <span className="text-lg font-extrabold text-white">CutiKu</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
              Perencana cuti & liburan untuk pekerja Indonesia: tanggal efektif, itinerary
              harian, dan estimasi budget dalam Rupiah.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-wide text-white uppercase">
              Cara Kerja
            </h2>
            <ol className="mt-3 space-y-2 text-sm text-white/60">
              <li>1. Pilih lama cuti, tanggal mulai, kota asal & tujuan.</li>
              <li>2. CutiKu memindai kalender libur nasional untuk tanggal paling efektif.</li>
              <li>3. Dapatkan itinerary harian + rincian budget, lalu simpan rencanamu.</li>
            </ol>
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-wide text-white uppercase">
              Disclaimer
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Seluruh data destinasi, harga tiket, hotel, dan atraksi merupakan{" "}
              <strong className="text-white/85">simulasi realistis</strong> — bukan penawaran
              harga aktual. Kalender libur mengacu pada SKB 3 Menteri 2025–2026. Selalu
              verifikasi harga di OTA dan jadwal resmi sebelum memesan.
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} CutiKu v1.0.0 — dibuat dengan ☀️ untuk para pemburu long weekend.
        </div>
      </div>
    </footer>
  );
}
