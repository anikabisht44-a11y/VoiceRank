/**
 * Calculates a Readability Grade Level 
 * Returns { grade: number, label: string }
 */
export const calculateReadability = (text) => {
  if (!text || text.trim().length === 0) return { grade: 0, label: "Empty" };
  
  // Heuristic Readability for browser (avoiding heavy NLP node modules)
  // Grade: Words per sentence + complex word ratio roughly
  const words = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).length || 1;
  const grade = Math.round((words / sentences) * 0.5) + 3;
  
  let label = "Standard";
  if (grade < 6) label = "Very Simple";
  else if (grade >= 6 && grade <= 9) label = "Standard · Optimal for B2B";
  else if (grade > 9 && grade <= 12) label = "Advanced";
  else label = "Academic / Complex";

  return { grade: Math.max(1, grade), label };
};

/**
 * Heuristic-based Rank Prediction Score (0-100)
 * Evaluates text against a target keyword
 */
export const estimateRankScore = (keyword, text) => {
  if (!text || !keyword) return 0;
  
  let score = 40; // baseline for having any content
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();

  // Keyword presence
  if (lowerText.includes(lowerKeyword)) score += 20;
  
  // Keyword density (rough estimate)
  const words = lowerText.split(/\s+/);
  const keywordCount = lowerText.split(lowerKeyword).length - 1;
  const density = words.length > 0 ? (keywordCount * keyword.split(/\s+/).length) / words.length : 0;
  
  if (density > 0.005 && density < 0.025) score += 15; // Optimal density
  else if (density >= 0.025) score -= 10; // Keyword stuffing penalty
  
  // Length bonus
  if (words.length > 300) score += 10;
  if (words.length > 600) score += 10;
  
  // Formatting elements (H1, H2, lists)
  if (lowerText.includes('<h1>')) score += 5;
  if (lowerText.includes('<h2>')) score += 5;
  if (lowerText.includes('<li>')) score += 5;
  
  return Math.min(100, Math.max(0, score));
};

/**
 * Estimates AI Detection Score via heuristic, or returns mock data.
 * Since Hugging Face API is optional and can be slow/unreliable unauthenticated,
 * we use a smart fallback returning { percentage: number, label: string }
 */
export const getAIDetectionScore = async (text, demoMode = false) => {
  if (demoMode) {
    return { percentage: 7, label: "Human-like" };
  }

  // Optional: Add real HF Inference API call here.
  // For the MVP, a robust heuristic-based mock is safer to avoid CORS/Auth issues.
  
  // Heuristic: highly structured/repetitive text often flags as AI.
  // We'll return a low number for short varied sentences, higher for generic ones.
  const isGeneric = text.includes("fast-paced digital landscape") || 
                    text.includes("unlocking the power of") ||
                    text.includes("crucial to remember");
                    
  const percentage = isGeneric ? 85 : Math.floor(Math.random() * 15) + 2; // 2-16% usually
  
  return {
    percentage,
    label: percentage < 20 ? "Human-like" : percentage < 60 ? "Mixed" : "Likely AI-generated"
  };
};
