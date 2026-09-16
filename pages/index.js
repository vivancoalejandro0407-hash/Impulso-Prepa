import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import { SCHOOLS } from '../data/schools'

const STEPS = [
  { icon: '🏫', title: 'Elige tu prepa', desc: 'Selecciona la escuela a la que quieres entrar' },
  { icon: '📖', title: 'Estudia el tema', desc: 'Lee la explicación y mira los videos' },
  { icon: '✏️', title: 'Practica', desc: 'Resuelve ejercicios y el simulacro oficial' },
]

export default function Home() {
  return (
    <>
      <Head>
        <title>MetaPrepa – Alcanza tu meta</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-sky-100">
        <Header />
        <main className="max-w-lg mx-auto px-4 pb-12">

          {/* Hero */}
          <section className="pt-7 pb-5 anim-up">
            <div className="rounded-[2rem] p-7 text-white relative overflow-hidden shadow-xl" style={{ background: 'linear-gradient(150deg,#0f172a,#1e293b 60%,#0f172a)' }}>
              <div className="absolute top-0 right-0 w-44 h-44 rounded-full opacity-20 blur-2xl" style={{ background: '#22c55e', transform: 'translate(35%,-35%)' }} />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ background: '#0ea5e9', transform: 'translate(-30%,30%)' }} />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-5" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <span className="w-2 h-2 bg-green-400 rounded-full" style={{ animation: 'pulse 2s infinite' }} />
                  <span className="text-xs font-semibold tracking-wide">Convocatoria 2025-2026</span>
                </div>
                <h1 className="text-[28px] font-black leading-[1.15] mb-3 tracking-tight">
                  Alcanza tu meta:<br />
                  <span style={{ background: 'linear-gradient(135deg,#4ade80,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    entra a la prepa que quieres
                  </span>
                </h1>
                <p className="text-[15px] leading-relaxed mb-6" style={{ color: '#94a3b8' }}>
                  Explicaciones claras, videos y práctica ilimitada. Preparación completa y gratuita para tu examen de admisión.
                </p>
                <Link href="#escuelas">
                  <button className="w-full py-3.5 rounded-2xl font-bold text-[15px] text-white press flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow: '0 8px 20px rgba(34,197,94,.35)' }}>
                    🚀 Comenzar mi preparación
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-3 gap-3 mb-7">
            {[['🏫','4','Escuelas','#eff6ff'],['❓','100+','Preguntas','#f0fdf4'],['🎁','100%','Gratis','#fefce8']].map(([icon,val,lbl,bg]) => (
              <div key={lbl} className="bg-white rounded-2xl p-4 text-center border border-slate-100 shadow-sm">
                <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center text-lg" style={{ background: bg }}>{icon}</div>
                <p className="font-black text-slate-900 text-lg leading-none">{val}</p>
                <p className="text-slate-400 text-[11px] mt-1 font-semibold uppercase tracking-wide">{lbl}</p>
              </div>
            ))}
          </section>

          {/* Cómo funciona */}
          <section className="mb-7">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">¿Cómo funciona?</p>
              <div className="flex items-start gap-2">
                {STEPS.map((s, i) => (
                  <div key={s.title} className="flex-1 flex flex-col items-center text-center gap-2">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg,#f0fdf4,#eff6ff)', border: '1.5px solid #e2e8f0' }}>{s.icon}</div>
                    <p className="text-xs font-black text-slate-800 leading-tight">{s.title}</p>
                    <p className="text-[11px] text-slate-400 leading-tight">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Schools */}
          <section id="escuelas">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-lg text-slate-900 tracking-tight">¿A qué prepa quieres entrar?</h2>
            </div>
            <div className="flex flex-col gap-3">
              {SCHOOLS.map((s, i) => (
                <Link key={s.id} href={'/escuela/' + s.id}>
                  <div className="card-hover press bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 shadow-sm cursor-pointer anim-up" style={{ animationDelay: i * 0.07 + 's', opacity: 0, animationFillMode: 'forwards' }}>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{s.name}</p>
                      <p className="text-xs text-slate-400 truncate mb-1.5">{s.desc}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${s.badge}`}>{s.exam}</span>
                        <span className="text-xs text-slate-400">{s.places}</span>
                      </div>
                    </div>
                    <svg className="text-slate-300 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <footer className="mt-10 text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-xl flex items-center justify-center text-white font-black text-xs" style={{ background: 'linear-gradient(135deg,#22c55e,#3b82f6)' }}>M</div>
            <p className="text-xs text-slate-400">MetaPrepa by <span className="font-bold text-slate-600">Red Talento</span> · 2025</p>
          </footer>
        </main>
      </div>
    </>
  )
}
