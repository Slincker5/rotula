// app/api/documentos/route.js
import pool from "@/lib/db";
import { getSession, getUser } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json(
      { ok: false, error: "No autorizado, inicia sesion para ver el contenido" },
      { status: 401 },
    );
  }

  try {
    const usuarioSesion = await getUser();

    const [rows] = await pool.query(
      `SELECT id, uuid, titulo, rotulos_por_hoja, total_rotulos, url_pdf, fecha_creacion
         FROM documentos
        WHERE usuario_id = ?
        ORDER BY id DESC`,
      [usuarioSesion.id],
    );

    return Response.json(rows, { status: 200 });
  } catch {
    return Response.json(
      { ok: false, error: "No se pudieron cargar los documentos" },
      { status: 500 },
    );
  }
}
