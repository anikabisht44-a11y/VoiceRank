import React from 'react';
import { Card, Button, cn } from '../components/ui';
import { useAppContext } from '../context/AppContext';

export const Dashboard = () => {
  const { state } = useAppContext();

  // Mock metrics for hackathon live demo
  const metrics = [
    { label: "Est. Traffic Growth", value: "+248%", color: "text-brand-success" },
    { label: "Avg. SEO Score", value: "88/100", color: "text-brand-primary" },
    { label: "Content Managed", value: "1.2k", color: "text-brand-primary" },
    { label: "Human Rank Prob.", value: "94%", color: "text-brand-success" }
  ];

  const opportunities = [
    { title: "SERP Gap: Personal Finance", impact: "High", desc: "Competitors lack local taxation depth in Bangalore region." },
    { title: "Conversion Friction: Navbar", impact: "Medium", desc: "User dropoff detected at 'Price' page on mobile." },
    { title: "SEO Risk: Duplicate Titles", impact: "Critical", desc: "3 blogs share identical H1. Need unique clustering." }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary tracking-tight uppercase">PRODUCT ANALYSIS & GROWTH</h1>
          <p className="text-brand-text-secondary mt-1 flex items-center gap-2">
            Strategic Growth Simulation 
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              PREDICTIVE DATA
            </span>
          </p>
        </div>
        <Button variant="secondary" className="border-2 border-brand-primary/10">Export PDF Report</Button>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((m, i) => (
          <Card key={i} className="flex flex-col items-center justify-center py-8 border-brand-primary/5 shadow-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{m.label}</span>
            <span className={cn("text-3xl font-black", m.color)}>{m.value}</span>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Conversion Funnel */}
        <Card className="lg:col-span-7 p-0 overflow-hidden border-brand-primary/10">
          <div className="bg-brand-primary p-4">
            <h2 className="text-white text-xs font-bold uppercase tracking-widest">CONVERSION FUNNEL FRICTION POINTS</h2>
          </div>
          <div className="p-8 flex flex-col gap-4">
            <div className="relative h-12 bg-brand-primary/10 rounded-full flex items-center px-6 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 bg-brand-primary w-[95%] opacity-20" />
              <span className="relative z-10 text-xs font-bold text-brand-primary">KEYWORD RESEARCH (95% Completion)</span>
            </div>
            <div className="relative h-12 bg-brand-primary/10 rounded-full flex items-center px-6 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 bg-brand-primary w-[82%] opacity-15" />
              <span className="relative z-10 text-xs font-bold text-brand-primary">STRATEGIC ALIGNMENT (82% Completion)</span>
              <span className="ml-auto relative z-10 text-[10px] font-black text-brand-error">FRICTION POINT: Lack of Geo-context</span>
            </div>
            <div className="relative h-12 bg-brand-primary/10 rounded-full flex items-center px-6 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 bg-brand-primary w-[64%] opacity-10" />
              <span className="relative z-10 text-xs font-bold text-brand-primary">BLOG GENERATION (64% Completion)</span>
            </div>
            <div className="relative h-12 bg-brand-primary/10 rounded-full flex items-center px-6 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 bg-brand-primary w-[45%] opacity-5" />
              <span className="relative z-10 text-xs font-bold text-brand-primary">CROSS-PLATFORM PUBLISHING (45% Completion)</span>
            </div>
          </div>
        </Card>

        {/* Strategic Gaps */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h2 className="text-sm font-black text-brand-primary uppercase tracking-widest px-2 border-l-4 border-brand-secondary">
            GROWTH OPPORTUNITIES
          </h2>
          {opportunities.map((o, i) => (
            <Card key={i} className="group hover:border-brand-primary/40 transition-all cursor-pointer bg-white">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-brand-text group-hover:text-brand-primary transition-colors">{o.title}</h3>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter",
                  o.impact === "Critical" ? "bg-brand-error/10 text-brand-error" : 
                  o.impact === "High" ? "bg-brand-secondary/10 text-brand-secondary" : 
                  "bg-gray-100 text-gray-400"
                )}>
                  {o.impact} IMPACT
                </span>
              </div>
              <p className="text-xs text-brand-text-secondary leading-relaxed">{o.desc}</p>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-6">
        <div className="w-12 h-12 bg-brand-success/20 rounded-full flex items-center justify-center text-brand-success text-xl">🚀</div>
        <div>
          <h4 className="font-bold text-brand-primary">Next Action for 10x Scale</h4>
          <p className="text-xs text-brand-text-secondary">Execute the "India-Specific Clustering" strategy to capture 42k additional monthly unique visitors.</p>
        </div>
        <Button className="ml-auto">Execute Now</Button>
      </div>
    </div>
  );
};
