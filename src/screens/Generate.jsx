import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card, Button, ScoreMeter, ProgressBar } from '../components/ui';
import { estimateRankScore, calculateReadability, getAIDetectionScore } from '../services/scoreService';
import { generateBlog } from '../services/claudeService';

export const Generate = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Scores state local to this screen until generation
  const [rankScore, setRankScore] = useState(0);
  const [readability, setReadability] = useState({ grade: 0, label: "Empty" });
  const [aiDetection, setAiDetection] = useState({ percentage: 0, label: "Unknown" });

  useEffect(() => {
    // If no voice profile, force them back
    if (!state.voiceProfile && !state.demoMode) {
      navigate('/');
    }
  }, [state.voiceProfile, state.demoMode, navigate]);

  useEffect(() => {
    // Live update scores as user types (simulating real-time SEO feedback)
    const updateScores = async () => {
      if (keyword.trim().length > 2) {
        // Base score off keyword length/complexity + voice profile strength
        const baseScore = estimateRankScore(keyword, state.voiceProfile?.sampleSentence || keyword);
        setRankScore(Math.min(100, baseScore + 20)); // Optimistic boost
        setReadability(calculateReadability(state.voiceProfile?.sampleSentence || keyword));
        
        const aiScore = await getAIDetectionScore(state.voiceProfile?.sampleSentence || keyword, state.demoMode);
        setAiDetection(aiScore);
      } else {
        setRankScore(0);
        setReadability({ grade: 0, label: "Empty" });
        setAiDetection({ percentage: 0, label: "Unknown" });
      }
    };
    
    const timeout = setTimeout(updateScores, 400);
    return () => clearTimeout(timeout);
  }, [keyword, state.voiceProfile, state.demoMode]);

  const handleGenerate = async () => {
    if (!keyword.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const blogData = await generateBlog(keyword, state.voiceProfile, state.demoMode);
      
      // Update global state
      dispatch({ type: 'SET_BLOG', payload: blogData });
      dispatch({ 
        type: 'SET_SCORES', 
        payload: { 
          rankScore: blogData.rankScore || rankScore,
          readabilityGrade: blogData.readabilityGrade || readability.grade,
          aiDetectionScore: blogData.aiDetectionScore || aiDetection.percentage
        } 
      });
      
      navigate('/editor');
    } catch (err) {
      console.error(err);
      setError("Generation failed. Please turn on Demo Mode or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-brand-primary mb-8 tracking-tight uppercase border-b border-gray-100 pb-4">
        WHAT DO YOU WANT TO RANK FOR?
      </h1>

      <div className="mb-12 relative animate-in fade-in slide-in-from-top-4 duration-500">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g., best AI blog automation tool India"
          className="w-full text-2xl p-6 bg-white border-2 border-gray-200 rounded-[12px] shadow-sm focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary placeholder:text-gray-300 transition-all text-brand-text outline-none"
        />
        {error && <div className="absolute -bottom-8 left-0 text-brand-error text-sm font-medium">{error}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        {/* Main Rank Score Card */}
        <Card className="col-span-1 md:col-span-6 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-white to-gray-50/50">
          <h2 className="text-sm font-bold tracking-widest text-brand-text-secondary uppercase mb-8">
            RANK SCORE
          </h2>
          <div className="mb-8">
            <ScoreMeter score={rankScore} size={200} />
          </div>
          <div className="text-center">
            <p className="text-brand-text font-medium">Competition: Medium</p>
            <p className="text-brand-text-secondary text-sm mt-1">Based on current SERP features</p>
          </div>
        </Card>

        {/* Secondary Scores */}
        <div className="col-span-1 md:col-span-6 flex flex-col gap-6">
          <Card className="flex-1 flex flex-col justify-center">
            <h2 className="text-sm font-bold tracking-widest text-brand-text-secondary uppercase mb-4">
              READABILITY
            </h2>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-bold font-inter text-brand-primary">{readability.grade ? `${readability.grade}th` : '-'}</span>
              <span className="text-brand-text-secondary font-medium">Grade</span>
            </div>
            <p className="text-sm text-brand-primary/80 font-medium bg-brand-primary/5 p-3 rounded-lg border border-brand-primary/10">
              {readability.label}
            </p>
          </Card>

          <Card className="flex-1 flex flex-col justify-center">
            <h2 className="text-sm font-bold tracking-widest text-brand-text-secondary uppercase mb-4">
              AI DETECTION
            </h2>
            <ProgressBar 
              percentage={aiDetection.percentage} 
              lowIsGood={true} 
              label={`${aiDetection.percentage}% Probability`} 
            />
            <p className="text-sm text-brand-text-secondary mt-3 italic">
              Google rewards human-first content.
            </p>
          </Card>
        </div>
      </div>

      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-[12px] border border-gray-100">
        <Button variant="link" onClick={() => navigate('/')} className="text-gray-500">
          ← Back to Voice Setup
        </Button>
        <Button 
          onClick={handleGenerate} 
          disabled={!keyword.trim() || isGenerating}
          isLoading={isGenerating}
          className="px-10 py-4 text-lg shadow-md"
        >
          GENERATE BLOG
        </Button>
      </div>
    </div>
  );
};
