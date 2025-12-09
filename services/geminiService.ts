import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, VisualizationType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema: Schema = {
  type: Type.OBJECT,
  properties: {
    mistake: {
      type: Type.STRING,
      description: "A clear, concise explanation of the specific error the user made.",
    },
    hint: {
      type: Type.STRING,
      description: "A helpful hint to nudge the user toward the correct solution without giving the answer.",
    },
    concept_explanation: {
      type: Type.STRING,
      description: "A brief explanation of the mathematical concept involved.",
    },
    visualization: {
      type: Type.OBJECT,
      properties: {
        type: {
          type: Type.STRING,
          enum: [VisualizationType.LINE_GRAPH, VisualizationType.BAR_CHART, VisualizationType.GEOMETRY, VisualizationType.NONE],
          description: "The type of visualization that best explains the concept.",
        },
        title: {
          type: Type.STRING,
          description: "Title for the visualization.",
        },
        description: {
          type: Type.STRING,
          description: "Short caption for the visualization.",
        },
        xLabel: {
          type: Type.STRING,
          description: "Label for X axis if chart.",
        },
        yLabel: {
          type: Type.STRING,
          description: "Label for Y axis if chart.",
        },
        chartData: {
          type: Type.ARRAY,
          description: "Data for line or bar charts. Use 'name' for x-axis/category and 'value' for y-axis/measure. Use 'value2' for comparison if needed.",
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              value: { type: Type.NUMBER },
              value2: { type: Type.NUMBER },
            },
            required: ["name", "value"],
          },
        },
        geometryData: {
          type: Type.OBJECT,
          description: "Data for SVG geometry visualization.",
          properties: {
            viewBox: { type: Type.STRING, description: "SVG viewBox, e.g., '0 0 100 100'" },
            shapes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["circle", "rect", "line", "text", "path"] },
                  props: {
                    type: Type.OBJECT,
                    description: "Key-value pairs for SVG attributes (cx, cy, r, x, y, width, height, x1, y1, x2, y2, stroke, fill, d, fontSize, etc). Numbers should be numbers.",
                    properties: {
                      cx: { type: Type.NUMBER },
                      cy: { type: Type.NUMBER },
                      r: { type: Type.NUMBER },
                      x: { type: Type.NUMBER },
                      y: { type: Type.NUMBER },
                      width: { type: Type.NUMBER },
                      height: { type: Type.NUMBER },
                      x1: { type: Type.NUMBER },
                      y1: { type: Type.NUMBER },
                      x2: { type: Type.NUMBER },
                      y2: { type: Type.NUMBER },
                      stroke: { type: Type.STRING },
                      fill: { type: Type.STRING },
                      strokeWidth: { type: Type.NUMBER },
                      d: { type: Type.STRING },
                      text: { type: Type.STRING },
                    }
                  },
                },
                required: ["type", "props"],
              },
            },
          },
        },
      },
      required: ["type", "title"],
    },
  },
  required: ["mistake", "hint", "concept_explanation", "visualization"],
};

export async function analyzeMathProblem(imageBase64: string): Promise<AnalysisResult> {
  // Using gemini-2.5-flash as it is efficient and supports multimodal input well for this task.
  // The system instruction is crucial to prevent solving the problem.
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    Analyze the handwritten math problem in this image.
    1. Identify the specific mistake the user made.
    2. Do NOT solve the problem completely for them.
    3. Provide a hint.
    4. Generate a visualization configuration to explain the underlying concept.
       - Use 'line_graph' for algebra/functions.
       - Use 'bar_chart' for arithmetic comparisons or fractions.
       - Use 'geometry' for geometric shapes or visual proofs.
       - If 'geometry', provide SVG shapes coordinates assuming a viewBox (e.g., 0 0 200 200).
    Return the response in strictly valid JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4, // Lower temperature for more consistent structural output
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("No response from Gemini");
    }
    const result = JSON.parse(jsonText) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Error calling Gemini:", error);
    throw error;
  }
}
