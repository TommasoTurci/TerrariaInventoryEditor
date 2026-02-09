<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-terraria">
      <div class="container">
        <router-link class="navbar-brand" to="/">Terraria Inventory Editor</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><router-link class="nav-link" to="/">Home</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/guide">Guida</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/about">Info</router-link></li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container py-4">
        <router-view />
        <div v-if="showInstall" class="position-fixed bottom-0 end-0 m-3">
          <button class="btn btn-terraria" @click="promptInstall">Installa App</button>
        </div>
        <div v-if="updateAvailable" class="position-fixed top-0 start-50 translate-middle-x mt-3" style="z-index:1050">
          <div class="alert alert-warning d-flex align-items-center mb-0" role="alert">
            <div class="me-3">Nuova versione disponibile</div>
            <div>
              <button class="btn btn-sm btn-primary me-2" @click="applyUpdate">Aggiorna</button>
              <button class="btn btn-sm btn-secondary" @click="dismissUpdate">Chiudi</button>
            </div>
          </div>
        </div>
    </main>

    <footer class="footer bg-dark text-light py-3 mt-auto">
      <div class="container text-center">
            <p class="mb-0">
              <em class="bi bi-controller" aria-hidden="true"></em> Terraria Inventory Editor
            </p>
          <small class="text-muted">Versione supportata: Terraria 1.4.5</small>
      </div>
    </footer> 

    <div class="modal fade" id="confirmModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmModalTitle">Conferma</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="confirmModalBody"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
            <button type="button" class="btn btn-danger" id="confirmModalOk">Conferma</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="alertModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h5 class="modal-title" id="alertModalTitle">Avviso</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="alertModalBody"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-terraria" data-bs-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      deferredPrompt: null,
      showInstall: false,
      updateAvailable: false,
      swRegistration: null
    }
  },
  mounted() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstall = true;
    });

    window.addEventListener('swUpdated', (e) => {
      this.updateAvailable = true;
      this.swRegistration = e.detail;
    });
  },
  methods: {
    promptInstall() {
      if (!this.deferredPrompt) return;
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then(() => {
        this.deferredPrompt = null;
        this.showInstall = false;
      });
    },
    applyUpdate() {
      if (!this.swRegistration) return;
      this.swRegistration.waiting && this.swRegistration.waiting.postMessage('SKIP_WAITING');
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    },
    dismissUpdate() {
      this.updateAvailable = false;
    }
  }
}
</script>
