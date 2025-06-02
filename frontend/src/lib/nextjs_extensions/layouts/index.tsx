import { Layouts, LayoutType } from '@/layouts';
import React from 'react';
import { isAsync } from '../typescript/lang';

// Todo: Add Layout to a Page Component
/**
 * # Add layout to page by key (filename in layouts folder: src/layouts)
 * ## return page after wrapped by the layout
 * - Example:
 * ```typescript
 * //file: page.tsx
 * import {addLayout} from "@/lib/nextjs_extensions/layouts"
 * function page({params}){...}
 * //Export
 * export default addLayout(page, "layout-key")
 * ```
 * @param page
 * @param layoutKey
 * @returns
 */
const addLayout = (page: any, layoutKey: LayoutType = 'default') => {
  if (!(page && layoutKey)) {
    throw 'addLayout failed: page and layoutKey are required';
  }
  //Layout from Layouts and layoutKey
  const LayoutComponent = Layouts[layoutKey];
  if (!LayoutComponent) {
    throw `addLayout failed: Not found layout with key: ${layoutKey}`;
  }

  // Todo: Add layout to page
  return ({ children, ...props }: any) => {
    // Check if the LayoutComponent is async or not
    if (isAsync(LayoutComponent)) {
      return React.createElement(
        LayoutComponent,
        props,
        React.createElement(page, { ...props, children: children }),
      );
    }
    return React.createElement(
      LayoutComponent,
      props,
      React.createElement(page, { ...props, children: children }),
    );
  };
};
// Export
export { addLayout };
