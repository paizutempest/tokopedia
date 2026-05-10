# 🛒 Tokopedia Auto-Registrar (Deep Ocean Protocol v1.1)

<p align="center">
  <img src="https://img.shields.io/badge/Release-May_2026-brightgreen?style=for-the-badge" alt="Release">
  <img src="https://img.shields.io/badge/Security-Playwright_Stealth-red?style=for-the-badge" alt="Stealth">
  <img src="https://img.shields.io/badge/Platform-iOS_Emulator_Spoof-blue?style=for-the-badge" alt="iOS">
</p>

---

### 🌊 Overview
Project **Tokopedia Auto System** ini adalah tool automasi tingkat tinggi yang dirancang untuk registrasi akun massal. Script ini menggunakan metode **GQL (GraphQL) Sniffing** dengan spoofing perangkat iOS untuk meminimalisir deteksi sistem keamanan Tokopedia terbaru di tahun 2026.

### 🛠️ Fitur "Deep Ocean"
* ✅ **Dynamic Identity**: Generate sidik jari perangkat (Device Fingerprint) iOS secara acak tiap kali registrasi untuk menghindari ban IP/Device.
* ✅ **Siluman Inbox Tracker**: Menggunakan **Playwright Stealth** untuk memantau inbox email secara real-time dan mengambil kode OTP secara otomatis.
* ✅ **Auto Name Scraper**: Mengambil database nama asli Indonesia secara acak dari web agar akun terlihat seperti user asli (bukan bot).
* ✅ **GQL Injection**: Melakukan registrasi langsung ke endpoint GraphQL Tokopedia dengan header yang sudah di-optimize.
* ✅ **Multi-Threading Ready**: Struktur kode yang solid dan mendukung eksekusi cepat.

### 📦 Tech Stack
* **Runtime**: Node.js
* **Automation**: Playwright-Extra & Stealth Plugin
* **Network**: Axios v1.6.0
* **Security**: Crypto & UUID v4

### 🚀 Cara Instalasi

1. **Clone Repo**
2. **Install Dependensi**:
   ```bash
   npm install
