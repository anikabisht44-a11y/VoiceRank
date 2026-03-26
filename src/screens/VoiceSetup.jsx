import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractVoice } from '../services/geminiService';
import { saveVoiceProfile } from '../services/firebaseService';
import { mockVoiceProfile } from '../services/mockData';
import { useAppContext } from '../context/AppContext';
import { cn } from '../components/ui';

export const VoiceSetup = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  
  const [inputText, setInputText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [localProfile, setLocalProfile] = useState(state.voiceProfile);
  const [error, setError] = useState(null);

  const handleExtract = async () => {
    if (!inputText.trim()) return;
    
    setIsExtracting(true);
    setError(null);
    try {
      const profile = await extractVoice(inputText, state.demoMode);
      setLocalProfile(profile);
    } catch (err) {
      console.error(err);
      setError("Failed to extract voice. Please try again or use Demo Voice.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSave = async () => {
    if (!localProfile) return;
    
    dispatch({ type: 'SET_VOICE_PROFILE', payload: localProfile });
    await saveVoiceProfile(localProfile);
    navigate('/generate');
  };

  const handleTryDemo = () => {
    setLocalProfile(mockVoiceProfile);
    dispatch({ type: 'SET_VOICE_PROFILE', payload: mockVoiceProfile });
    navigate('/generate');
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 fade-in">
      
      {/* Editorial Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl md:text-5xl font-heading font-black text-[var(--color-brand-secondary)] uppercase leading-none">01</span>
          <div className="h-1 flex-1 bg-[var(--color-brand-secondary)] max-w-[200px]"></div>
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--color-brand-text-secondary)] whitespace-nowrap ml-auto md:ml-0">
            Step One: Data Ingestion
          </span>
        </div>
        <h1 className="text-6xl md:text-8xl font-heading font-black text-[var(--color-brand-text)] uppercase leading-[0.9] tracking-tighter">
          TEACH NARRATE AI <br />
          <span className="text-[var(--color-brand-secondary)]">YOUR VOICE</span>
        </h1>
        <p className="mt-8 text-lg max-w-2xl text-[var(--color-brand-text-secondary)] font-medium leading-relaxed">
          Feed the algorithm your raw writing. Our neural engine deconstructs your syntax, rhythm, and lexical choices to build a digital twin of your creative persona.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Input */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="brutalist-card p-6 md:p-8 relative bg-[var(--color-brand-gray)]">
            <div className="absolute top-0 right-0 bg-[var(--color-brand-text)] text-white text-[10px] font-black px-3 py-1 xl:px-4 xl:py-2 tracking-[0.2em] uppercase border-b-2 border-l-2 border-[var(--color-brand-text)]">
              Input_Terminal_v.01
            </div>
            
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-[var(--color-brand-text)] mt-2">
              Your Writing Samples
            </h2>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isExtracting}
              placeholder="Paste your blog posts, emails, or essays here. The more you provide, the sharper the mimicry..."
              className="w-full h-[350px] p-6 bg-[var(--color-brand-surface)] border-3 border-[var(--color-brand-text)] resize-none focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-accent)] text-lg font-medium leading-relaxed placeholder:text-gray-400"
            />
            
            {error && <div className="mt-4 text-[var(--color-brand-error)] text-xs font-black tracking-widest uppercase bg-white border-2 border-[var(--color-brand-error)] p-3">{error}</div>}

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div className="text-[10px] font-black text-[var(--color-brand-text-secondary)] uppercase tracking-widest space-y-1">
                <div>Minimum: 500 Words</div>
                <div>Status: {isExtracting ? <span className="text-[var(--color-brand-secondary)] animate-pulse">Ingesting...</span> : "Waiting for input"}</div>
              </div>
              
              <button 
                onClick={handleExtract} 
                disabled={!inputText.trim() || isExtracting}
                className={cn(
                  "brutalist-button w-full sm:w-auto",
                  (!inputText.trim() || isExtracting) && "opacity-50 cursor-not-allowed transform-none shadow-none"
                )}
              >
                {isExtracting ? "ANALYZING NUANCES..." : "RUN ANALYSIS"}
              </button>
            </div>
          </div>

          <div className="brutalist-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border-3 border-[var(--color-brand-text)] flex items-center justify-center font-black text-xl bg-[var(--color-brand-gray)]">
                      ↑
                  </div>
                  <div>
                     <h3 className="font-black uppercase tracking-widest text-[var(--color-brand-text)]">Bulk Upload Archive</h3>
                     <p className="text-xs font-bold text-[var(--color-brand-text-secondary)] mt-1 tracking-wide">Connect Google Docs or Notion for deep learning.</p>
                  </div>
              </div>
              <button onClick={handleTryDemo} className="text-[10px] font-black uppercase tracking-[0.2em] underline decoration-2 underline-offset-4 hover:text-[var(--color-brand-secondary)] transition-colors cursor-pointer bg-transparent border-none">
                Skip to Demo
              </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="lg:col-span-5 flex flex-col gap-6 relative">
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] font-heading font-black leading-none overflow-hidden select-none -z-10 flex items-center justify-center">
                <span className="text-[200px] transform -rotate-90 origin-center whitespace-nowrap text-[var(--color-brand-text)] uppercase absolute -left-[100%] top-[40%]">DATABASE</span>
            </div>
            
          {localProfile ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              
              {/* Voice Fidelity Card */}
              <div className="brutalist-card p-6 md:p-8 bg-white relative overflow-hidden">
                {/* Folded Corner Effect */}
                <div className="absolute top-0 left-0 border-[20px] border-l-[var(--color-brand-surface)] border-t-[var(--color-brand-surface)] border-r-[var(--color-brand-text)] border-b-[var(--color-brand-text)] opacity-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"></div>
                
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-brand-text)] mb-8 pl-8">Voice Fidelity</h3>
                <div className="flex flex-col items-center justify-center py-6">
                   <div className="w-48 h-48 border-[6px] border-[var(--color-brand-text)] flex items-center justify-center relative bg-white">
                       <div className="absolute inset-3 border-4 border-dashed border-[var(--color-brand-secondary)]/30 mix-blend-multiply"></div>
                       <span className="text-7xl font-heading font-black text-[var(--color-brand-text)] relative z-10 tracking-tighter">84%</span>
                   </div>
                   <p className="mt-8 text-[10px] font-black text-[var(--color-brand-text-secondary)] uppercase tracking-[0.25em]">Matching Neural Patterns...</p>
                </div>
              </div>

              {/* Detected Tone */}
              <div className="brutalist-card p-6 md:p-8 bg-[var(--color-brand-gray)]">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-brand-text)] flex items-center gap-3 mb-6">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                   Detected Tone
                </h3>
                <div className="flex flex-wrap gap-3">
                   <span className="border-3 border-[var(--color-brand-text)] bg-[var(--color-brand-text)] text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-2">{localProfile.tone}</span>
                   <span className="border-3 border-[var(--color-brand-text)] bg-[var(--color-brand-secondary)] text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-2">{localProfile.persona}</span>
                   {localProfile.keyCharacteristics?.slice(0, 3).map((char, i) => (
                      <span key={i} className="border-3 border-[var(--color-brand-text)] bg-white text-[var(--color-brand-text)] text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-2">{char}</span>
                   ))}
                </div>
              </div>

              {/* Sentence Structure & Save */}
              <div className="brutalist-card p-6 md:p-8 bg-white">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-brand-text)] mb-8">Sentence Structure</h3>
                 
                 <div className="space-y-8">
                    <div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                            <span className="text-[var(--color-brand-text-secondary)]">Rhythm</span>
                            <span className="text-[var(--color-brand-text)]">{localProfile.sentenceLength || 'Staccato'}</span>
                        </div>
                        <div className="brutalist-meter-bg">
                           <div className="brutalist-meter-fill w-[70%]" style={{ width: localProfile.sentenceLength?.includes('Long') ? '90%' : '60%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                            <span className="text-[var(--color-brand-text-secondary)]">Vocabulary Density</span>
                            <span className="text-[var(--color-brand-text)]">{localProfile.vocabularyLevel || 'Highly Complex'}</span>
                        </div>
                        <div className="brutalist-meter-bg">
                           <div className="bg-[var(--color-brand-text)] h-full border-r-2 border-[var(--color-brand-text)] w-[85%]" style={{ width: localProfile.vocabularyLevel?.includes('Advanced') ? '95%' : '75%' }}></div>
                        </div>
                    </div>
                 </div>

                 <button onClick={handleSave} className="brutalist-button-black w-full mt-10 flex items-center justify-between group">
                    <span>Save My Voice Profile</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                 </button>
              </div>
            </div>
          ) : (
              <div className="brutalist-card p-8 h-full min-h-[400px] flex items-center justify-center border-dashed border-4 border-gray-300 bg-[var(--color-brand-surface)] shadow-none">
                   <div className="text-center opacity-40">
                       <div className="text-6xl mb-6">⬛</div>
                       <p className="text-sm font-black uppercase tracking-[0.2em]">Awaiting Data Ingestion</p>
                   </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
