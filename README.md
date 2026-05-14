# Rider Companion 🏍️

A premium, high-performance mobile application designed for motorcycle enthusiasts and group riding communities. **Rider Companion** provides real-time convoy tracking, emergency SOS features, and comprehensive profile management with a sleek, HITCH-inspired dark aesthetic.

![Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen)
![React Native](https://img.shields.io/badge/React--Native-0.85.3-61DAFB?logo=react)
![Theme](https://img.shields.io/badge/Theme-Premium--Dark-A8FF00)

---

## ✨ Key Features

### 📡 Group Riding & Convoys
- **Real-time Live HUD**: Track all convoy members on a synchronized map with live speed and heading updates.
- **Dynamic Join/Create**: Quickly spin up a "Morning Ride" or join an existing convoy using a secure 6-digit invite code.
- **Launch Map**: Instantly switch between the ride room and a full-screen interactive live map.

### 🚨 Safety & Reliability
- **Instant SOS**: Broadcast an emergency alert to all convoy members with one tap.
- **Live Connection Sync**: Powered by Socket.IO for sub-second location updates and real-time member status.
- **Battery & Signal Optimization**: Throttled tracking logic to preserve device battery during long rides.

### 👤 Profile & Personalization
- **Modern Onboarding**: Seamless first-time experience to set up your name, bike model, and riding experience.
- **My Garage**: Track your collection of bikes (Coming Soon).
- **Safety Settings**: Manage emergency contacts and SOS preferences.
- **HITCH Aesthetic**: High-contrast Neon Green on Deep Slate background for maximum visibility during day or night rides.

---

## 🛠️ Tech Stack

- **Frontend**: React Native (0.85.3)
- **Navigation**: React Navigation (Stack & Drawer)
- **State Management**: Zustand (with Persist middleware)
- **API Handling**: TanStack React Query (v5) + Axios
- **Real-time**: Socket.IO-Client
- **Maps**: React Native Maps (Apple Maps/Google Maps)
- **Icons**: Lucide React Native
- **Storage**: MMKV (High-performance storage)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v22+)
- React Native Environment (Xcode for iOS / Android Studio for Android)
- [Rider App Backend](https://github.com/ameaympande/Rider-app-backend) running locally or hosted.

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:ameaympande/Rider-app.git
   cd Rider-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS Pods**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Configure API**
   Edit `src/constants/config.ts` to point to your backend URL:
   ```typescript
   export const appConfig = {
     apiBaseUrl: 'http://localhost:3000', // Update for physical devices
     socketUrl: 'http://localhost:3000',
   };
   ```

5. **Run the App**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android
   ```

---

## 📁 Project Structure

```
src/
├── components/     # Reusable UI (Buttons, Cards, Layouts)
├── constants/      # App-wide configurations
├── hooks/          # Custom React hooks (useTracking, etc.)
├── maps/           # Specialized Map components
├── navigation/     # Stack & Drawer navigators
├── screens/        # Full-page screens (Auth, Home, Ride)
├── services/       # API and Socket clients
├── store/          # Zustand state stores
├── theme/          # HITCH design tokens (Colors, Spacing)
└── types/          # TypeScript interfaces
```

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License.

---

**Built with ❤️ for the Riding Community.**
