from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import nbformat
from nbconvert import HTMLExporter

app = FastAPI()


class RenderRequest(BaseModel):
    notebook_url: str


@app.post("/render")
def render_notebook(payload: RenderRequest):
    try:
        # Fetch notebook
        resp = requests.get(payload.notebook_url, timeout=20)
        resp.raise_for_status()

        # Parse notebook
        nb = nbformat.reads(resp.text, as_version=4)

        # Convert to HTML
        exporter = HTMLExporter()
        exporter.exclude_input_prompt = True
        exporter.exclude_output_prompt = True

        html, _ = exporter.from_notebook_node(nb)

        return {
            "html": html
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))