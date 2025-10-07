import { FileText, Loader2 } from "lucide-react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
interface PreviewProps {
  pdfUrl: string | null;
  isCompiling: boolean;
}

export default function Preview({ pdfUrl, isCompiling }: PreviewProps) {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
        <FileText className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-700">Preview</span>
      </div>

      <div className="flex-1 relative overflow-auto">
        {isCompiling ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-gray-900 animate-spin mx-auto mb-3" />
              <p className="text-gray-600 text-sm">Compiling...</p>
            </div>
          </div>
        ) : pdfUrl ? (
          <div className="w-full h-full overflow-auto bg-gray-50">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl={pdfUrl} defaultScale={1.1} theme="light" />
            </Worker>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md px-6">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                No preview yet
              </h3>
              <p className="text-gray-500 text-sm">
                Click Compile to generate a PDF
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
