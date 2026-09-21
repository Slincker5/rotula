// lib/admin.js
import { getUser } from "@/lib/auth";

// devuelve el usuario de la sesion solo si tiene rol admin, si no null
export async function getAdmin() {
  const usuario = await getUser();
  if (!usuario || usuario.rol !== "admin") return null;
  return usuario;
}
