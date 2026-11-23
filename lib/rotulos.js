// lib/rotulos.js
// Modulo principal: rotulos y documentos PDF del usuario en Firestore.
// Es el mismo modelo de la app movil (rotula-movil/src/firebase/rotulos.js):
//   usuarios/{uid}/rotulos/{id}     documento_id == null mientras esta pendiente de imprimir
//   usuarios/{uid}/documentos/{id}  cada PDF generado
import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { aRegistros, coleccionDelUsuario, masRecientes } from "@/lib/datos";
import { conErrores, ErrorApp } from "@/lib/errores";
import { generarRotulos } from "@/lib/pdf/generarRotulos";
import { validarRotulo } from "@/lib/validarRotuloInput";

export const POR_HOJA = 4;

const porDescripcion = (a, b) => a.descripcion.localeCompare(b.descripcion);
const contarCopias = (rotulos) => rotulos.reduce((total, r) => total + Math.max(1, Number(r.copias) || 1), 0);

// valida el formulario y lo deja con los tipos que piden las reglas (precios number, copias int)
function aDatos(form) {
  const resultado = validarRotulo(form);
  if (!resultado.ok) throw new ErrorApp(resultado.error, "invalido");
  const d = resultado.datos;
  return {
    ean: d.ean,
    descripcion: d.descripcion,
    precio_oferta: Number(d.precio_oferta),
    precio_unitario: Number(d.precio_unitario),
    copias: Number(d.copias),
    fecha_inicio: d.fecha_inicio,
    fecha_fin: d.fecha_fin,
  };
}

export const listarRotulos = () =>
  conErrores(async () => masRecientes(aRegistros(await getDocs(coleccionDelUsuario("rotulos")))));

// un rotulo esta pendiente mientras no haya salido en ningun PDF
export const listarPendientes = () =>
  conErrores(async () => {
    const consulta = query(coleccionDelUsuario("rotulos"), where("documento_id", "==", null));
    return masRecientes(aRegistros(await getDocs(consulta)));
  });

export const agregarRotulo = (form) =>
  conErrores(() =>
    addDoc(coleccionDelUsuario("rotulos"), {
      ...aDatos(form),
      documento_id: null,
      fecha_creacion: serverTimestamp(),
    }),
  );

// solo se puede editar un rotulo pendiente; lo que ya salio en un PDF se conserva
export const editarRotulo = (id, form) =>
  conErrores(() => updateDoc(doc(coleccionDelUsuario("rotulos"), id), aDatos(form)));

export const quitarRotulo = (id) => conErrores(() => deleteDoc(doc(coleccionDelUsuario("rotulos"), id)));

// Pinta el PDF con los pendientes y lo registra. El lote hace las escrituras juntas:
// o se crea el documento y se marcan sus rotulos, o no cambia nada.
export const generarDocumento = () =>
  conErrores(async () => {
    const rotulos = (await listarPendientes()).sort(porDescripcion);
    if (rotulos.length === 0) throw new ErrorApp("No tienes rótulos para imprimir", "sin-rotulos");

    // si esto falla no se registra nada
    const bytes = await generarRotulos(rotulos);

    const total = contarCopias(rotulos);
    const titulo = `Rótulos ${new Date().toLocaleDateString("es-SV")}`;
    const documento = doc(coleccionDelUsuario("documentos"));

    const lote = writeBatch(db);
    lote.set(documento, { titulo, rotulos_por_hoja: POR_HOJA, total_rotulos: total, fecha_creacion: serverTimestamp() });
    for (const r of rotulos) {
      lote.update(doc(coleccionDelUsuario("rotulos"), r.id), { documento_id: documento.id });
    }
    await lote.commit();

    return { id: documento.id, titulo, rotulos: total, hojas: Math.ceil(total / POR_HOJA), bytes };
  });

export const listarDocumentos = () =>
  conErrores(async () => masRecientes(aRegistros(await getDocs(coleccionDelUsuario("documentos")))));

// El archivo no se guarda: se vuelve a pintar con los mismos rotulos del documento
export const pdfDeDocumento = (id) =>
  conErrores(async () => {
    const consulta = query(coleccionDelUsuario("rotulos"), where("documento_id", "==", id));
    const rotulos = aRegistros(await getDocs(consulta)).sort(porDescripcion);
    if (rotulos.length === 0) throw new ErrorApp("Ese documento ya no tiene rótulos", "sin-rotulos");
    return generarRotulos(rotulos);
  });
