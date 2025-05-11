import { resizeBase64Image } from "../../quilljs-2.0.2/extensions/resize_image";
import Quill from "../../quilljs-2.0.2/quill";
/**
 * Custom module for quilljs to allow user to drag images from their file system into the editor
 * and paste images from clipboard (Works on Chrome, Firefox, Edge, not on Safari)
 * @see https://quilljs.com/blog/building-a-custom-module/
 */
class ImageDrop {
    quill: Quill
    /**
     * Instantiate the module given a quill instance and any options
     * @param {Quill} quill
     * @param {Object} options
     */
    constructor(quill: Quill, options: any = {}) {
        // save the quill reference
        this.quill = quill;
        // bind handlers to this instance
        this.handleDrop = this.handleDrop.bind(this);
        this.handlePaste = this.handlePaste.bind(this);
        // listen for drop and paste events
        this.quill.root.addEventListener('drop', this.handleDrop, false);
        this.quill.root.addEventListener('paste', this.handlePaste, false);
    }

    /**
     * Handler for drop event to read dropped files from evt.dataTransfer
     * @param {Event} evt
     */
    handleDrop(evt: any) {
        evt.preventDefault();
        if (evt.dataTransfer && evt.dataTransfer.files && evt.dataTransfer.files.length) {
            if (document.caretRangeFromPoint) {
                const selection = document.getSelection();
                const range = document.caretRangeFromPoint(evt.clientX, evt.clientY);
                if (selection && range) {
                    selection.setBaseAndExtent(range.startContainer, range.startOffset, range.startContainer, range.startOffset);
                }
            }
            this.readFiles(evt.dataTransfer.files, (dataUrl: string) => {
                const selectionquill = this.quill.getSelection();
                // @ts-expect-error
                setTimeout(() => this.insert(dataUrl), selectionquill.index + 1);
            });

        }
    }

    /**
     * Handler for paste event to read pasted files from evt.clipboardData
     * @param {Event} evt
     */
    handlePaste(evt: any) {
        if (evt.clipboardData && evt.clipboardData.items && evt.clipboardData.items.length) {
            let range = this.quill.getSelection();
            let scrollTop = this.quill.scroll.domNode.scrollTop;
            this.quill.selection.update(Quill.sources.SILENT);

            this.readFiles(evt.clipboardData.items, (dataUrl: any) => {
                setTimeout(() => {
                    this.insert(dataUrl)
                    this.quill.setSelection(this.quill.getLength(), Quill.sources.SILENT);
                    this.quill.scroll.domNode.scrollTop = scrollTop;
                    this.quill.focus();
                }, 1);
            });
        }
    }

    /**
     * Insert the image into the document at the current cursor position
     * @param {String} dataUrl  The base64-encoded image URI
     */
    insert(dataUrl: string) {
        const selection: any = this.quill.getSelection()
        const index = selection?.index || this.quill.getLength();
        this.quill.insertEmbed(index, 'image', dataUrl, 'user');
    }

    /**
     * Extract image URIs a list of files from evt.dataTransfer or evt.clipboardData
     * @param {File[]} files  One or more File objects
     * @param {Function} callback  A function to send each data URI to
     */
    readFiles(files: any[], callback: Function) {
        // check each file for an image
        // xu ly voi file dang base 64 - neu la link hinh thi bo qua
        [].forEach.call(files, async (file: any) => {
            if (!file.type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp|vnd\.microsoft\.icon)/i)) {
                // file is not an image
                // Note that some file formats such as psd start with image/* but are not readable
                return;
            }
            // kiem tra xem co phai hinh 64 ko roi chinh sua
            // console.log(file);
            const blob: Blob = file.getAsFile ? file.getAsFile() : file
            const resizedImageBase64 = await resizeBase64Image(blob, file.type);
            callback(resizedImageBase64);
            // tam dong do nhu cau chua co
            // set up file reader phuc vu viec luu tru serve
            // const reader = new FileReader();


            // reader.onload = async (evt) => {
            //     console.log(evt);
            // };

            // read the clipboard item or file
            // if (blob instanceof Blob) {
            //     reader.readAsDataURL(blob);
            // }
        });
    }

}
export default ImageDrop