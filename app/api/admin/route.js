// app/api/admin/route.js
import { getAdmin } from "@/lib/admin";

// dice si la sesion actual es de un admin; el menu y las paginas de admin lo usan
export async function GET() {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return Response.json(
        { ok: false, error: "No autorizado, solo administradores" },
        { status: 403 },
      );
    }

    return Response.json(
      {
        ok: true,
        usuario: {
          id: admin.id,
          nombre: admin.nombre,
          apellido: admin.apellido,
          email: admin.email,
          rol: admin.rol,
        },
      },
      { status: 200 },
    );
  } catch {
    return Response.json(
      { ok: false, error: "No se pudo verificar el rol" },
      { status: 500 },
    );
  }
}
