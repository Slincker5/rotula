"use client";
import { useEffect, useState } from "react";
import Cargando from "@/components/loading";
import { toast } from "sonner";
import Link from "next/link";
import { agregarRotulo, editarRotulo, generarDocumento, listarPendientes, quitarRotulo } from "@/lib/rotulos";
import { descargarPdf } from "@/lib/pdf/generarRotulos";
import { enDias, fechaCorta } from "@/lib/fechas";
import { listarProductos } from "@/lib/productos";

const POR_HOJA = 4;

const CrearAfiches = () => {
  const [ean, setEan] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioOferta, setPrecioOferta] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [copias, setCopias] = useState("1");
  const [fechaInicio, setFechaInicio] = useState(enDias(0));
  const [fechaFin, setFechaFin] = useState(enDias(7));
  const [editando, setEditando] = useState(null);
  const [pendientes, setPendientes] = useState([]);
  const [documento, setDocumento] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [textoCarga, setTextoCarga] = useState("");
  const [productos, setProductos] = useState([]);

  const limpiarFormulario = () => {
    setEan("");
    setDescripcion("");
    setPrecioOferta("");
    setPrecioUnitario("");
    setCopias("1");
    setFechaInicio(enDias(0));
    setFechaFin(enDias(7));
    setEditando(null);
  };

  const cargarRotulos = async () => {
    try {
      // los que ya salieron en un PDF tienen documento_id; aqui solo los pendientes
      setPendientes(await listarPendientes());
    } catch (error) {
      toast.error(error.message ?? "No se pudieron cargar tus rotulos");
    }
  };

  // al entrar a la pagina pido la lista una sola vez
  useEffect(() => {
    // el setState de cargarRotulos ocurre despues del await, no dentro del efecto
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarRotulos();
    // productos guardados (modulo Mis productos) para llenar el rotulo con un clic
    listarProductos()
      .then(setProductos)
      .catch(() => setProductos([]));
  }, []);

  const usarProducto = (id) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;
    setEan(producto.ean ?? "");
    setDescripcion(producto.descripcion);
    setPrecioUnitario(String(producto.precio));
  };

  const guardarRotulo = async (e) => {
    e.preventDefault();
    try {
      setTextoCarga("Guardando tu rotulo ...");
      setCargando(true);
      const body = {
        ean: ean,
        descripcion: descripcion,
        precio_oferta: precioOferta,
        precio_unitario: precioUnitario,
        copias: copias,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      };
      // si estoy editando actualizo ese rotulo, si no creo uno nuevo
      // las reglas de negocio se validan en lib/rotulos.js y otra vez en firestore.rules
      if (editando) {
        await editarRotulo(editando, body);
        toast.success("Rotulo actualizado");
      } else {
        await agregarRotulo(body);
        toast.success(`Se agregaron ${body.copias} rotulos a tu lista`);
      }
      limpiarFormulario();
      await cargarRotulos();
    } catch (error) {
      toast.error(error.message ?? "No se pudo guardar el rotulo");
    } finally {
      setCargando(false);
    }
  };

  const editar = (rotulo) => {
    setEditando(rotulo.id);
    setEan(rotulo.ean ?? "");
    setDescripcion(rotulo.descripcion);
    setPrecioOferta(String(rotulo.precio_oferta));
    setPrecioUnitario(String(rotulo.precio_unitario));
    setCopias(String(rotulo.copias));
    setFechaInicio(rotulo.fecha_inicio);
    setFechaFin(rotulo.fecha_fin);
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  const eliminarRotulo = async (rotulo) => {
    if (!window.confirm(`¿Quitar "${rotulo.descripcion}" de tu lista?`)) return;
    try {
      setTextoCarga("Eliminando ...");
      setCargando(true);
      await quitarRotulo(rotulo.id);
      toast.success("Rotulo quitado de tu lista");
      if (editando === rotulo.id) limpiarFormulario();
      await cargarRotulos();
    } catch (error) {
      toast.error(error.message ?? "No se pudo eliminar el rotulo");
    } finally {
      setCargando(false);
    }
  };

  // arma el PDF en el navegador con los rotulos pendientes y lo registra en Firestore
  const generarPdf = async () => {
    try {
      setTextoCarga("Armando tu PDF ...");
      setCargando(true);
      const { bytes, ...data } = await generarDocumento();
      descargarPdf(bytes, `rotulos-${data.id}.pdf`);
      // enlace para volver a abrirlo sin generarlo otra vez
      setDocumento({ ...data, url: URL.createObjectURL(new Blob([bytes], { type: "application/pdf" })) });
      toast.success(`PDF listo: ${data.rotulos} rotulos en ${data.hojas} hojas`);
      await cargarRotulos();
    } catch (error) {
      toast.error(error.message ?? "No se pudo generar el PDF");
    } finally {
      setCargando(false);
    }
  };

  const totalRotulos = pendientes.reduce((t, r) => t + Number(r.copias), 0);
  const totalHojas = Math.ceil(totalRotulos / POR_HOJA);

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-5 py-12 sm:px-8 lg:px-16">
      {cargando && <Cargando texto={textoCarga}></Cargando>}

      <section>
        <h1 className="text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.08] tracking-tight">
          Crear afiches
        </h1>
        <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-neutral-800">
          Agrega tus ofertas a la lista y genera un solo PDF con todas. Salen{" "}
          {POR_HOJA} rótulos por hoja.
        </p>
      </section>

      {documento && (
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-accent2-300 bg-accent2-100 p-5">
          <div>
            <div className="font-bold">
              <i className="fa-jelly-duo fa-regular fa-circle-check mr-2 text-accent2-600"></i>
              {documento.titulo} está listo
            </div>
            <div className="text-[13.5px] text-neutral-800">
              {documento.rotulos} rótulos · {documento.hojas} hojas
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={documento.url} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 bg-accent2-500 text-white px-5 py-2.5 hover:bg-accent2-600 active:bg-accent2-700">
              <i className="fa-jelly-duo fa-regular fa-arrow-up-right-from-square"></i>
              Abrir PDF
            </a>
            <Link href="/home/historial" className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 px-4 py-2 border border-neutral-300 text-black hover:bg-neutral-100 active:bg-neutral-200">
              <i className="fa-jelly-duo fa-regular fa-clock"></i>
              Ver historial
            </Link>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <form
          id="formulario"
          onSubmit={guardarRotulo}
          className="scroll-mt-28 rounded-2xl border border-neutral-300 bg-white p-6"
        >
          <h2 className="mb-5 text-[22px] font-bold tracking-tight">
            {editando ? "Editar rótulo" : "Nueva oferta"}
          </h2>

          {productos.length > 0 && !editando && (
            <div className="mb-4">
              <label htmlFor="producto" className="block mb-2 text-sm font-medium">
                Usar un producto guardado (opcional)
              </label>
              <select
                id="producto"
                defaultValue=""
                onChange={(e) => usarProducto(e.target.value)}
                className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm focus:border-black focus:outline-none"
              >
                <option value="">Elige un producto ...</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.descripcion} · ${Number(p.precio).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="ean" className="block mb-2 text-sm font-medium">
              Código de barras
            </label>
            <input
              type="text"
              id="ean"
              inputMode="numeric"
              pattern="\d+"
              title="Solo numeros"
              maxLength={14}
              value={ean}
              onChange={(e) => {
                setEan(e.target.value);
              }}
              className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none"
              placeholder="7401005904011"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="descripcion" className="block mb-2 text-sm font-medium">
              Descripción del producto
            </label>
            <input
              type="text"
              id="descripcion"
              maxLength={120}
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
              }}
              className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none uppercase placeholder:normal-case"
              placeholder="Arroz blanco 5 lb"
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="precio_oferta" className="block mb-2 text-sm font-medium">
                Precio de oferta ($)
              </label>
              <input
                type="number"
                id="precio_oferta"
                min="0.01"
                step="0.01"
                value={precioOferta}
                onChange={(e) => {
                  setPrecioOferta(e.target.value);
                }}
                className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none"
                placeholder="1.99"
                required
              />
            </div>
            <div>
              <label htmlFor="precio_unitario" className="block mb-2 text-sm font-medium">
                Precio normal ($)
              </label>
              <input
                type="number"
                id="precio_unitario"
                min="0.01"
                step="0.01"
                value={precioUnitario}
                onChange={(e) => {
                  setPrecioUnitario(e.target.value);
                }}
                className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none"
                placeholder="2.50"
                required
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="fecha_inicio" className="block mb-2 text-sm font-medium">
                Válido desde
              </label>
              <input
                type="date"
                id="fecha_inicio"
                value={fechaInicio}
                onChange={(e) => {
                  setFechaInicio(e.target.value);
                }}
                className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="fecha_fin" className="block mb-2 text-sm font-medium">
                Hasta
              </label>
              <input
                type="date"
                id="fecha_fin"
                min={fechaInicio}
                value={fechaFin}
                onChange={(e) => {
                  setFechaFin(e.target.value);
                }}
                className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="copias" className="block mb-2 text-sm font-medium">
              Copias
            </label>
            <input
              type="number"
              id="copias"
              min="1"
              max="255"
              step="1"
              value={copias}
              onChange={(e) => {
                setCopias(e.target.value);
              }}
              className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none max-w-[120px]"
              required
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 bg-black text-white px-5 py-2.5 hover:bg-neutral-800 active:bg-neutral-900">
              <i className={`fa-jelly-duo fa-regular ${editando ? "fa-check" : "fa-plus"}`}></i>
              {editando ? "Guardar cambios" : "Agregar a la lista"}
            </button>
            {editando && (
              <button type="button" onClick={limpiarFormulario} className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 px-4 py-2 border border-neutral-300 text-black hover:bg-neutral-100 active:bg-neutral-200">
                <i className="fa-jelly-duo fa-regular fa-xmark"></i>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <section className="rounded-2xl border border-neutral-300 bg-neutral-50 p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-[22px] font-bold tracking-tight">Tu lista</h2>
              <p className="text-[13.5px] text-neutral-700">
                {totalRotulos === 0
                  ? "Aún no hay rótulos por imprimir"
                  : `${totalRotulos} rótulos · ${totalHojas} ${totalHojas === 1 ? "hoja" : "hojas"}`}
              </p>
            </div>
            <button
              type="button"
              onClick={generarPdf}
              className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 bg-accent2-500 text-white px-5 py-2.5 hover:bg-accent2-600 active:bg-accent2-700"
            >
              <i className="fa-jelly-duo fa-regular fa-print"></i>
              Generar PDF
            </button>
          </div>

          {pendientes.length === 0 ? (
            <p className="rounded-xl border border-dashed border-neutral-400 p-6 text-center text-sm text-neutral-700">
              <i className="fa-jelly-duo fa-regular fa-inbox mb-2 block text-3xl"></i>
              Agrega tu primera oferta con el formulario y aparecerá aquí.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {pendientes.map((r) => (
                <li
                  key={r.id}
                  className={`flex flex-wrap items-center gap-4 rounded-xl border bg-white p-4 ${
                    editando === r.id ? "border-black" : "border-neutral-300"
                  }`}
                >
                  <div className="min-w-0 flex-1 basis-[220px]">
                    <div className="truncate font-semibold">{r.descripcion}</div>
                    <div className="text-[13px] text-neutral-700">
                      {r.ean} · {fechaCorta(r.fecha_inicio)} al {fechaCorta(r.fecha_fin)} ·{" "}
                      {r.copias} {Number(r.copias) === 1 ? "copia" : "copias"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold leading-none tracking-tight text-accent2-600">
                      ${Number(r.precio_oferta).toFixed(2)}
                    </div>
                    <div className="text-[13px] text-neutral-700">
                      antes <s>${Number(r.precio_unitario).toFixed(2)}</s>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => editar(r)} className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 px-4 py-2 border border-neutral-300 text-black hover:bg-neutral-100 active:bg-neutral-200">
                      <i className="fa-jelly-duo fa-regular fa-pencil"></i>
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => eliminarRotulo(r)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 px-4 py-2 border border-accent2-300 text-accent2-700 hover:bg-accent2-100 active:bg-accent2-200"
                    >
                      <i className="fa-jelly-duo fa-regular fa-trash"></i>
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default CrearAfiches;
