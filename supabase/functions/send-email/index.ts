const resendApiKey = Deno.env.get('RESEND_API_KEY') as string
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

async function verifyWebhook(payload: string, headers: Record<string, string>): Promise<Record<string, unknown>> {
  const msgId = headers['webhook-id']
  const timestamp = headers['webhook-timestamp']
  const signature = headers['webhook-signature']
  if (!msgId || !timestamp || !signature) throw new Error('Missing webhook headers')

  const base64Secret = hookSecret.replace('v1,whsec_', '')
  const keyBytes = Uint8Array.from(atob(base64Secret), c => c.charCodeAt(0))
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const content = new TextEncoder().encode(`${msgId}.${timestamp}.${payload}`)
  const sig = await crypto.subtle.sign('HMAC', key, content)
  const expected = btoa(String.fromCharCode(...new Uint8Array(sig)))

  const valid = signature.split(' ').some(s => {
    const val = s.startsWith('v1,') ? s.slice(3) : s
    return val === expected
  })
  if (!valid) throw new Error('Invalid signature')

  return JSON.parse(payload)
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 })
  }

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)

  try {
    const {
      user,
      email_data,
    } = await verifyWebhook(payload, headers) as {
      user: { email: string }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
      }
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const confirmUrl = `${supabaseUrl}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${encodeURIComponent(email_data.redirect_to)}`

    const isInvite = email_data.email_action_type === 'invite'
    const subject = isInvite
      ? 'Market Hustle — Welcome to Pro!'
      : 'Market Hustle — Your Sign-In Code'
    const heading = isInvite ? 'Welcome to Pro!' : 'Your Verification Code'
    const description = isInvite
      ? 'Your purchase is confirmed. Click below to activate your account and start trading with Pro features.'
      : 'Enter this code in Market Hustle to sign in. It expires in 10 minutes.'
    const footnote = isInvite
      ? "If you didn't make this purchase, please contact support."
      : "If you didn't request this code, you can safely ignore this email."

    const proSection = isInvite
      ? `<div style="padding:12px 16px;border:1px solid #2a3a4a;border-radius:4px;margin-bottom:24px;background-color:rgba(0,255,136,0.05);">
           <div style="font-size:11px;color:#5a6a7a;letter-spacing:1px;margin-bottom:8px;">YOUR PRO PERKS</div>
           <div style="font-size:12px;color:#00ff88;line-height:1.8;">
             ✓ Unlimited games<br>
             ✓ Short selling &amp; 10X leverage<br>
             ✓ 45 &amp; 60-day challenges<br>
             ✓ Historical scenarios
           </div>
         </div>`
      : ''

    const activateButton = isInvite
      ? `<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 24px;">
            <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;background-color:#00ff88;color:#000000;font-size:14px;font-weight:bold;font-family:'Courier New',monospace;text-decoration:none;letter-spacing:1px;border-radius:2px;">[ ACTIVATE ACCOUNT ]</a>
          </td></tr></table>`
      : ''

    const otpLabel = isInvite ? 'Or use this one-time code:' : 'Your code:'

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#000000;font-family:'Courier New','Lucida Console',monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#000000;border:1px solid #2a3a4a;border-radius:8px;overflow:hidden;">
        <tr><td style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid #2a3a4a;">
          <div style="font-size:24px;font-weight:bold;color:#c8d8e8;letter-spacing:2px;font-family:'Courier New',monospace;">MARKET HUSTLE</div>
          <div style="font-size:11px;color:#5a6a7a;margin-top:4px;letter-spacing:1px;">STOCK MARKET SIMULATOR</div>
        </td></tr>
        <tr><td style="padding:32px;">
          <div style="font-size:18px;font-weight:bold;color:${isInvite ? '#00ff88' : '#c8d8e8'};margin-bottom:8px;">${heading}</div>
          <div style="font-size:13px;color:#a0b3c6;line-height:1.6;margin-bottom:24px;">${description}</div>
          ${proSection}
          ${activateButton}
          <div style="text-align:center;margin-bottom:24px;">
            <div style="font-size:12px;color:#5a6a7a;margin-bottom:8px;">${otpLabel}</div>
            <div style="font-size:28px;font-weight:bold;color:#c8d8e8;letter-spacing:6px;font-family:'Courier New',monospace;">${email_data.token}</div>
          </div>
          <div style="font-size:11px;color:#5a6a7a;line-height:1.5;">${footnote}</div>
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid #2a3a4a;text-align:center;">
          <div style="font-size:10px;color:#5a6a7a;letter-spacing:0.5px;">Market Hustle</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Market Hustle <noreply@auth.markethustle.game>',
        to: [user.email],
        subject,
        html,
      }),
    }).catch((err) => {
      console.error('Resend send failed:', err)
    })
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string }
    return new Response(
      JSON.stringify({
        error: {
          http_code: err.code ?? 500,
          message: err.message ?? 'Unknown error',
        },
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
