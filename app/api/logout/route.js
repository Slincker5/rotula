// app/api/logout/route.js
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('sesion');

  return Response.json({ ok: true });
}