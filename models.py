from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime


class EmailData(BaseModel):
    """Model for parsed email data"""
    subject: str
    sender: str
    timestamp: datetime
    body: str
    filename: str


class AnalyticsResponse(BaseModel):
    """Model for analytics response"""
    top_senders: List[Dict[str, Any]]
    most_common_words: List[Dict[str, Any]]
    email_count_over_time: Dict[str, int]


class UploadResponse(BaseModel):
    """Model for upload response"""
    message: str
    filename: str
    parsed_data: EmailData 