# NeedFul: Hyperlocal Super App

**NeedFul** is a next-generation hyperlocal discovery platform designed to bridge the gap between local service providers and consumers. Built with a "Mobile-First" philosophy and the **Material You** design system, it offers a frictionless experience for discovering, verifying, and connecting with services ranging from dining to home maintenance.

![Project Status](https://img.shields.io/badge/Status-Active_Development-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_16_|_Tailwind_|_Supabase-blue)

---

## 🌟 Features Implemented

### 🔍 Advanced Discovery Engine
*   **Semantic Search:** Intelligent filtering by category, name, or amenities (e.g., "North Indian with AC").
*   **Geospatial "Nearby" Search:** Uses browser geolocation API + PostGIS queries to find services within a calibrated radius.
*   **Smart Autocomplete:** Google Maps-style area prediction (e.g., "Santacruz West") with debounce optimization.

### 🏢 Comprehensive Business Ecosystem
*   **Dynamic Business Pages:**
    *   **Tabbed Navigation:** Smooth, animated switching between Overview, Menu, Reviews, and Photos using Framer Motion.
    *   **Rich Menu Visualization:** Displays detailed service/food menus with pricing and descriptions.
    *   **Real-time Amenities:** Dynamic badges for features like "Valet Parking," "Verified," etc.
*   **Verification System:** "Verified Listing" badges to build user trust.

### ✍️ Social & Trust Layer
*   **Real-Time Reviews:** Users can submit ratings and detailed reviews instantly.
*   **Rating Analytics:** Visual breakdown of 5-star to 1-star ratings distribution.
*   **Optimistic UI:** "Mark as Helpful" and "Favorite" actions update instantly for a lag-free feel.

### 🎨 Modern UI/UX (Material You)
*   **Adaptive Design:** Fully responsive layout with mobile-specific bottom sheets and sticky action bars.
*   **Micro-Interactions:** Subtle hover states, cohesive transitions, and ripple effects.
*   **Glassmorphism:** Premium aesthetic using backdrop blurs and deep shadows.

---

## 🛠️ Tech Stack

This project is built using a **Free-Tier Optimized** modern web stack:

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16** | App Router, Server Components, SSR for SEO. |
| **UI Library** | **React.js 19** | Component-based architecture. |
| **Styling** | **Tailwind CSS** | Utility-first styling with custom "Material You" config. |
| **Animations** | **Framer Motion** | Physics-based layout transitions (Sleek Tabs). |
| **Database** | **Supabase** | PostgreSQL database with Realtime capabilities. |
| **Authentication** | **Supabase Auth** | Secure Email/Password & Social Providers. |
| **Icons** | **Lucide React** | Consistent, lightweight SVG icons. |
| **Deployment** | **Vercel** | Edge network deployment. |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
*   **Node.js**: Version 18.17 or later.
*   **npm**: Installed with Node.js.
*   **Git**: Version control system.

### 1. Clone the Repository
```bash
git clone https://github.com/Codewithjainam7/NeedFul.git
cd Needful/localserve
```

### 2. Install Dependencies
```bash
npm install
```
*Note: This will install Next.js, React, Tailwind, Supabase Client, and other UI utilities.*

### 3. Environment Configuration
Create a `.env.local` file in the root directory and populate it with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup (Supabase)
Ensure your Supabase project (or local instance) has the following tables:
*   `providers` (Business details)
*   `services` (Menu items/Offerings)
*   `reviews` (User ratings)
*   `categories` (Food, Services, etc.)
*   `provider_images` (Gallery URLs)

*(SQL migration scripts are available in the `db/` folder if provided)*

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 6. Build for Production
To test the production build locally:
```bash
npm run build
npm start
```

---

## 👥 Meet the Team

*   **Frontend & UI/UX:** Jagrat, Khushi
*   **Backend & Auth:** Jainam, Mohit

---

## 📄 License
This project is open-source and available under the MIT License.
