import { getBlurHash } from "@common/utils/image";
import { FILE_TYPE } from "../const";
import { parseViewType, getFile } from "../utils/file";
import path from "path";

export class FileEntity {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    destination: string
    filename: string
    path: string
    size: number

    constructor(args?) {
        const {
            fieldname,
            originalname,
            encoding,
            mimetype,
            destination,
            filename,
            path,
            size,
        } = args || {}
        this.fieldname = fieldname;
        this.originalname = originalname;
        this.encoding = encoding;
        this.mimetype = mimetype;
        this.destination = destination;
        this.filename = filename;
        this.path = path;
        this.size = size;
    }
}

export class File {
    file_system_id: string;
    file_type: string;
    client_filename: string;
    server_filename: string;
    file_group: string;
    filepath: string;
    file_ext: string;
    view_type: string;
    url: string;
    user_create: string;
    user_update: string;
    file_size: string;
    time_create: string;
    time_update: string;
    resize_path: any;

    domain: string;
    blur_hash?: string;

    constructor(args?) {
        const {
            file_system_id,
            file_type,
            client_filename,
            server_filename,
            file_group,
            filepath,
            file_ext,
            view_type,
            user_create,
            user_update,
            file_size,
            resize_path,
            time_create,
            time_update,
        } = args || {}

        this.file_system_id = file_system_id;
        this.file_type = file_type;
        this.client_filename = client_filename;
        this.server_filename = server_filename;
        this.file_group = file_group;
        this.filepath = filepath;
        this.file_ext = file_ext;
        this.view_type = view_type;
        this.user_create = user_create;
        this.user_update = user_update;
        this.file_size = file_size;
        this.resize_path = resize_path;
        this.time_create = time_create;
        this.time_update = time_update;
        this.url = path.join(filepath, server_filename);
        this.domain = `${process.env.FILE_LINK}/${process.env.FILE_DIRECTORY_V2}`;
    }

    async setBlurHash() {
        let viewType = parseViewType(this.file_type)
        switch (viewType) {
            case FILE_TYPE.IMAGE:
                try {
                    this.blur_hash = await getBlurHash(getFile(`./${process.env.FILE_DIRECTORY_V2}/${this.filepath}`, this.server_filename));
                } catch (error) {
                    this.blur_hash = "";
                }
                break;
            default:
                break;
        }
    }
}

export interface IFile {
    server_file_name: string;
    file_name: string;
    file_hash: string;
}