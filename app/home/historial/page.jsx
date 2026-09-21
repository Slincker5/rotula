"use client";
import { useEffect, useState } from "react";
import Cargando from "@/components/loading";
import { toast } from "sonner";
import Link from "next/link";
import axios from "axios";

const fechaLarga = (valor) =>
  new Date(valor).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const Historial = () => {
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarDocumentos = async () => {
    try {
      const { data } = await axios.get("/api/documentos");
      setDocumentos(data);
    } catch (error) {
      toast.error(error.response?.data?.error ?? "No se pudo cargar tu historial");
    } finally {
      setCargando(false);
    }
  };

  // al entrar a la pagina pido los documentos una sola vez
  useEffect(() => {
    // el setState de cargarDocumentos ocurre despues del await, no dentro del efecto
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarDocumentos();
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-5 py-12 sm:px-8 lg:px-16">
      {cargando && <Cargando texto="Buscando tus documentos ..."></Cargando>}

      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.08] tracking-tight">
            Historial
          </h1>
          <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-neutral-800">
            Todos los PDF que has generado. Ábrelos y vuelve a imprimirlos cuando quieras.
          </p>
        </div>
        <Link href="/home/crear-afiches" className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all bg-black text-white px-5 py-2.5 hover:bg-neutral-800 active:bg-neutral-900">
          <i className="fa-jelly-duo fa-regular fa-circle-plus"></i>
          Crear afiches
        </Link>
      </section>

      {!cargando && documentos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-400 p-10 text-center text-neutral-700">
          <i className="fa-jelly-duo fa-regular fa-inbox mb-2 block text-3xl"></i>
          Todavía no has generado ningún PDF.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documentos.map((d) => {
            const hojas = Math.ceil(d.total_rotulos / d.rotulos_por_hoja);
            return (
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
                    {d.total_rotulos} rótulos · {hojas} {hojas === 1 ? "hoja" : "hojas"} ·{" "}
                    {fechaLarga(d.fecha_creacion)}
                  </div>
                </div>
                <a href={d.url_pdf} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all px-4 py-2 border border-neutral-300 text-black hover:bg-neutral-100 active:bg-neutral-200">
                  <i className="fa-jelly-duo fa-regular fa-arrow-down-to-line"></i>
                  PDF
                </a>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Historial;
