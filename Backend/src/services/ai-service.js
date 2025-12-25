const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAGj9Gsy3uYu4avXWJ5VqnAhvfYJ6EYnyE';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

exports.analyzeSyllabus = async (justification, proposedChanges) => {
    try {
        const prompt = `
        You are an academic expert for Computer Science curriculum. Analyze this proposed syllabus update.
        
        Justification provided: "${justification}"
        Proposed Changes: "${JSON.stringify(proposedChanges)}"

        Task:
        1. Determine if this update is relevant to current industry trends (2025).
        2. Assign a Relevance Score (0-100).
        3. Provide a 1-sentence reason.

        Output ONLY valid JSON format:
        {
            "score": number,
            "reason": "string"
        }
        `;

        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`AI API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;

        // Clean up markdown code blocks if present
        const jsonStr = textResponse.replace(/^```json\n|\n```$/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("AI Service Error:", error.message);
        // Fallback mock if AI fails
        return { score: 75, reason: "AI Service unavailable, defaulting to standard alignment score." };
    }
};
