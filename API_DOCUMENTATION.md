# BikinSurat API Documentation

## Base URL

- Local: `http://localhost:8000/api`

## Response Format

Semua endpoint utama menggunakan format:

```json
{
  "code": 200,
  "status": "Success",
  "data": {}
}
```

Untuk error:

```json
{
  "code": 400,
  "status": "Failed",
  "data": "error message"
}
```

## Authentication

- Gunakan header berikut untuk endpoint protected:
- `Authorization: Bearer <accessToken>`

---

## 1) Auth

### POST `/auth/register`
Register user baru.

Body:

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### POST `/auth/login`
Login user.

Body:

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

### GET `/auth/me`
Ambil profil user dari token login.

### POST `/auth/forgot-password`
Generate token reset password.

Body:

```json
{
  "email": "john@example.com"
}
```

### POST `/auth/reset-password`
Reset password menggunakan token.

Body:

```json
{
  "token": "reset_token_from_forgot_password",
  "new_password": "newsecret123"
}
```

---

## 2) User (Protected)

### PUT `/user/profile`
Update profil user yang sedang login.

Body:

```json
{
  "full_name": "John Updated",
  "avatar_url": "https://cdn.example.com/avatar.jpg"
}
```

### GET `/user/list` (ADMIN)
List semua user.

### GET `/user/:id` (ADMIN)
Detail user berdasarkan id.

### DELETE `/user/:id` (ADMIN)
Hapus user berdasarkan id.

---

## 3) Organization (Protected)

### POST `/organizations`
Buat organisasi milik user login.

Body:

```json
{
  "name": "PT Bikin Surat",
  "address": "Jakarta",
  "logo_url": "https://cdn.example.com/logo.png"
}
```

### GET `/organizations`
List organisasi milik user login.

### GET `/organizations/:id`
Detail organisasi (owner-only).

### PUT `/organizations/:id`
Update organisasi (owner-only).

Body (parsial boleh):

```json
{
  "name": "PT Bikin Surat Indonesia",
  "address": "Bandung",
  "logo_url": "https://cdn.example.com/logo-new.png"
}
```

### DELETE `/organizations/:id`
Hapus organisasi (owner-only).

---

## 4) Subscription (Protected)

### GET `/subscription/plans`
Ambil katalog plan.

### GET `/subscription/current`
Ambil subscription aktif user saat ini.

### POST `/subscription/checkout`
Buat checkout subscription (Midtrans/mocked).

Body:

```json
{
  "plan_type": "PRO"
}
```

`plan_type` yang valid: `FREE`, `PRO`, `ENTERPRISE`.

### POST `/subscription/cancel`
Batalkan subscription user saat ini.

---

## 5) Payment Webhook (Public)

### POST `/payment/midtrans/webhook`
Endpoint callback Midtrans untuk update status transaksi/subscription.

Contoh body utama:

```json
{
  "order_id": "ORD-userid-123",
  "transaction_id": "midtrans-trx-id",
  "transaction_status": "settlement",
  "signature_key": "signature-from-midtrans",
  "status_code": "200",
  "gross_amount": "99000.00"
}
```

---

## 6) Document + AI (Protected)

### POST `/documents/questions`
Generate daftar pertanyaan berdasarkan tipe surat.

Body:

```json
{
  "document_type": "izin sakit",
  "template": "optional template text"
}
```

### POST `/documents/generate`
Generate draft surat via AI lalu simpan ke history dokumen.

Body:

```json
{
  "document_type": "izin sakit",
  "organization_id": "optional-org-id",
  "answers": {
    "nama": "John Doe",
    "tanggal_mulai": "2026-04-15",
    "alasan": "Sakit"
  }
}
```

### GET `/documents/history`
Riwayat dokumen milik user login.

### GET `/documents/:id/export?format=pdf`
Export ulang dokumen.

Parameter query:
- `format`: `pdf` atau `docx`

---

## 7) Admin (Protected + ADMIN only)

### GET `/admin/stats`
Statistik dashboard admin.

### GET `/admin/users`
List seluruh user + status suspend.

### POST `/admin/users/:userId/suspend`
Suspend user.

### POST `/admin/users/:userId/activate`
Aktivasi ulang user.

### GET `/admin/transactions`
List transaksi. Optional query:
- `status=PENDING|COMPLETED|FAILED`

### POST `/admin/transactions/:transactionId/verify`
Manual verify transaksi (set completed + activate subscription).

### GET `/admin/templates`
List global template.

### POST `/admin/templates`
Buat global template.

Body:

```json
{
  "name": "Template Cuti Tahunan",
  "category": "cuti",
  "content": "Kepada Yth..."
}
```

### PUT `/admin/templates/:templateId`
Update global template (partial update).

### DELETE `/admin/templates/:templateId`
Hapus global template.

---

## Environment Variables (minimal)

- `DATABASE_URL`
- `JWT_SECRET` (opsional di development, wajib di production)
- `JWT_EXPIRES_IN` (opsional, default `1d`)
- `MIDTRANS_SERVER_KEY` (opsional, jika tidak ada checkout jadi mock)
- `MIDTRANS_IS_PRODUCTION` (`true`/`false`)
- `OPENAI_API_KEY` (opsional, jika tidak ada akan fallback template lokal)
- `OPENAI_BASE_URL` (opsional)
- `OPENAI_MODEL` (opsional)
