# DigitallyDefined Dashboard - Setup Instructions

## 🎉 Welcome to Your Digital Command Center!

This guide will help you set up your **white-label DigitallyDefined Dashboard** with your own branding and integrations. No coding required!

---

## 📁 Files You Need

You should have received these files:
1. ✅ `customer-config.js` - Your main configuration file
2. ✅ `.env.template` - Environment variables template
3. ✅ This `SETUP-INSTRUCTIONS.md` guide

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Deploy Your Dashboard

#### Option A: Deploy to Vercel (Recommended)
1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository or upload your files
4. Vercel will automatically detect it's a Vite/React project
5. Click "Deploy"
6. Wait for deployment (usually 1-2 minutes)

#### Option B: Deploy to Netlify
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Select your repository or upload files
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Click "Deploy site"

#### Option C: Local Development
```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Your dashboard will be at http://localhost:5173
```

---

## ⚙️ Configuration Steps

### Step 2: Set Up Environment Variables

1. Copy `.env.template` to `.env` in your project root
2. Open `.env` in a text editor
3. Fill in these **REQUIRED** values:

```env
# Your Google Sheets API URL (MANDATORY)
# How to get this:
# 1. Open your Google Sheet
# 2. Go to Extensions > Apps Script
# 3. Create a new script or use existing
# 4. Click Deploy > New deployment > Web App
# 5. Set "Execute as" to "Me" and "Who has access" to "Anyone"
# 6. Copy the URL and paste it here
VITE_SHEETS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# Your API Key (provided in your purchase confirmation)
VITE_DASHBOARD_API_KEY=your-api-key-from-purchase

# Your domain (where you deployed)
# Example: https://my-dashboard.vercel.app
# Leave empty if testing locally
VERCEL_URL=https://your-dashboard.vercel.app
```

4. Save the `.env` file

---

### Step 3: Customize Your Branding

1. Open `customer-config.js` in a text editor
2. Edit these **IMPORTANT** settings:

```javascript
// Line 10-15: Your Business Info
businessName: "My Business Name",      // Change to your business name
yourName: "Your Name",                // Your name
tagline: "Digital Real Estate for Gen X Women",  // Your tagline
websiteUrl: "https://mybusiness.com", // Your website
supportEmail: "support@mybusiness.com", // Your email

// Line 22-27: Your Colors (keep or change)
primaryColor: "#F18B25",              // Orange accent
secondaryColor: "#47B7D4",            // Teal accent
backgroundColor: "#FFFCF9",          // Cream background

// Line 34-36: Dashboard Title
 dashboardTitle: "My Command Center",
dashboardSubtitle: "Proprietary OS",
```

3. Customize your **tab names** (lines 40-46):
```javascript
tabs: {
  dashboard: "COMMAND",
  reputation: "REPUTATION",
  intel: "INTEL",
  brain: "THE BRAIN",
  automations: "AUTOMATIONS",
  notion: "NOTION DB"
},
```

4. Add your **API keys** (lines 54-62):
```javascript
// Your Google Sheets URL (same as .env)
sheetsApiUrl: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",

// Your Backend API Key (same as .env)
backendApiKey: "YOUR-API-KEY-HERE",

// OpenRouter AI Key (optional)
// Get free at: https://openrouter.ai/keys
openRouterApiKey: "sk-or-v1-YOUR-KEY",
```

5. Update **social links** (lines 78-84):
```javascript
facebookGroupUrl: "https://facebook.com/groups/yourgroup",
linkedInUrl: "https://linkedin.com/in/yourprofile",
instagramUrl: "https://instagram.com/yourhandle",
```

---

## 🔧 Setting Up Google Sheets (MANDATORY)

Your dashboard syncs with Google Sheets for data. Here's how to set it up:

### Step 1: Create Your Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Blank" to create a new spreadsheet
3. Name it: "My Business Dashboard Data"

### Step 2: Create Required Sheets (Tabs)
Create these sheets in your Google Sheet:

| Sheet Name | Purpose | Required Columns |
|------------|---------|-----------------|
| `vault` | Main data storage | A: Timestamp, B: Type, C: Data |
| `reviews` | Customer reviews | A: Date, B: Name, C: Rating, D: Review |
| `automations` | Automation logs | A: Timestamp, B: Automation, C: Status |
| `community` | Community members | A: Name, B: Email, C: Join Date |
| `intel` | Competitor intel | A: Competitor, B: Metric, C: Value |

### Step 3: Create Apps Script
1. In your Google Sheet, click **Extensions > Apps Script**
2. Delete any existing code
3. Paste this basic script:

```javascript
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const sheetName = e.parameter.sheet || 'vault';
    const action = e.parameter.action;
    const data = e.parameter.data;
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({error: 'Sheet not found'})).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'read') {
      const values = sheet.getDataRange().getValues();
      return ContentService.createTextOutput(JSON.stringify({data: values})).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'write') {
      const parsedData = JSON.parse(data);
      sheet.appendRow(parsedData);
      return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({error: 'Invalid action'})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** and name your project "Dashboard API"

### Step 4: Deploy as Web App
1. Click **Deploy** > **New deployment**
2. Select type: **Web app**
3. Description: "Dashboard API"
4. Execute as: **Me**
5. Who has access: **Anyone**
6. Click **Deploy**
7. Copy the **Web App URL** (looks like: `https://script.google.com/macros/s/.../exec`)
8. Paste this URL into:
   - `.env` file: `VITE_SHEETS_API_URL=YOUR_URL`
   - `customer-config.js`: `sheetsApiUrl: "YOUR_URL"`

