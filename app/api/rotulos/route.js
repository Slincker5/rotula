// app/api/rotulos/route.js
import pool from "@/lib/db";
import { getSession, getUser } from "@/lib/auth";
import { validarRotulo } from "@/lib/validarRotuloInput";

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return Response.json(
      { ok: false, error: "No autorizado, inicia sesion para ver el contenido" },
      { status: 401 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Body inválido" }, { status: 400 });
  }

  const validar = validarRotulo(body);
  if (!validar.ok) {
    return Response.json({ ok: false, error: validar.error }, { status: 400 });
  }

  const datosValidados = validar.datos;

  try {
    const usuarioSesion = await getUser();

    const [result] = await pool.query(
      `INSERT INTO rotulos
         (usuario_id, ean, descripcion, precio_oferta, precio_unitario,
          copias, fecha_inicio, fecha_fin)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuarioSesion.id,
        datosValidados.ean,
        datosValidados.descripcion,
        datosValidados.precio_oferta,
        datosValidados.precio_unitario,
        datosValidados.copias,
        datosValidados.fecha_inicio,
        datosValidados.fecha_fin,
      ],
    );

    if (result.affectedRows !== 1) {
      return Response.json(
        { ok: false, error: "No se pudo guardar el rotulo" },
        { status: 500 },
      );
    }

    return Response.json(
      {
        ok: true,
        idGenerado: result.insertId,
        mensaje: `Se agregaron ${datosValidados.copias} rotulos a tu lista`,
      },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { ok: false, error: "No se pudo guardar el rotulo" },
      { status: 500 },
    );
  }
}

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
      "SELECT * FROM rotulos WHERE usuario_id = ? ORDER BY id DESC",
      [usuarioSesion.id],
    );

    return Response.json(rows , { status: 200 });
  } catch {
    return Response.json(
      { ok: false, error: "No se pudieron cargar los rotulos" },
      { status: 500 },
    );
  }
}