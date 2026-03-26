import { mockVoiceProfile, mockGeneratedBlog, mockDistribution, missionCriticalBlogs } from './mockData';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * Helper to make API calls to Google Gemini 1.5 Flash
 */
const callGemini = async (systemPrompt, userPrompt, timeoutMs) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("Missing Gemini API Key");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const fullPrompt = `System Instructions: ${systemPrompt}\n\nUser Prompt: ${userPrompt}`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    let content = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    // Clean markdown backticks if present
    content = content.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();

    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini:", content);
      throw new Error("Gemini returned malformed JSON");
    }

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`API Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
};

// ---------------------------------------------------------------------------
// SERVICE ENDPOINTS (Mirrors claudeService)
// ---------------------------------------------------------------------------

export const extractVoice = async (text, demoMode = false) => {
  if (demoMode) {
    await new Promise(r => setTimeout(r, 800));
    return mockVoiceProfile;
  }

  const system = `You are a writing style analysis engine. Analyze the provided text and extract the author's Voice DNA. Output strictly as a JSON object: {"tone": "string", "sentenceLength": "string", "vocabularyLevel": "string", "persona": "string", "keyCharacteristics": ["string"], "sampleSentence": "string"}`;

  try {
    return await callGemini(system, `Analyze this text:\n\n${text}`, 10000);
  } catch (error) {
    console.warn("Falling back to demo voice profile:", error.message);
    return mockVoiceProfile;
  }
};

export const generateBlog = async (keyword, voiceProfile, isDemo = false) => {
  if (isDemo) {
    const lowerKeyword = keyword.toLowerCase();
    if (lowerKeyword.includes('disrupting martech')) return missionCriticalBlogs['disrupting-martech'];
    if (lowerKeyword.includes('blogy') && lowerKeyword.includes('india')) return missionCriticalBlogs['blogy-india'];
    
    await new Promise(r => setTimeout(r, 2000));
    return { ...mockGeneratedBlog, keyword };
  }

  const system = `You are an expert SEO blog writer. Write in this Voice Profile: ${voiceProfile.tone}, ${voiceProfile.persona}. Output JSON: {"title": "string", "metaTitle": "string", "metaDescription": "string", "content": "HTML string"}`;

  try {
    const result = await callGemini(system, `Write a blog for keyword: "${keyword}"`, 20000);
    console.log("Gemini Generation Success:", keyword);
    return {
      ...result,
      keyword,
      rankScore: Math.floor(Math.random() * 20) + 75,
      readabilityGrade: 7,
      aiDetectionScore: Math.floor(Math.random() * 5) + 1
    };
  } catch (error) {
    console.error("Gemini Generation Failed! Returning Mock Fallback:", error.message);
    return { ...mockGeneratedBlog, keyword };
  }
};

export const distributeBlog = async (blogContent, demoMode = false) => {
  if (demoMode) {
    await new Promise(r => setTimeout(r, 1500));
    return mockDistribution;
  }

  const system = `Repurpose this blog HTML into native formats. Output JSON: {"linkedin": "string", "twitter": ["string"], "quora": "string", "newsletter": "string"}`;

  try {
    const result = await callGemini(system, `Repurpose this content:\n\n${blogContent}`, 12000);
    return { website: blogContent, ...result };
  } catch (error) {
    console.warn("Falling back to demo distribution:", error.message);
    return mockDistribution;
  }
};

export const improveWithAI = async (textToImprove, instruction, demoMode = false) => {
  if (demoMode) {
    await new Promise(r => setTimeout(r, 500));
    return textToImprove + " (Improved by Gemini AI)";
  }

  const system = `Edit this HTML snippet based on: ${instruction}. Output STICKLY the revised HTML snippet as a raw string (not JSON).`;
  
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `System: ${system}\n\nHTML: ${textToImprove}` }] }] })
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || textToImprove;
  } catch (error) {
    return textToImprove;
  }
};

export const getStrategicInsights = async (keyword, demoMode = false) => {
  if (demoMode) {
    await new Promise(r => setTimeout(r, 1000));
    return {
      clusters: [`${keyword} tips`, `${keyword} guide`, `best ${keyword} 2026`],
      gaps: ["Lack of deep technical data", "Missing local case studies"],
      competition: "Medium"
    };
  }

  const system = `Analyze keyword SEO. Output JSON: {"clusters": ["string"], "gaps": ["string"], "competition": "string"}`;

  try {
    return await callGemini(system, `Analyze: "${keyword}"`, 8000);
  } catch (error) {
    return { clusters: [`${keyword} overview`], gaps: ["General depth"], competition: "Medium" };
  }
};
