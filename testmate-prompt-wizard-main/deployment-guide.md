# TestMate Prompt Wizard - Deployment Guide

## Quick Deployment Options

### Option 1: GitHub Pages (Recommended)

#### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click "+" → "New repository"
3. Name it `testmate-prompt-wizard` (or any name you prefer)
4. Make it **Public** (required for free GitHub Pages)
5. Check "Add a README file"
6. Click "Create repository"

#### Step 2: Upload Your Files
```bash
# Option A: Using Git (if you have it installed)
cd /Users/khafeez/Downloads/TestMatePromptWizard
git init
git add .
git commit -m "Initial commit - TestMate Prompt Wizard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/testmate-prompt-wizard.git
git push -u origin main

# Option B: Using GitHub Web Interface
# 1. Go to your repository on GitHub
# 2. Click "uploading an existing file"
# 3. Drag and drop ALL files from TestMatePromptWizard folder
# 4. Commit the changes
```

#### Step 3: Enable GitHub Pages
1. In your GitHub repository, go to **Settings** tab
2. Scroll down to **Pages** section (left sidebar)
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"

#### Step 4: Access Your Live App
- Your app will be available at: `https://YOUR_USERNAME.github.io/testmate-prompt-wizard`
- It may take 5-10 minutes for the first deployment

---

### Option 2: Netlify (Easiest Deployment)

#### Quick Deploy
1. Go to [netlify.com](https://www.netlify.com/)
2. Sign up for free account
3. Drag and drop your entire `TestMatePromptWizard` folder onto Netlify
4. Get instant shareable URL (e.g., `https://amazing-name-123456.netlify.app`)

#### Custom Domain (Optional)
1. In Netlify dashboard → Site settings
2. Domain management → Add custom domain
3. Follow instructions to connect your domain

---

### Option 3: Vercel (Advanced)

#### Deploy with Vercel
1. Go to [vercel.com](https://vercel.com/)
2. Sign up with GitHub account
3. Import your repository
4. Automatic deployment on every push

---

### Option 4: Local Network Sharing

#### For Same Network Sharing
```bash
# Option A: Python HTTP Server
cd /Users/khafeez/Downloads/TestMatePromptWizard
python3 -m http.server 8000

# Option B: Node.js http-server
npx http-server -p 8000

# Then share: http://YOUR_LOCAL_IP:8000
# Find your IP: ifconfig | grep "inet " | grep -v 127.0.0.1
```

---

## Deployment Checklist

### Before Deployment
- [ ] Test application locally
- [ ] Verify all links work
- [ ] Check API key functionality
- [ ] Test on different devices/browsers
- [ ] Review analytics tracking

### Security Considerations
- [ ] API keys are handled securely (user-provided)
- [ ] No sensitive data in repository
- [ ] HTTPS enabled (automatic with GitHub Pages/Netlify)
- [ ] Analytics configured properly

### Post-Deployment
- [ ] Test live application
- [ ] Verify analytics tracking
- [ ] Share URL with team
- [ ] Document any issues

---

## Sharing URLs

Once deployed, you can share these URLs:

### GitHub Pages
```
https://YOUR_USERNAME.github.io/testmate-prompt-wizard
```

### Netlify
```
https://YOUR_SITE_NAME.netlify.app
```

### Custom Domain
```
https://your-custom-domain.com
```

---

## Troubleshooting

### Common Issues

#### GitHub Pages Not Loading
- Check repository is public
- Verify Pages is enabled in Settings
- Ensure `index.html` is in root directory
- Wait 5-10 minutes for initial deployment

#### API Calls Failing
- Verify CORS settings
- Check API key format
- Test with browser developer tools
- Ensure HTTPS is used for API calls

#### Analytics Not Working
- Verify Google Analytics tracking ID
- Check browser ad blockers
- Test in incognito mode
- Review console for errors

### Performance Optimization
- Enable caching headers (automatic with most hosts)
- Compress images if added
- Minify CSS/JS for production (optional)
- Use CDN for external resources

---

## Updating Your App

### GitHub Pages
```bash
# Make changes locally
git add .
git commit -m "Update description"
git push origin main
# Auto-deploys in 1-2 minutes
```

### Netlify
- Drag and drop new files to replace
- Or connect to GitHub for auto-deployment

---

## Cost Comparison

| Option | Cost | Custom Domain | Auto-Deploy | SSL |
|--------|------|---------------|-------------|-----|
| GitHub Pages | Free | ✅ | ✅ | ✅ |
| Netlify | Free | ✅ | ✅ | ✅ |
| Vercel | Free | ✅ | ✅ | ✅ |
| Local Network | Free | ❌ | ❌ | ❌ |

**Recommendation**: Start with GitHub Pages for permanent sharing or Netlify for quickest deployment.
