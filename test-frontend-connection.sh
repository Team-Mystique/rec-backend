#!/bin/bash

# Frontend-Backend Connectivity Test Script
echo "🔗 Testing Frontend-Backend Connectivity..."

# Set test port
PORT=${PORT:-5000}
BASE_URL="http://localhost:$PORT"

echo "📡 Backend URL: $BASE_URL"
echo ""

# Start server in background
echo "🚀 Starting backend server..."
node server.js &
SERVER_PID=$!
sleep 3

# Check if server is running
if ! ps -p $SERVER_PID > /dev/null; then
   echo "❌ Server failed to start"
   exit 1
fi

echo "✅ Server started (PID: $SERVER_PID)"
echo ""

# Test 1: Health check endpoint
echo "🏥 Test 1: Health Check"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Health check passed - HTTP $HTTP_CODE"
    echo "$(echo "$RESPONSE" | head -n1 | jq -r '.message')"
else
    echo "❌ Health check failed - HTTP $HTTP_CODE"
fi
echo ""

# Test 2: API Info endpoint
echo "📚 Test 2: API Information"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api-info")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ API info endpoint working - HTTP $HTTP_CODE"
    echo "API Version: $(echo "$RESPONSE" | head -n1 | jq -r '.version')"
else
    echo "❌ API info endpoint failed - HTTP $HTTP_CODE"
fi
echo ""

# Test 3: CORS preflight request simulation
echo "🌐 Test 3: CORS Preflight (OPTIONS)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X OPTIONS "$BASE_URL/api/dashboard" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "204" ]; then
    echo "✅ CORS preflight passed - HTTP $HTTP_CODE"
else
    echo "❌ CORS preflight failed - HTTP $HTTP_CODE"
fi
echo ""

# Test 4: Frontend origin test
echo "🎯 Test 4: Frontend Origin Acceptance"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/" \
  -H "Origin: http://localhost:3000")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Frontend origin accepted - HTTP $HTTP_CODE"
else
    echo "❌ Frontend origin rejected - HTTP $HTTP_CODE"
fi
echo ""

# Test 5: JSON content type handling
echo "📄 Test 5: JSON Content Type"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"test": "data"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" != "500" ]; then
    echo "✅ JSON parsing working - HTTP $HTTP_CODE"
    echo "$(echo "$RESPONSE" | head -n1 | jq -r '.message')"
else
    echo "❌ JSON parsing failed - HTTP $HTTP_CODE"
fi
echo ""

# Test 6: 404 handling for undefined routes
echo "🚫 Test 6: 404 Route Handling"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/nonexistent")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "404" ]; then
    echo "✅ 404 handling working - HTTP $HTTP_CODE"
else
    echo "❌ 404 handling failed - HTTP $HTTP_CODE"
fi
echo ""

# Clean up
echo "🧹 Cleaning up..."
kill $SERVER_PID
echo "✅ Server stopped"

echo ""
echo "🎉 Frontend-Backend connectivity tests completed!"
echo "💡 Use these endpoints in your frontend:"
echo "   - Health: GET $BASE_URL/health"
echo "   - API Info: GET $BASE_URL/api-info"
echo "   - Register: POST $BASE_URL/register"
echo "   - Login: POST $BASE_URL/login"
echo "   - Dashboard: GET $BASE_URL/api/dashboard"
echo ""
echo "🔐 Remember to include 'Authorization: Bearer <token>' header for protected routes"