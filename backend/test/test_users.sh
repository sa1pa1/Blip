#!/bin/bash

# Quick Test Commands for New Users
# All passwords are: password123

echo "=========================================="
echo "Test Users Created:"
echo "=========================================="
echo "1. alice@test.com / alice_wonder"
echo "2. bob@test.com / bob_builder"
echo "3. charlie@test.com / charlie_choc"
echo "4. diana@test.com / diana_prince"
echo "5. eve@test.com / eve_online"
echo ""
echo "All passwords: password123"
echo "=========================================="
echo ""

# Test login for Alice
echo "Testing login for Alice..."
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"password123"}'
echo ""
echo ""

# Test login for Bob
echo "Testing login for Bob..."
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@test.com","password":"password123"}'
echo ""
echo ""

# Alice sends friend request to Bob (assuming Alice is id=1, Bob is id=2)
echo "Alice (id=1) sends friend request to Bob (id=2)..."
curl -X POST http://localhost:3000/api/connections \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "newConnectionId": 2}'
echo ""
echo ""

# Bob checks pending requests
echo "Bob checks pending requests..."
curl -X GET http://localhost:3000/api/connections/pending/2
echo ""
echo ""

# Get Alice's profile
echo "Getting Alice's profile (id=1)..."
curl -X GET http://localhost:3000/api/users/1
echo ""
echo ""

echo "=========================================="
echo "Test commands completed!"
echo "=========================================="
