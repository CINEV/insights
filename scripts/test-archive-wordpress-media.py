#!/usr/bin/env python3
"""Focused stdlib tests for complete-library coverage and preservation safety."""
import importlib.util
import io
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

module_path = Path(__file__).with_name('archive-wordpress-media.py')
spec = importlib.util.spec_from_file_location('media_archive', module_path)
archive = importlib.util.module_from_spec(spec)
spec.loader.exec_module(archive)


class Response(io.BytesIO):
    def __init__(self, body=b'', length='3'):
        super().__init__(body)
        self.headers = {'Content-Length': length, 'Content-Type': 'image/png'}


class MediaArchiveTests(unittest.TestCase):
    def test_original_unscaled_image_and_all_sizes_are_included(self):
        records = [{
            'id': 7, 'source_url': archive.ORIGIN + '/wp-content/uploads/2026/09/photo-scaled.jpg',
            'media_details': {
                'file': '2026/09/photo-scaled.jpg', 'filesize': 3, 'original_image': 'photo.jpg',
                'sizes': {'thumbnail': {'source_url': archive.ORIGIN + '/wp-content/uploads/2026/09/photo-150x150.jpg', 'filesize': 2}},
            },
        }]
        assets = archive.media_assets(records)
        self.assertEqual({item['path'] for item in assets}, {
            '/wp-content/uploads/2026/09/photo.jpg', '/wp-content/uploads/2026/09/photo-scaled.jpg', '/wp-content/uploads/2026/09/photo-150x150.jpg',
        })
        scaled = next(item for item in assets if item['path'].endswith('photo-scaled.jpg'))
        self.assertEqual({binding['role'] for binding in scaled['roles']}, {'source', 'metadata-file'})

    def test_upload_paths_cannot_escape_the_public_directory(self):
        for url in ['https://example.com/wp-content/uploads/a.jpg', archive.ORIGIN + '/wp-content/uploads/../secret', archive.ORIGIN + '/wp-content/uploads/%2e%2e/secret', archive.ORIGIN + '/wp-content/uploads/a%5cb.jpg']:
            with self.assertRaises(ValueError):
                archive.source_path(url)

    def test_existing_media_is_never_replaced_or_downloaded(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            asset = {'path': '/wp-content/uploads/a.jpg', 'metadataBytes': [3]}
            destination = root / 'public/wp-content/uploads/a.jpg'
            destination.parent.mkdir(parents=True)
            destination.write_bytes(b'old')
            with patch.object(archive, 'request', side_effect=AssertionError('Existing files must not trigger download')):
                result = archive.archive_asset(asset, root, 100)
            self.assertEqual(result['status'], 'existing')
            self.assertEqual(destination.read_bytes(), b'old')

    def test_large_header_blocks_before_get(self):
        with tempfile.TemporaryDirectory() as directory:
            asset = {'path': '/wp-content/uploads/a.jpg', 'sourceUrl': archive.ORIGIN + '/wp-content/uploads/a.jpg', 'metadataBytes': []}
            with patch.object(archive, 'request', return_value=Response(length='101')) as request:
                result = archive.archive_asset(asset, Path(directory), 100)
            self.assertEqual(result['status'], 'blocked')
            request.assert_called_once_with(asset['sourceUrl'], 'HEAD')

    def test_truncated_download_does_not_publish_a_partial_file(self):
        with tempfile.TemporaryDirectory() as directory:
            asset = {'path': '/wp-content/uploads/a.jpg', 'sourceUrl': archive.ORIGIN + '/wp-content/uploads/a.jpg', 'metadataBytes': [4]}
            with patch.object(archive, 'request', side_effect=[Response(length='4'), Response(b'abc', length='4')]):
                result = archive.archive_asset(asset, Path(directory), 100)
            self.assertEqual(result['status'], 'failed')
            self.assertFalse((Path(directory) / 'public/wp-content/uploads/a.jpg').exists())
            self.assertFalse(list(Path(directory).rglob('.media-*')))


if __name__ == '__main__':
    unittest.main()
