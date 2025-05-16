import { API_ENDPOINT } from "@/config/api.config"
import { environment } from "@/config/environment"
import Http from "@/lib/http"

/**
 * Convert image type to ext
 * bmp,gif,ico,jpg,png,svg,webp,x\-icon,svg+xml
 * @param imageType 
 * @returns 
 */
export const convertImageTypeToExt = (imageType: string) => {
    imageType = imageType.toLowerCase()
    switch (imageType) {
        case "image/png": return "png"
        case "image/apng": return "apng"
        case "image/avif": return "avif"
        case "image/jpg": return "jpg"
        case "image/jpeg": return "jpeg"
        case "image/bmp": return "bmp"
        case "image/gif": return "gif"
        case "image/ico": return "ico"
        case "image/x-icon": return "ico"
        case "image/svg": return "svg"
        case "image/webp": return "webp"
        case "image/svg+xml": return "svg"
        default: return "";
    }
}
/**
 * Upload a file from File Object
 * Return file url
 * @param file 
 * @returns 
 */
const QuillFileUploaderConfig = async (file: File): Promise<string> => {
    ///Build FormData
    const formData = new FormData()
    //Type
    formData.append('type', "image");
    formData.append('ext', convertImageTypeToExt(file.type))
    formData.append('resize1', JSON.stringify(2))
    // formData.append('scale', JSON.stringify(scaleImage))
    formData.append('files', file)
    //POST
    const uploadFileUrl = API_ENDPOINT.file_v2 + "/upload"
    ///Should return file url
    const res = await Http.post(uploadFileUrl, formData);
  
    const response = res.data;
    /**
     * {
                    "server_file_name": "FILEUPLOAD_284e5644-a7ca-4692-a597-6646fd150b95_202309151322523620.png",
                    "filePath": "/",
                    "file_name": "File name",
                    "file_size": 543077,
                    "file_hash": "UFHL3q~pD~nO:PtSY4M{Z2IU_N%MyXMwvft8",
                    "file_url": "http://eduzaa.api1.lamgigio.net/main-api/upload-v2/FILEUPLOAD_284e5644-a7ca-4692-a597-6646fd150b95_202309151322523620.png"
                }
     */
    const { file_url } = response._value.files[0] ?? {}
    const prefix = API_ENDPOINT.file_v2;
    return file_url.replace(prefix, '')
}

///Export
export { QuillFileUploaderConfig }