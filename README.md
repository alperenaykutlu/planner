# Günlük Planlayıcı

Görev yönetimi, hatırlatıcı bildirimleri ve takvim görünümü sunan, React tabanlı istemci taraflı bir üretkenlik uygulaması.

---

## İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Özellikler](#özellikler)
3. [Teknoloji Yığını](#teknoloji-yığını)
4. [Kurulum ve Çalıştırma](#kurulum-ve-çalıştırma)
5. [Proje Yapısı](#proje-yapısı)
6. [Mimari](#mimari)
7. [Veri Modeli](#veri-modeli)
8. [Durum Sistemi](#durum-sistemi)
9. [Hatırlatıcı Mekanizması](#hatırlatıcı-mekanizması)
10. [Resmi Tatil Entegrasyonu](#resmi-tatil-entegrasyonu)
11. [Depolama Katmanı](#depolama-katmanı)

---

## Genel Bakış

Bu uygulama, herhangi bir sunucu altyapısına ihtiyaç duymaksızın tamamen tarayıcı ortamında çalışacak biçimde tasarlanmıştır. Veriler `localStorage` üzerinde versiyonlu bir JSON yapısıyla kalıcı olarak saklanmakta; arka plan bildirimleri ise ana iş parçacığını bloke etmemek adına bir **Web Worker** aracılığıyla işlenmektedir.

---

## Özellikler

- Görev oluşturma, düzenleme ve silme
- Dört aşamalı durum yönetimi: *Yapılacak, Beklemede, Yapılıyor, Yapıldı, İptal, Özel Tatil*
- Durum ve tarihe göre filtreleme ve sıralama
- Tarih/saat bazlı hatırlatıcı bildirimleri (Web Notifications API)
- Aylık takvim görünümü; görevler gün hücrelerinde renkli nokta olarak gösterilir
- Resmi ve dini tatillerin takvimde otomatik işaretlenmesi — görev listesini etkilemez
- Tüm veriler tarayıcıda yerel olarak tutulur; internet bağlantısı gerekmez

---

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Arayüz | React 18 |
| Derleme Aracı | Vite |
| Stil | Saf CSS — CSS Custom Properties, Glassmorphism |
| Tipografi | Inter (Google Fonts) |
| Kalıcı Depolama | Web Storage API (localStorage) |
| Arka Plan İşlemi | Web Worker API |
| Bildirimler | Web Notifications API |

---

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 18 veya üzeri
- npm 9 veya üzeri

### Geliştirme Ortamı

```bash
npm install
npm run dev
```

### Üretim Derlemesi

```bash
npm run build
```

Derleme çıktısı `dist/` dizinine yazılır.

### Geliştirme Ortamı Gerektirmeyen Çalıştırma

`dist/` derlemesi alındıktan sonra proje kök dizininde `ac.bat` dosyası oluşturularak uygulamaya doğrudan çift tıklama ile erişilebilir:

```bat
@echo off
cd /d "%~dp0"
npx serve dist
```

Uygulama `http://localhost:3000` adresinde sunulur.

> Kod değişikliği yapıldığında yalnızca `npm run build` komutunun yeniden çalıştırılması yeterlidir.

---

## Proje Yapısı

```
src/
├── backend/
│   ├── adapters/
│   │   └── localStorageAdapter.js       # Web Storage API soyutlama katmanı
│   ├── hooks/
│   │   ├── useLocalStorage.js           # localStorage üzerinde reaktif state yönetimi
│   │   ├── useNotifications.js          # Web Worker yaşam döngüsü ve bildirim koordinasyonu
│   │   └── useTasks.js                  # Görev CRUD operasyonları
│   ├── Repository/
│   │   └── storageRepository.js         # Görev varlıklarına ait veri erişim katmanı
│   ├── services/
│   │   ├── notification.js              # Tarayıcı bildirim izni ve gönderim servisi
│   │   └── storage.js                   # Versiyonlu JSON serileştirme servisi
│   ├── shared/
│   │   ├── enum/

│   │   │   └── holiday.js  
│   │   │   └── list.js                  # Durum sabitleri ve etiket/renk eşlemeleri
│   │   └── holidays.js                  # Sabit ve değişken tarihli tatil verileri
│   ├── util/
│   │   └── dateHelper.js
│   └── worker/
│       └── reminderWorker.js            # 30 saniyelik aralıklarla çalışan hatırlatıcı Worker
│
├── components/
│   ├── CalendarGrid.jsx                 # Aylık takvim ızgarası
│   ├── StatusFilter.jsx                 # Durum bazlı filtre çubuğu
│   ├── TabView.jsx                      # Liste / Takvim sekme bileşeni
│   ├── TaskCard.jsx                     # Tek görev kart bileşeni
│   ├── TaskForm.jsx                     # Görev oluşturma ve düzenleme formu
│   └── TaskList.jsx                     # Sıralanabilir görev listesi
│
├── App.jsx                              # Kök bileşen; genel durum yönetimi
├── main.jsx                             # Uygulama giriş noktası
└── index.css                            # Global stiller ve CSS değişkenleri
```

---

## Mimari

### Veri Akışı

```
Bileşen Katmanı
    └── useTasks (React Hook)
          ├── useLocalStorage
          │     └── StorageService          ← Versiyonlu serileştirme
          │           └── LocalStorageAdapter
          └── TaskRepository               ← CRUD, UUID üretimi
```

### Bağımlılık Grafiği

```
App.jsx
 ├── useTasks ──────────────── useLocalStorage ── StorageService ── LocalStorageAdapter
 ├── useNotifications ──────── reminderWorker.js (Web Worker)
 │                    └─────── notificationService
 ├── StatusFilter
 ├── TabView
 │    ├── TaskList ── TaskCard
 │    └── CalendarGrid
 └── TaskForm
```

---

## Veri Modeli

```typescript
interface Task {
  id:           string;    // crypto.randomUUID() ile üretilir
  title:        string;    // Zorunlu alan
  description?: string;    // İsteğe bağlı
  status:       Status;    // Aşağıdaki durum tablosuna bakınız
  dueDate?:     string;    // ISO 8601 biçiminde tarih/saat (null olabilir)
  remindBefore: number;    // Bildirim için dakika cinsinden önceki süre (0 = tam zamanında)
  reminded:     boolean;   // Bildirimin daha önce gönderilip gönderilmediği
  createdAt:    string;    // ISO 8601 — kayıt zamanı
}
```

---

## Durum Sistemi

| Sabit | Değer | Etiket | Renk |
|---|---|---|---|
| `STATUS.TODO` | `yapılacak` | Yapılacak | `#3b82f6` |
| `STATUS.WAITING` | `beklemede` | Beklemede | `#f59e0b` |
| `STATUS.DONE` | `yapıldı` | Yapıldı | `#10b981` |
| `STATUS.CANCELLED` | `iptal` | İptal | `#6b7280` |

Sabitler, etiketler ve renkler `src/backend/shared/enum/list.js` dosyasından merkezi olarak yönetilmektedir.

---

## Hatırlatıcı Mekanizması

Hatırlatıcı sistemi, ana React iş parçacığını bloke etmemek amacıyla bir **Web Worker** (`reminderWorker.js`) üzerinde çalışır.

```
useNotifications
  │
  ├── Worker başlatılır (bir kez, useEffect ile)
  ├── tasks dizisi her değiştiğinde Worker'a iletilir → { type: 'SYNC_TASKS' }
  │
  └── reminderWorker.js
        └── setInterval (30 saniye)
              └── Her görev için:
                    fireAt = dueDate − remindBefore (ms)
                    |now − fireAt| < 30 000 ms ise → postMessage({ type: 'REMIND' })
                          └── notificationService.send()  →  Tarayıcı bildirimi
                          └── taskRepository.markReminded(id)  →  Tekrar tetiklenmez
```

> Tarayıcı bildirim izninin kullanıcı tarafından verilmesi gerekmektedir. İzin reddedilirse hatırlatıcılar sessizce atlanır; görev verisi etkilenmez.

---

## Resmi Tatil Entegrasyonu

Tatiller görev veri modelinden **bağımsızdır**; görev listesine eklenmez, yalnızca takvim görünümünde ilgili gün hücresinde gösterilir.

`src/backend/shared/holidays.js` dosyası iki veri kaynağı barındırır:

| Dizi | Format | Kullanım Amacı |
|---|---|---|
| `HOLIDAYS` | `MM-DD` | Sabit tarihli millî gün ve bayramlar |
| `HOLIDAYS_VARIABLE` | `YYYY-MM-DD` | Yıla göre değişen dini bayramlar |

**Yeni bir tatil eklemek için** ilgili diziye tek satır eklenmesi yeterlidir:

```js
// Sabit tarihli
{ date: '05-01', name: 'Emek ve Dayanışma Günü' }

// Değişken tarihli
{ date: '2027-03-10', name: 'Ramazan Bayramı' }
```

---

## Depolama Katmanı

Veriler `localStorage`'a `plan::<key>` ön ekiyle versiyonlu JSON olarak yazılır:

```json
{
  "v": 1,
  "data": [ ...görev nesneleri ]
}
```

`StorageService` yapılandırıcısına geçilen `version` değeri değiştirildiğinde, mevcut depolama anahtarı geçersiz sayılır ve ilk erişimde otomatik olarak temizlenir. Bu mekanizma, veri şeması güncellemelerinde bozuk verinin okunmasını engeller.
