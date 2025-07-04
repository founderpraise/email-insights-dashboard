# Email Insights Dashboard

A FastAPI backend for analyzing email data from `.eml` files. This application provides endpoints to upload email files, parse their content, and generate analytics including top senders, most common words, and email count over time.

## Features

- **Email Upload**: Upload `.eml` files and parse their content
- **Data Extraction**: Extract subject, sender, timestamp, and plain text body
- **Analytics**: Generate insights including:
  - Top 5 senders by email count
  - Most common words (excluding stopwords)
  - Email count over time (daily/weekly)
- **In-Memory Storage**: Temporary storage of parsed email data
- **RESTful API**: Clean, documented API endpoints

## Project Structure

```
email-insights-dashboard/
├── main.py              # FastAPI application and endpoints
├── models.py            # Pydantic data models
├── email_parser.py      # Email parsing logic
├── utils.py             # Utility functions for analytics
├── requirements.txt     # Python dependencies
└── README.md           # Project documentation
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd email-insights-dashboard
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Starting the Server

Run the FastAPI application:

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### API Documentation

Once the server is running, you can access:
- **Interactive API docs**: `http://localhost:8000/docs`
- **ReDoc documentation**: `http://localhost:8000/redoc`

## API Endpoints

### 1. Upload Email
**POST** `/upload`

Upload and parse an `.eml` file.

**Request**: Multipart form data with `.eml` file

**Response**:
```json
{
  "message": "Email uploaded and parsed successfully",
  "filename": "example.eml",
  "parsed_data": {
    "subject": "Email Subject",
    "sender": "sender@example.com",
    "timestamp": "2024-01-15T10:30:00",
    "body": "Email body content...",
    "filename": "example.eml"
  }
}
```

### 2. Get Analytics
**GET** `/analytics?group_by=daily`

Get analytics from uploaded emails.

**Query Parameters**:
- `group_by` (optional): "daily" or "weekly" (default: "daily")

**Response**:
```json
{
  "top_senders": [
    {"sender": "sender1@example.com", "count": 5},
    {"sender": "sender2@example.com", "count": 3}
  ],
  "most_common_words": [
    {"word": "meeting", "count": 15},
    {"word": "project", "count": 12}
  ],
  "email_count_over_time": {
    "2024-01-15": 5,
    "2024-01-16": 3
  }
}
```

### 3. Get All Emails
**GET** `/emails`

Retrieve all uploaded emails.

### 4. Clear Emails
**DELETE** `/emails`

Clear all stored email data.

### 5. Health Check
**GET** `/health`

Check API health and get email count.

## Example Usage

### Using curl

1. Upload an email file:
```bash
curl -X POST "http://localhost:8000/upload" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@example.eml"
```

2. Get analytics:
```bash
curl -X GET "http://localhost:8000/analytics?group_by=daily"
```

3. Get all emails:
```bash
curl -X GET "http://localhost:8000/emails"
```

### Using Python requests

```python
import requests

# Upload email
with open('example.eml', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:8000/upload', files=files)
    print(response.json())

# Get analytics
response = requests.get('http://localhost:8000/analytics')
analytics = response.json()
print(f"Top senders: {analytics['top_senders']}")
print(f"Most common words: {analytics['most_common_words']}")
```

## Technical Details

### Email Parsing
- Uses Python's built-in `email` module
- Extracts plain text content only (ignores HTML)
- Handles multipart messages and attachments
- Validates `.eml` file format

### Text Analysis
- Uses NLTK for natural language processing
- Removes common stopwords and email-specific terms
- Tokenizes and counts word frequencies
- Filters out short words (< 3 characters)

### Data Storage
- In-memory storage using Python lists
- Data is lost when the server restarts
- For production, consider using a database

## Dependencies

- **FastAPI**: Modern web framework for building APIs
- **Uvicorn**: ASGI server for running FastAPI
- **Pydantic**: Data validation using Python type annotations
- **NLTK**: Natural language processing toolkit
- **python-multipart**: File upload support

## Development

### Adding New Features
1. Add new endpoints in `main.py`
2. Create corresponding models in `models.py`
3. Add utility functions in `utils.py` if needed
4. Update documentation

### Testing
The API includes automatic validation and error handling:
- File type validation
- Email format validation
- Proper error responses with HTTP status codes

## Production Considerations

1. **Database**: Replace in-memory storage with a proper database
2. **Authentication**: Add user authentication and authorization
3. **File Storage**: Use cloud storage for email files
4. **Rate Limiting**: Implement API rate limiting
5. **Logging**: Add comprehensive logging
6. **CORS**: Configure CORS for your frontend domain
7. **Environment Variables**: Use environment variables for configuration

## License

This project is open source and available under the MIT License. 