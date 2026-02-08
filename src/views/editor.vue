<template>
  <div class="editor-view slide-in">
    <h2 class="mb-4"><i class="bi bi-pencil-square"></i> Editor Inventario</h2>
    
    <div class="card" v-if="!currentPlayer">
        <div class="card-body text-center py-5">
            <i class="bi bi-person-x display-1 text-muted"></i>
            <h4 class="mt-3">Nessun personaggio selezionato</h4>
            <p class="text-muted">Carica o crea un personaggio dalla pagina Inventario</p>
            <router-link to="/inventory" class="btn btn-terraria">
                <i class="bi bi-arrow-right"></i> Vai a Inventario
            </router-link>
        </div>
    </div>
    
    <div v-else>
        <div class="card mb-4">
            <div class="card-header">
                <i class="bi bi-person-gear"></i> Modifica Personaggio
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label">Nome</label>
                        <input type="text" class="form-control" v-model="editName" 
                                @blur="updatePlayerName">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">HP</label>
                        <input type="number" class="form-control" v-model.number="editHealth"
                                @blur="updateStats" min="0" max="500">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Max HP</label>
                        <input type="number" class="form-control" v-model.number="editMaxHealth"
                                @blur="updateStats" min="20" max="500">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Mana</label>
                        <input type="number" class="form-control" v-model.number="editMana"
                                @blur="updateStats" min="0" max="200">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Max Mana</label>
                        <input type="number" class="form-control" v-model.number="editMaxMana"
                                @blur="updateStats" min="20" max="200">
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row g-4">
            <div class="col-lg-8">
                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between">
                        <span><i class="bi bi-grid"></i> Seleziona Slot da Modificare</span>
                        <span class="badge bg-warning text-dark" v-if="selectedSlot">
                            Slot: {{ selectedSlot.type }} #{{ selectedSlot.index + 1 }}
                        </span>
                    </div>
                    <div class="card-body">
                        <h6 class="text-muted mb-2">Inventario Principale</h6>
                        <div class="inventory-grid mb-3">
                            <div v-for="(item, index) in currentPlayer.inventory" 
                                  :key="'inv-' + index"
                                  class="inventory-slot"
                                  :class="{ 
                                      empty: !item || item.itemId === 0,
                                      selected: isSlotSelected('inventory', index),
                                      hotbar: index < 10
                                  }"
                                  @click="selectSlot('inventory', index)">
                                <template v-if="item && item.itemId !== 0">
                                    <img :src="getItemSprite(item.itemId)" class="item-sprite" :alt="getItemName(item.itemId)">
                                    <span class="item-stack" v-if="item.stack > 1">{{ item.stack }}</span>
                                </template>
                                <template v-else>
                                    <span class="text-muted small">{{ index + 1 }}</span>
                                </template>
                            </div>
                        </div>
                        
                        <div class="row g-2 mt-3">
                            <div class="col-md-6">
                                <h6 class="text-muted">Armor</h6>
                                <div class="d-flex gap-2">
                                    <div v-for="(item, index) in currentPlayer.armor" :key="'armor-' + index"
                                          class="inventory-slot flex-grow-1"
                                          :class="{ selected: isSlotSelected('armor', index), empty: !item || item.itemId === 0 }"
                                          @click="selectSlot('armor', index)">
                                        <template v-if="item && item.itemId !== 0">
                                            <img :src="getItemSprite(item.itemId)" class="item-sprite" :alt="getItemName(item.itemId)">
                                        </template>
                                        <template v-else>
                                            <i class="bi bi-shield item-icon"></i>
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h6 class="text-muted">Accessori</h6>
                                <div class="d-flex gap-2 flex-wrap">
                                    <div v-for="(item, index) in currentPlayer.accessories" :key="'acc-' + index"
                                          class="inventory-slot"
                                          style="width: 50px; height: 50px;"
                                          :class="{ selected: isSlotSelected('accessories', index), empty: !item || item.itemId === 0 }"
                                          @click="selectSlot('accessories', index)">
                                        <template v-if="item && item.itemId !== 0">
                                            <img :src="getItemSprite(item.itemId)" class="item-sprite" style="max-width: 28px; max-height: 28px;">
                                        </template>
                                        <template v-else>
                                            <i class="bi bi-gem item-icon small"></i>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-4">
                <div class="card sticky-top" style="top: 20px;">
                    <div class="card-header">
                        <i class="bi bi-pencil"></i> 
                        {{ selectedSlot ? 'Modifica Item' : 'Aggiungi Item' }}
                    </div>
                    <div class="card-body">
                        <div v-if="selectedSlot">
                            <div class="alert alert-terraria mb-3" v-if="currentSlotItem && currentSlotItem.itemId">
                                <strong>Item corrente:</strong><br>
                                <span>{{ getItemName(currentSlotItem.itemId) }}</span>
                                <span v-if="currentSlotItem.stack > 1">(x{{ currentSlotItem.stack }})</span>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Cerca Item</label>
                                <input type="text" class="form-control" 
                                        v-model="itemSearch"
                                        @input="searchItems"
                                        placeholder="Nome item...">
                                
                                <div class="search-results mt-2" v-if="searchResults.length > 0">
                                    <div v-for="item in searchResults" :key="item.id"
                                          class="search-result-item"
                                          @click="selectSearchItem(item)">
                                        <img :src="getItemSprite(item.id)" class="search-item-sprite">
                                        <span>{{ item.name }}</span>
                                        <small class="text-muted ms-2">ID: {{ item.id }}</small>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Item ID</label>
                                <input type="number" class="form-control" 
                                        v-model.number="editItemId"
                                        min="0" max="5500">
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Quantità (Stack)</label>
                                <input type="number" class="form-control" 
                                        v-model.number="editStack"
                                        min="1" :max="getItemMaxStack(editItemId)">
                            </div>
                            
                            <div class="alert bg-dark mb-3 d-flex align-items-center gap-3" v-if="editItemId">
                                <img :src="getItemSprite(editItemId)" class="preview-sprite">
                                <div>
                                    <strong>{{ getItemName(editItemId) }}</strong><br>
                                    <span class="text-muted">x{{ editStack }}</span>
                                </div>
                            </div>
                            
                            <div class="d-grid gap-2">
                                <button class="btn btn-terraria" @click="saveItem">
                                    <i class="bi bi-check-circle"></i> Salva Modifiche
                                </button>
                                <button class="btn btn-outline-danger" @click="deleteItem" 
                                        v-if="currentSlotItem && currentSlotItem.itemId">
                                    <i class="bi bi-trash"></i> Elimina Item
                                </button>
                                <button class="btn btn-outline-secondary" @click="clearSelection">
                                    <i class="bi bi-x"></i> Annulla
                                </button>
                            </div>
                        </div>
                        
                        <div v-else class="text-center text-muted py-4">
                            <i class="bi bi-hand-index display-4"></i>
                            <p class="mt-2">Seleziona uno slot dalla griglia per modificarlo</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="alert mt-3" :class="saveStatus.type" v-if="saveStatus.message">
            <i :class="saveStatus.icon"></i> {{ saveStatus.message }}
        </div>
    </div>
  </div>
</template>

<script src="../scripts/editor.js"></script>