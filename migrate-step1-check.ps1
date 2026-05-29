$h = @{ Authorization = "Bearer h0HxYL4-5TuDzuN2DxAjaS8G6ZTc_Krs"; "Content-Type" = "application/json" }
$base = "https://directus-production-2cfe.up.railway.app"

"=== EXISTING BRANDS ==="
$b = (Invoke-RestMethod "$base/items/brands?fields=id,name,slug&limit=100" -Headers $h).data
$b | ForEach-Object { "  id=$($_.id) slug=$($_.slug) name=$($_.name)" }
"  COUNT: $($b.Count)"

"=== EXISTING CATEGORIES ==="
$c = (Invoke-RestMethod "$base/items/categories?fields=id,name,slug,parent_id&limit=100" -Headers $h).data
$c | ForEach-Object { "  id=$($_.id) slug=$($_.slug) parent=$($_.parent_id) name=$($_.name)" }
"  COUNT: $($c.Count)"

"=== EXISTING SPEC_GROUPS ==="
$sg = (Invoke-RestMethod "$base/items/spec_groups?fields=id,name,slug&limit=100" -Headers $h).data
$sg | ForEach-Object { "  id=$($_.id) slug=$($_.slug) name=$($_.name)" }
"  COUNT: $($sg.Count)"

"=== EXISTING SPEC_OPTIONS ==="
$so = (Invoke-RestMethod "$base/items/spec_options?fields=id,label,spec_group_id&limit=200" -Headers $h).data
"  COUNT: $($so.Count)"
