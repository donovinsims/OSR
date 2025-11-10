import { db } from '@/db';
import { comments } from '@/db/schema';

async function main() {
    const now = new Date();
    const fortyFiveDaysAgo = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);

    const getRandomDate = () => {
        const timestamp = fortyFiveDaysAgo.getTime() + Math.random() * (now.getTime() - fortyFiveDaysAgo.getTime());
        return new Date(timestamp).toISOString();
    };

    const getRandomAgentId = () => Math.floor(Math.random() * 15) + 1;
    const getRandomUserId = () => `user_${String(Math.floor(Math.random() * 30) + 1).padStart(3, '0')}`;

    const commentBodies = [
        "This agent looks promising! Does it support multi-language processing?",
        "Great work on this! I've been using it for a week and it's incredibly helpful.",
        "How does this compare to other similar agents in terms of performance?",
        "Thank you for creating this! It saved me hours of work.",
        "Is there documentation available for the API integration?",
        "I'm having trouble with the setup. Any tips for beginners?",
        "Absolutely love the interface! Very intuitive and user-friendly.",
        "Does this work with the latest version of the framework?",
        "Can this agent handle batch processing or is it single-request only?",
        "Impressive results! What's the accuracy rate on complex queries?",
        "Would be great if you could add export functionality in the next update.",
        "This is exactly what I needed for my project. Thank you!",
        "How frequently is this agent updated with new features?",
        "The demo is fantastic! Planning to implement this in production soon.",
        "Are there any rate limits or usage restrictions I should know about?",
        "Really appreciate the detailed examples in the documentation.",
        "Can I use this for commercial projects or is it personal use only?",
        "The response time is incredible! Much faster than alternatives I've tried.",
        "Is there a community forum or Discord where users can share tips?",
        "This agent exceeded my expectations. Highly recommended!",
        "What's the best way to handle error scenarios with this agent?",
        "Love the clean code structure. Makes it easy to customize.",
        "Does this integrate well with existing CI/CD pipelines?",
        "Thank you for the quick bug fix in the latest release!",
        "How scalable is this for enterprise-level applications?",
        "The tutorial videos were super helpful for getting started.",
        "Can this agent be run offline or does it require internet connectivity?",
        "Fantastic tool! Already seeing productivity improvements in my workflow.",
        "What security measures are in place for handling sensitive data?",
        "Is there a roadmap for upcoming features? Would love to see what's planned.",
        "This solved a major pain point for our team. Much appreciated!",
        "How do I contribute to the project? I'd love to help improve it.",
        "The pricing model is very reasonable compared to competitors.",
        "Does this support webhooks for real-time notifications?",
        "Excellent agent! The accuracy on edge cases is particularly impressive.",
        "Are there any performance benchmarks available for comparison?",
        "Thank you for making this open source. The community will benefit greatly.",
        "Can multiple users access this simultaneously without conflicts?",
        "The mobile responsiveness is perfect. Works great on all devices.",
        "What's the recommended hardware specs for optimal performance?",
        "This is a game-changer for our workflow automation. Amazing work!",
        "How does this handle concurrent requests at high volume?",
        "Love the customization options. Very flexible for different use cases.",
        "Is there enterprise support available for production deployments?",
        "The changelog is well-maintained. Easy to track improvements over time.",
        "Can this be containerized with Docker for easier deployment?",
        "Phenomenal results with minimal configuration. Very impressed!",
        "What's the average response time under typical load conditions?",
        "Thank you for the comprehensive API documentation. Very thorough!",
        "Does this work with both REST and GraphQL APIs?",
        "This agent has become an essential part of our daily operations.",
        "Are there any known compatibility issues with certain environments?",
        "The community around this agent is very supportive and active.",
        "How often should we expect major version updates?",
        "Can I run this in a serverless environment like AWS Lambda?",
        "The UI updates in the latest version are a huge improvement!",
        "What's the best practice for handling authentication with this agent?",
        "This has dramatically reduced our development time. Truly valuable!",
        "Is there a plugin system for extending functionality?",
        "Thank you for being so responsive to user feedback and suggestions!"
    ];

    const sampleComments = [];
    const commentIds = [];

    // Generate all 60 comments
    for (let i = 0; i < 60; i++) {
        const commentId = i + 1;
        commentIds.push(commentId);

        const isReply = Math.random() < 0.2 && commentIds.length > 1;
        const parentId = isReply ? commentIds[Math.floor(Math.random() * (commentIds.length - 1))] : null;

        sampleComments.push({
            agentId: getRandomAgentId(),
            userId: getRandomUserId(),
            body: commentBodies[i % commentBodies.length],
            parentId: parentId,
            createdAt: getRandomDate(),
        });
    }

    // Sort by createdAt to maintain chronological order
    sampleComments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    await db.insert(comments).values(sampleComments);
    
    console.log('✅ Comments seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});