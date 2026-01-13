"""
Setup script for TaskFlow 3D Backend

This script helps with initial setup:
1. Creates .env file from template
2. Generates secure JWT secret key
3. Provides instructions for database setup
"""

import secrets
import os
from pathlib import Path


def generate_jwt_secret():
    """Generate a secure JWT secret key."""
    return secrets.token_urlsafe(32)


def create_env_file():
    """Create .env file from .env.example if it doesn't exist."""
    env_path = Path(".env")
    env_example_path = Path(".env.example")

    if env_path.exists():
        print("✅ .env file already exists")
        overwrite = input("Do you want to regenerate it? (y/N): ").lower()
        if overwrite != 'y':
            return False

    if not env_example_path.exists():
        print("❌ .env.example not found")
        return False

    # Read template
    with open(env_example_path, 'r') as f:
        env_content = f.read()

    # Generate JWT secret
    jwt_secret = generate_jwt_secret()

    # Replace placeholder with generated secret
    env_content = env_content.replace(
        "your-super-secret-jwt-key-change-this-in-production",
        jwt_secret
    )

    # Write .env file
    with open(env_path, 'w') as f:
        f.write(env_content)

    print("✅ Created .env file with generated JWT secret")
    print(f"🔑 JWT Secret: {jwt_secret}")
    return True


def main():
    print("=" * 60)
    print("TaskFlow 3D Backend - Setup Script")
    print("=" * 60)
    print()

    # Create .env file
    print("📝 Setting up environment variables...")
    created = create_env_file()

    print()
    print("=" * 60)
    print("Next Steps:")
    print("=" * 60)

    if created:
        print("1. ✅ Edit .env file and add your Neon PostgreSQL connection string")
        print("   - Get connection string from: https://neon.tech")
        print("   - Format: postgresql://user:password@host/database?sslmode=require")
        print()
    else:
        print("1. ⚠️  Make sure your .env file has the correct DATABASE_URL")
        print()

    print("2. 📦 Install dependencies:")
    print("   pip install -r requirements.txt")
    print()

    print("3. 🚀 Run the server:")
    print("   python main.py")
    print()

    print("4. 🧪 Test the API:")
    print("   - Open http://localhost:8000/docs in your browser")
    print("   - Or test health endpoint: curl http://localhost:8000/health")
    print()

    print("=" * 60)
    print("For more information, see README.md")
    print("=" * 60)


if __name__ == "__main__":
    main()
