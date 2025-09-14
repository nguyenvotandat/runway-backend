# Test Campaign APIs with PowerShell

Write-Host "🚀 Testing Campaign APIs..." -ForegroundColor Green
Write-Host ""

# Test 1: Get all campaigns
Write-Host "1. Get all campaigns:" -ForegroundColor Yellow
try {
    $response1 = Invoke-RestMethod -Uri "http://localhost:3000/api/campaigns" -Method GET -ContentType "application/json"
    $response1 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Get active campaigns only
Write-Host "2. Get active campaigns only:" -ForegroundColor Yellow
try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:3000/api/campaigns?status=ACTIVE" -Method GET -ContentType "application/json"
    $response2 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Get campaign by code
Write-Host "3. Get campaign by code SUMMER25:" -ForegroundColor Yellow
try {
    $response3 = Invoke-RestMethod -Uri "http://localhost:3000/api/campaigns/code/SUMMER25" -Method GET -ContentType "application/json"
    $response3 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Validate voucher - valid case
Write-Host "4. Test voucher validation - SUMMER25 with valid cart:" -ForegroundColor Yellow
try {
    $body1 = @{
        code = "SUMMER25"
        userId = "user123"
        cartItems = @(
            @{
                variantId = "variant1"
                quantity = 2
                price = 75000
                productId = "product1"
            },
            @{
                variantId = "variant2"
                quantity = 1
                price = 45000
                productId = "product2"
            }
        )
    }
    
    $response4 = Invoke-RestMethod -Uri "http://localhost:3000/api/campaigns/validate-voucher" -Method POST -Body ($body1 | ConvertTo-Json -Depth 10) -ContentType "application/json"
    $response4 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: Invalid voucher code
Write-Host "5. Test invalid voucher code:" -ForegroundColor Yellow
try {
    $body2 = @{
        code = "INVALID_CODE"
        userId = "user123"
        cartItems = @(
            @{
                variantId = "variant1"
                quantity = 1
                price = 100000
            }
        )
    }
    
    $response5 = Invoke-RestMethod -Uri "http://localhost:3000/api/campaigns/validate-voucher" -Method POST -Body ($body2 | ConvertTo-Json -Depth 10) -ContentType "application/json"
    $response5 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 6: Test Flash Sale voucher
Write-Host "6. Test Flash Sale voucher (FLASH50K) with valid cart:" -ForegroundColor Yellow
try {
    $body3 = @{
        code = "FLASH50K"
        userId = "user123"
        cartItems = @(
            @{
                variantId = "variant1"
                quantity = 1
                price = 250000
            }
        )
    }
    
    $response6 = Invoke-RestMethod -Uri "http://localhost:3000/api/campaigns/validate-voucher" -Method POST -Body ($body3 | ConvertTo-Json -Depth 10) -ContentType "application/json"
    $response6 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "✅ Test completed!" -ForegroundColor Green