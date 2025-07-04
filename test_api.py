#!/usr/bin/env python3
"""
Test script for Email Insights Dashboard API
This script creates sample .eml files and tests the API endpoints
"""

import requests
import tempfile
import os
from datetime import datetime, timedelta
import json


def create_sample_eml_file(filename: str, subject: str, sender: str, body: str, date: datetime = None):
    """Create a sample .eml file for testing"""
    if date is None:
        date = datetime.now()
    
    eml_content = f"""From: {sender}
To: recipient@example.com
Subject: {subject}
Date: {date.strftime('%a, %d %b %Y %H:%M:%S %z')}
MIME-Version: 1.0
Content-Type: text/plain; charset="UTF-8"
Content-Transfer-Encoding: 7bit

{body}
"""
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(eml_content)
    
    return filename


def test_api():
    """Test the Email Insights Dashboard API"""
    base_url = "http://localhost:8000"
    
    print("🚀 Testing Email Insights Dashboard API")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing health check...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Email count: {response.json()['email_count']}")
        else:
            print("❌ Health check failed")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure the server is running on http://localhost:8000")
        return
    
    # Create sample .eml files
    print("\n2. Creating sample .eml files...")
    sample_emails = [
        {
            "subject": "Project Update Meeting",
            "sender": "manager@company.com",
            "body": "Hi team, we need to schedule a meeting to discuss the project updates. Please let me know your availability for this week.",
            "date": datetime.now() - timedelta(days=1)
        },
        {
            "subject": "Weekly Report",
            "sender": "analyst@company.com",
            "body": "Here is the weekly report with all the key metrics and performance indicators. The project is progressing well.",
            "date": datetime.now() - timedelta(days=2)
        },
        {
            "subject": "Client Meeting Tomorrow",
            "sender": "manager@company.com",
            "body": "Reminder about the client meeting tomorrow at 2 PM. Please prepare your presentations and reports.",
            "date": datetime.now() - timedelta(days=3)
        },
        {
            "subject": "New Feature Request",
            "sender": "developer@company.com",
            "body": "I have a new feature request for the dashboard. We need to add more analytics and reporting capabilities.",
            "date": datetime.now() - timedelta(days=4)
        },
        {
            "subject": "Budget Approval",
            "sender": "finance@company.com",
            "body": "The budget for the new project has been approved. We can proceed with the development phase.",
            "date": datetime.now() - timedelta(days=5)
        }
    ]
    
    # Create temporary .eml files
    temp_files = []
    for i, email_data in enumerate(sample_emails):
        temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.eml', delete=False)
        create_sample_eml_file(
            temp_file.name,
            email_data["subject"],
            email_data["sender"],
            email_data["body"],
            email_data["date"]
        )
        temp_files.append(temp_file.name)
        print(f"   Created: {temp_file.name}")
    
    # Test 2: Upload emails
    print("\n3. Testing email upload...")
    for i, temp_file in enumerate(temp_files):
        try:
            with open(temp_file, 'rb') as f:
                files = {'file': f}
                response = requests.post(f"{base_url}/upload", files=files)
                
                if response.status_code == 200:
                    result = response.json()
                    print(f"✅ Uploaded: {result['filename']}")
                    print(f"   Subject: {result['parsed_data']['subject']}")
                    print(f"   Sender: {result['parsed_data']['sender']}")
                else:
                    print(f"❌ Upload failed: {response.text}")
        except Exception as e:
            print(f"❌ Upload error: {e}")
    
    # Test 3: Get analytics
    print("\n4. Testing analytics...")
    try:
        response = requests.get(f"{base_url}/analytics")
        if response.status_code == 200:
            analytics = response.json()
            print("✅ Analytics retrieved successfully")
            
            print("\n   Top Senders:")
            for sender in analytics['top_senders']:
                print(f"     {sender['sender']}: {sender['count']} emails")
            
            print("\n   Most Common Words:")
            for word in analytics['most_common_words'][:10]:  # Show top 10
                print(f"     '{word['word']}': {word['count']} times")
            
            print("\n   Email Count Over Time:")
            for date, count in analytics['email_count_over_time'].items():
                print(f"     {date}: {count} emails")
        else:
            print(f"❌ Analytics failed: {response.text}")
    except Exception as e:
        print(f"❌ Analytics error: {e}")
    
    # Test 4: Get all emails
    print("\n5. Testing get all emails...")
    try:
        response = requests.get(f"{base_url}/emails")
        if response.status_code == 200:
            emails = response.json()
            print(f"✅ Retrieved {len(emails)} emails")
            for email in emails:
                print(f"   - {email['subject']} from {email['sender']}")
        else:
            print(f"❌ Get emails failed: {response.text}")
    except Exception as e:
        print(f"❌ Get emails error: {e}")
    
    # Test 5: Test weekly grouping
    print("\n6. Testing weekly analytics...")
    try:
        response = requests.get(f"{base_url}/analytics?group_by=weekly")
        if response.status_code == 200:
            analytics = response.json()
            print("✅ Weekly analytics retrieved")
            print("   Email Count Over Time (Weekly):")
            for date, count in analytics['email_count_over_time'].items():
                print(f"     Week of {date}: {count} emails")
        else:
            print(f"❌ Weekly analytics failed: {response.text}")
    except Exception as e:
        print(f"❌ Weekly analytics error: {e}")
    
    # Cleanup
    print("\n7. Cleaning up...")
    for temp_file in temp_files:
        try:
            os.unlink(temp_file)
            print(f"   Deleted: {temp_file}")
        except Exception as e:
            print(f"   Error deleting {temp_file}: {e}")
    
    print("\n🎉 API testing completed!")
    print("\nYou can now:")
    print("- Visit http://localhost:8000/docs for interactive API documentation")
    print("- Use the API endpoints in your frontend application")
    print("- Upload more .eml files for additional analytics")


if __name__ == "__main__":
    test_api() 