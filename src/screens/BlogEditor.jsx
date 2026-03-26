import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useAppContext } from '../context/AppContext';
import { Card, Button, cn } from '../components/ui';
import { improveWithAI } from '../services/claudeService';
import { saveBlog } from '../services/firebaseService';
import { calculateReadability } from '../services/scoreService';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const getBtnClass = (isActive) => cn(
    "p-2 rounded transition-colors text-sm font-semibold",
    isActive ? "bg-brand-primary/10 text-brand-primary" : "text-brand-text-secondary hover:bg-gray-100"
  );

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-100 sticky top-0 z-10 rounded-t-[12px]">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={getBtnClass(editor.isActive('bold'))}>B</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={getBtnClass(editor.isActive('italic'))}>I</button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={getBtnClass(editor.isActive('strike'))}>S</button>
      <div className="w-px h-6 bg-gray-300 mx-2" />
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={getBtnClass(editor.isActive('heading', { level: 1 }))}>H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={getBtnClass(editor.isActive('heading', { level: 2 }))}>H2</button>
      <div className="w-px h-6 bg-gray-300 mx-2" />
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
    
    // If nothing selected, just pulse or warn
    if (!selectedText.trim()) {
      alert("Please select some text to improve first.");
      return;
    }

    setIsImproving(true);
    try {
      const htmlSelection = editor.getHTML().substring(editor.state.selection.from, editor.state.selection.to);
      const improvedHtml = await improveWithAI(selectedText, "Make it punchier and more engaging.", state.demoMode);
      
      // Replace selection
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
      // Still allow continuation in Demo Mode
      if (state.demoMode) navigate('/distribution');
    } finally {
      setIsSaving(false);
    }
  };

  const CheckItem = ({ passed, label }) => (
    <div className="flex items-start gap-2 mb-3">
      <span className={cn("mt-0.5", passed ? "text-brand-success" : "text-brand-error")}>
        {passed ? '✓' : '✗'}
      </span>
      <span className={cn("text-sm", passed ? "text-brand-text" : "text-brand-text-secondary")}>{label}</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col md:flex-row gap-6 lg:gap-8">
      
      {/* Editor Area */}
      <div className="flex-grow w-full md:w-2/3 lg:w-3/4 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-brand-primary tracking-tight">Blog Editor</h1>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => saveBlog({...state.blog, content: editor?.getHTML()})} disabled={isSaving}>
              Save Draft
            </Button>
            <Button onClick={handleSaveAndContinue} isLoading={isSaving}>
              Continue to Distribution
            </Button>
          </div>
        </div>
        
        <Card className="flex-grow p-0 overflow-hidden flex flex-col min-h-[600px]">
          <MenuBar editor={editor} />
          <div className="flex-grow overflow-y-auto">
            <EditorContent editor={editor} className="h-full" />
          </div>
        </Card>
      </div>

      {/* Sidebars */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6 mt-14">
        
        {/* SEO Checklist */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-brand-primary/10 shadow-md">
          <h3 className="text-sm font-bold tracking-widest text-brand-text-secondary uppercase mb-4 border-b border-gray-100 pb-2">
            SEO CHECKLIST
          </h3>
          
          <div className="mb-6">
            <CheckItem passed={seoStats.h1Present} label="H1 heading present" />
            <CheckItem passed={seoStats.keywordInH1} label={`Keyword in H1 ("${state.blog?.keyword || 'none'}")`} />
            <CheckItem passed={seoStats.wordCount > 300} label={`Length > 300 words (${seoStats.wordCount})`} />
            <CheckItem passed={seoStats.readabilityGrade <= 9} label={`Readability Grade ≤ 9 (${seoStats.readabilityGrade})`} />
          </div>

          <Button 
            className="w-full shadow-sm bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20" 
            onClick={handleImproveWithAI}
            isLoading={isImproving}
          >
            <span className="mr-2">✨</span> IMPROVE WITH AI
          </Button>
          <p className="text-xs text-brand-text-secondary text-center mt-3">Select text to improve</p>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-sm font-bold tracking-widest text-brand-text-secondary uppercase mb-4 border-b border-gray-100 pb-2">
            QUICK ACTIONS
          </h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-brand-text-secondary hover:bg-gray-50 rounded transition-colors flex items-center gap-2">
              <span>🔄</span> Regenerate section
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-brand-text-secondary hover:bg-gray-50 rounded transition-colors flex items-center gap-2">
              <span>📊</span> See SEO score
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-brand-text-secondary hover:bg-gray-50 rounded transition-colors flex items-center gap-2">
              <span>🔍</span> Add internal link
            </button>
          </div>
        </Card>
        
      </div>
    </div>
  );
};
