import type { Request, Response, NextFunction } from 'express';
import { runAIGeneratorGraph } from '../../services/langgraph/ai-generator.graph';
import { deductTokens } from '../../utils/token.utils';

export async function generateAIContent(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { prompt, type } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    // Deduct 0.5 tokens for AI features
    try {
      await deductTokens(userId, 0.5);
    } catch (tokenErr: any) {
      return res.status(403).json({ 
        success: false, 
        errorType: 'INSUFFICIENT_TOKENS', 
        message: tokenErr.message 
      });
    }

    try {
      const generatedText = await runAIGeneratorGraph(
        prompt,
        "You are a professional resume builder assistant. Return ONLY the exact requested text without any introductions, headers, quotes, formatting markdown (unless requested), or conversational filler."
      );

      return res.json({
        success: true,
        data: {
          text: generatedText
        }
      });
    } catch (aiErr: any) {
      console.error("LangGraph AI generation failed:", aiErr.message);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to generate AI content using LangGraph models." 
      });
    }
  } catch (error) {
    next(error);
  }
}
