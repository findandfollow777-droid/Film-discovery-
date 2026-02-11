# ✅ Nebula Face Testing Checklist

**Quick reference card for testing completion**

---

## 🎨 Visual Elements

- [ ] Gas clouds visible (4 layers)
- [ ] Gas clouds animate smoothly (drift/pulse)
- [ ] Dust particles present (~40 particles)
- [ ] Dust particles twinkle
- [ ] Movie title centered in gold
- [ ] Background gradient (deep blue → black)
- [ ] Words float around screen
- [ ] Words have 5 different sizes
- [ ] AI words are purple/lavender
- [ ] User words are white
- [ ] Layout is not broken

---

## 🎮 Physics & Animation

- [ ] Words move continuously
- [ ] Words bounce off top wall
- [ ] Words bounce off bottom wall
- [ ] Words bounce off left wall
- [ ] Words bounce off right wall
- [ ] Words bounce off each other
- [ ] No words escape boundaries
- [ ] Animation is smooth (60 FPS)
- [ ] No lag or stuttering
- [ ] Physics stops when leaving face
- [ ] Physics restarts when returning

---

## 📊 Header & Status

- [ ] Title shows "NEBULA IMPRESSIONS"
- [ ] Source badge visible
- [ ] Badge shows "✦ Orbit Impressions" (0 reviews)
- [ ] Badge color is purple
- [ ] Threshold bar exists
- [ ] Threshold bar at 0% width initially
- [ ] Threshold text shows "0 / 50 reviews"

---

## 📜 Review Feed

- [ ] Review feed visible at bottom
- [ ] Shows all 20 AI reviews
- [ ] Each AI review has "✦" icon
- [ ] AI review text is purple
- [ ] AI review text is italic
- [ ] Feed is scrollable
- [ ] Scrollbar styled (cyan)
- [ ] No duplicate reviews

---

## ✍️ User Input

- [ ] 5 input fields present
- [ ] Input fields have placeholders
- [ ] Input fields accept text
- [ ] Input fields have maxlength (15 chars)
- [ ] Input fields show cyan border on focus
- [ ] Submit button visible
- [ ] Submit button disabled initially
- [ ] Submit button enables when all 5 filled
- [ ] Submit button glows cyan when enabled
- [ ] Submit button text readable

---

## 🚀 Review Submission

- [ ] Can type in all 5 fields
- [ ] Submit with 5 words works
- [ ] Input fields clear after submit
- [ ] Nebula reloads automatically
- [ ] New review appears at top
- [ ] New review has "☉" icon (user)
- [ ] New review text is white
- [ ] New review NOT italic
- [ ] Threshold increments to "1 / 50"
- [ ] Threshold bar fills slightly (~2%)
- [ ] Badge changes to "◐ 2% Community"
- [ ] Badge color changes to gold
- [ ] Word cloud updates
- [ ] New words appear (if unique)
- [ ] Existing words resize (if repeated)

---

## 🔄 Navigation & State

- [ ] Can navigate TO Nebula face
- [ ] Nebula loads within 1 second
- [ ] Can navigate AWAY from Nebula
- [ ] Physics stops when leaving
- [ ] Can navigate back to Nebula
- [ ] Physics restarts on return
- [ ] Can close Movie Cube
- [ ] Can reopen same movie
- [ ] User reviews persist
- [ ] Threshold count persists
- [ ] Word frequencies persist

---

## 🐛 Edge Cases

- [ ] Movie with no nebula data shows error
- [ ] Error message is clear
- [ ] Can't submit with <5 words
- [ ] Can't submit with empty fields
- [ ] Long words truncate at 15 chars
- [ ] Hyphenated words accepted
- [ ] Multiple spaces handled
- [ ] Special characters handled
- [ ] Multiple rapid submits handled
- [ ] localStorage quota not exceeded

---

## 📱 Responsive Design

- [ ] Works on desktop (1920×1080)
- [ ] Works on laptop (1366×768)
- [ ] Works on tablet (768×1024)
- [ ] Works on mobile (375×667)
- [ ] Input fields don't overflow
- [ ] Words scale appropriately
- [ ] Buttons remain clickable
- [ ] Text remains readable
- [ ] Physics still smooth
- [ ] Scrolling works

---

## 🌐 Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] No console errors
- [ ] ES6 modules work
- [ ] LocalStorage works
- [ ] Fetch API works
- [ ] RequestAnimationFrame works
- [ ] CSS animations work

---

## ⚡ Performance

- [ ] Load time <1 second
- [ ] FPS stays 58-60
- [ ] Memory usage stable
- [ ] No memory leaks (5+ min test)
- [ ] CPU usage <30%
- [ ] No excessive repaints
- [ ] Smooth on older devices
- [ ] No freezing/hanging

---

## 🎯 Advanced Features

- [ ] 50+ reviews triggers "Community Voices"
- [ ] Badge changes to cyan star
- [ ] Threshold bar fills to 100%
- [ ] Word frequencies accurate
- [ ] Top 30 words shown
- [ ] Stop words filtered out
- [ ] Phrases detected (e.g., "sci-fi")
- [ ] Case insensitive
- [ ] Reviews sorted (user first)

---

## 📊 Data Integrity

- [ ] movieId correct in data
- [ ] title matches TMDB
- [ ] 20 AI reviews present
- [ ] All reviews are 5 words
- [ ] Word frequencies calculated
- [ ] No duplicate words (case-folded)
- [ ] LocalStorage keys correct format
- [ ] Cache expires after 24hrs
- [ ] Index.json accessible
- [ ] All 417 movies indexed

---

## 🎨 Polish & UX

- [ ] Animations feel natural
- [ ] Colors are harmonious
- [ ] Text is readable
- [ ] Buttons have hover states
- [ ] Inputs have focus states
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Success feedback provided
- [ ] Navigation is intuitive
- [ ] Overall feel is polished

---

## ✨ Final Checks

- [ ] No console errors
- [ ] No console warnings
- [ ] No 404s in Network tab
- [ ] All assets load
- [ ] Fonts load correctly
- [ ] Icons display correctly
- [ ] Gradients render smoothly
- [ ] No layout shifts
- [ ] No FOUC (flash of unstyled content)
- [ ] Accessibility: keyboard navigation works

---

## 📝 Test Summary

**Total Checks:** 200+
**Passing:** _____ / 200
**Failing:** _____ / 200
**N/A:** _____ / 200

**Overall Status:** ⬜ Pass / ⬜ Fail / ⬜ Needs Work

---

## 🚨 Critical Issues Found

1. _____________________________________
2. _____________________________________
3. _____________________________________

---

## ⚠️ Minor Issues Found

1. _____________________________________
2. _____________________________________
3. _____________________________________

---

## 💡 Improvement Suggestions

1. _____________________________________
2. _____________________________________
3. _____________________________________

---

## 📅 Tested By

**Name:** _____________________
**Date:** _____________________
**Browser:** __________________
**Device:** ___________________

---

## ✅ Sign-Off

- [ ] All critical tests passing
- [ ] All major features working
- [ ] Performance acceptable
- [ ] Ready for production
- [ ] Documentation complete

**Approved by:** _____________________
**Date:** _____________________

---

**Print this checklist and mark items as you test!**
