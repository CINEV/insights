#!/usr/bin/env python3
"""Importer regressions: preserve authored RSS/translation YAML during refresh."""
import importlib.util
import ast
from pathlib import Path
from types import SimpleNamespace
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('wordpress_importer', Path(__file__).with_name('import-wordpress.py'))
importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(importer)


class FrontmatterPreservationTests(unittest.TestCase):
    def test_plain_yaml_and_nested_enclosure_survive_refresh(self):
        source = '''---
title: Old title
rssGuid: urn:uuid:keep-this-guid
rssEnclosure:
  url: /insights/images/movie.mp4
  length: 123
  type: video/mp4
translationKey: article-three-languages # Editors may use plain YAML.
draft: false
---

Old body
'''
        preserved = importer.preserved_frontmatter(source)
        refreshed = importer.content_document({'title': 'Updated title', 'rssGuid': 'new-unstable-guid', 'translationKey': 'new-key'}, 'New body', preserved)
        self.assertIn('title: "Updated title"', refreshed)
        self.assertIn('rssGuid: urn:uuid:keep-this-guid\n', refreshed)
        self.assertIn('rssEnclosure:\n  url: /insights/images/movie.mp4\n  length: 123\n  type: video/mp4\n', refreshed)
        self.assertIn('translationKey: article-three-languages # Editors may use plain YAML.\n', refreshed)
        self.assertEqual(refreshed.count('rssGuid:'), 1)
        self.assertNotIn('new-unstable-guid', refreshed)
        self.assertNotIn('draft: false', refreshed)
        self.assertTrue(refreshed.endswith('New body\n'))

    def test_folded_guid_and_quoted_key_are_preserved(self):
        source = '---\n"rssGuid": >-\n  https://cinev.com/insights/?p=123\ntranslationKey: "wordpress-123"\n---\nBody'
        preserved = importer.preserved_frontmatter(source)
        self.assertEqual(preserved['rssGuid'], '"rssGuid": >-\n  https://cinev.com/insights/?p=123')
        self.assertEqual(preserved['translationKey'], 'translationKey: "wordpress-123"')

    def test_json_enclosure_remains_verbatim(self):
        source = '---\nrssEnclosure: {"url": "/video.mp4", "length": 5, "type": "video/mp4"}\n---\n'
        preserved = importer.preserved_frontmatter(source)
        self.assertEqual(preserved['rssEnclosure'], 'rssEnclosure: {"url": "/video.mp4", "length": 5, "type": "video/mp4"}')

    def test_body_metadata_is_not_mistaken_for_frontmatter(self):
        for source in ['rssGuid: body-only', '---\ntitle: Hello\n---\n\nrssGuid: body-only', '---\nrssGuid: unclosed']:
            self.assertEqual(importer.preserved_frontmatter(source), {})

    def test_new_document_uses_generated_metadata(self):
        document = importer.content_document({'rssGuid': 'source-guid', 'translationKey': 'source-key'}, '<p>Original body</p>')
        self.assertIn('rssGuid: "source-guid"', document)
        self.assertIn('translationKey: "source-key"', document)

    def test_reimport_cached_binary_asset_does_not_read_yaml(self):
        # Exercise the nested downloader without network or a full-site import.
        tree = ast.parse(Path(importer.__file__).read_text())
        main = next(node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == 'main')
        downloader = next(node for node in main.body if isinstance(node, ast.FunctionDef) and node.name == 'fetch_asset')
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            asset = root / 'public/wp-content/uploads/2026/01/binary.png'
            asset.parent.mkdir(parents=True)
            asset.write_bytes(b'\x89PNG\r\n\x1a\n\xff\x00')
            environment = dict(importer.__dict__, root=root, source_root=root / 'cache', args=SimpleNamespace(use_cache=True), asset_map={}, asset_records={}, failures=[])
            environment['request'] = lambda url: self.fail('A cached binary must not be downloaded')
            exec(compile(ast.Module(body=[downloader], type_ignores=[]), importer.__file__, 'exec'), environment)
            url = importer.ORIGIN + '/wp-content/uploads/2026/01/binary.png'
            self.assertEqual(environment['fetch_asset'](url), set())
            self.assertEqual(environment['failures'], [])
            self.assertEqual(environment['asset_records'][url]['bytes'], 10)


if __name__ == '__main__':
    unittest.main()
