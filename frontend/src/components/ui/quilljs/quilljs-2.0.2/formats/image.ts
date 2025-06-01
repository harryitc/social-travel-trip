import { QuillContentConfig } from '../../config/quill_content.config';
import { EmbedBlot, Root } from '../lib/parchment-3.0.0/parchment';
import { sanitize } from './link';

const ATTRIBUTES = ['alt', 'height', 'width'];
const http = "http://"
const https = "https://"
const dataImage = "data:image/"
class Image extends EmbedBlot {
  static blotName = 'image';
  static tagName = 'IMG';
  constructor(scroll: Root, public domNode: HTMLImageElement) {
    super(scroll, domNode as Node);
  }

  static create(value: string) {
    const node = super.create(value) as Element;
    if (typeof value === 'string') {
      ///Check domain
      if (!(value.startsWith(http) || value.startsWith(https) || value.startsWith(dataImage))) {
        value = QuillContentConfig["ImageRootPath"] + value
      }

      node.setAttribute('src', this.sanitize(value));
    }
    return node;
  }

  static formats(domNode: Element) {
    return ATTRIBUTES.reduce(
      (formats: Record<string, string | null>, attribute) => {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      },
      {},
    );
  }

  static match(url: string) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static sanitize(url: string) {
    return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }

  static value(domNode: Element) {
    return domNode.getAttribute('src');
  }

  format(name: string, value: string) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

export default Image;
