// app/api/usuario/route.js
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const usuario = await getUser();
    if (!usuario) {
      return Response.json(
        { ok: false, error: "No autorizado, inicia sesion para ver el contenido" },
        { status: 401 },
      );
    }

    return Response.json(
      {
        ok: true,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          nombre_negocio: usuario.nombre_negocio,
        },
      },
      { status: 200 },
    );
  } catch {
    return Response.json(
      { ok: false, error: "No se pudo cargar el usuario" },
      { status: 500 },
    );
  }
}
