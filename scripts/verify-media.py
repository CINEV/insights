#!/usr/bin/env python3
"""Verify maintained site assets locally, without source archives or network access."""
import hashlib
import json
from pathlib import Path


def verify_archive(root: Path) -> dict:
    manifest = json.loads((root / 'src/config/asset-integrity.json').read_text())
    errors = []
    seen = set()
    total = 0
    for asset in manifest['assets']:
        name = asset['path']
        if (not name.startswith('/assets/')
                or any(part in {'.', '..'} for part in name.split('/'))
                or '\\' in name or '\0' in name or name in seen):
            errors.append(f'Invalid or duplicate media path: {name}')
            continue
        seen.add(name)
        path = root / 'public' / name.lstrip('/')
        if not path.is_file():
            errors.append(f'Missing media: {name}')
            continue
        total += path.stat().st_size
        digest = hashlib.sha256()
        with path.open('rb') as source:
            while block := source.read(1024 * 1024):
                digest.update(block)
        if path.stat().st_size != asset['bytes'] or digest.hexdigest() != asset['sha256']:
            errors.append(f'Media integrity mismatch: {name}')
    if len(seen) != len(manifest['assets']):
        errors.append('Manifest asset count mismatch')
    if total != manifest['totalBytes']:
        errors.append('Manifest total size mismatch')
    return {'manifestAssets': len(seen), 'totalBytes': total, 'errors': errors}


if __name__ == '__main__':
    result = verify_archive(Path(__file__).resolve().parents[1])
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(bool(result['errors']))
