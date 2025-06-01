import * as React from "react"
import { QuillEditor } from "./quill_editor"
import Delta from "./quilljs-2.0.2/lib/quill-delta-5.1.0/Delta"
import LightGalleryCustom from "../LightGalleryCustom"
interface IQuillPreviewProps {
    id?: string
    className?: string
    contents: Delta
    disable_gallery?: boolean
}
class QuillPreview extends React.PureComponent<IQuillPreviewProps, any> {

    componentDidMount(): void {
        this.appendClassSelector()
    }

    appendClassSelector() {
        if (this.props.disable_gallery) {
            return
        }
        // Dùng cho Lightgallery
        const imgElements = document.querySelectorAll('.ql-editor img');
        imgElements.forEach(img => {
            const parentElement = img.parentNode as HTMLElement;
            if (parentElement) {
                const imgSrc = img.getAttribute('src') ?? ''
                let node_class = parentElement.getAttribute('class')
                parentElement.setAttribute('class', node_class + ' image-quilljs');
                parentElement.setAttribute('data-src', imgSrc);
            }
        });
        return
    }

    render() {
        const { id, contents, className } = this.props
        return (
            <LightGalleryCustom selector=".ql-editor .image-quilljs" stateFull={false}>
                <QuillEditor
                    className={className}
                    id={id ?? "quill-preview"}
                    readOnly={true}
                    contents={contents} />
            </LightGalleryCustom>
        )
    }
}
//Export
export { QuillPreview }