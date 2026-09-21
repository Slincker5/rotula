"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import Cargando from "@/components/loading";

const enlaces = [
  { href: "/home/admin", texto: "Rótulos de usuarios", icono: "fa-tags" },
  { href: "/home/admin/productos", texto: "Productos", icono: "fa-box" },
];

// todo lo que cuelga de /home/admin pasa por aqui: si la sesion no es admin
// se regresa a /home. Las rutas de /api/admin validan por su cuenta igual.
const AdminLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [verificado, setVerificado] = useState(false);

  const verificarAdmin = async () => {
    try {
      await axios.get("/api/admin");
      setVerificado(true);
    } catch (error) {
      toast.error(error.response?.data?.error ?? "No autorizado");
      router.replace("/home");
    }
  };

  // al entrar reviso el rol una sola vez
  useEffect(() => {
    // el setState de verificarAdmin ocurre despues del await, no dentro del efecto
    // eslint-disable-next-line react-hooks/set-state-in-effect
    verificarAdmin();
  }, []);

  if (!verificado) {
    return <Cargando texto="Verificando permisos ..."></Cargando>;
  }

  return (
    <div>
      <div className="mx-auto w-full max-w-[1200px] px-5 pt-10 sm:px-8 lg:px-16">
        <span className="mb-3 block text-[13px] font-semibold uppercase tracking-wide text-neutral-700">
          <i className="fa-jelly-duo fa-regular fa-shield-check mr-1"></i>
          Panel de administración
        </span>
        <nav className="flex flex-wrap items-center gap-1 text-sm font-semibold">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${
                pathname === e.href ? "bg-neutral-200" : "hover:bg-neutral-100"
              }`}
            >
              <i className={`fa-jelly-duo fa-regular ${e.icono}`}></i>
              {e.texto}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
};

export default AdminLayout;
