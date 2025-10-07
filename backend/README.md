## DOCKERIZED LATEX COMPILER 


Build the docker container 

> docker build -t latex-compiler .

Run the docker container 

> docker run --name latex-compiler -p 8000:8000 latex-compiler

Test if the code the is working 
> curl -X http://localhost:8000/compile -F "@file.tex" -o @output.pdf 

---
### API End point 
POST "/compile" 
Input .tex file (multipart/form-data) 
Output compiled .pdf file
