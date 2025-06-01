import { QuillEditor } from './quill_editor';
import { QuillPreview } from './quill_preview';
import Delta from './quilljs-2.0.2/lib/quill-delta-5.1.0/Delta';
/**
 * Get delta text from contents
 * @param contents
 * @returns
 */
const getDeltaText = (contents: Delta) => {
  return contents.ops
    .filter(function (op) {
      return typeof op.insert === 'string';
    })
    .map(function (op) {
      return op.insert;
    })
    .join('');
};
/**
 * Check media
 * @param contents
 * @returns
 */
const isMediaDelta = (contents: Delta) => {
  const count = contents.ops.length;
  for (let i = 0; i < count; i++) {
    if (typeof contents.ops[i].insert !== 'string') {
      return true;
    }
  }
  //False
  return false;
};
/**
 * Check delta empty
 * isEmpty = Delta only contains \s characters
 */
const isDeltaEmpty = (_delta: Delta | { ops: any[] }) => {
  const delta = _delta instanceof Delta ? _delta : Delta.new(_delta);
  if (isMediaDelta(delta)) {
    return false;
  }
  const text = (getDeltaText(delta) ?? '').replace(/\s/g, '');
  return !text;
};
//Export
export { QuillEditor, QuillPreview, getDeltaText, isDeltaEmpty, isMediaDelta };
export type { Delta };
