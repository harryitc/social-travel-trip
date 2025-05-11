import { ClassAttributor, Scope, StyleAttributor } from '../lib/parchment-3.0.0/parchment';

const config = {
  scope: Scope.INLINE,
  whitelist: ['serif', 'monospace'],
};

const FontClass = new ClassAttributor('font', 'ql-font', config);

class FontStyleAttributor extends StyleAttributor {
  value(node: HTMLElement) {
    return super.value(node).replace(/["']/g, '');
  }
}

const FontStyle = new FontStyleAttributor('font', 'font-family', config);

export { FontStyle, FontClass };
