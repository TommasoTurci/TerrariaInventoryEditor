<template>
  <div class="home-view slide-in">
    <div class="text-center mb-5">
      <div>
        <img src="/assets/TIE_Title.png" alt="Terraria Inventory Editor" class="img-fluid title-image mb-3" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <h1 class="display-4 mb-3" style="display:none;">Terraria Inventory Editor</h1>
      </div>
      <p class="lead text-muted">
        Gestisci, modifica e personalizza l'inventario del tuo personaggio Terraria
      </p>
    </div>

    <div class="row g-4 mb-5 justify-content-center">
      <div class="col-md-6">
        <div class="card h-100 mx-auto">
          <div class="card-body text-center">
            <i class="bi bi-upload display-4 text-info mb-3"></i>
            <h5 class="card-title">Importa Personaggio</h5>
            <p class="card-text text-muted">
              Carica un file .plr di Terraria o importa da JSON
            </p>
            <router-link to="/import" class="btn btn-terraria">
              <i class="bi bi-arrow-right"></i> Vai all'Importazione
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="card" v-if="players.length > 0">
      <div class="card-header">
        <i class="bi bi-people"></i> Personaggi Salvati
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4" v-for="player in players" :key="player.id">
            <div class="card bg-dark">
              <div class="card-body">
                <h6 class="card-title">
                  <i class="bi bi-person-circle text-warning"></i>
                  {{ player.name }}
                </h6>
                <small class="text-muted">
                  HP: {{ player.health }}/{{ player.maxHealth }} | 
                  Mana: {{ player.mana }}/{{ player.maxMana }}
                </small>
                <div class="mt-2">
                  <button class="btn btn-sm btn-outline-light me-1" @click="selectPlayer(player.id)">
                    <i class="bi bi-eye"></i> Visualizza
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deletePlayer(player.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="../scripts/home.js"></script>
