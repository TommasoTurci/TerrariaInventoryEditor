import StorageManager, { createEmptyPlayerData } from '../utils/storage'
import { getItemById } from '../data/items-database'
import { TerrariaPlayerParser } from '../utils/parser'

export default {
  name: 'inventory',
  data() {
    return {
      currentPlayer: null,
      selectedItem: null,
      selectedSlot: null,
      loading: false,
      error: null,
      dragover: false
    }
  },
  computed: {
    countItems() {
      if (!this.currentPlayer || !this.currentPlayer.inventory) return 0
      return this.currentPlayer.inventory.filter(i => i && i.itemId !== 0).length
    }
  },
  mounted() {
    this.loadCurrentPlayer()
  },
  methods: {
    loadCurrentPlayer() { this.currentPlayer = StorageManager.getCurrentPlayer() },
    handleDrop(e) { this.dragover = false; const files = e.dataTransfer.files; if (files.length > 0) this.processFile(files[0]) },
    handleFileSelect(e) { const files = e.target.files; if (files.length > 0) this.processFile(files[0]) },
    async processFile(file) {
      this.loading = true; this.error = null
      try {
        const extension = file.name.split('.').pop().toLowerCase()
        if (extension === 'json') {
          const text = await file.text()
          const playerData = TerrariaPlayerParser.importFromJSON(text)
          this.saveAndLoadPlayer(playerData)
        } else if (extension === 'plr') {
          const buffer = await file.arrayBuffer()
          if (!TerrariaPlayerParser.isValidPlayerFile(buffer)) throw new Error('File .plr non valido o versione non supportata')
          const playerData = await TerrariaPlayerParser.parsePlayerFile(buffer)
          this.saveAndLoadPlayer(playerData)
        } else {
          throw new Error('Formato file non supportato. Usa .plr o .json')
        }
      } catch (err) {
        console.error('File processing error:', err)
        this.error = err.message
      } finally { this.loading = false }
    },
    saveAndLoadPlayer(playerData) {
      const saved = StorageManager.createPlayer(playerData)
      if (saved) this.currentPlayer = saved
      else throw new Error('Errore nel salvataggio del personaggio')
    },
    createEmptyPlayer() { const player = createEmptyPlayerData(); player.name = 'Nuovo Personaggio'; this.saveAndLoadPlayer(player) },
    loadDemoPlayer() { const demo = createEmptyPlayerData(); demo.name = 'Personaggio di esempio'; demo.health = 400; demo.maxHealth = 400; demo.mana = 200; demo.maxMana = 200; demo.inventory[0] = { itemId: 4956, stack: 1, prefix: 16 }; this.saveAndLoadPlayer(demo) },
    selectItem(type, index, item) { this.selectedSlot = type + '-' + index; this.selectedItem = item },
    getItemName(id) { if (!id) return '(vuoto)'; return getItemById(id).name },
    getItemTooltip(item) { if (!item || !item.itemId) return 'Slot vuoto'; const name = this.getItemName(item.itemId); return name + (item.stack > 1 ? ` (x${item.stack})` : '') },
    getItemSprite(id) { if (!id) return ''; return `/assets/items/Item_${id}.png` },
    getItemMaxStack(id) { return 9999 },
    getDifficultyName(diff) { const names = ['Classic', 'Mediumcore', 'Hardcore', 'Journey']; return names[diff] || 'Unknown' },
    exportPlayer() {
      if (!this.currentPlayer) return
      const json = StorageManager.exportPlayer(this.currentPlayer.id)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${this.currentPlayer.name.replace(/[^a-z0-9]/gi, '_')}_inventory.json`
      a.click()
      URL.revokeObjectURL(url)
    },
    closePlayer() { this.currentPlayer = null; this.selectedItem = null; this.selectedSlot = null }
  }
}
