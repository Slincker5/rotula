// lib/auth.js
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getSession() {
  const token = (await cookies()).get('sesion')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return { userId: Number(payload.sub) };
  } catch {
    return null;
  }
}

export async function getUser() {
  const session = await getSession();
  if (!session) return null;

  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE id = ?',
    [session.userId]
  );
  return rows[0] ?? null;
}