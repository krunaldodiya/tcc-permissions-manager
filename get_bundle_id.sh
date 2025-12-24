#!/bin/bash

# Get bundle ID from app path
# Usage: get_bundle_id.sh <app_path>

APP_PATH="$1"

if [ -z "$APP_PATH" ]; then
  echo ""
  exit 1
fi

# Get bundle ID from app
BUNDLE_ID=$(defaults read "$APP_PATH/Contents/Info.plist" CFBundleIdentifier 2>/dev/null)

if [ -z "$BUNDLE_ID" ]; then
  echo ""
  exit 1
fi

echo "$BUNDLE_ID"

