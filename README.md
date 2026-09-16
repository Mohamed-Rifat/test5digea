# Digea 💍

**Digea** is a modern wedding-planning and wedding-services platform designed to help couples organize their journey from the first planning step to the wedding day.

The platform connects **couples** with **wedding vendors and services**, while providing tools such as a personalized wedding roadmap, favorites, reviews, authentication, and vendor management.

## ✨ Features

### 👰‍♀️🤵‍♂️ For Couples

- Create an account and securely sign in.
- Build a personalized wedding roadmap.
- Add the partner's name and wedding/event date.
- Track the remaining time until the event.
- Follow wedding-planning tasks and update their progress.
- Browse approved wedding vendors and services.
- Search and filter services by category, price, rating, and other criteria.
- Add vendors or services to favorites.
- Compare selected vendors/services.
- Read vendor reviews and ratings.
- Manage profile information.
- Change account password and security settings.
- Use Arabic or English.
- Switch between light and dark themes.
- Get help through the platform's AI assistant.

### 🏪 For Vendors

- Register as a wedding-service provider.
- Create and manage a vendor profile.
- Add and manage services.
- Provide business information, description, contact details, location, categories, and profile image.
- Track service approval status.
- Resubmit updated information when changes are required.
- Manage vendor dashboard and service listings.
- Receive customer ratings and reviews.

### 🛡️ For Administrators

- Manage platform content and users.
- Review vendor/service submissions.
- Approve or reject vendor services.
- Monitor moderation statuses.
- Manage platform categories and administrative data.

## 🗺️ Wedding Roadmap

The roadmap is one of Digea's core features.

After signing in, a couple can create a wedding journey containing:

- Partner name
- Wedding/event date
- Countdown to the event
- Planning categories
- Individual roadmap tasks
- Task progress/status
- Links to relevant vendors and services

### Roadmap Item Statuses

| Status | Meaning |
|---|---|
| `NotStarted` | The task has not been started yet |
| `VendorSelected` | A vendor/service has been selected |
| `Completed` | The task has been completed |

## 🏪 Vendors & Services

Digea separates vendors from the individual services they provide.

Public service discovery supports filters such as:

- Search term
- Category
- Minimum price
- Maximum price
- Minimum rating
- Sorting
- Pagination

Only services that are **approved and active** are intended to appear in the public marketplace.

## ❤️ Favorites & Reviews

Users can save both vendors and services to their favorites.

Digea also supports vendor ratings and customer reviews so couples can evaluate services based on previous customer experiences.

## 🔐 Authentication & Roles

The application uses authenticated accounts with role-based access.

Supported roles include:

- `User`
- `Vendor`
- `Admin`

Authenticated API requests use a bearer token.

## 🌐 Localization & UI

Digea is designed with a modern, romantic, and elegant visual identity suitable for a wedding-planning platform.

The interface supports:

- Arabic / English
- Light / Dark mode
- Responsive desktop and mobile layouts
- Modern cards and dashboards
- Wedding-focused visual components
- Toast notifications for user feedback

## 🛠️ Tech Stack

### Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Axios**
- **Lucide React**
- React hooks and client components where needed

### Backend

Digea communicates with a REST API backend.

The frontend API base URL is configured through:

```env
NEXT_PUBLIC_API_URL=
```

## 📁 Project Structure

A simplified structure of the application looks like:

```text
src/
├── app/
│   ├── (public)/
│   ├── admin/
│   ├── compare/
│   ├── favorites/
│   ├── login/
│   ├── partners/
│   ├── profile/
│   ├── register/
│   ├── vendor/
│   └── ...
│
├── components/
├── features/
├── lib/
└── ...
```

The exact structure may evolve as the project grows.

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd 5digea
```

### 2. Install dependencies

```bash
npm install
```

If your environment requires legacy peer dependency resolution:

```bash
npm install --legacy-peer-deps
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=your-api-base-url
```

Example:

```env
NEXT_PUBLIC_API_URL=http://your-api-server
```

> Do not commit private credentials, tokens, or secrets to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 🏗️ Build for Production

Run:

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```

## 🚀 Deployment

Digea can be deployed using platforms that support Next.js, including Vercel.

Before deploying, make sure the production environment contains the correct:

```env
NEXT_PUBLIC_API_URL
```

After deployment, verify:

- Authentication
- API requests
- Vendor/service discovery
- Favorites
- Roadmap
- Reviews
- Admin/vendor dashboards
- Arabic/English behavior
- Mobile responsiveness

## 🔗 Project Links

### Live Demo

**Digea:**  
https://test5digea.vercel.app

### GitHub

**Repository:**  
https://github.com/Mohamed-Rifat/test5digea

## 📌 Development Notes

Digea is actively developed and its API, UI, and feature set may change over time.

When contributing new features, keep the following principles in mind:

- Keep components reusable.
- Prefer TypeScript types over `any`.
- Keep API logic separated from UI components.
- Use toast notifications instead of browser `alert()` dialogs.
- Avoid unnecessary `console.log()` statements in production code.
- Keep the UI responsive.
- Preserve Arabic/English support.
- Protect authenticated and role-specific routes.
- Validate API responses before rendering dependent data.

## 📄 License

This project is currently a private/custom project. Add the appropriate license here if the repository is later published under an open-source license.

---

Made with ❤️ for couples planning their perfect wedding journey.
