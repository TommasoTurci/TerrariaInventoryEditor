# Terraria Character Save Editor (Web)

Editor web lato client per la modifica dei file di salvataggio dei personaggi di **Terraria**, utilizzabile direttamente dal browser senza backend.

Il progetto permette di importare un file di salvataggio (`.plr`), visualizzare e modificare inventario e sezioni correlate, ed esportare il file aggiornato in un formato compatibile con il gioco.

---

## Obiettivo del progetto

L’obiettivo è fornire uno strumento:
- semplice da usare
- completamente client-side
- accessibile da diversi dispositivi

L’applicazione è pensata come progetto didattico per il corso di **Fondamenti di Sistemi Web**, ma con un’architettura sufficientemente modulare da poter essere estesa.

---

## Funzionalità principali

- Importazione ed esportazione dei file di salvataggio del personaggio
- Visualizzazione completa dell’inventario
- Ricerca e filtro degli oggetti
- Modifica quantità, spostamento e svuotamento degli slot
- Gestione separata di:
  - Inventario principale
  - Armature
  - Accessori
  - Piggy Bank
  - Safe (e altre stash)
- Interfaccia reattiva con micro-interazioni
- Supporto opzionale alla modalità **Progressive Web App (PWA)**

---

## Tecnologie utilizzate

### Frontend
- **Vue.js** (Single File Components)
- **Vite** per sviluppo e build

### Animazioni
- **anime.js** per micro-interazioni e transizioni leggere

### Tooling
- npm
- Vite dev server

### PWA (opzionale)
- `manifest.webmanifest`
- Service Worker per caching delle risorse statiche

---

## Struttura del progetto

src/
├── main.js # Entry point dell'app
├── App.vue # Layout globale
├── index.js # Definizione delle rotte
├── views/
│ ├── editor.vue # Editor principale
│ ├── import.vue # Import dei salvataggi
│ └── inventory.vue # Vista inventario
├── scripts/
│ ├── parser.js # Parsing file .plr
│ ├── inventory.js # Logica inventario
│ └── import.js # Gestione import
├── storage.js # Helper per localStorage
├── items-database.js # Database locale degli oggetti
├── style.css # Stili globali
public/
├── index.html
├── manifest.webmanifest # Configurazione PWA
└── assets/ # Icone e immagini


---

## Architettura e flusso

1. L’app carica il database locale degli oggetti
2. L’utente importa un file di salvataggio del personaggio
3. Il file viene convertito in una struttura dati JavaScript tramite il parser
4. Le viste Vue mostrano i dati e consentono le modifiche
5. Al salvataggio, i dati vengono serializzati ed esportati come nuovo file

Tutta la logica è eseguita lato client, senza comunicazioni con server esterni.

---

## Avvio del progetto

### Ambiente di sviluppo
```bash
npm install
npm run dev
Build di produzione
npm run build
Design e prototipo
Il design e il flusso dell’interfaccia sono stati prototipati in Figma.

🔗 Prototipo Figma
https://done-groove-14391780.figma.site/