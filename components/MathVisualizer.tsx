import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { AnalysisResult, VisualizationType } from '../types';
import { Info } from 'lucide-react';

interface MathVisualizerProps {
  data: AnalysisResult['visualization'];
}

const MathVisualizer: React.FC<MathVisualizerProps> = ({ data }) => {
  const { type, title, description, chartData, geometryData, xLabel, yLabel } = data;

  const renderContent = () => {
    switch (type) {
      case VisualizationType.LINE_GRAPH:
        return (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="name" 
                    label={{ value: xLabel || 'x', position: 'insideBottomRight', offset: -5 }} 
                />
                <YAxis 
                    label={{ value: yLabel || 'y', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} dot={{ r: 4 }} name="Function" />
                {chartData && chartData.length > 0 && 'value2' in chartData[0] && (
                     <Line type="monotone" dataKey="value2" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" name="Comparison" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case VisualizationType.BAR_CHART:
        return (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} name="Concept Value" />
                 {chartData && chartData.length > 0 && 'value2' in chartData[0] && (
                     <Bar dataKey="value2" fill="#82ca9d" radius={[4, 4, 0, 0]} name="Comparison" />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case VisualizationType.GEOMETRY:
        if (!geometryData) return <div className="text-gray-400 italic">No geometry data available</div>;
        return (
          <div className="w-full flex justify-center bg-white rounded-lg border border-gray-100 p-4">
            <svg 
              viewBox={geometryData.viewBox || "0 0 200 200"} 
              className="w-full h-64 max-w-md overflow-visible"
            >
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
                </marker>
              </defs>
              {geometryData.shapes.map((shape, idx) => {
                const { type, props } = shape;
                // Basic SVG rendering based on props
                if (type === 'circle') return <circle key={idx} {...props} />;
                if (type === 'rect') return <rect key={idx} {...props} />;
                if (type === 'line') return <line key={idx} strokeLinecap="round" {...props} />;
                if (type === 'path') return <path key={idx} strokeLinecap="round" strokeLinejoin="round" {...props} />;
                if (type === 'text') {
                    const { text, ...textProps } = props;
                    return (
                        <text key={idx} textAnchor="middle" dominantBaseline="middle" {...textProps}>
                            {text}
                        </text>
                    );
                }
                return null;
              })}
            </svg>
          </div>
        );

      default:
        return (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 bg-gray-50 rounded-lg">
                <Info className="w-8 h-8 mb-2 opacity-50" />
                <p>No visualization needed for this concept.</p>
            </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
          {type.replace('_', ' ')}
        </span>
      </div>
      
      <div className="p-6">
        {renderContent()}
        <p className="mt-4 text-sm text-slate-500 italic text-center">
          {description}
        </p>
      </div>
    </div>
  );
};

export default MathVisualizer;
