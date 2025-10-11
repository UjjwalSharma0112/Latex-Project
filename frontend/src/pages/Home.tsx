import Navbar from "@/components/navbar/Navbar";
import ResizableView from "@/components/resizable-view/ResizableView";
import Monaco from "@/components/text-editor/monacoEditor";
import Preview from "@/components/preview-resume/Preview";
import { useState, useRef, useCallback, useEffect } from "react";
import type * as monaco from "monaco-editor";
import compileResume from "@/api/compileResume";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import debounce from "lodash.debounce";

function Home() {
  const editorTextState = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );

  const [pdfUrlState, setPdfUrlState] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  //  Shared compile logic
  const compileTex = useCallback(
    async (code: string, showToast: boolean, isAuto: boolean) => {
      setIsCompiling(true);
      try {
        const response = await compileResume(code);

        if (response.success) {
          //  Only update preview on success
          if (response.pdfUrl) setPdfUrlState(response.pdfUrl);

          if (showToast) {
            toast.success("Successfully Compiled");
          }
        } else {
          //  Auto compile fails silently
          if (!isAuto) {
            toast.error("Compilation Error", {
              description:
                "Failed to compile document — please check your syntax.",
            });
          }
        }
      } catch (err) {
        if (!isAuto) {
          toast.error("Compilation Failed", {
            description: (err as Error).message,
          });
        }
      } finally {
        setIsCompiling(false);
      }
    },
    []
  );

  //  Debounced auto compile (500ms)
  const debouncedCompile = useRef(
    debounce((code: string) => {
      compileTex(code, false, true); // no toast, silent failures
    }, 1000)
  ).current;

  //  Handle editor changes (auto compile)
  const handleEditorChange = useCallback(
    (value: string) => {
      debouncedCompile(value);
    },
    [debouncedCompile]
  );

  //  Manual compile (button)
  const handleCompile: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    if (editorTextState.current) {
      const texData = editorTextState.current.getValue();
      compileTex(texData, true, false); // show toasts, update preview
    }
  };

  //  Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedCompile.cancel();
    };
  }, [debouncedCompile]);

  return (
    <div className="h-screen flex flex-col">
      <Navbar handleCompile={handleCompile} />
      <div className="flex-1 overflow-hidden">
        <ResizableView
          editor={
            <Monaco
              texContent={editorTextState}
              onChange={handleEditorChange}
            />
          }
          preview={<Preview pdfUrl={pdfUrlState} isCompiling={isCompiling} />}
        />
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default Home;
