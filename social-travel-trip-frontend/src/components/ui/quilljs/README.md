# Quilljs
1. Source code: ```/packages/quilljs```
2. Assets
- ```/public/assets/plugins/quilljs```
3. Import css in ```_document.tsx```
4. contents: Delta
- https://quilljs.com/docs/delta/
5. ```QuillEditor```
```
    <QuillEditor
        id="quill-editor"
        onChange={this.editorChangeHandler}
        contents={
            contents
        }
        readOnly={false}
        placeholder='Nhập nội dung...' />
```
6. ```QuillPreview```
```
    <QuillPreview
        id="quill-preview"
        className='quill-preview'
        contents={
            contents
        } />
```
7. Sample
- Page: http://localhost:3000/quill-editor