/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // la plantilla del rotulo se lee con fs: hay que incluirla en las funciones de Vercel
  outputFileTracingIncludes: {
    "/api/*": ["./plantillas/**/*"],
  },
};

export default nextConfig;
