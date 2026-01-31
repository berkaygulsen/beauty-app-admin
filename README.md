# Beauty App Admin Panel

Beauty App için React ve TypeScript ile geliştirilmiş admin paneli.

## Teknoloji Stack

- **React 18+** - UI framework
- **TypeScript 5+** - Type safety
- **Vite** - Build tool
- **React Router v6** - Routing
- **TanStack Query v5** - Server state management
- **Zustand** - Client-side state management
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client

## Kurulum

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. Environment variables'ı yapılandırın:

`.env` dosyasını oluşturun ve API base URL'ini ayarlayın:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

3. Development server'ı başlatın:

```bash
npm run dev
```

4. Production build oluşturun:

```bash
npm run build
```

## Proje Yapısı

```
src/
├── api/                    # API client ve endpoints
│   ├── client.ts          # Axios instance
│   ├── endpoints/         # API endpoint'leri
│   └── types.ts           # API types
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components
├── features/             # Feature-based modules
│   ├── auth/            # Authentication
│   └── dashboard/       # Dashboard
├── hooks/               # Custom hooks
├── lib/                 # Utilities
├── store/               # Zustand stores
├── types/               # TypeScript types
└── routes/              # Route definitions
```

## Özellikler

- ✅ Authentication (Login/Logout)
- ✅ Protected Routes
- ✅ Responsive Layout
- ✅ Dashboard (temel yapı)
- ✅ API Client (Axios with interceptors)
- ✅ State Management (Zustand + TanStack Query)
- ✅ Form Validation (React Hook Form + Zod)

## Geliştirme Planı

Detaylı geliştirme planı için `admin-panel-gelistirme-plani.md` dosyasına bakınız.

## Lisans

Private project
