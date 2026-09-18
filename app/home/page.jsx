"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const Y = { bg: "bg-highlight", fg: "text-black" };
const R = { bg: "bg-accent2-500", fg: "text-white" };
const K = { bg: "bg-black", fg: "text-white" };

const all = [
  { price: "$0.99", headline: "OFERTA", status: "activo", ...Y },
  { price: "$1.25", headline: "OFERTA", status: "por vencer", ...R },
  { price: "$4.49", headline: "2 X 1", status: "activo", ...K },
  { price: "$1.89", headline: "PRECIO BAJO", status: "por vencer", ...Y },
  { price: "$2.75", headline: "OFERTA", status: "activo", ...R },
];

const docsRaw = [
  { name: "Ofertas semana 37", date: "5 sep 2026", items: [all[0], all[1], all[2], all[3], all[4], all[0]] },
  { name: "Lácteos y panadería", date: "1 sep 2026", items: [all[1], all[3]] },
  { name: "Fin de mes", date: "29 ago 2026", items: [all[2], all[4], all[0]] },
];

const docs = docsRaw.map((d) => ({
  ...d,
  thumbs: d.items.slice(0, 4),
  hasMore: d.items.length > 4,
  more: `+${d.items.length - 4}`,
  meta: `${d.items.length} rótulos · ${d.date}`,
}));

const activeCount = all.filter((p) => p.status !== "vencido").length;
const expiringCount = all.filter((p) => p.status === "por vencer").length;

const usedThisMonth = 6;
const monthlyLimit = 10;

const btnBase =
  "inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all hover:scale-105 active:scale-95";
const btnPrimary = `${btnBase} bg-black text-white px-5 py-2.5 hover:bg-neutral-800 active:bg-neutral-900`;
const btnGhost = `${btnBase} px-3 py-2.5 text-black hover:bg-neutral-100 active:bg-neutral-200`;
const btnSecondary = `${btnBase} px-4 py-2 border border-neutral-300 text-black hover:bg-neutral-100 active:bg-neutral-200`;

function Thumb({ item }) {
  return (
    <div
      className={`aspect-[8.5/11] flex-1 min-w-0 overflow-hidden rounded-md [container-type:inline-size] ${item.bg} ${item.fg}`}
    >
      <div className="grid h-full grid-rows-[auto_1fr] text-center">
        <span className="px-[6cqw] pt-[10cqw] text-[11cqw] font-extrabold uppercase leading-none">
          {item.headline}
        </span>
        <span className="grid place-content-center text-[30cqw] font-extrabold leading-[0.9] tracking-tighter">
          {item.price}
        </span>
      </div>
    </div>
  );
}

const Home = () => {
  const [todayLabel, setTodayLabel] = useState("");

  useEffect(() => {
    const today = new Date().toLocaleDateString("es", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    setTodayLabel(today.charAt(0).toUpperCase() + today.slice(1));
  }, []);

  return (
    <main className="mx-auto flex max-w-[1200px] flex-col gap-12 px-5 py-12 sm:px-8 lg:px-16">
      <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <span className="mb-3 block text-[13px] font-semibold uppercase tracking-wide text-neutral-700">
            {todayLabel}
          </span>
          <h1 className="text-[clamp(32px,4vw,52px)] font-bold leading-[1.08] tracking-tight">
            Hola, Tienda La Esquina.
          </h1>
          <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-neutral-800">
            Has usado {usedThisMonth} de {monthlyLimit} rótulos gratis este mes. ¿Qué
            vendemos hoy?
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/home/crear-afiches" className={`${btnPrimary} px-6 py-3.5 text-base`}>
              Crear afiches
            </Link>
            <Link href="/home/historial" className={btnGhost}>
              Ver historial
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5 rounded-2xl border border-neutral-300 bg-white p-5">
            <span className="text-4xl font-extrabold leading-none tracking-tight">
              {activeCount}
            </span>
            <span className="text-[13.5px] font-semibold text-neutral-700">
              ofertas activas
            </span>
          </div>
          <div className="grid gap-1.5 rounded-2xl border border-neutral-300 bg-white p-5">
            <span className="text-4xl font-extrabold leading-none tracking-tight text-accent2-600">
              {expiringCount}
            </span>
            <span className="text-[13.5px] font-semibold text-neutral-700">
              vencen esta semana
            </span>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-[22px] font-bold tracking-tight">
            Últimos documentos generados
          </h2>
          <Link href="/home/historial" className="text-sm font-semibold hover:text-accent2-600">
            Ver historial →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((d) => (
            <article
              key={d.name}
              className="flex items-center gap-4 rounded-2xl border border-neutral-300 bg-neutral-50 p-4"
            >
              <div className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-accent2-500 text-white">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{d.name}</div>
                <div className="text-[13px] text-neutral-700">{d.meta}</div>
              </div>
              <Link href="/home/historial" className={btnSecondary}>
                PDF
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;