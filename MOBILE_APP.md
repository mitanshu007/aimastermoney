# Welth Mobile App

This folder is not required for the web deployment. The Capacitor configuration at the repository root packages the existing Welth web app as an iOS/Android application while keeping the same Next.js + Clerk + Supabase + Gemini backend.

## App identity

- App name: Welth
- Bundle/application ID: `com.mitanshu.welth`
- Web URL: https://aimastermoney-hvdj.vercel.app

## First-time setup

From the repository root:

```bash
npm run mobile:init
```

This installs Capacitor 8 and generates the `ios/` and `android/` projects.

Then:

```bash
npm run mobile:sync
npm run mobile:ios
# or
npm run mobile:android
```

## Important

The current mobile wrapper loads the deployed Welth app, so server-side Next.js features, Clerk authentication, Prisma/Supabase access, and the Finance AI remain on the existing backend.

Before App Store submission, add native app features such as the receipt camera, push/local notifications, and biometric app unlock. These can be added with Capacitor plugins without rebuilding the finance backend.

For iOS distribution, the generated project must be opened in Xcode on macOS and signed with the Apple Developer account. For Android, open the generated project in Android Studio and create a signed release build.

Do not put production API keys in the mobile project. Keep secrets in the existing Vercel environment variables.
