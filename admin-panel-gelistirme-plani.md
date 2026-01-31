# Admin Panel Geliştirme Planı

## 📋 Genel Bakış

Bu doküman, Beauty App için React ve TypeScript ile geliştirilecek admin panelinin detaylı geliştirme planını içermektedir. Admin panel, mevcut uygulama featurelarını ve MVP için geliştirilecek yeni featureları yönetmek için gerekli tüm özellikleri kapsamaktadır.

**Son Güncelleme**: 2024

---

## 🎯 Teknoloji Stack

### Frontend Framework & Build Tool
- **React 18+** - UI framework
- **TypeScript 5+** - Type safety
- **Vite** - Build tool ve dev server (CRA yerine, daha hızlı)
- **React Router v6** - Routing

### State Management
- **TanStack Query (React Query) v5** - Server state management, caching, synchronization
- **Zustand** - Client-side state management (auth, UI state)
- **React Hook Form** - Form state management ve validation

### UI Framework & Styling
- **shadcn/ui** - Modern, accessible component library (Tailwind CSS tabanlı)
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI primitives (shadcn/ui altında)
- **Lucide React** - Icon library

### Data Fetching & API
- **Axios** - HTTP client
- **Zod** - Schema validation (backend ile uyumlu)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Vitest** - Unit testing (opsiyonel)

### Additional Libraries
- **date-fns** - Date manipulation
- **recharts** - Charts ve grafikler
- **react-table (TanStack Table)** - Data tables
- **react-hot-toast** - Toast notifications

---

## 📁 Proje Yapısı

