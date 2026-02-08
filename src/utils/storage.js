export function createEmptyPlayerData() {
    return {
        id: Date.now().toString(),
        name: 'New Player',
        version: 279,
        difficulty: 0,
        hair: 0,
        hideVisuals: 0,
        skinVariant: 0,
        health: 100,
        maxHealth: 100,
        mana: 20,
        maxMana: 20,
        hairColor: { r: 100, g: 80, b: 60 },
        skinColor: { r: 255, g: 220, b: 180 },
        eyeColor: { r: 50, g: 80, b: 120 },
        shirtColor: { r: 175, g: 165, b: 140 },
        undershirtColor: { r: 160, g: 180, b: 200 },
        pantsColor: { r: 255, g: 230, b: 175 },
        shoeColor: { r: 160, g: 105, b: 60 },
        armor: Array(3).fill(null).map(() => ({ itemId: 0, stack: 1, prefix: 0 })),
        accessories: Array(7).fill(null).map(() => ({ itemId: 0, stack: 1, prefix: 0 })),
        vanityArmor: Array(3).fill(null).map(() => ({ itemId: 0, stack: 1, prefix: 0 })),
        vanityAccessories: Array(7).fill(null).map(() => ({ itemId: 0, stack: 1, prefix: 0 })),
        dyes: Array(10).fill(null).map(() => ({ itemId: 0, stack: 1, prefix: 0 })),
        inventory: Array(50).fill(null).map(() => ({ itemId: 0, stack: 0, prefix: 0, favorite: 0 })),
        coins: { copper: 0, silver: 0, gold: 0, platinum: 0 },
        trash: { itemId: 0, stack: 0, prefix: 0, favorite: 0 },
        piggyBank: Array(40).fill(null).map(() => ({ itemId: 0, stack: 0, prefix: 0, favorite: 0 })),
        safe: Array(40).fill(null).map(() => ({ itemId: 0, stack: 0, prefix: 0, favorite: 0 }))
    };
}

