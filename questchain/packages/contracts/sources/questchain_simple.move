module questchain::questchain_simple {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::coin::{Coin};
    use sui::sui::SUI;
    use std::string::{Self, String};
    use std::vector;
    
    // ======== Constants ========
    
    const XP_PER_LEVEL: u64 = 1000;
    const EQuestAlreadyCompleted: u64 = 3;
    const EBossDefeated: u64 = 5;
    const EInvalidLevel: u64 = 0;
    
    // ======== Objects ========
    
    /// Avatar NFT representing the player
    struct Avatar has key, store {
        id: UID,
        name: String,
        level: u64,
        xp: u64,
        quests_completed: vector<ID>,
        image_url: String,
    }
    
    /// Quest Pack containing challenges
    struct QuestPack has key, store {
        id: UID,
        name: String,
        description: String,
        difficulty: u64, // 1-5
        xp_reward: u64,
        completed: bool,
    }
    
    /// Boss HP tracker for raid battles
    struct BossHP has key {
        id: UID,
        name: String,
        current_hp: u64,
        max_hp: u64,
        level: u64,
        rewards_claimed: vector<address>,
    }
    
    /// Loot chest that can be opened for rewards
    struct LootChest has key, store {
        id: UID,
        rarity: u64, // 1-5 (common to legendary)
        opened: bool,
    }
    
    // ======== Events ========
    
    /// Emitted when a new avatar is created
    struct AvatarCreated has copy, drop {
        avatar_id: ID,
        owner: address,
        name: String,
    }
    
    /// Emitted when an avatar gains XP
    struct XPGained has copy, drop {
        avatar_id: ID,
        xp_gained: u64,
        new_total_xp: u64,
    }
    
    /// Emitted when an avatar levels up
    struct LevelUp has copy, drop {
        avatar_id: ID,
        new_level: u64,
    }
    
    /// Emitted when a quest is completed
    struct QuestCompleted has copy, drop {
        avatar_id: ID,
        quest_id: ID,
        xp_reward: u64,
    }
    
    /// Create a new avatar
    public fun create_avatar(
        name: String,
        image_url: String,
        ctx: &mut TxContext
    ): Avatar {
        let avatar_id = object::new(ctx);
        let avatar = Avatar {
            id: avatar_id,
            name,
            level: 1,
            xp: 0,
            quests_completed: vector::empty(),
            image_url,
        };
        
        let avatar_created = AvatarCreated {
            avatar_id: object::uid_to_inner(&avatar.id),
            owner: tx_context::sender(ctx),
            name: avatar.name,
        };
        event::emit(avatar_created);
        
        avatar
    }
    
    /// Mint and transfer a new avatar to the sender
    public entry fun mint_avatar(
        name: String,
        image_url: String,
        ctx: &mut TxContext
    ) {
        let avatar = create_avatar(name, image_url, ctx);
        transfer::transfer(avatar, tx_context::sender(ctx));
    }
    
    /// Create a new quest pack
    public fun create_quest_pack(
        name: String,
        description: String,
        difficulty: u64,
        xp_reward: u64,
        ctx: &mut TxContext
    ): QuestPack {
        assert!(difficulty >= 1 && difficulty <= 5, EInvalidLevel);
        
        QuestPack {
            id: object::new(ctx),
            name,
            description,
            difficulty,
            xp_reward,
            completed: false,
        }
    }
    
    /// Complete a quest and gain XP
    public entry fun complete_quest(
        avatar: &mut Avatar,
        quest: &mut QuestPack,
        _ctx: &mut TxContext
    ) {
        // Check if quest is already completed
        assert!(!quest.completed, EQuestAlreadyCompleted);
        
        // Mark quest as completed
        quest.completed = true;
        
        // Add quest ID to completed quests
        vector::push_back(&mut avatar.quests_completed, object::uid_to_inner(&quest.id));
        
        // Award XP
        let xp_gained = quest.xp_reward;
        avatar.xp = avatar.xp + xp_gained;
        
        // Check for level up
        let new_level = (avatar.xp / XP_PER_LEVEL) + 1;
        if (new_level > avatar.level) {
            avatar.level = new_level;
        }
    }
    
    /// Create a boss for raid battles
    public fun create_boss(
        name: String,
        max_hp: u64,
        level: u64,
        ctx: &mut TxContext
    ) {
        let boss = BossHP {
            id: object::new(ctx),
            name,
            current_hp: max_hp,
            max_hp,
            level,
            rewards_claimed: vector::empty(),
        };
        
        transfer::share_object(boss);
    }
    
    /// Attack a boss and deal damage
    public entry fun attack_boss(
        avatar: &Avatar,
        boss: &mut BossHP,
        damage: u64,
        ctx: &mut TxContext
    ) {
        // Check if boss is already defeated
        assert!(boss.current_hp > 0, EBossDefeated);
        
        // Calculate damage based on avatar level (prevent cheating)
        let max_damage = avatar.level * 10;
        let actual_damage = if (damage > max_damage) { max_damage } else { damage };
        
        // Apply damage
        if (actual_damage >= boss.current_hp) {
            boss.current_hp = 0;
            
            // Create loot chest for the player
            let loot_chest = LootChest {
                id: object::new(ctx),
                rarity: avatar.level / 20 + 1, // 1-5 based on level
                opened: false,
            };
            
            transfer::transfer(loot_chest, tx_context::sender(ctx));
            
            // Add player to rewards claimed list
            vector::push_back(&mut boss.rewards_claimed, tx_context::sender(ctx));
        } else {
            boss.current_hp = boss.current_hp - actual_damage;
        }
    }
    
    /// Create a loot chest
    public fun create_loot_chest(
        rarity: u64,
        ctx: &mut TxContext
    ): LootChest {
        assert!(rarity >= 1 && rarity <= 5, EInvalidLevel);
        
        LootChest {
            id: object::new(ctx),
            rarity,
            opened: false,
        }
    }
    
    /// Open a loot chest and get rewards
    public entry fun open_chest(
        chest: &mut LootChest,
        avatar: &mut Avatar,
        _payment: &mut Coin<SUI>,
        _ctx: &mut TxContext
    ) {
        // Check if chest is already opened
        assert!(!chest.opened, EQuestAlreadyCompleted);
        
        // Mark chest as opened
        chest.opened = true;
        
        // Calculate XP reward based on rarity
        let xp_reward = chest.rarity * 500;
        
        // Award XP
        avatar.xp = avatar.xp + xp_reward;
        
        // Check for level up
        let new_level = (avatar.xp / XP_PER_LEVEL) + 1;
        if (new_level > avatar.level) {
            avatar.level = new_level;
        }
    }
    
    // ======== View Functions ========
    
    /// Get avatar details
    public fun get_avatar_details(avatar: &Avatar): (String, u64, u64) {
        (avatar.name, avatar.level, avatar.xp)
    }
    
    /// Get boss details
    public fun get_boss_details(boss: &BossHP): (String, u64, u64, u64) {
        (boss.name, boss.current_hp, boss.max_hp, boss.level)
    }
    
    /// Check if avatar has completed a quest
    public fun has_completed_quest(avatar: &Avatar, quest_id: ID): bool {
        vector::contains(&avatar.quests_completed, &quest_id)
    }
}
