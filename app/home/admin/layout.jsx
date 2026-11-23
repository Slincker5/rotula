"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import Cargando from "@/components/loading";
import { useSesion } from "@/components/Sesion";

const enlaces = [
  { href: "/home/admin", texto: "Rótulos de usuarios", icono: "fa-tags" },
  { href: "/home/admin/productos", texto: "Productos", icono: "fa-box" },
];

// todo lo que cuelga de /home/admin pasa por aqui: si el perfil de Firestore
// no tiene rol "admin" se regresa a /home.
const AdminLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario } = useSesion();
  const verificado = usuario?.rol === "admin";

  useEffect(() => {
    if (usuario && !verificado) {
      toast.error("No autorizado");
      router.replace("/home");
    }
  }, [usuario, verificado, router]);

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
