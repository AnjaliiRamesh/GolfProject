import { Button, Container, Head, Hr, Html, Img, Link, Preview, Row, Section, Text } from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  fullName: string;
  verificationUrl: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ fullName, verificationUrl }) => (
  <Html>
    <Head />
    <Preview>Welcome to GreenSwing - Verify your email</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Welcome to GreenSwing! 🏌️</Text>
          <Text style={paragraph}>
            Hi {fullName},
          </Text>
          <Text style={paragraph}>
            Thanks for joining GreenSwing, where golf enthusiasts can enjoy friendly competitions while supporting charities.
          </Text>
          <Text style={paragraph}>
            To get started, please verify your email address:
          </Text>
          <Button style={button} href={verificationUrl}>
            Verify Email Address
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            GreenSwing • Golf Betting for Good
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

interface VerificationEmailProps {
  fullName: string;
  verificationUrl: string;
  code: string;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({
  fullName,
  verificationUrl,
  code,
}) => (
  <Html>
    <Head />
    <Preview>Verify your GreenSwing account</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Verify Your Email</Text>
          <Text style={paragraph}>Hi {fullName},</Text>
          <Text style={paragraph}>
            Your verification code is:
          </Text>
          <div style={codeBox}>
            <Text style={code}>{code}</Text>
          </div>
          <Text style={paragraph}>
            Or click the button below:
          </Text>
          <Button style={button} href={verificationUrl}>
            Verify Email
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            This link expires in 24 hours.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

interface ScoreConfirmationEmailProps {
  fullName: string;
  score: number;
  date: string;
}

export const ScoreConfirmationEmail: React.FC<ScoreConfirmationEmailProps> = ({
  fullName,
  score,
  date,
}) => (
  <Html>
    <Head />
    <Preview>Score recorded - {score} points</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Score Recorded ✓</Text>
          <Text style={paragraph}>Hi {fullName},</Text>
          <Text style={paragraph}>
            Your golf score has been recorded:
          </Text>
          <div style={scoreBox}>
            <Text style={scoreValue}>{score}</Text>
            <Text style={scoreDate}>{new Date(date).toLocaleDateString()}</Text>
          </div>
          <Text style={paragraph}>
            This score has been added to your account and will be included in upcoming draws.
          </Text>
          <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/scores`}>
            View All Scores
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            Keep playing and improving! 🏌️
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

interface DrawResultsEmailProps {
  fullName: string;
  drawDate: string;
  winningNumbers: number[];
  userMatches: number;
  hasPrize: boolean;
  prizeAmount?: number;
}

export const DrawResultsEmail: React.FC<DrawResultsEmailProps> = ({
  fullName,
  drawDate,
  winningNumbers,
  userMatches,
  hasPrize,
  prizeAmount,
}) => (
  <Html>
    <Head />
    <Preview>Draw results are in!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Draw Results 🎰</Text>
          <Text style={paragraph}>Hi {fullName},</Text>
          <Text style={paragraph}>
            The draw for {new Date(drawDate).toLocaleDateString()} has been completed!
          </Text>
          <div style={resultsBox}>
            <Text style={resultsLabel}>Winning Numbers:</Text>
            <Text style={winningNumbersStyle}>{winningNumbers.join(', ')}</Text>
          </div>
          <div style={resultsBox}>
            <Text style={resultsLabel}>Your Matches: {userMatches}</Text>
          </div>
          {hasPrize ? (
            <>
              <Text style={prizeText}>🎉 Congratulations! You Won! 🎉</Text>
              <Text style={paragraph}>
                Prize Amount: <strong>£{(prizeAmount || 0) / 100}</strong>
              </Text>
              <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/winnings`}>
                View Prize Details
              </Button>
            </>
          ) : (
            <Text style={paragraph}>
              Better luck next time! Keep playing and you might be a winner in the next draw.
            </Text>
          )}
          <Hr style={hr} />
          <Text style={footer}>
            Thanks for supporting charity through GreenSwing!
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

interface WinnerNotificationEmailProps {
  fullName: string;
  drawType: string;
  prizeAmount: number;
  drawDate: string;
}

export const WinnerNotificationEmail: React.FC<WinnerNotificationEmailProps> = ({
  fullName,
  drawType,
  prizeAmount,
  drawDate,
}) => (
  <Html>
    <Head />
    <Preview>You're a winner!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>🎉 You're a Winner! 🎉</Text>
          <Text style={paragraph}>Hi {fullName},</Text>
          <Text style={paragraph}>
            Congratulations! You've won in the GreenSwing lottery draw!
          </Text>
          <div style={winnerBox}>
            <Text style={winnerLabel}>Draw Type:</Text>
            <Text style={winnerValue}>{drawType}</Text>
            <Text style={winnerLabel}>Prize Amount:</Text>
            <Text style={winnerValue}>£{(prizeAmount / 100).toFixed(2)}</Text>
            <Text style={winnerLabel}>Draw Date:</Text>
            <Text style={winnerValue}>{new Date(drawDate).toLocaleDateString()}</Text>
          </div>
          <Text style={paragraph}>
            We'll be in touch with next steps to claim your prize. You may need to provide proof of your winning score.
          </Text>
          <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/winnings`}>
            View Prize Details
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            Thank you for supporting GreenSwing!
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

interface PaymentReceiptEmailProps {
  fullName: string;
  amount: number;
  type: string;
  date: string;
  transactionId: string;
}

export const PaymentReceiptEmail: React.FC<PaymentReceiptEmailProps> = ({
  fullName,
  amount,
  type,
  date,
  transactionId,
}) => (
  <Html>
    <Head />
    <Preview>Payment Receipt</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Payment Receipt ✓</Text>
          <Text style={paragraph}>Hi {fullName},</Text>
          <Text style={paragraph}>
            Thank you for your payment to GreenSwing!
          </Text>
          <div style={receiptBox}>
            <Row>
              <Text style={receiptLabel}>Type:</Text>
              <Text style={receiptValue}>{type}</Text>
            </Row>
            <Row>
              <Text style={receiptLabel}>Amount:</Text>
              <Text style={receiptValue}>£{(amount / 100).toFixed(2)}</Text>
            </Row>
            <Row>
              <Text style={receiptLabel}>Date:</Text>
              <Text style={receiptValue}>{new Date(date).toLocaleDateString()}</Text>
            </Row>
            <Row>
              <Text style={receiptLabel}>Transaction ID:</Text>
              <Text style={receiptValue}>{transactionId}</Text>
            </Row>
          </div>
          <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`}>
            View Account
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            Questions? Contact our support team.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

interface CharityUpdateEmailProps {
  fullName: string;
  charityName: string;
  amountRaised: number;
}

export const CharityUpdateEmail: React.FC<CharityUpdateEmailProps> = ({
  fullName,
  charityName,
  amountRaised,
}) => (
  <Html>
    <Head />
    <Preview>Impact Update: {charityName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Your Charity Impact 💚</Text>
          <Text style={paragraph}>Hi {fullName},</Text>
          <Text style={paragraph}>
            Through GreenSwing, you're making a real difference!
          </Text>
          <div style={impactBox}>
            <Text style={charityName}>
              <strong>{charityName}</strong>
            </Text>
            <Text style={amountRaised}>
              Amount Raised: <strong>£{(amountRaised / 100).toFixed(2)}</strong>
            </Text>
          </div>
          <Text style={paragraph}>
            Your contributions are directly supporting meaningful charitable work. Thank you for being part of the GreenSwing community!
          </Text>
          <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/charities`}>
            View Charities
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            Keep golfing and giving! 🏌️❤️
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

interface PasswordResetEmailProps {
  fullName: string;
  resetUrl: string;
  expiresIn: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  fullName,
  resetUrl,
  expiresIn,
}) => (
  <Html>
    <Head />
    <Preview>Reset your GreenSwing password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Reset Your Password</Text>
          <Text style={paragraph}>Hi {fullName},</Text>
          <Text style={paragraph}>
            We received a request to reset your GreenSwing password. Click the button below to create a new password:
          </Text>
          <Button style={button} href={resetUrl}>
            Reset Password
          </Button>
          <Text style={paragraph}>
            Or copy this link: <Link href={resetUrl}>{resetUrl}</Link>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            This link expires in {expiresIn}. If you didn't request this, you can ignore this email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: '#f4f4f4',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const box = {
  padding: '0 48px',
};

const heading = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#212121',
  marginBottom: '24px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#212121',
  marginBottom: '24px',
};

const button = {
  backgroundColor: '#0070f3',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  marginBottom: '24px',
};

const hr = {
  borderColor: '#e0e0e0',
  margin: '24px 0',
};

const footer = {
  color: '#8a8a8a',
  fontSize: '12px',
  lineHeight: '1.4',
};

const scoreBox = {
  backgroundColor: '#f0f7ff',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const scoreValue = {
  fontSize: '48px',
  fontWeight: '700',
  color: '#0070f3',
  margin: '0',
};

const scoreDate = {
  fontSize: '14px',
  color: '#666',
  margin: '8px 0 0 0',
};

const codeBox = {
  backgroundColor: '#f0f7ff',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const code = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#0070f3',
  letterSpacing: '2px',
  margin: '0',
  fontFamily: 'monospace',
};

const resultsBox = {
  backgroundColor: '#fef3f0',
  padding: '16px',
  borderRadius: '8px',
  marginBottom: '16px',
};

const resultsLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#212121',
  margin: '0 0 8px 0',
};

const winningNumbersStyle = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#f97316',
  margin: '0',
};

const prizeText = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#16a34a',
  marginBottom: '16px',
};

const winnerBox = {
  backgroundColor: '#f0fdf4',
  padding: '24px',
  borderRadius: '8px',
  marginBottom: '24px',
};

const winnerLabel = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#666',
  margin: '0 0 4px 0',
};

const winnerValue = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#16a34a',
  margin: '0 0 16px 0',
};

const receiptBox = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '24px',
};

const receiptLabel = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#666',
};

const receiptValue = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#212121',
};

const impactBox = {
  backgroundColor: '#f0fdf4',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '24px',
};

const charityName = {
  fontSize: '16px',
  color: '#212121',
  marginBottom: '8px',
};

const amountRaised = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#16a34a',
};
