"use client";
// Modulo secundario Perfil: el mismo de la pestaña Perfil del celular.
// Edita nombre, apellido y negocio en usuarios/{uid}; el correo viene de Firebase Authentication.
import { useState } from "react";
import { toast } from "sonner";
import Cargando from "@/components/loading";
import { useSesion } from "@/components/Sesion";

const SOLO_LETRAS = /^[\p{L}\s'-]+$/u;

const validarPerfil = ({ nombre, apellido, negocio }) => {
  if (nombre.trim().length < 2 || nombre.trim().length > 60) return "El nombre debe tener de 2 a 60 letras";
  if (!SOLO_LETRAS.test(nombre.trim())) return "El nombre solo puede tener letras";
  if (apellido.trim() && (!SOLO_LETRAS.test(apellido.trim()) || apellido.trim().length > 60))
    return "El apellido solo puede tener letras (máximo 60)";
  if (negocio.trim().length > 100) return "El nombre del negocio no puede pasar de 100 caracteres";
  return null;
};

const estiloCampo =
  "block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none";

const Perfil = () => {
  const { usuario, actualizarPerfil } = useSesion();
  const [nombre, setNombre] = useState(usuario?.nombre ?? "");
  const [apellido, setApellido] = useState(usuario?.apellido ?? "");
  const [negocio, setNegocio] = useState(usuario?.nombre_negocio ?? "");
  const [guardando, setGuardando] = useState(false);

  const iniciales = `${usuario?.nombre?.[0] ?? ""}${usuario?.apellido?.[0] ?? ""}`.toUpperCase() || "?";

  const guardar = async (e) => {
    e.preventDefault();
    const error = validarPerfil({ nombre, apellido, negocio });
    if (error) return toast.error(error);
    try {
      setGuardando(true);
      await actualizarPerfil({ nombre, apellido, negocio });
      toast.success("Perfil actualizado");
    } catch (err) {
      toast.error(err.message ?? "No se pudo guardar tu perfil");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-5 py-12 sm:px-8 lg:px-16">
      {guardando && <Cargando texto="Guardando tu perfil ..."></Cargando>}

      <section className="flex flex-wrap items-center gap-5">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-black text-2xl font-bold text-white">
          {iniciales}
        </div>
        <div>
          <h1 className="text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.08] tracking-tight">
            {usuario?.nombre} {usuario?.apellido}
          </h1>
          <p className="mt-1 text-base text-neutral-700">
            {usuario?.nombre_negocio || "Sin negocio registrado"} · {usuario?.email}
          </p>
        </div>
      </section>

      <form onSubmit={guardar} className="w-full max-w-xl rounded-2xl border border-neutral-300 bg-white p-6">
        <h2 className="mb-5 text-[22px] font-bold tracking-tight">Editar mis datos</h2>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nombre" className="block mb-2 text-sm font-medium">Nombre</label>
            <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className={estiloCampo} required />
          </div>
          <div>
            <label htmlFor="apellido" className="block mb-2 text-sm font-medium">Apellido</label>
            <input id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} className={estiloCampo} />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="negocio" className="block mb-2 text-sm font-medium">Nombre del negocio (opcional)</label>
          <input
            id="negocio"
            value={negocio}
            onChange={(e) => setNegocio(e.target.value)}
            className={estiloCampo}
            placeholder="Tienda La Esquina"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="correo" className="block mb-2 text-sm font-medium">Correo</label>
          <input id="correo" value={usuario?.email ?? ""} disabled className={`${estiloCampo} bg-neutral-100 text-neutral-600`} />
          <p className="mt-1 text-xs text-neutral-600">
            Es el correo de tu cuenta ({usuario?.proveedor === "google.com" ? "Google" : "correo y contraseña"}).
            Con él entras también en la app móvil.
          </p>
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="inline-flex items-center gap-2 text-white bg-orange-500 hover:bg-orange-600 font-medium rounded-xl text-sm px-4 py-2.5 cursor-pointer disabled:opacity-60"
        >
          <i className="fa-jelly-duo fa-regular fa-floppy-disk"></i>
          Guardar cambios
        </button>
      </form>
    </main>
  );
};

export default Perfil;
