// import { enable_youtube_iframe_api } from "youtube_iframe_api_loader"
import { VideoConfig } from '../../config/video.config';
import { BlockEmbed } from '../blots/block';
import Link from './link';
import { Root } from '../lib/parchment-3.0.0/parchment';

const ATTRIBUTES = ['height', 'width'];

/**
 * Phú
 * Sửa lại module của a Bảo
 */
const enable_youtube_iframe_api = ({ src, origin }: { src: string; origin: string }): string => {
  //Check src
  if (!src || typeof src !== 'string') {
    throw { error: 'Param src is not valid', src };
  }
  //Check origin
  if (!origin || typeof origin !== 'string') {
    throw { error: 'Param origin is not valid', origin };
  }
  //Check ?
  const andKey = src.indexOf('?') >= 0 ? '&' : '?';
  //Nếu có rồi thì không thêm nữa
  if (!checkString) {
    ///Enable iframe Api
    src += andKey + 'enablejsapi=1';
    //Set origin
    src += '&origin=' + origin;
    ///Return src with enablejsapi and origin params
  }
  return src;
};

// @ts-expect-error Fix me later
const checkString = (inputString) => {
  if (inputString.includes('enablejsapi') && inputString.includes('origin')) {
    return true;
  } else {
    return false;
  }
};

class Video extends BlockEmbed {
  static blotName = 'video';
  static className = 'ql-video';
  static tagName = 'IFRAME';
  // Constructor
  constructor(
    scroll: Root,
    public domNode: HTMLVideoElement,
  ) {
    super(scroll, domNode as HTMLElement);
  }
  static create(value: any) {
    const node = super.create(value) as HTMLElement;
    node.setAttribute('frameborder', '0');
    node.setAttribute('allowfullscreen', 'true');
    /**
     * Source src attribute
     */
    let src: string = this.sanitize(value);
    const isYoutubeShort = this.isYoutubeShort(src);
    if (!isYoutubeShort) {
      src = src.replace('//www.youtube.com/embed/', '//www.youtube-nocookie.com/embed/');
    } else {
      src = src.replace('//youtube.com/shorts/', '//www.youtube-nocookie.com/embed/');
      src = src.replace('//www.youtube.com/shorts/', '//www.youtube-nocookie.com/embed/');
    }

    /**
     * Relation rel attribute
     */
    if (VideoConfig.noRel === true) {
      node.setAttribute('rel', '0');
      // @ts-expect-error Fix me later
      src = enable_youtube_iframe_api({ src, origin: VideoConfig.origin });
    }
    //src
    node.setAttribute('src', src);
    ///Youtube ID
    const youtubeID = isYoutubeShort ? this.getYoutubeShortId(src) : this.getIdYoutube(src);
    //Iframe id
    // @ts-expect-error Fix me later
    node.setAttribute('id', youtubeID);
    //Type = youtube
    node.setAttribute('data-video-type', isYoutubeShort ? 'youtube-short' : 'youtube');
    //Return iframe
    return node;
  }
  /**
   * Check src is a Youtube short address
   * @param src
   */
  static isYoutubeShort(src: string): true | false {
    //Check string
    if (typeof src !== 'string') {
      return false;
    }
    //Check null
    if (!src) {
      return false;
    }
    //Check link
    return (
      src.startsWith('https://youtube.com/shorts/') ||
      src.startsWith('https://www.youtube.com/shorts/')
    );
  }
  /**
   * Get short id
   * @param src
   * @returns
   */
  static getYoutubeShortId(src: string): string {
    const url = new URL(src);
    //https://youtube.com/shorts/-gM2QVun_GA?si=DMyPjoedOOHUv7-0
    //-->pathname = /shorts/-gM2QVun_GA
    return url.pathname.substring(8);
  }
  static getIdYoutube(url: string) {
    let videoId = null;
    const urlParams = new URLSearchParams(new URL(url).search);
    if (urlParams.has('v')) {
      videoId = urlParams.get('v');
    } else {
      const mainUrl = url.substring(0, url.indexOf('?'));
      const embedIndex = mainUrl.indexOf('/embed/');
      if (embedIndex !== -1) {
        videoId = mainUrl.substring(embedIndex + 7);
      } else {
        const watchIndex = mainUrl.indexOf('/watch?v=');
        if (watchIndex !== -1) {
          videoId = mainUrl.substring(watchIndex + 9);
        }
      }
    }
    return videoId;
  }

  static getImageById(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/hq720.jpg`;
  }
  static formats(domNode: Element) {
    return ATTRIBUTES.reduce((formats: Record<string, string | null>, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static sanitize(url: string) {
    return Link.sanitize(url);
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

  html() {
    const { video } = this.value();
    return `<a href="${video}">${video}</a>`;
  }
}

export default Video;
