import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface AuthEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
}

export const AuthEmail = ({
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  token,
}: AuthEmailProps) => {
  const confirmUrl = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

  const isInvite = email_action_type === 'invite'
  const subject = isInvite ? 'Welcome to Pro!' : 'Your Verification Code'
  const previewText = isInvite
    ? 'Your Pro purchase is confirmed — activate your account'
    : 'Your Market Hustle sign-in code'
  const description = isInvite
    ? 'Your purchase is confirmed. Click below to activate your account and start trading with Pro features.'
    : 'Enter this code in Market Hustle to sign in. It expires in 10 minutes.'
  const footerNote = isInvite
    ? "If you didn't make this purchase, please contact support."
    : "If you didn't request this code, you can safely ignore this email."
  const otpLabel = isInvite ? 'Or use this one-time code:' : 'Your code:'

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>MARKET HUSTLE</Text>
            <Text style={tagline}>STOCK MARKET SIMULATOR</Text>
          </Section>

          <Section style={body}>
            <Text style={heading}>{subject}</Text>
            <Text style={paragraph}>{description}</Text>

            {isInvite && (
              <Section style={proBox}>
                <Text style={proLabel}>YOUR PRO PERKS</Text>
                <Text style={proFeatures}>
                  ✓ Unlimited games{'\n'}
                  ✓ Short selling & 10X leverage{'\n'}
                  ✓ 45 & 60-day challenges{'\n'}
                  ✓ Historical scenarios
                </Text>
              </Section>
            )}

            {isInvite && (
              <Section style={{ textAlign: 'center' as const, padding: '8px 0 24px' }}>
                <Link href={confirmUrl} style={button}>
                  [ ACTIVATE ACCOUNT ]
                </Link>
              </Section>
            )}

            <Text style={otpLabelStyle}>{otpLabel}</Text>
            <Text style={otpCode}>{token}</Text>

            <Text style={footnote}>{footerNote}</Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>Market Hustle</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#000000',
  fontFamily: "'Courier New', 'Lucida Console', monospace",
  padding: '40px 20px',
}

const container = {
  maxWidth: '480px',
  margin: '0 auto',
  backgroundColor: '#000000',
  border: '1px solid #2a3a4a',
  borderRadius: '8px',
  overflow: 'hidden' as const,
}

const header = {
  padding: '32px 32px 24px',
  textAlign: 'center' as const,
  borderBottom: '1px solid #2a3a4a',
}

const logo = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#c8d8e8',
  letterSpacing: '2px',
  margin: '0',
  fontFamily: "'Courier New', 'Lucida Console', monospace",
}

const tagline = {
  fontSize: '11px',
  color: '#5a6a7a',
  letterSpacing: '1px',
  margin: '4px 0 0',
}

const body = {
  padding: '32px',
}

const heading = {
  fontSize: '18px',
  fontWeight: 'bold' as const,
  color: '#c8d8e8',
  margin: '0 0 8px',
}

const paragraph = {
  fontSize: '13px',
  color: '#a0b3c6',
  lineHeight: '1.6',
  margin: '0 0 24px',
}

const proBox = {
  padding: '12px 16px',
  border: '1px solid #2a3a4a',
  borderRadius: '4px',
  marginBottom: '24px',
  backgroundColor: 'rgba(0,255,136,0.05)',
}

const proLabel = {
  fontSize: '11px',
  color: '#5a6a7a',
  letterSpacing: '1px',
  margin: '0 0 8px',
}

const proFeatures = {
  fontSize: '12px',
  color: '#00ff88',
  lineHeight: '1.8',
  margin: '0',
  whiteSpace: 'pre-line' as const,
}

const button = {
  display: 'inline-block' as const,
  padding: '14px 32px',
  backgroundColor: '#00ff88',
  color: '#000000',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  fontFamily: "'Courier New', monospace",
  textDecoration: 'none',
  letterSpacing: '1px',
  borderRadius: '2px',
}

const otpLabelStyle = {
  fontSize: '12px',
  color: '#5a6a7a',
  margin: '0 0 8px',
  textAlign: 'center' as const,
}

const otpCode = {
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#c8d8e8',
  letterSpacing: '6px',
  textAlign: 'center' as const,
  padding: '12px 0',
  margin: '0 0 24px',
  fontFamily: "'Courier New', monospace",
}

const footnote = {
  fontSize: '11px',
  color: '#5a6a7a',
  lineHeight: '1.5',
  margin: '0',
}

const footer = {
  padding: '20px 32px',
  borderTop: '1px solid #2a3a4a',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '10px',
  color: '#5a6a7a',
  letterSpacing: '0.5px',
  margin: '0',
}

export default AuthEmail
