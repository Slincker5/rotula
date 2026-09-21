// lib/validarProductoInput.js
import { soloDigitos, validarPrecio } from "@/lib/validarRotuloInput";

export function validarProducto(body) {
  const ean = String(body?.ean ?? "").trim();
  const descripcion = String(body?.descripcion ?? "").trim().toLocaleUpperCase();
  const precio = String(body?.precio ?? "").trim();
  const imagen = String(body?.imagen ?? "").trim();

  const mal = (error) => ({ ok: false, error });

  // requeridos (el ean y la imagen son opcionales en la tabla)
  if (!descripcion) return mal("La descripcion es requerida");
  if (!precio) return mal("El precio es requerido");

  // largos de las columnas
  if (descripcion.length > 120)
    return mal("La descripcion no puede pasar de 120 caracteres");
  if (ean.length > 14)
    return mal("El codigo de barras no puede pasar de 14 digitos");
  if (imagen.length > 255)
    return mal("La ruta de la imagen no puede pasar de 255 caracteres");

  // solo numeros
  if (ean && !soloDigitos(ean))
    return mal("El codigo de barras solo debe contener numeros");

  // formato de precio
  if (!validarPrecio(precio))
    return mal("El precio debe de ser valido. Ejemplo: $1.99");

  // mayor a cero
  if (Number(precio) <= 0) return mal("El precio debe de ser mayor a 0");

  return {
    ok: true,
    datos: {
      ean: ean || null,
      descripcion,
      precio,
      imagen: imagen || null,
    },
  };
}
