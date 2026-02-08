# Terraria Character Save Editor (Web)

Editor web lato client per la modifica dei file di salvataggio dei personaggi di **Terraria**, utilizzabile direttamente dal browser senza backend.

Il progetto permette di importare un file di salvataggio (`.plr`), visualizzare e modificare inventario e sezioni correlate, ed esportare il file aggiornato in un formato compatibile con il gioco.

---

## Funzionalità principali

- Importazione ed esportazione dei file di salvataggio del personaggio
- Visualizzazione completa dell’inventario
- Modifica quantità, spostamento e svuotamento degli slot
- Interfaccia reattiva con animazioni per migliorare l'user experience
- Supporto opzionale alla modalità **Progressive Web App (PWA)**

---

## Tecnologie utilizzate

### Frontend
- **Vue.js** (Single File Components)
- **Vite** per sviluppo e build

### Animazioni
- **anime.js** per micro-interazioni e transizioni leggere

### Development
- npm
- Vite dev server

### PWA (opzionale)
- `manifest.webmanifest`
- Service Worker per caching delle risorse statiche

---

## Struttura del progetto

La posizione dei file principali:

- [src/main.js](src/main.js) — entry point dell'app
- [src/App.vue](src/App.vue) — layout globale e `router-view`
- [src/router/index.js](src/router/index.js) — rotte
- [src/views/editor.vue](src/views/editor.vue) — editor principale
- [src/views/import.vue](src/views/import.vue) — UI per importare i salvataggi
- [src/views/inventory.vue](src/views/inventory.vue) — vista inventario
- [src/data/items-database.js](src/data/items-database.js) — database locale degli oggetti
- [src/scripts/parser.js](src/scripts/parser.js) — parsing dei file `.plr`
- [src/scripts/inventory.js](src/scripts/inventory.js) — logica di manipolazione inventario
- [src/utils/storage.js](src/utils/storage.js) — helper per localStorage
- [src/css/style.css](src/css/style.css) — stili globali
- [public/index.html](public/index.html) — entry HTML
- [public/manifest.webmanifest](public/manifest.webmanifest) — configurazione PWA (opzionale)
- `assets/`, `public/assets/` — icone e immagini

---

## Architettura e flusso

1. L’app carica il database locale degli oggetti
2. L’utente importa un file di salvataggio del personaggio
3. Il file viene convertito in una struttura dati JavaScript tramite il parser
4. Le viste Vue mostrano i dati e consentono le modifiche
5. Al salvataggio, i dati vengono serializzati ed esportati come un file JSON.

---

## Avvio del progetto

### Ambiente di sviluppo
```bash
npm install
npm run dev
```

Build di produzione
```bash
npm run build
```

Design e prototipo
Il design e il flusso dell’interfaccia sono stati prototipati in Figma.

🔗 Prototipo Figma
https://done-groove-14391780.figma.site/

Nella cartella ```/project``` è possibile trovare altra documentazione relativa alla fase di progettazione, come alcuni stadi di mockup precedenti al confronto con il gruppo di utenti.