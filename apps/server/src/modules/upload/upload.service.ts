import {
  mkdir,
  writeFile
} from "fs/promises";

import path from "path";

import prisma from "../../lib/prisma";

import {
  recordActivity
} from "../activity/activity.service";

import {
  indexEntity
} from "../search/indexer.service";

const uploadRoot = path.join(
  process.cwd(),
  "uploads"
);

const sanitizeFileName = (
  fileName: string
) =>
  fileName.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  );

export const saveUploadedFile = async (data: {
  fileName: string;
  mimeType: string;
  base64: string;
  uploaderId: string;
  workspaceId?: string;
}) => {
  await mkdir(uploadRoot, {
    recursive: true
  });

  const buffer = Buffer.from(
    data.base64,
    "base64"
  );

  const storageKey = `${Date.now()}-${sanitizeFileName(
    data.fileName
  )}`;

  const absolutePath = path.join(
    uploadRoot,
    storageKey
  );

  await writeFile(
    absolutePath,
    buffer
  );

  const file =
    await prisma.fileAsset.create({
      data: {
        fileName: data.fileName,
        mimeType: data.mimeType,
        size: buffer.length,
        storageKey,
        url: `/uploads/${storageKey}`,
        uploaderId: data.uploaderId,
        workspaceId: data.workspaceId
      }
    });

  await recordActivity({
    type: "FILE_UPLOADED",
    title: `Uploaded ${data.fileName}`,
    actorId: data.uploaderId,
    workspaceId: data.workspaceId,
    metadata: {
      fileId: file.id,
      mimeType: data.mimeType,
      size: buffer.length
    }
  });

  if (data.workspaceId) {
    await indexEntity({
      workspaceId: data.workspaceId,
      entityType: "FILE",
      entityId: file.id,
      title: file.fileName,
      body: `${file.fileName} ${file.mimeType}`,
      metadata: {
        size: file.size,
        url: file.url
      }
    });
  }

  return file;
};
