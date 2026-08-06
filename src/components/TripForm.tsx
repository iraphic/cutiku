import type { City } from "#/data/cities";
import { findCity } from "#/data/cities";
import { HOLIDAYS, holidayOn } from "#/data/holidays";
import { guessCountry } from "#/data/pricing";
import { addDays, formatRange, formatShortYear, isWeekend, parseISO, toISODate } from "#/lib/dateUtils";
import type { TravelStyle } from "#/lib/planner";
import { CalendarDays, ListPlus, Minus, Plus, Route, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import CityAutocomplete from "./CityAutocomplete";
import RouteChips, { resolveStop, sameCity, type RouteStop } from "./RouteChips";

export interface FormValue {
  days: number;
  startDate: Date;
  origin: City;
  destination: string;
  destinationCountry: string;
  /** Rute kota tujuan berurutan; kosong = mode satu kota */
  route: { name: string; country: string }[];
  style: TravelStyle;
}

const STYLES: { id: TravelStyle; label: string; desc: string }[] = [
  { id: "santai", label: "Santai", desc: "Aktivitas lebih sedikit & fleksibel, banyak waktu bebas" },
  { id: "padat", label: "Padat", desc: "Itinerary penuh pagi–malam, seimbang" },
  { id: "explore", label: "Full Explore", desc: "Maksimalkan destinasi, termasuk day trip" },
];

interface Props {
  onSubmit: (value: FormValue) => void;
  loading: boolean;
  initial?: {
    days: number;
    startDate: string;
    origin: string;
    destination: string;
    route?: { name: string; country: string }[];
    style?: TravelStyle;
  } | null;
}

export default function TripForm({ onSubmit, loading, initial }: Props) {
  const todayISO = toISODate(new Date());
  const [days, setDays] = useState(initial?.days ?? 5);
  const [startISO, setStartISO] = useState(initial?.startDate ?? todayISO);
  const [originText, setOriginText] = useState(initial?.origin ?? "Jakarta");
  const [originCity, setOriginCity] = useState<City | undefined>(() =>
    findCity(initial?.origin ?? "Jakarta"),
  );
  const [multiMode, setMultiMode] = useState((initial?.route?.length ?? 0) > 1);
  const [stops, setStops] = useState<RouteStop[]>(() =>
    (initial?.route ?? []).map((r, i) => ({ key: `restored-${i}`, name: r.name, country: r.country })),
  );
  const [addText, setAddText] = useState("");
  const [addCity, setAddCity] = useState<City | undefined>(undefined);
  const [addError, setAddError] = useState<string | undefined>(undefined);
  const [destText, setDestText] = useState(initial?.destination ?? "");
  const [destCity, setDestCity] = useState<City | undefined>(undefined);
  const [style, setStyle] = useState<TravelStyle>(initial?.style ?? "padat");
  const [errors, setErrors] = useState<{ origin?: string; destination?: string }>({});

  const start = useMemo(() => parseISO(startISO || todayISO), [startISO, todayISO]);
  const end = addDays(start, days - 1);

  const rangeInfo = useMemo(() => {
    let workdays = 0;
    let free = 0;
    const names: string[] = [];
    for (let i = 0; i < days; i++) {
      const d = addDays(start, i);
      const h = holidayOn(toISODate(d));
      if (h) {
        free++;
        if (!names.includes(h.name)) names.push(h.name);
      } else if (isWeekend(d)) {
        free++;
      } else {
        workdays++;
      }
    }
    return { workdays, free, names };
  }, [start, days]);

  const upcomingHoliday = useMemo(() => {
    const now = todayISO;
    return HOLIDAYS.filter((h) => h.date >= now).slice(0, 3);
  }, [todayISO]);

  const clampDays = (n: number) => Math.min(21, Math.max(1, n));

  const addStop = () => {
    const name = addText.trim();
    if (!name) return;
    if (sameCity(name, originText)) {
      setAddError("Kota tujuan tidak boleh sama dengan kota asal.");
      return;
    }
    if (stops.some((s) => sameCity(s.name, name))) {
      setAddError("Kota ini sudah ada di rute perjalananmu.");
      return;
    }
    setStops((s) => [...s, resolveStop(name, addCity)]);
    setAddText("");
    setAddCity(undefined);
    setAddError(undefined);
    if (errors.destination) setErrors((e) => ({ ...e, destination: undefined }));
  };

  const moveStop = (key: string, dir: -1 | 1) => {
    setStops((s) => {
      const idx = s.findIndex((st) => st.key === key);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= s.length) return s;
      const next = [...s];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { origin?: string; destination?: string } = {};
    if (!originText.trim()) errs.origin = "Kota asal wajib diisi.";
    if (multiMode) {
      if (stops.length === 0) errs.destination = "Tambahkan minimal 1 kota tujuan ke rute.";
      else if (stops.some((s) => sameCity(s.name, originText))) {
        errs.destination = "Kota tujuan tidak boleh sama dengan kota asal.";
      }
    } else {
      if (!destText.trim()) errs.destination = "Kota tujuan wajib diisi.";
      else if (sameCity(destText, originText)) {
        errs.destination = "Kota tujuan harus berbeda dari kota asal.";
      }
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const originCountry = guessCountry(originText);
    const resolvedOrigin = originCity ?? {
      name: originText.trim(),
      country: originCountry,
      countryId: originCountry,
      popular: false,
    };

    if (multiMode) {
      const route = stops.map((s) => ({ name: s.name, country: s.country }));
      onSubmit({
        days,
        startDate: start,
        origin: resolvedOrigin,
        destination: route[0].name,
        destinationCountry: route[0].country,
        route,
        style,
      });
      return;
    }

    const resolvedDest = destCity && destCity.name.toLowerCase() === destText.trim().toLowerCase()
      ? destCity
      : findCity(destText);
    onSubmit({
      days,
      startDate: start,
      origin: resolvedOrigin,
      destination: destText.trim(),
      destinationCountry: resolvedDest?.country ?? guessCountry(destText, originCountry),
      route: [],
      style,
    });
  };

  const inputCls =
    "w-full rounded-xl border-2 border-plum-500/15 bg-white px-3.5 py-3 text-sm font-medium text-night-900 shadow-sm transition-colors focus:border-plum-500 focus:outline-none";

  return (
    <section id="form" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6">
      <div className="lift -mt-14 rounded-3xl border border-night-800/5 bg-white p-6 shadow-2xl shadow-night-900/15 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-sunset-500 to-plum-600 text-white">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-night-900 sm:text-2xl">
              Atur Rencana Cutimu
            </h2>
            <p className="text-sm text-night-800/60">
              Isi 4 hal di bawah — sisanya biar CutiKu yang mikir.
            </p>
          </div>
        </div>

        <form
          onSubmit={submit}
          noValidate
          onKeyDown={(e) => {
            // Enter di input "tambah kota" menambah chip, bukan submit form
            if (
              e.key === "Enter" &&
              multiMode &&
              (e.target as HTMLElement).id === "destination-add"
            ) {
              e.preventDefault();
              addStop();
            }
          }}
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Lama cuti */}
            <div>
              <span id="lbl-days" className="mb-1.5 block text-sm font-bold text-night-800">
                Lama Cuti
              </span>
              <div className="flex items-stretch gap-2">
                <button
                  type="button"
                  aria-label="Kurangi hari cuti"
                  onClick={() => setDays((d) => clampDays(d - 1))}
                  disabled={days <= 1}
                  className="grid w-12 place-items-center rounded-xl border-2 border-plum-500/15 bg-white text-plum-600 shadow-sm transition-colors hover:bg-plum-500/5 disabled:opacity-40"
                >
                  <Minus className="size-4" aria-hidden />
                </button>
                <div
                  role="spinbutton"
                  aria-valuenow={days}
                  aria-valuemin={1}
                  aria-valuemax={21}
                  aria-labelledby="lbl-days"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowRight") setDays((d) => clampDays(d + 1));
                    if (e.key === "ArrowDown" || e.key === "ArrowLeft") setDays((d) => clampDays(d - 1));
                  }}
                  className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-plum-500/15 bg-gradient-to-br from-sunset-50 to-white py-2 shadow-sm focus-visible:outline-2 focus-visible:outline-plum-500"
                >
                  <span className="text-2xl font-extrabold text-night-900 tabular-nums">{days}</span>
                  <span className="text-xs font-semibold text-night-800/55">hari</span>
                </div>
                <button
                  type="button"
                  aria-label="Tambah hari cuti"
                  onClick={() => setDays((d) => clampDays(d + 1))}
                  disabled={days >= 21}
                  className="grid w-12 place-items-center rounded-xl border-2 border-plum-500/15 bg-white text-plum-600 shadow-sm transition-colors hover:bg-plum-500/5 disabled:opacity-40"
                >
                  <Plus className="size-4" aria-hidden />
                </button>
              </div>
            </div>

            {/* Tanggal mulai */}
            <div>
              <label htmlFor="start-date" className="mb-1.5 block text-sm font-bold text-night-800">
                Tanggal Mulai
              </label>
              <input
                id="start-date"
                type="date"
                value={startISO}
                min="2025-01-01"
                max="2026-12-31"
                onChange={(e) => setStartISO(e.target.value || todayISO)}
                className={inputCls}
              />
            </div>

            {/* Gaya perjalanan */}
            <div className="md:col-span-2">
              <span id="lbl-style" className="mb-1.5 block text-sm font-bold text-night-800">
                Gaya Perjalanan
              </span>
              <div role="radiogroup" aria-labelledby="lbl-style" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={style === s.id}
                    onClick={() => setStyle(s.id)}
                    className={`rounded-xl border-2 px-4 py-3 text-left shadow-sm transition-all ${
                      style === s.id
                        ? "border-plum-500 bg-plum-500/[0.06]"
                        : "border-plum-500/15 bg-white hover:border-plum-500/40"
                    }`}
                  >
                    <span className="block text-sm font-extrabold text-night-900">{s.label}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-night-800/60">
                      {s.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <CityAutocomplete
              id="origin"
              label="Kota Asal"
              value={originText}
              placeholder="Mis. Jakarta"
              invalid={!!errors.origin}
              onChange={(v, city) => {
                setOriginText(v);
                setOriginCity(city);
                if (errors.origin) setErrors((e) => ({ ...e, origin: undefined }));
              }}
            />
            {multiMode ? (
              <div className="md:col-span-2">
                <div className="flex items-end gap-2">
                  <div className="min-w-0 flex-1">
                    <CityAutocomplete
                      id="destination-add"
                      label="Kota Tujuan (bisa lebih dari satu)"
                      value={addText}
                      placeholder="Ketik kota apa pun lalu tekan Tambah — mis. Gili Trawangan…"
                      invalid={!!errors.destination || !!addError}
                      onChange={(v, city) => {
                        setAddText(v);
                        setAddCity(city);
                        if (addError) setAddError(undefined);
                        if (errors.destination) setErrors((e) => ({ ...e, destination: undefined }));
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addStop}
                    disabled={!addText.trim()}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-plum-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-plum-500 disabled:opacity-40"
                  >
                    <ListPlus className="size-4" aria-hidden />
                    Tambah
                  </button>
                </div>
                {addError && (
                  <p role="alert" className="mt-2 text-sm font-semibold text-red-600">
                    {addError}
                  </p>
                )}
                <div className="mt-3">
                  <RouteChips
                    originName={originText}
                    stops={stops}
                    invalid={!!errors.destination}
                    onRemove={(key) => setStops((s) => s.filter((st) => st.key !== key))}
                    onMove={moveStop}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setMultiMode(false)}
                  className="mt-2.5 text-xs font-bold text-plum-600 underline-offset-2 transition-colors hover:text-plum-500 hover:underline"
                >
                  ← Kembali ke satu kota tujuan
                </button>
              </div>
            ) : (
              <div>
                <CityAutocomplete
                  id="destination"
                  label="Kota Tujuan"
                  value={destText}
                  placeholder="Mis. Denpasar (Bali), Tokyo, Gili Trawangan…"
                  invalid={!!errors.destination}
                  onChange={(v, city) => {
                    setDestText(v);
                    setDestCity(city);
                    if (errors.destination) setErrors((e) => ({ ...e, destination: undefined }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setMultiMode(true);
                    if (destText.trim() && !sameCity(destText, originText)) {
                      setStops((s) =>
                        s.some((st) => sameCity(st.name, destText))
                          ? s
                          : [...s, resolveStop(destText, destCity)],
                      );
                    }
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-plum-600 underline-offset-2 transition-colors hover:text-plum-500 hover:underline"
                >
                  <Route className="size-3.5" aria-hidden />
                  Rute multi-kota (mis. Singapore → Johor Bahru → Kuala Lumpur)
                </button>
              </div>
            )}
          </div>

          {(errors.origin || errors.destination) && (
            <p role="alert" className="mt-3 text-sm font-semibold text-red-600">
              {errors.origin ?? errors.destination}
            </p>
          )}

          {/* Ringkasan rentang */}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-night-900/[0.035] px-4 py-3 text-sm">
            <span className="inline-flex items-center gap-1.5 font-bold text-night-900">
              <CalendarDays className="size-4 text-sunset-500" aria-hidden />
              {formatRange(start, end)}
            </span>
            <span className="font-medium text-night-800/65">
              {days} hari total · {rangeInfo.workdays} hari kerja · {rangeInfo.free} hari libur
              {rangeInfo.names.length > 0 && (
                <span className="text-sunset-600">
                  {" "}
                  · termasuk {rangeInfo.names.slice(0, 2).join(" & ")}
                </span>
              )}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full rounded-2xl bg-gradient-to-r from-sunset-500 to-plum-600 py-4 text-base font-extrabold text-white shadow-xl shadow-plum-600/25 transition-all hover:scale-[1.01] hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-600 disabled:cursor-wait disabled:opacity-80 ${
              loading ? "btn-shimmer" : ""
            }`}
          >
            {loading ? "Menyusun rencana terbaikmu…" : "Buat Rencana ✈️"}
          </button>
        </form>
      </div>

      {/* Tanggal merah terdekat */}
      {upcomingHoliday.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-bold text-night-800/70">Tanggal merah terdekat:</span>
          {upcomingHoliday.map((h) => (
            <span
              key={h.date}
              className="rounded-full border border-sunset-500/25 bg-white px-3 py-1 font-semibold text-night-800 shadow-sm"
            >
              {formatShortYear(parseISO(h.date))} · {h.name}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
