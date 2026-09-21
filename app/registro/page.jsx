"use client";
import { useState } from "react";
import Cargando from "@/components/loading";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [negocio, setNegocio] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const registrar = async (e) => {
    e.preventDefault();
    if (clave !== confirmar) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    try {
      setCargando(true);
      const body = {
        nombre,
        apellido,
        email: correo,
        nombre_negocio: negocio,
        password_hash: clave,
      };
      const { data } = await axios.post("/api/registro", body);
      if (!data.ok) {
        toast.error(data.error);
      } else {
        toast.success("Cuenta creada, ahora inicia sesion");
        router.push("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.error ?? "No se pudo crear la cuenta");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
      <div className="bg-gray-100 flex items-center justify-center py-10">
        <div>
          <h1 className="titulos text-4xl lg:text-6xl p-4">Tu primer rótulo, en minutos.</h1>
          <p className="text-xl p-4">
            Crea tu cuenta gratis y empieza a imprimir tus ofertas.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-10">
        {cargando && <Cargando texto="Creando tu cuenta ..."></Cargando>}
        <form className="w-full max-w-sm" onSubmit={registrar}>
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="nombre" className="block mb-2.5 text-sm font-medium">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                }}
                className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none"
                maxLength={60}
                required
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block mb-2.5 text-sm font-medium">
                Apellido
              </label>
              <input
                type="text"
                id="apellido"
                value={apellido}
                onChange={(e) => {
                  setApellido(e.target.value);
                }}
                className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none"
                maxLength={60}
                required
              />
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="negocio" className="block mb-2.5 text-sm font-medium">
              Nombre de tu negocio
            </label>
            <input
              type="text"
              id="negocio"
              value={negocio}
              onChange={(e) => {
                setNegocio(e.target.value);
              }}
              className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none"
              placeholder="Tienda La Esquina"
              maxLength={100}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2.5 text-sm font-medium">
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
              maxLength={120}
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2.5 text-sm font-medium">
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
              placeholder="Minimo 8 caracteres"
              minLength={8}
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="confirmar" className="block mb-2.5 text-sm font-medium">
              Repite tu contraseña
            </label>
            <input
              type="password"
              id="confirmar"
              value={confirmar}
              onChange={(e) => {
                setConfirmar(e.target.value);
              }}
              className="block w-full rounded-xl border border-neutral-400 bg-white px-3 py-2.5 text-sm placeholder:text-neutral-500 focus:border-black focus:outline-none"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 text-white bg-orange-500 hover:bg-orange-600 font-medium leading-5 rounded-xl text-sm px-4 py-2.5 focus:outline-none cursor-pointer"
          >
            <i className="fa-jelly-duo fa-regular fa-circle-user"></i>
            Crear mi cuenta
          </button>
          <p className="mt-5 text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-semibold text-orange-500">
              Inicia sesion
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registro;