```
admin-panel/
├── public/
├── src/
│   ├── api/                    # API client ve endpoints
│   │   ├── client.ts           # Axios instance
│   │   ├── endpoints/
│   │   │   ├── auth.ts
│   │   │   ├── providers.ts
│   │   │   ├── customers.ts
│   │   │   ├── serviceRequests.ts
│   │   │   ├── payments.ts
│   │   │   ├── documents.ts
│   │   │   └── ...
│   │   └── types.ts            # API response types
│   ├── components/             # Reusable components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── tables/             # Table components
│   │   ├── forms/              # Form components
│   │   └── charts/             # Chart components
│   ├── features/               # Feature-based modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types.ts
│   │   ├── dashboard/
│   │   ├── providers/
│   │   ├── customers/
│   │   ├── serviceRequests/
│   │   ├── payments/
│   │   ├── documents/
│   │   ├── settings/
│   │   └── reports/
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── usePermissions.ts
│   │   └── ...
│   ├── lib/                    # Utilities
│   │   ├── utils.ts
│   │   ├── validations.ts
│   │   └── constants.ts
│   ├── store/                  # Zustand stores
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   ├── types/                  # TypeScript types
│   │   ├── index.ts
│   │   └── ...
│   ├── routes/                 # Route definitions
│   │   └── index.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🔐 Authentication & Authorization

### Admin Authentication
- **JWT Token Based** - Backend'deki mevcut auth sistemi ile uyumlu
- **Role-Based Access Control (RBAC)** - Admin rolleri:
  - `SUPER_ADMIN` - Tüm yetkiler
  - `ADMIN` - Genel yönetim yetkileri
  - `MODERATOR` - İçerik moderasyonu
  - `SUPPORT` - Destek ve görüntüleme

### Protected Routes
- Tüm admin panel route'ları protected olacak
- Token expiration kontrolü
- Auto-refresh token mekanizması
- Session timeout handling

---

## 📊 Dashboard (Ana Sayfa)

### Genel İstatistikler (KPI Cards)
1. **Toplam Provider Sayısı**
   - Aktif/Onay bekleyen/Askıya alınmış breakdown
2. **Toplam Customer Sayısı**
   - Yeni kayıtlar (bugün/ay)
3. **Toplam Hizmet Talebi Sayısı**
   - Durum bazlı breakdown (NEW, ACCEPTED, COMPLETED, CANCELLED)
4. **Toplam Gelir**
   - Bugün/Ay/Toplam
   - Komisyon geliri
5. **Bekleyen İşlemler**
   - Onay bekleyen provider'lar
   - Onay bekleyen dokümanlar
   - İtiraz edilen hizmet talepleri

### Grafikler
1. **Hizmet Talebi Trendi** (Line Chart)
   - Son 30 günlük talep sayısı
2. **Provider Durum Dağılımı** (Pie Chart)
3. **Gelir Trendi** (Area Chart)
   - Günlük/aylık gelir
4. **En Popüler Hizmet Kategorileri** (Bar Chart)

### Son Aktiviteler
- Son kayıt olan provider'lar
- Son tamamlanan hizmet talepleri
- Son ödemeler
- Sistem bildirimleri

---

## 👥 Provider Yönetimi

### Provider Listesi
**Endpoint**: `GET /api/v1/admin/providers`

**Özellikler**:
- Tablo görünümü (pagination, sorting, filtering)
- Filtreleme:
  - Durum (PENDING, UNDER_REVIEW, APPROVED, REJECTED, SUSPENDED)
  - Şehir/İlçe
  - Kayıt tarihi aralığı
  - Skor aralığı
  - Email/Telefon arama
- Sıralama:
  - Kayıt tarihi
  - Skor
  - Tamamlanan hizmet sayısı
- Toplu işlemler:
  - Toplu onaylama
  - Toplu askıya alma

**Tablo Kolonları**:
- ID
- Ad Soyad
- Email
- Telefon
- Durum (badge)
- Şehir/İlçe
- Skor
- Toplam Hizmet
- Ortalama Puan
- Kayıt Tarihi
- İşlemler (View, Edit, Approve, Reject, Suspend)

### Provider Detay Sayfası
**Endpoint**: `GET /api/v1/admin/providers/:id`

**Sekmeler**:
1. **Genel Bilgiler**
   - Kişisel bilgiler
   - İletişim bilgileri
   - Adres bilgileri
   - Durum bilgileri
   - Skor bilgileri
   - Kayıt/Onay tarihleri

2. **Hizmetler**
   - Provider'ın hizmet listesi
   - Hizmet ekleme/düzenleme/silme (admin yetkisiyle)

3. **Hizmet Talepleri**
   - Provider'a ait tüm talepler
   - Durum bazlı filtreleme

4. **Ödemeler**
   - Provider ödeme geçmişi
   - Bekleyen ödemeler
   - Ödeme detayları

5. **Dokümanlar**
   - Yüklenen dokümanlar
   - Doğrulama durumu
   - Doküman onaylama/reddetme

6. **Puanlama Geçmişi**
   - Skor değişim geçmişi
   - Değerlendirmeler
   - Yorumlar

7. **Aktivite Logu**
   - Tüm işlem geçmişi
   - Sistem değişiklikleri

### Provider İşlemleri
- **Onaylama**: `POST /api/v1/admin/providers/:id/approve`
- **Reddetme**: `POST /api/v1/admin/providers/:id/reject` (sebep gerekli)
- **Askıya Alma**: `POST /api/v1/admin/providers/:id/suspend` (sebep gerekli)
- **Askıdan Kaldırma**: `POST /api/v1/admin/providers/:id/unsuspend`
- **Düzenleme**: `PUT /api/v1/admin/providers/:id`
- **Skor Düzenleme**: `PUT /api/v1/admin/providers/:id/score` (manuel skor ayarlama)

---

## 👤 Customer Yönetimi

### Customer Listesi
**Endpoint**: `GET /api/v1/admin/customers`

**Özellikler**:
- Tablo görünümü (pagination, sorting, filtering)
- Filtreleme:
  - Email/Telefon arama
  - Kayıt tarihi aralığı
  - Doğrulama durumu
- Sıralama:
  - Kayıt tarihi
  - Toplam hizmet sayısı
  - Ortalama puan

**Tablo Kolonları**:
- ID
- Ad Soyad
- Email
- Telefon
- Doğrulama Durumu
- Toplam Hizmet
- Ortalama Puan
- Kayıt Tarihi
- İşlemler (View, Edit, Suspend)

### Customer Detay Sayfası
**Endpoint**: `GET /api/v1/admin/customers/:id`

**Sekmeler**:
1. **Genel Bilgiler**
   - Kişisel bilgiler
   - İletişim bilgileri
   - Doğrulama durumu

2. **Adresler**
   - Kayıtlı adresler
   - Varsayılan adres

3. **Hizmet Talepleri**
   - Customer'a ait tüm talepler
   - Durum bazlı filtreleme

4. **Ödemeler**
   - Ödeme geçmişi
   - Ödeme durumları

5. **Değerlendirmeler**
   - Yaptığı değerlendirmeler
   - Yorumlar

### Customer İşlemleri
- **Düzenleme**: `PUT /api/v1/admin/customers/:id`
- **Askıya Alma**: `POST /api/v1/admin/customers/:id/suspend` (sebep gerekli)
- **Askıdan Kaldırma**: `POST /api/v1/admin/customers/:id/unsuspend`

---

## 📋 Hizmet Talebi Yönetimi (Service Request)

### Talep Listesi
**Endpoint**: `GET /api/v1/admin/service-requests`

**Özellikler**:
- Tablo görünümü (pagination, sorting, filtering)
- Filtreleme:
  - Durum (NEW, ACCEPTED, REJECTED, COMPLETED, CANCELLED, TIMEOUT)
  - Provider/Customer arama
  - Tarih aralığı
  - Fiyat aralığı
- Sıralama:
  - Oluşturulma tarihi
  - Talep tarihi
  - Fiyat

**Tablo Kolonları**:
- ID
- Provider (link)
- Customer (link)
- Hizmet
- Durum (badge)
- Talep Tarihi/Saati
- Fiyat
- Komisyon
- Net Tutar
- Oluşturulma Tarihi
- İşlemler (View, Edit Status, Cancel)

### Talep Detay Sayfası
**Endpoint**: `GET /api/v1/admin/service-requests/:id`

**Bilgiler**:
- Talep detayları
- Provider bilgileri
- Customer bilgileri
- Hizmet bilgileri
- Adres bilgileri
- Özel notlar
- Durum geçmişi (state machine log)
- Ödeme bilgileri
- Değerlendirme (varsa)

### Talep İşlemleri
- **Durum Değiştirme**: `PUT /api/v1/admin/service-requests/:id/status`
  - State machine kurallarına uygun
  - Geçiş logları tutulacak
- **İptal Etme**: `POST /api/v1/admin/service-requests/:id/cancel` (sebep gerekli)
- **Manuel Tamamlama**: `POST /api/v1/admin/service-requests/:id/complete` (moderasyon için)
- **İtiraz Çözümleme**: `POST /api/v1/admin/service-requests/:id/resolve-dispute`

### State Machine Yönetimi
**MVP Feature - Talep Durum Yönetimi**

**Durumlar**:
- `CREATED` (oluşturuldu)
- `ACCEPTED` (hizmet verici tarafından kabul edildi)
- `PAYMENT_RECEIVED` (ödeme alındı)
- `COMPLETED` (hizmet tamamlandı)
- `CANCELLED` (iptal edildi - kimin iptal ettiği bilgisiyle)

**Admin Panel Özellikleri**:
- Durum geçiş geçmişi görüntüleme
- Durum geçiş logları
- Durum değişikliği yapma (kurallara uygun)
- Durum geçiş diyagramı (görsel)

---

## 💰 Ödeme ve Bakiye Yönetimi

### Provider Ödemeleri
**Endpoint**: `GET /api/v1/admin/payments`

**Özellikler**:
- Tablo görünümü
- Filtreleme:
  - Provider
  - Ödeme durumu (PENDING, PROCESSING, COMPLETED, FAILED)
  - Tarih aralığı
  - Tutar aralığı
- Sıralama:
  - Ödeme tarihi
  - Tutar

**Tablo Kolonları**:
- ID
- Provider (link)
- Toplam Tutar
- Komisyon
- Net Tutar
- Durum (badge)
- Ödeme Tarihi
- İşlem Tarihi
- İşlemler (View, Process, Export Invoice)

### Ödeme Detay Sayfası
**Endpoint**: `GET /api/v1/admin/payments/:id`

**Bilgiler**:
- Ödeme detayları
- İlgili hizmet talepleri
- Provider bilgileri
- Ödeme yöntemi
- Fatura bilgileri

### Ödeme İşlemleri
- **Ödeme İşleme**: `POST /api/v1/admin/payments/:id/process`
- **Ödeme İptal**: `POST /api/v1/admin/payments/:id/cancel`
- **Fatura Oluşturma**: `GET /api/v1/admin/payments/:id/invoice`

### Customer Ödemeleri
**Endpoint**: `GET /api/v1/admin/customer-payments`

**Özellikler**:
- Customer ödeme geçmişi
- Ödeme durumu takibi
- İade işlemleri (manuel)

### Bakiye Yönetimi
**MVP Feature - Platform İçi Ödeme ve Bakiye Sistemi**

**Admin Panel Özellikleri**:
- Provider bakiyeleri görüntüleme
- Bekleyen ödemeler listesi
- Ödeme onaylama/reddetme
- Bakiye transfer logları
- Ödeme geçmişi

---

## 📄 Doküman Yönetimi

### Doküman Listesi
**Endpoint**: `GET /api/v1/admin/documents`

**Özellikler**:
- Tablo görünümü
- Filtreleme:
  - Provider
  - Doküman türü
  - Doğrulama durumu (PENDING, VERIFIED, REJECTED)
  - Tarih aralığı
- Sıralama:
  - Oluşturulma tarihi
  - Doğrulama tarihi

**Tablo Kolonları**:
- ID
- Provider (link)
- Doküman Türü
- Durum (badge)
- Yüklenme Tarihi
- Doğrulama Tarihi
- Doğrulayan
- İşlemler (View, Approve, Reject)

### Doküman Detay Sayfası
**Endpoint**: `GET /api/v1/admin/documents/:id`

**Bilgiler**:
- Doküman görüntüleme (preview)
- Provider bilgileri
- Doğrulama geçmişi
- Red sebebi (varsa)

### Doküman İşlemleri
- **Onaylama**: `POST /api/v1/admin/documents/:id/approve`
- **Reddetme**: `POST /api/v1/admin/documents/:id/reject` (sebep gerekli)
- **Doküman İndirme**: `GET /api/v1/admin/documents/:id/download`

---

## ⚙️ İptal ve Ceza Politikası Yönetimi

### İptal Politikası Ayarları
**MVP Feature - İptal ve Ceza Politikası**

**Endpoint**: `GET /api/v1/admin/settings/cancellation-policy`

**Özellikler**:
- İptal kuralları yapılandırması
- Zaman bazlı ceza kuralları
- Ceza oranları
- İstisna durumları

**Yönetim Ekranı**:
- Customer iptal kuralları:
  - X saat kala iptal → ceza yüzdesi
  - Son dakika iptal → ceza yüzdesi
- Provider iptal kuralları:
  - Kabul edip gelmeme → puan düşüşü
  - Görünürlük düşüşü
  - Ceza tutarı

**İşlemler**:
- `GET /api/v1/admin/settings/cancellation-policy` - Kuralları görüntüle
- `PUT /api/v1/admin/settings/cancellation-policy` - Kuralları güncelle

### İptal Geçmişi
**Endpoint**: `GET /api/v1/admin/cancellations`

**Özellikler**:
- İptal edilen talepler listesi
- İptal eden (Customer/Provider)
- İptal sebebi
- Uygulanan ceza
- Filtreleme ve arama

---

## ✅ Hizmet Tamamlama ve Onay Akışı

### Tamamlama Bekleyen Talepler
**MVP Feature - Hizmet Tamamlama ve Onay Akışı**

**Endpoint**: `GET /api/v1/admin/service-requests?status=ACCEPTED&paymentStatus=COMPLETED`

**Özellikler**:
- Provider tarafından tamamlandı işaretlenen talepler
- Customer onayı bekleyen talepler
- İtiraz edilen talepler

### Onay/İtiraz Yönetimi
**Admin Panel Özellikleri**:
- Tamamlama bekleyen talepler listesi
- İtiraz edilen talepler listesi
- İtiraz detayları görüntüleme
- İtiraz çözümleme:
  - Customer lehine karar → iade
  - Provider lehine karar → ödeme serbest bırakma
  - Kısmi çözüm → kısmi iade

**İşlemler**:
- `GET /api/v1/admin/service-requests/pending-completion` - Onay bekleyenler
- `GET /api/v1/admin/service-requests/disputed` - İtiraz edilenler
- `POST /api/v1/admin/service-requests/:id/resolve-dispute` - İtiraz çözümleme
- `POST /api/v1/admin/service-requests/:id/force-complete` - Zorunlu tamamlama (moderasyon)

---

## 📊 Raporlama ve Analitik

### Raporlar
1. **Provider Raporları**
   - En çok hizmet veren provider'lar
   - En yüksek puanlı provider'lar
   - En çok kazanan provider'lar
   - Provider performans analizi

2. **Customer Raporları**
   - En aktif customer'lar
   - En çok hizmet alan customer'lar
   - Customer segmentasyonu

3. **Gelir Raporları**
   - Günlük/aylık/yıllık gelir
   - Komisyon geliri
   - Ödeme durumu raporu
   - Gelir trend analizi

4. **Hizmet Talebi Raporları**
   - Talep trendi
   - Durum dağılımı
   - İptal oranları
   - Tamamlama oranları

5. **Operasyonel Raporlar**
   - Ortalama yanıt süresi
   - Ortalama tamamlama süresi
   - İtiraz oranları
   - Doküman doğrulama süreleri

### Export Özellikleri
- Excel export
- PDF export
- CSV export
- Tarih aralığı seçimi

---

## ⚙️ Sistem Ayarları

### Genel Ayarlar
- Platform komisyon oranı
- Minimum ödeme tutarı
- Ödeme periyodu ayarları
- Skor sistemi ayarları

### Bildirim Ayarları
- Email bildirimleri
- SMS bildirimleri
- Push bildirimleri

### Güvenlik Ayarları
- Session timeout
- Password policy
- 2FA ayarları

### İçerik Yönetimi
- Hizmet türleri yönetimi
- Kategori yönetimi
- Banner/slider yönetimi

---

## 🔍 Arama ve Filtreleme

### Global Arama
- Provider arama
- Customer arama
- Hizmet talebi arama
- Ödeme arama

### Gelişmiş Filtreleme
- Çoklu kriter filtreleme
- Tarih aralığı seçimi
- Durum bazlı filtreleme
- Kaydetme ve paylaşma (filter presets)

---

## 📱 Responsive Design

- Desktop-first yaklaşım
- Tablet uyumluluğu
- Mobile responsive (temel işlemler için)
- Touch-friendly interface

---

## 🔒 Güvenlik ve Yetkilendirme

### Role-Based Access Control (RBAC)
- Route-level protection
- Component-level protection
- API call authorization
- Action-level permissions

### Audit Log
- Tüm admin işlemleri loglanacak
- Kim, ne zaman, ne yaptı
- Değişiklik geçmişi
- Rollback özelliği (kritik işlemler için)

---

## 🚀 Geliştirme Fazları

### Faz 1: Temel Altyapı (1-2 hafta)
**Hedef**: Proje kurulumu ve temel yapı

**Görevler**:
- [ ] Proje kurulumu (Vite + React + TypeScript)
- [ ] UI framework kurulumu (shadcn/ui + Tailwind)
- [ ] Routing yapısı
- [ ] Authentication altyapısı
- [ ] API client kurulumu
- [ ] State management kurulumu (Zustand + TanStack Query)
- [ ] Temel layout (Sidebar, Header)
- [ ] Login sayfası

**Deliverables**:
- Çalışan login/logout
- Temel layout
- API bağlantısı

---

### Faz 2: Dashboard ve Provider Yönetimi (2-3 hafta)
**Hedef**: Dashboard ve provider yönetim modülü

**Görevler**:
- [ ] Dashboard sayfası
  - [ ] KPI cards
  - [ ] Grafikler
  - [ ] Son aktiviteler
- [ ] Provider listesi
  - [ ] Tablo component
  - [ ] Filtreleme
  - [ ] Pagination
- [ ] Provider detay sayfası
  - [ ] Sekmeler
  - [ ] Bilgi görüntüleme
- [ ] Provider işlemleri
  - [ ] Onaylama
  - [ ] Reddetme
  - [ ] Askıya alma

**Deliverables**:
- Çalışan dashboard
- Provider CRUD işlemleri
- Provider onay/red işlemleri

---

### Faz 3: Customer ve Hizmet Talebi Yönetimi (2-3 hafta)
**Hedef**: Customer ve service request yönetimi

**Görevler**:
- [ ] Customer listesi
- [ ] Customer detay sayfası
- [ ] Customer işlemleri
- [ ] Hizmet talebi listesi
- [ ] Hizmet talebi detay sayfası
- [ ] State machine görselleştirme
- [ ] Durum değiştirme işlemleri

**Deliverables**:
- Customer yönetimi
- Hizmet talebi yönetimi
- State machine yönetimi

---

### Faz 4: Ödeme ve Doküman Yönetimi (2 hafta)
**Hedef**: Payment ve document yönetimi

**Görevler**:
- [ ] Provider ödeme listesi
- [ ] Ödeme detay ve işleme
- [ ] Customer ödeme listesi
- [ ] Bakiye yönetimi
- [ ] Doküman listesi
- [ ] Doküman onay/red işlemleri
- [ ] Doküman preview

**Deliverables**:
- Ödeme yönetimi
- Doküman yönetimi
- Bakiye takibi

---

### Faz 5: MVP Feature Yönetimi (2-3 hafta)
**Hedef**: MVP için geliştirilecek featureların admin panel entegrasyonu

**Görevler**:
- [ ] İptal ve ceza politikası yönetimi
  - [ ] Kurallar yapılandırma ekranı
  - [ ] İptal geçmişi
- [ ] Hizmet tamamlama ve onay akışı
  - [ ] Onay bekleyen talepler
  - [ ] İtiraz yönetimi
  - [ ] İtiraz çözümleme
- [ ] State machine geliştirmeleri
  - [ ] Durum geçiş logları
  - [ ] Durum geçiş diyagramı

**Deliverables**:
- İptal politikası yönetimi
- Onay akışı yönetimi
- Gelişmiş state machine yönetimi

---

### Faz 6: Raporlama ve Ayarlar (2 hafta)
**Hedef**: Raporlama ve sistem ayarları

**Görevler**:
- [ ] Rapor sayfaları
  - [ ] Provider raporları
  - [ ] Customer raporları
  - [ ] Gelir raporları
  - [ ] Operasyonel raporlar
- [ ] Grafik ve chart'lar
- [ ] Export özellikleri
- [ ] Sistem ayarları sayfası
- [ ] Audit log görüntüleme

**Deliverables**:
- Raporlama modülü
- Sistem ayarları
- Export özellikleri

---

### Faz 7: Polish ve Optimizasyon (1-2 hafta)
**Hedef**: Son dokunuşlar ve optimizasyon

**Görevler**:
- [ ] Performance optimizasyonu
- [ ] Error handling iyileştirmeleri
- [ ] Loading states
- [ ] Toast notifications
- [ ] Responsive design iyileştirmeleri
- [ ] Accessibility iyileştirmeleri
- [ ] Code review ve refactoring
- [ ] Testing (opsiyonel)

**Deliverables**:
- Production-ready admin panel
- Optimize edilmiş performans
- İyileştirilmiş UX

---

## 🔌 Backend API Gereksinimleri

### Yeni Endpoint'ler Gerekli

#### Admin Authentication
- `POST /api/v1/admin/auth/login` - Admin girişi
- `POST /api/v1/admin/auth/logout` - Admin çıkışı
- `GET /api/v1/admin/auth/me` - Mevcut admin bilgisi

#### Provider Yönetimi
- `GET /api/v1/admin/providers` - Provider listesi (filtreleme, pagination)
- `GET /api/v1/admin/providers/:id` - Provider detay
- `PUT /api/v1/admin/providers/:id` - Provider düzenleme
- `POST /api/v1/admin/providers/:id/approve` - Provider onaylama
- `POST /api/v1/admin/providers/:id/reject` - Provider reddetme
- `POST /api/v1/admin/providers/:id/suspend` - Provider askıya alma
- `POST /api/v1/admin/providers/:id/unsuspend` - Askıdan kaldırma
- `PUT /api/v1/admin/providers/:id/score` - Skor düzenleme

#### Customer Yönetimi
- `GET /api/v1/admin/customers` - Customer listesi
- `GET /api/v1/admin/customers/:id` - Customer detay
- `PUT /api/v1/admin/customers/:id` - Customer düzenleme
- `POST /api/v1/admin/customers/:id/suspend` - Customer askıya alma
- `POST /api/v1/admin/customers/:id/unsuspend` - Askıdan kaldırma

#### Hizmet Talebi Yönetimi
- `GET /api/v1/admin/service-requests` - Talep listesi
- `GET /api/v1/admin/service-requests/:id` - Talep detay
- `PUT /api/v1/admin/service-requests/:id/status` - Durum değiştirme
- `POST /api/v1/admin/service-requests/:id/cancel` - İptal etme
- `POST /api/v1/admin/service-requests/:id/complete` - Manuel tamamlama
- `GET /api/v1/admin/service-requests/pending-completion` - Onay bekleyenler
- `GET /api/v1/admin/service-requests/disputed` - İtiraz edilenler
- `POST /api/v1/admin/service-requests/:id/resolve-dispute` - İtiraz çözümleme
- `GET /api/v1/admin/service-requests/:id/status-history` - Durum geçmişi

#### Ödeme Yönetimi
- `GET /api/v1/admin/payments` - Provider ödeme listesi
- `GET /api/v1/admin/payments/:id` - Ödeme detay
- `POST /api/v1/admin/payments/:id/process` - Ödeme işleme
- `POST /api/v1/admin/payments/:id/cancel` - Ödeme iptal
- `GET /api/v1/admin/payments/:id/invoice` - Fatura
- `GET /api/v1/admin/customer-payments` - Customer ödeme listesi
- `GET /api/v1/admin/providers/:id/balance` - Provider bakiye

#### Doküman Yönetimi
- `GET /api/v1/admin/documents` - Doküman listesi
- `GET /api/v1/admin/documents/:id` - Doküman detay
- `POST /api/v1/admin/documents/:id/approve` - Doküman onaylama
- `POST /api/v1/admin/documents/:id/reject` - Doküman reddetme
- `GET /api/v1/admin/documents/:id/download` - Doküman indirme

#### İptal ve Ceza Politikası
- `GET /api/v1/admin/settings/cancellation-policy` - Kuralları görüntüle
- `PUT /api/v1/admin/settings/cancellation-policy` - Kuralları güncelle
- `GET /api/v1/admin/cancellations` - İptal geçmişi

#### Dashboard ve İstatistikler
- `GET /api/v1/admin/dashboard/stats` - Genel istatistikler
- `GET /api/v1/admin/dashboard/charts` - Grafik verileri
- `GET /api/v1/admin/dashboard/activities` - Son aktiviteler

#### Raporlama
- `GET /api/v1/admin/reports/providers` - Provider raporları
- `GET /api/v1/admin/reports/customers` - Customer raporları
- `GET /api/v1/admin/reports/revenue` - Gelir raporları
- `GET /api/v1/admin/reports/service-requests` - Talep raporları
- `GET /api/v1/admin/reports/operational` - Operasyonel raporlar

#### Sistem Ayarları
- `GET /api/v1/admin/settings` - Ayarları görüntüle
- `PUT /api/v1/admin/settings` - Ayarları güncelle

#### Audit Log
- `GET /api/v1/admin/audit-logs` - Audit log listesi
- `GET /api/v1/admin/audit-logs/:id` - Audit log detay

---

## 📝 Notlar ve Önemli Noktalar

### MVP Sınırları
1. **State Machine**: Geri alma yok, manuel müdahale sadece moderasyonda
2. **Ödeme**: Tek ödeme yöntemi yeterli, iade otomatik değil manuel
3. **İptal Politikası**: Sabit kurallar, esnek konfigürasyon yok
4. **Onay Akışı**: Otomatik onay yok, itiraz manuel moderasyona düşer

### Güvenlik
- Tüm admin endpoint'leri JWT token ile korunmalı
- Role-based access control (RBAC) uygulanmalı
- Sensitive data masking (ör. telefon numaraları)
- Rate limiting
- CSRF protection

### Performance
- Pagination tüm listelerde zorunlu
- Lazy loading
- Image optimization
- API response caching (TanStack Query)
- Debouncing search inputs

### UX Best Practices
- Loading states
- Error states
- Empty states
- Toast notifications
- Confirmation dialogs (kritik işlemler için)
- Keyboard shortcuts
- Breadcrumbs

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus management

---

## 📚 Referanslar ve Kaynaklar

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)

---

## ✅ Checklist

### Proje Kurulumu
- [ ] Vite + React + TypeScript projesi oluşturuldu
- [ ] shadcn/ui kuruldu
- [ ] Tailwind CSS yapılandırıldı
- [ ] Routing yapısı kuruldu
- [ ] API client yapılandırıldı
- [ ] State management kuruldu
- [ ] Authentication altyapısı hazır

### Backend Entegrasyonu
- [ ] Admin authentication endpoint'leri hazır
- [ ] Tüm admin endpoint'leri implement edildi
- [ ] RBAC backend'de uygulandı
- [ ] Audit log sistemi hazır

### Development
- [ ] Dashboard implement edildi
- [ ] Provider yönetimi tamamlandı
- [ ] Customer yönetimi tamamlandı
- [ ] Hizmet talebi yönetimi tamamlandı
- [ ] Ödeme yönetimi tamamlandı
- [ ] Doküman yönetimi tamamlandı
- [ ] MVP feature yönetimi tamamlandı
- [ ] Raporlama modülü tamamlandı
- [ ] Sistem ayarları tamamlandı

### Testing & QA
- [ ] Unit testler yazıldı (opsiyonel)
- [ ] Integration testler yazıldı (opsiyonel)
- [ ] Manual testing yapıldı
- [ ] Cross-browser testing yapıldı
- [ ] Responsive design test edildi
- [ ] Accessibility test edildi

### Deployment
- [ ] Production build hazır
- [ ] Environment variables yapılandırıldı
- [ ] CI/CD pipeline kuruldu (opsiyonel)
- [ ] Deployment yapıldı

---

**Toplam Tahmini Süre**: 12-18 hafta (3-4.5 ay)

**Not**: Bu süre, tek bir geliştirici için tahminidir. Ekip çalışması ile süre kısaltılabilir.
