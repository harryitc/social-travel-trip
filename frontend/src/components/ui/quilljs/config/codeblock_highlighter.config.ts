const CodeBlockHighlighter = {
    languages: {
        default: 'plain',
        /**
         * - hljs: ```https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/b0d771441590ff06eda265488bbf011a0140fbf4/AVAILABLE_LANGUAGES_HLJS.MD```
         * - Quilljs highlight.js: ```https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md```
         */
        list:
        {
            "plain": { hljs: "plaintext", label: "Plain text" },
            "json": { hljs: "json", label: "JSON" },
            "javascript": { hljs: "javascript", label: "Javascript" },
            "typescript": { hljs: "typescript", label: "Typescript" },
            "jsx": { hljs: "jsx", label: "JSX" },
            "xml": { hljs: "xml", label: "HTML/XML" },
            "css": { hljs: "css", label: "CSS" },
            "java": { hljs: "java", label: "Java" },
            "kotlin": { hljs: "kotlin", label: "Kotlin" },
            "c": { hljs: "c", label: "C" },
            "cs": { hljs: "csharp", label: "C#" },
            "cpp": { hljs: "cpp", label: "C++" },
            "python": { hljs: "python", label: "Python" },
            "markdown": { hljs: "markdown", label: "Markdown" },
            "bash": { hljs: "bash", label: "Bash" },
            "php": { hljs: "php", label: "PHP" },
            "go": { hljs: "go", label: "Go lang" },
            "sql": { hljs: "sql", label: "SQL" },
            "nginx": { hljs: "nginx", label: "NginX" },
            "text": { hljs: "latext", label: "LaTeX" },
            "perl": { hljs: "perl", label: "Perl" },
            "dart": { hljs: "dart", label: "Dart lang" },
            "yaml": { hljs: "yaml", label: "Yaml" },
            "swift": { hljs: "swift", label: "Swift" },
            "objectivec": { hljs: "objectivec", label: "Object C" },
        },
        keys: [],
    },

    ///Style: ```https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/b0d771441590ff06eda265488bbf011a0140fbf4/AVAILABLE_STYLES_HLJS.MD```
    style: "vs2015",
    ///Show line number
    showLineNumbers: true,
    ///Wrap long lines
    wrapLongLines: true,
} as any
///Keys
CodeBlockHighlighter.languages["keys"] = Object.keys(CodeBlockHighlighter.languages.list)
///Export
export { CodeBlockHighlighter }