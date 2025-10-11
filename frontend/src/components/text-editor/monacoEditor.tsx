import { Editor } from "@monaco-editor/react";
import type * as monaco from "monaco-editor";
import { Code2 } from "lucide-react";
type EditorProps = {
  texContent: React.RefObject<monaco.editor.IStandaloneCodeEditor | null>;
  onChange?: (value: string) => void;
};
function Monaco({ texContent, onChange }: EditorProps) {
  const handleTexMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    texContent.current = editor;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
        <Code2 className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-700">Editor</span>
      </div>
      <Editor
        height="100%"
        defaultLanguage="latex"
        onMount={handleTexMount}
        onChange={(value) => {
          if (value) onChange?.(value);
        }}
        theme="light"
        options={{
          fontSize: 14,
          fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          lineNumbers: "on",
          renderWhitespace: "selection",
          tabSize: 2,
          insertSpaces: true,
          automaticLayout: true,
          padding: { top: 20, bottom: 20 },
          lineHeight: 24,
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            useShadows: false,
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
}
export default Monaco;
