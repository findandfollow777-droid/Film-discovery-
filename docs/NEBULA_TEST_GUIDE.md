# Nebula Face Testing Guide

Complete testing checklist for the Nebula Impressions feature.

---

## 📋 Pre-Test Setup

### 1. **Verify Files Are in Place**
```
Venn Movies/
├── nebula-service.js          ✓ Created
├── nebula-data/
│   ├── index.json            ✓ Generated (417 movies)
│   ├── 27205.json           ✓ Inception
│   ├── 238.json             ✓ The Godfather
│   └── ...                  ✓ 415 more files
├── js/
│   └── moviecube.js         ✓ Updated with nebula logic
├── css/
│   └── moviecube.css        ✓ Updated with nebula styles
└── test-nebula.html         ✓ Test page
```

### 2. **Add Your TMDB API Key**

Open `test-nebula.html` and replace:
```javascript
const TMDB_API_KEY = 'YOUR_API_KEY_HERE';
```

### 3. **Start Local Server**

You need a local server because ES6 modules don't work with `file://` protocol.

**Option A: Python**
```bash
cd "C:\Users\danie\OneDrive\Desktop\Projects\Venn Movies"
python -m http.server 8000
```

**Option B: Node.js (http-server)**
```bash
npx http-server -p 8000
```

**Option C: VS Code Live Server**
- Install "Live Server" extension
- Right-click `test-nebula.html` → "Open with Live Server"

### 4. **Open Test Page**

Navigate to: `http://localhost:8000/test-nebula.html`

---

## 🧪 Test Plan

### **Test 1: Basic Nebula Display**

**Steps:**
1. Click on any movie card (e.g., "Inception")
2. Movie Cube opens with Face 1 (Poster)
3. Click "✦ Nebula" button

**Expected Results:**
- ✅ Nebula overlay fades in smoothly
- ✅ Gas clouds are visible and slowly animating (drift effect)
- ✅ Dust particles twinkle at random intervals
- ✅ Movie title appears centered in gold/yellow color
- ✅ Words float around the screen
- ✅ Words have different sizes (5 brightness tiers)
- ✅ Words bounce off edges of container
- ✅ Words bounce off each other when colliding

**Visual Checks:**
- Purple/blue gradient background
- 4 gas clouds with different colors
- ~40 twinkling dust particles
- 20-30 floating words
- All words are purple/lavender (AI-generated)

---

### **Test 2: Header & Source Badge**

**Expected:**
- ✅ Header shows "NEBULA IMPRESSIONS" in cyan
- ✅ Source badge shows "✦ Orbit Impressions" in purple
- ✅ Threshold bar is empty (0% width)
- ✅ Threshold text shows "0 / 50 reviews"

---

### **Test 3: Review Feed**

**Scroll down to review feed section**

**Expected:**
- ✅ Shows all 20 AI reviews
- ✅ Each review has "✦" icon (AI source)
- ✅ Review text is purple and italic
- ✅ Scrollbar appears if needed
- ✅ Scrollbar has custom cyan styling

---

### **Test 4: User Input - Basic**

**Steps:**
1. Type one word in each of the 5 input fields
2. Watch the submit button

**Expected:**
- ✅ Input fields have cyan borders on focus
- ✅ Submit button is DISABLED until all 5 fields filled
- ✅ Submit button enables when all 5 fields have text
- ✅ Submit button glows cyan when enabled

**Test Words:** `amazing visual effects absolutely stunning`

---

### **Test 5: Submit Review**

**Steps:**
1. Fill in 5 words: `mind bending cerebral sci fi masterpiece`
2. Click "LAUNCH INTO NEBULA ✦"

**Expected:**
- ✅ Review is submitted successfully
- ✅ Input fields clear automatically
- ✅ Nebula reloads with updated data
- ✅ New word frequencies calculated
- ✅ Words rearrange based on new frequencies

**Check Review Feed:**
- ✅ Your review appears at TOP of feed
- ✅ Your review has "☉" icon (user source)
- ✅ Your review text is WHITE (not purple)
- ✅ Your review is NOT italic

**Check Header:**
- ✅ Threshold text updates to "1 / 50 reviews"
- ✅ Threshold bar shows ~2% fill (1/50)
- ✅ Source badge updates to "◐ 2% Community" (gold)

