import "./globals.css";
import "./estilos.css";
export const metadata = {
  title: "Rotula - Inicio",
  description: "Afiches de ofertas en minutos",
};

export default function Inicio({ children }) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://kit.fontawesome.com/4b084ecba6.css"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

