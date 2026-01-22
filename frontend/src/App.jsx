import { useEffect, useState } from 'react'
import './App.css'

const API = 'http://localhost:5000/api/libri'

export default function App() {
  const [libri, setLibri] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterAuthor, setFilterAuthor] = useState('')
  const [filterGenre, setFilterGenre] = useState('')
  const [form, setForm] = useState({ titolo: '', autore: '', anno: '', genere: '' })

  useEffect(() => { fetchLibri() }, [])

  async function fetchLibri() {
    setLoading(true)
    try {
      const res = await fetch(API)
      const data = await res.json()
      setLibri(data)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  async function addLibro(e) {
    e.preventDefault()
    if (!form.titolo || !form.autore || !form.anno || !form.genere) return
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        const nuovo = await res.json()
        setLibri(prev => [nuovo, ...prev])
        setForm({ titolo: '', autore: '', anno: '', genere: '' })
      }
    } catch (e) { console.error(e) }
  }

  async function deleteLibro(id) {
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
      if (res.ok) setLibri(prev => prev.filter(b => b.id !== id))
    } catch (e) { console.error(e) }
  }

  async function clearLibrary() {
    if (!confirm('Eliminare tutti i libri?')) return
    try {
      const res = await fetch(API, { method: 'DELETE' })
      if (res.ok) setLibri([])
    } catch (e) { console.error(e) }
  }

  const genres = Array.from(new Set(libri.map(b => b.genere))).sort()
  const filtered = libri.filter(b =>
    b.autore.toLowerCase().includes(filterAuthor.toLowerCase()) &&
    (filterGenre ? b.genere === filterGenre : true)
  )

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gestione Libreria</h1>
        <p className="subtitle">React + Flask — semplice CRUD</p>
      </header>

      <section className="controls">
        <form className="form" onSubmit={addLibro}>
          <input placeholder="Titolo" value={form.titolo} onChange={e => setForm({ ...form, titolo: e.target.value })} />
          <input placeholder="Autore" value={form.autore} onChange={e => setForm({ ...form, autore: e.target.value })} />
          <input placeholder="Anno" value={form.anno} onChange={e => setForm({ ...form, anno: e.target.value })} />
          <input placeholder="Genere" value={form.genere} onChange={e => setForm({ ...form, genere: e.target.value })} />
          <button type="submit" className="btn primary">Aggiungi</button>
          <button type="button" className="btn danger" onClick={clearLibrary}>Svuota</button>
        </form>

        <div className="filters">
          <input placeholder="Cerca autore..." value={filterAuthor} onChange={e => setFilterAuthor(e.target.value)} />
          <select value={filterGenre} onChange={e => setFilterGenre(e.target.value)}>
            <option value="">Tutti i generi</option>
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </section>

      <main>
        {loading ? <p>Caricamento...</p> : (
          <>
            <p className="count">Libri trovati: {filtered.length}</p>
            <div className="book-list">
              {filtered.map(b => (
                <article className="book-card" key={b.id}>
                  <div>
                    <h3>{b.titolo}</h3>
                    <p className="meta">{b.autore} — {b.anno} • <em>{b.genere}</em></p>
                  </div>
                  <div className="book-actions">
                    <button className="btn" onClick={() => deleteLibro(b.id)}>Elimina</button>
                  </div>
                </article>
              ))}
              {filtered.length === 0 && <p className="empty">Nessun libro da mostrare.</p>}
            </div>
          </>
        )}
      </main>

      <footer className="footer">Progetto Libreria • React + Flask</footer>
    </div>
  )
}
