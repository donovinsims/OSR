import { db } from '@/db';
import { votes } from '@/db/schema';

async function main() {
    const sampleVotes = [];
    const usedCombinations = new Set<string>();
    
    // Helper to generate random date in last 90 days
    const getRandomDate = () => {
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 90);
        const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        return date.toISOString();
    };
    
    // Weighted agent distribution (trending/featured get more votes)
    const trendingAgents = [1, 3, 5, 8, 12, 15, 18, 21]; // 8 trending agents
    const featuredAgents = [2, 4, 7, 10, 14, 17, 20, 23]; // 8 featured agents
    const regularAgents = [6, 9, 11, 13, 16, 19, 22, 24]; // 8 regular agents
    
    const getWeightedAgentId = () => {
        const rand = Math.random();
        if (rand < 0.5) {
            // 50% chance for trending agents
            return trendingAgents[Math.floor(Math.random() * trendingAgents.length)];
        } else if (rand < 0.8) {
            // 30% chance for featured agents
            return featuredAgents[Math.floor(Math.random() * featuredAgents.length)];
        } else {
            // 20% chance for regular agents
            return regularAgents[Math.floor(Math.random() * regularAgents.length)];
        }
    };
    
    let attempts = 0;
    const maxAttempts = 500;
    
    while (sampleVotes.length < 200 && attempts < maxAttempts) {
        attempts++;
        
        const agentId = getWeightedAgentId();
        const userNumber = Math.floor(Math.random() * 100) + 1;
        const userId = `user_${userNumber.toString().padStart(3, '0')}`;
        const combination = `${agentId}-${userId}`;
        
        // Ensure unique combination
        if (!usedCombinations.has(combination)) {
            usedCombinations.add(combination);
            sampleVotes.push({
                agentId,
                userId,
                value: 1,
                createdAt: getRandomDate(),
            });
        }
    }
    
    // Sort by createdAt for more realistic data insertion
    sampleVotes.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    await db.insert(votes).values(sampleVotes);
    
    console.log(`✅ Votes seeder completed successfully - inserted ${sampleVotes.length} votes`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});