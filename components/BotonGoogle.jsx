"use client";
// Boton "Continuar con Google" de login y registro.
// Abre la ventana de Google con Firebase; la redireccion a /home la hace la pagina al ver la sesion.
import { useState } from "react";
import { toast } from "sonner";
import { useSesion } from "@/components/Sesion";

const BotonGoogle = () => {
  const { entrarConGoogle } = useSesion();
  const [abriendo, setAbriendo] = useState(false);

  const entrar = async () => {
    try {
      setAbriendo(true);
      await entrarConGoogle();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAbriendo(false);
    }
  };

  return (
    <>
      <div className="my-5 flex items-center gap-3 text-xs text-neutral-500">
        <span className="h-px flex-1 bg-neutral-300"></span>o<span className="h-px flex-1 bg-neutral-300"></span>
      </div>
      <button
        type="button"
        onClick={entrar}
        disabled={abriendo}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-400 bg-white px-4 py-2.5 text-sm font-medium hover:bg-neutral-100 focus:outline-none cursor-pointer disabled:opacity-60"
      >
        <i className="fa-brands fa-google"></i>
        {abriendo ? "Abriendo Google ..." : "Continuar con Google"}
      </button>
    </>
  );
};

export default BotonGoogle;
