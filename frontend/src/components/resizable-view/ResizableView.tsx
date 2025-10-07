import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React from "react";
type ResizableProps = {
  editor: React.ReactNode;
  preview: React.ReactNode;
};
export default function ResizableView({ editor, preview }: ResizableProps) {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen">
      <ResizablePanel>{editor}</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>{preview}</ResizablePanel>
    </ResizablePanelGroup>
  );
}
