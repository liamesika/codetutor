"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import dynamic from "next/dynamic"
import type { OnMount, OnChange } from "@monaco-editor/react"
import type * as Monaco from "monaco-editor"
import { useTheme } from "next-themes"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Lazy load Monaco for better initial page load
const Editor = dynamic(() => import("@monaco-editor/react").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-muted/30">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Loading editor...</span>
      </div>
    </div>
  ),
})

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  readOnly?: boolean
  height?: string
  onMount?: OnMount
  className?: string
}

export function CodeEditor({
  value,
  onChange,
  language = "java",
  readOnly = false,
  height = "100%",
  onMount,
  className,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme()
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
  const [isReady, setIsReady] = useState(false)

  const handleEditorDidMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor
      setIsReady(true)

      // Define custom theme for better aesthetics - matching premium dark theme
      monaco.editor.defineTheme("codetutor-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6A9955", fontStyle: "italic" },
          { token: "keyword", foreground: "C586C0" },
          { token: "string", foreground: "CE9178" },
          { token: "number", foreground: "B5CEA8" },
          { token: "type", foreground: "4EC9B0" },
        ],
        colors: {
          "editor.background": "#0B0F19",
          "editor.foreground": "#E5E7EB",
          "editor.lineHighlightBackground": "#141A2B",
          "editor.selectionBackground": "#4F46E540",
          "editorCursor.foreground": "#4F46E5",
          "editorLineNumber.foreground": "#4a5568",
          "editorLineNumber.activeForeground": "#4F46E5",
          "editor.inactiveSelectionBackground": "#1E2433",
          "editorIndentGuide.background": "#1E2433",
          "editorIndentGuide.activeBackground": "#4F46E540",
          "editorGutter.background": "#0B0F19",
          "scrollbarSlider.background": "#4F46E530",
          "scrollbarSlider.hoverBackground": "#4F46E550",
          "scrollbarSlider.activeBackground": "#4F46E570",
        },
      })

      monaco.editor.defineTheme("codetutor-light", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "comment", foreground: "008000", fontStyle: "italic" },
          { token: "keyword", foreground: "AF00DB" },
          { token: "string", foreground: "A31515" },
          { token: "number", foreground: "098658" },
          { token: "type", foreground: "267F99" },
        ],
        colors: {
          "editor.background": "#ffffff",
          "editor.foreground": "#000000",
          "editor.lineHighlightBackground": "#f5f5f5",
          "editorCursor.foreground": "#9333ea",
          "editorLineNumber.foreground": "#6b7280",
          "editorLineNumber.activeForeground": "#9333ea",
        },
      })

      // Apply custom theme
      monaco.editor.setTheme(resolvedTheme === "dark" ? "codetutor-dark" : "codetutor-light")

      // Configure Java language features
      monaco.languages.setLanguageConfiguration("java", {
        wordPattern:
          /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
        comments: {
          lineComment: "//",
          blockComment: ["/*", "*/"],
        },
        brackets: [
          ["{", "}"],
          ["[", "]"],
          ["(", ")"],
        ],
        autoClosingPairs: [
          { open: "{", close: "}" },
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
        ],
        surroundingPairs: [
          { open: "{", close: "}" },
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
        ],
      })

      // Register Java snippets
      monaco.languages.registerCompletionItemProvider("java", {
        provideCompletionItems: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          }

          const suggestions = [
            {
              label: "sout",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'System.out.println(${1});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Print to console",
              range,
            },
            {
              label: "main",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'public static void main(String[] args) {\n\t${1}\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Main method",
              range,
            },
            {
              label: "fori",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3}\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "For loop with index",
              range,
            },
            {
              label: "fore",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'for (${1:type} ${2:item} : ${3:collection}) {\n\t${4}\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Enhanced for loop",
              range,
            },
          ]

          return { suggestions }
        },
      })

      // Focus editor
      editor.focus()

      // Keyboard shortcuts
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        document.dispatchEvent(new CustomEvent("editor-save"))
      })

      if (onMount) {
        onMount(editor, monaco)
      }
    },
    [onMount, resolvedTheme]
  )

  // Update theme when it changes
  useEffect(() => {
    if (isReady && editorRef.current) {
      const monaco = (window as unknown as { monaco?: typeof import("monaco-editor") }).monaco
      if (monaco) {
        monaco.editor.setTheme(resolvedTheme === "dark" ? "codetutor-dark" : "codetutor-light")
      }
    }
  }, [resolvedTheme, isReady])

  const handleChange: OnChange = useCallback(
    (val) => {
      if (val !== undefined) {
        onChange(val)
      }
    },
    [onChange]
  )

  // Format code on Ctrl+Shift+F
  useEffect(() => {
    const handleFormat = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "f") {
        e.preventDefault()
        editorRef.current?.getAction("editor.action.formatDocument")?.run()
      }
    }

    window.addEventListener("keydown", handleFormat)
    return () => window.removeEventListener("keydown", handleFormat)
  }, [])

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme={resolvedTheme === "dark" ? "codetutor-dark" : "codetutor-light"}
        loading={
          <div className="flex items-center justify-center h-full w-full bg-muted/30">
            <Skeleton className="h-full w-full" />
          </div>
        }
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 24,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace",
          fontLigatures: true,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          renderLineHighlight: "all",
          selectOnLineNumbers: true,
          roundedSelection: true,
          cursorStyle: "line",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          contextmenu: true,
          folding: true,
          showFoldingControls: "mouseover",
          foldingHighlight: true,
          matchBrackets: "always",
          bracketPairColorization: {
            enabled: true,
          },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          padding: {
            top: 16,
            bottom: 16,
          },
          suggest: {
            showKeywords: true,
            showSnippets: true,
            preview: true,
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
          },
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          accessibilitySupport: "auto",
          ariaLabel: "Java code editor",
        }}
      />
    </div>
  )
}
