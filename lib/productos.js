// lib/productos.js
// Modulo secundario "Mis productos": catalogo del negocio en usuarios/{uid}/productos.
// Es la misma coleccion que usa la pestaña Productos de la app movil.
import { addDoc, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { aRegistros, coleccionDelUsuario } from "@/lib/datos";
import { conErrores, ErrorApp } from "@/lib/errores";
import { validarProducto } from "@/lib/validarProductoInput";

function aDatos(form) {
  const resultado = validarProducto(form);
  if (!resultado.ok) throw new ErrorApp(resultado.error, "invalido");
  const d = resultado.datos;
  // las reglas piden ean como texto (vacio si no tiene), igual que en el celular
  return { ean: d.ean ?? "", descripcion: d.descripcion, precio: Number(d.precio), imagen: d.imagen ?? "" };
}

export const listarProductos = () =>
  conErrores(async () =>
    aRegistros(await getDocs(coleccionDelUsuario("productos"))).sort((a, b) => a.descripcion.localeCompare(b.descripcion)),
  );

export const crearProducto = (form) =>
  conErrores(() => addDoc(coleccionDelUsuario("productos"), { ...aDatos(form), fecha_creacion: serverTimestamp() }));

export const editarProducto = (id, form) =>
  conErrores(() => updateDoc(doc(coleccionDelUsuario("productos"), id), aDatos(form)));

export const borrarProducto = (id) => conErrores(() => deleteDoc(doc(coleccionDelUsuario("productos"), id)));
