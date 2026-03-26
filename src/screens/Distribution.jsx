import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card, Button, cn, LoadingSpinner } from '../components/ui';
import { Toast } from '../components/Toast';
import { distributeBlog } from '../services/claudeService';
import { saveBlog } from '../services/firebaseService';

export const Distribution = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [distributionData, setDistributionData] = useState(null);
  const [isDistributing, setIsDistributing] = useState(false);
  const [activeTab, setActiveTab] = useState('linkedin');
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

  const handleCopy = async (content) => {
    try {
      let textToCopy = content;
      // If array (like Twitter thread), join with linebreaks
      if (Array.isArray(content)) {
        textToCopy = content.join('\n\n');
      } else {
        // Strip simple HTML tags for clipboard if necessary
        const temp = document.createElement("div");
        temp.innerHTML = content;
        textToCopy = temp.textContent || temp.innerText || "";
      }
      
      await navigator.clipboard.writeText(textToCopy);
      setToastMessage(`Copied ${activeTab} post to clipboard!`);
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
      setToastMessage("Blog marked as published successfully! 🚀");
    } catch (err) {
      console.error(err);
      setToastMessage("Failed to publish blog.");
    } finally {
      setIsPublishing(false);
    }
  };

  const tabs = [
    { id: 'website', label: 'Website' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'quora', label: 'Quora' },
    { id: 'newsletter', label: 'Newsletter' }
  ];

  const renderContent = () => {
    if (!distributionData) return null;
    
    const content = distributionData[activeTab];
    
    if (activeTab === 'twitter' && Array.isArray(content)) {
      return (
        <div className="space-y-4">
          {content.map((tweet, i) => (
            <div key={i} className="bg-white border text-brand-text border-gray-200 p-4 rounded-[8px] whitespace-pre-wrap">
              {tweet}
            </div>
          ))}
        </div>
      );
    }

    // For HTML content
    return (
      <div 
        className="prose prose-brand max-w-none text-brand-text"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}

      <h1 className="text-3xl font-bold text-center text-brand-primary mb-2 tracking-tight uppercase">
        ONE BLOG. FIVE PLATFORMS. ZERO EXTRA WORK.
      </h1>
      <p className="text-center text-brand-text-secondary mb-12">
        Review your native content below.
      </p>

      {isDistributing ? (
        <Card className="flex flex-col items-center justify-center p-24 text-center border-brand-primary/10">
          <LoadingSpinner size="lg" className="mb-6" />
          <h2 className="text-xl font-bold text-brand-primary tracking-tight">AI is repurposing your content...</h2>
          <p className="text-brand-text-secondary mt-2">Writing threads, parsing audiences, formatting posts.</p>
        </Card>
      ) : distributionData ? (
        <div className="animate-in fade-in duration-500">
          
          {/* Tabs */}
          <div className="flex overflow-x-auto pb-4 mb-2 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-3 rounded-[8px] text-sm font-semibold transition-colors whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-brand-primary text-white shadow-md" 
                    : "bg-brand-surface text-brand-text-secondary hover:text-brand-primary hover:bg-gray-100 border border-gray-100"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Card */}
          <Card className="mb-8 border-brand-primary/10 shadow-lg min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-sm font-bold tracking-widest text-brand-text-secondary uppercase">
                {activeTab} POST
              </h2>
              <Button variant="secondary" onClick={() => handleCopy(distributionData[activeTab])} className="py-2 px-4 shadow-sm bg-white hover:bg-gray-50 text-brand-primary text-xs">
                COPY TO CLIPBOARD
              </Button>
            </div>
            
            <div className="flex-grow overflow-y-auto bg-gray-50/50 p-6 rounded-lg border border-gray-100">
              {renderContent()}
            </div>
          </Card>

          {/* Bottom Actions */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-[12px] border border-gray-100">
            <Button variant="link" onClick={() => navigate('/editor')} className="text-gray-500">
              ← Back to Editor
            </Button>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => handleCopy(Object.values(distributionData).join('\n\n---\n\n'))}>
                COPY ALL
              </Button>
              <Button onClick={handlePublish} isLoading={isPublishing} className="shadow-md">
                PUBLISH TO CMS
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
