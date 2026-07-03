import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { v2 } from "cloudinary";
import { createHash } from "node:crypto";

const uploadFailed = new InternalServerErrorException("uploadFailed");

@Injectable()
export class CloudService {
  async uploadImage(base64: string): Promise<string> {
    try {
      const hash = createHash("md5").update(base64);
      const filename = hash.digest("base64");
      const result = await v2.uploader.upload(base64, {
        folder: "user_avatars",
        use_filename: true,
        unique_filename: false,
        filename_override: filename,
      });

      if (!result.secure_url) {
        throw uploadFailed;
      }

      return result.secure_url;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw uploadFailed;
    }
  }
}
