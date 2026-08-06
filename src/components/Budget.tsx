import { formatIDR } from "#/data/pricing";
import type { BudgetBreakdown, HotelTier } from "#/lib/planner";
import { chooseLegOption } from "#/lib/planner";
import { formatTemplate, TEXT, type Language } from "#/lib/i18n";
import { BedDouble, Info, Plane, Star, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  budget: BudgetBreakdown;
  tier: HotelTier;
  onTierChange: (t: HotelTier) => void;
  lang: Language;
}

const TIERS: HotelTier[] = ["budget", "mid", "premium"];

function useAnimatedNumber(target: number): number {
  const [value, setValue] = useState(target);
  const prev = useRef(target);

  useEffect(() => {
    const from = prev.current;
    if (from === target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      prev.current = target;
      setValue(target);
      return;
    }
    const startTime = performance.now();
    const dur = 600;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(step);
      else prev.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return value;
}

export default function Budget({ budget, tier, onTierChange, lang }: Props) {
  const t = TEXT[lang].budget;
  const total = budget.total(tier);
  const animMin = useAnimatedNumber(total.min);
  const animMax = useAnimatedNumber(total.max);

  return (
    <div className="overflow-hidden rounded-3xl border border-night-800/5 bg-white shadow-2xl shadow-night-900/10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-night-800/8 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <Wallet className="size-5" aria-hidden />
          </span>
          <div>
              <h3 className="text-lg font-extrabold text-night-900">{t.title}</h3>
              <p className="text-sm text-night-800/55">{t.nights}</p>
          {TIERS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tier === t}
              onClick={() => onTierChange(t)}
              className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all sm:text-sm ${
                tier === t
                  ? "bg-white text-plum-700 shadow-md"
                  : "text-night-800/60 hover:text-night-900"
              }`}
            >
              {TEXT[lang].budget.hotelTier[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {budget.hotels && budget.hotels.length > 0 ? (
          <div className="mb-4 space-y-2">
            {budget.hotels
              .filter((h) => h.nights > 0)
              .map((h) => (
                <div
                  key={h.city}
                  className="rounded-xl bg-plum-500/[0.07] px-4 py-2.5 text-sm font-semibold text-plum-700"
                >
                  <span className="flex items-center gap-2">
                    <BedDouble className="size-4 shrink-0" aria-hidden />
                    <span>
                      {h.city} — {tierLabel(tier)}: {formatIDR(h.perNight[tier])}/malam × {h.nights}{" "}
                      malam
                    </span>
                  </span>
                  {h.suggestion && (
                    <span className="mt-1 flex items-center gap-1.5 pl-6 text-xs font-bold text-plum-600">
                      <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
                      Rekomendasi: {h.suggestion.name} ({h.suggestion.stars}★)
                    </span>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="mb-4 rounded-xl bg-plum-500/[0.07] px-4 py-2.5 text-sm font-semibold text-plum-700">
            <span className="flex items-center gap-2">
              <BedDouble className="size-4 shrink-0" aria-hidden />
              {tierLabel(tier)}: {formatIDR(budget.hotelPerNight[tier])}/malam × {budget.nights} malam
            </span>
            {budget.hotelSuggestion && (
              <span className="mt-1 flex items-center gap-1.5 pl-6 text-xs font-bold text-plum-600">
                <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
                Rekomendasi: {budget.hotelSuggestion.name} ({budget.hotelSuggestion.stars}★)
              </span>
            )}
          </div>
        )}

        {budget.legs && budget.legs.length > 0 && (
          <div className="mb-4 overflow-hidden rounded-2xl border border-night-800/8">
            <p className="flex items-center gap-2 border-b border-night-800/8 bg-night-900/[0.03] px-4 py-2.5 text-xs font-extrabold tracking-wide text-night-800/70 uppercase">
              <Plane className="size-4 text-sunset-500" aria-hidden />
              Opsi transportasi per leg rute
            </p>
            <ul className="divide-y divide-night-800/[0.06]">
              {budget.legs.map((leg) => {
                const chosen = chooseLegOption(leg, tier);
                return (
                  <li key={`${leg.from}->${leg.to}`} className="px-4 py-3">
                    <p className="text-sm font-bold text-night-900">
                      {leg.from} → {leg.to}
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {leg.options.map((o) => {
                        const isChosen = o === chosen;
                        return (
                          <li
                            key={o.label}
                            className={`flex flex-wrap items-baseline justify-between gap-x-3 rounded-lg px-2 py-1 text-sm ${
                              isChosen ? "bg-emerald-50" : ""
                            }`}
                          >
                            <span className={isChosen ? "font-bold text-emerald-800" : "text-night-800/65"}>
                              {o.label}
                              {o.duration && (
                                <span className="text-night-800/45"> · {o.duration}</span>
                              )}
                              {isChosen && (
                                <span className="ml-1.5 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                                  {t.transportSelectedTag}
                                </span>
                              )}
                            </span>
                            <span className="font-bold whitespace-nowrap text-night-900 tabular-nums">
                              {formatIDR(o.price[0])} – {formatIDR(o.price[1])}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
            <p className="bg-sky-50 px-4 py-2 text-xs font-medium text-sky-800">
              {tier === "budget" ? t.transportNoteBudget : t.transportNotePremium}
            </p>
          </div>
        )}

        <table className="w-full text-sm">
          <caption className="sr-only">{t.tableCaption}</caption>
          <thead>
            <tr className="border-b border-night-800/10 text-left text-xs tracking-wide text-night-800/50 uppercase">
              <th scope="col" className="py-2 pr-2 font-bold">{t.tableComponent}</th>
              <th scope="col" className="py-2 pl-2 text-right font-bold">{t.tableEstimate}</th>
            </tr>
          </thead>
          <tbody>
            {budget.rows(tier).map((row) => (
              <tr key={row.label} className="border-b border-night-800/[0.06] last:border-0">
                <th scope="row" className="py-3 pr-2 text-left font-medium text-night-800/80">
                  {row.label}
                </th>
                <td className="py-3 pl-2 text-right font-bold whitespace-nowrap text-night-900 tabular-nums">
                  {row.min === row.max
                    ? formatIDR(row.min)
                    : `${formatIDR(row.min)} – ${formatIDR(row.max)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {budget.ground && (
          <p className="mt-3 rounded-xl bg-sky-50 px-4 py-2.5 text-sm font-medium text-sky-800">
            {formatTemplate(t.groundHint, {
              label: budget.ground.label,
              price: `${formatIDR(budget.ground.price[0])} – ${formatIDR(budget.ground.price[1])}`,
            })}
          </p>
        )}

        <div className="mt-5 rounded-2xl bg-gradient-to-r from-sunset-500 to-plum-600 p-5 text-white">
          <p className="text-sm font-semibold text-white/80">{t.totalLabel}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight tabular-nums sm:text-3xl">
            {formatIDR(animMin)} – {formatIDR(animMax)}
          </p>
        </div>

        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-night-800/50">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Estimasi simulasi berdasarkan rata-rata harga OTA dan referensi publik. Harga aktual
          bervariasi tergantung musim, maskapai, dan waktu pemesanan.
        </p>
      </div>
    </div>
  );
}
