/**
 * app/api/rotulos/pdf/route.js
 * ----------------------------
 * 1. trae los rótulos pendientes del usuario de la sesión
 * 2. genera el PDF sobre la plantilla (4 por hoja A4)
 * 3. lo guarda y registra el documento
 * 4. devuelve el link para descargar
 */

import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import pool from "@/lib/db";
import { generarRotulos } from "@/lib/generarRotulos";
import { getUser } from "@/lib/auth";

export const runtime = "nodejs";

const CARPETA = path.join(process.cwd(), "public", "rotulos");
const POR_HOJA = 4;

export async function POST() {
  try {
    const usuario = await getUser();
    if (!usuario) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    /* 1. la lista: lo que tiene pendiente de imprimir */
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
        WHERE usuario_id = ? AND documento_id IS NULL
        ORDER BY descripcion`,
      [usuario.id]
    );

    if (rotulos.length === 0) {
      return Response.json({ error: "No tenés rótulos para imprimir" }, { status: 404 });
    }

    /* 2. pintar sobre la plantilla */
    const bytes = await generarRotulos(rotulos);

    /* 3. guardar el archivo */
    const uuid = randomUUID();
    const nombre = `${uuid}.pdf`;
    const url = `/rotulos/${nombre}`;

    await fs.mkdir(CARPETA, { recursive: true });
    await fs.writeFile(path.join(CARPETA, nombre), bytes);

    /* 3.1 registrar el documento */
    const total = rotulos.reduce((t, r) => t + Math.max(1, Number(r.copias) || 1), 0);
    const titulo = `Rótulos ${new Date().toLocaleDateString("es-SV")}`;

    const [doc] = await pool.query(
      `INSERT INTO documentos
         (uuid, usuario_id, titulo, rotulos_por_hoja, total_rotulos, url_pdf, fecha_creacion)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [uuid, usuario.id, titulo, POR_HOJA, total, url]
    );

    /* 3.2 marcar como impresos exactamente los que salieron */
    const ids = rotulos.map((r) => r.id);
    await pool.query(
      `UPDATE rotulos
          SET documento_id = ?
        WHERE usuario_id = ? AND id IN (${ids.map(() => "?").join(",")})`,
      [doc.insertId, usuario.id, ...ids]
    );

    /* 4. link */
    return Response.json({
      url,
      uuid,
      documento_id: doc.insertId,
      titulo,
      rotulos: total,
      hojas: Math.ceil(total / POR_HOJA),
    });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "No se pudo generar el PDF" }, { status: 500 });
  }
}