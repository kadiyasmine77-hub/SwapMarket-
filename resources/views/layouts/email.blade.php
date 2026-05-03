<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f4f8; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: @yield('color', '#2563eb'); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .body { padding: 40px 30px; }
    .body p { color: #4b5563; line-height: 1.8; font-size: 15px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .card-row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
    .card-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; }
    .value { font-size: 14px; font-weight: 600; color: #1e293b; }
    .btn { display: inline-block; background: #2563eb; color: white !important; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; margin-top: 20px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2); }
    .footer { text-align: center; padding: 30px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; background: #fafafa; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>@yield('title')</h1>
    </div>
    <div class="body">
      @yield('content')
    </div>
    <div class="footer">SwapMarket — La plateforme d'échange marocaine</div>
  </div>
</body>
</html>
