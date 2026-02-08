<template>
  <div class="import-view slide-in">
    <h2 class="mb-4"><i class="bi bi-upload"></i> Importa Personaggio</h2>
    <div class="card">
      <div class="card-body">
        <div class="file-drop-zone"
             @dragover.prevent="dragover = true"
             @dragleave="dragover = false"
             @drop.prevent="handleDrop"
             :class="{ dragover: dragover }"
             @click="$refs.fileInput.click()">
          <i class="bi bi-cloud-upload display-4"></i>
          <h5>Trascina qui un file .plr o .json</h5>
          <p class="text-muted">oppure clicca per selezionare</p>
          <input type="file" ref="fileInput" @change="handleFileSelect" accept=".plr,.json" style="display: none">
        </div>

        <div class="row mt-3">
          <div class="col-md-6">
            <button class="btn btn-terraria w-100" @click="createEmptyPlayer">
              <i class="bi bi-plus-circle"></i> Crea Personaggio Vuoto
            </button>
          </div>
          <div class="col-md-6">
            <button class="btn btn-outline-light w-100" @click="loadDemoPlayer">
              <i class="bi bi-collection"></i> Carica personaggio di esempio
            </button>
          </div>
        </div>

        <div class="alert alert-danger mt-3" v-if="error">
          <i class="bi bi-exclamation-triangle"></i> {{ error }}
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
