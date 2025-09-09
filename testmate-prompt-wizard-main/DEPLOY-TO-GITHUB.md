# 🚀 Deploy to Meta GitHub Enterprise - Step by Step

## Pre-deployment Checklist ✅
- ✅ All files ready in `/Users/khafeez/Downloads/TestMatePromptWizard`
- ✅ 10 files total (index.html + css/ + js/ + documentation)
- ✅ Meta-approved analytics configured (G-Q98010P7LZ)
- ✅ Security compliant (user-provided API keys only)

---

## Step 1: Create Repository (2 minutes)

### Go to Meta GitHub Enterprise
🔗 **[https://github.com/facebook](https://github.com/facebook)**

### Create New Repository
1. Click **"New"** (green button)
2. **Repository name**: `testmate-prompt-wizard`
3. **Description**: `Internal tool for generating TestMate prompts for wearables QA teams - supports Malibu, Ceres, Hypernova, Supernova, Florian, Artemis, SSG`
4. **Visibility**: Keep as **Internal** (default for facebook org)
5. ✅ Check **"Add a README file"**
6. Click **"Create repository"**

---

## Step 2: Upload Files (3 minutes)

### Upload Method A: Drag & Drop (Easiest)
1. Click **"uploading an existing file"**
2. **Open Finder** → Navigate to `/Users/khafeez/Downloads/TestMatePromptWizard`
3. **Select ALL files and folders**:
   - `index.html`
   - `css/` folder
   - `js/` folder
   - `README.md`
   - `META-DEPLOYMENT.md`
   - `QUICK-DEPLOY.md`
   - `deployment-guide.md`
4. **Drag them all** into the GitHub upload area
5. **Commit message**: `🚀 Initial deployment - TestMate Prompt Wizard for Wearables QA`
6. **Commit changes**

### Upload Method B: Individual Files (If drag & drop fails)
1. Upload `index.html` first
2. Create `css` folder → Upload `styles.css` and `components.css`
3. Create `js` folder → Upload all 5 JS files
4. Upload all markdown files

---

## Step 3: Enable GitHub Pages (1 minute)

### Configure Pages
1. Go to **Settings** tab (top menu)
2. Scroll down → Click **"Pages"** (left sidebar)
3. **Source**: Select **"Deploy from a branch"**
4. **Branch**: Select **"main"**
5. **Folder**: Select **"/ (root)"**
6. Click **"Save"**

### Wait for Deployment
- ⏱️ **Takes 2-5 minutes** for first deployment
- ✅ You'll see: **"Your site is published at..."**

---

## Step 4: Your Live URL 🎉

**Your TestMate Prompt Wizard will be live at:**
```
https://facebook.github.io/testmate-prompt-wizard
```

**📱 Test immediately after deployment:**
- [ ] Page loads properly
- [ ] Form fields work
- [ ] Scoring system updates
- [ ] API key field accepts input
- [ ] Generate button activates at Level 4+

---

## Step 5: Share with Metamates 📢

### Copy-Paste Workplace Post:

```
🎯 NEW QA TOOL: TestMate Prompt Wizard

I've built a comprehensive web app to generate high-quality TestMate prompts for our wearables products!

✅ Smart 13-question form with Level 7+ scoring system
✅ Supports Malibu, Ceres, Hypernova, Supernova, Florian, Artemis, SSG
✅ Handles functional, performance, stability testing scenarios
✅ Multi-device and constellation test configurations
✅ Built-in validation and auto-save
✅ Copy/download generated prompts

🔗 Access: https://facebook.github.io/testmate-prompt-wizard
📚 Full documentation and usage guide included

Perfect for creating consistent, detailed TestMate prompts! Try it out and let me know what you think. 🚀

#TestMate #QATools #WearablesTesting #ProductQuality
```

### Share in These Groups:
- **Wearables QA Engineering**
- **TestMate Users & Advocates**
- **QA Tools & Automation**
- **Reality Labs Testing**
- **Product Quality Engineering**

---

## Troubleshooting 🔧

### If Upload Fails:
- Try uploading files in smaller batches
- Ensure you're on Meta corporate network
- Clear browser cache and retry

### If Pages Doesn't Deploy:
- Check that `index.html` is in root directory
- Verify repository is not empty
- Wait up to 10 minutes for first deployment

### If App Doesn't Load:
- Check browser console for errors
- Verify all file paths are relative (no absolute paths)
- Test in incognito mode

---

## Ready to Deploy? 🚀

**Everything is prepared for you!**

1. **Bookmark this guide**
2. **Go to**: [github.com/facebook](https://github.com/facebook)
3. **Follow the steps above**
4. **Share your success** in Workplace!

**Total time needed: ~6 minutes** ⏱️

**Need help during deployment?** Check browser console for any errors or post in QA Tools groups.
