# 🧪 Complete User Flow Testing Guide

## Overview
This document provides a comprehensive testing checklist for the HeavyRent equipment rental platform before production launch.

---

## ✅ Testing Checklist

### 1. User Authentication Flow

#### **Client Signup & Login**
- [ ] Visit `/client-login`
- [ ] Click "Sign Up" tab
- [ ] Fill in:
  - Name: Test Client
  - Email: client@test.com
  - Password: TestPass123!
  - Confirm Password: TestPass123!
- [ ] Submit form
- [ ] Verify success message appears
- [ ] Switch to "Sign In" tab
- [ ] Login with same credentials
- [ ] Verify redirect to home page (`/`)
- [ ] Check that user menu shows client name

**Expected Result:** ✓ Client can successfully sign up and login

#### **Operator Signup & Login**
- [ ] Visit `/operator-login`
- [ ] Click "Sign Up" tab
- [ ] Fill in:
  - Name: Test Operator
  - Email: operator@test.com
  - Password: TestPass123!
  - Confirm Password: TestPass123!
- [ ] Submit form
- [ ] Verify success message
- [ ] Login with credentials
- [ ] Verify redirect to `/operator-home`
- [ ] Click "Go to Dashboard"
- [ ] Verify access to `/operator-dashboard`

**Expected Result:** ✓ Operator can successfully sign up and access dashboard

---

### 2. Equipment Listing Creation (Operator)

#### **Add New Equipment**
- [ ] Login as operator
- [ ] Navigate to Operator Dashboard
- [ ] Click "Add New Equipment" button
- [ ] Fill in equipment details:
  - Name: CAT 320D Excavator
  - Type: excavator
  - Category: excavators
  - Daily Rate: 12000
  - Location: Mumbai, Maharashtra
  - City: Mumbai
  - Description: Professional excavator with experienced operator
  - Min Rental Period: 1 day
- [ ] Upload equipment image (if available)
- [ ] Submit form
- [ ] Verify success toast notification
- [ ] Check equipment appears in "My Equipment" tab
- [ ] Verify equipment status is "available"

**Expected Result:** ✓ Equipment listing created successfully

#### **Real-time Equipment Updates**
- [ ] Keep operator dashboard open in one browser tab
- [ ] Open home page (`/`) in another tab
- [ ] From operator dashboard, add another equipment
- [ ] Switch to home page tab
- [ ] Verify new equipment appears automatically without refresh

**Expected Result:** ✓ Real-time updates working correctly

---

### 3. Equipment Browsing & Booking (Client)

#### **Browse Equipment**
- [ ] Login as client (or continue as guest)
- [ ] Navigate to home page (`/`)
- [ ] Scroll to "Available Equipment" section
- [ ] Verify equipment listings are displayed
- [ ] Check each card shows:
  - Equipment name
  - Daily rate
  - Location
  - Operator name
  - "Book Now" button

**Expected Result:** ✓ Equipment listings displayed correctly

#### **Create Booking**
- [ ] Click "Book Now" on any equipment
- [ ] Booking modal opens
- [ ] Fill in booking details:
  - Name: Test Client
  - Phone: +919876543210
  - Start Date: Select tomorrow's date
  - End Date: Select 3 days from tomorrow
  - Location: Andheri East, Mumbai, Maharashtra 400069
  - Special Requirements: Need early morning delivery
- [ ] Verify total amount calculation shows correctly
- [ ] Verify duration calculation (should show 3 days)
- [ ] Click "Proceed to Payment"
- [ ] Check loading state during submission

**Expected Result:** ✓ Booking form validates and processes correctly

---

### 4. Payment Processing

#### **Test Payment Flow** (Using Test Credentials)
- [ ] After booking submission, payment modal should appear
- [ ] Verify Razorpay payment form loads
- [ ] Use Razorpay test card:
  - Card Number: 4111 1111 1111 1111
  - Expiry: Any future date (e.g., 12/25)
  - CVV: 123
  - Name: Test User
