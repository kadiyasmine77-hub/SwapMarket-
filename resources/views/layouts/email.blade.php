<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <style>
    /* Force light mode background */
    :root {
      color-scheme: light;
      supported-color-schemes: light;
    }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      background-color: #ffffff !important; 
      margin: 0; 
      padding: 0; 
      color: #1a1a1a !important;
    }
    .container { 
      max-width: 540px; 
      margin: 0 auto; 
      padding: 60px 20px;
      background-color: #ffffff !important;
    }
    .logo {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a !important;
      text-decoration: none;
      margin-bottom: 40px;
      display: block;
    }
    .content h1 { 
      font-size: 24px; 
      font-weight: 700; 
      letter-spacing: -0.02em; 
      margin-bottom: 24px;
      color: #000000 !important;
    }
    .content p { 
      font-size: 16px; 
      line-height: 1.6; 
      color: #404040 !important;
      margin-bottom: 24px;
    }
    .btn { 
      display: inline-block; 
      background-color: #0f172a !important; 
      color: #ffffff !important; 
      padding: 12px 24px; 
      border-radius: 6px; 
      text-decoration: none; 
      font-weight: 500; 
      font-size: 15px;
      margin: 10px 0;
    }
    .footer { 
      margin-top: 60px;
      padding-top: 30px; 
      border-top: 1px solid #eaeaea;
      font-size: 13px; 
      color: #888888 !important; 
    }
    .footer p {
      margin: 5px 0;
    }
    .subtle-box {
      background-color: #f9f9f9 !important;
      border: 1px solid #efefef !important;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
    }
    .card { 
      border: 1px solid #eaeaea; 
      border-radius: 8px; 
      padding: 24px; 
      margin: 24px 0; 
    }
    .card-row { 
      display: flex; 
      justify-content: space-between; 
      margin-bottom: 12px; 
      border-bottom: 1px solid #f5f5f5; 
      padding-bottom: 8px; 
    }
    .card-row:last-child { 
      border-bottom: none; 
      margin-bottom: 0; 
      padding-bottom: 0; 
    }
    .label { 
      font-size: 13px; 
      color: #666666 !important; 
    }
    .value { 
      font-size: 14px; 
      font-weight: 500; 
      color: #000000 !important; 
    }
    
    /* Override dark mode for clients that support prefers-color-scheme */
    @media (prefers-color-scheme: dark) {
      body, .container { background-color: #ffffff !important; color: #1a1a1a !important; }
      .content h1 { color: #000000 !important; }
      .content p { color: #404040 !important; }
      .btn { background-color: #0f172a !important; color: #ffffff !important; }
      .logo { color: #0f172a !important; }
      .subtle-box { background-color: #f9f9f9 !important; border-color: #efefef !important; }
      .card { background-color: #ffffff !important; border-color: #eaeaea !important; }
      .card-row { border-bottom-color: #f5f5f5 !important; }
      .label { color: #666666 !important; }
      .value { color: #000000 !important; }
      .footer { color: #888888 !important; border-top-color: #eaeaea !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <a href="{{ env('FRONTEND_URL') }}" class="logo">SwapMarket</a>
    
    <div class="content">
      @yield('content')
    </div>
    
    <div class="footer">
      <p><strong>SwapMarket</strong> — Échangez intelligemment.</p>
      <p>© 2026. Casablanca, Maroc.</p>
    </div>
  </div>
</body>
</html>
