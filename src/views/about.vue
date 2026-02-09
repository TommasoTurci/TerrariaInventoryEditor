<template>
  <div class="about-view slide-in">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="card">
          <div class="card-header">
            <h4><em class="bi bi-info-circle" aria-hidden="true"></em> Funzionalità: Progressive Web App & anime.js</h4>
          </div>
          <div class="card-body">
            <h5><em class="bi bi-phone text-info" aria-hidden="true"></em> Progressive Web App (PWA)</h5>
            <p>
              Una Progressive Web App (PWA) è un'applicazione web progettata per offrire un'esperienza simile a quella di un'applicazione nativa. Utilizza tecnologie standard del web per garantire buone prestazioni, funzionamento offline e possibilità di installazione sul dispositivo dell'utente.
            </p>
            <p>
              Una PWA migliora l'esperienza utente rendendo l'applicazione più affidabile e coerente su diversi dispositivi. Può essere avviata da una finestra dedicata, mantenere lo stato dell'utente e continuare a funzionare anche in presenza di connessioni instabili o assenti.
            </p>
            <p>
              Le principali caratteristiche di una PWA sono:
            </p>
            <ul>
              <li>Installabilità: tramite il file manifest.json, l'utente può aggiungere l'app alla schermata principale del dispositivo.</li>
              <li>Supporto offline: grazie ai service worker è possibile gestire la cache delle risorse e mostrare contenuti anche senza connessione di rete.</li>
              <li>Migliori performance: il caching delle risorse statiche riduce i tempi di caricamento e l'uso della banda.</li>
              <li>Affidabilità: è possibile gestire richieste fallite e sincronizzazioni quando la connessione torna disponibile.</li>
              <li>Coinvolgimento dell'utente: opzionalmente, le notifiche push permettono di comunicare aggiornamenti importanti.</li>
            </ul>
            <p>
              L'implementazione tipica di una PWA prevede la definizione di un manifest con nome, icone e colori dell'applicazione, la registrazione di un service worker e la scelta di una strategia di caching adeguata (ad esempio cache-first o network-first). È importante selezionare con attenzione quali risorse rendere disponibili offline, privilegiando quelle statiche e fondamentali per l'interfaccia.
            </p>
            <hr class="border-secondary">
            <h5><em class="bi bi-brush text-success" aria-hidden="true"></em> anime.js libreria per animazioni</h5>
            <p>
              anime.js è una libreria JavaScript leggera che consente di creare animazioni fluide e controllate su elementi HTML, proprietà CSS, SVG e valori numerici. Offre un'API semplice ma flessibile, adatta sia a animazioni di base sia a sequenze più complesse.
            </p>
            <p>
              La libreria permette di definire animazioni in modo dichiarativo, specificando target, proprietà, durata ed easing, senza dover gestire manualmente keyframe complessi. Questo rende il codice più leggibile e facile da mantenere.
            </p>
            <p>
              Le funzionalità principali includono:
            </p>
            <ul>
              <li>Sintassi chiara e compatta per la definizione delle animazioni.</li>
              <li>Timeline per coordinare e sincronizzare più animazioni.</li>
              <li>Funzioni di easing personalizzabili per rendere i movimenti più naturali.</li>
              <li>Supporto a SVG e trasformazioni per interfacce moderne.</li>
              <li>Facile integrazione con framework come Vue e con il DOM standard.</li>
            </ul>
            <p>
              In un'applicazione web, anime.js viene utilizzata per migliorare l'usabilità e il feedback visivo, ad esempio animando transizioni tra viste, aperture di pannelli o cambiamenti di stato. Un uso moderato delle animazioni contribuisce a rendere l'interfaccia più chiara e intuitiva, senza distrarre l'utente.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: 'about' }
</script>
