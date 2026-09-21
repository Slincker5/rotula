"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

const enlaces = [
  { href: "/home", texto: "Inicio", icono: "fa-house" },
  { href: "/home/crear-afiches", texto: "Crear afiches", icono: "fa-circle-plus" },
  { href: "/home/historial", texto: "Historial", icono: "fa-clock" },
];

// solo se muestra si /api/admin responde ok (la sesion tiene rol admin)
const enlaceAdmin = { href: "/home/admin", texto: "Admin", icono: "fa-shield-check" };

const Menu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dentro = pathname.startsWith("/home");
  const [esAdmin, setEsAdmin] = useState(false);

  const verificarAdmin = async () => {
    // fuera de /home no hay sesion que revisar, se limpia por si venia de un logout
    if (!dentro) {
      setEsAdmin(false);
      return;
    }
    try {
      await axios.get("/api/admin");
      setEsAdmin(true);
    } catch {
      setEsAdmin(false);
    }
  };

  // cada vez que entro o salgo de /home vuelvo a revisar el rol (cambia con el login)
  useEffect(() => {
    // el setState de verificarAdmin ocurre despues del await, no dentro del efecto
    // eslint-disable-next-line react-hooks/set-state-in-effect
    verificarAdmin();
  }, [dentro]);

  const logout = async () => {
    try {
      await axios.post("/api/logout");
      router.push("/login");
    } catch (error) {
      toast.error("No se pudo cerrar la sesion");
    }
  };

  return (
    <header className="px-4 py-6 bg-white flex flex-wrap items-center justify-between gap-3 border-b-[#c9c9c9] border-b sticky top-0 z-40">
      <h1 className="font-bold">
        <Link href={dentro ? "/home" : "/"}>
          ROTULA<span className="text-orange-500">.APP</span>
        </Link>
      </h1>
      {dentro ? (
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
          {esAdmin && (
            <Link
              href={enlaceAdmin.href}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${
                pathname.startsWith(enlaceAdmin.href) ? "bg-neutral-200" : "hover:bg-neutral-100"
              }`}
            >
              <i className={`fa-jelly-duo fa-regular ${enlaceAdmin.icono}`}></i>
              {enlaceAdmin.texto}
            </Link>
          )}
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 bg-black px-4 py-2 text-white rounded-xl ml-2 cursor-pointer"
          >
            <i className="fa-jelly-duo fa-regular fa-arrow-right-from-bracket"></i>
            Cerrar sesion
          </button>
        </nav>
      ) : (
        <div>
          <Link href="/login" className="inline-flex items-center gap-2 bg-black px-4 py-2 text-white rounded-xl mr-4">
            <i className="fa-jelly-duo fa-regular fa-arrow-right-to-bracket"></i>
            Iniciar sesion
          </Link>
          <Link href="/registro" className="inline-flex items-center gap-2 bg-black px-4 py-2 text-white rounded-xl">
            <i className="fa-jelly-duo fa-regular fa-circle-user"></i>
            Registrate
          </Link>
        </div>
      )}
    </header>
  );
};

export default Menu;
