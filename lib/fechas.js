// lib/fechas.js
// Las fechas de los rotulos se guardan como texto "AAAA-MM-DD", igual que en la app movil.
// new Date("2026-11-22") las leeria en UTC y en El Salvador mostraria un dia antes,
// por eso se convierten aqui en hora local.

const dosDigitos = (n) => String(n).padStart(2, "0");

export const aTextoFecha = (fecha) =>
  `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;

export const deTextoFecha = (texto) => {
  const [anio, mes, dia] = String(texto).split("-").map(Number);
  return new Date(anio, mes - 1, dia);
};

// "AAAA-MM-DD" a partir de hoy + dias
export const enDias = (dias) => {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return aTextoFecha(d);
};

// "2026-10-18" -> "18 oct"
export const fechaCorta = (texto) =>
  texto ? deTextoFecha(texto).toLocaleDateString("es", { day: "numeric", month: "short" }) : "";

// Date de Firestore -> "18 oct 2026"
export const fechaLarga = (valor) =>
  new Date(valor).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" });
