import Menu from '@/components/Menu'

export const metadata = {
  title: "Rotula - Registro",
  description: "Crea tu cuenta para comenzar",
};

export default function Registro({ children }) {
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
          {children}
        </div>
        
        
        </body>
    </html>
  );
}
