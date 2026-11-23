"use client";
// Boton "PDF" del inicio y del historial. El PDF no se guarda en ningun servidor:
// se vuelve a pintar en el navegador con los rotulos de ese documento y se descarga.
import { useState } from "react";
import { toast } from "sonner";
import { descargarPdf } from "@/lib/pdf/generarRotulos";
import { pdfDeDocumento } from "@/lib/rotulos";

const BotonPdf = ({ documentoId }) => {
  const [abriendo, setAbriendo] = useState(false);

  const descargar = async () => {
    try {
      setAbriendo(true);
      descargarPdf(await pdfDeDocumento(documentoId), `rotulos-${documentoId}.pdf`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAbriendo(false);
    }
  };

  return (
    <button
      type="button"
      onClick={descargar}
      disabled={abriendo}
      className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm transition-all cursor-pointer disabled:opacity-60 px-4 py-2 border border-neutral-300 text-black hover:bg-neutral-100 active:bg-neutral-200"
    >
      <i className="fa-jelly-duo fa-regular fa-arrow-down-to-line"></i>
      {abriendo ? "..." : "PDF"}
    </button>
  );
};

export default BotonPdf;
