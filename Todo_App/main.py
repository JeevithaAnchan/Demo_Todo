from fastapi import FastAPI
from . import models, database, routes
from fastapi.middleware.cors import CORSMiddleware
# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Register routes
app.include_router(routes.router)

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
