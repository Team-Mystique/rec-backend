#!/bin/bash

# Manual API Test Script for rec-backend
echo " Testing rec-backend API functionality..."

# Set up test environment
export MONGODB_URI="mongodb://localhost:27017/rec-backend-test"
export JWT_SECRET="test-secret-key-for-development-only"
export PORT=5001

echo " Environment variables set"
echo " Server will run on port $PORT"
echo " MongoDB URI: $MONGODB_URI"

# Test 1: Start server and check if it runs
echo ""
echo " Test 1: Starting server..."
node ../server.js &
SERVER_PID=$!
sleep 3

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
   echo " Server started successfully (PID: $SERVER_PID)"
else
   echo " Server failed to start"
   exit 1
fi

# Test 2: Test home endpoint
echo ""
echo "🏠 Test 2: Testing home endpoint..."
RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:$PORT/)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo " Home endpoint working - HTTP $HTTP_CODE"
    echo " Response: $BODY"
else
    echo " Home endpoint failed - HTTP $HTTP_CODE"
fi

# Test 3: Test user registration (should fail without MongoDB)
echo ""
echo " Test 3: Testing user registration endpoint..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:$PORT/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"student"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n1)

echo " Registration response: HTTP $HTTP_CODE"
echo " Body: $BODY"

# Test 4: Test JWT token generation
echo ""
echo " Test 4: Testing JWT token generation..."
cd ..
node generate-token.js

# Clean up
echo ""
echo " Cleaning up..."
kill $SERVER_PID
echo " Server stopped"

echo ""
echo " Manual testing completed!"
echo " Note: Full functionality requires MongoDB connection"