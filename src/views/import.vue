<template>
  <div class="import-view slide-in">
    <h2 class="mb-4"><em class="bi bi-upload" aria-hidden="true"></em> Importa Personaggio</h2>
    <div class="card">
      <div class="card-body">
        <div class="file-drop-zone"
             @dragover.prevent="dragover = true"
             @dragleave="dragover = false"
             @drop.prevent="handleDrop"
             :class="{ dragover: dragover }"
             @click="$refs.fileInput.click()">
          <em class="bi bi-cloud-upload display-4" aria-hidden="true"></em>
          <h3>Trascina qui un file .plr o .json</h3>
          <p class="text-muted">oppure clicca per selezionare</p>
          <label for="file-input" class="visually-hidden">Seleziona file .plr o .json</label>
          <input id="file-input" type="file" ref="fileInput" @change="handleFileSelect" accept=".plr,.json" title="Seleziona un file .plr o .json" style="display: none">
        </div>

        <div class="row mt-3">
          <div class="col-md-6">
            <button class="btn btn-terraria w-100" @click="createEmptyPlayer">
              <em class="bi bi-plus-circle" aria-hidden="true"></em> Crea Personaggio Vuoto
            </button>
          </div>
          <div class="col-md-6">
            <button class="btn btn-outline-light w-100" @click="loadDemoPlayer">
              <em class="bi bi-collection" aria-hidden="true"></em> Carica personaggio di esempio
            </button>
          </div>
        </div>

        <div class="alert alert-danger mt-3" v-if="error">
          <em class="bi bi-exclamation-triangle" aria-hidden="true"></em> {{ error }}
        </div>

        <div class="text-center mt-3" v-if="loading">
          <div class="spinner-border text-warning" role="status">
            <span class="visually-hidden">Caricamento...</span>
          </div>
          <p class="mt-2">Parsing file in corso...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="../scripts/import.js"></script>
