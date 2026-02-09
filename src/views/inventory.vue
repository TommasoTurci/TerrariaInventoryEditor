<template>
  <div class="inventory-view slide-in">
    <div class="d-flex align-items-center mb-3">
      <h2 class="mb-0 me-3"><em class="bi bi-grid-3x3" aria-hidden="true"></em> Visualizza Inventario</h2>
      <router-link to="/editor" class="btn btn-terraria ms-auto">
        <em class="bi bi-pencil-square" aria-hidden="true"></em> Apri Editor
      </router-link>
    </div>

      <div class="card mb-4" v-if="!currentPlayer">
      <div class="card-header">
        <em class="bi bi-upload" aria-hidden="true"></em> Carica Personaggio
      </div>
      <div class="card-body">
        <div class="file-drop-zone" 
             @dragover.prevent="dragover = true"
             @dragleave="dragover = false"
             @drop.prevent="handleDrop"
             :class="{ dragover: dragover }"
             @click="$refs.fileInput.click()">
          <em class="bi bi-cloud-upload" aria-hidden="true"></em>
          <h3>Trascina qui un file .plr o .json</h3>
          <p class="text-muted mb-0">oppure clicca per selezionare</p>
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

      <div v-if="currentPlayer">
      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>
            <em class="bi bi-person-circle" aria-hidden="true"></em> 
            {{ currentPlayer.name }}
          </span>
          <div>
            <button class="btn btn-sm btn-outline-light me-2" @click="exportPlayer">
              <em class="bi bi-download" aria-hidden="true"></em> Esporta JSON
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="player-stats mb-4">
            <div class="stat-card health">
              <div class="stat-value">{{ currentPlayer.health }}/{{ currentPlayer.maxHealth }}</div>
              <div class="stat-label"><em class="bi bi-heart-fill" aria-hidden="true"></em> Vita</div>
            </div>
            <div class="stat-card mana">
              <div class="stat-value">{{ currentPlayer.mana }}/{{ currentPlayer.maxMana }}</div>
              <div class="stat-label"><em class="bi bi-droplet-fill" aria-hidden="true"></em> Mana</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ getDifficultyName(currentPlayer.difficulty) }}</div>
              <div class="stat-label"><em class="bi bi-speedometer" aria-hidden="true"></em> Difficoltà</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ countItems }}</div>
              <div class="stat-label"><em class="bi bi-box" aria-hidden="true"></em> Items</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header">
          <em class="bi bi-grid" aria-hidden="true"></em> Inventario Principale (50 slot)
        </div>
        <div class="card-body">
          <div class="inventory-grid">
            <div v-for="(item, index) in currentPlayer.inventory" 
                 :key="'inv-' + index"
                 class="inventory-slot"
                 :class="{ empty: !item || item.itemId === 0, selected: selectedSlot === 'inv-' + index, hotbar: index < 10 }"
                 @click="selectItem('inv', index, item)"
                 :title="getItemTooltip(item)">
              <template v-if="item && item.itemId !== 0">
                <img :src="getItemSprite(item.itemId)" class="item-sprite" :alt="getItemName(item.itemId)">
                <span class="item-name">{{ getItemName(item.itemId) }}</span>
                <span class="item-stack" v-if="item.stack > 1">{{ item.stack }}</span>
              </template>
              <template v-else>
                <span class="text-muted small">{{ index + 1 }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header">
              <em class="bi bi-shield" aria-hidden="true"></em> Armor & Accessori
            </div>
            <div class="card-body">
              <h4 class="text-warning border-bottom pb-2">Armor</h4>
              <div v-for="(item, index) in currentPlayer.armor" :key="'armor-' + index" class="equipment-slot" @click="selectItem('armor', index, item)">
                <span class="slot-label">{{ ['Helmet', 'Chestplate', 'Leggings'][index] }}</span>
                <span class="slot-item">{{ item && item.itemId ? getItemName(item.itemId) : '(vuoto)' }}</span>
              </div>
              <h4 class="text-warning border-bottom pb-2 mt-3">Accessori</h4>
              <div v-for="(item, index) in currentPlayer.accessories" :key="'acc-' + index" class="equipment-slot" @click="selectItem('accessories', index, item)">
                <span class="slot-label">Slot {{ index + 1 }}</span>
                <span class="slot-item">{{ item && item.itemId ? getItemName(item.itemId) : '(vuoto)' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header"><em class="bi bi-info-circle" aria-hidden="true"></em> Dettagli Item</div>
            <div class="card-body">
              <div v-if="selectedItem && selectedItem.itemId">
                <div class="d-flex align-items-center gap-3 mb-3">
                  <img :src="getItemSprite(selectedItem.itemId)" class="preview-sprite" :alt="getItemName(selectedItem.itemId)">
                  <h5 class="mb-0">{{ getItemName(selectedItem.itemId) }}</h5>
                </div>
                <hr class="border-secondary">
                <p><strong>ID:</strong> {{ selectedItem.itemId }}</p>
                <p><strong>Stack:</strong> {{ selectedItem.stack }} / {{ getItemMaxStack(selectedItem.itemId) }}</p>
                <p><strong>Posizione:</strong> {{ selectedSlot }}</p>
                <router-link :to="'/editor?slot=' + selectedSlot" class="btn btn-terraria mt-2">
                  <em class="bi bi-pencil" aria-hidden="true"></em> Modifica nell'Editor
                </router-link>
              </div>
              <div v-else class="text-center text-muted py-5">
                <em class="bi bi-hand-index display-4" aria-hidden="true"></em>
                <p class="mt-2">Seleziona un item per vedere i dettagli</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card mt-4" v-if="currentPlayer.piggyBank">
        <div class="card-header" data-bs-toggle="collapse" data-bs-target="#piggyBankCollapse" style="cursor: pointer;">
          <em class="bi bi-piggy-bank" aria-hidden="true"></em> Piggy Bank (40 slot)
          <em class="bi bi-chevron-down float-end" aria-hidden="true"></em>
        </div>
        <div id="piggyBankCollapse" class="collapse">
          <div class="card-body">
            <div class="inventory-grid" style="grid-template-columns: repeat(10, 1fr);">
              <div v-for="(item, index) in currentPlayer.piggyBank" :key="'piggy-' + index" class="inventory-slot" :class="{ empty: !item || item.itemId === 0 }" @click="selectItem('piggyBank', index, item)">
                <template v-if="item && item.itemId !== 0">
                  <img :src="getItemSprite(item.itemId)" class="item-sprite" :alt="getItemName(item.itemId)">
                  <span class="item-stack" v-if="item.stack > 1">{{ item.stack }}</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="../scripts/inventory.js"></script>