**Check Word Cloud:**
- ✅ Words you submitted appear in cloud
- ✅ If words were new, they're added to cloud
- ✅ If words existed, their size may increase

---

### **Test 6: Multiple User Reviews**

**Steps:**
1. Submit 4 more reviews with different words
2. Watch the progression

**Test Reviews:**
```
1. mind bending cerebral sci fi masterpiece
2. visually stunning complex narrative structure
3. phenomenal acting incredible plot twists
4. thought provoking dream within dreams
5. brilliant direction fantastic special effects
```

**Expected After Each Submission:**
- ✅ Threshold increments: 1/50, 2/50, 3/50, 4/50, 5/50
- ✅ Threshold bar fills: 2%, 4%, 6%, 8%, 10%
- ✅ Source badge updates: "◐ X% Community"
- ✅ Percentage increases with each review
- ✅ Word frequencies recalculate
- ✅ Common words get larger
- ✅ User reviews appear in WHITE at top of feed
- ✅ All user reviews have "☉" icon

---

### **Test 7: Edge Cases**

#### **A. Less Than 5 Words**
1. Type only 3 words
2. Try to submit

**Expected:**
- ✅ Submit button remains DISABLED
- ✅ Cannot submit incomplete review

#### **B. Empty Words**
1. Fill 5 fields: `word1  word3 word4 word5` (field 2 empty)
2. Try to submit

**Expected:**
- ✅ Submit button remains DISABLED

#### **C. Very Long Words**
1. Type: `supercalifragilisticexpialidocious` in field 1
2. Check display

**Expected:**
- ✅ Input maxlength=15 truncates typing
- ✅ Only first 15 characters accepted

#### **D. Special Characters**
1. Type: `sci-fi mind-blowing fast-paced edge-of-seat action-packed`

**Expected:**
- ✅ Hyphenated words treated as single word
- ✅ Review submits successfully
- ✅ Phrases kept together in word cloud

---

### **Test 8: Navigation & Physics**

**Steps:**
1. Navigate to Face 1 (Poster)
2. Navigate back to Face 6 (Nebula)
3. Navigate to Face 2 (Info)

**Expected:**
- ✅ Physics STOPS when leaving Nebula face
- ✅ Words freeze in place
- ✅ Nebula reloads when returning
- ✅ Physics RESTARTS on return
- ✅ Words resume animation

**Performance Check:**
- ✅ Animation is smooth (60 FPS)
- ✅ No lag or stuttering
- ✅ Collisions work correctly
- ✅ No words escaping boundaries

---

### **Test 9: Close & Reopen**

**Steps:**
1. Close Movie Cube (X button)
2. Reopen same movie
3. Navigate to Nebula face

**Expected:**
- ✅ User reviews persist (localStorage)
- ✅ Threshold shows correct count
- ✅ All previous reviews visible
- ✅ Word frequencies include user reviews
- ✅ Source badge shows correct status

---

### **Test 10: No Nebula Data**

**Steps:**
1. Open a movie NOT in the nebula-data folder
2. Navigate to Face 6 (Nebula)

**Expected:**
- ✅ Shows error message: "Nebula data not available for this movie"
- ✅ No crash or blank screen
- ✅ Can navigate back to other faces

**How to Test:**
- Use a very recent movie (likely no data)
- Or temporarily rename a nebula JSON file

---

### **Test 11: Community Threshold (50+ Reviews)**

**Steps:**
1. Submit 50 reviews (can automate in console)

**Console Command:**
```javascript
for (let i = 0; i < 50; i++) {
  const words = ['amazing', 'incredible', 'fantastic', 'brilliant', 'stunning'];
  const review = words.map(w => w + i).slice(0, 5).join(' ');
  saveUserReview(27205, `word${i}1 word${i}2 word${i}3 word${i}4 word${i}5`);
}
// Reload nebula face manually
```

**Expected After 50 Reviews:**
- ✅ Threshold bar at 100% (full cyan)
- ✅ Threshold text: "50 / 50 reviews"
- ✅ Source badge: "★ Community Voices" (cyan)
- ✅ Badge class changes to `.community`

---

### **Test 12: Responsive Design (Mobile)**

