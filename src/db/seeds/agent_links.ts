import { db } from '@/db';
import { agentLinks } from '@/db/schema';

async function main() {
    const sampleAgentLinks = [
        // Agent 1 links
        {
            agentId: 1,
            label: 'Documentation',
            url: 'https://docs.aiagent-01.io',
        },
        {
            agentId: 1,
            label: 'GitHub Repository',
            url: 'https://github.com/ai-agents/agent-01',
        },
        {
            agentId: 1,
            label: 'Try Demo',
            url: 'https://demo.aiagent-01.io',
        },
        {
            agentId: 1,
            label: 'API Reference',
            url: 'https://api-docs.aiagent-01.io',
        },
        
        // Agent 2 links
        {
            agentId: 2,
            label: 'Documentation',
            url: 'https://docs.agent-hub.com/agent-02',
        },
        {
            agentId: 2,
            label: 'GitHub Repository',
            url: 'https://github.com/agenthub/agent-02',
        },
        {
            agentId: 2,
            label: 'Try Demo',
            url: 'https://demo.agent-hub.com/agent-02',
        },
        
        // Agent 3 links
        {
            agentId: 3,
            label: 'Documentation',
            url: 'https://aitools.dev/agent-03/docs',
        },
        {
            agentId: 3,
            label: 'GitHub Repository',
            url: 'https://github.com/aitools-dev/agent-03',
        },
        {
            agentId: 3,
            label: 'API Reference',
            url: 'https://aitools.dev/agent-03/api',
        },
        
        // Agent 4 links
        {
            agentId: 4,
            label: 'Documentation',
            url: 'https://docs.smartagent04.io',
        },
        {
            agentId: 4,
            label: 'Try Demo',
            url: 'https://try.smartagent04.io',
        },
        {
            agentId: 4,
            label: 'API Reference',
            url: 'https://api.smartagent04.io/docs',
        },
        
        // Agent 5 links
        {
            agentId: 5,
            label: 'Documentation',
            url: 'https://agent05.readme.io',
        },
        {
            agentId: 5,
            label: 'GitHub Repository',
            url: 'https://github.com/opensource-ai/agent-05',
        },
        {
            agentId: 5,
            label: 'Try Demo',
            url: 'https://playground.agent05.dev',
        },
        {
            agentId: 5,
            label: 'API Reference',
            url: 'https://agent05.readme.io/reference',
        },
        
        // Agent 6 links
        {
            agentId: 6,
            label: 'Documentation',
            url: 'https://docs.nextagent.ai/v6',
        },
        {
            agentId: 6,
            label: 'GitHub Repository',
            url: 'https://github.com/nextagent/agent-v6',
        },
        {
            agentId: 6,
            label: 'Try Demo',
            url: 'https://demo.nextagent.ai/v6',
        },
        
        // Agent 7 links
        {
            agentId: 7,
            label: 'Documentation',
            url: 'https://agent07.gitbook.io',
        },
        {
            agentId: 7,
            label: 'GitHub Repository',
            url: 'https://github.com/cognitive-ai/agent-07',
        },
        {
            agentId: 7,
            label: 'API Reference',
            url: 'https://api-reference.agent07.dev',
        },
        
        // Agent 8 links
        {
            agentId: 8,
            label: 'Documentation',
            url: 'https://learn.agent08.io',
        },
        {
            agentId: 8,
            label: 'Try Demo',
            url: 'https://app.agent08.io/demo',
        },
        {
            agentId: 8,
            label: 'API Reference',
            url: 'https://developers.agent08.io/api',
        },
        
        // Agent 9 links
        {
            agentId: 9,
            label: 'Documentation',
            url: 'https://docs.agent-nine.com',
        },
        {
            agentId: 9,
            label: 'GitHub Repository',
            url: 'https://github.com/agent-nine/core',
        },
        {
            agentId: 9,
            label: 'Try Demo',
            url: 'https://demo.agent-nine.com',
        },
        {
            agentId: 9,
            label: 'API Reference',
            url: 'https://api.agent-nine.com/reference',
        },
        
        // Agent 10 links
        {
            agentId: 10,
            label: 'Documentation',
            url: 'https://guide.agent10.dev',
        },
        {
            agentId: 10,
            label: 'GitHub Repository',
            url: 'https://github.com/ai-collective/agent-10',
        },
        {
            agentId: 10,
            label: 'Try Demo',
            url: 'https://sandbox.agent10.dev',
        },
        
        // Agent 11 links
        {
            agentId: 11,
            label: 'Documentation',
            url: 'https://docs.elevenagent.io',
        },
        {
            agentId: 11,
            label: 'GitHub Repository',
            url: 'https://github.com/elevenagent/platform',
        },
        {
            agentId: 11,
            label: 'API Reference',
            url: 'https://developers.elevenagent.io',
        },
        
        // Agent 12 links
        {
            agentId: 12,
            label: 'Documentation',
            url: 'https://docs.agent12.ai',
        },
        {
            agentId: 12,
            label: 'GitHub Repository',
            url: 'https://github.com/agent12-ai/framework',
        },
        {
            agentId: 12,
            label: 'Try Demo',
            url: 'https://try.agent12.ai',
        },
        {
            agentId: 12,
            label: 'API Reference',
            url: 'https://api-docs.agent12.ai',
        },
    ];

    await db.insert(agentLinks).values(sampleAgentLinks);
    
    console.log('✅ Agent links seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});