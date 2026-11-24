# Inicia los 7 microservicios, cada uno en su propia ventana de PowerShell.
# Requisitos: MySQL encendido y Maven (mvn) disponible en la terminal.
# Uso (desde esta carpeta):  powershell -ExecutionPolicy Bypass -File .\iniciar-todos.ps1

$servicios = @(
    "auth-service",
    "usuarios-service",
    "productos-service",
    "inventario-service",
    "carrito-service",
    "contacto-service",
    "contenido-service"
)

foreach ($servicio in $servicios) {
    $ruta = Join-Path $PSScriptRoot $servicio
    Write-Host "Iniciando $servicio ..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ruta'; `$host.UI.RawUI.WindowTitle = '$servicio'; mvn spring-boot:run"
    # auth-service primero: los demás dependen de él para registrar usuarios
    if ($servicio -eq "auth-service") { Start-Sleep -Seconds 15 } else { Start-Sleep -Seconds 3 }
}

Write-Host ""
Write-Host "Listo. Swagger de cada servicio:"
Write-Host "  Autenticación  http://localhost:8081/swagger-ui.html"
Write-Host "  Usuarios       http://localhost:8082/swagger-ui.html"
Write-Host "  Productos      http://localhost:8083/swagger-ui.html"
Write-Host "  Inventario     http://localhost:8084/swagger-ui.html"
Write-Host "  Carrito        http://localhost:8085/swagger-ui.html"
Write-Host "  Contacto       http://localhost:8086/swagger-ui.html"
Write-Host "  Contenido      http://localhost:8087/swagger-ui.html"
