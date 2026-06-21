# GreenSwing - Local Setup & Running Guide

This guide will help you set up and run the GreenSwing application locally.

## Prerequisites

- **Node.js**: v18.17.0 or higher (LTS recommended)
- **npm** or **yarn**: For package management
- **Git**: For version control
- A **Supabase** account (PostgreSQL database)
- A **Stripe** account (for payments)
- A **Resend** account (for transactional emails)

## Step 1: Clone & Install Dependencies

```bash
# Navigate to the project directory
cd d:\GolfProject

# Install dependencies
npm install
```

This will install all required packages including:
- Next.js 15 with React 19
- Tailwind CSS v4
- Shadcn UI components
- Supabase client libraries
- Stripe SDK
- Resend for emails
- And more...

## Step 2: Environment Variables Setup

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Resend Configuration
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@greenswing.com

# Security
CRON_SECRET=your_secure_random_string_for_cron_endpoints
```

### Getting Your API Keys

#### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy `Service Role Secret Key` to `SUPABASE_SERVICE_ROLE_KEY`

#### Stripe
1. Go to [stripe.com](https://stripe.com)
2. Create an account or sign in
3. Go to Developers → API Keys
4. Copy the `Publishable Key` and `Secret Key`
5. Create a webhook endpoint pointing to `http://localhost:3000/api/webhooks/stripe`
6. Copy the webhook signing secret

#### Resend
1. Go to [resend.com](https://resend.com)
2. Create an account or sign in
3. Go to API Keys
4. Create a new key and copy it

## Step 3: Database Setup

The database schema should already be created in Supabase. If needed, you can run migrations:

```bash
# Migrations are automatically handled by Supabase
# The schema is defined in supabase/migrations/
```

### Important: Enable Row-Level Security (RLS)

1. Go to your Supabase project
2. Go to Authentication → Policies
3. Enable RLS on all tables:
   - `profiles`
   - `scores`
   - `draws`
   - `draw_entries`
   - `winners`
   - `charities`
   - `subscriptions`

The RLS policies should already be configured in the migrations.

## Step 4: Run the Development Server

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:3000
```

You should see:
```
> next dev
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Step 5: Access the Application

### Public Pages
- **Home**: [http://localhost:3000](http://localhost:3000)
- **How It Works**: [http://localhost:3000/how-it-works](http://localhost:3000/how-it-works)
- **About**: [http://localhost:3000/about](http://localhost:3000/about)
- **Charities**: [http://localhost:3000/charities](http://localhost:3000/charities)
- **Pricing**: [http://localhost:3000/pricing](http://localhost:3000/pricing)

### Authentication
- **Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Sign Up**: [http://localhost:3000/signup](http://localhost:3000/signup)

### User Dashboard (Requires Login)
- **Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Submit Score**: [http://localhost:3000/dashboard/scores](http://localhost:3000/dashboard/scores)
- **View Draws**: [http://localhost:3000/dashboard/draws](http://localhost:3000/dashboard/draws)
- **Charities**: [http://localhost:3000/dashboard/charities](http://localhost:3000/dashboard/charities)
- **Settings**: [http://localhost:3000/dashboard/settings](http://localhost:3000/dashboard/settings)
- **Winnings**: [http://localhost:3000/dashboard/winnings](http://localhost:3000/dashboard/winnings)

### Admin Dashboard (Requires Admin Role)
To access the admin panel, you need to set your user role to 'admin' in Supabase:

1. Open Supabase → SQL Editor
2. Run this query:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your@email.com';
```

Then access: [http://localhost:3000/admin](http://localhost:3000/admin)

**Admin Pages:**
- **Analytics**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Users**: [http://localhost:3000/admin/users](http://localhost:3000/admin/users)
- **Charities**: [http://localhost:3000/admin/charities](http://localhost:3000/admin/charities)
- **Draws**: [http://localhost:3000/admin/draws](http://localhost:3000/admin/draws)
- **Winners**: [http://localhost:3000/admin/winners](http://localhost:3000/admin/winners)

## Step 6: Testing Features

### Email Testing
1. When you sign up, a welcome email is sent via Resend
2. In Resend dashboard, you can see email delivery logs
3. Use a test email like `test@example.com` for development

### Stripe Webhook Testing (Local)
1. Install Stripe CLI: [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. Authenticate: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Copy the webhook signing secret and add it to `.env.local`

### Testing Cron Endpoint
```bash
# Test the draw cron endpoint manually
curl -X POST http://localhost:3000/api/cron/draw \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

## Step 7: Build for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Useful Commands

```bash
# Format code with Prettier
npm run format

# Run ESLint checks
npm run lint

# Type check (TypeScript)
npm run type-check

# Clean build artifacts
npm run clean

# View Supabase status
npm run supabase:status
```

## Project Structure

```
GolfProject/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── (auth)/         # Authentication pages
│   │   ├── (marketing)/    # Public pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── dashboard/      # User dashboard
│   │   ├── api/            # API routes
│   │   └── layout.tsx      # Root layout
│   ├── components/          # React components
│   │   ├── layout/         # Header, footer, navigation
│   │   ├── marketing/      # Marketing components
│   │   ├── shared/         # Shared components
│   │   └── ui/             # Shadcn UI components
│   ├── actions/            # Server actions
│   ├── lib/                # Utility libraries
│   │   ├── supabase/       # Supabase clients
│   │   ├── stripe/         # Stripe configuration
│   │   ├── email/          # Email templates & service
│   │   └── utils.ts        # Helper utilities
│   ├── services/           # Business logic services
│   ├── types/              # TypeScript types
│   ├── validators/         # Zod validation schemas
│   └── config/             # Configuration files
├── supabase/
│   └── migrations/         # Database migrations
├── public/                 # Static assets
├── .env.local             # Environment variables (not in git)
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Common Issues & Solutions

### Issue: "Cannot find module '@/components/...'"
**Solution**: Check that the path alias is correctly configured in `tsconfig.json` and `next.config.ts`. The `@` alias should point to `./src`.

### Issue: "Supabase connection failed"
**Solution**: 
- Verify `.env.local` has correct Supabase URL and API keys
- Check that your Supabase project is active
- Ensure RLS is not blocking queries

### Issue: "Stripe webhook not working"
**Solution**:
- Ensure `STRIPE_WEBHOOK_SECRET` is correctly set from webhook signing secret
- Check webhook endpoint in Stripe dashboard
- Use Stripe CLI to debug: `stripe logs tail`

### Issue: "Email not sending"
**Solution**:
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for delivery errors
- Ensure `EMAIL_FROM` matches verified domain in Resend

### Issue: "Port 3000 already in use"
**Solution**: 
```bash
# Use a different port
npm run dev -- -p 3001
```

## Database Maintenance

### Backup Database
```bash
# Supabase automatically backs up daily
# Manual backup: Go to Supabase → Settings → Backups
```

### Clear Local Cache
```bash
# Clear Next.js cache
rm -rf .next
```

## Deployment

The application is designed to be deployed on Vercel (recommended for Next.js):

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel project settings
4. Deploy

For other platforms (AWS, DigitalOcean, etc.), ensure Node.js 18+ is available.

## Support

For issues or questions:
1. Check the documentation in `/docs` (if available)
2. Review environment variable setup
3. Check browser console and server logs
4. Verify all third-party services (Supabase, Stripe, Resend) are properly configured

---

**Last Updated**: 2024
**GreenSwing Version**: 1.0
**Next.js Version**: 15.2.9
**React Version**: 19.2.4
