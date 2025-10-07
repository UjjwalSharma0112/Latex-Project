import os
import subprocess
import tempfile
import json

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CompileRequest(BaseModel):
    filename: str
    data: str

# Health check
@app.get("/health-check")
def root():
    return {"message": "Server is running"}


# Compile LaTeX from JSON input
@app.post("/compile/json")
async def compile_json(tex_data: CompileRequest):
    try:
        tex_data_json = tex_data
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON input")

    with tempfile.TemporaryDirectory() as tmpdir:
        tex_path = os.path.join(tmpdir, tex_data_json.filename)

        # Write .tex file
        with open(tex_path, "w") as f:
            f.write(tex_data_json.data)

        try:
            subprocess.run(
                ["pdflatex", "-interaction=nonstopmode", tex_path],
                cwd=tmpdir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=True,
            )
        except subprocess.CalledProcessError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Compilation Failed:\n{e.stdout.decode()}\n{e.stderr.decode()}",
            )

        pdf_path = tex_path.replace(".tex", ".pdf")

        # Copy PDF out of temp dir (since it will be deleted after return)
        final_pdf = os.path.join(os.getcwd(), "output.pdf")
        with open(pdf_path, "rb") as src, open(final_pdf, "wb") as dst:
            dst.write(src.read())

    return FileResponse(final_pdf, media_type="application/pdf", filename="output.pdf")


# Compile LaTeX from uploaded file
@app.post("/compile")
async def compile_file(file: UploadFile = File(...)):
    if not file.filename.endswith(".tex"):
        raise HTTPException(status_code=400, detail="Only .tex files are allowed")

    with tempfile.TemporaryDirectory() as tmpdir:
        tex_path = os.path.join(tmpdir, file.filename)

        # Write uploaded .tex file
        with open(tex_path, "wb") as f:
            f.write(await file.read())

        try:
            subprocess.run(
                ["pdflatex", "-interaction=nonstopmode", tex_path],
                cwd=tmpdir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=True,
            )
        except subprocess.CalledProcessError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Compilation Failed:\n{e.stdout.decode()}\n{e.stderr.decode()}",
            )

        pdf_path = tex_path.replace(".tex", ".pdf")

        # Copy PDF out of temp dir
        final_pdf = os.path.join(os.getcwd(), "output.pdf")
        with open(pdf_path, "rb") as src, open(final_pdf, "wb") as dst:
            dst.write(src.read())

    return FileResponse(final_pdf, media_type="application/pdf", filename="output.pdf")

