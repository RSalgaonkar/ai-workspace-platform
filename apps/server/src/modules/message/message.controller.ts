import { Response } from "express";

import {
  AuthRequest
} from "../../middleware/auth.middleware";

import {
  createMessage,
  getMessages,
  getThreadMessages,
  toggleReaction
} from "./message.service";

export const listByChannel =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const { channelId } = req.params;

      if (
        !channelId ||
        Array.isArray(channelId)
      ) {
        res.status(400).json({
          success: false,
          message: "Channel id is required"
        });

        return;
      }

      const messages =
        await getMessages(
          channelId
        );

      res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error
      });
    }
  };

export const create =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const message =
        await createMessage(
          req.body.channelId,
          req.user!.userId,
          req.body.content,
          req.body.attachmentIds ?? [],
          req.body.parentId
        );

      res.status(201).json({
        success: true,
        data: message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error
      });
    }
  };

export const thread =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const { messageId } = req.params;

      if (
        !messageId ||
        Array.isArray(messageId)
      ) {
        res.status(400).json({
          success: false,
          message:
            "Message id is required"
        });

        return;
      }

      const messages =
        await getThreadMessages(
          messageId
        );

      res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error
      });
    }
  };

export const react =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const { messageId } = req.params;

      if (
        !messageId ||
        Array.isArray(messageId)
      ) {
        res.status(400).json({
          success: false,
          message:
            "Message id is required"
        });

        return;
      }

      const result =
        await toggleReaction(
          messageId,
          req.user!.userId,
          req.body.emoji
        );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error
      });
    }
  };
