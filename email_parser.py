import email
from email import policy
from datetime import datetime
from typing import Optional
from models import EmailData


def parse_email_file(file_content: bytes, filename: str) -> EmailData:
    """
    Parse an .eml file and extract relevant information
    """
    # Parse the email using Python's email module
    msg = email.message_from_bytes(file_content, policy=policy.default)
    
    # Extract subject
    subject = msg.get('subject', 'No Subject')
    if subject is None:
        subject = 'No Subject'
    
    # Extract sender
    sender = msg.get('from', 'Unknown Sender')
    if sender is None:
        sender = 'Unknown Sender'
    
    # Extract timestamp
    date_str = msg.get('date')
    if date_str:
        try:
            # Parse the date string
            timestamp = email.utils.parsedate_to_datetime(date_str)
        except (TypeError, ValueError):
            # Fallback to current time if parsing fails
            timestamp = datetime.now()
    else:
        timestamp = datetime.now()
    
    # Extract body (plain text only)
    body = extract_plain_text_body(msg)
    
    return EmailData(
        subject=subject,
        sender=sender,
        timestamp=timestamp,
        body=body,
        filename=filename
    )


def extract_plain_text_body(msg: email.message.Message) -> str:
    """
    Extract plain text body from email message
    """
    body = ""
    
    if msg.is_multipart():
        # Handle multipart messages
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get('Content-Disposition', ''))
            
            # Skip attachments
            if 'attachment' in content_disposition:
                continue
            
            # Get plain text content
            if content_type == 'text/plain':
                try:
                    body += part.get_content()
                except Exception:
                    continue
    else:
        # Handle simple text messages
        content_type = msg.get_content_type()
        if content_type == 'text/plain':
            try:
                body = msg.get_content()
            except Exception:
                body = ""
    
    # Clean up the body text
    if body:
        # Remove extra whitespace and normalize line breaks
        body = ' '.join(body.split())
    else:
        body = "No text content found"
    
    return body


def validate_eml_file(file_content: bytes, filename: str) -> bool:
    """
    Validate that the uploaded file is a valid .eml file
    """
    try:
        # Try to parse the file as an email
        msg = email.message_from_bytes(file_content, policy=policy.default)
        
        # Check if it has basic email headers
        if not msg.get('from') and not msg.get('to') and not msg.get('subject'):
            return False
        
        return True
    except Exception:
        return False 