# 🌌 Nebula Face - Quick Start Guide

**5-minute setup to test your new Nebula Impressions feature!**

---

## ⚡ Quick Setup (3 steps)

### 1. Add Your TMDB API Key

Open `test-nebula.html` (line 135) and add your API key:
```javascript
const TMDB_API_KEY = 'your_actual_api_key_here';
```

### 2. Start Local Server

```bash
cd "C:\Users\danie\OneDrive\Desktop\Projects\Venn Movies"
python -m http.server 8000
```

### 3. Open Test Page

Visit: **http://localhost:8000/test-nebula.html**

---

## 🎮 Quick Test

1. **Click any movie card** (e.g., "Inception")
2. **Click "✦ Nebula"** button in navigation
3. **Watch the magic:**
   - Gas clouds drift ✨
   - Dust particles twinkle ⭐
   - Words float and bounce 💭
4. **Type 5 words** in the input slots
5. **Click "LAUNCH INTO NEBULA ✦"**
6. **See your review** appear at the top with ☉ icon

---

## ✅ What You Should See

### **Visual Elements**
- 🌫️ 4 animated gas clouds (purple/blue hues)
- ⭐ ~40 twinkling dust particles
- 💫 20-30 floating words (different sizes)
- 🎬 Movie title centered in gold

### **Header**
- Title: "NEBULA IMPRESSIONS" (cyan)
- Badge: "✦ Orbit Impressions" (purple)
- Progress: "0 / 50 reviews"

### **Words**
- AI words: Purple, italic, ✦ icon
- User words: White, normal, ☉ icon
- Sized by frequency (5 tiers)

### **Physics**
- Words bounce off walls
- Words bounce off each other
- Smooth 60 FPS animation

---

## 🐛 Troubleshooting

### Nothing loads?
- ✅ Check console (F12) for errors
- ✅ Verify local server is running
- ✅ Ensure you're on `http://localhost`, not `file://`

### "Nebula service not available"?
- ✅ Check `nebula-service.js` is in project root
- ✅ Browser must support ES6 modules
- ✅ CORS may block file:// protocol

### Words don't move?
- ✅ Check browser console for JS errors
- ✅ Try refreshing the page
- ✅ Check if physics is starting (see console logs)

### Can't submit review?
- ✅ All 5 input fields must have text
- ✅ Each field needs at least 1 character
- ✅ Button enables only when all filled

---

## 📊 Test Data

**Available Movies:** 417 with nebula data

**Sample Movies:**
- 27205: Inception (20 reviews)
- 238: The Godfather (20 reviews)
- 550: Fight Club (20 reviews)
- 13: Forrest Gump (20 reviews)

**Data Location:**
```
nebula-data/
├── index.json        ← 417 movies indexed
├── 27205.json        ← Inception reviews
├── 238.json          ← Godfather reviews
└── ...               ← 415 more files
```

---

## 🎯 Key Features to Test

### 1. **Word Cloud Physics**
- Words float smoothly
- Collisions work correctly
- No words escape boundaries

### 2. **User Input**
- Type 5 words: `amazing visual stunning sci fi`
- Submit button enables
- Review appears at top

### 3. **Threshold Progress**
- Starts at 0/50 (0%)
- Increments with each review
- Badge changes:
  - 0 reviews: "✦ Orbit Impressions" (purple)
  - 1-49: "◐ X% Community" (gold)
  - 50+: "★ Community Voices" (cyan)

### 4. **Persistence**
- Close Movie Cube
- Reopen same movie
- Your reviews still there!

---

## 📱 Mobile Testing

1. Open DevTools (F12)
2. Click device toolbar icon (📱)
3. Select iPhone/Android
4. Navigate to Nebula face
5. Check responsive layout

---

## 🚀 Performance Benchmarks

**Expected Performance:**
- Load time: <1 second
- FPS: 58-60 (smooth)
- Memory: ~40-60MB stable
- No lag or stuttering

**If performance is poor:**
- Reduce word count (edit nebula-service.js line with `limit = 30`)
- Disable collision detection (comment out collision loop)
- Check other browser tabs/extensions

---

## 🎨 Customization Quick Tips

### Change Colors
Edit `moviecube.css` (search for "NEBULA"):
- Gas clouds: `.gas-1` through `.gas-4` background colors
- Word colors: `.nebula-word` color property
- Badge colors: `.nebula-source-badge` variants

### Adjust Physics Speed
Edit `moviecube.js` → `renderFloatingWords()`:
```javascript
// Line ~1350
const vx = (Math.random() - 0.5) * 0.5;  // ← change 0.5 to 1.0 for faster
const vy = (Math.random() - 0.5) * 0.5;
```

### Change Word Count
Edit `renderNebula()`:
```javascript
const topWords = nebulaService.getTopWords(data.wordFrequency, 30);
//                                                            ↑ change to 20 or 40
```

---

## 📖 Full Documentation

For comprehensive testing, see: **NEBULA_TEST_GUIDE.md**

Covers:
- ✅ 14 detailed test scenarios
- ✅ Edge case testing
- ✅ Performance profiling
- ✅ Browser compatibility
- ✅ Common issues & solutions
- ✅ Test results template

---

## 🎉 Success Criteria

Your Nebula face is working if:

- ✅ Loads in <1 second
- ✅ Animation is smooth (60 FPS)
- ✅ User reviews persist
- ✅ Word frequencies update
- ✅ No console errors
- ✅ Responsive on mobile
- ✅ Works in Chrome/Firefox/Safari

---

## 🆘 Need Help?

**Check these in order:**

1. Browser console (F12) - any errors?
2. Network tab - files loading?
3. Application tab → LocalStorage - data saving?
4. Performance tab - FPS dropping?

**Common fixes:**
- Clear browser cache (Ctrl+Shift+R)
- Try incognito/private mode
- Update browser to latest version
- Disable browser extensions
- Check firewall/antivirus settings

---

## 🎬 Demo Video Ideas

Record a quick demo:
1. Open Movie Cube
2. Navigate to Nebula face
3. Show gas clouds animating
4. Type 5-word review
5. Submit and watch update
6. Navigate away and back

Share with team/users for feedback!

---

## 📈 Next Steps

After successful testing:

1. **Integrate into main app** (not just test page)
2. **Add to existing Movie Cube instances**
3. **Announce to users**
4. **Monitor analytics**:
   - How many nebula views?
   - How many user reviews submitted?
   - Which movies most popular?
5. **Plan Phase 2 features**:
   - Export word cloud as image
   - Share on social media
   - Filter words by sentiment
   - Compare movies side-by-side

---

**Ready to test?** Open `http://localhost:8000/test-nebula.html` and enjoy! 🚀

---

## 📞 Support

If you encounter issues:
1. Check **NEBULA_TEST_GUIDE.md** for detailed troubleshooting
2. Review code comments in:
   - `nebula-service.js` (data layer)
   - `moviecube.js` (logic layer)
   - `moviecube.css` (presentation layer)
3. Verify file paths and permissions
4. Test in different browsers

**Good luck!** 🌟
