/**
 * app/api/documentos/[uuid]/pdf/route.js
 * --------------------------------------
 * Devuelve el PDF de un documento. No se guarda en disco (en Vercel es de
 * solo lectura): se vuelve a pintar con los rótulos que salieron en él.
 */

import pool from "@/lib/db";
import { generarRotulos } from "@/lib/generarRotulos";
import { getUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { uuid } = await params;

  try {
    const usuario = await getUser();
    if (!usuario) {
      return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
    }

    const [docs] = await pool.query(
      "SELECT id, titulo FROM documentos WHERE uuid = ? AND usuario_id = ?",
      [uuid, usuario.id],
    );
    const documento = docs[0];

    if (!documento) {
      return Response.json(
        { ok: false, error: "Ese documento no existe o no es tuyo" },
        { status: 404 },
      );
    }

    /* los mismos rótulos y en el mismo orden con que se generó */
    const [rotulos] = await pool.query(
      `SELECT id,
              ean,
              descripcion,
              precio_oferta,
              precio_unitario,
              copias,
              DATE_FORMAT(fecha_inicio, '%Y-%m-%d') AS fecha_inicio,
              DATE_FORMAT(fecha_fin,    '%Y-%m-%d') AS fecha_fin
         FROM rotulos
        WHERE usuario_id = ? AND documento_id = ?
        ORDER BY descripcion`,
      [usuario.id, documento.id],
    );

    if (rotulos.length === 0) {
      return Response.json(
        { ok: false, error: "Ese documento ya no tiene rótulos" },
        { status: 404 },
      );
    }

    const bytes = await generarRotulos(rotulos);

    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="rotulos-${uuid}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false, error: "No se pudo generar el PDF" }, { status: 500 });
  }
}
