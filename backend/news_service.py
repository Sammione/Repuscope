import httpx
import os
from dotenv import load_dotenv
from typing import List, Dict

load_dotenv()

class NewsService:
    def __init__(self):
        self.api_key = os.getenv("NEWS_API_KEY")
        self.base_url = "https://newsapi.org/v2/everything"

    async def fetch_company_news(self, company_name: str) -> List[Dict]:
        """
        Fetches the latest news articles mentioning the company.
        """
        if not self.api_key:
            return [
                {
                    "source": "System",
                    "title": "News API Key missing",
                    "description": "Please add NEWS_API_KEY to your .env file.",
                    "url": "#",
                    "sentiment": "neutral"
                }
            ]

        try:
            async with httpx.AsyncClient() as client:
                params = {
                    "q": company_name,
                    "sortBy": "publishedAt",
                    "language": "en",
                    "apiKey": self.api_key,
                    "pageSize": 5
                }
                response = await client.get(self.base_url, params=params)
                response.raise_for_status()
                data = response.json()
                
                articles = data.get("articles", [])
                formatted_news = []
                
                for art in articles:
                    text_to_analyze = f"{art['title']} {art['description'] or ''}"
                    sentiment = await self.analyze_sentiment(text_to_analyze)
                    
                    formatted_news.append({
                        "source": art["source"]["name"],
                        "title": art["title"],
                        "description": art["description"],
                        "url": art["url"],
                        "published_at": art["publishedAt"],
                        "sentiment": sentiment
                    })
                
                return formatted_news
        except Exception as e:
            print(f"Error fetching news: {e}")
            return []

    async def analyze_sentiment(self, text: str) -> str:
        """
        Analyze news sentiment using OpenAI.
        """
        openai_key = os.getenv("OPENAI_API_KEY")
        if not openai_key:
            return "Neutral"

        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=openai_key)
            
            response = await client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Analyze the sentiment of the following news headline for a company reputation system. Respond with exactly one word: Positive, Negative, or Neutral."},
                    {"role": "user", "content": text}
                ],
                max_tokens=10
            )
            sentiment = response.choices[0].message.content.strip()
            return sentiment if sentiment in ["Positive", "Negative", "Neutral"] else "Neutral"
        except Exception:
            return "Neutral"
