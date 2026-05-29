$TOKEN = "EKpH6K-95pYaU1BYwRaAKVtT8AYq06Hy"
$BASE  = "https://directus-production-2cfe.up.railway.app"

$body = @{
    collection     = "homepage_ads"
    role           = $null
    user           = $null
    layout         = "tabular"
    layout_query   = @{
        tabular = @{
            fields = @("position","title","subtitle","link_url","sort_order")
            sort   = @("sort_order")
            page   = 1
        }
    }
    layout_options = @{
        tabular = @{
            widths = @{
                position   = 260
                title      = 200
                subtitle   = 180
                link_url   = 180
                sort_order = 80
            }
        }
    }
}

$bytes = [System.Text.Encoding]::UTF8.GetBytes(($body | ConvertTo-Json -Depth 6))
$resp  = Invoke-RestMethod -Method Post `
    -Uri "$BASE/presets" `
    -Headers @{ Authorization="Bearer $TOKEN"; "Content-Type"="application/json; charset=utf-8" } `
    -Body $bytes

Write-Host "Created preset id=$($resp.data.id)  user=$($resp.data.user)  role=$($resp.data.role)  layout=$($resp.data.layout)"
