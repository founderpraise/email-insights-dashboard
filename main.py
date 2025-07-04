from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn

from models import EmailData, AnalyticsResponse, UploadResponse
from email_parser import parse_email_file, validate_eml_file
from utils import get_most_common_words, get_top_senders, get_email_count_over_time

# Initialize FastAPI app
app = FastAPI(
    title="Email Insights Dashboard",
    description="A FastAPI backend for analyzing email data from .eml files",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for parsed emails
emails_storage: List[EmailData] = []


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Email Insights Dashboard API",
        "version": "1.0.0",
        "endpoints": {
            "upload": "/upload",
            "analytics": "/analytics",
            "emails": "/emails"
        }
    }


@app.post("/upload", response_model=UploadResponse)
async def upload_email(file: UploadFile = File(...)):
    """
    Upload and parse an .eml file
    """
    # Validate file type
    if not file.filename.endswith('.eml'):
        raise HTTPException(
            status_code=400, 
            detail="Only .eml files are supported"
        )
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Validate the file is a valid .eml file
        if not validate_eml_file(file_content, file.filename):
            raise HTTPException(
                status_code=400,
                detail="Invalid .eml file format"
            )
        
        # Parse the email
        parsed_data = parse_email_file(file_content, file.filename)
        
        # Store in memory
        emails_storage.append(parsed_data)
        
        return UploadResponse(
            message="Email uploaded and parsed successfully",
            filename=file.filename,
            parsed_data=parsed_data
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )


@app.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics(group_by: str = "daily"):
    """
    Get analytics from uploaded emails
    """
    if not emails_storage:
        return AnalyticsResponse(
            top_senders=[],
            most_common_words=[],
            email_count_over_time={}
        )
    
    # Convert EmailData objects to dictionaries for processing
    emails_dict = [
        {
            'sender': email.sender,
            'subject': email.subject,
            'body': email.body,
            'timestamp': email.timestamp
        }
        for email in emails_storage
    ]
    
    # Get all text content for word analysis
    all_texts = [email.body for email in emails_storage]
    
    # Generate analytics
    top_senders = get_top_senders(emails_dict, top_n=5)
    most_common_words = get_most_common_words(all_texts, top_n=20)
    email_count_over_time = get_email_count_over_time(emails_dict, group_by)
    
    return AnalyticsResponse(
        top_senders=top_senders,
        most_common_words=most_common_words,
        email_count_over_time=email_count_over_time
    )


@app.get("/emails", response_model=List[EmailData])
async def get_emails():
    """
    Get all uploaded emails
    """
    return emails_storage


@app.delete("/emails")
async def clear_emails():
    """
    Clear all stored emails
    """
    global emails_storage
    emails_storage.clear()
    return {"message": "All emails cleared successfully"}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "email_count": len(emails_storage)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 