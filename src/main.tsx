import { StrictMode, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import Budget from "#/components/Budget";
import DateOptions from "#/components/DateOptions";
import Footer from "#/components/Footer";
import Header from "#/components/Header";
import Hero from "#/components/Hero";
import Itinerary from "#/components/Itinerary";
import SavedPlans from "#/components/SavedPlans";
import TripForm, { type FormValue } from "#/components/TripForm";
import { TEXT, type Language } from "#/lib/i18n";
import { findCity } from "#/data/cities";
import { guessCountry } from "#/data/pricing";
import { useReveal } from "#/hooks/useReveal";
import {
  budgetFor,
  createPlan,
  itinerarySegmentsFor,
  type Activity,
  type HotelTier,
  type TravelStyle,
  type TripPlan,
} from "#/lib/planner";
import { formatRange } from "#/lib/dateUtils";
import {
  deletePlan,
  loadPlans,
  savePlan,
  type SavedPlan,
} from "#/lib/storage";
import { CalendarRange, Map, Save } from "lucide-react";

function App() {
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string>("");
  const [tier, setTier] = useState<HotelTier>("mid");
  const [lang, setLang] = useState<Language>("id");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<SavedPlan[]>(() => loadPlans());
  const [justSaved, setJustSaved] = useState(false);
  const [restoreInitial, setRestoreInitial] = useState<{
    days: number;
    startDate: string;
    origin: string;
    destination: string;
    route?: { name: string; country: string }[];
    style?: TravelStyle;
  } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const revealOptions = useReveal<HTMLDivElement>();
  const revealItinerary = useReveal<HTMLDivElement>();
  const revealBudget = useReveal<HTMLDivElement>();

  const selectedOption = useMemo(
    () => plan?.options.find((o) => o.id === selectedOptionId) ?? plan?.options[0] ?? null,
    [plan, selectedOptionId],
  );

  const segments = useMemo(
    () => (plan && selectedOption ? itinerarySegmentsFor(plan, selectedOption) : []),
    [plan, selectedOption],
  );

  const budget = useMemo(
    () => (plan && selectedOption ? budgetFor(plan, selectedOption, lang) : null),
    [plan, selectedOption, lang],
  );

  const scrollToResults = () => {
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleSubmit = (value: FormValue) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLoading(true);
    setJustSaved(false);
    timerRef.current = setTimeout(() => {
      const newPlan = createPlan(value);
      setPlan(newPlan);
      setSelectedOptionId(newPlan.options[0].id);
      setLoading(false);
      scrollToResults();
    }, 600);
  };

  const handleSave = () => {
    if (!plan || !selectedOption) return;
    const isMulti = (plan.input.route?.length ?? 0) > 1;
    const label = isMulti
      ? `${plan.input.origin.name} ⇄ ${plan.input.route!.map((r) => r.name).join(" → ")} · ${formatRange(selectedOption.start, selectedOption.end)}`
      : `${plan.input.destination} · ${formatRange(selectedOption.start, selectedOption.end)}`;
    const next = savePlan({
      label,
      payload: {
        days: plan.input.days,
        startDate: `${plan.input.startDate.getFullYear()}-${String(plan.input.startDate.getMonth() + 1).padStart(2, "0")}-${String(plan.input.startDate.getDate()).padStart(2, "0")}`,
        origin: plan.input.origin.name,
        destination: plan.input.destination,
        destinationCountry: plan.input.destinationCountry,
        route: plan.input.route && plan.input.route.length > 0 ? plan.input.route : undefined,
        style: plan.input.style,
        overrides: plan.overrides && Object.keys(plan.overrides).length > 0 ? plan.overrides : undefined,
      },
    });
    setSaved(next);
    setJustSaved(true);
  };

  const handleSwap = (id: string, next: Activity) => {
    setPlan((p) => (p ? { ...p, overrides: { ...(p.overrides ?? {}), [id]: next } } : p));
    setJustSaved(false);
  };

  const handleLoadSaved = (entry: SavedPlan) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const { payload } = entry;
    const origin =
      findCity(payload.origin) ?? {
        name: payload.origin,
        country: guessCountry(payload.origin),
        countryId: guessCountry(payload.origin),
        popular: false,
      };
    const destCity = findCity(payload.destination);
    const [y, m, d] = payload.startDate.split("-").map(Number);
    const newPlan = createPlan({
      days: payload.days,
      startDate: new Date(y, m - 1, d),
      origin,
      destination: payload.destination,
      destinationCountry: destCity?.country ?? guessCountry(payload.destination, origin.country),
      route: payload.route && payload.route.length > 0 ? payload.route : [],
      style: payload.style ?? "padat",
    });
    if (payload.overrides) newPlan.overrides = payload.overrides;
    setRestoreInitial({
      days: payload.days,
      startDate: payload.startDate,
      origin: payload.origin,
      destination: payload.destination,
      route: payload.route,
      style: payload.style,
    });
    setPlan(newPlan);
    setSelectedOptionId(newPlan.options[0].id);
    setJustSaved(false);
    scrollToResults();
  };

  return (
    <main className="min-h-[100dvh] bg-[#f7f4ff] font-sans text-night-900" id="application-root">
      <Header lang={lang} onLanguageChange={setLang} />
      <Hero lang={lang} />

      <div className="pb-20">
        <TripForm
          key={restoreInitial ? `${(restoreInitial.route ?? [{ name: restoreInitial.destination }]).map((r) => r.name).join("+")}-${restoreInitial.startDate}` : "default"}
          onSubmit={handleSubmit}
          loading={loading}
          initial={restoreInitial}
          lang={lang}
        />

        {/* HASIL */}
        <div
          id="hasil"
          ref={resultsRef}
          aria-live="polite"
          className="mx-auto mt-14 max-w-6xl scroll-mt-24 px-4 sm:px-6"
        >
          {!plan && !loading && (
            <p className="rounded-2xl border-2 border-dashed border-plum-500/25 bg-white/60 px-6 py-10 text-center text-sm font-semibold text-night-800/55">
              {TEXT[lang].form.emptyState}
            </p>
          )}

          {plan && selectedOption && (
            <div className="space-y-14">
              {/* Opsi tanggal */}
              <div ref={revealOptions.ref} className={revealOptions.className}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-sunset-500/10 text-sunset-600">
                    <CalendarRange className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-night-900 sm:text-2xl">
                      {TEXT[lang].dateOptions.sectionTitle}
                    </h2>
                    <p className="text-sm text-night-800/60">
                      {TEXT[lang].dateOptions.sectionSubtitle}
                    </p>
                  </div>
                </div>
                <DateOptions
                  options={plan.options}
                  selectedId={selectedOption.id}
                  onSelect={setSelectedOptionId}
                  lang={lang}
                />
              </div>

              {/* Itinerary */}
              <div ref={revealItinerary.ref} className={revealItinerary.className}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-plum-500/10 text-plum-600">
                      <Map className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight text-night-900 sm:text-2xl">
                        {plan.profiles
                          ? `${TEXT[lang].itinerary.multiCityTitle.replace("{days}", String(plan.input.days))}: ${plan.input.origin.name} ⇄ ${plan.profiles.map((p) => p.city).join(" → ")}`
                          : `${TEXT[lang].itinerary.singleCityTitle.replace("{days}", String(plan.input.days))} ${plan.profile.city}`}
                      </h2>
                      <p className="text-sm text-night-800/60">
                        {plan.profiles
                          ? TEXT[lang].itinerary.multiCitySubtitle.replace("{count}", String(plan.profiles.length))
                          : plan.profile.tagline}{" "}
                        · {formatRange(selectedOption.start, selectedOption.end)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={justSaved}
                    className="inline-flex items-center gap-2 rounded-full bg-night-900 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-night-800 disabled:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-900"
                  >
                    <Save className="size-4" aria-hidden />
                    {justSaved ? TEXT[lang].savedPlans.saveSuccess : TEXT[lang].savedPlans.saveButton}
                  </button>
                </div>
                <Itinerary segments={segments} cityName={plan.profile.city} lang={lang} onSwap={handleSwap} />
              </div>

              {/* Budget */}
              {budget && (
                <div ref={revealBudget.ref} className={revealBudget.className}>
                  <Budget budget={budget} tier={tier} onTierChange={setTier} lang={lang} />
                </div>
              )}
            </div>
          )}

          <div className="mt-12">
            <SavedPlans
              plans={saved}
              onLoad={handleLoadSaved}
              onDelete={(id) => setSaved(deletePlan(id))}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <Footer lang={lang} />
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
