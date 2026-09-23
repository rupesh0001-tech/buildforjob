import type { Request, Response, NextFunction } from 'express';
import { HumanMessage, AIMessage, SystemMessage, BaseMessage } from '@langchain/core/messages';
import { runAssistantGraph } from '../../services/langgraph/assistant.graph';
import { scrapeCompanyCareers } from '../../services/langgraph/tools/career-scraper.tool';
import { deductTokens } from '../../utils/token.utils';

export interface ChatHistoryItem {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Chat with the official AI Assistant
 */
export async function chatWithAssistant(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { message, history } = req.body;
    if (!message && (!history || history.length === 0)) {
      return res.status(400).json({ success: false, message: 'Message or history is required' });
    }

    // Deduct 0.25 tokens for chat interactions
    try {
      await deductTokens(userId, 0.25);
    } catch (tokenErr: any) {
      return res.status(403).json({
        success: false,
        errorType: 'INSUFFICIENT_TOKENS',
        message: tokenErr.message,
      });
    }

    const langChainMessages: BaseMessage[] = [];

    // Reconstruct conversation history
    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.role === 'user') {
          langChainMessages.push(new HumanMessage(item.content));
        } else if (item.role === 'assistant') {
          langChainMessages.push(new AIMessage(item.content));
        } else if (item.role === 'system') {
          langChainMessages.push(new SystemMessage(item.content));
        }
      }
    }

    if (message) {
      langChainMessages.push(new HumanMessage(message));
    }

    const result = await runAssistantGraph(langChainMessages, userId);
    const lastMsg = result.messages[result.messages.length - 1];
    const replyText = lastMsg && typeof lastMsg.content === 'string'
      ? lastMsg.content
      : lastMsg
      ? JSON.stringify(lastMsg.content)
      : "I am ready to help you navigate BuildForJob and optimize your career tools.";

    // Check if any tool messages contained scraped job data
    let scrapedJob = null;
    for (const msg of result.messages) {
      if (msg._getType() === 'tool' || (msg as any).name === 'scrape_company_careers') {
        try {
          const parsed = JSON.parse(typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content));
          if (parsed && parsed.jobDescription) {
            scrapedJob = parsed;
          }
        } catch {
          // ignore non-json tool contents
        }
      }
    }

    return res.json({
      success: true,
      data: {
        reply: replyText,
        scrapedJob,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Direct endpoint to scrape career details for a company and role
 */
export async function scrapeCareerJob(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { company, role, location } = req.body;
    if (!company || !role) {
      return res.status(400).json({ success: false, message: 'Company and role are required' });
    }

    const result = await scrapeCompanyCareers(company, role, location);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
