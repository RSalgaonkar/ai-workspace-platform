import { Response } from "express";

import {
  AuthRequest
} from "../../middleware/auth.middleware";

import {
  saveUploadedFile
} from "./upload.service";

export const uploadFile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      fileName,
      mimeType,
      base64,
      workspaceId
    } = req.body;

    if (
      !fileName ||
      !mimeType ||
      !base64
    ) {
      res.status(400).json({
        success: false,
        message:
          "fileName, mimeType, and base64 are required"
      });

      return;
    }

    const file =
      await saveUploadedFile({
        fileName,
        mimeType,
        base64,
        workspaceId,
        uploaderId:
          req.user!.userId
      });

    res.status(201).json({
      success: true,
      data: file
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    });
  }
};
