# 🏢 TestMate Prompt Wizard - Meta Internal Deployment

## For Sharing with Metamates Only

### Option 1: GitHub Enterprise (Meta Internal) ⭐ **RECOMMENDED**
**Best for: Permanent internal sharing, version control, professional deployment**

#### Step 1: Upload to Meta's GitHub Enterprise
1. Go to **[github.com/facebook](https://github.com/facebook)** (Meta's internal GitHub)
2. Click **"New Repository"**
3. Name: `testmate-prompt-wizard`
4. Description: `Internal tool for generating TestMate prompts for wearables QA teams`
5. **Keep it INTERNAL** (default for facebook org)
6. Click **"Create repository"**

#### Step 2: Upload Your Files
1. Click **"uploading an existing file"**
2. **Drag all files** from your `TestMatePromptWizard` folder
3. Commit message: `Initial commit - TestMate Prompt Wizard for Wearables QA`
4. **Commit changes**

#### Step 3: Enable GitHub Pages (Internal)
1. Go to **Settings** tab
2. Click **Pages** (left sidebar)
3. Source: **"Deploy from a branch"**
4. Branch: **"main"** / **"/ (root)"**
5. **Save**

#### Step 4: Share Internal URL
**Your app will be live at:**
```
https://facebook.github.io/testmate-prompt-wizard
```
**Only accessible to Meta employees on corporate network**

---

### Option 2: Meta Internal Hosting
**Check with your team for Meta-specific hosting options:**

#### Workplace Post Sharing
1. Create a **Workplace post** in relevant groups:
   - **Wearables QA Team**
   - **TestMate Users Group**
   - **QA Tools & Automation**

2. **Sample Post:**
```
🚀 New Tool: TestMate Prompt Wizard

I've created a comprehensive web app to help generate high-quality TestMate prompts for our wearables products (Malibu, Ceres, Hypernova, etc.).

✅ 13-question form with smart scoring system
✅ Level 7+ targeting for optimal results
✅ Supports functional, performance, stability testing
✅ Multi-device and constellation test scenarios
✅ Built-in analytics and validation

Access: [Internal GitHub Pages URL]
Docs: Full README with usage guide included

Perfect for generating consistent, detailed test case prompts! 🎯
```

---

### Option 3: Local Network Sharing (Meta Office)
**For same office/network sharing:**

#### Quick Local Server
```bash
# Open Terminal and run:
cd /Users/khafeez/Downloads/TestMatePromptWizard
python3 -m http.server 8000

# Share with colleagues:
# Find your IP: ifconfig | grep "inet " | grep -v 127.0.0.1
# Share: http://YOUR-IP:8000
```

#### Office WiFi Sharing
1. **Start local server** (command above)
2. **Find your Mac's IP** in System Preferences → Network
3. **Share with metamates**: `http://192.168.x.x:8000`
4. **Works for same office network only**

---

### Option 4: Phabricator/Differential
**If your team uses Phabricator:**

1. Create a **Differential** with your code
2. **Add reviewers** from wearables QA teams
3. **Share the Differential URL** for review and access
4. **Deploy after approval** to internal hosting

---

## 📋 Meta-Specific Checklist

### Before Internal Deployment
- [ ] **Code review** with team members
- [ ] **Security review** (no external API keys hardcoded)
- [ ] **Analytics compliance** (Google Analytics approved)
- [ ] **Accessibility compliance** (WCAG standards)
- [ ] **Test with Meta SSO** if required

### Sharing Guidelines
- [ ] **Post in relevant Workplace groups**
- [ ] **Add to team documentation/wiki**
- [ ] **Include in team onboarding materials**
- [ ] **Share in QA team meetings**
- [ ] **Document in team tools registry**

### Security Considerations ✅
- [ ] **API keys user-provided** (not embedded)
- [ ] **No external data storage** (LocalStorage only)
- [ ] **HTTPS enforced** (GitHub Pages auto-SSL)
- [ ] **Meta-approved analytics** (G-Q98010P7LZ)
- [ ] **Input sanitization** implemented
- [ ] **Corporate network access only**

---

## 🎯 Recommended Workflow

### Phase 1: Initial Sharing (Today)
1. **Deploy to Meta GitHub Enterprise**
2. **Test with 2-3 colleagues** first
3. **Gather initial feedback**

### Phase 2: Team Rollout (This Week)
1. **Post in Workplace groups**
2. **Share in team meetings**
3. **Add to team documentation**
4. **Create usage guidelines**

### Phase 3: Broader Adoption (Next Week)
1. **Cross-team sharing** (other wearables teams)
2. **Add to Meta tools directory**
3. **Collect usage analytics**
4. **Iterate based on feedback**

---

## 🔗 Internal Sharing URLs

After deployment, share these **Meta-internal URLs**:

### GitHub Enterprise Pages
```
https://facebook.github.io/testmate-prompt-wizard
```

### Workplace Groups to Target
- **Wearables QA Engineering**
- **TestMate Users & Advocates**
- **QA Tools & Automation**
- **Reality Labs Testing**
- **Product Quality Engineering**

---

## 📞 Support & Maintenance

### Team Contacts
- **Tool Owner**: Your name/contact
- **Backup Maintainer**: Assign a backup
- **QA Lead Sponsor**: Get leadership buy-in

### Maintenance Plan
- **Weekly usage reviews** (analytics)
- **Monthly feature updates** based on feedback
- **Quarterly security reviews**
- **Annual tool assessment**

---

## 🚀 Next Steps

1. **Choose deployment method** (GitHub Enterprise recommended)
2. **Deploy and test** with small group first
3. **Create Workplace announcement**
4. **Schedule team demo**
5. **Collect feedback and iterate**

**Ready to help metamates generate better TestMate prompts!** 🎉
