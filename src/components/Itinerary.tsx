import type { Activity, ItineraryDay, ItinerarySegment } from "#/lib/planner";
import { alternativesFor } from "#/lib/planner";
import { formatDayName, formatShortYear } from "#/lib/dateUtils";
import { formatIDR } from "#/data/pricing";
import { formatTemplate, TEXT, type Language } from "#/lib/i18n";
import { BusFront, Moon, RefreshCw, Sun, Sunrise, Sunset } from "lucide-react";
import { useState } from "react";

const TIME_ICON = {
  Pagi: Sunrise,
  Siang: Sun,
  Sore: Sunset,
  Malam: Moon,
} as const;

function Photo({ url, alt, initial }: { url: string; alt: string; initial: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="img-fallback grid h-full w-full place-items-center"
        role="img"
        aria-label={alt}
      >
        <span className="text-3xl font-extrabold text-white/90">{initial}</span>
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
    />
  );
}

function ActivityItem({
  a,
  profile,
  onSwap,
  lang,
}: {
  a: Activity;
  profile: ItinerarySegment["profile"];
  lang: Language;
  onSwap?: (id: string, next: Activity) => void;
}) {
  const t = TEXT[lang].itinerary;
  const [open, setOpen] = useState(false);
  const Icon = TIME_ICON[a.time];
  const swappable = !a.locked && !!onSwap;
  const alternatives = open ? alternativesFor(a, profile) : [];

  return (
    <li className="flex gap-3">
      <span
        className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${
          a.time === "Pagi"
            ? "bg-amber-100 text-amber-600"
            : a.time === "Siang"
              ? "bg-sky-100 text-sky-600"
              : a.time === "Sore"
                ? "bg-orange-100 text-orange-600"
                : "bg-indigo-100 text-indigo-600"
        }`}
      >
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-night-900">
          <span className="text-night-800/50">{a.time} · </span>
          {a.title}
          {a.ticket > 0 && (
            <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
              {formatTemplate(t.ticketLabel, { price: formatIDR(a.ticket) })}
            </span>
          )}
          {swappable && (
            <button
              type="button"
              aria-label={formatTemplate(t.replaceActivity, { time: a.time, title: a.title })}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold transition-colors ${
                open
                  ? "bg-plum-600 text-white"
                  : "bg-plum-500/10 text-plum-600 hover:bg-plum-500/20"
              }`}
            >
              <RefreshCw className="size-3" aria-hidden />
              {t.swapLabel}
            </button>
          )}
        </p>
        <p className="mt-0.5 text-sm leading-relaxed text-night-800/65">{a.detail}</p>
        {open && alternatives.length > 0 && (
          <ul className="mt-2 space-y-1.5 rounded-xl border border-plum-500/15 bg-plum-500/[0.04] p-2.5">
            {alternatives.map((alt) => (
              <li key={alt.title}>
                <button
                  type="button"
                  onClick={() => {
                    if (a.id) onSwap(a.id, alt);
                    setOpen(false);
                  }}
                  className="flex w-full items-baseline justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-night-900">{alt.title}</span>
                    <span className="block truncate text-xs text-night-800/55">{alt.detail}</span>
                  </span>
                  {alt.ticket > 0 && (
                    <span className="shrink-0 text-xs font-bold whitespace-nowrap text-emerald-700">
                      {formatTemplate(t.ticketLabel, { price: formatIDR(alt.ticket) })}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
        {open && alternatives.length === 0 && (
          <p className="mt-2 rounded-xl bg-night-900/[0.04] px-3 py-2 text-xs font-medium text-night-800/55">
            {formatTemplate(t.noAlternatives, { city: profile.city })}
          </p>
        )}
      </div>
    </li>
  );
}

function DayCard({
  d,
  photoInitial,
  profile,
  onSwap,
}: {
  d: ItineraryDay;
  photoInitial: string;
  profile: ItinerarySegment["profile"];
  onSwap?: (id: string, next: Activity) => void;
}) {
  return (
    <li className="relative pl-12 sm:pl-16">
      <span
        className={`absolute top-1 left-0 grid size-8 place-items-center rounded-full text-sm font-extrabold text-white shadow-md sm:size-10 ${
          d.transit ? "bg-gradient-to-br from-sky-500 to-indigo-600" : "bg-gradient-to-br from-sunset-500 to-plum-600"
        }`}
        aria-hidden
      >
        {d.transit ? <BusFront className="size-4" aria-hidden /> : d.day}
      </span>
      <div className="lift overflow-hidden rounded-2xl border border-night-800/5 bg-white shadow-lg shadow-night-900/10">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:p-6">
          {/* Foto */}
          <div className="grid grid-cols-2 gap-2 sm:w-56 sm:shrink-0">
            {d.photos.map((p, i) => (
              <div
                key={`${d.day}-${i}`}
                className={`overflow-hidden rounded-xl bg-night-900/10 ${
                  i === 0 ? "col-span-2 h-32 sm:h-28" : "h-20 sm:h-16"
                }`}
              >
                <Photo url={p.url} alt={p.alt} initial={photoInitial} />
              </div>
            ))}
          </div>
          {/* Aktivitas */}
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-extrabold text-night-900">
              {formatTemplate(t.dayLabel, { day: String(d.day) })}
              {d.transit && (
                <span className="ml-2 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-700">
                  {formatTemplate(t.transitTag, { city: d.city })}
                </span>
              )}{" "}
              <span className="text-sm font-semibold text-night-800/55">
                — {formatDayName(d.date)}, {formatShortYear(d.date)}
              </span>
            </h3>
            <ul className="mt-3 space-y-3">
              {d.activities.map((a) => (
                <ActivityItem
                  key={a.id ?? `${d.day}-${a.time}`}
                  a={a}
                  profile={profile}
                  onSwap={onSwap}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}

interface Props {
  segments: ItinerarySegment[];
  cityName: string;
  lang: Language;
  onSwap?: (id: string, next: Activity) => void;
}

export default function Itinerary({ segments, cityName, lang, onSwap }: Props) {
  const t = TEXT[lang].itinerary;
  return (
    <div className="space-y-10">
      {onSwap && (
        <p className="-mb-4 rounded-xl bg-plum-500/[0.06] px-4 py-2.5 text-xs font-semibold text-plum-700">
          {t.swapHint}
        </p>
      )}
      {segments.map((seg, segIdx) => (
        <section key={`${seg.city}-${segIdx}`}>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sunset-500 to-plum-600 text-sm font-extrabold text-white shadow-md">
              {segIdx + 1}
            </span>
            <div>
              <h3 className="text-base font-extrabold text-night-900 sm:text-lg">{seg.city}</h3>
              <p className="text-xs font-medium text-night-800/55 sm:text-sm">
                {seg.profile.tagline} · {seg.days.filter((d) => !d.transit).length} hari
                {seg.days.some((d) => d.transit) && " + 1 hari transit"}
              </p>
            </div>
          </div>
          <ol className="relative space-y-8">
            <span
              className="absolute top-2 bottom-2 left-[15px] w-0.5 bg-gradient-to-b from-sunset-400 via-plum-500 to-plum-700 sm:left-[19px]"
              aria-hidden
            />
            {seg.days.map((d) => (
              <DayCard
                key={d.day}
                d={d}
                photoInitial={seg.city.charAt(0).toUpperCase() || cityName.charAt(0).toUpperCase()}
                profile={seg.profile}
                onSwap={onSwap}
              />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
