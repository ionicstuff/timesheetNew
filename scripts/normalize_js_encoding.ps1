Param(
  [string[]]$Paths = @('backend\check_manager.js','backend\backend\check_manager.js')
)
foreach($p in $Paths){
  if(Test-Path $p){
    try{
      $bytes = [System.IO.File]::ReadAllBytes($p)
      if($bytes.Length -ge 2 -and $bytes[0] -eq 0xFF -and $bytes[1] -eq 0xFE){
        $text = [System.Text.Encoding]::Unicode.GetString($bytes)
        [System.IO.File]::WriteAllText($p, $text, [System.Text.Encoding]::UTF8)
        Write-Output "Converted UTF-16LE -> UTF-8: $p"
      } elseif($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF){
        [System.IO.File]::WriteAllBytes($p, $bytes[3..($bytes.Length-1)])
        Write-Output "Removed UTF-8 BOM: $p"
      } else {
        Write-Output "No BOM/UTF-16 detected: $p"
      }
    } catch {
      Write-Output ("Error processing {0}: {1}" -f $p, $_.Exception.Message)
    }
  } else {
    Write-Output "Not found: $p"
  }
}
