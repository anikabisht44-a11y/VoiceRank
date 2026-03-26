import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useAppContext } from '../context/AppContext';
import { cn } from '../components/ui';
import { improveWithAI } from '../services/geminiService';
import { saveBlog } from '../services/firebaseService';
import { calculateReadability } from '../services/scoreService';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const getBtnClass = (isActive) => cn(
    "px-3 py-2 text-xs font-black uppercase tracking-widest border-r-3 border-[var(--color-brand-text)] transition-colors h-full flex items-center justify-center",
    isActive ? "bg-[var(--color-brand-text)] text-white" : "text-[var(--color-brand-text)] bg-white hover:bg-[var(--color-brand-surface)]"
  );

  return (
    <div className="flex flex-wrap items-center bg-white border-b-3 border-[var(--color-brand-text)] sticky top-0 z-10 w-full h-12">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={getBtnClass(editor.isActive('bold'))}>B</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={getBtnClass(editor.isActive('italic'))}>I</button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={getBtnClass(editor.isActive('strike'))}>S</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={getBtnClass(editor.isActive('heading', { level: 1 }))}>H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={getBtnClass(editor.isActive('heading', { level: 2 }))}>H2</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={getBtnClass(editor.isActive('bulletList'))}>• List</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={getBtnClass(editor.isActive('orderedList'))}>1. List</button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={getBtnClass(editor.isActive('blockquote'))}>Quote</button>
    </div>
  );
};

