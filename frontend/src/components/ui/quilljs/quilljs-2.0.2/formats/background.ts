import { ClassAttributor, Scope } from '../lib/parchment-3.0.0/parchment';
import { ColorAttributor } from './color';

const BackgroundClass = new ClassAttributor('background', 'ql-bg', {
  scope: Scope.INLINE,
});
const BackgroundStyle = new ColorAttributor('background', 'background-color', {
  scope: Scope.INLINE,
});

export { BackgroundClass, BackgroundStyle };
