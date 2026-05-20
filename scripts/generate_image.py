#!/usr/bin/env python3
"""
Imagen - Google Gemini Image Generation Script
"""

import argparse
import base64
import json
import os
import re
import subprocess
import sys
from pathlib import Path


DEFAULT_MODEL_ID = "gemini-3.1-flash-image-preview"
API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"
DEFAULT_IMAGE_SIZE = "1K"
VALID_SIZES = {"512", "1K", "2K"}


def get_api_endpoint(model_id: str) -> str:
    if not re.fullmatch(r"[\w\-/.]+", model_id):
        print("Error: Invalid model ID", file=sys.stderr)
        sys.exit(1)
    return f"{API_BASE_URL}/{model_id}:generateContent"


def get_api_key() -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable not set", file=sys.stderr)
        sys.exit(1)
    return api_key


def validate_image_size(size: str) -> str:
    if size not in VALID_SIZES:
        return DEFAULT_IMAGE_SIZE
    return size


def create_output_dir(output_path: Path) -> None:
    output_dir = output_path.parent
    if output_dir and not output_dir.exists():
        output_dir.mkdir(parents=True, exist_ok=True)


def build_request_body(prompt: str, image_size: str) -> bytes:
    request_data = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE", "TEXT"],
            "imageConfig": {"image_size": image_size}
        }
    }
    return json.dumps(request_data).encode("utf-8")


def make_api_request(api_key: str, model_id: str, request_body: bytes) -> dict:
    endpoint = get_api_endpoint(model_id)
    result = subprocess.run(
        [
            "curl", "-s", "--max-time", "120",
            "-X", "POST", endpoint,
            "-H", "Content-Type: application/json",
            "-H", f"x-goog-api-key: {api_key}",
            "-d", request_body.decode("utf-8"),
        ],
        capture_output=True,
    )
    if result.returncode != 0:
        print(f"Error: curl failed: {result.stderr.decode()}", file=sys.stderr)
        sys.exit(1)

    try:
        data = json.loads(result.stdout)
        if isinstance(data, list):
            data = data[0]
        if "error" in data:
            print(f"Error: API error: {data['error'].get('message', data['error'])}", file=sys.stderr)
            sys.exit(1)
        return data
    except json.JSONDecodeError as e:
        print(f"Error: Failed to parse API response: {e}", file=sys.stderr)
        sys.exit(1)


def extract_image_data(response: dict) -> str:
    try:
        candidates = (response[0] if isinstance(response, list) else response).get("candidates", [])
        if not candidates:
            raise ValueError("No candidates in response")
        for part in candidates[0].get("content", {}).get("parts", []):
            if "inlineData" in part:
                return part["inlineData"].get("data", "")
        raise ValueError("No image data found in response")
    except (KeyError, IndexError, TypeError) as e:
        print(f"Error: Failed to parse response: {e}", file=sys.stderr)
        sys.exit(1)


def save_image(image_data: str, output_path: Path) -> None:
    try:
        output_path.write_bytes(base64.b64decode(image_data))
    except Exception as e:
        print(f"Error: Failed to save image: {e}", file=sys.stderr)
        sys.exit(1)


def get_file_size(path: Path) -> str:
    size = path.stat().st_size
    for unit in ["B", "KB", "MB", "GB"]:
        if size < 1024:
            return f"{size:.1f} {unit}"
        size /= 1024
    return f"{size:.1f} TB"


def main():
    parser = argparse.ArgumentParser(description="Generate images using Google Gemini AI")
    parser.add_argument("prompt", help="Text description of the image to generate")
    parser.add_argument("output", nargs="?", default="./generated-image.png", help="Output file path")
    parser.add_argument("--size", choices=["512", "1K", "2K"])
    parser.add_argument("--model", "-m")
    args = parser.parse_args()

    api_key = get_api_key()
    model_id = args.model or os.environ.get("GEMINI_MODEL", DEFAULT_MODEL_ID)
    image_size = validate_image_size(args.size or os.environ.get("IMAGE_SIZE", DEFAULT_IMAGE_SIZE))
    output_path = Path(args.output)

    create_output_dir(output_path)

    print(f"Generating: \"{args.prompt}\"")
    print(f"Model: {model_id} | Size: {image_size} | Output: {output_path}")

    request_body = build_request_body(args.prompt, image_size)
    response = make_api_request(api_key, model_id, request_body)
    image_data = extract_image_data(response)

    if not image_data:
        print("Error: No image data received", file=sys.stderr)
        sys.exit(1)

    save_image(image_data, output_path)

    if output_path.exists() and output_path.stat().st_size > 0:
        print(f"Done! {output_path} ({get_file_size(output_path)})")
    else:
        print(f"Error: Failed to save image", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
