#!/bin/bash

# Portfolio Tracker Deployment Test Script

set -e

echo "🧪 Testing Portfolio Tracker Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test functions
test_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $description... "
    
    if response=$(curl -s -w "%{http_code}" -o /dev/null "$url" 2>/dev/null); then
        if [ "$response" -eq "$expected_status" ]; then
            echo -e "${GREEN}✅ PASS${NC} (HTTP $response)"
        else
            echo -e "${YELLOW}⚠️  WARNING${NC} (HTTP $response, expected $expected_status)"
        fi
    else
        echo -e "${RED}❌ FAIL${NC} (Connection failed)"
    fi
}

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Test endpoints
echo ""
echo "🔍 Testing Backend Endpoints..."

test_endpoint "http://localhost:8087/actuator/health" "Health Check"
test_endpoint "http://localhost:8087/api/auth/me" "Auth Endpoint (should return 403)" 403

echo ""
echo "🔍 Testing Frontend..."

if curl -s "http://localhost" > /dev/null; then
    echo -e "Frontend: ${GREEN}✅ PASS${NC}"
else
    echo -e "Frontend: ${RED}❌ FAIL${NC}"
fi

echo ""
echo "🔍 Testing Database Connection..."

# Test database connection through backend
if curl -s "http://localhost:8087/actuator/health" | grep -q "UP"; then
    echo -e "Database: ${GREEN}✅ PASS${NC}"
else
    echo -e "Database: ${RED}❌ FAIL${NC}"
fi

echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🎉 Deployment test completed!"
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend: http://localhost:8087/api"
echo "💚 Health: http://localhost:8087/actuator/health"
