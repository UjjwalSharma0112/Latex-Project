type Response = {
  success: boolean;
  pdfUrl: string | null;
  error: string | null;
};
async function compileResume(texData: string): Promise<Response> {
  try {
    const response = await fetch("http://localhost:8000/compile/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: "test.tex",
        data: texData,
      }),
    });

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/pdf")) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      return { success: true, pdfUrl: url, error: null };
    } else {
      const errData = await response.json();
      return {
        success: false,
        pdfUrl: null,
        error: errData.detail || "Unknown Error",
      };
    }
  } catch (err) {
    return {
      success: false,
      pdfUrl: null,
      error: "Network error: " + (err as Error).message,
    };
  }
}

export default compileResume;
