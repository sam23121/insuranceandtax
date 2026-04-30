from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = Field(alias="DATABASE_URL")

    jwt_secret_key: str = Field(alias="JWT_SECRET_KEY", min_length=32)
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(default=480, alias="ACCESS_TOKEN_EXPIRE_MINUTES")

    resend_api_key: str | None = Field(default=None, alias="RESEND_API_KEY")
    email_from: str = Field(default="noreply@example.com", alias="EMAIL_FROM")

    business_name: str = Field(default="Our Business", alias="BUSINESS_NAME")
    business_phone: str = Field(default="", alias="BUSINESS_PHONE")
    business_email: str = Field(default="", alias="BUSINESS_EMAIL")
    business_address: str = Field(default="", alias="BUSINESS_ADDRESS")
    owner_email: str = Field(default="", alias="OWNER_EMAIL")

    frontend_url: str = Field(default="http://localhost:5173", alias="FRONTEND_URL")
    admin_url: str = Field(default="http://localhost:5173", alias="ADMIN_URL")

    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:5173"], alias="CORS_ORIGINS")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors(cls, v: str | list[str]) -> list[str]:
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            s = v.strip()
            if s.startswith("["):
                import json

                return json.loads(s)
            return [p.strip() for p in s.split(",") if p.strip()]
        return ["http://localhost:5173"]


def get_settings() -> Settings:
    return Settings()
