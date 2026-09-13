const Footer = () => {
 return (
    <footer className="flex flex-wrap items-center justify-between gap-3 gap-x-7 py-12 text-[13px] text-neutral-700 px-6 py-4">
          <span className="font-heading text-lg font-bold text-black">Rotula</span>
          <div className="flex gap-6">
            <a href="#funciones" className="hover:text-accent2-600">
              Funciones
            </a>
            <a href="#como" className="hover:text-accent2-600">
              Cómo funciona
            </a>
            <a href="#precios" className="hover:text-accent2-600">
              Precios
            </a>
          </div>
          <span>© 2026 Rotula</span>
        </footer>
 )
}

 export default Footer;