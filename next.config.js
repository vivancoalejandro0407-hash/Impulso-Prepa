/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',   // genera la carpeta /out que Netlify espera encontrar
  images: { unoptimized: true }, // requerido cuando output es 'export'
}
module.exports = nextConfig
