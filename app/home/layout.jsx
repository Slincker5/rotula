import "@/app/globals.css";
import "@/app/estilos.css";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
export const metadata = {
  title: "Rotula - Home",
};

export default function Home({ children }) {
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
          {children}     
        </body>
    </html>
  );
}