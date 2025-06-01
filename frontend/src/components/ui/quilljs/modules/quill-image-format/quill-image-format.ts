import BaseImageFormat from "../../quilljs-2.0.2/formats/image"
const ImageFormatAttributesList = [
    'alt',
    'height',
    'width',
    'id',
];

class ImageFormat extends BaseImageFormat {
    static formats(domNode: any) {
        return ImageFormatAttributesList.reduce(function (formats, attribute) {
            if (domNode.hasAttribute(attribute)) {
                // @ts-expect-error
                formats[attribute] = domNode.getAttribute(attribute);
            }
            return formats;
        }, {});
    }
    format(name: string, value: string) {
        const domNode = this.domNode as HTMLElement
        if (ImageFormatAttributesList.indexOf(name) > -1) {
            if (value) {
                domNode.setAttribute(name, value);
            } else {
                domNode.removeAttribute(name);
            }
        } else {
            super.format(name, value);
        }
    }
}
//Export
export default ImageFormat