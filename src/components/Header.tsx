import { Palmtree } from "lucide-react";
import { useEffect, useState } from "react";
import { LANGUAGES, TEXT, type Language } from "#/lib/i18n";

const LINKS = [
  { href: "#form", labelKey: "navForm" },
  { href: "#hasil", labelKey: "navResults" },
  { href: "#tentang", labelKey: "navAbout" },
];

interface Props {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({ lang, onLanguageChange }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const t = TEXT[lang].header;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 shadow-lg shadow-night-900/5 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#atas" className="flex items-center gap-2" aria-label="CutiKu – kembali ke atas">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-sunset-500 to-plum-600 text-white shadow-md">
            <Palmtree className="size-5" aria-hidden />
          </span>
          <span
            className={`text-lg font-extrabold tracking-tight transition-colors ${
              scrolled ? "text-night-900" : "text-white"
            }`}
          >
            CutiKu
          </span>
        </a>
        <nav aria-label="Navigasi utama">
          <ul className="flex items-center gap-1 sm:gap-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sunset-500 ${
                    scrolled
                      ? "text-night-800 hover:bg-sunset-50 hover:text-sunset-600"
                      : "text-white/90 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {t[l.labelKey as keyof typeof t]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-night-800/60">
            {t.languageLabel}
          </span>
          {LANGUAGES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => onLanguageChange(code)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                lang === code
                  ? "bg-plum-600 text-white"
                  : scrolled
                  ? "text-night-800 hover:bg-sunset-50 hover:text-sunset-600"
                  : "text-white/90 hover:bg-white/15 hover:text-white"
              }`}
            >
              {t[code === "id" ? "languageId" : "languageEn"]}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
