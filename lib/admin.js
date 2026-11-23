// lib/admin.js
// Zona de administrador. El rol vive en usuarios/{uid}.rol y solo se puede poner desde la
// consola de Firebase: las reglas no dejan que un usuario se asigne "admin" a si mismo.
// Las reglas tambien son las que dejan al admin leer los rotulos de todos (collectionGroup).
import { collection, collectionGroup, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { aRegistros, masRecientes } from "@/lib/datos";
import { conErrores } from "@/lib/errores";

export const esAdmin = (usuario) => usuario?.rol === "admin";

// rotulos de todos los usuarios (web y celular) con el nombre y negocio de quien los creo
export const listarRotulosDeTodos = () =>
  conErrores(async () => {
    const [rotulos, usuarios] = await Promise.all([
      getDocs(collectionGroup(db, "rotulos")),
      getDocs(collection(db, "usuarios")),
    ]);

    const perfiles = new Map(usuarios.docs.map((u) => [u.id, u.data()]));
    const lista = aRegistros(rotulos).map((r, i) => {
      const usuario_id = rotulos.docs[i].ref.parent.parent.id;
      const perfil = perfiles.get(usuario_id) ?? {};
      return {
        ...r,
        usuario_id,
        nombre: perfil.nombre ?? "",
        apellido: perfil.apellido ?? "",
        nombre_negocio: perfil.nombre_negocio ?? "",
        email: perfil.email ?? "",
      };
    });
    return masRecientes(lista);
  });
