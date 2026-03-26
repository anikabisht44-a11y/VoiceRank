import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractVoice } from '../services/claudeService';
import { saveVoiceProfile } from '../services/firebaseService';
import { mockVoiceProfile } from '../services/mockData';
import { useAppContext } from '../context/AppContext';
import { Card, Button, Tag, cn } from '../components/ui';

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
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-brand-primary mb-4 tracking-tight">
        TEACH VOICERANK YOUR VOICE
      </h1>
      <p className="text-center text-brand-text-secondary mb-12 text-lg">
        Paste any content you've written. We'll learn your unique style.
      </p>

      {/* Input Stage */}
      <div className="mb-12">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isExtracting}
            placeholder="&quot;As a founder, I've learned SEO isn't about keywords. It's about understanding what people actually need...&quot;"
            className="w-full h-[200px] p-6 text-brand-text bg-white border border-gray-200 rounded-[12px] shadow-sm resize-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary placeholder:text-gray-400 transition-all text-lg"
          />
        </div>
        
        {error && <div className="mt-3 text-brand-error text-sm font-medium">{error}</div>}

        <Button 
          onClick={handleExtract} 
          disabled={!inputText.trim() || isExtracting}
          isLoading={isExtracting}
          className="w-full mt-6 py-4 text-base shadow-md h-auto"
        >
          EXTRACT VOICE DNA
        </Button>
      </div>

      {/* Results Stage */}
      {localProfile && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-brand-primary/10 shadow-lg">
          <h2 className="text-sm font-bold tracking-widest text-brand-text-secondary uppercase mb-6 border-b border-gray-100 pb-3">
            YOUR VOICE PROFILE
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tone</span>
              < Tag className="bg-white border text-brand-primary font-semibold border-gray-200">{localProfile.tone}</Tag>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sentence</span>
              <Tag className="bg-white border text-brand-primary font-semibold border-gray-200">{localProfile.sentenceLength}</Tag>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Vocabulary</span>
              <Tag className="bg-white border text-brand-primary font-semibold border-gray-200">{localProfile.vocabularyLevel}</Tag>
            </div>
          </div>

          <div className="mb-8">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Persona</span>
            <div className="text-xl font-medium text-brand-text">{localProfile.persona}</div>
          </div>

          <div className="mb-8 p-6 bg-brand-surface rounded-xl border-l-4 border-brand-secondary italic text-brand-text-secondary relative">
            <span className="absolute -top-3 left-4 bg-brand-surface px-2 text-6xl text-brand-primary/10 leading-none h-6">"</span>
            {localProfile.sampleSentence}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <Button onClick={handleSave} className="w-full sm:w-auto px-8 py-3">
              SAVE VOICE PROFILE
            </Button>
            <Button variant="link" onClick={handleTryDemo} className="text-gray-500 hover:text-brand-secondary mt-4 sm:mt-0">
              Try Demo Voice
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
