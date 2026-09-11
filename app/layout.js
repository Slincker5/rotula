import "./globals.css";
import Menu from '@/components/Menu'

export const metadata = {
  title: "Rotula - Inicio",
  description: "Afiches de ofertas en minutos",
};

export default function Inicio({ children }) {
  return (
    <html
      lang="es"
    >
      <head>
    <link
      rel="stylesheet"
      href="https://kit.fontawesome.com/4b084ecba6.css"
      crossOrigin="anonymous"
    />
  </head>
      <body>
        <div className="container m-auto">
          <Menu></Menu>
          {children}
        </div>
        
        
        </body>
    </html>
  );
}
