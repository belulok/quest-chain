#[test_only]
module questchain::questchain_tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use std::string;
    
    use questchain::questchain::{
        Self,
        Avatar,
        QuestPack,
        BossHP,
        LootChest,
        create_avatar,
        create_quest_pack,
        complete_quest,
        attack_boss,
        create_loot_chest,
        open_chest,
    };
    
    // Test addresses
    const ADMIN: address = @0xA;
    const PLAYER: address = @0xB;
    
    // Test constants
    const QUEST_XP_REWARD: u64 = 500;
    
    // Helper function to set up a test scenario
    fun setup_test(): Scenario {
        let scenario = ts::begin(ADMIN);
        {
            // Initialize the module
            ts::next_tx(&mut scenario, ADMIN);
        };
        scenario
    }
    
    #[test]
    fun test_create_avatar() {
        let scenario = setup_test();
        
        // Create an avatar
        ts::next_tx(&mut scenario, PLAYER);
        {
            let ctx = ts::ctx(&mut scenario);
            let avatar = create_avatar(
                string::utf8(b"TestAvatar"),
                string::utf8(b"https://example.com/avatar.png"),
                ctx
            );
            
            // Check avatar properties
            let (name, level, xp) = questchain::get_avatar_details(&avatar);
            assert!(name == string::utf8(b"TestAvatar"), 0);
            assert!(level == 1, 0);
            assert!(xp == 0, 0);
            
            // Transfer avatar to player
            ts::transfer(&mut scenario, avatar, PLAYER);
        };
        
        ts::end(scenario);
    }
    
    #[test]
    fun test_complete_quest() {
        let scenario = setup_test();
        
        // Create an avatar and a quest
        ts::next_tx(&mut scenario, PLAYER);
        {
            let ctx = ts::ctx(&mut scenario);
            
            // Create and transfer avatar
            let avatar = create_avatar(
                string::utf8(b"TestAvatar"),
                string::utf8(b"https://example.com/avatar.png"),
                ctx
            );
            ts::transfer(&mut scenario, avatar, PLAYER);
            
            // Create and transfer quest
            let quest = create_quest_pack(
                string::utf8(b"Test Quest"),
                string::utf8(b"A test quest"),
                1, // difficulty
                QUEST_XP_REWARD,
                ctx
            );
            ts::transfer(&mut scenario, quest, PLAYER);
        };
        
        // Complete the quest
        ts::next_tx(&mut scenario, PLAYER);
        {
            let avatar = ts::take_from_sender<Avatar>(&mut scenario);
            let quest = ts::take_from_sender<QuestPack>(&mut scenario);
            
            let ctx = ts::ctx(&mut scenario);
            complete_quest(&mut avatar, &mut quest, ctx);
            
            // Check that XP was awarded
            let (_, _, xp) = questchain::get_avatar_details(&avatar);
            assert!(xp == QUEST_XP_REWARD, 0);
            
            ts::return_to_sender(&mut scenario, avatar);
            ts::return_to_sender(&mut scenario, quest);
        };
        
        ts::end(scenario);
    }
    
    #[test]
    fun test_attack_boss() {
        let scenario = setup_test();
        
        // Create an avatar and a boss
        ts::next_tx(&mut scenario, ADMIN);
        {
            let ctx = ts::ctx(&mut scenario);
            
            // Create and share boss
            questchain::create_boss(
                string::utf8(b"Test Boss"),
                1000, // max_hp
                1,    // level
                ctx
            );
            
            // Create and transfer avatar
            let avatar = create_avatar(
                string::utf8(b"TestAvatar"),
                string::utf8(b"https://example.com/avatar.png"),
                ctx
            );
            ts::transfer(&mut scenario, avatar, PLAYER);
        };
        
        // Attack the boss
        ts::next_tx(&mut scenario, PLAYER);
        {
            let avatar = ts::take_from_sender<Avatar>(&mut scenario);
            let boss = ts::take_shared<BossHP>(&mut scenario);
            
            let ctx = ts::ctx(&mut scenario);
            attack_boss(&avatar, &mut boss, 10, ctx);
            
            // Check that boss HP was reduced
            let (_, current_hp, max_hp, _) = questchain::get_boss_details(&boss);
            assert!(current_hp == 990, 0); // 1000 - 10
            assert!(max_hp == 1000, 0);
            
            ts::return_to_sender(&mut scenario, avatar);
            ts::return_shared(boss);
        };
        
        ts::end(scenario);
    }
    
    #[test]
    fun test_open_chest() {
        let scenario = setup_test();
        
        // Create an avatar and a loot chest
        ts::next_tx(&mut scenario, PLAYER);
        {
            let ctx = ts::ctx(&mut scenario);
            
            // Create and transfer avatar
            let avatar = create_avatar(
                string::utf8(b"TestAvatar"),
                string::utf8(b"https://example.com/avatar.png"),
                ctx
            );
            ts::transfer(&mut scenario, avatar, PLAYER);
            
            // Create and transfer loot chest
            let chest = create_loot_chest(3, ctx); // rarity 3
            ts::transfer(&mut scenario, chest, PLAYER);
            
            // Create and transfer SUI coin
            let coin = coin::mint_for_testing<SUI>(1000, ctx);
            ts::transfer(&mut scenario, coin, PLAYER);
        };
        
        // Open the chest
        ts::next_tx(&mut scenario, PLAYER);
        {
            let avatar = ts::take_from_sender<Avatar>(&mut scenario);
            let chest = ts::take_from_sender<LootChest>(&mut scenario);
            let coin = ts::take_from_sender<Coin<SUI>>(&mut scenario);
            
            let ctx = ts::ctx(&mut scenario);
            open_chest(&mut chest, &mut avatar, &mut coin, ctx);
            
            // Check that XP was awarded (rarity 3 * 500 = 1500)
            let (_, _, xp) = questchain::get_avatar_details(&avatar);
            assert!(xp == 1500, 0);
            
            ts::return_to_sender(&mut scenario, avatar);
            ts::return_to_sender(&mut scenario, chest);
            ts::return_to_sender(&mut scenario, coin);
        };
        
        ts::end(scenario);
    }
}
