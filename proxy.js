// proxy.js
// Chequeo rapido de la cookie de sesion: /home exige sesion,
// y /login y /registro mandan a /home si ya hay una.
// Las rutas de /api siguen validando por su cuenta con getSession().
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function haySesion(request) {
  const token = request.cookies.get("sesion")?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const sesion = await haySesion(request);

  if (pathname.startsWith("/home") && !sesion) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if ((pathname === "/login" || pathname === "/registro") && sesion) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/login", "/registro"],
};
