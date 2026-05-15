import { Response } from "express";

import {
  AuthRequest
} from "../../middleware/auth.middleware";

import {
  createDocument,
  listDocuments,
  updateDocument
} from "./document.service";

export const list = async (
  req: AuthRequest,
  res: Response
) => {
  const { workspaceId } = req.params;

  if (
    !workspaceId ||
    Array.isArray(workspaceId)
  ) {
    res.status(400).json({
      success: false,
      message:
        "Workspace id is required"
    });

    return;
  }

  const documents =
    await listDocuments(
      workspaceId
    );

  res.status(200).json({
    success: true,
    data: documents
  });
};

export const create = async (
  req: AuthRequest,
  res: Response
) => {
  const document =
    await createDocument({
      workspaceId:
        req.body.workspaceId,
      title: req.body.title,
      content: req.body.content,
      authorId: req.user!.userId
    });

  res.status(201).json({
    success: true,
    data: document
  });
};

export const update = async (
  req: AuthRequest,
  res: Response
) => {
  const { documentId } = req.params;

  if (
    !documentId ||
    Array.isArray(documentId)
  ) {
    res.status(400).json({
      success: false,
      message:
        "Document id is required"
    });

    return;
  }

  const document =
    await updateDocument({
      documentId:
        documentId,
      content: req.body.content,
      authorId: req.user!.userId
    });

  res.status(200).json({
    success: true,
    data: document
  });
};
