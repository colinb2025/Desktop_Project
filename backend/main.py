
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
from pathlib import Path

app = FastAPI()
STATE_FILE = Path("state.json")

class Widget(BaseModel):
    id: str
    type: str
    x: int
    y: int
    w: int
    h: int

class Layout(BaseModel):
    widgets: list[Widget]

def load_state():
    if STATE_FILE.exists():
        return Layout(**json.loads(STATE_FILE.read_text()))
    return Layout(widgets=[
        Widget(id="clock-1", type="clock", x=0, y=0, w=1, h=1)
    ])

def save_state(layout):
    STATE_FILE.write_text(json.dumps(layout.dict(), indent=2))

layout = load_state()

@app.get("/layout")
def get_layout():
    return layout

@app.post("/move")
def move_widget(widget: Widget):
    layout.widgets = [w for w in layout.widgets if w.id != widget.id]
    layout.widgets.append(widget)
    save_state(layout)
    return {"ok": True}

app.mount("/", StaticFiles(directory="../frontend", html=True), name="frontend")