export const BlogEditor = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [isImproving, setIsImproving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [seoStats, setSeoStats] = useState({
    h1Present: false,
    keywordInH1: false,
    wordCount: 0,
    readabilityGrade: 0
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: state.blog?.content || '<p>Start writing...</p>',
    onUpdate: ({ editor }) => {
      updateSeoStats(editor.getHTML(), editor.getText());
    }
  });

  useEffect(() => {
    if (!state.blog && !state.demoMode) {
      navigate('/generate');
    }
  }, [state.blog, state.demoMode, navigate]);

  useEffect(() => {
    if (editor) {
      updateSeoStats(editor.getHTML(), editor.getText());
    }
  }, [editor]);

  const updateSeoStats = (html, text) => {
    const keyword = (state.blog?.keyword || '').toLowerCase();
    
    // Check H1
    const h1Match = html.match(/<h1>(.*?)<\/h1>/i);
    const h1Text = h1Match ? h1Match[1].toLowerCase() : '';
    
    // Word counts
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    
    setSeoStats({
      h1Present: !!h1Match,
      keywordInH1: keyword && h1Text.includes(keyword),
      wordCount: words.length,
      readabilityGrade: calculateReadability(text).grade
    });
  };

  const handleImproveWithAI = async () => {
    if (!editor) return;
    
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      '\n'
    );
    
    if (!selectedText.trim()) {
      alert("Please select some text to improve first.");
      return;
    }

    setIsImproving(true);
    try {
      const improvedHtml = await improveWithAI(selectedText, "Make it punchier and more engaging.", state.demoMode);
      editor.chain().focus().insertContent(improvedHtml).run();
    } catch (err) {
      console.error(err);
      alert("AI Improvement failed.");
    } finally {
      setIsImproving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    if (!editor) return;
    
    setIsSaving(true);
    const updatedBlog = {
      ...state.blog,
      content: editor.getHTML()
    };
    
    try {
      const saved = await saveBlog(updatedBlog);
      dispatch({ type: 'SET_BLOG', payload: saved });
      navigate('/distribution');
    } catch (err) {
      console.error("Save failed", err);
      if (state.demoMode) navigate('/distribution');
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSave = async () => {
    if (!editor) return;
    setIsSaving(true);
    const updatedBlog = { ...state.blog, content: editor.getHTML() };
    try {
      const saved = await saveBlog(updatedBlog);
      dispatch({ type: 'SET_BLOG', payload: saved });
    } catch (err) {
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };

  const CheckItem = ({ passed, label }) => (
    <div className="flex items-start gap-3 mb-4">
      <div className={cn("w-5 h-5 flex-shrink-0 border-3 mt-0.5 flex items-center justify-center transition-colors", passed ? "border-[var(--color-brand-success)] bg-[var(--color-brand-success)]" : "border-[var(--color-brand-text)] bg-transparent")}>
        {passed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>}
      </div>
      <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] pt-0.5", passed ? "text-[var(--color-brand-text)]" : "text-[var(--color-brand-text-secondary)]")}>{label}</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 fade-in">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-4 border-[var(--color-brand-text)] pb-6 pt-4 relative">
        <div className="absolute top-0 right-0 bg-[var(--color-brand-text)] text-white text-[10px] font-black px-4 py-2 tracking-[0.2em] uppercase hidden md:block">
          CMS_Terminal_Active
        </div>
        <div>
           <div className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--color-brand-secondary)] mb-2">Live Document</div>
           <h1 className="text-5xl md:text-6xl font-heading font-black text-[var(--color-brand-text)] uppercase tracking-tighter leading-none">
             EDITORIAL CONSOLE
           </h1>
        </div>
        <div className="flex gap-4 mt-6 md:mt-0">
          <button 
            onClick={handleManualSave} 
            disabled={isSaving}
            className="text-[10px] sm:text-xs font-black uppercase tracking-widest bg-white border-3 border-[var(--color-brand-text)] text-[var(--color-brand-text)] px-6 py-3 hover:bg-[var(--color-brand-surface)] transition-all active:translate-y-1"
          >
            {isSaving ? "SAVING..." : "SAVE DRAFT"}
          </button>
          <button 
            onClick={handleSaveAndContinue} 
            disabled={isSaving}
            className="brutalist-button py-3 text-[10px] sm:text-xs w-full sm:w-auto text-center"
          >
            PUBLISH & DISTRIBUTE →
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Editor Area (70%) */}
        <div className="w-full xl:w-[70%] flex flex-col">
          <div className="brutalist-card flex-grow p-0 overflow-hidden flex flex-col bg-white">
            <MenuBar editor={editor} />
            <div className="flex-grow overflow-y-auto">
              <EditorContent editor={editor} className="h-full" />
            </div>
            
            {/* Editor Footer / Word Count */}
            <div className="border-t-3 border-[var(--color-brand-text)] bg-[var(--color-brand-surface)] p-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[var(--color-brand-text-secondary)]">
               <span>Target Length: &gt;1000 Words</span>
               <span className={cn(seoStats.wordCount < 1000 ? "text-[var(--color-brand-secondary)]" : "text-[var(--color-brand-success)]")}>
                  Current: {seoStats.wordCount} Words
               </span>
            </div>
          </div>
        </div>

        {/* Sidebars (30%) */}
        <div className="w-full xl:w-[30%] flex flex-col gap-8">
          
          {/* AI IMPROVE WIDGET */}
          <div className="brutalist-card p-6 sm:p-8 bg-[var(--color-brand-gray)] border-b-[12px] border-b-[var(--color-brand-secondary)]">
             <h3 className="text-xs font-black tracking-widest text-[var(--color-brand-text)] uppercase mb-4 flex justify-between items-center">
                <span>Neural Editor</span>
                <span className="bg-[var(--color-brand-secondary)] w-3 h-3 rounded-none animate-pulse"></span>
             </h3>
             <p className="text-sm font-medium text-[var(--color-brand-text-secondary)] mb-8 leading-relaxed">High-density rewrites. Select any weak paragraph in your text, and our engine will restructure the syntax while maintaining your precise voice metrics.</p>
             
             <button 
                className="brutalist-button-black w-full text-[10px] sm:text-xs py-5 flex items-center justify-center gap-3 group" 
                onClick={handleImproveWithAI}
                disabled={isImproving}
              >
                <span>{isImproving ? "REWIRING TEXT..." : "INITIATE AI REWRITE"}</span>
                {!isImproving && <span className="text-[var(--color-brand-secondary)] group-hover:rotate-180 transition-transform duration-500 font-serif">✥</span>}
              </button>
          </div>

          {/* SEO Checklist */}
          <div className="brutalist-card p-6 sm:p-8 bg-white">
            <h3 className="text-xs font-black tracking-widest text-[var(--color-brand-text)] uppercase mb-8 pb-4 border-b-3 border-[var(--color-brand-text)]">
              SEO AUDIT ALGORITHM
            </h3>
            
            <div className="mb-4 space-y-2">
              <CheckItem passed={seoStats.h1Present} label="H1 Structure Tag Detected" />
              <CheckItem passed={seoStats.keywordInH1} label={`Target Inject: "${state.blog?.keyword?.toUpperCase() || 'NONE'}"`} />
              <CheckItem passed={seoStats.wordCount > 1000} label={`Content Depth (> 1000)`} />
              <CheckItem passed={seoStats.readabilityGrade <= 9} label={`Readability Index (≤ 9)`} />
            </div>
          </div>

          {/* Tone Alignment */}
          <div className="brutalist-card p-6 sm:p-8 bg-[var(--color-brand-text)] text-white flex flex-col gap-6 shadow-none">
            <h3 className="text-xs font-black tracking-widest text-white uppercase pb-4 border-b-2 border-white/20">
              VOICE ALIGNMENT
            </h3>
            <div>
               <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-white/70">
                   <span>Persona Match</span>
                   <span className="text-[var(--color-brand-secondary)]">89%</span>
               </div>
               <div className="h-3 bg-white/10 w-full rounded-none overflow-hidden"><div className="bg-[var(--color-brand-secondary)] h-full w-[89%]"></div></div>
            </div>
            <div>
               <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-white/70">
                   <span>Lexical Density</span>
                   <span className="text-[var(--color-brand-secondary)]">Stable</span>
               </div>
               <div className="h-3 bg-white/10 w-full rounded-none overflow-hidden"><div className="bg-white h-full w-[74%]"></div></div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
