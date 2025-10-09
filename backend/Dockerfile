FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
        wget \
        perl \
        fontconfig \
        lmodern \
        poppler-utils \
        && rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.TinyTeX/bin/x86_64-linux:${PATH}"

RUN wget -qO- "https://yihui.org/tinytex/install-bin-unix.sh" | sh
WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN tlmgr update --self --all \
 && tlmgr install latexmk preprint lastpage titlesec parskip enumitem xcolor marvosym fancyhdr babel-english


COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

