// lib/datos.js
// Ayudas para leer Firestore. Todo lo de un usuario vive debajo de usuarios/{uid},
// la misma estructura que usa la app movil: lo que se crea en el celular aparece en la web y al reves.
import { collection } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { ErrorApp } from "@/lib/errores";

export function coleccionDelUsuario(nombre) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new ErrorApp("Tu sesión terminó. Inicia sesión de nuevo.", "unauthenticated");
  return collection(db, "usuarios", uid, nombre);
}

// Firestore devuelve las fechas como Timestamp; las paginas trabajan con Date
export const aFecha = (valor) => (valor?.toDate ? valor.toDate() : new Date());

export const aRegistros = (consulta) =>
  consulta.docs.map((d) => {
    const datos = d.data();
    return { id: d.id, ...datos, fecha_creacion: aFecha(datos.fecha_creacion) };
  });

export const masRecientes = (registros) => [...registros].sort((a, b) => b.fecha_creacion - a.fecha_creacion);
