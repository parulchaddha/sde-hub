import json
import logging
from openai import OpenAI
from app.config import settings

logger = logging.getLogger(__name__)

TOPICS = [
    "Caching", "Databases", "Messaging Queues", "Load Balancing",
    "Rate Limiting", "Authentication", "API Design", "Microservices",
    "Storage", "Search", "Monitoring", "CDN", "Concurrency",
    "Object-Oriented Design", "Design Patterns", "Data Structures",
    "System Architecture", "Distributed Systems", "Streaming",
]

AI_TOPICS = [
    "LLMs", "Training & Fine-tuning", "Inference & Serving",
    "Agents & Tooling", "Multimodal", "Alignment & Safety",
    "Research Papers", "Product Launches", "ML Infrastructure",
    "Prompt Engineering", "RAG", "AI Policy", "Computer Vision",
    "Reinforcement Learning", "Model Evaluation",
]

CLASSIFY_PROMPT = """You are an expert software engineering content classifier.

Given an article title and content snippet, classify it and return JSON only.

Rules:
- content_type: "LLD" (object design, patterns, classes, code structure), "HLD" (distributed systems, scalability, infrastructure), or "Both"
- level: "SDE-1" (fundamentals, basic patterns, intro DS/algorithms), "SDE-2" (scalability, distributed systems, production concerns), "SDE-3" (staff-level, deep architecture tradeoffs, org-level decisions)
- topics: 1-4 topics from the list: {topics}
- summary: A crisp 2-3 sentence TL;DR suitable for an engineer's feed card

Respond ONLY with valid JSON, no markdown, no explanation:
{{
  "content_type": "...",
  "level": "...",
  "topics": ["...", "..."],
  "summary": "..."
}}
"""

CLASSIFY_AI_PROMPT = """You are an expert AI/ML content classifier for software engineers.

Given an article title and content snippet, classify it and return JSON only.

Rules:
- content_type: always "AI"
- level: "SDE-1" (beginner explainer, basic concepts), "SDE-2" (applied ML, production ML systems), "SDE-3" (research papers, advanced architecture, frontier models)
- topics: 1-4 topics from the list: {topics}
- summary: A crisp 2-3 sentence TL;DR focused on why this matters to a software engineer

Respond ONLY with valid JSON, no markdown, no explanation:
{{
  "content_type": "AI",
  "level": "...",
  "topics": ["...", "..."],
  "summary": "..."
}}
"""


def classify_article(title: str, content: str) -> dict:
    """Classify an article using GPT-4o-mini. Returns classification dict."""
    if not settings.OPENAI_API_KEY:
        return _rule_based_fallback(title, content)

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    snippet = content[:2000] if content else ""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": CLASSIFY_PROMPT.format(topics=", ".join(TOPICS)),
                },
                {
                    "role": "user",
                    "content": f"Title: {title}\n\nContent:\n{snippet}",
                },
            ],
            temperature=0.2,
            max_tokens=400,
        )
        raw = response.choices[0].message.content.strip()
        return json.loads(raw)
    except Exception as e:
        logger.warning("OpenAI classification failed for '%s': %s", title, e)
        return _rule_based_fallback(title, content)


def classify_ai_article(title: str, content: str) -> dict:
    """Classify an AI/ML article using GPT-4o-mini. Returns classification dict."""
    if not settings.OPENAI_API_KEY:
        return _ai_rule_based_fallback(title, content)

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    snippet = content[:2000] if content else ""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": CLASSIFY_AI_PROMPT.format(topics=", ".join(AI_TOPICS)),
                },
                {
                    "role": "user",
                    "content": f"Title: {title}\n\nContent:\n{snippet}",
                },
            ],
            temperature=0.2,
            max_tokens=400,
        )
        raw = response.choices[0].message.content.strip()
        return json.loads(raw)
    except Exception as e:
        logger.warning("OpenAI AI classification failed for '%s': %s", title, e)
        return _ai_rule_based_fallback(title, content)


