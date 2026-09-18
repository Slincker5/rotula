import { cookies } from "next/headers";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body inválido" }, { status: 400 });
  }

  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!email || !password) {
    return Response.json(
      { ok: false, error: "Debes completar todos los campos" },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      {
        ok: false,
        error: "Debes ingresar un correo valido",
      },
      { status: 400 },
    );
  }

  const [rows] = await pool.query(
    "SELECT id, email, password_hash FROM usuarios WHERE email = ?",
    [email],
  );
  const usuario = rows[0];

  if (!usuario) {
    return Response.json({
      ok: false,
      error: "Credenciales invalidas",
    });
  }

  const validarClave = await bcrypt.compare(password, usuario.password_hash);

  if (!validarClave) {
    return Response.json(
      {
        ok: false,
        error: "Credenciales invalidas",
      },
      { status: 401 },
    );
  }

  const token = await new SignJWT({ sub: String(usuario.id) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set("sesion", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  
  return Response.json({
    ok: true,
    usuario: {
        id: usuario.id,
        email: usuario.email,
    }
  })
}
