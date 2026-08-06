import type { SavedPlan } from "#/lib/storage";
import { Bookmark, Trash2 } from "lucide-react";
import { useState } from "react";
import { TEXT, type Language, formatTemplate } from "#/lib/i18n";

interface Props {
  plans: SavedPlan[];
  onLoad: (plan: SavedPlan) => void;
  onDelete: (id: string) => void;
  lang: Language;
}

export default function SavedPlans({ plans, onLoad, onDelete, lang }: Props) {
  const [open, setOpen] = useState(false);
  const t = TEXT[lang].savedPlans;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border-2 border-plum-500/20 bg-white px-5 py-2.5 text-sm font-bold text-plum-700 shadow-sm transition-colors hover:bg-plum-500/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-600"
      >
        <Bookmark className="size-4" aria-hidden />
        {t.title}
        {plans.length > 0 && (
          <span className="rounded-full bg-plum-600 px-2 py-0.5 text-[11px] font-extrabold text-white">
            {formatTemplate(t.savedCount, { count: plans.length })}
          </span>
        )}
      </button>

      {open && (
        <div className="mt-3 rounded-2xl border border-night-800/8 bg-white p-4 shadow-xl shadow-night-900/10">
          {plans.length === 0 ? (
            <p className="px-2 py-4 text-sm text-night-800/60">
              {t.empty}
            </p>
          ) : (
            <ul className="divide-y divide-night-800/8">
              {plans.map((p) => (
                <li key={p.id} className="flex items-center gap-2 py-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onLoad(p);
                      setOpen(false);
                    }}
                    className="min-w-0 flex-1 rounded-lg px-2 py-1.5 text-left text-sm font-semibold text-night-900 transition-colors hover:bg-sunset-50 focus-visible:outline-2 focus-visible:outline-plum-600"
                  >
                    <span className="block truncate">{p.label}</span>
                    <span className="block text-xs font-medium text-night-800/50">
                      {formatTemplate(t.savedOn, {
                        date: new Date(p.createdAt).toLocaleDateString(lang === "id" ? "id-ID" : "en-US"),
                      })}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    aria-label={formatTemplate(t.removeLabel, { label: p.label })}
                    className="grid size-9 shrink-0 place-items-center rounded-lg text-night-800/40 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-500"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