- [ ] Submit payment
- [ ] Wait for verification
- [ ] Check for success notification
- [ ] Verify booking status changes to "confirmed"
- [ ] Check payment record is created in backend

**Test Cards Available:**
- Success: 4111 1111 1111 1111
- Failure: 4000 0000 0000 0002

**Expected Result:** ✓ Payment processed successfully (in test mode)

---

### 5. Booking Management

#### **Client Dashboard**
- [ ] Navigate to `/user-dashboard`
- [ ] Verify "My Bookings" tab shows all bookings
- [ ] Check each booking displays:
  - Equipment name
  - Start and end dates
  - Status badge (pending/confirmed/active/completed)
  - Total amount
  - Operator details
- [ ] Verify "Upcoming" bookings show cancel button
- [ ] Test canceling an upcoming booking
- [ ] Verify status changes to "cancelled"

**Expected Result:** ✓ Client can view and manage bookings

#### **Operator Dashboard**
- [ ] Login as operator
- [ ] Navigate to `/operator-dashboard`
- [ ] Check "Booking Requests" tab
- [ ] Verify incoming bookings are displayed
- [ ] Test updating booking status:
  - Select a booking
  - Click "Update Status"
  - Change from "confirmed" to "in_progress"
  - Verify success notification
- [ ] Check real-time notification appears
- [ ] Verify analytics charts update

**Expected Result:** ✓ Operator can manage and update bookings

---

### 6. Reviews & Ratings

#### **Leave Review (Client)**
- [ ] Login as client
- [ ] Go to User Dashboard
- [ ] Find a completed booking
- [ ] Click "Rate" button
- [ ] Review modal opens
- [ ] Select star rating (e.g., 5 stars)
- [ ] Write comment: "Excellent service, equipment was in great condition!"
- [ ] Submit review
- [ ] Verify success notification
- [ ] Check review appears immediately

**Expected Result:** ✓ Client can leave reviews for completed bookings

#### **View Reviews**
- [ ] Navigate to home page
- [ ] Scroll to equipment with reviews
- [ ] Verify reviews are displayed with:
  - Reviewer name
  - Star rating
  - Comment
  - Date
- [ ] Check operator rating updates automatically

**Expected Result:** ✓ Reviews display correctly and operator rating updates

---

### 7. Real-time Features Testing

#### **Real-time Equipment Updates**
- [ ] Open two browser windows
- [ ] Window 1: Operator dashboard
- [ ] Window 2: Home page (client view)
- [ ] From Window 1, add new equipment
- [ ] In Window 2, verify equipment appears instantly
- [ ] Update equipment status from Window 1
- [ ] Verify update reflects in Window 2 immediately

**Expected Result:** ✓ Real-time equipment sync working

#### **Real-time Booking Notifications**
- [ ] Window 1: Operator dashboard
- [ ] Window 2: Client view
- [ ] From Window 2, create a new booking
- [ ] In Window 1, verify notification appears instantly
- [ ] Check booking shows in "Booking Requests" tab

**Expected Result:** ✓ Real-time booking notifications working

---

### 8. Custom Quote Requests

#### **Submit Quote Request**
- [ ] Navigate to home page
- [ ] Scroll to "Need a Custom Quote?" section
- [ ] Fill in quote form:
  - Name: Test Client
  - Email: client@test.com
  - Phone: +919876543210
  - Equipment Type: Tower Crane
  - Project Location: Navi Mumbai
  - Project Duration: 6 months
  - Description: Large construction project, need crane for 6 months
- [ ] Submit form
- [ ] Verify success notification

**Expected Result:** ✓ Quote request submitted successfully

---

### 9. Legal & Information Pages

#### **Test Pages**
- [ ] Visit `/privacy-policy`
- [ ] Verify page loads with correct content
- [ ] Check all sections are visible
- [ ] Visit `/terms-of-service`
- [ ] Verify terms display correctly
- [ ] Test navigation links in footer
- [ ] Verify clicking links navigates to correct pages

**Expected Result:** ✓ Legal pages accessible and properly formatted

---

### 10. Security Testing

