import { searchCities, type City } from "#/data/cities";
import { formatTemplate, TEXT, type Language } from "#/lib/i18n";
import { MapPin, PencilLine } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string, city?: City) => void;
  placeholder?: string;
  invalid?: boolean;
  lang: Language;
}

export default function CityAutocomplete({ id, label, value, onChange, placeholder, invalid, lang }: Props) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [options, setOptions] = useState<City[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const trimmed = value.trim();
  const t = TEXT[lang].form.autocomplete;
  const exactMatch = options.some((ct) => ct.name.toLowerCase() === trimmed.toLowerCase());
  // Entri bebas: teks non-kosong yang tidak persis cocok dengan daftar
  const freeTextOption = trimmed.length > 0 && !exactMatch;

  useEffect(() => {
    setOptions(searchCities(value));
    setHighlight(0);
  }, [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const select = (city: City) => {
    onChange(city.name, city);
    setOpen(false);
  };

  const selectFreeText = () => {
    if (trimmed) onChange(trimmed, undefined);
    setOpen(false);
  };

  const totalItems = options.length + (freeTextOption ? 1 : 0);
  const highlightedFreeText = freeTextOption && highlight === 0;
  const highlightedCity = options[freeTextOption ? highlight - 1 : highlight];

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, totalItems - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && highlightedFreeText) {
        e.preventDefault();
        selectFreeText();
      } else if (open && highlightedCity) {
        e.preventDefault();
        select(highlightedCity);
      }
      // Enter dengan dropdown tertutup: entri bebas diterima apa adanya (value sudah tersimpan)
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-night-800">
        {label}
      </label>
      <div className="relative">
        <MapPin
          className={`pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 ${
            invalid ? "text-red-500" : "text-plum-500"
          }`}
          aria-hidden
        />
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={
            open && (highlightedFreeText || highlightedCity) ? `${id}-opt-${highlight}` : undefined
          }
          aria-autocomplete="list"
          aria-invalid={invalid || undefined}
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value, undefined);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={`w-full rounded-xl border-2 bg-white py-3 pr-3 pl-10 text-sm font-medium text-night-900 shadow-sm transition-colors placeholder:text-night-800/35 focus:outline-none ${
            invalid
              ? "border-red-400 focus:border-red-500"
              : "border-plum-500/15 focus:border-plum-500"
          }`}
        />
      </div>
      {open && totalItems > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-night-800/10 bg-white py-1 shadow-2xl shadow-night-900/15"
        >
          {freeTextOption && (
            <li id={`${id}-opt-0`} role="option" aria-selected={highlight === 0}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={selectFreeText}
                onMouseEnter={() => setHighlight(0)}
                className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors ${
                  highlight === 0 ? "bg-sunset-50" : "bg-white"
                }`}
              >
                <PencilLine className="size-4 shrink-0 text-plum-500" aria-hidden />
                <span className="min-w-0">
                          <span className="block truncate font-semibold text-night-900">
                      {formatTemplate(t.useOption, { value: trimmed })}
                    </span>
                    <span className="block truncate text-xs text-night-800/60">
                      {t.freeNote}
                    </span>
                </span>
              </button>
            </li>
          )}
          {options.map((city, i) => {
            const idx = freeTextOption ? i + 1 : i;
            return (
              <li
                key={`${city.name}-${city.country}`}
                id={`${id}-opt-${idx}`}
                role="option"
                aria-selected={idx === highlight}
              >
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(city)}
                  onMouseEnter={() => setHighlight(idx)}
                  className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors ${
                    idx === highlight ? "bg-sunset-50" : "bg-white"
                  }`}
                >
                  <MapPin className="size-4 shrink-0 text-sunset-500" aria-hidden />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-night-900">{city.name}</span>
                    <span className="block truncate text-xs text-night-800/60">{city.countryId}</span>
                  </span>
                  {city.popular && (
                    <span className="ml-auto shrink-0 rounded-full bg-plum-500/10 px-2 py-0.5 text-[10px] font-bold text-plum-600">
                      Populer
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
