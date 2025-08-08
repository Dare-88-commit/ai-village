import qaData from '../public/curriculum-qa.json';
import { getAIAnswer } from './ai';

// Pre-process questions for better matching
const processedData = qaData.map(item => ({
    ...item,
    keywords: [
        ...new Set([
            ...item.question.toLowerCase().split(/\W+/),
            ...item.answer.toLowerCase().split(/\W+/)
        ])
    ].filter(word => word.length > 3) // Ignore short words
}));

export async function getAnswer(question) {
    const cleanQuestion = question.toLowerCase().trim();

    // 1. Remove common question prefixes
    const baseQuestion = cleanQuestion
        .replace(/^(what|how|why|when|where|name|explain|define|tell me about|what are|give me)\s+/i, '')
        .replace(/\?/g, '')
        .trim();

    // 2. Exact match (including original and base question)
    const exactMatch = processedData.find(item =>
        item.question.toLowerCase() === cleanQuestion ||
        item.question.toLowerCase() === baseQuestion
    );
    if (exactMatch) return exactMatch.answer;

    // 3. Similarity-based matching
    const questionWords = new Set(baseQuestion.split(/\W+/).filter(w => w.length > 3));

    const scoredMatches = processedData.map(item => {
        // Count matching keywords
        const keywordMatches = item.keywords.filter(kw =>
            questionWords.has(kw) || baseQuestion.includes(kw)
        ).length;

        // Check for partial matches
        const partialQuestionMatch = item.question.toLowerCase().includes(baseQuestion) ? 1 : 0;
        const partialAnswerMatch = item.answer.toLowerCase().includes(baseQuestion) ? 1 : 0;

        return {
            ...item,
            score: keywordMatches + partialQuestionMatch + partialAnswerMatch
        };
    }).filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

    if (scoredMatches.length > 0 && scoredMatches[0].score >= 2) {
        return scoredMatches[0].answer;
    }

    // 4. Fallback to AI with context
    try {
        const context = processedData
            .filter(item => item.keywords.some(kw => baseQuestion.includes(kw)))
            .map(item => `${item.question}: ${item.answer}`)
            .join('\n');

        return await getAIAnswer(question, context || "General science knowledge");
    } catch (error) {
        console.error("AI failed:", error);

        // 5. Contextual fallback suggestions
        const relatedQuestions = scoredMatches.length > 0
            ? scoredMatches.slice(0, 3).map(m => m.question)
            : processedData
                .filter(item => item.keywords.some(kw => kw.length > 5 && baseQuestion.includes(kw)))
                .slice(0, 3)
                .map(item => item.question);

        return relatedQuestions.length > 0
            ? `I can answer questions about: ${relatedQuestions.join(', ')}`
            : "I'm not sure about that. Try asking about chemistry, physics, or biology topics.";
    }
}