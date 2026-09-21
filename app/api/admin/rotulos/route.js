// app/api/admin/rotulos/route.js
import pool from "@/lib/db";
import { getAdmin } from "@/lib/admin";

// todos los rotulos de todos los usuarios, con los datos de quien los creo
export async function GET() {
  const admin = await getAdmin();
  if (!admin) {
    return Response.json(
      { ok: false, error: "No autorizado, solo administradores" },
      { status: 403 },
    );
  }

  try {
    const [rows] = await pool.query(
      `SELECT r.id, r.usuario_id, r.documento_id, r.ean, r.descripcion,
              r.precio_oferta, r.precio_unitario, r.copias,
              r.fecha_inicio, r.fecha_fin, r.fecha_creacion,
              u.nombre, u.apellido, u.email, u.nombre_negocio
         FROM rotulos r
         JOIN usuarios u ON u.id = r.usuario_id
        ORDER BY r.id DESC`,
    );

    return Response.json(rows, { status: 200 });
  } catch {
    return Response.json(
      { ok: false, error: "No se pudieron cargar los rotulos" },
      { status: 500 },
    );
  }
}
