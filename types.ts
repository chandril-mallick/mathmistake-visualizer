export enum VisualizationType {
  LINE_GRAPH = 'line_graph',
  BAR_CHART = 'bar_chart',
  GEOMETRY = 'geometry',
  NONE = 'none'
}

export interface GeometryShape {
  type: 'circle' | 'rect' | 'line' | 'text' | 'path';
  props: Record<string, string | number>;
}

export interface AnalysisResult {
  mistake: string;
  hint: string;
  concept_explanation: string;
  visualization: {
    type: VisualizationType;
    title: string;
    description: string;
    // Data for charts
    chartData?: Array<{ name: string | number; value: number; value2?: number }>;
    // Data for geometry
    geometryData?: {
      viewBox: string;
      shapes: GeometryShape[];
    };
    // Axis labels for graphs
    xLabel?: string;
    yLabel?: string;
  };
}