#### **Role-Based Access Control**
- [ ] Login as client
- [ ] Try accessing `/operator-dashboard` directly
- [ ] Verify access is denied with proper message
- [ ] Login as operator
- [ ] Try accessing `/user-dashboard`
- [ ] Verify access is denied
- [ ] Test protected routes without authentication
- [ ] Verify redirect to login page

**Expected Result:** ✓ RBAC working correctly, unauthorized access blocked

#### **Data Isolation**
- [ ] Login as client
- [ ] Verify only own bookings are visible
- [ ] Cannot see other users' data
- [ ] Login as operator
- [ ] Verify only own equipment and bookings visible
- [ ] Cannot modify other operators' equipment

**Expected Result:** ✓ Data properly isolated between users

---

### 11. Mobile Responsiveness

#### **Test on Mobile Devices**
- [ ] Open site on mobile browser (or use DevTools mobile view)
- [ ] Test all pages:
  - Home page
  - Login pages
  - Dashboards
  - Booking modal
  - Payment flow
- [ ] Verify:
  - Navigation menu works (hamburger menu)
  - Forms are usable
  - Cards stack properly
  - Buttons are tappable
  - Text is readable without zooming

**Expected Result:** ✓ Site is fully responsive on mobile

---

### 12. Error Handling

#### **Test Error Scenarios**
- [ ] Try booking with invalid phone number
- [ ] Try booking with past dates
- [ ] Try submitting empty forms
- [ ] Try payment with invalid card (test mode)
- [ ] Check appropriate error messages appear
- [ ] Verify errors are user-friendly
- [ ] Test with poor network (throttle in DevTools)
- [ ] Verify loading states show correctly

**Expected Result:** ✓ Errors handled gracefully with helpful messages

---

## 🚀 Production Readiness Checklist

### Before Launch:
- [ ] All 12 test sections above completed successfully
- [ ] Switch to live Razorpay API keys
- [ ] Connect custom domain
- [ ] Configure email notifications (optional but recommended)
- [ ] Test with real payment (₹1 transaction)
- [ ] Verify SSL certificate is active
- [ ] Check all external links work
- [ ] Test from different browsers (Chrome, Firefox, Safari)
- [ ] Verify SEO meta tags are correct
- [ ] Check favicon displays
- [ ] Test 404 page
- [ ] Verify analytics tracking (if configured)

---

## 📊 Test Results Summary

| Test Category | Status | Notes |
|--------------|--------|-------|
| Authentication | ⏳ Pending | |
| Equipment Listing | ⏳ Pending | |
| Booking Flow | ⏳ Pending | |
| Payments | ⏳ Pending | Use test mode |
| Booking Management | ⏳ Pending | |
| Reviews & Ratings | ⏳ Pending | |
| Real-time Features | ⏳ Pending | |
| Custom Quotes | ⏳ Pending | |
| Legal Pages | ⏳ Pending | |
| Security | ⏳ Pending | |
| Mobile | ⏳ Pending | |
| Error Handling | ⏳ Pending | |

**Legend:**
- ✅ = Passed
- ❌ = Failed
- ⏳ = Pending Test
- ⚠️ = Partial Pass / Needs Review

---

## 🐛 Bug Tracking

### Known Issues:
1. [None identified yet - update as testing progresses]

### Fixed Issues:
1. Loading state issue on operator-home page - FIXED ✓
2. Role detection fallback for metadata - FIXED ✓

---

## 📞 Support & Resources

- **Production Checklist**: See `PRODUCTION_LAUNCH_CHECKLIST.md`
- **Razorpay Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/
- **Lovable Docs**: https://docs.lovable.dev
- **Supabase Docs**: https://supabase.com/docs

---

## 🎯 Next Steps

1. Work through each test section systematically
2. Mark items as completed with ✓
3. Document any bugs or issues found
4. Fix issues and re-test
5. Once all tests pass, proceed with production configuration
6. Launch! 🚀

**Testing Start Date**: _____________
**Testing Completion Date**: _____________
**Launch Date**: _____________
