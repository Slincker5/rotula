import "./globals.css";
import "./estilos.css";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
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
      <body>
        <div class="grid grid-rows-[auto_1fr_auto] h-[100vh] fixed w-full overflow-scroll">
          <Menu></Menu>
          {children}
          <Footer></Footer>
        </div>
        </body>
    </html>
  );
}

