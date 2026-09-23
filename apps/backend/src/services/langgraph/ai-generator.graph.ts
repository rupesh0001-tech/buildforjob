import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { getFallbackChatModel } from "../../config/langgraph.config";

// ─── AI Text Generation & Optimizer Graph ────────────────────────────────────

const AIGeneratorState = Annotation.Root({
  prompt: Annotation<string>,
  systemPrompt: Annotation<string>,
  temperature: Annotation<number>,
  output: Annotation<string>,
});

const generateTextNode = async (state: typeof AIGeneratorState.State) => {
  const model = getFallbackChatModel(state.temperature ?? 0.3);

  const formatInstruction =
    "IMPORTANT: Return ONLY the exact raw text requested. Do NOT include any introductory or concluding text (such as 'Here is...', 'Certainly!', 'generated summary:', etc.), markdown code blocks, quotes, or conversational filler. Return ONLY the direct content itself.";

  const fullPrompt = `${state.prompt}\n\n${formatInstruction}`;
  const fullSystemMessage = `${state.systemPrompt || "You are a professional resume builder and career assistant."} Return ONLY the direct requested content, with no conversational filler or extraneous commentary.`;

  const response = await model.invoke([
    new SystemMessage(fullSystemMessage),
    new HumanMessage(fullPrompt),
  ]);

  let generatedText = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
  generatedText = generatedText.trim();

  // Clean up any extraneous markdown wrapper if accidentally returned
  if (generatedText.startsWith("```") && generatedText.endsWith("```")) {
    generatedText = generatedText.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
  }

  return {
    output: generatedText,
  };
};

const aiGeneratorGraph = new StateGraph(AIGeneratorState)
  .addNode("generateText", generateTextNode)
  .addEdge(START, "generateText")
  .addEdge("generateText", END)
  .compile();

/**
 * Runs the LangGraph AI text generation graph.
 */
export async function runAIGeneratorGraph(
  prompt: string,
  systemPrompt = "You are a professional resume builder assistant.",
  temperature = 0.3
): Promise<string> {
  const result = await aiGeneratorGraph.invoke({
    prompt,
    systemPrompt,
    temperature,
    output: "",
  });

  return result.output;
}
