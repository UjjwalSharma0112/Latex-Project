import Navbar from "@/components/navbar/Navbar";
import ResizableView from "@/components/resizable-view/ResizableView";
import Monaco from "@/components/text-editor/monacoEditor";
import Preview from "@/components/preview-resume/Preview";
import { useState, useRef } from "react";
import type * as monaco from "monaco-editor";
import compileResume from "@/api/compileResume";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

function Home() {
  const editorTextState = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  const [pdfUrlState, setPdfUrlState] = useState<string | null>(null);
  const [compileErrorState, setCompileErrorState] = useState<string | null>(
    null
  );
  const [isCompiling, setIsCompiling] = useState(false);

  const handleCompile: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    if (editorTextState.current) {
      const texData = editorTextState.current.getValue();
      setIsCompiling(true);
      try {
        const response = await compileResume(texData);
        if (response.pdfUrl) setPdfUrlState(response.pdfUrl);
        if (response.success) {
          console.log(compileErrorState);
          toast.success("Successfully Compiled");
        } else {
          setCompileErrorState(response.error);
          toast.error("Compilation Error", {
            description:
              "Failed to compile this document please check the syntax",
          });
        }
      } catch (err) {
        toast.error("Compilation Failed", {
          description: (err as Error).message,
        });
      } finally {
        setIsCompiling(false);
      }
    }
  };
  return (
    <div className="h-screen flex flex-col">
      <Navbar handleCompile={handleCompile} />
      <div className="flex-1 overflow-hidden">
        <ResizableView
          editor={<Monaco texContent={editorTextState} />}
          preview={<Preview pdfUrl={pdfUrlState} isCompiling={isCompiling} />}
        />
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default Home;
