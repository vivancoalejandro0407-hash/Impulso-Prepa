import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

// Lista blanca ofuscada en Base64
const _W = [
  'dml2YW5jb2FsZWphbmRybzA0MDdAZ21haWwuY29t',
  'dml2YW5jb2RpZWdvNjhAZ21haWwuY29t',
]
const _d = (s) => atob(s)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState(null) // null | 'loading' | 'ok' | 'denied' | 'welcome'
  const [error, setError]     = useState('')

  async function handleSubmit(e) {
    e?.preventDefault()
    setError('')
    const val = email.trim().toLowerCase()

    if (!val || !val.includes('@') || !val.includes('.')) {
      setError('Por favor ingresa un correo válido.')
      return
    }

    setStatus('loading')

    // Pequeña pausa para UX
    await new Promise(r => setTimeout(r, 700))

    const permitidos = _W.map(_d)
    if (permitidos.includes(val)) {
      setStatus('welcome')
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('mp_user', val)
      }
    } else {
      setStatus('denied')
    }
  }

  function irAPlataforma() {
    router.push('/')
  }

  // ── PANTALLA DE BIENVENIDA ──
  if (status === 'welcome') {
    return (
      <>
        <Head><title>Bienvenida – MetaPrepa</title></Head>
        <div style={styles.bg}>
          <Dots />
          <div style={{ ...styles.card, textAlign: 'center', animation: 'cardIn .5s cubic-bezier(.22,1,.36,1) both' }}>
            <div style={styles.welcomeIcon}>🎓</div>
            <p style={styles.welcomeTitle}>¡Bienvenida a MetaPrepa!</p>
            <p style={styles.welcomeEmail}>{email.trim().toLowerCase()}</p>

            <div style={styles.welcomeBox}>
              <p style={styles.welcomeText}>
                Esta plataforma fue creada especialmente para ti, con una sola misión:{' '}
                <strong style={{ color: '#f1f5f9' }}>darte las herramientas que necesitas para alcanzar tu meta académica.</strong>
              </p>
              <p style={{ ...styles.welcomeText, marginTop: 10 }}>
                Aquí encontrarás temarios completos, ejercicios de práctica con explicaciones detalladas,
                videos de apoyo y simulacros basados en la guía oficial del{' '}
                <strong style={{ color: '#f1f5f9' }}>PIENSE II</strong> — el mismo examen que presentarás
                para ingresar a tu preparatoria.
              </p>
              <p style={{ ...styles.welcomeText, marginTop: 10 }}>
                Recuerda:{' '}
                <strong style={{ color: '#f1f5f9' }}>la constancia vale más que el talento.</strong>{' '}
                Cada tema que estudias, cada ejercicio que practicas y cada simulacro que completas
                te acerca un paso más al lugar que mereces.{' '}
                <strong style={{ color: '#22c55e' }}>Tú puedes lograrlo. 💪</strong>
              </p>
              <div style={styles.chips}>
                {['📚 8 temas', '✏️ 103 ejercicios', '🧪 Simulacro oficial', '🎯 60 preguntas reales', '▶️ 21 videos'].map(c => (
                  <span key={c} style={styles.chip}>{c}</span>
                ))}
              </div>
            </div>

            <button onClick={irAPlataforma} style={styles.btnBlue}>
              Comenzar a estudiar →
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </>
    )
  }

  // ── PANTALLA DE LOGIN ──
  return (
    <>
      <Head>
        <title>MetaPrepa – Iniciar sesión</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={styles.bg}>
        <Dots />
        <div style={{ ...styles.card, animation: 'cardIn .5s cubic-bezier(.22,1,.36,1) both' }}>

          {/* Logo */}
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>M</div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#fff', lineHeight: 1 }}>MetaPrepa</p>
              <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginTop: 2 }}>Plataforma de estudio PIENSE II</p>
            </div>
          </div>

          <h1 style={styles.h1}>Bienvenido 👋</h1>
          <p style={styles.subtitle}>Ingresa tu correo para acceder a la plataforma</p>

          <form onSubmit={handleSubmit} noValidate>
            <label style={styles.label}>Correo electrónico</label>
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setStatus(null); setError('') }}
                placeholder="tucorreo@gmail.com"
                autoComplete="email"
                style={styles.input}
              />
            </div>

            {error && (
              <div style={{ ...styles.msg, ...styles.msgWarn }}>{error}</div>
            )}
            {status === 'denied' && (
              <div style={{ ...styles.msg, ...styles.msgError }}>❌ Acceso denegado. Este correo no está autorizado.</div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              style={{ ...styles.btnGreen, opacity: status === 'loading' ? .6 : 1 }}
            >
              {status === 'loading' ? (
                <span style={styles.spinner} />
              ) : (
                <>
                  Entrar
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
      <style>{keyframes}</style>
    </>
  )
}

// ── Partículas de fondo ──
function Dots() {
  const colors = ['#22c55e','#3b82f6','#a855f7','#f59e0b']
  const dots = Array.from({ length: 14 }, (_, i) => ({
    size: Math.round(20 + ((i * 7919) % 60)),
    left: Math.round((i * 6271) % 100),
    color: colors[i % colors.length],
    dur: Math.round(12 + ((i * 3571) % 18)),
    delay: Math.round((i * 2357) % 12),
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: d.size, height: d.size,
          left: d.left + '%',
          background: d.color,
          borderRadius: '50%',
          opacity: 0.12,
          animation: `floatUp ${d.dur}s ${d.delay}s linear infinite`,
        }} />
      ))}
    </div>
  )
}

