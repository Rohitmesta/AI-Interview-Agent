from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI Interview Agent"
    app_version: str = "1.0.0"

    gemini_api_key: str

    class Config:
        env_file = ".env"


settings = Settings()