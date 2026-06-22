# 🏌️ GreenSwing

> A full-stack platform that combines golf performance tracking, competitive prize draws, and charity support into one seamless experience.

**GreenSwing** empowers golfers to track their Stableford scores, compete in monthly prize draws, and support charities of their choice—all through an intuitive, secure web application built with modern technologies.

---

## 🌐 Live Application

- **Production URL:** [https://golf-project-taupe.vercel.app/](https://golf-project-taupe.vercel.app/)
- **Repository:** [GitHub - GreenSwing](https://github.com/AnjaliiRamesh/GolfProject)

### Demo Access

**Test User Account:**
- Email: `anjaliramesh14012005@gmail.com`
- Password: `Mannya911`
- Access: User dashboard with score entry and draw participation

**Admin Account:**
- Email: `codetanks911@gmail.com`
- Password: `Priya911`
- Access: Full admin analytics, user management, draw management, and winner verification

---

## ✨ Features

### User Features
- **🔐 Secure Authentication** – Email-based sign-up and login with Supabase Auth
- **📊 Golf Performance Tracking** – Submit Stableford scores and monitor performance trends
- **🎯 Prize Draws** – Automatic entry into monthly draws based on score performance
- **❤️ Charity Support** – Allocate a portion of subscription fees to supported charities
- **💰 Winnings Dashboard** – View prize winnings, submit proof of performance, and track payment status
- **⚙️ Profile Management** – Customize preferences, charity selection, and account settings
- **📱 Responsive Design** – Fully functional on desktop and mobile devices

### Admin Features
- **📈 Advanced Analytics** – User statistics, subscription metrics, and revenue tracking
- **👥 User Management** – View user profiles, manage subscriptions, and handle compliance
- **🎰 Draw Management** – Create, simulate, and manage prize draws with multiple configurations
- **🏆 Winner Verification** – Review winner proof submissions and approve/reject payouts
- **💳 Subscription Management** – Monitor active subscriptions and manage billing
- **🤝 Charity Management** – Manage supported charities, update logos/descriptions, and track total raised

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 16.2.9](https://nextjs.org/) – React-based full-stack framework
- **UI Components:** [Shadcn/ui](https://ui.shadcn.com/) – Customizable Radix UI components
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) – Utility-first CSS framework
- **Animations:** [Framer Motion 12.40.0](https://www.framer.com/motion/) – Advanced motion library
- **Form Handling:** [React Hook Form 7.80.0](https://react-hook-form.com/) – Lightweight form validation
- **Validation:** [Zod 4.4.3](https://zod.dev/) – TypeScript-first schema validation
- **Data Visualization:** [Recharts 3.8.1](https://recharts.org/) – React charting library
- **Icons:** [Lucide React 1.21.0](https://lucide.dev/) – Modern icon library
- **Date Utilities:** [date-fns 4.4.0](https://date-fns.org/) – Date manipulation library
- **Theme Support:** [Next Themes 0.4.6](https://github.com/pacocoursey/next-themes) – Dark/light mode
- **UI Notifications:** [Sonner 2.0.7](https://sonner.emilkowal.ski/) – Toast notifications

### Backend
- **Runtime:** [Node.js 18+](https://nodejs.org/) – JavaScript runtime
- **API Routes:** Next.js API routes for serverless functions
- **Server Actions:** Next.js Server Actions for direct database mutations
- **Middleware:** Next.js middleware for authentication and routing

### Database
- **Database:** [Supabase (PostgreSQL)](https://supabase.com/) – Open-source Firebase alternative
- **Authentication:** Supabase Auth – Built-in user authentication
- **Real-time:** Supabase Real-time subscriptions
- **Row-Level Security (RLS):** Database-level access control

### Payment Processing
- **Payment Gateway:** [Stripe v22.2.2](https://stripe.com/) – Subscription and payment management
- **Integration:** Webhooks for payment events (succeeded, failed, refunded)

### Email Service
- **Email Provider:** [Resend v6.14.0](https://resend.com/) – Transactional email service
- **Email Templates:** React Email for dynamic templates

### Infrastructure & Deployment
- **Deployment:** [Vercel](https://vercel.com/) – Optimized for Next.js
- **Environment Management:** Environment variables (`.env.local`)
- **Cron Jobs:** Scheduled endpoints for draw execution and maintenance

### Development Tools
- **Language:** [TypeScript 5](https://www.typescriptlang.org/) – Static type safety
- **Package Manager:** npm / yarn
- **Linting:** [ESLint 9](https://eslint.org/) – Code quality
- **Configuration:** Next.js configuration, PostCSS, Tailwind
- **Git:** Version control

---

## 📁 Project Structure

```
GreenSwing/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── login/                # Login page
│   │   │   └── signup/               # Sign-up page
│   │   ├── (marketing)/              # Public marketing pages
│   │   │   ├── how-it-works/         # How the platform works
│   │   │   ├── charities/            # Featured charities page
│   │   │   ├── pricing/              # Subscription pricing
│   │   │   └── about/                # About us page
│   │   ├── dashboard/                # User dashboard
│   │   │   ├── page.tsx              # Dashboard overview
│   │   │   ├── scores/               # Score submission
│   │   │   ├── draws/                # View draws
│   │   │   ├── charities/            # Charity selection
│   │   │   ├── winnings/             # Winnings tracker
│   │   │   └── settings/             # User settings
│   │   ├── admin/                    # Admin panel
│   │   │   ├── page.tsx              # Analytics dashboard
│   │   │   ├── users/                # User management
│   │   │   ├── draws/                # Draw management
│   │   │   ├── charities/            # Charity management
│   │   │   ├── winners/              # Winner verification
│   │   │   └── subscriptions/        # Subscription management
│   │   ├── api/                      # API routes
│   │   │   ├── cron/                 # Scheduled jobs
│   │   │   │   └── draw/             # Draw execution cron
│   │   │   └── webhooks/             # External webhooks
│   │   │       └── stripe/           # Stripe webhook events
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   ├── components/                   # Reusable React components
│   │   ├── layout/                   # Header, footer, navigation
│   │   ├── marketing/                # Marketing page components
│   │   ├── shared/                   # Shared components
│   │   └── ui/                       # Shadcn UI components
│   ├── actions/                      # Server Actions
│   │   ├── auth.actions.ts           # Authentication logic
│   │   ├── draw.actions.ts           # Draw operations
│   │   ├── score.actions.ts          # Score submissions
│   │   ├── charity.actions.ts        # Charity operations
│   │   ├── subscription.actions.ts   # Subscription management
│   │   ├── admin.actions.ts          # Admin operations
│   │   └── charity-email.actions.ts  # Email notifications
│   ├── lib/                          # Utilities and libraries
│   │   ├── supabase/                 # Supabase client & utilities
│   │   ├── stripe/                   # Stripe configuration
│   │   ├── email/                    # Email service & templates
│   │   ├── resend/                   # Resend integration
│   │   └── utils.ts                  # Helper functions
│   ├── services/                     # Business logic services
│   │   ├── draw.service.ts           # Draw logic & algorithms
│   │   └── prize-pool.service.ts     # Prize pool calculations
│   ├── types/                        # TypeScript type definitions
│   │   ├── index.ts                  # Global types
│   │   └── database.ts               # Database schema types
│   ├── validators/                   # Zod validation schemas
│   ├── hooks/                        # Custom React hooks
│   └── config/                       # Configuration
│       ├── site.ts                   # Site configuration & metadata
│       ├── navigation.ts             # Navigation structures
│       └── constants.ts              # Application constants
├── supabase/
│   └── migrations/
│       └── Schema.sql                # Database schema & migrations
├── public/                           # Static assets
├── .env.local                        # Environment variables (not in git)
├── next.config.js                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.mjs               # Tailwind CSS configuration
├── postcss.config.mjs                # PostCSS configuration
├── eslint.config.mjs                 # ESLint configuration
├── middleware.ts                     # Next.js middleware
└── package.json                      # Dependencies & scripts
```

---

## 🚀 Installation & Setup

### Prerequisites

Before getting started, ensure you have:

- **Node.js** v18.17.0 or higher (LTS recommended)
- **npm** v10.0+ or **yarn** v4.0+
- **Git** for version control
- A **Supabase** account ([https://supabase.com](https://supabase.com))
- A **Stripe** account ([https://stripe.com](https://stripe.com))
- A **Resend** account ([https://resend.com](https://resend.com))

### Step 1: Clone Repository

```bash
git clone https://github.com/AnjaliiRamesh/GolfProject.git
cd GolfProject
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all dependencies including:
- Next.js 16.2.9 with React 19
- Tailwind CSS v4
- Supabase client libraries
- Stripe SDK
- Resend integration
- UI components and utilities

### Step 3: Environment Variables Setup

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe Configuration (Required for payments)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_public_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_your_monthly_id
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_your_yearly_id

# Resend Configuration (Required for emails)
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=noreply@greenswing.com

# Security
CRON_SECRET=your_secure_random_string_minimum_32_characters
```

#### Getting Your API Keys

**Supabase Setup:**
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Navigate to **Settings → API**
4. Copy the **Project URL** and **anon key**
5. Copy the **Service Role Secret** key
6. Go to **SQL Editor** and run the schema from `supabase/migrations/Schema.sql`

**Stripe Setup:**
1. Go to [stripe.com](https://stripe.com) and create an account
2. Navigate to **Developers → API Keys**
3. Copy the **Publishable Key** (starts with `pk_test_`)
4. Copy the **Secret Key** (starts with `sk_test_`)
5. Create a webhook endpoint:
   - Go to **Developers → Webhooks**
   - Add endpoint: `http://localhost:3000/api/webhooks/stripe`
   - Select events: `customer.subscription.updated`, `customer.subscription.deleted`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the **Signing Secret** (`whsec_...`)
6. Create price objects in Stripe for monthly and yearly plans

**Resend Setup:**
1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to **API Keys**
3. Generate a new key and copy it
4. Add a verified domain (or use the default Resend domain)

### Step 4: Database Setup

The database schema is already defined in `supabase/migrations/Schema.sql`.

**To set up the database:**

1. Navigate to **SQL Editor** in your Supabase project
2. Copy and paste the entire content of `supabase/migrations/Schema.sql`
3. Execute the query to create all tables and enable Row-Level Security (RLS)

**Enable Row-Level Security (RLS):**

All tables already have RLS policies configured in the migration. Verify they are enabled:

1. Go to **Authentication → Policies**
2. Ensure RLS is enabled for:
   - `profiles`
   - `subscriptions`
   - `payments`
   - `charities`
   - `charity_subscriptions`
   - `scores`
   - `draws`
   - `draw_entries`
   - `winners`

### Step 5: Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

```
> next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## 📖 Usage Guide

### Public Pages (No Login Required)

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with introduction |
| How It Works | `/how-it-works` | Platform workflow explanation |
| Charities | `/charities` | Browse supported charities |
| Pricing | `/pricing` | Subscription plans overview |
| About | `/about` | About GreenSwing information |

### Authentication Routes

| Page | URL | Description |
|------|-----|-------------|
| Login | `/login` | User sign-in |
| Sign Up | `/signup` | New user registration |

### User Dashboard (Login Required)

| Feature | URL | Description |
|---------|-----|-------------|
| Dashboard | `/dashboard` | Overview & quick actions |
| Submit Score | `/dashboard/scores` | Enter Stableford scores |
| View Draws | `/dashboard/draws` | Browse available draws |
| Charities | `/dashboard/charities` | Select charity for allocation |
| Winnings | `/dashboard/winnings` | View prizes & proof submissions |
| Settings | `/dashboard/settings` | Profile & preferences |

### Admin Dashboard (Admin Role Required)

To access admin features, update your user role in Supabase:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your@email.com';
```

| Feature | URL | Description |
|---------|-----|-------------|
| Analytics | `/admin` | Dashboard & metrics |
| Users | `/admin/users` | User management & status |
| Charities | `/admin/charities` | Manage charities |
| Draws | `/admin/draws` | Create & manage draws |
| Winners | `/admin/winners` | Verify winners & payouts |
| Subscriptions | `/admin/subscriptions` | Subscription management |

---

## 🔌 API Overview

### Authentication Endpoints
- **POST** `/api/auth/signup` – User registration
- **POST** `/api/auth/login` – User login
- **POST** `/api/auth/logout` – User logout
- **POST** `/api/auth/refresh` – Refresh token

### Score Management
- **POST** `/api/scores` – Submit golf score
- **GET** `/api/scores` – Get user scores
- **DELETE** `/api/scores/:id` – Delete score

### Draw System
- **GET** `/api/draws` – List available draws
- **POST** `/api/draws` – Create draw (admin only)
- **POST** `/api/draws/:id/simulate` – Simulate draw (admin)
- **POST** `/api/draws/:id/execute` – Execute draw
- **POST** `/api/draws/:id/publish` – Publish results

### User Management
- **GET** `/api/users` – List users (admin)
- **GET** `/api/users/:id` – Get user profile
- **PUT** `/api/users/:id` – Update user
- **DELETE** `/api/users/:id` – Delete user (admin)

### Subscription & Payment
- **POST** `/api/subscriptions` – Create subscription
- **GET** `/api/subscriptions` – Get subscription status
- **POST** `/api/subscriptions/cancel` – Cancel subscription
- **POST** `/api/webhooks/stripe` – Stripe webhook handler

### Charity Management
- **GET** `/api/charities` – List charities
- **POST** `/api/charities` – Create charity (admin)
- **PUT** `/api/charities/:id` – Update charity (admin)
- **POST** `/api/charities/:id/subscribe` – Subscribe to charity

### Scheduled Jobs
- **POST** `/api/cron/draw` – Execute pending draws (requires CRON_SECRET)

**Authentication:** Bearer token in `Authorization` header
**Response Format:** JSON with `data`, `error`, and `message` fields
**Error Handling:** Standard HTTP status codes (200, 400, 401, 403, 404, 500)




## 🚀 Deployment Guide

### Deploy to Vercel (Recommended)

Vercel is optimized for Next.js and provides automatic deployments.

**Prerequisites:**
- GitHub account with repository pushed
- Vercel account ([https://vercel.com](https://vercel.com))

**Steps:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import Project in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select "Import Git Repository"
   - Choose your GreenSwing repository
   - Click "Import"

3. **Set Environment Variables**
   - In Vercel dashboard, go to **Settings → Environment Variables**
   - Add all variables from your `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=...
     NEXT_PUBLIC_SUPABASE_ANON_KEY=...
     SUPABASE_SERVICE_ROLE_KEY=...
     NEXT_PUBLIC_APP_URL=https://your-domain.com
     NEXT_PUBLIC_STRIPE_PUBLIC_KEY=...
     STRIPE_SECRET_KEY=...
     STRIPE_WEBHOOK_SECRET=...
     RESEND_API_KEY=...
     EMAIL_FROM=...
     CRON_SECRET=...
     ```

4. **Configure Stripe Webhook**
   - In Stripe dashboard, update webhook endpoint to: `https://your-domain.com/api/webhooks/stripe`
   - Update `STRIPE_WEBHOOK_SECRET` in Vercel with the new secret

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - View live at the provided URL




---

## 📋 Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles & roles |
| `subscriptions` | Subscription plans & status |
| `payments` | Payment records |
| `charities` | Supported charities |
| `charity_subscriptions` | User-charity allocations |
| `scores` | Golf scores submitted by users |
| `draws` | Prize draws |
| `draw_entries` | User entries in draws |
| `winners` | Winner records & proof |
| `system_settings` | Platform configuration |

### Key Enums

- `user_role` – 'user' | 'admin'
- `subscription_status` – 'active' | 'canceled' | 'expired' | 'past_due' | 'trialing'
- `draw_status` – 'draft' | 'simulated' | 'running' | 'completed' | 'published'
- `winner_status` – 'pending' | 'proof_uploaded' | 'approved' | 'rejected' | 'paid'
- `payment_status` – 'succeeded' | 'failed' | 'refunded'

---

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start development server on http://localhost:3000

# Production
npm run build            # Build for production
npm start                # Start production server



---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is private and owned by the GreenSwing team. Unauthorized use or distribution is prohibited.

---

## 👤 Author

**Anjali Gupta**
- GitHub: [@AnjaliiRamesh](https://github.com/AnjaliiRamesh)
- Email: anjaliramesh14012005@gmail.com

---




**Last Updated:** June 2026
**GreenSwing Version:** 1.0.0
**Maintained By:** Anjali Gupta

---

*For questions or support, please reach out through the GitHub repository or contact the development team.*