// ── Estilos ──
const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  card: {
    position: 'relative', zIndex: 1,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: 28, padding: '44px 40px',
    width: '100%', maxWidth: 420,
    boxShadow: '0 32px 64px rgba(0,0,0,.5)',
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 },
  logoIcon: {
    width: 48, height: 48, borderRadius: 14,
    background: 'linear-gradient(135deg,#22c55e,#3b82f6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, fontWeight: 900, color: '#fff',
    boxShadow: '0 8px 20px rgba(34,197,94,.35)',
  },
  h1: { fontSize: 26, fontWeight: 900, color: '#f1f5f9', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#64748b', marginBottom: 32 },
  label: {
    display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8,
  },
  inputIcon: {
    position: 'absolute', left: 14, top: '50%',
    transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none',
  },
  input: {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 14,
    padding: '14px 14px 14px 42px', fontSize: 15, color: '#f1f5f9',
    outline: 'none', fontFamily: 'inherit',
  },
  msg: { padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, marginBottom: 16 },
  msgWarn: { background: 'rgba(251,191,36,.15)', border: '1px solid rgba(251,191,36,.3)', color: '#fde68a' },
  msgError: { background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.3)', color: '#fca5a5' },
  btnGreen: {
    width: '100%', background: 'linear-gradient(135deg,#22c55e,#16a34a)',
    color: '#fff', border: 'none', borderRadius: 14, padding: 15,
    fontSize: 15, fontWeight: 800, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    boxShadow: '0 6px 20px rgba(34,197,94,.35)', fontFamily: 'inherit',
  },
  btnBlue: {
    width: '100%', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
    color: '#fff', border: 'none', borderRadius: 14, padding: 15,
    fontSize: 15, fontWeight: 800, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    boxShadow: '0 6px 20px rgba(59,130,246,.35)', fontFamily: 'inherit',
  },
  spinner: {
    width: 18, height: 18, borderRadius: '50%',
    border: '2.5px solid rgba(255,255,255,.3)',
    borderTopColor: '#fff',
    display: 'inline-block',
    animation: 'spin .6s linear infinite',
  },
  welcomeIcon: {
    width: 72, height: 72, borderRadius: 20,
    background: 'linear-gradient(135deg,#22c55e,#3b82f6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 34, margin: '0 auto 20px',
    boxShadow: '0 12px 32px rgba(34,197,94,.4)',
  },
  welcomeTitle: { fontSize: 24, fontWeight: 900, color: '#f1f5f9', marginBottom: 4 },
  welcomeEmail: { fontSize: 14, color: '#22c55e', fontWeight: 700, marginBottom: 24 },
  welcomeBox: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 18, padding: 20, marginBottom: 24, textAlign: 'left',
  },
  welcomeText: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.7 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  chip: {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: '#94a3b8',
  },
}

const keyframes = `
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(30px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes floatUp {
    0%   { transform: translateY(100vh); opacity: 0; }
    10%  { opacity: 0.12; }
    90%  { opacity: 0.12; }
    100% { transform: translateY(-120px); opacity: 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
