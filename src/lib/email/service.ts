import { Resend } from 'resend';
import {
  WelcomeEmail,
  VerificationEmail,
  ScoreConfirmationEmail,
  DrawResultsEmail,
  WinnerNotificationEmail,
  PaymentReceiptEmail,
  CharityUpdateEmail,
  PasswordResetEmail,
} from './templates';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@greenswing.io';

export interface EmailOptions {
  to: string;
  subject: string;
  react: React.ReactNode;
}

async function sendEmail(options: EmailOptions) {
  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      react: options.react,
    });

    if (result.error) {
      console.error('Email send error:', result.error);
      return { success: false, error: result.error };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error: any) {
    console.error('Email service error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// EMAIL SENDING FUNCTIONS
// ============================================

export async function sendWelcomeEmail(
  email: string,
  fullName: string,
  verificationUrl: string
) {
  return sendEmail({
    to: email,
    subject: 'Welcome to GreenSwing - Verify Your Email',
    react: React.createElement(WelcomeEmail, { fullName, verificationUrl }),
  });
}

export async function sendVerificationEmail(
  email: string,
  fullName: string,
  code: string,
  verificationUrl: string
) {
  return sendEmail({
    to: email,
    subject: 'Verify Your GreenSwing Email Address',
    react: React.createElement(VerificationEmail, {
      fullName,
      verificationUrl,
      code,
    }),
  });
}

export async function sendScoreConfirmationEmail(
  email: string,
  fullName: string,
  score: number,
  date: string
) {
  return sendEmail({
    to: email,
    subject: `Score Recorded - ${score} Points`,
    react: React.createElement(ScoreConfirmationEmail, {
      fullName,
      score,
      date,
    }),
  });
}

export async function sendDrawResultsEmail(
  email: string,
  fullName: string,
  drawDate: string,
  winningNumbers: number[],
  userMatches: number,
  hasPrize: boolean,
  prizeAmount?: number
) {
  return sendEmail({
    to: email,
    subject: hasPrize ? '🎉 You Won! Draw Results' : 'Draw Results - Better Luck Next Time',
    react: React.createElement(DrawResultsEmail, {
      fullName,
      drawDate,
      winningNumbers,
      userMatches,
      hasPrize,
      prizeAmount,
    }),
  });
}

export async function sendWinnerNotificationEmail(
  email: string,
  fullName: string,
  drawType: string,
  prizeAmount: number,
  drawDate: string
) {
  return sendEmail({
    to: email,
    subject: '🎉 Congratulations! You\'re a Winner!',
    react: React.createElement(WinnerNotificationEmail, {
      fullName,
      drawType,
      prizeAmount,
      drawDate,
    }),
  });
}

export async function sendPaymentReceiptEmail(
  email: string,
  fullName: string,
  amount: number,
  type: string,
  date: string,
  transactionId: string
) {
  return sendEmail({
    to: email,
    subject: 'Payment Receipt - GreenSwing',
    react: React.createElement(PaymentReceiptEmail, {
      fullName,
      amount,
      type,
      date,
      transactionId,
    }),
  });
}

export async function sendCharityUpdateEmail(
  email: string,
  fullName: string,
  charityName: string,
  amountRaised: number
) {
  return sendEmail({
    to: email,
    subject: `Your Charity Impact: ${charityName}`,
    react: React.createElement(CharityUpdateEmail, {
      fullName,
      charityName,
      amountRaised,
    }),
  });
}

export async function sendPasswordResetEmail(
  email: string,
  fullName: string,
  resetUrl: string,
  expiresIn: string = '24 hours'
) {
  return sendEmail({
    to: email,
    subject: 'Reset Your GreenSwing Password',
    react: React.createElement(PasswordResetEmail, {
      fullName,
      resetUrl,
      expiresIn,
    }),
  });
}

// ============================================
// BATCH EMAIL FUNCTIONS
// ============================================

export async function sendBulkDrawResultsEmails(
  drawResults: Array<{
    email: string;
    fullName: string;
    drawDate: string;
    winningNumbers: number[];
    userMatches: number;
    hasPrize: boolean;
    prizeAmount?: number;
  }>
) {
  const results = await Promise.allSettled(
    drawResults.map((result) =>
      sendDrawResultsEmail(
        result.email,
        result.fullName,
        result.drawDate,
        result.winningNumbers,
        result.userMatches,
        result.hasPrize,
        result.prizeAmount
      )
    )
  );

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return { successful, failed, total: results.length };
}

export async function sendBulkCharityUpdates(
  updates: Array<{
    email: string;
    fullName: string;
    charityName: string;
    amountRaised: number;
  }>
) {
  const results = await Promise.allSettled(
    updates.map((update) =>
      sendCharityUpdateEmail(
        update.email,
        update.fullName,
        update.charityName,
        update.amountRaised
      )
    )
  );

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return { successful, failed, total: results.length };
}
