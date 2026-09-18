// lib/validarRotuloInput.js

export function soloDigitos(ean) {
  return /^\d+$/.test(ean);
}

export function validarPrecio(precio) {
  return /^\d+(\.\d{1,2})?$/.test(String(precio).trim());
}

export function validarRotulo(body) {
  const ean = String(body?.ean ?? "").trim();
  const descripcion = String(body?.descripcion ?? "").trim().toLocaleUpperCase();
  const precio_oferta = String(body?.precio_oferta ?? "").trim();
  const precio_unitario = String(body?.precio_unitario ?? "").trim();
  const copias = String(body?.copias ?? "").trim();
  const fecha_inicio = String(body?.fecha_inicio ?? "").trim();
  const fecha_fin = String(body?.fecha_fin ?? "").trim();

  const mal = (error) => ({ ok: false, error });

  // requeridos
  if (!ean) return mal("El codigo de barras es requerido");
  if (!descripcion) return mal("La descripcion es requerida");
  if (!precio_oferta) return mal("El precio de oferta es requerido");
  if (!precio_unitario) return mal("El precio unitario es requerido");
  if (!copias) return mal("El campo copias es requerido");
  if (!fecha_inicio) return mal("La fecha de inicio es requerida");
  if (!fecha_fin) return mal("La fecha fin es requerida");

  // solo numeros
  if (!soloDigitos(ean))
    return mal("El codigo de barras solo debe contener numeros");
  if (!soloDigitos(copias))
    return mal("El campo copias solo debe contener numeros");

  // formato de precio
  if (!validarPrecio(precio_oferta))
    return mal("El precio de oferta debe de ser valido. Ejemplo: $1.99");
  if (!validarPrecio(precio_unitario))
    return mal("El precio unitario debe de ser valido. Ejemplo: $1.99");

  // mayor a cero
  if (Number(precio_oferta) <= 0)
    return mal("El precio de oferta debe de ser mayor a 0");
  if (Number(precio_unitario) <= 0)
    return mal("El precio unitario debe de ser mayor a 0");
  if (Number(copias) <= 0) return mal("El numero de copias no puede ser 0");

  // fechas
  if (new Date(fecha_fin) < new Date(fecha_inicio))
    return mal("La fecha final no puede ser antes de la fecha de inicio");

  return {
    ok: true,
    datos: {
      ean,
      descripcion,
      precio_oferta,
      precio_unitario,
      copias,
      fecha_inicio,
      fecha_fin,
    },
  };
}