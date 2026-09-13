import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export const POST = async (request) => {
  try {
    const body = await request.json();

    const nombre = body.nombre?.trim();
    const apellido = body.apellido?.trim();
    const email = body.email?.trim().toLowerCase();
    const nombre_negocio = body.nombre_negocio?.trim();
    const password = body.password_hash;

    if (!nombre || !email || !password) {
      return NextResponse.json(
        { ok: false, error: "Faltan campos requeridos" },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Email inválido" },
        { status: 400 },
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { ok: false, error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 },
      );
    }
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, apellido, email, password_hash, nombre_negocio, rol) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, apellido, email, hash, nombre_negocio, "user"],
    );
    return NextResponse.json(
      { ok: true, id: result.insertId },
      { status: 201 },
    );
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { ok: false, error: "Ese email ya está registrado" },
        { status: 409 },
      );
    } else {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 },
      );
    }
  }
};
