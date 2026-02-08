import StorageManager from '../utils/storage'
import { getItemById, searchItems } from '../data/items-database'

export default {
    name: 'editor',
    data() {
        return {
            currentPlayer: null,
            selectedSlot: null,
            itemSearch: '',
            searchResults: [],
            editItemId: 0,
            editStack: 1,
            editPrefix: 0,
            editName: '',
            editHealth: 100,
            editMaxHealth: 100,
            editMana: 20,
            editMaxMana: 20,
            saveStatus: { message: '', type: '', icon: '' }
        }
    },
    computed: {
        currentSlotItem() {
            if (!this.selectedSlot || !this.currentPlayer) return null
            const arr = this.currentPlayer[this.selectedSlot.type]
            return arr ? arr[this.selectedSlot.index] : null
        }
    },
    mounted() {
        this.loadCurrentPlayer()

        const urlParams = new URLSearchParams(window.location.search)
        const slot = urlParams.get('slot')
        if (slot) {
            const [type, index] = slot.split('-')
            if (type && index !== undefined) {
                this.selectSlot(type, parseInt(index))
            }
        }
    },
    methods: {
        loadCurrentPlayer() {
            this.currentPlayer = StorageManager.getCurrentPlayer()
            if (this.currentPlayer) {
                this.editName = this.currentPlayer.name
                this.editHealth = this.currentPlayer.health
                this.editMaxHealth = this.currentPlayer.maxHealth
                this.editMana = this.currentPlayer.mana
                this.editMaxMana = this.currentPlayer.maxMana
            }
        },

        selectSlot(type, index) {
            this.selectedSlot = { type, index }
            const item = this.currentPlayer[type]?.[index]
            if (item) {
                this.editItemId = item.itemId || 0
                this.editStack = item.stack || 1
                this.editPrefix = item.prefix || 0
            } else {
                this.editItemId = 0
                this.editStack = 1
                this.editPrefix = 0
            }
            this.itemSearch = ''
            this.searchResults = []
            requestAnimationFrame(() => {
                try {
                    const el = document.querySelector(`.inventory-slot.selected`);
                    if (el && typeof window.anime === 'function') {
                        window.anime({ targets: el, scale: [1.05, 1], duration: 250, easing: 'easeOutExpo' });
                    }
                } catch (e) {}
            });
        },

        isSlotSelected(type, index) {
            return this.selectedSlot &&
                         this.selectedSlot.type === type &&
                         this.selectedSlot.index === index
        },

        searchItems() {
            if (this.itemSearch.length < 2) {
                this.searchResults = []
                return
            }
            this.searchResults = searchItems(this.itemSearch)
            this.$nextTick(() => {
                try {
                    const nodes = document.querySelectorAll('.search-result-item');
                    if (nodes.length && typeof window.anime === 'function') {
                        window.anime.remove(nodes);
                        window.anime({
                            targets: nodes,
                            opacity: [0, 1],
                            translateX: [20, 0],
                            delay: window.anime.stagger(40),
                            duration: 350,
                            easing: 'easeOutCubic'
                        });
                    }
                } catch (e) {}
            });
        },

        selectSearchItem(item) {
            this.editItemId = item.id
            this.editStack = 1
            this.itemSearch = item.name
            this.searchResults = []
        },

        saveItem() {
            if (!this.selectedSlot || !this.currentPlayer) return

            const itemData = {
                itemId: this.editItemId || 0,
                stack: this.editStack || 1,
                prefix: this.editPrefix || 0
            }

            let result
            if (this.selectedSlot.type === 'inventory') {
                result = StorageManager.updateInventoryItem(
                    this.currentPlayer.id,
                    this.selectedSlot.index,
                    itemData
                )
            } else {
                result = StorageManager.updateEquipmentSlot(
                    this.currentPlayer.id,
                    this.selectedSlot.type,
                    this.selectedSlot.index,
                    itemData
                )
            }

            if (result) {
                this.showSaveStatus('Item salvato con successo!', 'alert-success', 'bi bi-check-circle')
                this.loadCurrentPlayer()
            } else {
                this.showSaveStatus('Errore nel salvataggio', 'alert-danger', 'bi bi-x-circle')
            }
        },

        deleteItem() {
            if (!this.selectedSlot) return

            this.editItemId = 0
            this.editStack = 0
            this.editPrefix = 0
            this.saveItem()
        },

        clearSelection() {
            this.selectedSlot = null
            this.editItemId = 0
            this.editStack = 1
            this.editPrefix = 0
            this.itemSearch = ''
            this.searchResults = []
        },

        updatePlayerName() {
            if (this.currentPlayer && this.editName) {
                StorageManager.updatePlayerStats(this.currentPlayer.id, { name: this.editName })
                this.loadCurrentPlayer()
                this.showSaveStatus('Nome aggiornato', 'alert-success', 'bi bi-check-circle')
            }
        },

        updateStats() {
            if (this.currentPlayer) {
                StorageManager.updatePlayerStats(this.currentPlayer.id, {
                    health: this.editHealth,
                    maxHealth: this.editMaxHealth,
                    mana: this.editMana,
                    maxMana: this.editMaxMana
                })
                this.loadCurrentPlayer()
                this.showSaveStatus('Statistiche aggiornate', 'alert-success', 'bi bi-check-circle')
            }
        },

        getItemName(id) {
            if (!id) return '(vuoto)'
            return getItemById(id).name
        },

        getItemSprite(id) {
            if (!id) return ''
            return `/assets/items/Item_${id}.png`
        },

        getItemMaxStack(id) {
            if (!id) return 9999
            return 9999
        },

        showSaveStatus(message, type, icon) {
            this.saveStatus = { message, type, icon }
            setTimeout(() => {
                this.saveStatus = { message: '', type: '', icon: '' }
            }, 3000)
        }
    }
}
