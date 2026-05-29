$TOKEN = "EKpH6K-95pYaU1BYwRaAKVtT8AYq06Hy"
$BASE  = "https://directus-production-2cfe.up.railway.app"

# Build prefix strings from Unicode code points (pure ASCII source, no encoding issue)
$L  = [char]0x3010  # [
$R  = [char]0x3011  # ]
$Di = [char]0x7B2C  # Di (ordinal)
$Zh = [char]0x5F20  # Zhang (slide)
$Ge = [char]0x683C  # Ge  (cell)

$pH = "$L$([char]0x9996)$([char]0x9875)$([char]0x9876)$([char]0x90E8)$([char]0x8F6E)$([char]0x64AD)$R"
$pL = "$L$([char]0x9996)$([char]0x9875)$([char]0x5DE6)$([char]0x4FA7)$([char]0x5E7F)$([char]0x544A)$R"
$pR = "$L$([char]0x9996)$([char]0x9875)$([char]0x53F3)$([char]0x4FA7)$([char]0x5E7F)$([char]0x544A)$R"
$pF = "$L$([char]0x7CBE)$([char]0x9009)$([char]0x5546)$([char]0x54C1)$([char]0x533A)Banner$R"
$pN = "$L$([char]0x65B0)$([char]0x54C1)$([char]0x533A)Banner$R"
$pA = "${L}Apple$([char]0x4E13)$([char]0x533A)Banner$R"
$pC = "$L$([char]0x914D)$([char]0x4EF6)$([char]0x4E13)$([char]0x533A)Banner$R"
$pB = "${L}Blog$([char]0x8D44)$([char]0x8BAF)Banner$R"

$c = @()
foreach ($n in 1..8)  { $c += @{ text="${pH}${Di}${n}${Zh}"; value = ("hero-{0:D2}" -f $n) } }
foreach ($n in 1..14) { $c += @{ text="${pL}${Di}${n}${Ge}"; value = ("left-{0:D2}" -f $n) } }
foreach ($n in 1..14) { $c += @{ text="${pR}${Di}${n}${Ge}"; value = ("right-{0:D2}" -f $n) } }
foreach ($n in 1..12) { $c += @{ text="${pF}${Di}${n}${Ge}"; value = ("featured-banner-{0:D2}" -f $n) } }
foreach ($n in 1..12) { $c += @{ text="${pN}${Di}${n}${Ge}"; value = ("new-banner-{0:D2}" -f $n) } }
foreach ($n in 1..12) { $c += @{ text="${pA}${Di}${n}${Ge}"; value = ("apple-banner-{0:D2}" -f $n) } }
foreach ($n in 1..12) { $c += @{ text="${pC}${Di}${n}${Ge}"; value = ("accessory-banner-{0:D2}" -f $n) } }
foreach ($n in 1..12) { $c += @{ text="${pB}${Di}${n}${Ge}"; value = ("blog-banner-{0:D2}" -f $n) } }

$bytes = [System.Text.Encoding]::UTF8.GetBytes(
    (@{ meta = @{ options = @{ choices = $c } } } | ConvertTo-Json -Depth 6)
)
$resp = Invoke-RestMethod -Method Patch `
    -Uri "$BASE/fields/homepage_ads/position" `
    -Headers @{ Authorization = "Bearer $TOKEN"; "Content-Type" = "application/json; charset=utf-8" } `
    -Body $bytes

Write-Host "Done: $($resp.data.meta.options.choices.Count) choices"
