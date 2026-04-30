# FreshAlert Flutter - Deployment Guide

## Quick Start to Production

### 1. GitHub Setup

The Flutter app is committed to the GitHub repository:
```
Repository: https://github.com/Haritheproggramer/FRESHALERT
Branch: main (Flutter app in freshalert_flutter_app directory)
```

**Commit message**: "Convert website to Flutter app"

### 2. Vercel Deployment

#### Option A: Deploy via Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to Flutter app
cd freshalert_flutter_app

# 3. Deploy
vercel

# 4. Configure build settings when prompted:
#    Build Command: flutter build web --release
#    Output Directory: build/web
#    Install Command: flutter pub get
```

#### Option B: Deploy via GitHub Integration

1. Go to [vercel.com](https://vercel.com/dashboard)
2. Click "New Project"
3. Import GitHub repository
4. Select `freshalert_flutter_app` directory as root
5. Configure:
   - **Build Command**: `flutter build web --release`
   - **Output Directory**: `build/web`
   - **Install Command**: `flutter pub get`
6. Click Deploy

#### Option C: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM ghcr.io/cirruslabs/flutter:latest

WORKDIR /app
COPY . .

RUN flutter pub get
RUN flutter build web --release

FROM nginx:alpine
COPY --from=0 /app/build/web /usr/share/nginx/html
EXPOSE 80
```

Deploy to any Docker-compatible platform (Heroku, Railway, etc.)

### 3. Build & Test Locally

```bash
cd freshalert_flutter_app

# Install dependencies
flutter pub get

# Build web
flutter build web --release

# Serve locally
python -m http.server 8000 --directory build/web

# Visit http://localhost:8000
```

### 4. Post-Deployment

After deployment, the live app will be at:
```
https://<your-vercel-project>.vercel.app
```

### Environment Variables (if needed)

Add to Vercel in Project Settings → Environment Variables:
```
FLUTTER_VERSION=3.41.6
FLUTTER_WEB_USE_SKIA=true
```

## Monitoring & Maintenance

### Check Build Status

```bash
# Monitor Vercel deployments
vercel list

# View deployment logs
vercel logs <deployment-url>
```

### Performance Tips

1. **Enable Caching**:
   ```json
   // vercel.json
   "headers": [{
     "source": "/:path*",
     "headers": [{
       "key": "Cache-Control",
       "value": "public, max-age=3600, immutable"
     }]
   }]
   ```

2. **Optimize Build**:
   ```bash
   flutter build web --release --dart-define=FLUTTER_WEB_USE_SKIA=true
   ```

3. **Monitor Web Vitals**: Set up analytics in Vercel dashboard

## Troubleshooting Vercel

### Build Fails: "flutter: command not found"

Solution: Ensure Vercel has Flutter SDK by using official Flutter action:

```bash
# Or use NodeJS buildpack with Flutter pre-installed
vercel env add FLUTTER_VERSION 3.41.6
```

### Blank Page on Load

- Check browser console for errors
- Clear cache and hard refresh (Ctrl+Shift+R)
- Verify `index.html` is being served
- Check `/index.html` exists in `build/web`

### Large Bundle Size

```bash
flutter build web --release --no-tree-shake-icons=false
```

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'freshalert_flutter_app/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.41.6'
      
      - working-directory: freshalert_flutter_app
        run: |
          flutter pub get
          flutter build web --release
      
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: freshalert_flutter_app
          scope: ${{ secrets.VERCEL_ORG_SLUG }}
```

Setup secrets in GitHub:
1. Go to Settings → Secrets and variables → Actions
2. Add:
   - `VERCEL_TOKEN`: From vercel.com/account/tokens
   - `VERCEL_ORG_ID`: From Vercel dashboard
   - `VERCEL_PROJECT_ID`: From Vercel project settings

## Rollback Deployment

```bash
# View deployment history
vercel ls

# Redeploy previous version
vercel rollback

# Or redeploy from git
git revert <commit-hash>
git push origin main
```

## Custom Domain Setup

1. In Vercel project settings:
   - Go to "Domains"
   - Add your domain
   - Update DNS records (shown in Vercel)

2. Enable HTTPS (automatic with Vercel)

3. Redirect www to non-www:
   ```
   Domains:
   - freshalert.app (primary)
   - www.freshalert.app → freshalert.app
   ```

## API Integration (Future)

When connecting to a backend API:

```dart
// lib/services/api_service.dart
class ApiService {
  static const String baseUrl = String.fromEnvironment('API_URL',
    defaultValue: 'https://api.freshalert.app');
  
  // API methods...
}
```

Deploy with environment variable:
```bash
vercel env add API_URL https://api.freshalert.app
```

## Monitoring

### Add Analytics

1. **Vercel Analytics**: Automatic with Vercel
2. **Google Analytics**: Add to Flutter app
3. **Sentry**: Error tracking
4. **LogRocket**: Session replay

## Updates & Maintenance

```bash
# Update Flutter and dependencies
flutter upgrade
flutter pub get
flutter pub upgrade

# Test changes
flutter analyze
flutter test
flutter run -d chrome

# Commit and push
git add .
git commit -m "Update dependencies"
git push origin main

# Automatic deployment triggers on Vercel
```

## Success Checklist

- ✅ Flutter app builds locally without errors
- ✅ All pages load correctly in web browser
- ✅ Responsive design works on mobile/tablet/desktop
- ✅ GitHub repository is connected
- ✅ Vercel project is created
- ✅ Build command set to `flutter build web --release`
- ✅ Output directory set to `build/web`
- ✅ Deployment completed successfully
- ✅ Live URL is accessible
- ✅ All features work in production

---

**Deployment complete! Your Flutter app is live and ready for users.**
