#!/bin/bash
echo "� Starting Hackwell AI Integration Test..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Checking project structure..."

# Check backend directory
if [[ -d "backend" ]]; then
    print_success "Backend directory exists"
else
    print_error "Backend directory not found!"
    exit 1
fi

# Check key backend files
backend_files=("backend/main.py" "backend/app/database.py" "backend/app/models.py" "backend/app/routers/auth.py")
for file in "${backend_files[@]}"; do
    if [[ -f "$file" ]]; then
        print_success "✓ $file"
    else
        print_error "✗ $file not found"
        exit 1
    fi
done

# Check frontend integration files
frontend_files=("lib/api.ts" "lib/auth.tsx" "components/integration-status.tsx")
for file in "${frontend_files[@]}"; do
    if [[ -f "$file" ]]; then
        print_success "✓ $file"
    else
        print_error "✗ $file not found"
        exit 1
    fi
done

# Test backend if running
print_status "Testing backend endpoints..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/ 2>/dev/null)

if [ "$BACKEND_STATUS" = "200" ]; then
    print_success "Backend is running on http://localhost:8000"
    
    # Test specific endpoints
    if curl -s http://localhost:8000/api/patients/ | grep -q "\["; then
        print_success "✓ Patients endpoint working"
    else
        print_warning "⚠ Patients endpoint test failed"
    fi

    if curl -s http://localhost:8000/api/analytics/ | grep -q "total_patients"; then
        print_success "✓ Analytics endpoint working"
    else
        print_warning "⚠ Analytics endpoint test failed"
    fi
else
    print_warning "Backend not running. Start it with: cd backend && uvicorn main:app --reload"
fi

# Test frontend if running
print_status "Testing frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null)

if [ "$FRONTEND_STATUS" = "200" ]; then
    print_success "Frontend is running on http://localhost:3000"
else
    print_warning "Frontend not running. Start it with: pnpm dev"
fi

print_success "🎉 Integration test completed!"
echo ""
echo "📊 Test Results:"
echo "=================="
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend API: http://localhost:8000"
    echo "✅ API Documentation: http://localhost:8000/docs"
else
    echo "❌ Backend API: Not running"
fi

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend App: http://localhost:3000"
else
    echo "❌ Frontend App: Not running"
fi

echo ""
echo "� Demo Credentials:"
echo "Email: demo@hackwell.ai"
echo "Password: demo123"
echo ""
echo "🚀 To start servers:"
echo "Backend: cd backend && uvicorn main:app --reload"
echo "Frontend: pnpm dev"
echo ""
print_status "Integration test complete. Check the results above."
