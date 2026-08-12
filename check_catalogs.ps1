# Verificar catálogos críticos
$catalogs = @{
    "bag_seal_type" = @("Sello lateral");
    "central_seal_material" = @("Aleta", "PE-PE/PE");
    "print_class" = @("Sin impresión", "Flexo", "Huecograbado");
    "special_design_specs" = @("Otros (comentar cuáles)");
    "color_objective" = @("Otros");
    "lamina_type" = @("Genérica", "Tissue", "Food");
    "structure_type" = @("Monocapa", "Bilaminado", "Trilaminado", "Tetralaminado");
}

$file = "src/shared/catalogs/catalog.seed.ts"
$content = Get-Content $file -Raw

foreach ($catalog in $catalogs.GetEnumerator()) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Catálogo: $($catalog.Name)" -ForegroundColor Yellow
    Write-Host "Valores esperados: $($catalog.Value -join ', ')" -ForegroundColor Yellow
    
    # Find all items for this catalog
    $pattern = 'catalogCode: "' + $catalog.Name + '".*?(?=\{|\Z)'
    $matches = [regex]::Matches($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    
    # Extract items from matches
    $items = @()
    foreach ($match in $matches) {
        if ($match.Value -match 'item: "([^"]*)"') {
            $items += $matches[0].Groups[1].Value
        }
    }
    
    Write-Host "Valores encontrados en catálogo: (ejecutando grep)" -ForegroundColor Green
}
