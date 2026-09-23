import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { getFallbackChatModel } from "../../config/langgraph.config";
import type { IATSSuggestionsResult, IATSScoreResult } from "../../interfaces/ats.interface";

// ─── ATS Score Graph ──────────────────────────────────────────────────────────

const ATSScoreState = Annotation.Root({
  resumeText: Annotation<string>,
  jobDescription: Annotation<string>,
  score: Annotation<number>,
  details: Annotation<string>,
});

const calculateScoreNode = async (state: typeof ATSScoreState.State) => {
  const model = getFallbackChatModel(0.1);
  const prompt = `As a technical ATS (Applicant Tracking System), calculate the match score (0-100) for this resume against the JD.

STRICT SCORING CRITERIA:
- 95-100%: Perfect match of core tech stack, even if project names differ.
- 90-95%: Strong match with synonymous technology (e.g., "MERN" matches a list of MongoDB, Express, React, Node).
- 80-90%: Good match, missing only minor non-essential skills.
- <70%: Significant gaps in core requirements.

RESUME:
${state.resumeText}

JOB DESCRIPTION:
${state.jobDescription}

RETURN ONLY JSON:
{ "score": number, "justification": "Explain why in 1-2 concise sentences." }`;

  const response = await model.invoke([
    new SystemMessage("You are an expert ATS scoring engine. Always output pure valid JSON."),
    new HumanMessage(prompt),
  ]);

  const rawText = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        score: typeof parsed.score === "number" ? parsed.score : 70,
        details: parsed.justification || "ATS analysis complete.",
      };
    } catch {
      // Fallback
    }
  }

  return {
    score: 70,
    details: "ATS compatibility assessed.",
  };
};

const atsScoreGraph = new StateGraph(ATSScoreState)
  .addNode("calculateScore", calculateScoreNode)
  .addEdge(START, "calculateScore")
  .addEdge("calculateScore", END)
  .compile();

export async function runATSScoreGraph(resumeText: string, jobDescription: string): Promise<IATSScoreResult> {
  const result = await atsScoreGraph.invoke({
    resumeText,
    jobDescription,
    score: 0,
    details: "",
  });

  return {
    score: result.score,
    details: result.details,
  };
}

// ─── ATS Suggestions Graph ───────────────────────────────────────────────────

const ATSSuggestionsState = Annotation.Root({
  resumeText: Annotation<string>,
  jobDescription: Annotation<string>,
  suggestions: Annotation<IATSSuggestionsResult>,
});

const generateSuggestionsNode = async (state: typeof ATSSuggestionsState.State) => {
  const model = getFallbackChatModel(0.2);
  const prompt = `You are an expert Career Coach and ATS Optimizer. 
Analyze the provided Resume and Job Description.

Resume:
${state.resumeText}

Job Description:
${state.jobDescription}

Provide a highly structured analysis of specific structural and content gaps. 
Do NOT give generic career advice like "tailor your resume". 
Instead, look for CONCRETE missing elements such as:
- Missing GitHub or Portfolio links.
- Missing Deployed/Live project URLs.
- Missing Contact Information (LinkedIn, Phone, etc.).
- Specific Technical Skills mentioned in the Job Description but absent from the Resume.
- Experience gaps where specific tools/technologies required are not found.

Return ONLY a JSON object with this exact structure:
{
  "improvements": [
    { "title": "Missing Live Project Links", "description": "Add deployed URLs for your 'Project X' to prove technical competence.", "impact": 85 }
  ],
  "missingKeywords": ["keyword1", "keyword2"],
  "missingSkills": ["skill1", "skill2"]
}

Ensure:
1. Exactly 3-4 concrete improvements with an "impact" percentage (0-100).
2. A list of missing keywords for ATS optimization.
3. A list of missing professional skills or experiences.

Return ONLY valid JSON.`;

  const response = await model.invoke([
    new SystemMessage("You are an ATS improvement generator. Return strictly valid JSON format only."),
    new HumanMessage(prompt),
  ]);

  const rawText = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]) as IATSSuggestionsResult;
      if (parsed.improvements && Array.isArray(parsed.improvements)) {
        return { suggestions: parsed };
      }
    } catch (e) {
      console.warn("Error parsing suggestions JSON:", e);
    }
  }

  return {
    suggestions: {
      improvements: [
        {
          title: "Align Key Technologies",
          description: "Incorporate primary frameworks and libraries mentioned in the job description into your skills and project sections.",
          impact: 80,
        },
      ],
      missingKeywords: ["Relevant Tools", "Technical Workflow"],
      missingSkills: ["Domain Specific Skills"],
    },
  };
};

const atsSuggestionsGraph = new StateGraph(ATSSuggestionsState)
  .addNode("generateSuggestions", generateSuggestionsNode)
  .addEdge(START, "generateSuggestions")
  .addEdge("generateSuggestions", END)
  .compile();

export async function runATSSuggestionsGraph(
  resumeText: string,
  jobDescription: string
): Promise<IATSSuggestionsResult> {
  const result = await atsSuggestionsGraph.invoke({
    resumeText,
    jobDescription,
    suggestions: {
      improvements: [],
      missingKeywords: [],
      missingSkills: [],
    },
  });

  return result.suggestions;
}
