"use client";
// Todo lo que cuelga de /home exige sesion de Firebase.
// Firebase guarda la sesion en el navegador, por eso la revision se hace aqui y no en proxy.js.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cargando from "@/components/loading";
import { useSesion } from "@/components/Sesion";

const GuardSesion = ({ children }) => {
  const router = useRouter();
  const { usuario, revisando } = useSesion();

  useEffect(() => {
    if (!revisando && !usuario) router.replace("/login");
  }, [revisando, usuario, router]);

  if (!usuario) {
    return <Cargando texto="Revisando tu sesión ..."></Cargando>;
  }

  return children;
};

export default GuardSesion;