**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone or similar device

**Expected:**
- ✅ Nebula face scales down
- ✅ Input fields stack properly
- ✅ Words scale to smaller sizes
- ✅ Physics still work
- ✅ Touch interactions work
- ✅ Submit button readable

---

### **Test 13: Performance Test**

**Monitor Performance:**
1. Open DevTools → Performance tab
2. Start recording
3. Navigate to Nebula face
4. Let physics run for 30 seconds
5. Stop recording

**Expected:**
- ✅ Framerate stays at 60 FPS
- ✅ No memory leaks
- ✅ CPU usage reasonable (<30%)
- ✅ No excessive repaints

---

### **Test 14: Browser Compatibility**

**Test in:**
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if on Mac)

**Check:**
- ES6 module support
- CSS animations
- RequestAnimationFrame
- LocalStorage
- Fetch API

---

## 🐛 Common Issues & Solutions

### Issue: "Nebula service not available"

**Cause:** nebula-service.js not loading

**Solutions:**
1. Check console for import errors
2. Verify file path: `./nebula-service.js`
3. Ensure local server is running (not file://)
4. Check browser supports ES6 modules

---

### Issue: Words don't move

**Cause:** Physics not starting

**Solutions:**
1. Check console for errors
2. Verify `startNebulaPhysics()` is called
3. Check `nebulaPhysicsRunning` flag
4. Ensure word dimensions are measured

---

### Issue: Blank nebula screen

**Cause:** Data not loading

**Solutions:**
1. Check nebula-data/index.json exists
2. Verify movieId in index
3. Check nebula-data/{movieId}.json exists
4. Look for console errors

---

### Issue: Submit button always disabled

**Cause:** Input validation issue

**Solutions:**
1. Check all 5 inputs have values
2. Verify event listeners attached
3. Check console for errors
4. Test with simple words

---

### Issue: Reviews not persisting

**Cause:** localStorage issues

**Solutions:**
1. Check localStorage quota
2. Verify key format: `orbit_user_reviews_{movieId}`
3. Check browser privacy settings
4. Try incognito/private mode

---

## ✅ Final Checklist

Before considering testing complete:

- [ ] All visual elements render correctly
- [ ] Gas cloud animations smooth
- [ ] Dust particles twinkle
- [ ] Word physics work (walls + collisions)
- [ ] Words sized by frequency (5 tiers)
- [ ] Source badge updates correctly (3 states)
- [ ] Threshold bar fills properly
- [ ] User input validates 5 words
- [ ] Reviews submit and persist
- [ ] User reviews styled differently (white, ☉)
- [ ] Word cloud updates after submission
- [ ] Navigation stops/starts physics
- [ ] Error states handled gracefully
- [ ] Performance is smooth (60 FPS)
- [ ] Mobile responsive
- [ ] Cross-browser compatible

---

## 📊 Success Metrics

**If testing is successful, you should see:**
- 417 movies with nebula data available
- Smooth 60 FPS animation
- <1 second load time for nebula face
- User reviews persist across sessions
- Word frequencies accurately calculated
- No console errors
- No memory leaks after 5+ minutes

---

## 🎉 Post-Test Actions

Once testing is complete:

1. **Document any bugs** found
2. **Test edge cases** not covered here
3. **Gather user feedback** on experience
4. **Monitor performance** in production
5. **Plan Phase 2** features:
   - Word filtering/search
   - Share nebula visualizations
   - Export word cloud as image
   - Sentiment analysis
   - Comparative nebulas

---

## 📝 Test Results Template

```markdown
## Test Results - [Date]

**Tester:** [Name]
**Browser:** [Chrome 120 / Firefox 121 / etc.]
**Device:** [Desktop / Mobile]

### Passing Tests
- ✅ Test 1: Basic Display
- ✅ Test 2: Source Badge
- ✅ ...

### Failing Tests
- ❌ Test 7C: Long words not truncating
  - Error: maxlength not enforced
  - Priority: Low

### Performance
- FPS: 58-60 average
- Load Time: 0.8s
- Memory: Stable at 45MB

### Notes
- Physics occasionally glitchy on mobile
- Consider adding word limit indicator
```

---

**Happy Testing!** 🚀
