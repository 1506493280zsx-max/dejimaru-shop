$envFile = Get-Content ".env.local" | Where-Object { $_ -match "=" }
$env = @{}
foreach ($line in $envFile) {
    $parts = $line -split "=", 2
    $env[$parts[0].Trim()] = $parts[1].Trim()
}

$base = $env["DIRECTUS_URL"]
$token = $env["ADMIN_TOKEN"]
$headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }

# Get existing slugs
$existing = Invoke-RestMethod -Uri "$base/items/Blog_Posts?fields=slug&limit=100" -Headers $headers
$existingSlugs = $existing.data | ForEach-Object { $_.slug }

$created = 0

for ($i = 1; $i -le 8; $i++) {
    $slug = "test-$i"
    if ($existingSlugs -contains $slug) {
        Write-Host "SKIP: $slug already exists"
        continue
    }
    $body = @{
        title   = "Test$i"
        slug    = $slug
        excerpt = "This is test$i"
        content = "This is content for test$i"
        type    = "tips"
        status  = "published"
    } | ConvertTo-Json
    try {
        $r = Invoke-RestMethod -Method Post -Uri "$base/items/Blog_Posts" -Headers $headers -Body $body
        Write-Host "CREATED: $slug (id=$($r.data.id))"
        $created++
    } catch {
        Write-Host "ERROR: $slug - $_"
    }
}

Write-Host ""
Write-Host "Done. Created: $created"
