"use client";
import { useEffect, useState } from "react";
import Cargando from "@/components/loading";
import { toast } from "sonner";
import axios from "axios";

const fechaCorta = (valor) =>
  new Date(valor).toLocaleDateString("es", { day: "numeric", month: "short" });

const fechaLarga = (valor) =>
  new Date(valor).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const AdminRotulos = () => {
  const [rotulos, setRotulos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const cargarRotulos = async () => {
    try {
      const { data } = await axios.get("/api/admin/rotulos");
      setRotulos(data);
    } catch (error) {
      toast.error(error.response?.data?.error ?? "No se pudieron cargar los rotulos");
    } finally {
      setCargando(false);
    }
  };

  // al entrar a la pagina pido la lista una sola vez
  useEffect(() => {
    // el setState de cargarRotulos ocurre despues del await, no dentro del efecto
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarRotulos();
  }, []);

  // filtro en el navegador: por producto, codigo o por quien lo creo
  const texto = busqueda.trim().toLowerCase();
  const filtrados = texto
    ? rotulos.filter((r) =>
        [r.descripcion, r.ean, r.nombre, r.apellido, r.nombre_negocio, r.email]
          .filter(Boolean)
          .some((campo) => String(campo).toLowerCase().includes(texto)),
      )
    : rotulos;

  const usuarios = new Set(rotulos.map((r) => r.usuario_id)).size;
  const pendientes = rotulos.filter((r) => r.documento_id === null).length;
  const impresos = rotulos.length - pendientes;

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-5 py-8 sm:px-8 lg:px-16">
      {cargando && <Cargando texto="Buscando los rotulos ..."></Cargando>}

      <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <h1 className="text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.08] tracking-tight">
            Rótulos de usuarios
          </h1>
          <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-neutral-800">
            Todos los rótulos que han generado los usuarios de la plataforma, del
            más reciente al más antiguo.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="grid gap-1.5 rounded-2xl border border-neutral-300 bg-white p-5">
            <i className="fa-jelly-duo fa-regular fa-tags mb-1 text-2xl"></i>
            <span className="text-4xl font-extrabold leading-none tracking-tight">
              {rotulos.length}
            </span>
            <span className="text-[13.5px] font-semibold text-neutral-700">rótulos</span>
          </div>
          <div className="grid gap-1.5 rounded-2xl border border-neutral-300 bg-white p-5">
            <i className="fa-jelly-duo fa-regular fa-users mb-1 text-2xl"></i>
            <span className="text-4xl font-extrabold leading-none tracking-tight">
              {usuarios}
            </span>
            <span className="text-[13.5px] font-semibold text-neutral-700">usuarios</span>
          </div>
          <div className="grid gap-1.5 rounded-2xl border border-neutral-300 bg-white p-5">
            <i className="fa-jelly-duo fa-regular fa-hourglass mb-1 text-2xl text-accent2-600"></i>
            <span className="text-4xl font-extrabold leading-none tracking-tight text-accent2-600">
              {pendientes}
            </span>
            <span className="text-[13.5px] font-semibold text-neutral-700">
              sin imprimir
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-300 bg-neutral-50 p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-bold tracking-tight">Listado</h2>
            <p className="text-[13.5px] text-neutral-700">
              {filtrados.length} de {rotulos.length} rótulos · {impresos} impresos
            </p>
          </div>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
            }}
            className="block w-full max-w-[320px] rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none"
            placeholder="Buscar por producto, código o usuario"
          />
        </div>

        {!cargando && filtrados.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-400 p-6 text-center text-sm text-neutral-700">
            <i className="fa-jelly-duo fa-regular fa-inbox mb-2 block text-3xl"></i>
            {rotulos.length === 0
              ? "Todavía ningún usuario ha generado rótulos."
              : "Ningún rótulo coincide con tu búsqueda."}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-300 bg-white">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-neutral-100 text-[12px] font-semibold uppercase tracking-wide text-neutral-700">
                <tr>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3 text-right">Oferta</th>
                  <th className="px-4 py-3">Vigencia</th>
                  <th className="px-4 py-3 text-center">Copias</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Creado</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((r) => (
                  <tr key={r.id} className="border-t border-neutral-200">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{r.descripcion}</div>
                      <div className="text-[13px] text-neutral-700">{r.ean}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">
                        {r.nombre} {r.apellido}
                      </div>
                      <div className="text-[13px] text-neutral-700">
                        {r.nombre_negocio || r.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-extrabold text-accent2-600">
                        ${Number(r.precio_oferta).toFixed(2)}
                      </div>
                      <div className="text-[13px] text-neutral-700">
                        antes <s>${Number(r.precio_unitario).toFixed(2)}</s>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {fechaCorta(r.fecha_inicio)} al {fechaCorta(r.fecha_fin)}
                    </td>
                    <td className="px-4 py-3 text-center">{r.copias}</td>
                    <td className="px-4 py-3">
                      {r.documento_id === null ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent2-100 px-2.5 py-1 text-[12px] font-semibold text-accent2-700">
                          <i className="fa-jelly-duo fa-regular fa-hourglass"></i>
                          Pendiente
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-200 px-2.5 py-1 text-[12px] font-semibold text-neutral-800">
                          <i className="fa-jelly-duo fa-regular fa-print"></i>
                          Impreso
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-700">
                      {fechaLarga(r.fecha_creacion)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminRotulos;
