import highlighter from 'highlight.js';
import * as ReactDom from 'react-dom';
import * as React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import * as hljs from 'react-syntax-highlighter/dist/esm/styles/hljs';
import * as ReactMediator from 'react_mediator';
import Quill from '../core';
import { CodeBlockHighlighter } from '../../config/codeblock_highlighter.config';

const class_CodeBlock_Container = 'ql-code-block-container';
const PreviewRenderingCompletedHandler = (quill: Quill) => {
  ///Container
  const container = quill.container as HTMLDivElement;
  if (container.getAttribute('data-mode') === 'preview') {
    return;
  }
  //Highlighter
  RenderCodeBlockHighlighter(container);
};
/**
 * Render highlighter
 * @param container
 */
const RenderCodeBlockHighlighter = (container: HTMLDivElement) => {
  ///Find code-block
  const codeBlockContainers = container.getElementsByClassName(class_CodeBlock_Container);
  for (const elm of codeBlockContainers) {
    const codeBlockContainer = elm as HTMLDivElement;
    /**
     * Get lang from code-block container
     * @param container
     * @returns
     */
    const getCodeBlockLang = (container: HTMLElement): string => {
      //Get class languge of children
      // @ts-expect-error Fix me later
      return (container.firstChild as HTMLElement).getAttribute('data-language');
    };
    const toHljsLang = (langKey: string) => {
      return CodeBlockHighlighter.languages.list[langKey].hljs;
    };
    const copyCodeText = (codeText: string) => {
      navigator.clipboard.writeText(codeText);
    };
    const Highlighter = (props: { container: HTMLElement }) => {
      const container = props.container;
      const [codeText] = React.useState(container.innerText);
      //Set data
      container.setAttribute('data-mode', 'preview');
      ///Lang
      let detectedLang = getCodeBlockLang(container);
      if (!detectedLang || detectedLang === CodeBlockHighlighter.languages.default) {
        // @ts-expect-error Fix me later
        detectedLang = DetectLanguage(codeText);
      }
      const hljsLang = toHljsLang(detectedLang ?? CodeBlockHighlighter.languages.default);
      const [currentLang, setLang] = React.useState(hljsLang);

      return (
        <div className="code-block-highlighter-content">
          <header>
            <select value={currentLang} onChange={(e) => setLang(e.target.value)}>
              {CodeBlockHighlighter.languages.keys.map((key: string) => {
                const lang = CodeBlockHighlighter.languages.list[key];
                return (
                  <option value={lang.hljs} key={lang.hljs}>
                    {lang.label}
                  </option>
                );
              })}
            </select>
            <button
              title="Copy"
              onClick={() => copyCodeText(codeText)}
              className="btn-copy-code-text"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                width="18px"
                height="18px"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  fill="white"
                  d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                />
              </svg>
            </button>
          </header>

          <SyntaxHighlighter
            language={currentLang}
            showLineNumbers={CodeBlockHighlighter.showLineNumbers}
            wrapLongLines={CodeBlockHighlighter.wrapLongLines}
            // @ts-expect-error Fix me later
            style={hljs[CodeBlockHighlighter.style]}
          >
            {codeText}
          </SyntaxHighlighter>
        </div>
      );
    };
    //Replace
    ReactMediator.replace(
      codeBlockContainer,
      Highlighter,
      { React, ReactDom },
      'code-block-highlighter',
    );
  }
};
/**
 * Detect language
 */
const DetectLanguage = (codeText: string) => {
  const { language } = highlighter.highlightAuto(codeText, CodeBlockHighlighter.languages.keys);
  return language;
};
///Export
export { PreviewRenderingCompletedHandler };
