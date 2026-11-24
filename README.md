# 🩸 KBDF — Kushtia Blood Donation Foundation (SR ব্লাড ডোনেট ফাউন্ডেশন)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Admin-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

**KBDF (Kushtia Blood Donation Foundation)** is an open, modern, and reliable voluntary blood donor network platform. Designed specifically for Kushtia district and its surrounding upazilas, this platform bridges the gap between voluntary blood donors and patients in critical need, enabling fast, safe, and transparent coordination.

---

## 🌟 Key Features

- 🔍 **Blood Donor Search & Filtering:**
  - Search voluntary donors filtered by blood group (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`) and upazila (Kushtia Sadar, Kumarkhali, Khoksa, Mirpur, Bheramara, Daulatpur).
  - High-performance server component querying with URL-driven search and pagination.
  - Quick contact options (Direct call, WhatsApp, Facebook) for verified and active donors.

- 🏥 **Emergency Blood Requests:**
  - Public submission portal for emergency blood requirements.
  - Detailed request tracking: required date/time (`neededBy`), units needed, hospital location, and patient status.
  - Multi-stage request lifecycle tracking (`pending`, `approved`, `fulfilled`, `cancelled`).

- 🤝 **Volunteer Community Directory:**
  - Dedicated `/volunteers` directory featuring approved community volunteers who have provided public consent (`publicConsent`) in their profiles.

- 🔐 **Robust Authentication & Session Management:**
  - Seamless client-side Google Sign-In via Firebase Auth.
  - Server-side ID token verification with Firebase Admin SDK.
  - Secure, CSRF-resistant `httpOnly` session cookies (`__session`) for server-rendered dashboard access.

- 🛡️ **Role-Based Access Control (RBAC):**
  - Multi-tier permission system: `admin`, `moderator`, `volunteer`, and `user`.
  - Account approval workflow for newly registered members before gaining dashboard write access.

- 📊 **Management & Moderation Dashboard:**
  - Real-time platform statistics (total active donors, fulfilled requests, pending demands).
  - Donor management: Review, verify, activate, or archive donor registrations.
  - Request management: Review and approve emergency blood requests.
  - User administration: Assign roles, approve members, and oversee community accounts (Admin only).
  - Comprehensive user profile builder (personal info, education, employment, and consent settings).

- 🌐 **SEO & Modern Bengali Interface:**
  - Fully responsive, accessible, mobile-first design styled with Tailwind CSS and Lucide icons.
  - Native Bengali language localized interface.
  - Search engine optimization with dynamic Open Graph (OG) images, Twitter cards, `robots.txt`, and auto-generated `sitemap.xml`.

---

## 👥 Role Hierarchy & Permissions

| Role | Approval Required | Permissions & Capabilities |
| :--- | :---: | :--- |
| **Admin (`admin`)** | Automatic via Email Whitelist | Full system control: Manage user roles, approve accounts, full CRUD for donors, requests, and site content. |
| **Moderator (`moderator`)** | Approved by Admin | Review, approve, and manage donors and blood requests (cannot change user roles). |
| **Volunteer (`volunteer`)** | Approved by Staff | Create and manage own blood requests (subject to staff review before publication). |
| **User (`user`)** | Pending Approval | Default role upon Google sign-in. Browse public directories. Requires staff approval and completed profile to access dashboard. |

> **Note:** Emails specified in the `ADMIN_EMAILS` environment variable automatically receive the `admin` role and immediate approval upon logging in.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server and Client Components)
- **User Interface:** [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons)
- **Database & ORM:** [MongoDB](https://www.mongodb.com/), [Mongoose 8](https://mongoosejs.com/)
- **Authentication:** [Firebase Client Auth](https://firebase.google.com/docs/auth) & [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- **Form Handling & Validation:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/), `@hookform/resolvers`
- **Feedback & Utilities:** `react-hot-toast`, Node.js ESM Scripts

---

## 📁 Directory Structure

```text
kbdf/
├── app/                       # Next.js App Router pages and layouts
│   ├── api/                   # Backend API routes
│   │   ├── admin/             # Administrative actions & mutations
│   │   ├── contact/           # Contact form submissions
│   │   ├── donors/            # Donor data operations
│   │   ├── me/                # Profile management endpoint
│   │   ├── requests/          # Blood request operations
│   │   ├── session/           # Session cookie exchange
│   │   └── stats/             # Platform counters and aggregations
│   ├── dashboard/             # Protected management dashboard
│   │   ├── donors/            # Donor review and approvals
│   │   ├── requests/          # Blood request moderation
│   │   ├── users/             # User management and role assignment
│   │   └── profile/           # User profile & onboarding
│   ├── donors/                # Public donor search & donor registration
│   ├── requests/              # Public emergency request list & new request form
│   ├── volunteers/            # Public volunteer directory
│   ├── layout.js              # Root layout (Header, Footer, Meta)
│   ├── page.js                # Landing page
│   ├── sitemap.js             # Dynamic sitemap generation
│   └── robots.js              # Web crawler directives
├── components/                # Reusable UI components
│   ├── dashboard/             # Dashboard shell, sidebar, profile views
│   ├── forms/                 # Form components (Donor, Request, Profile)
│   ├── AuthProvider.jsx       # Firebase client state context
│   ├── BloodBadge.jsx         # Color-coded blood group badge
│   ├── DonorCard.jsx          # Donor card item
│   ├── RequestCard.jsx        # Blood request card item
│   └── Header.jsx / Footer.jsx
├── lib/                       # Utility libraries and helpers
│   ├── auth.js                # Server session cookie and auth guard helpers
│   ├── constants.js           # Blood groups, upazilas, and status lists
│   ├── db.js                  # Mongoose connection management
│   ├── firebase.js            # Firebase client initialization
│   ├── firebaseAdmin.js       # Firebase Admin SDK initialization
│   ├── permissions.js         # RBAC rules and permission predicates
│   ├── queries.js             # Server-side database queries
│   └── validators.js          # Zod schemas for input validation
├── models/                    # Mongoose database models
│   ├── BloodRequest.js        # Blood request schema
│   ├── Donor.js               # Donor schema
│   ├── Message.js             # Contact messages schema
│   └── User.js                # User account and profile schema
├── scripts/
│   └── db-check.mjs           # MongoDB connection and collection verification script
├── .env.example               # Example environment variable template
├── package.json
└── tailwind.config.js
```

---

## ⚙️ Prerequisites

Before running the application, make sure you have:

- **Node.js:** `v18.17` or higher
- **Package Manager:** `npm` or `yarn`
- **MongoDB:** A running local instance (`mongodb://localhost:27017`) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI
- **Firebase Project:**
  - Google Sign-In provider enabled under *Build > Authentication > Sign-in method*.
  - Authorized domains configured (include `localhost` and your production domain).
  - Service Account Private Key generated (*Project Settings > Service accounts > Generate new private key*).

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/kbdf.git
cd kbdf
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your configuration values:

```env
# MongoDB Connection URI (Local or MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/kbdfDB

# Firebase Web App Config (Project Settings > General > Your apps)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Firebase Admin SDK (Project Settings > Service accounts)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwgg...==\n-----END PRIVATE KEY-----\n"

# Admin Email Whitelist (Comma-separated Google emails)
ADMIN_EMAILS=admin@example.com,lead@example.com

# Public Site URL (Used for SEO, canonical URLs, and sitemap)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Important:** Wrap `FIREBASE_ADMIN_PRIVATE_KEY` in quotes and retain the literal `\n` newline escape sequences.

### 4. Verify Database Connection
Run the verification script to check your MongoDB connectivity:
```bash
npm run db:check
```
When successful, it prints the connected database name along with document counts for each collection.

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server on port 3000. |
| `npm run build` | Compiles and builds the application for production deployment. |
| `npm run start` | Launches the built production application. |
| `npm run lint` | Runs Next.js ESLint checks to enforce code quality. |
| `npm run db:check` | Connects to `MONGODB_URI` and lists collections with their document counts. |

---

## 🔒 Architecture & Security

- **Server-First Data Fetching:** Search and listing pages run in Server Components (`lib/queries.js`) driven by URL search parameters. This eliminates client waterfall requests and preserves snappy page loads.
- **Dual-Layer Authentication Guards:**
  - **API Routes:** Protected endpoints verify the incoming `Authorization: Bearer <ID_TOKEN>` header (`getSessionUser`).
  - **Dashboard Pages:** Protected dashboard views verify the encrypted `httpOnly` session cookie (`getServerUser` / `getDashboardUser`).
- **Privacy Controls:** Sensitive contact details (such as direct phone numbers) are masked or filtered on public views unless authorized or approved.

---

## 🤝 Contributing

Contributions, issues, and feature proposals are welcome!

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/NewFeature`).
3. Commit your Changes (`git commit -m 'feat: Add NewFeature'`).
4. Push to the Branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is open-source. Please see the [LICENSE](LICENSE) file for more information.
