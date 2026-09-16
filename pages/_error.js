export default function Error({ statusCode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', background: '#f8fafc' }}>
      <p style={{ fontSize: 64, margin: 0 }}>😕</p>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '16px 0 8px' }}>
        {statusCode ? `Error ${statusCode}` : 'Algo salió mal'}
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: 24 }}>
        {statusCode === 404 ? 'Página no encontrada' : 'Ocurrió un error inesperado'}
      </p>
      <a href="/" style={{ background: '#3b82f6', color: '#fff', padding: '12px 24px', borderRadius: 12, fontWeight: 700, textDecoration: 'none' }}>
        Volver al inicio
      </a>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}
