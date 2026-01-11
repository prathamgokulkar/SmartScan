
import os

env_path = 'backend/.env'

with open(env_path, 'r') as f:
    content = f.read()

# Fix missing newline between keys
# Look for "QDRANT_API_KEY
if '"QDRANT_API_KEY' in content:
    content = content.replace('"QDRANT_API_KEY', '"\nQDRANT_API_KEY')
elif "'QDRANT_API_KEY" in content:
     content = content.replace("'QDRANT_API_KEY", "'\nQDRANT_API_KEY")

with open(env_path, 'w') as f:
    f.write(content)

print("Fixed .env file")
