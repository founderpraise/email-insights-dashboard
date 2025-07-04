#!/usr/bin/env python3
"""
Startup script for Email Insights Dashboard
This script starts the FastAPI server with proper configuration
"""

import uvicorn
import sys
import os

def main():
    """Start the FastAPI server"""
    print("🚀 Starting Email Insights Dashboard...")
    print("=" * 50)
    
    # Check if required files exist
    required_files = ['main.py', 'models.py', 'email_parser.py', 'utils.py']
    missing_files = [f for f in required_files if not os.path.exists(f)]
    
    if missing_files:
        print(f"❌ Missing required files: {', '.join(missing_files)}")
        print("Please make sure all files are in the current directory.")
        sys.exit(1)
    
    print("✅ All required files found")
    print("📁 Project structure:")
    for file in required_files:
        print(f"   - {file}")
    
    print("\n🌐 Starting server...")
    print("   URL: http://localhost:8000")
    print("   API Docs: http://localhost:8000/docs")
    print("   ReDoc: http://localhost:8000/redoc")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        # Start the server
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main() 