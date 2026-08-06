import { Palmtree } from "lucide-react";
import { TEXT, type Language, formatTemplate } from "#/lib/i18n";

export default function Footer({ lang }: { lang: Language }) {
  const t = TEXT[lang].footer;
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
              {t.about}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-wide text-white uppercase">
              {t.howItWorksTitle}
            </h2>
            <ol className="mt-3 space-y-2 text-sm text-white/60">
              {t.howItWorksSteps.map((step, idx) => (
                <li key={idx}>{idx + 1}. {step}</li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-wide text-white uppercase">
              {t.disclaimerTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              {t.disclaimer}
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          {formatTemplate(t.copyright, { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
