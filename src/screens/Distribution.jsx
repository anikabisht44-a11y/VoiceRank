import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { cn, LoadingSpinner } from '../components/ui';
import { Toast } from '../components/Toast';
import { distributeBlog } from '../services/geminiService';
import { saveBlog } from '../services/firebaseService';

export const Distribution = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [distributionData, setDistributionData] = useState(null);
  const [isDistributing, setIsDistributing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (!state.blog && !state.demoMode) {
      navigate('/generate');
      return;
    }

    const runDistribution = async () => {
      setIsDistributing(true);
      try {
        const result = await distributeBlog(state.blog?.content || '<p>Demo content</p>', state.demoMode);
        setDistributionData(result);
      } catch (err) {
        console.error(err);
        setToastMessage("Failed to distribute. Using fallback content.");
      } finally {
        setIsDistributing(false);
      }
    };

    runDistribution();
  }, [state.blog, state.demoMode, navigate]);

  const handleCopy = async (content, platform) => {
    try {
      let textToCopy = content;
      if (Array.isArray(content)) {
        textToCopy = content.join('\n\n');
      } else {
        const temp = document.createElement("div");
        temp.innerHTML = content;
        textToCopy = temp.textContent || temp.innerText || "";
      }
      
      await navigator.clipboard.writeText(textToCopy);
      setToastMessage(`Copied ${platform} payload to clipboard!`);
    } catch (err) {
      console.error('Failed to copy', err);
      setToastMessage("Failed to copy to clipboard.");
    }
  };

  const handlePublish = async () => {
    if (!state.blog && !state.demoMode) return;
    
    setIsPublishing(true);
    try {
      const publishedBlog = { ...state.blog, published: true };
      const saved = await saveBlog(publishedBlog);
      dispatch({ type: 'SET_BLOG', payload: saved });
      setToastMessage("Payload transmitted to all networks successfully! 🚀");
    } catch (err) {
      console.error(err);
      setToastMessage("Failed to transmit payload.");
    } finally {
      setIsPublishing(false);
    }
  };

  const displayPlatforms = ['linkedin', 'twitter', 'newsletter', 'quora'];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 fade-in">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}

      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b-4 border-[var(--color-brand-text)] pb-8 pt-4 relative">
        <div className="absolute top-0 right-0 bg-[var(--color-brand-text)] text-white text-[10px] font-black px-4 py-2 tracking-[0.2em] uppercase hidden md:block">
          ACCELERATOR_NODE_04
        </div>
        <div>
           <div className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--color-brand-secondary)] mb-4">Omnichannel Deployment</div>
           <h1 className="text-5xl md:text-7xl font-heading font-black text-[var(--color-brand-text)] uppercase tracking-tighter leading-[0.9]">
             BEYOND THE <span className="text-[var(--color-brand-secondary)] border-b-8 border-[var(--color-brand-secondary)] pb-1">BLOG</span>
           </h1>
        </div>
        <p className="max-w-xs text-xs font-bold text-[var(--color-brand-text-secondary)] mt-6 md:mt-0 uppercase tracking-widest leading-relaxed text-right hidden md:block">
          One raw text file.<br/>Neural extraction.<br/>Infinite surface area.
        </p>
      </div>

      {isDistributing ? (
        <div className="brutalist-card p-24 flex flex-col items-center justify-center text-center bg-[var(--color-brand-surface)] min-h-[400px]">
          <div className="text-6xl mb-8 animate-spin">⚙</div>
          <h2 className="text-2xl font-heading font-black tracking-tighter uppercase text-[var(--color-brand-text)]">Compiling Social Vectors...</h2>
          <p className="text-xs font-black tracking-[0.2em] uppercase mt-4 text-[var(--color-brand-text-secondary)]">Adapting syntax for platform algorithms</p>
        </div>
      ) : distributionData && (
         <div className="space-y-16">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-sm font-black tracking-widest uppercase text-[var(--color-brand-text)]">
                 LIVE CONTENT PREVIEWS
               </h2>
               <button onClick={() => navigate('/editor')} className="text-[10px] font-black tracking-[0.2em] uppercase uppercase border-b-2 border-[var(--color-brand-text)] hover:text-[var(--color-brand-secondary)] hover:border-[var(--color-brand-secondary)] transition-colors">
                 ← Edit Source Document
               </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Platform Cards loop */}
               {displayPlatforms.map(platform => {
                 if(!distributionData[platform]) return null;
                 return (
                    <div key={platform} className="brutalist-card bg-white flex flex-col h-[400px] overflow-hidden">
                       <div className="border-b-3 border-[var(--color-brand-text)] p-4 flex justify-between items-center bg-[var(--color-brand-surface)]">
                          <h3 className="text-xs font-black tracking-[0.2em] uppercase text-[var(--color-brand-text)] bg-white border-2 border-[var(--color-brand-text)] px-4 py-2 shadow-[2px_2px_0_0_var(--color-brand-text)]">
                             {platform}
                          </h3>
                          <button onClick={() => handleCopy(distributionData[platform], platform)} className="text-[10px] font-black tracking-[0.2em] uppercase hover:text-[var(--color-brand-secondary)] transition-colors bg-transparent border-none outline-none cursor-pointer p-2">
                            [ Copy Payload ]
                          </button>
                       </div>
                       <div className="p-6 overflow-y-auto flex-grow text-sm font-medium leading-relaxed bg-white">
                          {platform === 'twitter' && Array.isArray(distributionData[platform]) ? (
                             <div className="space-y-6">
                                {distributionData[platform].map((tweet, i) => (
                                  <div key={i} className="pl-4 border-l-4 border-[var(--color-brand-secondary)] whitespace-pre-wrap">{tweet}</div>
                                ))}
                             </div>
                          ) : (
                             <div className="prose prose-sm prose-brand" dangerouslySetInnerHTML={{ __html: distributionData[platform] }} />
                          )}
                       </div>
                    </div>
                 )
               })}
            </div>

            {/* Huge CTA Block */}
            <div className="brutalist-card bg-[var(--color-brand-secondary)] p-8 md:p-16 text-center border-b-[16px] border-[var(--color-brand-text)] shadow-none mt-12">
               <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-white uppercase mb-12">
                  READY TO DOMINATE THE FEED?
               </h2>
               <button 
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="brutalist-button-black w-full max-w-3xl mx-auto py-6 sm:py-8 text-xl sm:text-3xl shadow-[8px_8px_0_0_#FFF] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_#FFF] border-[var(--color-brand-text)] hover:-rotate-1 transition-all disabled:opacity-50 disabled:hover:transform-none"
               >
                  {isPublishing ? "TRANSMITTING TO NETWORKS..." : "PUBLISH EVERYWHERE NOW"}
               </button>
            </div>
         </div>
      )}
    </div>
  );
};
