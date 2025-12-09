import React, { useState } from 'react';
import { analyzeMathProblem } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import MathVisualizer from './components/MathVisualizer';
import { AnalysisResult } from './types';
import { Loader2, Lightbulb, AlertTriangle, GraduationCap, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasImage, setHasImage] = useState(false);

  const handleImageSelected = async (base64: string) => {
    setHasImage(true);
    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeMathProblem(base64);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError("Unable to analyze the image. Please try again with a clearer photo.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">Mistake<span className="text-indigo-600">Fixer</span></span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Input */}
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">1. Upload your problem</h2>
              <p className="text-slate-600">Take a photo of your handwritten math. We'll find the mistake without giving the answer.</p>
            </div>
            
            <ImageUploader 
              onImageSelected={handleImageSelected} 
              isLoading={analyzing} 
            />

            {analyzing && (
              <div className="p-6 bg-white rounded-xl border border-indigo-100 shadow-sm flex items-center gap-4 animate-pulse">
                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
            )}
            
            {error && (
               <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3">
                 <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                 <p>{error}</p>
               </div>
            )}
          </section>

          {/* Right Column: Output */}
          <section className="flex flex-col gap-6">
            <div className={`${!result && !analyzing ? 'opacity-50' : ''}`}>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">2. Understanding the Concept</h2>
              <p className="text-slate-600">See where you went wrong and visualize the correct logic.</p>
            </div>

            {!result && !analyzing && !hasImage && (
              <div className="h-96 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <ArrowRight className="w-8 h-8 mb-4 opacity-50" />
                <p>Results will appear here</p>
              </div>
            )}

            {result && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Mistake Analysis Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">The Mistake</h3>
                      <p className="text-slate-600 leading-relaxed">{result.mistake}</p>
                    </div>
                  </div>
                </div>

                {/* Concept Visualizer */}
                <MathVisualizer data={result.visualization} />

                {/* Hint Card */}
                <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-indigo-900 mb-1">Hint</h3>
                      <p className="text-indigo-800 leading-relaxed">{result.hint}</p>
                    </div>
                  </div>
                </div>
                
                {/* Concept Explanation */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                   <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Key Concept</h3>
                   <p className="text-slate-700">{result.concept_explanation}</p>
                </div>

              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
};

export default App;