export const StorageManager = {
    STORAGE_KEY: 'terraria_inventory_editor',
    PLAYERS_KEY: 'terraria_players',
    SETTINGS_KEY: 'terraria_settings',
    
    initialize() {
        if (!this.hasData()) {
            this.saveData(this.getDefaultData());
        }
    },
    
    hasData() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    },
    
    hasPlayers() {
        const data = this.getAllPlayers();
        return data && data.length > 0;
    },
    
    getDefaultData() {
        return {
            currentPlayerId: null,
            players: [],
            lastModified: new Date().toISOString()
        };
    },
    
    saveData(data) {
        try {
            data.lastModified = new Date().toISOString();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Errore nel salvataggio:', error);
            return false;
        }
    },
    
    loadData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
            return this.getDefaultData();
        } catch (error) {
            console.error('Errore nel caricamento:', error);
            return this.getDefaultData();
        }
    },
    
    createPlayer(playerData) {
        const data = this.loadData();
        
        const id = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const newPlayer = {
            ...playerData,
            id: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        data.players.push(newPlayer);
        data.currentPlayerId = id;
        
        if (this.saveData(data)) {
            return newPlayer;
        }
        return null;
    },
    
    getAllPlayers() {
        const data = this.loadData();
        return data.players || [];
    },
    
    getPlayerById(id) {
        const data = this.loadData();
        return data.players.find(p => p.id === id) || null;
    },
    
    getCurrentPlayer() {
        const data = this.loadData();
        if (data.currentPlayerId) {
            return data.players.find(p => p.id === data.currentPlayerId) || null;
        }
        return null;
    },
    
    updatePlayer(id, updates) {
        const data = this.loadData();
        const index = data.players.findIndex(p => p.id === id);
        
        if (index !== -1) {
            data.players[index] = {
                ...data.players[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            
            if (this.saveData(data)) {
                return data.players[index];
            }
        }
        return null;
    },
    
    updateInventoryItem(playerId, slotIndex, itemData) {
        const player = this.getPlayerById(playerId);
        if (!player) return null;
        
        if (slotIndex >= 0 && slotIndex < player.inventory.length) {
            player.inventory[slotIndex] = {
                itemId: itemData.itemId || 0,
                stack: itemData.stack || 0,
                prefix: itemData.prefix || 0
            };
            
            return this.updatePlayer(playerId, { inventory: player.inventory });
        }
        return null;
    },
    
    updateEquipmentSlot(playerId, slotType, slotIndex, itemData) {
        const player = this.getPlayerById(playerId);
        if (!player) return null;
        
        const validSlotTypes = ['armor', 'accessories', 'vanityArmor', 'vanityAccessories', 'dyes', 'piggyBank', 'safe'];
        
        if (!validSlotTypes.includes(slotType)) return null;
        
        if (player[slotType] && slotIndex >= 0 && slotIndex < player[slotType].length) {
            player[slotType][slotIndex] = {
                itemId: itemData.itemId || 0,
                stack: itemData.stack || 0,
                prefix: itemData.prefix || 0
            };
            
            return this.updatePlayer(playerId, { [slotType]: player[slotType] });
        }
        return null;
    },
    
    updatePlayerStats(playerId, stats) {
        const validStats = ['health', 'maxHealth', 'mana', 'maxMana', 'name', 'difficulty'];
        const updates = {};
        
        for (const key of validStats) {
            if (stats[key] !== undefined) {
                updates[key] = stats[key];
            }
        }
        
        return this.updatePlayer(playerId, updates);
    },

    deletePlayer(id) {
        const data = this.loadData();
        const index = data.players.findIndex(p => p.id === id);
        
        if (index !== -1) {
            data.players.splice(index, 1);
            
            if (data.currentPlayerId === id) {
                data.currentPlayerId = data.players.length > 0 ? data.players[0].id : null;
            }
            
            return this.saveData(data);
        }
        return false;
    },
    
    deleteInventoryItem(playerId, slotIndex) {
        return this.updateInventoryItem(playerId, slotIndex, { itemId: 0, stack: 0, prefix: 0 });
    },
    
    setCurrentPlayer(id) {
        const data = this.loadData();
        if (data.players.some(p => p.id === id)) {
            data.currentPlayerId = id;
            return this.saveData(data);
        }
        return false;
    },
    
    exportAllData() {
        return JSON.stringify(this.loadData(), null, 2);
    },
    
    exportPlayer(id) {
        const player = this.getPlayerById(id);
        if (player) {
            return JSON.stringify(player, null, 2);
        }
        return null;
    },
    
    importData(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            
            if (imported.name && imported.inventory) {
                return this.createPlayer(imported);
            }
            
            if (imported.players && Array.isArray(imported.players)) {
                const currentData = this.loadData();
                
                for (const player of imported.players) {
                    const existingIndex = currentData.players.findIndex(p => p.id === player.id);
                    if (existingIndex >= 0) {
                        currentData.players[existingIndex] = { ...player, updatedAt: new Date().toISOString() };
                    } else {
                        currentData.players.push({ ...player, createdAt: new Date().toISOString() });
                    }
                }
                
                return this.saveData(currentData);
            }
            
            throw new Error('Formato dati non riconosciuto');
        } catch (error) {
            console.error('Errore importazione:', error);
            throw error;
        }
    },
    
    clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.initialize();
    },
    
    getStorageStats() {
        const data = this.loadData();
        const jsonSize = JSON.stringify(data).length;
        
        return {
            playerCount: data.players.length,
            currentPlayerId: data.currentPlayerId,
            lastModified: data.lastModified,
            storageUsed: this.formatBytes(jsonSize),
            storageUsedBytes: jsonSize
        };
    },
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

StorageManager.initialize();
if (typeof window !== 'undefined') {
    window.createEmptyPlayerData = createEmptyPlayerData;
    window.StorageManager = StorageManager;
}

export default StorageManager;
