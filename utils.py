import re
from collections import Counter
from typing import List, Dict, Any
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')


def remove_stopwords_and_clean(text: str) -> List[str]:
    """
    Remove stopwords and clean text for word frequency analysis
    """
    # Convert to lowercase and remove special characters
    text = re.sub(r'[^\w\s]', '', text.lower())
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    # Add common email-specific words to stopwords
    email_stopwords = {
        'email', 'mail', 'message', 'sent', 'received', 'forward', 'reply',
        'subject', 'from', 'to', 'cc', 'bcc', 'date', 'time', 'attachment',
        'http', 'https', 'www', 'com', 'org', 'net', 'edu', 'gov'
    }
    stop_words.update(email_stopwords)
    
    # Filter out stopwords and short words
    filtered_tokens = [
        token for token in tokens 
        if token.lower() not in stop_words and len(token) > 2
    ]
    
    return filtered_tokens


def get_most_common_words(texts: List[str], top_n: int = 20) -> List[Dict[str, Any]]:
    """
    Get most common words from a list of texts
    """
    all_words = []
    for text in texts:
        all_words.extend(remove_stopwords_and_clean(text))
    
    # Count word frequencies
    word_counts = Counter(all_words)
    
    # Return top N most common words
    return [
        {"word": word, "count": count} 
        for word, count in word_counts.most_common(top_n)
    ]


def get_top_senders(emails: List[Dict[str, Any]], top_n: int = 5) -> List[Dict[str, Any]]:
    """
    Get top senders by email count
    """
    sender_counts = Counter()
    for email in emails:
        sender_counts[email['sender']] += 1
    
    return [
        {"sender": sender, "count": count} 
        for sender, count in sender_counts.most_common(top_n)
    ]


def get_email_count_over_time(emails: List[Dict[str, Any]], group_by: str = 'daily') -> Dict[str, int]:
    """
    Get email count over time, grouped by day or week
    """
    time_counts = Counter()
    
    for email in emails:
        timestamp = email['timestamp']
        
        if group_by == 'daily':
            date_key = timestamp.strftime('%Y-%m-%d')
        elif group_by == 'weekly':
            # Get the start of the week (Monday)
            days_since_monday = timestamp.weekday()
            start_of_week = timestamp.replace(day=timestamp.day - days_since_monday)
            date_key = start_of_week.strftime('%Y-%m-%d')
        else:
            date_key = timestamp.strftime('%Y-%m-%d')
        
        time_counts[date_key] += 1
    
    return dict(time_counts) 