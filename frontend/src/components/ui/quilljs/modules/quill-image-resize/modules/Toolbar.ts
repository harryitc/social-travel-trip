import { Parchment } from '../../../quilljs-2.0.2/core';
import { BaseModule } from './BaseModule';

const MarginStyle = new Parchment.StyleAttributor('margin', 'margin');
const DisplayStyle = new Parchment.StyleAttributor('display', 'display');
const AlignStyle = new Parchment.StyleAttributor('align', 'text-align');

export class Toolbar extends BaseModule {
  // @ts-expect-error
  toolbar: HTMLElement;
  // @ts-expect-error
  alignments: any[];
  onCreate = () => {
    // Setup Toolbar
    this.toolbar = document.createElement('div');
    Object.assign(this.toolbar.style, this.options.toolbarStyles);
    this.overlay.appendChild(this.toolbar);

    // Setup Buttons
    this._defineAlignments();
    this._addToolbarButtons();
  };

  // The toolbar and its children will be destroyed when the overlay is removed
  onDestroy = () => {};

  // Nothing to update on drag because we are are positioned relative to the overlay
  onUpdate = () => {};

  _defineAlignments = () => {
    const icons = this.quillOptions['icons'];
    this.alignments = [
      {
        icon: icons['align'][''],
        apply: () => {
          DisplayStyle.add(this.img, 'block');
          AlignStyle.add(this.img, 'left');
          MarginStyle.add(this.img, '1em auto 1em 1em');
        },
        isApplied: () => AlignStyle.value(this.img) == 'left',
      },
      {
        icon: icons['align']['center'],
        apply: () => {
          DisplayStyle.add(this.img, 'block');
          AlignStyle.add(this.img, 'center');
          MarginStyle.add(this.img, 'auto');
        },
        isApplied: () => AlignStyle.value(this.img) == 'center',
      },
      {
        icon: icons['align']['right'],
        apply: () => {
          DisplayStyle.add(this.img, 'block');
          AlignStyle.add(this.img, 'right');
          MarginStyle.add(this.img, '1em 1em 1em auto');
        },
        isApplied: () => AlignStyle.value(this.img) == 'right',
      },
    ];
  };

  _addToolbarButtons = () => {
    // @ts-expect-error
    const buttons = [];
    this.alignments.forEach((alignment, idx) => {
      const button = document.createElement('span');
      buttons.push(button);
      button.innerHTML = alignment.icon;
      button.addEventListener('click', () => {
        // deselect all buttons
        // @ts-expect-error
        buttons.forEach((button) => (button.style.filter = ''));
        if (alignment.isApplied()) {
          // If applied, unapply
          MarginStyle.remove(this.img);
          DisplayStyle.remove(this.img);
          AlignStyle.remove(this.img);
        } else {
          // otherwise, select button and apply
          this._selectButton(button);
          alignment.apply();
        }
        // image may change position; redraw drag handles
        this.requestUpdate();
      });
      Object.assign(button.style, this.options.toolbarButtonStyles);
      if (idx > 0) {
        button.style.borderLeftWidth = '0';
      }
      const buttonChild = button.children[0] as HTMLElement;
      //Assign style
      Object.assign(buttonChild.style, this.options.toolbarButtonSvgStyles);
      if (alignment.isApplied()) {
        // select button if previously applied
        this._selectButton(button);
      }
      this.toolbar.appendChild(button);
    });
  };

  // @ts-expect-error
  _selectButton = (button) => {
    button.style.filter = 'invert(20%)';
  };
}
