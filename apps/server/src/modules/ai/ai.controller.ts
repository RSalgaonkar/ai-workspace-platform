import { Response } from "express";

import {
  AuthRequest
} from "../../middleware/auth.middleware";

import {
  recordActivity
} from "../activity/activity.service";

export const assistant = async (
  req: AuthRequest,
  res: Response
) => {
  const prompt =
    String(req.body.prompt ?? "").trim();

  if (!prompt) {
    res.status(400).json({
      success: false,
      message: "Prompt is required"
    });

    return;
  }

  await recordActivity({
    type: "AI_ASSISTANT_USED",
    title: "Asked the AI assistant",
    actorId: req.user!.userId,
    workspaceId: req.body.workspaceId,
    metadata: {
      prompt
    }
  });

  res.status(200).json({
    success: true,
    data: {
      answer:
        "AI assistant integration is ready for a model provider. Add an API key and replace this deterministic response with a provider call.",
      nextActions: [
        "Summarize recent channel activity",
        "Draft a project update",
        "Find decisions across documents and messages"
      ]
    }
  });
};
