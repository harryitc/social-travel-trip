import Quill, { Parchment, Range } from './core/quill';
import {
  Bounds,
  DebugLevel,
  EmitterSource,
  ExpandedQuillOptions,
  QuillOptions,
} from './core/quill';

import Block, { BlockEmbed } from './blots/block';
import Break from './blots/break';
import Container from './blots/container';
import Cursor from './blots/cursor';
import Embed from './blots/embed';
import Inline from './blots/inline';
import Scroll from './blots/scroll';
import TextBlot from './blots/text';

import Clipboard from './modules/clipboard';
import History from './modules/history';
import Keyboard from './modules/keyboard';
import Delta, { Op, OpIterator, AttributeMap } from './lib/quill-delta-5.1.0/Delta';
import Input from './modules/input';
import UINode from './modules/uiNode';

export { default as Module } from './core/module';
export { Delta, Op, OpIterator, AttributeMap, Parchment, Range };
export type {
  Bounds,
  DebugLevel,
  EmitterSource,
  ExpandedQuillOptions,
  QuillOptions,
};

Quill.register({
  'blots/block': Block,
  'blots/block/embed': BlockEmbed,
  'blots/break': Break,
  'blots/container': Container,
  'blots/cursor': Cursor,
  'blots/embed': Embed,
  'blots/inline': Inline,
  'blots/scroll': Scroll,
  'blots/text': TextBlot,

  'modules/clipboard': Clipboard,
  'modules/history': History,
  'modules/keyboard': Keyboard,
  // 'modules/uploader': Uploader,
  'modules/input': Input,
  'modules/uiNode': UINode,
});

export default Quill;
