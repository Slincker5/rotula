"use client";
import { useEffect, useState } from "react";
import Cargando from "@/components/loading";
import { toast } from "sonner";
import axios from "axios";

const fechaLarga = (valor) =>
  new Date(valor).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const AdminProductos = () => {
  const [ean, setEan] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [editando, setEditando] = useState(null);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [textoCarga, setTextoCarga] = useState("");

  const limpiarFormulario = () => {
    setEan("");
    setDescripcion("");
    setPrecio("");
    setImagen("");
    setEditando(null);
  };

  const cargarProductos = async () => {
    try {
      const { data } = await axios.get("/api/admin/productos");
      setProductos(data);
    } catch (error) {
      toast.error(error.response?.data?.error ?? "No se pudieron cargar los productos");
    }
  };

  // al entrar a la pagina pido la lista una sola vez
  useEffect(() => {
    // el setState de cargarProductos ocurre despues del await, no dentro del efecto
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarProductos();
  }, []);

  const guardarProducto = async (e) => {
    e.preventDefault();
    try {
      setTextoCarga("Guardando el producto ...");
      setCargando(true);
      const body = {
        ean: ean,
        descripcion: descripcion,
        precio: precio,
        imagen: imagen,
      };
      // si estoy editando actualizo ese producto, si no creo uno nuevo
      let respuesta;
      if (editando) {
        respuesta = await axios.put(`/api/admin/productos/${editando}`, body);
      } else {
        respuesta = await axios.post("/api/admin/productos", body);
      }
      const data = respuesta.data;
      if (!data.ok) {
        toast.error(data.error);
      } else {
        toast.success(data.mensaje);
        limpiarFormulario();
        await cargarProductos();
      }
    } catch (error) {
      toast.error(error.response?.data?.error ?? "No se pudo guardar el producto");
    } finally {
      setCargando(false);
    }
  };

  const editar = (producto) => {
    setEditando(producto.id);
    setEan(producto.ean ?? "");
    setDescripcion(producto.descripcion);
    setPrecio(String(producto.precio));
    setImagen(producto.imagen ?? "");
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  const eliminarProducto = async (producto) => {
    if (!window.confirm(`¿Eliminar "${producto.descripcion}" del catálogo?`)) return;
    try {
      setTextoCarga("Eliminando ...");
      setCargando(true);
      const { data } = await axios.delete(`/api/admin/productos/${producto.id}`);
      if (!data.ok) {
        toast.error(data.error);
      } else {
        toast.success(data.mensaje);
        if (editando === producto.id) limpiarFormulario();
        await cargarProductos();
      }
    } catch (error) {
      toast.error(error.response?.data?.error ?? "No se pudo eliminar el producto");
    } finally {
      setCargando(false);
    }
  };

  // filtro en el navegador: por descripcion o codigo
  const texto = busqueda.trim().toLowerCase();
  const filtrados = texto
    ? productos.filter((p) =>
        [p.descripcion, p.ean]
          .filter(Boolean)
          .some((campo) => String(campo).toLowerCase().includes(texto)),
      )
    : productos;

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-5 py-8 sm:px-8 lg:px-16">
      {cargando && <Cargando texto={textoCarga}></Cargando>}

      <section>
        <h1 className="text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.08] tracking-tight">
          Productos
        </h1>
        <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-neutral-800">
          Catálogo de productos con su código de barras y precio base.
        </p>
      </section>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <form
          id="formulario"
          onSubmit={guardarProducto}
          className="scroll-mt-28 rounded-2xl border border-neutral-300 bg-white p-6"
        >
          <h2 className="mb-5 text-[22px] font-bold tracking-tight">
            {editando ? "Editar producto" : "Nuevo producto"}
          </h2>

          <div className="mb-4">
            <label htmlFor="ean" className="block mb-2 text-sm font-medium">
              Código de barras <span className="text-neutral-500">(opcional)</span>
            </label>
            <input
              type="text"
              id="ean"
              inputMode="numeric"
              pattern="\d*"
              title="Solo numeros"
              maxLength={14}
              value={ean}
              onChange={(e) => {
                setEan(e.target.value);
              }}
              className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none"
              placeholder="7401005904011"
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

          <div className="mb-4">
            <label htmlFor="precio" className="block mb-2 text-sm font-medium">
              Precio ($)
            </label>
            <input
              type="number"
              id="precio"
              min="0.01"
              step="0.01"
              value={precio}
              onChange={(e) => {
                setPrecio(e.target.value);
              }}
              className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none max-w-[180px]"
              placeholder="2.50"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="imagen" className="block mb-2 text-sm font-medium">
              Imagen (URL) <span className="text-neutral-500">(opcional)</span>
            </label>
            <input
              type="url"
              id="imagen"
              maxLength={255}
              value={imagen}
              onChange={(e) => {
                setImagen(e.target.value);
              }}
              className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none"
              placeholder="https://ejemplo.com/arroz.jpg"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 bg-black text-white px-5 py-2.5 hover:bg-neutral-800 active:bg-neutral-900">
              <i className={`fa-jelly-duo fa-regular ${editando ? "fa-check" : "fa-plus"}`}></i>
              {editando ? "Guardar cambios" : "Agregar producto"}
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
              <h2 className="text-[22px] font-bold tracking-tight">Catálogo</h2>
              <p className="text-[13.5px] text-neutral-700">
                {productos.length === 0
                  ? "Aún no hay productos"
                  : `${filtrados.length} de ${productos.length} productos`}
              </p>
            </div>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
              }}
              className="block w-full max-w-[240px] rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none"
              placeholder="Buscar producto o código"
            />
          </div>

          {filtrados.length === 0 ? (
            <p className="rounded-xl border border-dashed border-neutral-400 p-6 text-center text-sm text-neutral-700">
              <i className="fa-jelly-duo fa-regular fa-inbox mb-2 block text-3xl"></i>
              {productos.length === 0
                ? "Agrega tu primer producto con el formulario y aparecerá aquí."
                : "Ningún producto coincide con tu búsqueda."}
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {filtrados.map((p) => (
                <li
                  key={p.id}
                  className={`flex flex-wrap items-center gap-4 rounded-xl border bg-white p-4 ${
                    editando === p.id ? "border-black" : "border-neutral-300"
                  }`}
                >
                  <div className="grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-xl bg-neutral-200 text-neutral-700">
                    {p.imagen ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imagen} alt={p.descripcion} className="h-full w-full object-cover" />
                    ) : (
                      <i className="fa-jelly-duo fa-regular fa-box text-xl"></i>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 basis-[200px]">
                    <div className="truncate font-semibold">{p.descripcion}</div>
                    <div className="text-[13px] text-neutral-700">
                      {p.ean ? `${p.ean} · ` : ""}
                      {fechaLarga(p.fecha_creacion)} · {p.nombre} {p.apellido}
                    </div>
                  </div>
                  <div className="text-xl font-extrabold leading-none tracking-tight text-accent2-600">
                    ${Number(p.precio).toFixed(2)}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => editar(p)} className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 px-4 py-2 border border-neutral-300 text-black hover:bg-neutral-100 active:bg-neutral-200">
                      <i className="fa-jelly-duo fa-regular fa-pencil"></i>
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => eliminarProducto(p)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 px-4 py-2 border border-accent2-300 text-accent2-700 hover:bg-accent2-100 active:bg-accent2-200"
                    >
                      <i className="fa-jelly-duo fa-regular fa-trash"></i>
                      Eliminar
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

export default AdminProductos;
