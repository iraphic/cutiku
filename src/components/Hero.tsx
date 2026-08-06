import { Cloud, Plane } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="atas"
      className="relative flex min-h-[92dvh] items-center overflow-hidden bg-gradient-to-br from-sunset-500 via-[#e0567a] to-plum-700"
    >
      {/* dekorasi */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-sunset-300/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 size-[28rem] rounded-full bg-plum-500/40 blur-3xl" />
        <Cloud className="absolute top-[18%] left-[-8rem] size-24 text-white/25 animate-drift" />
        <Cloud
          className="absolute top-[38%] left-[-12rem] size-16 text-white/20 animate-drift"
          style={{ animationDelay: "6s", animationDuration: "24s" }}
        />
        <Cloud
          className="absolute top-[10%] left-[-10rem] size-12 text-white/15 animate-drift"
          style={{ animationDelay: "12s", animationDuration: "28s" }}
        />
        <Plane className="absolute top-[22%] right-[12%] size-14 text-white/80 animate-fly drop-shadow-lg" />
        <div className="absolute top-[26%] right-[8%] size-24 rounded-full border-2 border-dashed border-white/30 animate-float-slow" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-28 sm:px-6">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
            ✈️ Libur nasional 2025–2026 sudah terpasang
          </p>
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white drop-shadow-sm sm:text-6xl sm:leading-[1.1]">
            Rencanakan Cuti Impianmu,{" "}
            <span className="bg-gradient-to-r from-yellow-200 to-sunset-100 bg-clip-text text-transparent">
              Tanpa Ribet.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Pilih lama cuti, tanggal, dan kota tujuan. CutiKu menghitung tanggal paling
            efektif berdasarkan tanggal merah, menyusun itinerary harian, dan menaksir
            budget lengkap dalam Rupiah.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#form"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-plum-700 shadow-xl shadow-night-900/20 transition-transform hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Mulai Merencanakan
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#tentang"
              className="inline-flex items-center rounded-full border-2 border-white/40 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Cara Kerja
            </a>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 text-white">
            {[
              ["140+", "Kota tujuan"],
              ["50+", "Tanggal merah"],
              ["3", "Opsi terbaik"],
            ].map(([num, label]) => (
              <div key={label} className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur-sm">
                <dt className="sr-only">{label}</dt>
                <dd className="text-2xl font-extrabold">{num}</dd>
                <dd className="text-xs font-medium text-white/75">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* gelombang bawah */}
      <svg
        className="absolute bottom-0 left-0 w-full text-[#f7f4ff]"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,48 C240,80 480,16 720,32 C960,48 1200,80 1440,40 L1440,80 L0,80 Z"
        />
      </svg>
    </section>
  );
}