def _ai_rule_based_fallback(title: str, content: str) -> dict:
    """Keyword-based fallback for AI articles when OpenAI is unavailable."""
    text = (title + " " + content).lower()

    sde3_keywords = ["research", "paper", "arxiv", "benchmark", "frontier", "pretraining", "scaling law"]
    sde1_keywords = ["introduction", "beginner", "what is", "getting started", "101", "explained", "guide"]
    if any(k in text for k in sde3_keywords):
        level = "SDE-3"
    elif any(k in text for k in sde1_keywords):
        level = "SDE-1"
    else:
        level = "SDE-2"

    topic_map = {
        "LLMs": ["llm", "large language model", "gpt", "claude", "gemini", "llama", "mistral"],
        "Training & Fine-tuning": ["fine-tun", "training", "lora", "qlora", "peft", "rlhf", "sft"],
        "Inference & Serving": ["inference", "serving", "latency", "throughput", "vllm", "tensorrt", "quantiz"],
        "Agents & Tooling": ["agent", "tool use", "function call", "langchain", "autogen", "agentic"],
        "RAG": ["rag", "retrieval", "vector search", "embedding", "chunk"],
        "Alignment & Safety": ["alignment", "safety", "hallucin", "bias", "jailbreak", "red team"],
        "Multimodal": ["multimodal", "vision", "image", "audio", "video", "clip"],
        "Product Launches": ["launch", "release", "announc", "available", "new model", "update"],
        "Research Papers": ["paper", "arxiv", "we propose", "we introduce", "experiment", "results show"],
        "ML Infrastructure": ["mlops", "pipeline", "deployment", "monitoring", "drift", "feature store"],
    }
    topics = [t for t, kws in topic_map.items() if any(kw in text for kw in kws)]
    if not topics:
        topics = ["LLMs"]

    return {
        "content_type": "AI",
        "level": level,
        "topics": topics[:3],
        "summary": title,
    }


def _rule_based_fallback(title: str, content: str) -> dict:
    """Simple keyword-based fallback when OpenAI is unavailable."""
    text = (title + " " + content).lower()

    # Determine level
    sde3_keywords = ["staff", "principal", "architecture review", "org", "migration at scale", "multi-region"]
    sde1_keywords = ["introduction", "beginner", "basics", "what is", "getting started", "101", "fundamentals"]
    if any(k in text for k in sde3_keywords):
        level = "SDE-3"
    elif any(k in text for k in sde1_keywords):
        level = "SDE-1"
    else:
        level = "SDE-2"

    # Determine type
    lld_keywords = ["class diagram", "design pattern", "solid", "oop", "object orient", "low level", "lld"]
    hld_keywords = ["distributed", "scalab", "microservice", "kafka", "kubernetes", "sharding", "replication"]
    if any(k in text for k in lld_keywords) and any(k in text for k in hld_keywords):
        content_type = "Both"
    elif any(k in text for k in lld_keywords):
        content_type = "LLD"
    else:
        content_type = "HLD"

    # Determine topics
    topic_map = {
        "Caching": ["cache", "redis", "memcached", "cdn", "ttl"],
        "Databases": ["database", "sql", "nosql", "postgres", "mysql", "mongodb", "cassandra"],
        "Messaging Queues": ["kafka", "rabbitmq", "queue", "pub/sub", "event stream"],
        "Load Balancing": ["load balanc", "nginx", "reverse proxy", "round robin"],
        "Rate Limiting": ["rate limit", "throttl", "token bucket", "leaky bucket"],
        "Microservices": ["microservice", "service mesh", "api gateway", "container"],
        "Design Patterns": ["pattern", "singleton", "factory", "observer", "strategy"],
        "Distributed Systems": ["distributed", "consensus", "raft", "paxos", "cap theorem"],
    }
    topics = [t for t, kws in topic_map.items() if any(kw in text for kw in kws)]
    if not topics:
        topics = ["System Architecture"]

    return {
        "content_type": content_type,
        "level": level,
        "topics": topics[:3],
        "summary": title,
    }
