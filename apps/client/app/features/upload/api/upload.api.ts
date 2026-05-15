import api from "@/lib/axios";

const readFileAsBase64 = (
  file: File
) =>
  new Promise<string>(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        const result =
          String(reader.result);
        resolve(
          result.split(",")[1] ??
            result
        );
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    }
  );

export const uploadFile =
  async (
    file: File,
    workspaceId?: string | null
  ) => {
    const base64 =
      await readFileAsBase64(file);

    const response =
      await api.post("/uploads", {
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        base64,
        workspaceId
      });

    return response.data;
  };
