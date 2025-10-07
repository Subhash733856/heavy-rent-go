# Production Deployment Checklist for HeavyRent App

## ✅ Pre-Deployment Configuration

### 1. Razorpay Configuration
- [ ] Replace test key with live key in `src/config/razorpay.ts`
  - Get your live key from: https://dashboard.razorpay.com/app/keys
  - Set `IS_PRODUCTION: true`
- [ ] Update Razorpay secret in Supabase Edge Functions
  - Add live `RAZORPAY_KEY_SECRET` in Supabase dashboard

### 2. Capacitor Configuration
- [ ] Open `capacitor.config.ts`
- [ ] Comment out the entire `server` section before building for production:
```typescript
// server: {
//   url: 'https://695bfd70-63ca-422d-8123-9dae40fae916.lovableproject.com?forceHideBadge=true',
//   cleartext: true
// },
```

### 3. Supabase Configuration
- [ ] Verify all RLS policies are enabled
- [ ] Test authentication flows
- [ ] Ensure all Edge Functions are deployed
- [ ] Add production URLs to Supabase Auth redirect URLs:
  - https://yourdomain.com
  - https://yourapp.page.link (for deep linking)

### 4. Test User Accounts
- [ ] Create test operator account
- [ ] Create test client account
- [ ] Test complete booking flow
- [ ] Verify payment processing
- [ ] Check dashboard functionality

## 📱 Local Setup & Testing

### Initial Setup
```bash
# 1. Export project to GitHub (click button in Lovable)
# 2. Clone your repository
git clone <your-repo-url>
cd heavy-rent-go

# 3. Install dependencies
npm install

# 4. Add Android platform
npx cap add android

# 5. Update native dependencies
npx cap update android

# 6. Build the web assets
npm run build

# 7. Sync to native platform
npx cap sync
```

### Testing on Device/Emulator
```bash
# Run on Android
npx cap run android

# Or open in Android Studio
npx cap open android
```

## 🎨 App Assets (Required for Play Store)

### App Icons
Create icons in these sizes and place in `android/app/src/main/res/`:
- [ ] `mipmap-mdpi/ic_launcher.png` (48x48)
- [ ] `mipmap-hdpi/ic_launcher.png` (72x72)
- [ ] `mipmap-xhdpi/ic_launcher.png` (96x96)
- [ ] `mipmap-xxhdpi/ic_launcher.png` (144x144)
- [ ] `mipmap-xxxhdpi/ic_launcher.png` (192x192)

### Splash Screen
- [ ] Update splash screen in `android/app/src/main/res/drawable/`

### Feature Graphic
- [ ] Create 1024x500 feature graphic for Play Store listing

### Screenshots
Take screenshots for Play Store (minimum 2 required):
- [ ] Phone screenshots (1080x1920 or 1080x2340)
- [ ] Tablet screenshots (optional but recommended)

## 🔐 Security Checklist

- [ ] All API keys moved to environment variables or Supabase secrets
- [ ] RLS policies tested and verified
- [ ] Test accounts cannot access production data
- [ ] HTTPS enforced for all API calls
- [ ] Input validation on all forms

## 🏗️ Build for Production

### Generate Signed APK/Bundle
1. Open `android/` folder in Android Studio
2. Build → Generate Signed Bundle / APK
3. Choose "Android App Bundle" (recommended for Play Store)
4. Create or select existing keystore
5. Fill in keystore details:
   - Key alias
   - Passwords
   - Validity: 25+ years
6. **IMPORTANT:** Save keystore file securely - you'll need it for all future updates!

### Build Output
- [ ] Signed AAB file generated successfully
- [ ] Test AAB on device before submitting

## 📤 Google Play Console Setup

### Account Setup
- [ ] Create Google Play Console account ($25 one-time fee)
- [ ] Complete account verification
- [ ] Set up merchant account (for paid apps)

### App Listing
- [ ] App title: "HeavyRent - Equipment Booking"
- [ ] Short description (80 chars max)
- [ ] Full description (4000 chars max)
- [ ] Upload screenshots (2-8 required)
- [ ] Upload feature graphic (1024x500)
- [ ] Select app category: Business
- [ ] Set content rating (complete questionnaire)
- [ ] Add privacy policy URL
- [ ] Set up pricing & distribution

### Store Listing Content
```
Title: HeavyRent - Heavy Equipment Rental

Short Description:
Book heavy equipment instantly. Excavators, cranes, and construction machinery.

Full Description:
HeavyRent connects construction companies with heavy equipment operators. Book excavators, cranes, bulldozers, and more with real-time availability and secure payments.

Features:
✓ Real-time equipment availability
✓ Secure payment processing with Razorpay
✓ GPS-based equipment location
✓ Operator ratings and reviews
✓ 24/7 emergency support
✓ Detailed booking management

For Operators:
• List your equipment
• Manage bookings
• Track revenue
• Build your reputation

For Clients:
• Browse equipment nearby
• Instant booking confirmation
• Track your projects
• Manage expenses
```

## 🚀 Submission Checklist

- [ ] App tested on multiple devices
- [ ] All features working correctly
- [ ] Payment flow tested end-to-end
- [ ] Privacy policy published and linked
- [ ] App bundle uploaded to Play Console
- [ ] Store listing completed with all assets
- [ ] Content rating completed
- [ ] Pricing & distribution set
- [ ] Review and submit for publication

## 📊 Post-Launch

- [ ] Monitor crash reports in Play Console
- [ ] Check user reviews and ratings
- [ ] Track analytics (consider adding Firebase Analytics)
- [ ] Plan feature updates
- [ ] Respond to user feedback

## 🔄 For Future Updates

Whenever you update your app:
1. Increment version number in `android/app/build.gradle`
2. Build new signed bundle with the SAME keystore
3. Upload to Play Console as update
4. Provide release notes
5. Submit for review

## 📞 Support Resources

- Capacitor Docs: https://capacitorjs.com/docs
- Android Developer Guide: https://developer.android.com/studio/publish
- Google Play Console: https://play.google.com/console
- Razorpay Dashboard: https://dashboard.razorpay.com

## ⚠️ Important Notes

1. **Never lose your keystore file!** Without it, you cannot update your app.
2. Test payment flow in production mode before launch
3. Set up crash reporting (Firebase Crashlytics recommended)
4. Plan for app maintenance and updates
5. Monitor Supabase usage and upgrade plan if needed

---

**Ready to Launch?** Double-check all items above before submitting!
