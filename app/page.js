
import Link from "next/link";

const features = [
  {
    id: 1,
    title: "Crea afiches en minutos",
    body: "Elige un formato, escribe el producto y el precio. Rotula acomoda todo con letras grandes y claras, listas para imprimir en carta o A4.",
    tint: "bg-accent-100",
    ink: "text-accent-700",
  },
  {
    id: 2,
    title: "Descarga lista para imprimir",
    body: "Genera un PDF con tu rótulo ya armado, en carta o A4. Ábrelo, imprímelo y ya está listo para tu vitrina.",
    tint: "bg-accent2-100",
    ink: "text-accent2-700",
  },
  {
    id: 3,
    title: "Tu cuenta, tus rótulos",
    body: "Regístrate y guarda cada afiche. Duplica la oferta de la semana pasada, cambia el precio y vuelve a imprimir.",
    tint: "bg-neutral-200",
    ink: "text-neutral-800",
  },
];

const steps = [
  {
    n: "1",
    title: "Escanea o escribe el producto",
    body: "Escribe el nombre del producto y el precio.",
    tint: "bg-accent-100",
    ink: "text-accent-700",
  },
  {
    n: "2",
    title: "Pon el precio y la vigencia",
    body: "Precio nuevo, precio anterior y hasta cuándo dura la oferta.",
    tint: "bg-accent-200",
    ink: "text-accent-800",
  },
  {
    n: "3",
    title: "Descarga e imprime",
    body: "PDF listo para tu impresora. Recorta, pega y vende.",
    tint: "bg-accent2-200",
    ink: "text-accent2-800",
  },
];



function PosterSample() {
  return (
    <div className="w-full max-w-[320px] overflow-hidden rounded-[28px] bg-neutral-100 shadow-xl animate-float">
      <div className="bg-black px-6 py-4.5 text-center font-heading text-3xl tracking-wide text-white">
        OFERTA
      </div>
      <div className="grid gap-1.5 px-6 pt-6 pb-5 text-center">
        <div className="text-xs font-semibold uppercase tracking-wide text-neutral-700">
          Frutas y verduras
        </div>
        <div className="font-heading text-3xl leading-tight text-black">Manzana roja</div>
        <div className="mt-2 font-heading text-7xl leading-none text-black">$0.99</div>
        <div className="text-[15px] text-neutral-700">
          por libra · antes <s>$1.49</s>
        </div>
        <div className="mt-3.5 inline-flex items-center justify-center gap-2 self-center rounded-full bg-neutral-200 px-3.5 py-2 text-xs font-semibold">
          <i className="fa-jelly-duo fa-regular fa-calendar"></i>
          Válido hasta el domingo
        </div>
      </div>
    </div>
  );
}


export default function LandingPage() {
  return (
    <>

      <main className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-16">
        {/* Hero */}
        <section className="grid grid-cols-1 items-center gap-12 py-24 lg:grid-cols-2 lg:gap-20">
          <div>
            <h1 className="font-heading text-[clamp(40px,5.6vw,72px)] font-bold leading-[1.06]">
              <span className="block">Tus ofertas,</span>
              <span className="block">en rótulos que venden.</span>
            </h1>
            <p className="mt-7 max-w-[52ch] text-[17px] leading-relaxed text-neutral-800">
              Rotula crea afiches de oferta para tu negocio en minutos: elige el producto,
              escribe el precio y descárgalo listo para imprimir. Sin diseñador, sin
              plantillas complicadas.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/registro" className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm px-5 py-2.5 transition-colors bg-black text-white hover:bg-neutral-800 active:bg-neutral-900">
                Crear mi primer rótulo
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm px-5 py-2.5 transition-colors border border-neutral-300 text-black hover:bg-neutral-100 active:bg-neutral-200">
                Ya tengo cuenta
              </Link>
            </div>
            <p className="mt-3.5 text-[13px] text-neutral-700">
              Gratis para empezar · No necesitas tarjeta
            </p>
          </div>

          <div className="relative grid min-h-[360px] justify-items-center">
            <PosterSample />
          </div>
        </section>

        {/* Funciones */}
        <section id="funciones" className="py-14">
          <span className="mb-3.5 block text-[13px] font-semibold uppercase tracking-wide text-black">
            Qué puedes hacer
          </span>
          <h2 className="mb-10 max-w-[24ch] font-heading text-[clamp(28px,3vw,40px)] font-bold leading-[1.15]">
            Todo lo que necesita tu góndola, en un solo lugar.
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex flex-col gap-3.5 rounded-[28px] bg-surface p-7"
              >
                
                  {f.id == 1 && <i className="fa-jelly-duo text-3xl fa-regular fa-pencil"></i> }
                  {f.id == 2 && <i className="fa-jelly-duo text-3xl fa-regular fa-arrow-down-to-line"></i> }
                  {f.id ==3  && <i className="fa-jelly-duo text-3xl fa-regular fa-circle-user"></i> }
                <h3 className="font-heading text-[22px] font-bold">{f.title}</h3>
                <p className="leading-relaxed text-neutral-800">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cómo funciona */}
        <section
          id="como"
          className="grid grid-cols-1 items-start gap-8 py-16 lg:grid-cols-2 lg:gap-20"
        >
          <div>
            <span className="mb-3.5 block text-[13px] font-semibold uppercase tracking-wide text-black">
              Cómo funciona
            </span>
            <h2 className="font-heading text-[clamp(28px,3vw,40px)] font-bold leading-[1.15]">
              Tres pasos y a la vitrina.
            </h2>
            <p className="mt-5 max-w-[40ch] text-[15.5px] leading-relaxed text-neutral-800">
              Pensado para dueños de tiendas, no para diseñadores. Si sabes escribir un
              precio, sabes usar Rotula.
            </p>
          </div>
          <ol className="flex flex-col gap-5">
            {steps.map((s) => (
              <li key={s.n} className="grid grid-cols-[56px_minmax(0,1fr)] items-start gap-5">
                <div
                  className={`grid h-14 w-14 place-items-center rounded-full font-heading text-2xl ${s.tint} ${s.ink}`}
                >
                  {s.n}
                </div>
                <div>
                  <h3 className="mb-1.5 font-heading text-[22px] font-bold leading-tight">
                    {s.title}
                  </h3>
                  <p className="max-w-[48ch] text-[15.5px] leading-relaxed text-neutral-800">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA final */}
        <section id="precios" className="py-14">
          <div className="flex flex-wrap items-center justify-between gap-8 rounded-[28px] border border-neutral-300 bg-neutral-100 p-8 sm:p-14">
            <div>
              <h3 className="font-heading text-[clamp(26px,2.6vw,34px)] font-bold leading-[1.15]">
                Empieza gratis hoy mismo.
              </h3>
              <p className="mt-4 max-w-[50ch] text-[15.5px] leading-relaxed text-neutral-800">
                Crea tu cuenta, diseña hasta 10 rótulos al mes sin costo y usa el escáner sin
                límite. Cuando tu negocio crezca, nosotros crecemos contigo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/registro" className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm px-5 py-2.5 transition-colors bg-black text-white hover:bg-neutral-800 active:bg-neutral-900">
                Registrarse
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center gap-1.5 rounded-full font-heading font-bold text-sm px-3 py-2.5 transition-colors text-black hover:bg-neutral-100 active:bg-neutral-200">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}