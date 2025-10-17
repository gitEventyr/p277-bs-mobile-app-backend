#!/bin/bash

# Test script for soft-deletion with casino actions preservation
BASE_URL="http://localhost:3000"

echo "==================================="
echo "Testing Soft Deletion with Casino Actions"
echo "==================================="
echo ""

# Step 1: Create a test user
echo "1. Creating test user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "DeleteTest User",
    "email": "deletetest@example.com",
    "password": "Test123456",
    "phone": "+1234567890"
  }')

echo "Registration response: $REGISTER_RESPONSE"
USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
VISITOR_ID=$(echo $REGISTER_RESPONSE | grep -o '"visitor_id":"[^"]*"' | sed 's/"visitor_id":"//;s/"//')
echo "Created user ID: $USER_ID"
echo "Created visitor_id: $VISITOR_ID"
echo ""

# Step 2: Login to get JWT token
echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "deletetest@example.com",
    "password": "Test123456"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | sed 's/"token":"//;s/"//')
echo "JWT Token obtained: ${TOKEN:0:50}..."
echo ""

# Step 3: Create a casino action for this user
echo "3. Creating casino action for user..."
CASINO_ACTION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/casinos/action" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "casino_name": "test_casino",
    "registration": true
  }')

echo "Casino action response: $CASINO_ACTION_RESPONSE"
echo ""

# Step 4: Verify casino action exists
echo "4. Verifying casino action exists..."
CASINO_ACTIONS_BEFORE=$(curl -s "$BASE_URL/admin/api/casino-actions?visitor_id=$VISITOR_ID")
echo "Casino actions before deletion: $CASINO_ACTIONS_BEFORE"
echo ""

# Step 5: Soft delete the user
echo "5. Soft deleting user account..."
DELETE_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/delete-account" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{}')

echo "Delete response: $DELETE_RESPONSE"
echo ""

# Step 6: Try to fetch user profile (should fail)
echo "6. Attempting to fetch deleted user profile..."
PROFILE_AFTER=$(curl -s -X GET "$BASE_URL/users/profile" \
  -H "Authorization: Bearer $TOKEN")
echo "Profile fetch after deletion: $PROFILE_AFTER"
echo ""

# Step 7: Check if casino actions still exist
echo "7. Checking if casino actions are preserved..."
CASINO_ACTIONS_AFTER=$(curl -s "$BASE_URL/admin/api/casino-actions?visitor_id=$VISITOR_ID")
echo "Casino actions after deletion: $CASINO_ACTIONS_AFTER"
echo ""

# Step 8: Verify user data is anonymized (admin check)
echo "8. Checking user anonymization in database..."
echo "Note: This would require direct DB access or admin API"
echo ""

echo "==================================="
echo "Test Complete!"
echo "==================================="
echo ""
echo "Summary:"
echo "- User should be soft-deleted (is_deleted=true)"
echo "- Personal data should be anonymized (gibberish)"
echo "- visitor_id should remain UNCHANGED"
echo "- Casino actions should be PRESERVED"
