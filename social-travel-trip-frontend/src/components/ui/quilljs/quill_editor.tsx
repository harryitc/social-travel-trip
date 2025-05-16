import * as React from 'react';
import Quill from './quilljs-2.0.2/core/quill';
import Delta from './quilljs-2.0.2/lib/quill-delta-5.1.0/Delta';
import { QuillFileUploaderConfig } from './config/quill_file_uploader.config';
import { EditorEvents } from './quilljs-2.0.2/extensions/events';
import { QuillContentConfig } from './config/quill_content.config';
import { FontColorsConfig } from './config/colors.config';
import { HighlightColorsConfig } from './config/highlight_colors.config';
import hljs from 'highlight.js';
import Toolbar from './quilljs-2.0.2/modules/toolbar';

/**
 * Quill sources
 */
type QuillEditorSources = 'api' | 'user' | 'silent';
/**
 * QuillEditor props
 */
interface IQuillEditorProps {
  id?: string;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
  theme?: 'bubble' | 'snow';
  contents?: Delta;
  onChange?: (contents: Delta) => void;
  toolbar?: any;
}
interface IQuillEditorState {
  contents: Delta;
}
//Default id
const defaultQuillEditorID = 'quill-editor';

/**
 * Toolbar options
 */
const toolbarOptions = [
  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  ['bold', 'italic', 'underline'], // toggled buttons + 'strike'
  [{ color: FontColorsConfig }, { background: HighlightColorsConfig }], // dropdown with defaults from theme
  [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
  // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  ['blockquote', 'code-block'],
  ['link', 'image', 'video'],
  [
    { table: 'horizontal' },
    // { 'table': 'vertical' }
  ],
  // [{ 'header': 1 }, { 'header': 2 }],               // custom button values

  // [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript

  // [{ 'direction': 'rtl' }],                         // text direction

  // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  // [{ 'font': [] }],
  ['clean'],
  ['fullscreen'],
];
/**
 * Quill editor
 */
class QuillEditor extends React.Component<IQuillEditorProps, IQuillEditorState> {
  // @ts-expect-error
  //Quill editor
  protected quill: Quill;
  protected timeChange = new Date();
  /**
   * Constructor
   * @param props
   */
  constructor(props: IQuillEditorProps) {
    super(props);
    try {
      const contents: Delta = props.contents ?? Delta.Empty;
      //Time
      contents.time = contents.time ?? new Date();
      //State
      this.state = {
        contents,
      };
    } catch (ex) {
      this.state = {
        // @ts-expect-error
        contents: null,
      };
    }
  }
  /**
   * Client side
   */
  componentDidMount(): void {
    this.initilizeQuill();
  }
  /**
   * Props change
   */
  static getDerivedStateFromProps(
    nextProps: IQuillEditorProps,
    prevState: IQuillEditorState,
  ): IQuillEditorState {
    if (nextProps.contents !== prevState.contents) {
      //Update state
      return {
        // @ts-expect-error
        contents: nextProps.contents,
      };
    }
    //Not change
    // @ts-expect-error
    return null;
  }
  /**
   * Check props change
   * @param prevProps
   * @param prevState
   * @returns
   */
  getSnapshotBeforeUpdate(
    prevProps: Readonly<IQuillEditorProps>,
    prevState: Readonly<IQuillEditorState>,
  ) {
    if (this.state.contents?.time === this.timeChange) {
      return null;
    }

    return true;
  }
  /**
   * Update quill contents when props change
   * @param prevProps
   * @param prevState
   * @param snapshot
   */
  componentDidUpdate(
    prevProps: Readonly<IQuillEditorProps>,
    prevState: Readonly<IQuillEditorState>,
    snapshot?: any,
  ): void {
    if (snapshot) {
      //Update quill contents
      this.quill.setContents(this.state.contents);
    }
  }
  /**
   * Protected
   */
  protected initilizeQuill = () => {
    /**
     * Props
     */
    const { placeholder, readOnly, theme, contents, id, onChange } = this.props;
    //Quill
    const Quilljs = require('./quilljs-2.0.2/quill');
    const Quill = Quilljs.default;
    //Set file uploader
    Quill.fileUploader = QuillFileUploaderConfig;
    //Set content config
    Quill.contentConfig = QuillContentConfig;
    //Modules
    const modules: any = {};

    //Check read only
    if (!readOnly) {
      //Syntax
      modules['syntax'] = { hljs };
      //Image resize
      const ImageResize = require('./modules/quill-image-resize').default;
      ImageResize.Quill = Quill;
      Quill.register('modules/imageResize', ImageResize);
      //Image drop
      const ImageDrop = require('./modules/quill-image-drop').default;
      Quill.register('modules/imageDrop', ImageDrop);
      //Image format
      const ImageFormat = require('./modules/quill-image-format').default;
      Quill.register(ImageFormat, true);
      //Modules
      modules['imageDrop'] = true;
      modules['imageResize'] = {
        modules: ['Resize', 'DisplaySize'],
        displaySize: true,
      };
      modules['toolbar'] = this.props.toolbar ?? toolbarOptions;
    }

    //Quill options
    const options = {
      debug: false,
      modules,
      placeholder,
      readOnly,
      theme: readOnly ? 'bubble' : (theme ?? 'snow'),
    };
    //Assign editor
    this.quill = new Quill(`#${id ?? defaultQuillEditorID}`, options);

    //Set contents
    // @ts-expect-error
    this.quill.setContents(contents);
    /**
     * Events
     */
    this.quill.on(
      EditorEvents.TEXT_CHANGE,
      (delta: Delta, oldDelta: Delta, source: QuillEditorSources) => {
        //Current contents
        const contents = this.getQuillContents();
        //Callback
        onChange && onChange(contents);
      },
    );
    this.quill.on(EditorEvents.CONTENT_CHANGE, () => {
      //Current contents
      const contents = this.getQuillContents();
      //Callback
      onChange && onChange(contents);
    });
    /**
     * Fullscreen
     */
    const btnFullscreen = document.querySelector('.ql-fullscreen');
    if (btnFullscreen) {
      btnFullscreen.classList.add('fullscreen');
      const k_fullscreen = 'data-is-fullscreen';
      const toolbar = this.quill.getModule('toolbar') as Toolbar;
      const quillContainer = toolbar.container?.parentElement;
      const exitFullscreen = () => {
        btnFullscreen.classList.remove('exit-fullscreen');
        btnFullscreen.classList.add('fullscreen');
        ///Toggle
        btnFullscreen.setAttribute(k_fullscreen, '');
      };
      const requestFullscreen = () => {
        btnFullscreen.classList.remove('fullscreen');
        btnFullscreen.classList.add('exit-fullscreen');
        btnFullscreen.setAttribute(k_fullscreen, 'fullscreen');
      };
      //Click
      btnFullscreen.addEventListener('click', () => {
        const isFullscreen = btnFullscreen.getAttribute(k_fullscreen);
        if (isFullscreen) {
          document.exitFullscreen();
        } else {
          // @ts-expect-error
          quillContainer.requestFullscreen();
          // @ts-expect-error
          quillContainer.classList.add('main-quilljs-fullscreen');
        }
      });
      //Listen ESC event
      document.addEventListener('fullscreenchange', (e) => {
        const isFullscreen = btnFullscreen.getAttribute(k_fullscreen);
        if (isFullscreen) {
          exitFullscreen();
          // @ts-expect-error
          quillContainer.classList.remove('main-quilljs-fullscreen');
        } else {
          requestFullscreen();
        }
      });
    }
  };
  /**
   * Get quill contents
   */
  private getQuillContents = (): Delta => {
    const contents = this.quill.getContents();
    this.timeChange = new Date();
    return Delta.new({
      ops: this.ConvertImageUrls(contents?.ops),
      time: this.timeChange,
    });
  };
  /**
   * Convert image urls
   * 1. Base64 --> url
   * 2. Remove root path
   * @param ops
   * @returns
   */
  private ConvertImageUrls = (ops: any[]): any[] => {
    const uploadedBase64Images = this.quill.uploadedBase64Images;
    const count = ops.length;
    let imageID: string, uploadedUrl: string;
    for (let i = 0; i < count; i++) {
      /**
       * Check base64 image
       */
      imageID = ops[i].attributes?.id;
      // @ts-expect-error
      uploadedUrl = uploadedBase64Images.get(imageID);
      if (uploadedUrl) {
        ops[i].insert.image = uploadedUrl;
        //NEXT
        continue;
      }
      /**
       * Replace root path
       */
      const imageUrl: string = ops[i].insert.image;
      const ImageRootPath = QuillContentConfig['ImageRootPath'];
      if (imageUrl?.startsWith(ImageRootPath)) {
        ops[i].insert.image = imageUrl.substring(ImageRootPath.length);
      }
    }
    ///Return new ops
    return ops;
  };
  /**
   * Render
   */
  render() {
    const { id, className } = this.props;
    return (
      <div className={'quilljs-container ' + (className ?? '')}>
        <div id={`${id ?? defaultQuillEditorID}`}></div>
      </div>
    );
  }
}
//Export
export { QuillEditor };
