import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../../../../components/Header'
import { getSchool, SCHOOLS } from '../../../../data/schools'
import { getTopic, getTopics } from '../../../../data/topics'

// Colores de acento por tema, para que cada materia tenga su propia identidad visual
const ACCENTS = {
  blue:   { grad: 'linear-gradient(135deg,#3b82f6,#2563eb)', soft: '#eff6ff', softBorder: '#dbeafe', text: '#1d4ed8', chip: '#2563eb' },
  green:  { grad: 'linear-gradient(135deg,#22c55e,#16a34a)', soft: '#f0fdf4', softBorder: '#dcfce7', text: '#15803d', chip: '#16a34a' },
  orange: { grad: 'linear-gradient(135deg,#f97316,#ea580c)', soft: '#fff7ed', softBorder: '#fed7aa', text: '#c2410c', chip: '#ea580c' },
  purple: { grad: 'linear-gradient(135deg,#a855f7,#9333ea)', soft: '#faf5ff', softBorder: '#f3e8ff', text: '#7e22ce', chip: '#9333ea' },
  teal:   { grad: 'linear-gradient(135deg,#14b8a6,#0d9488)', soft: '#f0fdfa', softBorder: '#ccfbf1', text: '#0f766e', chip: '#0d9488' },
  indigo: { grad: 'linear-gradient(135deg,#6366f1,#4f46e5)', soft: '#eef2ff', softBorder: '#e0e7ff', text: '#4338ca', chip: '#4f46e5' },
  red:    { grad: 'linear-gradient(135deg,#ef4444,#dc2626)', soft: '#fef2f2', softBorder: '#fecaca', text: '#b91c1c', chip: '#dc2626' },
  amber:  { grad: 'linear-gradient(135deg,#f59e0b,#d97706)', soft: '#fffbeb', softBorder: '#fde68a', text: '#b45309', chip: '#d97706' },
  sky:    { grad: 'linear-gradient(135deg,#0ea5e9,#0284c7)', soft: '#f0f9ff', softBorder: '#bae6fd', text: '#0369a1', chip: '#0284c7' },
}
const accentOf = (color) => ACCENTS[color] || ACCENTS.blue

// Convierte un bloque "example" de texto plano (con \n) en tarjetas de pasos/líneas más legibles
function ExampleCard({ text, accent }) {
  const lines = text.split('\n')
  return (
    <div className="my-5 rounded-2xl overflow-hidden shadow-sm" style={{ border: `1.5px solid ${accent.softBorder}` }}>
      <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: accent.grad }}>
        <span className="text-base">✏️</span>
        <span className="text-xs font-black text-white uppercase tracking-wider">Ejemplo</span>
      </div>
      <div className="bg-white px-5 py-4">
        {lines.map((line, idx) => {
          if (line.trim() === '') return <div key={idx} className="h-2" />
          const isCheck = /✓\s*$/.test(line)
          const clean = line.replace(/✓\s*$/, '').trimEnd()
          return (
            <p key={idx} className="text-[15px] text-slate-700 leading-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {clean}
              {isCheck && <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs align-middle" style={{ background: '#22c55e' }}>✓</span>}
            </p>
          )
        })}
      </div>
    </div>
  )
}

function Block({ b, i, accent }) {
  if (b.type === 'h2') return (
    <div key={i} className="flex items-center gap-3 mt-8 mb-4 first:mt-0">
      <div className="w-2 h-9 rounded-full flex-shrink-0" style={{ background: accent.grad }} />
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">{b.text}</h2>
    </div>
  )
  if (b.type === 'h3') {
    const m = b.text.match(/^(\d+)\.\s*(.*)$/)
    return (
      <div key={i} className="flex items-center gap-2.5 mt-7 mb-3">
        {m ? (
          <span className="w-7 h-7 rounded-xl text-white text-xs font-black flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: accent.grad }}>{m[1]}</span>
        ) : (
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: accent.chip }} />
        )}
        <h3 className="text-[15px] font-black text-slate-800">{m ? m[2] : b.text}</h3>
      </div>
    )
  }
  if (b.type === 'p') return <p key={i} className="text-[15px] text-slate-600 leading-8 mb-2">{b.text}</p>
  if (b.type === 'example') return <ExampleCard key={i} text={b.text} accent={accent} />
  if (b.type === 'tip') return (
    <div key={i} className="my-5 rounded-2xl p-4 flex gap-3 items-start shadow-sm" style={{ background: 'linear-gradient(135deg,#fffbeb,#fff7ed)', border: '1.5px solid #fde68a' }}>
      <span className="text-2xl flex-shrink-0 leading-none">💡</span>
      <p className="text-sm text-amber-900 leading-relaxed font-semibold">{b.text}</p>
    </div>
  )
  return null
}

