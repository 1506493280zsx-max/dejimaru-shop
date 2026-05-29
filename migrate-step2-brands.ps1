$token = "h0HxYL4-5TuDzuN2DxAjaS8G6ZTc_Krs"
$url   = "https://directus-production-2cfe.up.railway.app"
$h     = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
}

$slugList = (Invoke-RestMethod -Uri "$url/items/brands?fields=slug&limit=100" -Headers $h).data
$existing = $slugList | ForEach-Object { $_.slug }

$brand01 = @{ name="Xiaomi";   slug="xiaomi";   is_featured=$false; sort_order=42 }
$brand02 = @{ name="MSI";      slug="msi";      is_featured=$false; sort_order=43 }
$brand03 = @{ name="GALLERIA"; slug="galleria"; is_featured=$false; sort_order=44 }
$brand04 = @{ name="Huawei";   slug="huawei";   is_featured=$false; sort_order=45 }
$brand05 = @{ name="OPPO";     slug="oppo";     is_featured=$false; sort_order=46 }
$brand06 = @{ name="Motorola"; slug="motorola"; is_featured=$false; sort_order=47 }
$brand07 = @{ name="Anker";    slug="anker";    is_featured=$false; sort_order=48 }
$brand08 = @{ name="ELECOM";   slug="elecom";   is_featured=$false; sort_order=49 }
$brand09 = @{ name="Buffalo";  slug="buffalo";  is_featured=$false; sort_order=50 }
$brand10 = @{ name="SanDisk";  slug="sandisk";  is_featured=$false; sort_order=51 }
$brand11 = @{ name="Logitech"; slug="logitech"; is_featured=$false; sort_order=52 }

$toAdd = @($brand01,$brand02,$brand03,$brand04,$brand05,$brand06,$brand07,$brand08,$brand09,$brand10,$brand11)

$created = 0
$skipped = 0

foreach ($item in $toAdd) {
    $s = $item.slug
    if ($existing -contains $s) {
        Write-Output "SKIP: $s"
        $skipped = $skipped + 1
        continue
    }
    $json = $item | ConvertTo-Json
    $res  = Invoke-RestMethod -Method Post -Uri "$url/items/brands" -Headers $h -Body $json
    $newId = $res.data.id
    Write-Output "CREATED: $s  id=$newId"
    $created = $created + 1
}

Write-Output ""
Write-Output "--- brands: Created=$created  Skipped=$skipped ---"
Write-Output ""

$aiRes = Invoke-RestMethod -Uri "$url/items/brands?filter[name][_eq]=AI%20Across&fields=id&limit=1" -Headers $h
$aiId  = $aiRes.data[0].id
Write-Output "FOUND: AI Across id=$aiId"

$patch   = '{"slug":"ai-across"}'
$aiPatch = Invoke-RestMethod -Method Patch -Uri "$url/items/brands/$aiId" -Headers $h -Body $patch
Write-Output "FIXED: id=$aiId  slug -> ai-across"
