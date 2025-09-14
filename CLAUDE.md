# Alyan Space Frontend

## Structure
```
src/
├── components/common/    # ProtectedRoute.jsx
├── pages/               # Home.jsx, Login.jsx, Dashboard.jsx
├── store/               # authStore.js
├── services/            # api.js, authService.js
├── utils/               # cn.js, validation.js
├── constants/           # api.js
├── types/               # auth.js
├── providers/           # AppProviders.jsx, QueryProvider.jsx, ToastProvider.jsx
└── App.jsx
```

## Environment (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Commands
```bash
npm run dev    # Start development server (http://localhost:5174)
npm run build  # Build for production
```

## Login Credentials
```
Email: admin@alyanspace.com
Password: AlyanSpace2024!
```

## Routes
- `/` - Home page (public)
- `/login` - Login page (public)
- `/dashboard` - Admin dashboard (protected)

## Tech Stack
- React 18 + Vite
- Tailwind CSS for styling
- React Router DOM for routing
- Zustand for state management
- React Hook Form + Zod for forms
- Framer Motion for animations
- React Hot Toast for notifications
- TanStack Query for server state
- Lucide React for icons

## Key Features
- Secure JWT authentication
- Protected routes with loading states
- Auto token refresh every 4 minutes
- Persistent auth state
- Beautiful UI with animations
- Form validation with error handling