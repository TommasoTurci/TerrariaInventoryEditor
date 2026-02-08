<template>
  <div class="guide-view slide-in">
    <div class="row">
      <div class="col-lg-10 mx-auto">
        <h2 class="mb-4"><i class="bi bi-book"></i> Guida all'Uso</h2>
        <div class="accordion" id="guideAccordion">
          <div class="accordion-item bg-dark">
            <h2 class="accordion-header">
              <button class="accordion-button bg-dark text-light" type="button" 
                      data-bs-toggle="collapse" data-bs-target="#collapseStart">
                <i class="bi bi-1-circle me-2"></i> Iniziare
              </button>
            </h2>
            <div id="collapseStart" class="accordion-collapse collapse show" data-bs-parent="#guideAccordion">
              <div class="accordion-body">
                <h6 class="text-light">Come iniziare ad usare l'editor:</h6>
                <ol class="text-light">
                  <li><strong>Importa un personaggio</strong> - Puoi caricare un file <code>.plr</code> direttamente da Terraria oppure creare un personaggio vuoto.</li>
                  <li><strong>Trova il tuo file .plr</strong> - Su Windows, i file dei personaggi si trovano in: <code>Documenti/My Games/Terraria/Players/</code></li>
                  <li><strong>Trascina e rilascia</strong> - Puoi trascinare il file direttamente nella zona di upload.</li>
                </ol>
                <div class="alert alert-terraria text-light">
                  <i class="bi bi-lightbulb"></i>
                  <strong>Suggerimento:</strong> Fai sempre un backup del tuo file .plr prima di modificarlo!
                </div>
              </div>
            </div>
          </div>

          <div class="accordion-item bg-dark">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseView">
                <i class="bi bi-2-circle me-2"></i> Visualizzare l'Inventario
              </button>
            </h2>
            <div id="collapseView" class="accordion-collapse collapse" data-bs-parent="#guideAccordion">
              <div class="accordion-body">
                <p class="text-light">La vista <strong>Inventario</strong> mostra tutti i dati del personaggio:</p>
                <ul class="text-light">
                  <li><strong>Statistiche</strong> - HP, Mana, nome e difficoltà</li>
                  <li><strong>Equipaggiamento</strong> - Armor e accessori equipaggiati</li>
                  <li><strong>Storage</strong> - Piggy Bank e Safe</li>
                </ul>
                <p class="text-light">Clicca su un oggetto per vederne i dettagli.</p>
              </div>
            </div>
          </div>

          <div class="accordion-item bg-dark">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEdit">
                <i class="bi bi-3-circle me-2"></i> Modificare gli oggetti
              </button>
            </h2>
            <div id="collapseEdit" class="accordion-collapse collapse" data-bs-parent="#guideAccordion">
              <div class="accordion-body">
                <h6 class="text-light">Cosa puoi fare con il tuo inventario:</h6>
                <ul class="text-light">
                  <li><strong>Aggiungere nuovi oggetti</strong> - Cerca qualsiasi oggetto nel database e aggiungilo a uno slot vuoto.</li>
                  <li><strong>Modificare quantità</strong> - Cambia lo stack di qualsiasi oggetto impilabile.</li>
                  <li><strong>Sostituire oggetti</strong> - Seleziona uno slot e scegli un nuovo oggetto dal database.</li>
                  <li><strong>Rimuovere oggetti</strong> - Svuota qualsiasi slot che non ti serve più.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="card mt-4">
          <div class="card-header"><i class="bi bi-keyboard"></i> Riferimento Rapido</div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6 class="text-light">Slot Inventario:</h6>
                <ul class="small text-light">
                  <li>Slot 1-10: Hotbar</li>
                  <li>Slot 11-50: Inventario principale</li>
                  <li>Coins: 4 slot dedicati</li>
                  <li>Ammo: 4 slot dedicati</li>
                </ul>
              </div>
              <div class="col-md-6">
                <h6 class="text-light">Equipaggiamento:</h6>
                <ul class="small text-light">
                  <li>Armor: 3 slot (head, chest, legs)</li>
                  <li>Accessories: fino a 7 slot</li>
                  <li>Vanity: mirror degli slot sopra</li>
                  <li>Dyes: colorazione equipment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="../scripts/guide.js"></script>
