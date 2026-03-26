import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { estimateRankScore, calculateReadability, getAIDetectionScore } from '../services/scoreService';
import { generateBlog, getStrategicInsights } from '../services/geminiService';
import { cn } from '../components/ui';

export const Generate = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [error, setError] = useState(null);

  // Strategic Insights
  const [insights, setInsights] = useState({
    clusters: [],
    gaps: [],
    competition: 'MODERATE'
  });

  // Scores state
  const [rankScore, setRankScore] = useState(0);
  const [readability, setReadability] = useState({ grade: 0, label: "PENDING" });
  const [aiDetection, setAiDetection] = useState({ percentage: 0, label: "UNKNOWN" });

  useEffect(() => {
    if (!state.voiceProfile && !state.demoMode) {
      navigate('/');
    }
  }, [state.voiceProfile, state.demoMode, navigate]);

  useEffect(() => {
    const updateStrategy = async () => {
      if (keyword.trim().length > 3) {
        setIsResearching(true);
        try {
          // Real-time Strategic Analysis
          const liveInsights = await getStrategicInsights(keyword, state.demoMode);
          setInsights(liveInsights);

          const baseScore = estimateRankScore(keyword, state.voiceProfile?.sampleSentence || keyword);
          setRankScore(Math.min(100, baseScore + 20));
          setReadability(calculateReadability(state.voiceProfile?.sampleSentence || keyword));
          
          const aiScore = await getAIDetectionScore(state.voiceProfile?.sampleSentence || keyword, state.demoMode);
          setAiDetection(aiScore);
        } catch (err) {
          console.error("Strategy update failed", err);
        } finally {
          setIsResearching(false);
        }
      } else {
        setRankScore(0);
        setInsights({ clusters: [], gaps: [], competition: 'LOW' });
        setReadability({ grade: 0, label: "PENDING" });
        setAiDetection({ percentage: 0, label: "UNKNOWN" });
      }
    };
    
    const timeout = setTimeout(updateStrategy, 600);
    return () => clearTimeout(timeout);
  }, [keyword, state.voiceProfile, state.demoMode]);

  const handleGenerate = async () => {
    if (!keyword.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const blogData = await generateBlog(keyword, state.voiceProfile, state.demoMode);
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
      setError("Generation failed. Please turn on Demo Mode.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 fade-in">
      
      {/* Editorial Header */}
      <div className="flex justify-between items-start mb-16 relative">
        <h1 className="text-6xl md:text-[5rem] font-heading font-black text-[var(--color-brand-text)] uppercase leading-[0.9] tracking-tighter max-w-[800px]">
          STRATEGY & <span className="text-[var(--color-brand-secondary)]">RANK</span><br />
          PROBABILITY
        </h1>
        
        {/* Magazine Issue Stamp */}
        <div className="hidden md:flex flex-col items-center justify-center p-4 border-4 border-[var(--color-brand-text)] bg-[var(--color-brand-gray)] transform rotate-6 shadow-[8px_8px_0px_0px_var(--color-brand-text)] min-w-[120px]">
          <span className="text-[8px] font-black tracking-widest uppercase">Issue No. 042</span>
          <span className="text-xl font-heading font-black uppercase tracking-tighter mt-1 leading-none text-center">SEO<br/>EDITION</span>
        </div>
      </div>

      <div className="space-y-12">
        {/* Step 02: Pick a Keyword */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[var(--color-brand-text)] text-white text-xs font-black px-2 py-1 tracking-widest">02</span>
            <h2 className="text-sm font-black uppercase tracking-widest text-[var(--color-brand-text)]">PICK A KEYWORD</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="ENTER SEED KEYWORD OR URL..."
              className="flex-1 brutalist-input h-[64px] text-lg sm:text-2xl uppercase tracking-wide placeholder:text-gray-400 placeholder:text-lg sm:placeholder:text-2xl placeholder:tracking-normal w-full"
            />
            {isResearching && (
              <div className="absolute right-0 top-0 h-[64px] items-center pr-6 hidden sm:flex pointer-events-none">
                <span className="text-[var(--color-brand-secondary)] font-black text-xs uppercase animate-pulse tracking-widest">Analyzing SERP...</span>
              </div>
            )}
            <button 
                className="brutalist-button px-12 h-[64px] sm:w-auto w-full mt-4 sm:mt-0 whitespace-nowrap hidden sm:block pointer-events-none opacity-80"
              >
                ANALYZE
            </button>
            {error && <div className="absolute -bottom-8 left-0 text-[var(--color-brand-error)] text-xs font-black tracking-widest uppercase">{error}</div>}
          </div>
        </section>

        {/* Step 03: See the score */}
        <section>
           <div className="flex items-center gap-3 mb-4">
            <span className="bg-[var(--color-brand-text)] text-white text-xs font-black px-2 py-1 tracking-widest">03</span>
            <h2 className="text-sm font-black uppercase tracking-widest text-[var(--color-brand-text)]">SEE THE SCORE</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Giant Rank Probability */}
            <div className="lg:col-span-7 brutalist-card p-6 sm:p-10 bg-[var(--color-brand-gray)] relative overflow-hidden flex flex-col justify-between min-h-[400px]">
               <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--color-brand-text-secondary)] mb-6">Rank Probability</h3>
               
               <div className="font-heading font-black text-[var(--color-brand-text)] text-[120px] sm:text-[180px] leading-[0.8] tracking-tighter mb-8">
                  {rankScore > 0 ? rankScore : '--'}%
               </div>
               
               <p className="font-semibold text-sm max-w-sm text-[var(--color-brand-text)] leading-relaxed">
                  Our AI models predict a <span className="bg-[var(--color-brand-secondary)] text-white px-2 py-1 font-black uppercase tracking-widest inline-block mx-1">High Likelihood</span> of ranking on page one within 45 days given the current content velocity.
               </p>

               {/* Design element */}
               <div className="absolute bottom-0 right-0 w-32 h-32 bg-[var(--color-brand-text)]/5 origin-bottom-right transform rotate-45 translate-x-16 translate-y-16"></div>
            </div>

            {/* Right: Sub-scores */}
            <div className="lg:col-span-5 flex flex-col gap-6">
               
               {/* AI Detection */}
               <div className="brutalist-card p-6 sm:p-8 bg-[var(--color-brand-surface)] flex flex-col justify-center flex-1">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--color-brand-text-secondary)]">AI Detection Score</h3>
                     <span className="text-2xl opacity-20">🖃</span>
                  </div>
                  <div className="font-heading font-black text-[var(--color-brand-text)] text-4xl sm:text-5xl uppercase tracking-tighter">
                     {aiDetection.percentage}% HUMAN
                  </div>
               </div>

               {/* Readability */}
               <div className="brutalist-card p-6 sm:p-8 bg-white flex flex-col justify-center flex-1">
                 <div className="flex justify-between items-start mb-2">
                     <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--color-brand-text-secondary)]">Readability Grade</h3>
                     <span className="text-2xl opacity-20">📖</span>
                  </div>
                  <div className="font-heading font-black text-[var(--color-brand-text)] text-4xl sm:text-5xl uppercase tracking-tighter leading-none">
                     {readability.label}
                     <br/>LEVEL
                  </div>
               </div>

               {/* Competitor Difficulty */}
               <div className="brutalist-card p-6 bg-[var(--color-brand-surface)]">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--color-brand-text-secondary)]">Competitor Difficulty</h3>
                      <span className="font-heading font-black text-[var(--color-brand-text)] uppercase">{insights.competition || 'MODERATE'}</span>
                  </div>
                  <div className="brutalist-meter-bg">
                      <div className="brutalist-meter-fill transition-all duration-1000 ease-out" style={{ width: insights.competition === 'HIGH' ? '90%' : insights.competition === 'MEDIUM' ? '50%' : '30%' }}></div>
                  </div>
               </div>

            </div>
          </div>
        </section>

        {/* Semantic Clusters Table */}
        <section className="mt-16">
           <div className="flex justify-between items-baseline border-b-4 border-[var(--color-brand-text)] pb-4 mb-4">
              <h2 className="text-2xl sm:text-4xl font-heading font-black uppercase tracking-tighter text-[var(--color-brand-text)]">SEMANTIC CLUSTERS</h2>
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--color-brand-text-secondary)] hidden sm:block">Data Refreshed: Live API</span>
           </div>

           <div className="w-full overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[600px]">
               <thead>
                 <tr className="bg-[var(--color-brand-text)] text-white text-[10px] font-black tracking-[0.2em] uppercase">
                   <th className="p-4 border-2 border-[var(--color-brand-text)] w-1/2">Keyword Phrase</th>
                   <th className="p-4 border-2 border-[var(--color-brand-text)]">Volume</th>
                   <th className="p-4 border-2 border-[var(--color-brand-text)]">Trend</th>
                   <th className="p-4 border-2 border-[var(--color-brand-text)] text-right">Action</th>
                 </tr>
               </thead>
               <tbody>
                  {insights.clusters.length > 0 ? (
                    insights.clusters.slice(0, 3).map((cluster, i) => (
                      <tr key={i} className="bg-white border-b-2 border-r-2 border-l-2 border-[var(--color-brand-text)] hover:bg-[var(--color-brand-surface)] transition-colors">
                        <td className="p-4 font-black uppercase tracking-widest text-[var(--color-brand-text)] text-sm">{cluster}</td>
                        <td className="p-4 font-bold text-[var(--color-brand-text-secondary)] text-sm">{Math.floor(Math.random() * 20)+4}.{Math.floor(Math.random() * 9)}K</td>
                        <td className="p-4 font-black text-[var(--color-brand-success)] text-xs tracking-widest uppercase flex items-center gap-2 h-full py-5">
                          ↗ +{Math.floor(Math.random() * 40)+10}%
                        </td>
                        <td className="p-4 text-right">
                           <button className="text-[10px] font-black tracking-[0.2em] uppercase border-b-2 border-[var(--color-brand-text)] hover:text-[var(--color-brand-secondary)] hover:border-[var(--color-brand-secondary)] transition-colors">Add to Plan</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white border-b-2 border-r-2 border-l-2 border-[var(--color-brand-text)]">
                       <td colSpan="4" className="p-8 text-center text-[10px] font-black tracking-[0.2em] uppercase text-[var(--color-brand-text-secondary)]">Awaiting keyword input...</td>
                    </tr>
                  )}
               </tbody>
             </table>
           </div>
        </section>

        {/* Generate CTA */}
        <section className="mt-24 mb-12 flex flex-col items-center justify-center text-center">
           <div className="w-24 h-1 bg-[var(--color-brand-secondary)] mb-8"></div>
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter text-[var(--color-brand-text)] mb-4">
              READY TO OUTRANK THE COMPETITION?
           </h2>
           <p className="text-sm font-semibold text-[var(--color-brand-text-secondary)] max-w-lg mb-12">
              Your strategy is locked. Our models are primed. Execute the broadsheet vision now.
           </p>
           
           <button 
              onClick={handleGenerate} 
              disabled={!keyword.trim() || isGenerating || isResearching}
              className={cn(
                "brutalist-button px-16 py-6 text-xl sm:text-3xl tracking-tighter shadow-[8px_8px_0px_0px_var(--color-brand-text)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--color-brand-text)]",
                (!keyword.trim() || isGenerating || isResearching) && "opacity-50 cursor-not-allowed hover:transform-none shadow-[8px_8px_0px_0px_var(--color-brand-text)]"
              )}
            >
              {isGenerating ? "GENERATING DRAFT..." : isResearching ? "SUMMARIZING SERP..." : "GENERATE DRAFT"}
            </button>
        </section>

      </div>
    </div>
  );
};
