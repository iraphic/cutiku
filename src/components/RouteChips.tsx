import { findCity, type City } from "#/data/cities";
import { guessCountry } from "#/data/pricing";
import { TEXT, formatTemplate, type Language } from "#/lib/i18n";
import { ArrowDown, ArrowUp, GripVertical, X } from "lucide-react";

export interface RouteStop {
  key: string;
  name: string;
  country: string;
}

interface Props {
  originName: string;
  stops: RouteStop[];
  invalid?: boolean;
  lang: Language;
  onRemove: (key: string) => void;
  onMove: (key: string, dir: -1 | 1) => void;
}

/** Visualisasi rute: Asal → Kota 1 → Kota 2 → … dengan chip yang bisa dihapus & disusun ulang. */
export default function RouteChips({ originName, stops, invalid, lang, onRemove, onMove }: Props) {
  const t = TEXT[lang].form.route;
  return (
    <div
      className={`flex flex-wrap items-center gap-2 rounded-xl border-2 border-dashed px-3 py-2.5 ${
        invalid ? "border-red-400" : "border-plum-500/20"
      }`}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-night-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
        {originName.trim() || t.originFallback}
      </span>
      {stops.map((stop, i) => (
        <span key={stop.key} className="flex items-center gap-2">
          <span className="font-bold text-plum-500" aria-hidden>
            →
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-plum-500/25 bg-white py-1 pr-1 pl-2 text-xs font-bold text-night-900 shadow-sm">
            <GripVertical className="size-3.5 text-night-800/30" aria-hidden />
            <span className="grid size-4 place-items-center rounded-full bg-plum-500/10 text-[10px] font-extrabold text-plum-600">
              {i + 1}
            </span>
            {stop.name}
            <span className="flex items-center">
              <button
                type="button"
                aria-label={formatTemplate(t.moveEarlier, { city: stop.name })}
                disabled={i === 0}
                onClick={() => onMove(stop.key, -1)}
                className="grid size-6 place-items-center rounded-full text-night-800/50 transition-colors hover:bg-plum-500/10 hover:text-plum-600 disabled:opacity-30"
              >
                <ArrowUp className="size-3.5" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={formatTemplate(t.moveLater, { city: stop.name })}
                disabled={i === stops.length - 1}
                onClick={() => onMove(stop.key, 1)}
                className="grid size-6 place-items-center rounded-full text-night-800/50 transition-colors hover:bg-plum-500/10 hover:text-plum-600 disabled:opacity-30"
              >
                <ArrowDown className="size-3.5" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={formatTemplate(t.removeFromRoute, { city: stop.name })}
                onClick={() => onRemove(stop.key)}
                className="grid size-6 place-items-center rounded-full text-night-800/50 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </span>
          </span>
        </span>
      ))}
      {stops.length > 1 && (
        <>
          <span className="font-bold text-plum-500" aria-hidden>
            →
          </span>
          <span className="inline-flex items-center rounded-full bg-night-900/10 px-3 py-1.5 text-xs font-bold text-night-800/70">
            {originName.trim() || t.originFallback}{t.returnSuffix}
          </span>
        </>
      )}
      {stops.length === 0 && (
        <span className="text-xs font-medium text-night-800/45">
          {t.emptyHint}
        </span>
      )}
    </div>
  );
}

export function sameCity(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function resolveStop(text: string, city: City | undefined): RouteStop {
  const resolved = city && sameCity(city.name, text) ? city : findCity(text);
  return {
    key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: text.trim(),
    // Kota bebas di luar daftar: tebak negara dengan heuristik nama
    country: resolved?.country ?? guessCountry(text),
  };
}
