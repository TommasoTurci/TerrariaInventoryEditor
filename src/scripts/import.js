import StorageManager, { createEmptyPlayerData } from '../utils/storage'
import { TerrariaPlayerParser } from '../utils/parser'

export default {
  name: 'import',
  data() {
    return { loading: false, error: null, dragover: false }
  },
  methods: {
    handleDrop(e) { this.dragover = false; const files = e.dataTransfer.files; if (files.length > 0) this.processFile(files[0]) },
    handleFileSelect(e) { const files = e.target.files; if (files.length > 0) this.processFile(files[0]) },
    async processFile(file) {
      this.loading = true; this.error = null
      try {
        const extension = file.name.split('.').pop().toLowerCase()
        if (extension === 'json') {
          const text = await file.text()
          const playerData = TerrariaPlayerParser.importFromJSON(text)
          this.saveAndRedirect(playerData)
        } else if (extension === 'plr') {
          const buffer = await file.arrayBuffer()
          if (!TerrariaPlayerParser.isValidPlayerFile(buffer)) throw new Error('File .plr non valido o versione non supportata')
          const playerData = await TerrariaPlayerParser.parsePlayerFile(buffer)
          this.saveAndRedirect(playerData)
        } else {
          throw new Error('Formato file non supportato. Usa .plr o .json')
        }
      } catch (err) {
        console.error('Import error:', err)
        this.error = err.message
      } finally { this.loading = false }
    },
    saveAndRedirect(playerData) {
      const saved = StorageManager.createPlayer(playerData)
      if (saved) {
        StorageManager.setCurrentPlayer(saved.id)
        this.$router.push('/inventory')
      } else {
        this.error = 'Errore nel salvataggio del personaggio'
      }
    },
    createEmptyPlayer() { const player = createEmptyPlayerData(); player.name = 'Nuovo Personaggio'; this.saveAndRedirect(player) },
    loadDemoPlayer() { const demo = createEmptyPlayerData(); demo.name = 'Personaggio di esempio'; demo.health = 400; demo.maxHealth = 400; demo.mana = 200; demo.maxMana = 200; demo.inventory[0] = { itemId: 4956, stack: 1, prefix: 16 }; this.saveAndRedirect(demo) }
  }
}