---

## 🤖 Setting Up AI (Optional)

To use the AI Assistant feature:

1. Get a free API key from [OpenRouter](https://openrouter.ai/keys)
2. Add it to `.env`:
   ```
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```
3. Add it to `customer-config.js`:
   ```javascript
   openRouterApiKey: "sk-or-v1-your-key-here",
   ```
4. Choose your AI model in `customer-config.js`:
   ```javascript
   assistantModel: "openai/gpt-4o-mini",  // Free & fast
   // or: "openai/gpt-4o",  // More powerful
   // or: "anthropic/claude-3-haiku"  // Alternative
   ```

---

## 📊 Dashboard Features

Your dashboard includes these sections:

### 🎯 Command Center (Dashboard Tab)
- **System Health**: Overall status of your digital assets
- **Asset Value**: Total value of your digital properties
- **Community Size**: Number of community members
- **Sentiment Index**: Overall sentiment score

### 🛡️ Reputation Triage
- View and manage customer reviews
- AI-powered response suggestions
- Deploy replies directly

### 📈 Strategic Intel
- Competitor tracking
- Market positioning
- Performance metrics

### 🧠 The Brain
- AI-powered strategic insights
- Business recommendations
- Automated analysis

### ⚙️ Automations
- Sync status and logs
- Automation management
- Event tracking

### 📋 Notion DB
- Database integration
- Data visualization
- Custom queries

---

## 🎨 Customizing Colors & Theme

In `customer-config.js`, you can customize the color scheme:

```javascript
// Color Options
primaryColor: "#F18B25",      // Orange (default)
secondaryColor: "#47B7D4",    // Teal (default)
backgroundColor: "#FFFCF9",  // Cream (default)
textColor: "#111111",        // Black (default)
borderColor: "#111111",      // Black (default)
```

**Recommended color combinations:**

| Style | Primary | Secondary | Background |
|-------|---------|----------|------------|
| Default | #F18B25 | #47B7D4 | #FFFCF9 |
| Modern | #8B5CF6 | #EC4899 | #FAF7F5 |
| Professional | #1E293B | #3B82F6 | #F8FAFC |
| Bold | #EF4444 | #F97316 | #FEF3C7 |

---

## 📝 Customizing Text & Labels

All text labels can be customized in `customer-config.js`:

```javascript
// Messaging
dashboardTitle: "My Command Center",
welcomeMessage: "Own Your Power.",
syncButtonLabel: "Sync Vault",
settingsLabel: "System Keys",
```

**Pro Tip:** Use **UPPERCASE** for tab labels to match the DigitallyDefined style.

---

## 🔐 API Keys & Security

### Keeping Your Keys Safe
1. **Never share** your `.env` file or `customer-config.js` with API keys
2. **Never commit** these files to public repositories
3. **Use environment variables** for sensitive keys when possible
4. **Rotate keys** if you suspect they've been compromised

### What Each Key Does

| Key | Service | Purpose |
|-----|---------|---------|
| `VITE_DASHBOARD_API_KEY` | DigitallyDefined Backend | Authentication for API calls |
| `VITE_SHEETS_API_URL` | Google Sheets | Syncs dashboard data with your sheets |
| `VITE_OPENROUTER_API_KEY` | OpenRouter | Powers AI assistant and recommendations |
| `VITE_FIREBASE_*` | Firebase | Authentication (optional) |

---

## ⚡ Troubleshooting

### Dashboard won't load
- **Check:** Did you deploy to Vercel/Netlify?
- **Fix:** Run `npm run build` and redeploy

### Sync not working
- **Check:** Is your Google Sheets URL correct in both `.env` and `customer-config.js`?
- **Check:** Did you deploy the Apps Script as "Anyone" access?
- **Fix:** Redeploy the Apps Script and ensure the URL is correct

### API errors
- **Check:** Are your API keys correct?
- **Check:** Do the keys have the right permissions?
- **Fix:** Verify each API key is valid and not expired

### AI not working
- **Check:** Did you add your OpenRouter key?
- **Check:** Do you have enough credits?
- **Fix:** Add a valid OpenRouter key or remove AI features

### 403 / CORS errors
- **Check:** Is your domain whitelisted in the backend?
- **Fix:** Contact support@digitallydefined.online to add your domain

---

## 🎓 Video Tutorials

Coming soon! Check back at [DigitallyDefined.online](https://digitallydefined.online)

---

## 💬 Getting Help

**Need assistance?**
- Email: support@digitallydefined.online
- Community: [Facebook Group](https://facebook.com/groups/digitallydefind)
- Documentation: [DigitallyDefined.online](https://digitallydefined.online)

---

## ✅ Setup Checklist

- [ ] Deployed dashboard to Vercel/Netlify
- [ ] Created Google Sheet with required tabs
- [ ] Set up Google Apps Script
- [ ] Deployed Apps Script as Web App
- [ ] Added Google Sheets URL to `.env` and `customer-config.js`
- [ ] Added Backend API Key to `.env` and `customer-config.js`
- [ ] Customized branding in `customer-config.js`
- [ ] Updated social links
- [ ] Added OpenRouter AI Key (optional)
- [ ] Tested dashboard loads
- [ ] Tested sync with Google Sheets

---

## 📚 Additional Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [OpenRouter AI](https://openrouter.ai)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Netlify Deployment Guide](https://docs.netlify.com)

---

**Congratulations!** Your DigitallyDefined Dashboard is now customized and ready to use! 🎉

*Version: 1.0 | Last Updated: June 9, 2026*
