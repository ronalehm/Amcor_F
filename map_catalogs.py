import re

# Read the catalog registry file
with open('src/shared/catalogs/catalog.registry.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all catalog definitions
pattern = r'\{\s*id:\s*"(catalog_[^"]+)"\s*,\s*code:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"\s*,\s*description:\s*"([^"]+)"\s*,\s*ownerModule:\s*"([^"]+)"\s*,\s*ownerSystem:\s*"([^"]+)"\s*,'

matches = re.findall(pattern, content, re.DOTALL)

print(f"Found {len(matches)} catalogs\n")
print("| CAT | Código | Nombre | Sistema | Módulo | Descripción |")
print("|-----|--------|--------|---------|--------|-------------|")

for i, match in enumerate(matches, 1):
    cat_id, code, name, desc, module, system = match
    cat_code = f"CAT-{i:03d}"
    # Truncate description to fit
    desc_short = desc.replace('\n', ' ')[:50] + '...' if len(desc) > 50 else desc.replace('\n', ' ')
    print(f"| {cat_code} | {code} | {name} | {system} | {module} | {desc_short} |")
