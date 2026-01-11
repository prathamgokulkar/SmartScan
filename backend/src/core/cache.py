from functools import lru_cache

# In-memory store to simulate a larger cache
# Structure: { query_string: { "answer": str, "source_documents": list } }
_manual_cache = {}

def get_cached_response(query: str):
    """
    Checks if the exact query exists in our manual cache.
    Returns the cached dict or None.
    """
    normalized_query = query.strip().lower()
    if normalized_query in _manual_cache:
        print(f"--- Cache: HIT for query '{query}' ---")
        return _manual_cache[normalized_query]
    
    print(f"--- Cache: MISS for query '{query}' ---")
    return None

def cache_response(query: str, response: str):
    """
    Saves the response to the cache.
    """
    normalized_query = query.strip().lower()
    _manual_cache[normalized_query] = response
    print(f"--- Cache: STORED response for '{query}' ---")
