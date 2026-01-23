import { useEffect, useState } from 'react'
import './App.css'

const API = 'http://localhost:5000/api/libri'

export default function App() {
  const [libri, setLibri] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterAuthor, setFilterAuthor] = useState('')
  const [filterTitle, setFilterTitle] = useState('')
  const [filterGenre, setFilterGenre] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [form, setForm] = useState({ titolo: '', autore: '', anno: '', genere: '' })
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({ titolo: '', autore: '', anno: '', genere: '' })
  const [isDarkMode, setIsDarkMode] = useState(false)

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

  async function updateLibro(id, updated) {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
      if (res.ok) {
        const updatedBook = await res.json()
        setLibri(prev => prev.map(b => b.id === id ? updatedBook : b))
        setEditing(null)
        setEditForm({ titolo: '', autore: '', anno: '', genere: '' })
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

  function resetFilters() {
    setFilterAuthor('')
    setFilterTitle('')
    setFilterGenre('')
    setSortBy('')
  }

  function toggleTheme() {
    setIsDarkMode(!isDarkMode)
  }

  const genres = Array.from(new Set(libri.map(b => b.genere))).sort()
  const filtered = libri
    .filter(b =>
      b.autore.toLowerCase().includes(filterAuthor.toLowerCase()) &&
      b.titolo.toLowerCase().includes(filterTitle.toLowerCase()) &&
      (filterGenre ? b.genere === filterGenre : true)
    )
    .sort((a, b) => {
      if (sortBy === 'titolo') return a.titolo.localeCompare(b.titolo)
      if (sortBy === 'anno') return a.anno - b.anno
      return 0
    })

  return (
    <div className={`app ${isDarkMode ? 'dark' : ''}`}>
      <header className="app-header">
        <h1>📚 Gestione Libreria</h1>
        
        <button className="btn theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <section className="controls">
        <form className="form card" onSubmit={editing ? (e) => { e.preventDefault(); updateLibro(editing, editForm) } : addLibro}>
          <input className="input" placeholder="📖 Titolo" value={editing ? editForm.titolo : form.titolo} onChange={e => editing ? setEditForm({ ...editForm, titolo: e.target.value }) : setForm({ ...form, titolo: e.target.value })} required />
          <input className="input" placeholder="👤 Autore" value={editing ? editForm.autore : form.autore} onChange={e => editing ? setEditForm({ ...editForm, autore: e.target.value }) : setForm({ ...form, autore: e.target.value })} required />
          <input className="input" type="number" placeholder="📅 Anno" value={editing ? editForm.anno : form.anno} onChange={e => editing ? setEditForm({ ...editForm, anno: e.target.value }) : setForm({ ...form, anno: e.target.value })} required />
          <input className="input" placeholder="🎭 Genere" value={editing ? editForm.genere : form.genere} onChange={e => editing ? setEditForm({ ...editForm, genere: e.target.value }) : setForm({ ...form, genere: e.target.value })} required />
          <button type="submit" className="btn primary">{editing ? '✨ Aggiorna' : '➕ Aggiungi'}</button>
          {editing && <button type="button" className="btn secondary" onClick={() => { setEditing(null); setEditForm({ titolo: '', autore: '', anno: '', genere: '' }) }}>❌ Annulla</button>}
          <button type="button" className="btn danger" onClick={clearLibrary}>🗑️ Svuota Libreria</button>
        </form>

        <div className="filters card">
          <input className="input" placeholder="🔍 Cerca autore..." value={filterAuthor} onChange={e => setFilterAuthor(e.target.value)} />
          <input className="input" placeholder="🔍 Cerca titolo..." value={filterTitle} onChange={e => setFilterTitle(e.target.value)} />
          <select className="select" value={filterGenre} onChange={e => setFilterGenre(e.target.value)}>
            <option value="">📚 Tutti i generi</option>
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select className="select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="">🔀 Nessun ordinamento</option>
            <option value="titolo">📝 Ordina per titolo</option>
            <option value="anno">📅 Ordina per anno</option>
          </select>
          <button className="btn reset" onClick={resetFilters}>🔄 Reset Filtri</button>
        </div>
      </section>

      <main>
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Caricamento libri...</p>
          </div>
        ) : (
          <>
            <p className="count">📊 Libri trovati: {filtered.length}</p>
            <div className="book-list">
              {filtered.map(b => (
                <article className="book-card card" key={b.id}>
                  <div className="book-info">
                    <h3 className="book-title">{b.titolo}</h3>
                    <p className="book-meta">👤 {b.autore} — 📅 {b.anno} • 🎭 <em>{b.genere}</em></p>
                  </div>
                  <div className="book-actions">
                    <button className="btn edit" onClick={() => { setEditing(b.id); setEditForm({ titolo: b.titolo, autore: b.autore, anno: b.anno, genere: b.genere }) }}>✏️ Modifica</button>
                    <button className="btn delete" onClick={() => deleteLibro(b.id)}>🗑️ Elimina</button>
                  </div>
                </article>
              ))}
              {filtered.length === 0 && <p className="empty">📭 Nessun libro trovato con i filtri applicati.</p>}
            </div>
          </>
        )}
      </main>

      <footer className="footer">📖 Progetto Libreria • React + Flask </footer>
    </div>
  )
}
