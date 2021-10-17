Start-Process powershell {$env:PORT=3001; Set-Location "react-backend"; npm run start:dev; PAUSE}
Start-Process powershell {$env:PORT=3000; Set-Location "react-backend/client"; npm start; PAUSE}
Start-Process "C:\Program Files\MongoDB\Server\5.0\bin\mongo.exe"