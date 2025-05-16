import { merge } from 'lodash-es';
import Emitter from '../core/emitter';
import BaseTheme, { BaseTooltip } from './base';
import LinkBlot from '../formats/link';
import { Range } from '../core/selection';
import { Icons } from '../ui/icons';
import Quill from '../core/quill';
import { Context } from '../modules/keyboard';
import Toolbar from '../modules/toolbar';
import { ToolbarConfig } from '../modules/toolbar';
import { ThemeOptions } from '../core/theme';

const TOOLBAR_CONFIG: ToolbarConfig = [
  [{ header: ['1', '2', '3', false] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
];

class SnowTooltip extends BaseTooltip {
  static TEMPLATE = [
    '<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>',
    '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">',
    '<a class="ql-action"></a>',
    `<a class="ql-action-more">
      <svg viewbox="0 0 374.116 374.116" width="18px" height="18px">
        <g>
          <path d="M344.058,207.506c-16.568,0-30,13.432-30,30v76.609h-254v-76.609c0-16.568-13.432-30-30-30c-16.568,0-30,13.432-30,30
            v106.609c0,16.568,13.432,30,30,30h314c16.568,0,30-13.432,30-30V237.506C374.058,220.938,360.626,207.506,344.058,207.506z"/>
          <path d="M123.57,135.915l33.488-33.488v111.775c0,16.568,13.432,30,30,30c16.568,0,30-13.432,30-30V102.426l33.488,33.488
            c5.857,5.858,13.535,8.787,21.213,8.787c7.678,0,15.355-2.929,21.213-8.787c11.716-11.716,11.716-30.71,0-42.426L208.271,8.788
            c-11.715-11.717-30.711-11.717-42.426,0L81.144,93.489c-11.716,11.716-11.716,30.71,0,42.426
            C92.859,147.631,111.855,147.631,123.57,135.915z"/>
        </g>
      </svg>
    </a>`,
    '<a class="ql-remove"></a>',
  ].join('');

  preview = this.root.querySelector('a.ql-preview');

  listen() {
    super.listen();
    const root = this.root;
    const _this = this;
    //* @ts-expect-error Fix me later
    // @ts-expect-error Fix me later
    root.querySelector('a.ql-action').addEventListener('click', (event) => {
      if (root.classList.contains('ql-editing')) {
        _this.save();
      } else {
        //* @ts-expect-error Fix me later
        // @ts-expect-error Fix me later
        _this.edit('link', _this.preview.textContent);
      }
      event.preventDefault();
    });
    // @ts-expect-error Fix me later
    root.querySelector('a.ql-action-more').addEventListener('click', (event) => {
      if (_this.root.getAttribute('data-mode') === 'image') {
        //Trigger upload file
        const handler = _this.toolbar.handlers['imageUpload'];
        handler.call(_this.toolbar);
      } else {
      }
      event.preventDefault();
    });
    //* @ts-expect-error Fix me later
    // @ts-expect-error Fix me later
    root.querySelector('a.ql-remove').addEventListener('click', (event) => {
      if (_this.linkRange != null) {
        const range = _this.linkRange;
        _this.restoreFocus();
        _this.quill.formatText(range, 'link', false, Emitter.sources.USER);
        delete _this.linkRange;
      }
      event.preventDefault();
      _this.hide();
    });
    _this.quill.on(Emitter.events.SELECTION_CHANGE, (range, oldRange, source) => {
      if (range == null) return;
      if (range.length === 0 && source === Emitter.sources.USER) {
        const [link, offset] = _this.quill.scroll.descendant(LinkBlot, range.index);
        if (link != null) {
          _this.linkRange = new Range(range.index - offset, link.length());
          const preview = LinkBlot.formats(link.domNode);
          //* @ts-expect-error Fix me later
          // @ts-expect-error Fix me later
          _this.preview.textContent = preview;
          //* @ts-expect-error Fix me later
          // @ts-expect-error Fix me later
          _this.preview.setAttribute('href', preview);
          _this.show();
          const bounds = _this.quill.getBounds(_this.linkRange);
          if (bounds != null) {
            _this.position(bounds);
          }
          return;
        }
      } else {
        delete _this.linkRange;
      }
      _this.hide();
    });
  }

  show() {
    super.show();
    this.root.removeAttribute('data-mode');
  }
}

class SnowTheme extends BaseTheme {
  constructor(quill: Quill, options: ThemeOptions) {
    if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
      options.modules.toolbar.container = TOOLBAR_CONFIG;
    }
    super(quill, options);
    this.quill.container.classList.add('ql-snow');
  }

  extendToolbar(toolbar: Toolbar) {
    if (toolbar.container != null) {
      toolbar.container.classList.add('ql-snow');
      this.buildButtons(toolbar.container.querySelectorAll('button'), Icons);
      this.buildPickers(toolbar.container.querySelectorAll('select'), Icons);
      // @ts-expect-error
      this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
      if (toolbar.container.querySelector('.ql-link')) {
        this.quill.keyboard.addBinding(
          { key: 'k', shortKey: true },
          (_range: Range, context: Context) => {
            toolbar.handlers.link.call(toolbar, !context.format.link);
          },
        );
      }
    }
  }
}
SnowTheme.DEFAULTS = merge({}, BaseTheme.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link(value: string) {
          const _this = this as any;
          if (value) {
            const range = _this.quill.getSelection();
            if (range == null || range.length === 0) return;
            let preview = _this.quill.getText(range);
            if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
              preview = `mailto:${preview}`;
            }
            // @ts-expect-error
            const { tooltip } = this.quill.theme;
            tooltip.edit('link', preview);
          } else {
            _this.quill.format('link', false, Quill.sources.USER);
          }
        },
      },
    },
  },
});
// } satisfies ThemeOptions);

export default SnowTheme;
