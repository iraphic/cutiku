import type { DateOption } from "#/lib/planner";
import { formatRange, parseISO, formatShortYear } from "#/lib/dateUtils";
import { TEXT, type Language, formatTemplate } from "#/lib/i18n";
import { BadgeCheck, Calendar, CheckCircle2 } from "lucide-react";

interface Props {
  options: DateOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  lang: Language;
}

export default function DateOptions({ options, selectedId, onSelect, lang }: Props) {
  const t = TEXT[lang].dateOptions;
  const bestId = options.reduce((a, b) => (b.score > a.score ? b : a)).id;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {options.map((opt) => {
        const isBest = opt.id === bestId;
        const selected = opt.id === selectedId;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            aria-pressed={selected}
            className={`lift relative rounded-2xl border-2 p-5 text-left shadow-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-600 ${
              selected
                ? "border-plum-600 bg-gradient-to-br from-plum-600/[0.06] to-sunset-500/[0.06] shadow-plum-600/15"
                : "border-transparent bg-white shadow-night-900/10"
            }`}
          >
            {isBest && (
              <span className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sunset-500 to-plum-600 px-3 py-1 text-[11px] font-extrabold text-white shadow-md">
                <BadgeCheck className="size-3.5" aria-hidden /> {t.suggested}
              </span>
            )}
            <span className="mb-1 flex items-center justify-between gap-2">
              <span className="text-xs font-bold tracking-wide text-night-800/50 uppercase">
                {opt.isUserChoice ? t.userChoice : t.suggested}
              </span>
              {selected && <CheckCircle2 className="size-5 text-plum-600" aria-label={lang === "id" ? "Terpilih" : "Selected"} />}
            </span>
            <span className="block text-lg font-extrabold text-night-900">
              {formatRange(opt.start, opt.end)}
            </span>

            <span className="mt-3 flex gap-2">
              <span className="flex-1 rounded-xl bg-sunset-50 px-3 py-2 text-center">
                <span className="block text-xl font-extrabold text-sunset-600 tabular-nums">
                  {opt.totalDaysOff}
                </span>
                <span className="block text-[11px] font-semibold text-night-800/60">
                  hari libur total
                </span>
              </span>
              <span className="flex-1 rounded-xl bg-plum-500/10 px-3 py-2 text-center">
                <span className="block text-xl font-extrabold text-plum-600 tabular-nums">
                  {opt.leaveDaysUsed}
                </span>
                <span className="block text-[11px] font-semibold text-night-800/60">
                  hari cuti dipakai
                </span>
              </span>
            </span>

            {opt.holidaysCovered.length > 0 && (
              <span className="mt-3 flex flex-wrap gap-1.5">
                {opt.holidaysCovered.slice(0, 3).map((h) => (
                  <span
                    key={h.date}
                    className="inline-flex items-center gap-1 rounded-full bg-night-900/[0.045] px-2.5 py-1 text-[11px] font-semibold text-night-800"
                  >
                    <Calendar className="size-3 text-sunset-500" aria-hidden />
                    {formatShortYear(parseISO(h.date))} · {h.name}
                  </span>
                ))}
                {opt.holidaysCovered.length > 3 && (
                  <span className="rounded-full bg-night-900/[0.045] px-2.5 py-1 text-[11px] font-semibold text-night-800">
                    {formatTemplate(t.holidaysMore, { count: opt.holidaysCovered.length - 3 })}
                  </span>
                )}
              </span>
            )}

            <span className="mt-3 block text-sm leading-relaxed text-night-800/75">{opt.reason}</span>
          </button>
        );
      })}
    </div>
  );
}
