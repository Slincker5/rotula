// app/api/rotulos/[id]/route.js
import pool from "@/lib/db";
import { getSession, getUser } from "@/lib/auth";
import { validarRotulo } from "@/lib/validarRotuloInput";

export async function GET(request, { params }) {
  const { id } = await params;

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
      "SELECT * FROM rotulos WHERE id = ? AND usuario_id = ?",
      [id, usuarioSesion.id],
    );

    if (!rows.length) {
      return Response.json(
        { ok: false, error: "Ese rotulo no existe o no es tuyo" },
        { status: 404 },
      );
    }

    return Response.json({ ok: true, rotulo: rows[0] }, { status: 200 });
  } catch {
    return Response.json(
      { ok: false, error: "No se pudo cargar el rotulo" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;

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
      `UPDATE rotulos
          SET ean = ?, descripcion = ?, precio_oferta = ?, precio_unitario = ?,
              copias = ?, fecha_inicio = ?, fecha_fin = ?
        WHERE id = ? AND usuario_id = ?`,
      [
        datosValidados.ean,
        datosValidados.descripcion,
        datosValidados.precio_oferta,
        datosValidados.precio_unitario,
        datosValidados.copias,
        datosValidados.fecha_inicio,
        datosValidados.fecha_fin,
        id,
        usuarioSesion.id,
      ],
    );

    if (result.affectedRows === 0) {
      return Response.json(
        { ok: false, error: "Ese rotulo no existe o no es tuyo" },
        { status: 404 },
      );
    }

    return Response.json(
      { ok: true, mensaje: "Rotulo actualizado" },
      { status: 200 },
    );
  } catch {
    return Response.json(
      { ok: false, error: "No se pudo actualizar el rotulo" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) {
    return Response.json(
      { ok: false, error: "No autorizado, inicia sesion para ver el contenido" },
      { status: 401 },
    );
  }

  try {
    const usuarioSesion = await getUser();

    const [result] = await pool.query(
      "DELETE FROM rotulos WHERE id = ? AND usuario_id = ?",
      [id, usuarioSesion.id],
    );

    if (result.affectedRows === 0) {
      return Response.json(
        { ok: false, error: "Ese rotulo no existe o no es tuyo" },
        { status: 404 },
      );
    }

    return Response.json(
      { ok: true, mensaje: "Rotulo eliminado" },
      { status: 200 },
    );
  } catch {
    return Response.json(
      { ok: false, error: "No se pudo eliminar el rotulo" },
      { status: 500 },
    );
  }
}