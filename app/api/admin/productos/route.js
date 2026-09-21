// app/api/admin/productos/route.js
import pool from "@/lib/db";
import { getAdmin } from "@/lib/admin";
import { validarProducto } from "@/lib/validarProductoInput";

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
      `SELECT p.id, p.usuario_id, p.ean, p.descripcion, p.precio, p.imagen,
              p.fecha_creacion, u.nombre, u.apellido
         FROM productos p
         JOIN usuarios u ON u.id = p.usuario_id
        ORDER BY p.id DESC`,
    );

    return Response.json(rows, { status: 200 });
  } catch {
    return Response.json(
      { ok: false, error: "No se pudieron cargar los productos" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const admin = await getAdmin();
  if (!admin) {
    return Response.json(
      { ok: false, error: "No autorizado, solo administradores" },
      { status: 403 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Body inválido" }, { status: 400 });
  }

  const validar = validarProducto(body);
  if (!validar.ok) {
    return Response.json({ ok: false, error: validar.error }, { status: 400 });
  }

  const datosValidados = validar.datos;

  try {
    const [result] = await pool.query(
      `INSERT INTO productos (usuario_id, ean, descripcion, precio, imagen)
       VALUES (?, ?, ?, ?, ?)`,
      [
        admin.id,
        datosValidados.ean,
        datosValidados.descripcion,
        datosValidados.precio,
        datosValidados.imagen,
      ],
    );

    if (result.affectedRows !== 1) {
      return Response.json(
        { ok: false, error: "No se pudo guardar el producto" },
        { status: 500 },
      );
    }

    return Response.json(
      {
        ok: true,
        idGenerado: result.insertId,
        mensaje: "Producto agregado",
      },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { ok: false, error: "No se pudo guardar el producto" },
      { status: 500 },
    );
  }
}
