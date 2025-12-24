#!/bin/bash

# Get list of installed applications
# Searches in ~/Applications and /Applications (excluding system apps)
(
  # Try mdfind first (user's preferred method)
  if command -v mdfind >/dev/null 2>&1; then
    mdfind -onlyin "$HOME/Applications" "kMDItemContentType == 'com.apple.application-bundle'" 2>/dev/null
    mdfind -onlyin /Applications "kMDItemContentType == 'com.apple.application-bundle' && kMDItemSystemContent == 0" 2>/dev/null
  fi
  
  # Fallback to find if mdfind doesn't work or returns nothing
  if [ -d "$HOME/Applications" ]; then
    find "$HOME/Applications" -name "*.app" -type d -maxdepth 3 2>/dev/null
  fi
  if [ -d "/Applications" ]; then
    find /Applications -name "*.app" -type d -maxdepth 1 2>/dev/null
  fi
) | sort -u

