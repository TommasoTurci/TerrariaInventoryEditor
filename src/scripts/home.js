import StorageManager from '../utils/storage'
import { showConfirm } from '../utils/modals'

export default {
  name: 'home',
  data() {
    return { players: [] }
  },
  mounted() {
    this.loadPlayers()
  },
  methods: {
    loadPlayers() {
      this.players = StorageManager.getAllPlayers()
    },
    selectPlayer(id) {
      StorageManager.setCurrentPlayer(id)
      this.$router.push('/inventory')
    },
    async deletePlayer(id) {
      const ok = await showConfirm('Sei sicuro di voler eliminare questo personaggio?', 'Conferma eliminazione')
      if (ok) {
        StorageManager.deletePlayer(id)
        this.loadPlayers()
      }
    }
  }
}
