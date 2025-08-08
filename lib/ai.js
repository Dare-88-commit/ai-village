import * as tf from '@tensorflow/tfjs';
import { load as loadQnAModel } from '@tensorflow-models/qna';
import qaData from '../public/curriculum-qa.json';

const RESPONSE_CACHE_KEY = 'ai-response-cache';
let model = null;
let modelLoading = false;

// Pre-process context data
const CONTEXT_DATA = qaData
    .map(item => `${item.question}: ${item.answer}`)
    .join('\n\n');

// Cache management functions
function getCache() {
    try {
        const cache = localStorage.getItem(RESPONSE_CACHE_KEY);
        return cache ? JSON.parse(cache) : {};
    } catch (error) {
        console.error("Cache read error:", error);
        return {};
    }
}

function saveCache(cache) {
    try {
        localStorage.setItem(RESPONSE_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error("Cache write error:", error);
    }
}

export async function initializeModel() {
    if (!model && !modelLoading) {
        modelLoading = true;
        try {
            await tf.ready();
            model = await loadQnAModel();
            console.log("AI model loaded successfully");
        } catch (err) {
            console.error("Model initialization failed:", err);
            throw err;
        } finally {
            modelLoading = false;
        }
    }
    return model;
}

export async function getAIAnswer(question) {
    // Check cache first
    const cache = getCache();
    const cacheKey = question.toLowerCase().trim();

    if (cache[cacheKey]) {
        console.log("Returning cached response");
        return cache[cacheKey];
    }

    try {
        // Ensure model is loaded
        if (!model) {
            await initializeModel();
        }

        // Generate focused context
        const questionKeywords = question.toLowerCase().split(/\s+/)
            .filter(word => word.length > 3);

        const relevantContext = qaData
            .filter(item =>
                questionKeywords.some(keyword =>
                    item.question.toLowerCase().includes(keyword) ||
                    item.answer.toLowerCase().includes(keyword)
                )
            )
            .map(item => `${item.question}: ${item.answer}`)
            .join('\n\n') || CONTEXT_DATA;

        const answers = await model.findAnswers(question, relevantContext);
        const bestAnswer = answers?.[0]?.text ||
            "I couldn't find a precise answer in my knowledge base. Could you try rephrasing?";

        // Cache the response
        cache[cacheKey] = bestAnswer;
        saveCache(cache);

        return bestAnswer;

    } catch (error) {
        console.error("AI processing error:", error);
        throw new Error("I'm having trouble accessing my advanced knowledge right now");
    }
}

// Background initialization
if (typeof window !== 'undefined') {
    initializeModel().catch(err =>
        console.warn("Background model loading failed:", err)
    );
}