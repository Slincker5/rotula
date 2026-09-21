"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import Cargando from "@/components/loading";

const monthlyLimit = 10;
const DIA = 24 * 60 * 60 * 1000;

const fechaLarga = (valor) =>
  new Date(valor).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const Home = () => {
  const [todayLabel, setTodayLabel] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [rotulos, setRotulos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const today = new Date().toLocaleDateString("es", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    setTodayLabel(today.charAt(0).toUpperCase() + today.slice(1));
  }, []);

  const cargarInicio = async () => {
    try {
      const usuarioApi = await axios.get("/api/usuario");
      setUsuario(usuarioApi.data.usuario);

      const rotulosApi = await axios.get("/api/rotulos");
      setRotulos(rotulosApi.data);

      const documentosApi = await axios.get("/api/documentos");
      setDocumentos(documentosApi.data);
    } catch (error) {
      toast.error(error.response?.data?.error ?? "No se pudo cargar tu inicio");
    } finally {
      setCargando(false);
    }
  };

  // al entrar a la pagina pido los datos una sola vez
  useEffect(() => {
    // el setState de cargarInicio ocurre despues del await, no dentro del efecto
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarInicio();
  }, []);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const activas = rotulos.filter((r) => new Date(r.fecha_fin) >= hoy);
  const porVencer = activas.filter(
    (r) => new Date(r.fecha_fin).getTime() < hoy.getTime() + 7 * DIA,
  );
  const usedThisMonth = rotulos.filter((r) => {
    const creado = new Date(r.fecha_creacion);
    return (
      creado.getMonth() === hoy.getMonth() && creado.getFullYear() === hoy.getFullYear()
    );
  }).length;

  const saludo = usuario ? usuario.nombre_negocio || usuario.nombre : "";
  const ultimos = documentos.slice(0, 3);

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-5 py-12 sm:px-8 lg:px-16">
      {cargando && <Cargando texto="Preparando tu inicio ..."></Cargando>}

      <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <span className="mb-3 block text-[13px] font-semibold uppercase tracking-wide text-neutral-700">
            {todayLabel}
          </span>
          <h1 className="text-[clamp(32px,4vw,52px)] font-bold leading-[1.08] tracking-tight">
            {saludo ? `Hola, ${saludo}.` : "Hola."}
          </h1>
          <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-neutral-800">
            Has usado {usedThisMonth} de {monthlyLimit} rótulos gratis este mes. ¿Qué
            vendemos hoy?
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/home/crear-afiches" className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-base transition-all hover:scale-105 active:scale-95 bg-black text-white px-6 py-3.5 hover:bg-neutral-800 active:bg-neutral-900">
              <i className="fa-jelly-duo fa-regular fa-circle-plus"></i>
              Crear afiches
            </Link>
            <Link href="/home/historial" className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all hover:scale-105 active:scale-95 px-3 py-2.5 text-black hover:bg-neutral-100 active:bg-neutral-200">
              <i className="fa-jelly-duo fa-regular fa-clock"></i>
              Ver historial
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5 rounded-2xl border border-neutral-300 bg-white p-5">
            <i className="fa-jelly-duo fa-regular fa-tag mb-1 text-2xl"></i>
            <span className="text-4xl font-extrabold leading-none tracking-tight">
              {activas.length}
            </span>
            <span className="text-[13.5px] font-semibold text-neutral-700">
              ofertas activas
            </span>
          </div>
          <div className="grid gap-1.5 rounded-2xl border border-neutral-300 bg-white p-5">
            <i className="fa-jelly-duo fa-regular fa-hourglass mb-1 text-2xl text-accent2-600"></i>
            <span className="text-4xl font-extrabold leading-none tracking-tight text-accent2-600">
              {porVencer.length}
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
            Ver historial <i className="fa-jelly-duo fa-regular fa-arrow-right"></i>
          </Link>
        </div>

        {!cargando && ultimos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-400 p-8 text-center text-neutral-700">
            <i className="fa-jelly-duo fa-regular fa-inbox mb-2 block text-3xl"></i>
            Aún no has generado ningún PDF. Crea tus primeros afiches y aparecerán aquí.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ultimos.map((d) => (
              <article
                key={d.id}
                className="flex items-center gap-4 rounded-2xl border border-neutral-300 bg-neutral-50 p-4"
              >
                <div className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-accent2-500 text-white">
                  <i className="fa-jelly-duo fa-regular fa-file text-2xl"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{d.titulo}</div>
                  <div className="text-[13px] text-neutral-700">
                    {d.total_rotulos} rótulos · {fechaLarga(d.fecha_creacion)}
                  </div>
                </div>
                <a href={d.url_pdf} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all hover:scale-105 active:scale-95 px-4 py-2 border border-neutral-300 text-black hover:bg-neutral-100 active:bg-neutral-200">
                  <i className="fa-jelly-duo fa-regular fa-arrow-down-to-line"></i>
                  PDF
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
