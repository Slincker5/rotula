"use client";
import { useState } from "react";
import Cargando from "@/components/loading";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
const Login = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const login = async (e) => {
    e.preventDefault();
    try {
      setCargando(true);
      const body = {
        email: correo,
        password: clave,
      };
      const { data } = await axios.post("/api/login", body);
      if (!data.ok) {
        toast.error(data.error);
      } else {
        router.push("/home");
      }
    } catch (error) {
      // la API responde 400/401 con el motivo y axios lo lanza como error
      toast.error(error.response?.data?.error ?? "No se pudo iniciar sesion");
    } finally {
      setCargando(false);
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
      <div className="bg-gray-100 flex items-center justify-center py-10">
        <div>
          <h1 className="titulos text-4xl lg:text-6xl p-4">Qué bueno verte de vuelta.</h1>
          <p className="text-xl p-4">
            Entra para seguir con tus ofertas de la semana.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-10">
        {cargando && <Cargando texto="Validando tus datos ..."></Cargando>}
        <form className="w-full max-w-sm" onSubmit={login}>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Tu correo
            </label>
            <input
              type="email"
              id="email"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
              }}
              className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none"
              placeholder="ejemplo@rotula.app"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Tu contraseña
            </label>
            <input
              type="password"
              id="password"
              value={clave}
              onChange={(e) => {
                setClave(e.target.value);
              }}
              className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 text-white bg-orange-500 hover:bg-orange-600 font-medium leading-5 rounded-xl text-sm px-4 py-2.5 focus:outline-none cursor-pointer"
          >
            <i className="fa-jelly-duo fa-regular fa-arrow-right-to-bracket"></i>
            Iniciar sesion
          </button>
          <p className="mt-5 text-sm">
            ¿Aun no tienes cuenta?{" "}
            <Link href="/registro" className="font-semibold text-orange-500">
              Registrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
