export const TerrariaPlayerParser = {
    ENCRYPTION_KEY: "h3y_gUyZ",
    MIN_VERSION: 230,
    MAX_VERSION: 350,
    
    async decryptPlayerFile(encryptedData) {
        try {
            // "h3y_gUyZ" in UTF-16LE
            const keyAndIv = new Uint8Array([
                0x68, 0x00, 0x33, 0x00, 0x79, 0x00, 0x5F, 0x00,
                0x67, 0x00, 0x55, 0x00, 0x79, 0x00, 0x5A, 0x00
            ]);
            
            const aesKey = await crypto.subtle.importKey(
                "raw",
                keyAndIv,
                { name: "AES-CBC" },
                false,
                ["decrypt"]
            );
            
            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-CBC", iv: keyAndIv },
                aesKey,
                encryptedData
            );
            
            return new Uint8Array(decrypted);
        } catch (error) {
            throw new Error("Incorrect file/damaged .plr file.");
        }
    },
    
    createBinaryReader(buffer) {
        return {
            buffer: buffer,
            position: 0,
            
            readByte() {
                return this.buffer[this.position++];
            },
            
            readBytes(count) {
                const bytes = this.buffer.slice(this.position, this.position + count);
                this.position += count;
                return bytes;
            },
            
            readBool() {
                return this.readByte() !== 0;
            },
            
            readInt16() {
                const low = this.buffer[this.position++];
                const high = this.buffer[this.position++];
                let value = (high << 8) | low;
                if (value >= 0x8000) value -= 0x10000;
                return value;
            },
            
            readUInt16() {
                const low = this.buffer[this.position++];
                const high = this.buffer[this.position++];
                return (high << 8) | low;
            },
            
            readInt32() {
                const b1 = this.buffer[this.position++];
                const b2 = this.buffer[this.position++];
                const b3 = this.buffer[this.position++];
                const b4 = this.buffer[this.position++];
                return (b4 << 24) | (b3 << 16) | (b2 << 8) | b1;
            },
            
            readUInt32() {
                const b1 = this.buffer[this.position++];
                const b2 = this.buffer[this.position++];
                const b3 = this.buffer[this.position++];
                const b4 = this.buffer[this.position++];
                return ((b4 << 24) | (b3 << 16) | (b2 << 8) | b1) >>> 0;
            },
            
            readSingle() {
                const bytes = this.readBytes(4);
                const view = new DataView(new ArrayBuffer(4));
                bytes.forEach((b, i) => view.setUint8(i, b));
                return view.getFloat32(0, true);
            },
            
            readString() {
                let length = 0;
                let shift = 0;
                let byte;
                do {
                    byte = this.readByte();
                    length |= (byte & 0x7F) << shift;
                    shift += 7;
                } while (byte & 0x80);
                
                if (length === 0) return "";
                
                const bytes = this.readBytes(length);
                return new TextDecoder('utf-8').decode(bytes);
            },
            
            readColor() {
                return {
                    r: this.readByte(),
                    g: this.readByte(),
                    b: this.readByte()
                };
            },
            
            skip(count) {
                this.position += count;
            }
        };
    },
    
    async parsePlayerFile(arrayBuffer) {
        try {
            const data = new Uint8Array(arrayBuffer);
            
            let decryptedData;
            try {
                decryptedData = await this.decryptPlayerFile(data);
            } catch (e) {
                throw new Error("Incorrect file/damaged .plr file.");
            }
            
            const reader = this.createBinaryReader(decryptedData);
            
            // Header: [Version 4][Magic "relogic" 7][Type 1][Revision 4][Favorite 8] = 24 bytes
            const fileVersion = reader.readInt32();
            
            if (fileVersion < 1 || fileVersion > 500) {
                throw new Error(`Incorrect file version.`);
            }
            
            // Skip: "relogic"(7) + type(1) + revision(4) + favorite(8) = 20 bytes
            reader.skip(20);
            
            return this.parsePlayerData(reader, fileVersion);
            
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },
    
    parsePlayerData(reader, fileVersion) {
        const player = createEmptyPlayerData();
        player.version = fileVersion;
        
        try {
            player.name = reader.readString();
            
            if (fileVersion >= 230) {
                player.difficulty = reader.readByte();
            }
            
            if (fileVersion >= 225) {
                reader.skip(8); // Playtime Int64
            }
            
            player.hair = reader.readInt32();
            
            if (fileVersion >= 82) {
                reader.readByte(); // Hair dye
            }
            
            if (fileVersion >= 124) {
                player.hideVisuals = reader.readInt32();
            }
            
            if (fileVersion >= 112) {
                player.skinVariant = reader.readByte();
            }
            
            player.health = reader.readInt32();
            player.maxHealth = reader.readInt32();
            player.mana = reader.readInt32();
            player.maxMana = reader.readInt32();
            
            if (fileVersion >= 125) {
                reader.readBool(); // Extra accessory
            }
            
            if (fileVersion >= 225) {
                reader.readBool(); // DD2
            }
            
            if (fileVersion >= 229) {
                reader.readBool(); // Biome torches
            }
            
            if (fileVersion >= 239) {
                reader.readBool(); // Super cart unlocked
                reader.readBool(); // Enabled super cart
            }
            
            if (fileVersion >= 259) {
                reader.readBool(); // Used Aether
            }
            
            // Colors
            player.hairColor = reader.readColor();
            player.skinColor = reader.readColor();
            player.eyeColor = reader.readColor();
            player.shirtColor = reader.readColor();
            player.undershirtColor = reader.readColor();
            player.pantsColor = reader.readColor();
            player.shoeColor = reader.readColor();
            
            // Mystery data
            reader.skip(17);
            
            // Equipment (5 bytes each)
            for (let i = 0; i < 3; i++) {
                player.armor[i] = this.readEquipmentSlot(reader);
            }
            
            const accessoryCount = fileVersion >= 258 ? 7 : (fileVersion >= 124 ? 6 : 5);
            for (let i = 0; i < accessoryCount; i++) {
                player.accessories[i] = this.readEquipmentSlot(reader);
            }
            
            for (let i = 0; i < 3; i++) {
                player.vanityArmor[i] = this.readEquipmentSlot(reader);
            }
            
            for (let i = 0; i < accessoryCount; i++) {
                player.vanityAccessories[i] = this.readEquipmentSlot(reader);
            }
            
            const dyeCount = 3 + accessoryCount;
            for (let i = 0; i < dyeCount; i++) {
                player.dyes[i] = this.readEquipmentSlot(reader);
            }
            
            // Inventory (10 bytes each)
            for (let i = 0; i < 50; i++) {
                player.inventory[i] = this.readInventorySlot(reader);
            }
            
            // Coins
            for (let i = 0; i < 4; i++) {
                const coin = this.readInventorySlot(reader);
                if (coin.itemId === 71) player.coins.copper = coin.stack;
                else if (coin.itemId === 72) player.coins.silver = coin.stack;
                else if (coin.itemId === 73) player.coins.gold = coin.stack;
                else if (coin.itemId === 74) player.coins.platinum = coin.stack;
            }
            
            // Ammo
            for (let i = 0; i < 4; i++) {
                this.readInventorySlot(reader);
            }
            
            // Trash
            player.trash = this.readInventorySlot(reader);
            
            // Piggy Bank
            for (let i = 0; i < 40; i++) {
                player.piggyBank[i] = this.readInventorySlot(reader);
            }
            
            // Safe
            for (let i = 0; i < 40; i++) {
                player.safe[i] = this.readInventorySlot(reader);
            }
            
        } catch (e) {
            // Return what we got so far
        }
        
        return player;
    },
    
    /**
     * Read equipment slot (5 bytes)
     */
    readEquipmentSlot(reader) {
        const itemId = reader.readInt32();
        const prefix = reader.readByte();
        return { itemId, stack: 1, prefix };
    },
    
    /**
     * Read inventory slot (10 bytes)
     */
    readInventorySlot(reader) {
        const itemId = reader.readInt32();
        const stack = reader.readInt32();
        const prefix = reader.readByte();
        const favorite = reader.readByte();
        return { itemId, stack, prefix, favorite };
    },
    
    /**
     * Validate file
     */
    isValidPlayerFile(arrayBuffer) {
        try {
            const data = new Uint8Array(arrayBuffer);
            return data.length >= 32;
        } catch {
            return false;
        }
    },
    
    exportToJSON(player) {
        return JSON.stringify(player, null, 2);
    },
    
    importFromJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (!data.name || !data.inventory || !Array.isArray(data.inventory)) {
                throw new Error("Formato JSON non valido");
            }
            const player = createEmptyPlayerData();
            return { ...player, ...data };
        } catch (error) {
            throw new Error(`Errore nel parsing JSON: ${error.message}`);
        }
    }
};

// attach to window for legacy compatibility
if (typeof window !== 'undefined') {
    window.TerrariaPlayerParser = TerrariaPlayerParser;
}

export default TerrariaPlayerParser;
