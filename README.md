## 📚 Sistema di Gestione Libreria
Questo progetto è una Web Application Full-Stack progettata per la gestione semplificata di un catalogo librario. L'applicazione permette di visualizzare, aggiungere ed eliminare libri, dimostrando l'integrazione tra un frontend moderno in React e un backend robusto in Flask tramite API REST.

## 📑 Descrizione del Progetto
L'applicazione è divisa in due componenti principali:


Backend (Flask): Gestisce i dati e fornisce le API per le operazioni CRUD (Create, Read, Delete). All'avvio, il sistema popola automaticamente il database temporaneo con circa 20 libri realistici generati tramite la libreria Faker.


Frontend (React): Interfaccia utente dinamica che permette la consultazione dei libri, il filtraggio in tempo reale e la gestione della collezione.

## 🛠 Analisi dei Requisiti
Requisiti Funzionali

Visualizzazione: L'utente deve poter visualizzare l'elenco completo dei libri presenti nel sistema (Titolo, Autore, Anno, Genere).


Inserimento: Possibilità di aggiungere nuovi libri tramite un form controllato; l'ID viene gestito automaticamente dal server.


Cancellazione Singola: Possibilità di eliminare un libro specifico tramite il proprio identificativo.


Cancellazione Totale: Funzionalità per svuotare l'intera libreria con un singolo comando.


Ricerca e Filtro: Sistema di filtraggio lato client per cercare libri per autore o per genere.

Requisiti Non Funzionali

Architettura: Separazione netta tra Client (Frontend) e Server (Backend).


Protocollo di Comunicazione: Utilizzo di standard REST per lo scambio dati in formato JSON.


Versionamento: Codice sorgente gestito interamente tramite Git e caricato su GitHub.

## 👤 User Stories

Come Bibliotecario, voglio vedere una lista di libri pre-caricati all'avvio per testare subito le funzionalità del sistema.


Come Utente, voglio poter filtrare i libri per genere così da trovare rapidamente i titoli di mio interesse.


Come Amministratore, voglio poter eliminare un libro inserito per errore o svuotare la lista per aggiornare il catalogo.

## 🚀 Tecnologie Utilizzate

Backend: Python, Flask, Faker (per la generazione dati).


Frontend: React (Vite), Hooks (useState, useEffect).


Tooling: Git per il versionamento.