function PracticeSection({ practice }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [shown, setShown] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  if (!practice || practice.length === 0) return null
  if (done) return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
      <p className="text-4xl mb-3">{score >= practice.length * 0.7 ? '🏆' : '💪'}</p>
      <p className="font-black text-slate-900 text-lg">{score}/{practice.length} correctas</p>
      <p className="text-sm text-slate-400 mb-4">{score >= practice.length * 0.7 ? '¡Excelente dominio del tema!' : 'Repasa la explicación y vuelve a intentarlo'}</p>
      <button onClick={() => { setIdx(0); setSelected(null); setShown(false); setScore(0); setDone(false) }}
        className="w-full py-3 rounded-xl text-white font-bold text-sm press" style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)' }}>
        🔄 Intentar de nuevo
      </button>
    </div>
  )

  const q = practice[idx]
  const letters = ['A', 'B', 'C', 'D']

  function pick(i) {
    if (shown) return
    setSelected(i)
    setShown(true)
    if (i === q.ans) setScore((s) => s + 1)
  }

  function next() {
    if (idx + 1 >= practice.length) { setDone(true); return }
    setIdx((n) => n + 1); setSelected(null); setShown(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between" style={{ background: '#f8fafc' }}>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Práctica</p>
        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg">{idx + 1}/{practice.length}</span>
      </div>
      <div className="p-4">
        <p className="font-bold text-slate-900 text-sm leading-relaxed mb-4">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, i) => {
            let cls = 'bg-white border-2 border-slate-200 text-slate-700'
            let lCls = 'bg-slate-100 text-slate-500'
            if (shown) {
              if (i === q.ans)          { cls = 'bg-green-50 border-2 border-green-400 text-green-800'; lCls = 'bg-green-500 text-white' }
              else if (i === selected)  { cls = 'bg-red-50 border-2 border-red-400 text-red-700'; lCls = 'bg-red-500 text-white' }
              else                      { cls = 'border-2 border-slate-100 text-slate-300 opacity-50' }
            }
            return (
              <button key={i} onClick={() => pick(i)} className={`w-full text-left p-3 rounded-xl font-semibold text-sm transition-all press flex items-center gap-3 ${cls}`}>
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${lCls}`}>{letters[i]}</span>
                {opt}
              </button>
            )
          })}
        </div>
        {shown && (
          <div className="mt-3">
            <div className={`rounded-xl p-3 mb-3 ${selected === q.ans ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-xs font-bold mb-1 ${selected === q.ans ? 'text-green-800' : 'text-red-800'}`}>
                {selected === q.ans ? '✅ ¡Correcto!' : '❌ Incorrecto'}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">{q.sol}</p>
            </div>
            <button onClick={next} className="w-full py-2.5 rounded-xl text-white font-bold text-sm press" style={{ background: '#0f172a' }}>
              {idx + 1 < practice.length ? 'Siguiente →' : 'Ver resultado 🏆'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const TABS = ['📖 Explicación', '✏️ Práctica', '🎥 Videos']

export default function TemaPage({ id, topicId }) {
  const router = useRouter()
  const resolvedId = id || router.query.id
  const resolvedTopicId = topicId || router.query.topicId
  const school = resolvedId ? getSchool(resolvedId) : null
  const topic  = (school && resolvedTopicId) ? getTopic(school.exam, resolvedTopicId) : null

  const [tab, setTab] = useState(0)

  if (!school || !topic) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-400">Cargando...</p></div>

  const accent = accentOf(topic.color)

  return (
    <>
      <Head><title>{topic.title} – MetaPrepa</title></Head>
      <div className="min-h-screen bg-sky-100 flex flex-col">
        <Header backHref={'/escuela/' + resolvedId + '/temas'} />
        <div className="max-w-lg mx-auto w-full px-4 pt-4 pb-2">
          <div className="rounded-2xl shadow-sm p-4 flex items-center gap-3 mb-4 text-white relative overflow-hidden" style={{ background: accent.grad }}>
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">{topic.emoji}</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,.8)' }}>{topic.subject}</p>
              <h1 className="text-base font-black">{topic.title}</h1>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,.8)' }}>{topic.difficulty} · {(topic.practice || []).length} ejercicios</p>
            </div>
          </div>
          <div className="bg-slate-100 rounded-2xl p-1 flex gap-1 mb-4">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all press ${tab === i ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-auto w-full px-4 pb-8">

          {tab === 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              {(topic.content || []).map((b, i) => <Block key={i} b={b} i={i} accent={accent} />)}
              <div className="mt-6 pt-5 border-t border-slate-100 flex gap-3">
                <button onClick={() => setTab(1)} className="flex-1 py-3 rounded-2xl text-white text-sm font-bold press" style={{ background: accent.grad }}>✏️ Practicar</button>
                <button onClick={() => setTab(2)} className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 text-sm font-bold press">🎥 Ver videos</button>
              </div>
            </div>
          )}

          {tab === 1 && <PracticeSection practice={topic.practice} />}

          {tab === 2 && (
            <div>
              {(!topic.videos || topic.videos.length === 0) ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                  <p className="text-3xl mb-3">🎥</p>
                  <p className="font-bold text-slate-700">No hay videos para este tema</p>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-3">
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                      <iframe src={'https://www.youtube.com/embed/' + topic.videos[0].id} title={topic.videos[0].title}
                        frameBorder="0" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-slate-900 text-sm">{topic.videos[0].title}</p>
                      <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <p className="text-xs text-amber-700">💡 Después del video, ve a Práctica para reforzar lo aprendido.</p>
                      </div>
                    </div>
                  </div>
                  {topic.videos.length > 1 && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Más videos</p>
                      <div className="flex flex-col gap-2">
                        {topic.videos.slice(1).map((v) => (
                          <a key={v.id} href={'https://www.youtube.com/watch?v=' + v.id} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl hover:bg-red-50 transition-colors group">
                            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="#dc2626"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            </div>
                            <p className="text-xs font-semibold text-slate-700 leading-tight">{v.title}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              <button onClick={() => setTab(0)} className="w-full bg-white border border-slate-100 text-slate-700 font-bold py-3 rounded-2xl text-sm shadow-sm press">
                📖 Volver a la explicación
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export function getStaticPaths() {
  const paths = []
  SCHOOLS.forEach((s) => {
    getTopics(s.exam).forEach((t) => {
      paths.push({ params: { id: s.id, topicId: t.id } })
    })
  })
  return { paths, fallback: false }
}
export function getStaticProps({ params }) {
  return { props: { id: params.id, topicId: params.topicId } }
}
