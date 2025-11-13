#!/bin/bash

# Helper script to launch the iOS simulator for Cardano Identity Mobile.
# It starts Metro (with elevated file descriptor limits) and then runs the simulator.
# Usage: ./scripts/run-ios-sim.sh ["Simulator Name"]

set -euo pipefail

SIMULATOR_NAME=${1:-"iPhone 15"}
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MOBILE_DIR="$PROJECT_ROOT/mobile"

if [ ! -d "$MOBILE_DIR" ]; then
  echo "❌ Mobile project not found at $MOBILE_DIR" >&2
  exit 1
fi

cd "$MOBILE_DIR"

# Increase file descriptor limit to avoid EMFILE errors
ulimit -n 16384 || true

# Warn if watchman is missing (helps with file watching)
if ! command -v watchman >/dev/null 2>&1; then
  echo "⚠️  watchman not found. Install with 'brew install watchman' for better performance."
fi

# Ensure previous Metro instances are closed
if pgrep -f "react-native start" >/dev/null; then
  echo "ℹ️  Detected running Metro bundler, terminating..."
  pkill -f "react-native start" || true
  sleep 2
fi

echo "🚀 Starting Metro bundler..."
npx react-native start --reset-cache --no-interactive --port 8081 > /tmp/cardanoid-metro.log 2>&1 &
METRO_PID=$!

cleanup() {
  if ps -p $METRO_PID >/dev/null 2>&1; then
    echo "🛑 Stopping Metro (PID $METRO_PID)..."
    kill $METRO_PID
  fi
}
trap cleanup EXIT

# Give Metro a moment to boot
sleep 5

echo "📱 Launching simulator: $SIMULATOR_NAME"
npx react-native run-ios --simulator "$SIMULATOR_NAME" --no-packager --scheme CardanoIdentityMobile

echo "✅ Simulator launched. Metro logs are in /tmp/cardanoid-metro.log"
