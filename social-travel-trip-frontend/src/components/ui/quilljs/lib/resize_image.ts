import Resizer from "react-image-file-resizer";
import { ImageConfig } from "../config/image.config";
/**
 * ```react-image-file-resizer``` only accepts: ```PNG, JPEG, WEBP```
 * @param type
 * @returns
 */
const convertImageType = (type?: string): string => {
    if (!type) return "PNG";

    switch (type.toLowerCase()) {
        case "image/png":
            return "PNG"
        case "image/jpg":
            return "JPEG"
        case "image/jpeg":
            return "JPEG"
        case "image/webp":
            return "WEBP"
        default:
            return "PNG"
    }
}
export const resizeBase64Image = (base64Image: Blob, type?: string) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            base64Image,
            ImageConfig.maxWidth,
            ImageConfig.maxHeight,
            convertImageType(type),
            100,
            0,
            (uri) => {
                console.log("uri === ", type, type || "png", uri)
                resolve(uri);
            },
            "base64"
        );
    });
