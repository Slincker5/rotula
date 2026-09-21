// app/api/admin/productos/[id]/route.js
import pool from "@/lib/db";
import { getAdmin } from "@/lib/admin";
import { validarProducto } from "@/lib/validarProductoInput";

export async function PUT(request, { params }) {
  const { id } = await params;

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
      `UPDATE productos
          SET ean = ?, descripcion = ?, precio = ?, imagen = ?
        WHERE id = ?`,
      [
        datosValidados.ean,
        datosValidados.descripcion,
        datosValidados.precio,
        datosValidados.imagen,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return Response.json(
        { ok: false, error: "Ese producto no existe" },
        { status: 404 },
      );
    }

    return Response.json(
      { ok: true, mensaje: "Producto actualizado" },
      { status: 200 },
    );
  } catch {
    return Response.json(
      { ok: false, error: "No se pudo actualizar el producto" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  const admin = await getAdmin();
  if (!admin) {
    return Response.json(
      { ok: false, error: "No autorizado, solo administradores" },
      { status: 403 },
    );
  }

  try {
    const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return Response.json(
        { ok: false, error: "Ese producto no existe" },
        { status: 404 },
      );
    }

    return Response.json(
      { ok: true, mensaje: "Producto eliminado" },
      { status: 200 },
    );
  } catch {
    return Response.json(
      { ok: false, error: "No se pudo eliminar el producto" },
      { status: 500 },
    );
  }
}
