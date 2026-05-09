import hashlib
import logging
from datetime import datetime
from typing import Optional

import feedparser
import httpx
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session

from app.models.article import Article
from app.services.openai_service import classify_article, classify_ai_article

logger = logging.getLogger(__name__)

RSS_FEEDS = [
    {"url": "https://feeds.feedburner.com/HighScalability", "source": "High Scalability", "category": "engineering"},
    {"url": "https://netflixtechblog.com/feed", "source": "Netflix Tech Blog", "category": "engineering"},
    {"url": "https://eng.uber.com/feed/", "source": "Uber Engineering", "category": "engineering"},
    {"url": "https://martinfowler.com/feed.atom", "source": "Martin Fowler", "category": "engineering"},
    {"url": "https://infosec.exchange/@InfoQ.rss", "source": "InfoQ", "category": "engineering"},
    {"url": "https://discord.com/blog/rss.xml", "source": "Discord Engineering", "category": "engineering"},
    {"url": "https://dev.to/feed/tag/systemdesign", "source": "dev.to", "category": "engineering"},
    {"url": "https://engineering.fb.com/feed/", "source": "Meta Engineering", "category": "engineering"},
    {"url": "https://medium.com/feed/tag/system-design", "source": "Medium System Design", "category": "engineering"},
    {"url": "https://blog.bytebytego.com/feed", "source": "ByteByteGo", "category": "engineering"},
]

AI_FEEDS = [
    {"url": "https://huggingface.co/blog/feed.xml", "source": "HuggingFace Blog", "category": "ai"},
    {"url": "https://openai.com/news/rss.xml", "source": "OpenAI", "category": "ai"},
    {"url": "https://www.anthropic.com/rss.xml", "source": "Anthropic", "category": "ai"},
    {"url": "https://deepmind.google/blog/rss", "source": "Google DeepMind", "category": "ai"},
    {"url": "https://read.deeplearning.ai/the-batch/rss/", "source": "The Batch", "category": "ai"},
    {"url": "https://importai.substack.com/feed", "source": "Import AI", "category": "ai"},
    {"url": "https://sebastianraschka.com/rss_feed.xml", "source": "Sebastian Raschka", "category": "ai"},
    {"url": "https://dev.to/feed/tag/machinelearning", "source": "dev.to ML", "category": "ai"},
    {"url": "https://paperswithcode.com/latest.rss", "source": "Papers With Code", "category": "ai"},
    {"url": "https://towardsdatascience.com/feed", "source": "Towards Data Science", "category": "ai"},
]

ALL_FEEDS = RSS_FEEDS + AI_FEEDS


def _extract_text(html: str, max_chars: int = 3000) -> str:
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()
    return soup.get_text(separator=" ", strip=True)[:max_chars]


def _fetch_full_content(url: str) -> Optional[str]:
    try:
        headers = {"User-Agent": "Mozilla/5.0 (compatible; SDEHubBot/1.0)"}
        resp = httpx.get(url, headers=headers, timeout=10, follow_redirects=True)
        resp.raise_for_status()
        return _extract_text(resp.text)
    except Exception as e:
        logger.debug("Could not fetch full content for %s: %s", url, e)
        return None


def _parse_date(entry) -> Optional[datetime]:
    for attr in ("published_parsed", "updated_parsed"):
        t = getattr(entry, attr, None)
        if t:
            try:
                return datetime(*t[:6])
            except Exception:
                pass
    return datetime.utcnow()


def _get_thumbnail(entry) -> Optional[str]:
    if hasattr(entry, "media_thumbnail") and entry.media_thumbnail:
        return entry.media_thumbnail[0].get("url")
    if hasattr(entry, "media_content") and entry.media_content:
        return entry.media_content[0].get("url")
    return None


def poll_feed(feed_config: dict, db: Session) -> int:
    """Poll a single RSS feed and persist new articles. Returns count of new articles."""
    feed_url = feed_config["url"]
    source = feed_config["source"]
    category = feed_config.get("category", "engineering")
    new_count = 0

    try:
        feed = feedparser.parse(feed_url)
    except Exception as e:
        logger.error("Failed to parse feed %s: %s", feed_url, e)
        return 0

    for entry in feed.entries[:20]:
        url = entry.get("link", "")
        if not url:
            continue

        # Dedup by URL
        existing = db.query(Article).filter(Article.url == url).first()
        if existing:
            continue

        title = entry.get("title", "Untitled")
        raw_content = ""

        # Try to get content from feed first
        if hasattr(entry, "content") and entry.content:
            raw_content = _extract_text(entry.content[0].get("value", ""))
        elif hasattr(entry, "summary"):
            raw_content = _extract_text(entry.get("summary", ""))

        # If content too short, fetch full article
        if len(raw_content) < 300:
            fetched = _fetch_full_content(url)
            if fetched:
                raw_content = fetched

        if category == "ai":
            classification = classify_ai_article(title, raw_content)
        else:
            classification = classify_article(title, raw_content)

        article = Article(
            title=title,
            url=url,
            source=source,
            author=entry.get("author", None),
            raw_content=raw_content[:5000],
            summary=classification.get("summary", ""),
            thumbnail_url=_get_thumbnail(entry),
            content_type=classification.get("content_type", "HLD"),
            level=classification.get("level", "SDE-2"),
            topics=classification.get("topics", []),
            category=category,
            published_at=_parse_date(entry),
            is_classified=True,
        )
        db.add(article)
        new_count += 1

    if new_count:
        db.commit()
        logger.info("Saved %d new articles from %s", new_count, source)

    return new_count


def poll_all_feeds(db: Session) -> int:
    """Poll all configured RSS feeds (engineering + AI). Returns total new articles."""
    total = 0
    for feed_config in ALL_FEEDS:
        try:
            total += poll_feed(feed_config, db)
        except Exception as e:
            logger.error("Error polling feed %s: %s", feed_config["source"], e)
    return total
