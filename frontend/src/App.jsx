import { useEffect, useState } from 'react'
import './App.css'

// Endpoint dell'API locale dove risiedono i dati dei libri
const API = 'http://localhost:5000/api/libri'

export default function App() {
  // --- STATO DELL'APPLICAZIONE (State Management) ---
  const [libri, setLibri] = useState([]) // Array principale che contiene i libri
  const [loading, setLoading] = useState(false) // Stato per gestire il caricamento (spinner)
  
  // Stati per la gestione della ricerca e dell'ordinamento
  const [filterAuthor, setFilterAuthor] = useState('')
  const [filterTitle, setFilterTitle] = useState('')
  const [filterGenre, setFilterGenre] = useState('')
  const [sortBy, setSortBy] = useState('')

  // Stato per il form di inserimento nuovo libro
  const [form, setForm] = useState({ titolo: '', autore: '', anno: '', genere: '' })

  // Stati per la modifica: 'editing' tiene l'ID del libro, 'editForm' i nuovi dati
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({ titolo: '', autore: '', anno: '', genere: '' })

  // Stato per la modalità scura (Dark Mode)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Carica i libri al montaggio del componente (una sola volta all'avvio)
  useEffect(() => { fetchLibri() }, [])

  // --- FUNZIONI DI COMUNICAZIONE CON L'API (CRUD) ---

  // READ: Recupera la lista dei libri dal server
  async function fetchLibri() {
    setLoading(true)
    try {
      const res = await fetch(API)
      const data = await res.json()
      setLibri(data) // Aggiorna lo stato con i dati ricevuti
    } catch (e) { 
      console.error("Errore nel recupero dati:", e) 
    } finally { 
      setLoading(false) // Nasconde lo spinner indipendentemente dal risultato
    }
  }

  // CREATE: Aggiunge un nuovo libro
  async function addLibro(e) {
    e.preventDefault() // Evita il ricaricamento della pagina al submit del form
    if (!form.titolo || !form.autore || !form.anno || !form.genere) return
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        const nuovo = await res.json()
        setLibri(prev => [nuovo, ...prev]) // Aggiorna la lista locale aggiungendo il nuovo in testa
        setForm({ titolo: '', autore: '', anno: '', genere: '' }) // Svuota il form
      }
    } catch (e) { console.error(e) }
  }

  // UPDATE: Modifica un libro esistente tramite il suo ID
  async function updateLibro(id, updated) {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
      if (res.ok) {
        const updatedBook = await res.json()
        // Aggiorna solo il libro specifico nell'array dello stato
        setLibri(prev => prev.map(b => b.id === id ? updatedBook : b))
        setEditing(null) // Chiude la modalità modifica
        setEditForm({ titolo: '', autore: '', anno: '', genere: '' })
      }
    } catch (e) { console.error(e) }
  }

  // DELETE: Rimuove un libro dal database e dalla UI
  async function deleteLibro(id) {
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
      if (res.ok) setLibri(prev => prev.filter(b => b.id !== id))
    } catch (e) { console.error(e) }
  }

  // DELETE ALL: Svuota l'intera libreria (con conferma di sicurezza)
  async function clearLibrary() {
    if (!confirm('Eliminare tutti i libri?')) return
    try {
      const res = await fetch(API, { method: 'DELETE' })
      if (res.ok) setLibri([])
    } catch (e) { console.error(e) }
  }

  // --- LOGICA DI INTERFACCIA (UI Logic) ---

  function resetFilters() {
    setFilterAuthor(''); setFilterTitle(''); setFilterGenre(''); setSortBy('')
  }

  function toggleTheme() {
    setIsDarkMode(!isDarkMode)
  }

  // Estrae dinamicamente i generi presenti per popolare il menu a tendina
  const genres = Array.from(new Set(libri.map(b => b.genere))).sort()

  // --- FILTRAGGIO E ORDINAMENTO (Client-side) ---
  // Applichiamo i filtri sulla lista dei libri prima di renderizzarla
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
        {/* Form dinamico: gestisce sia l'inserimento che la modifica */}
        <form className="form card" onSubmit={editing ? (e) => { e.preventDefault(); updateLibro(editing, editForm) } : addLibro}>
          <input className="input" placeholder="📖 Titolo" value={editing ? editForm.titolo : form.titolo} onChange={e => editing ? setEditForm({ ...editForm, titolo: e.target.value }) : setForm({ ...form, titolo: e.target.value })} required />
          <input className="input" placeholder="👤 Autore" value={editing ? editForm.autore : form.autore} onChange={e => editing ? setEditForm({ ...editForm, autore: e.target.value }) : setForm({ ...form, autore: e.target.value })} required />
          <input className="input" type="number" placeholder="📅 Anno" value={editing ? editForm.anno : form.anno} onChange={e => editing ? setEditForm({ ...editForm, anno: e.target.value }) : setForm({ ...form, anno: e.target.value })} required />
          <input className="input" placeholder="🎭 Genere" value={editing ? editForm.genere : form.genere} onChange={e => editing ? setEditForm({ ...editForm, genere: e.target.value }) : setForm({ ...form, genere: e.target.value })} required />
          
          <button type="submit" className="btn primary">{editing ? '✨ Aggiorna' : '➕ Aggiungi'}</button>
          
          {editing && (
            <button type="button" className="btn secondary" onClick={() => { setEditing(null); setEditForm({ titolo: '', autore: '', anno: '', genere: '' }) }}>❌ Annulla</button>
          )}
          <button type="button" className="btn danger" onClick={clearLibrary}>🗑️ Svuota Libreria</button>
        </form>

        {/* Sezione Filtri e Ricerca */}
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
        {/* Render condizionale: mostra spinner se carica, altrimenti la lista */}
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
                    {/* Attiva la modalità editing per questo libro specifico */}
                    <button className="btn edit" onClick={() => { setEditing(b.id); setEditForm({ titolo: b.titolo, autore: b.autore, anno: b.anno, genere: b.genere }) }}>✏️ Modifica</button>
                    <button className="btn delete" onClick={() => deleteLibro(b.id)}>🗑️ Elimina</button>
                  </div>
                </article>
              ))}
              {/* Messaggio se la ricerca non produce risultati */}
              {filtered.length === 0 && <p className="empty">📭 Nessun libro trovato con i filtri applicati.</p>}
            </div>
          </>
        )}
      </main>

      <footer className="footer">📖 Progetto Libreria • React + Flask </footer>
    </div>
  )
}