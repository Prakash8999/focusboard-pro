# Cloudinary Setup Guide

## Step 1: Create Account

1. Go to [cloudinary.com](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email

## Step 2: Get Your Cloud Name

1. Log in to Cloudinary dashboard
2. You'll see your **Cloud name** on the dashboard home
3. Copy this value (e.g., `dxyz123abc`)

## Step 3: Create Upload Preset

For security and simplicity, we use **unsigned uploads** with a preset.

1. In Cloudinary dashboard, go to **Settings** (gear icon)
2. Click on **Upload** tab
3. Scroll down to **Upload presets**
4. Click **Add upload preset**
5. Configure:
   - **Preset name**: `study_notes`
   - **Signing mode**: `Unsigned`
   - **Folder**: `study_notes` (optional, helps organize)
   - **Allowed formats**: `jpg, png, gif, webp` (recommended)
   - **Max file size**: `5 MB` (or your preference)
   - **Transformation**: Leave default or add:
     - Width: 1200 (max)
     - Quality: auto
     - Format: auto
6. Click **Save**

## Step 4: Update Environment Variables

Edit `.env.local` in your project:

```bash
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
```

Replace `your_cloud_name_here` with your actual cloud name from Step 2.

## Step 5: Test Upload

1. Start your app: `npm run dev`
2. Go to Topics List → New Topic
3. Click **Add Image**
4. Select an image file
5. Wait for upload
6. Image should appear in your topic

## Troubleshooting

### Upload fails with 401 Unauthorized
- Check that your cloud name is correct in `.env.local`
- Ensure the upload preset is set to **Unsigned**
- Restart your dev server after changing `.env.local`

### Upload fails with 400 Bad Request
- Check that the upload preset name is exactly `study_notes`
- Verify the preset exists in your Cloudinary dashboard
- Check file size limits

### Image doesn't display
- Check browser console for CORS errors
- Verify the URL returned from Cloudinary
- Try opening the URL directly in a new tab

### Slow uploads
- Cloudinary free tier has rate limits
- Large images take longer to upload
- Consider resizing images before upload

## Free Tier Limits

Cloudinary free tier includes:
- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month

This is more than enough for personal study notes!

## Optional: Advanced Configuration

### Image Optimization

Add transformations to your upload preset:
- **Quality**: `auto:good` (automatic quality optimization)
- **Format**: `auto` (automatic format selection)
- **Width**: `1200` (resize large images)

### Folder Organization

You can organize images by topic:
```typescript
// In cloudinary.ts
formData.append('folder', `study_notes/${topicId}`);
```

### Signed Uploads (More Secure)

For production or if you want more control:
1. Create a server endpoint
2. Generate signed upload parameters
3. Use signed uploads instead of unsigned

Example server code (Node.js):
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate signature
const timestamp = Math.round(new Date().getTime() / 1000);
const signature = cloudinary.utils.api_sign_request(
  { timestamp, folder: 'study_notes' },
  process.env.CLOUDINARY_API_SECRET
);

// Return to client
res.json({ timestamp, signature });
```

## Security Notes

- Unsigned uploads are fine for personal use
- For public apps, use signed uploads
- Set upload preset restrictions (file types, sizes)
- Monitor usage in Cloudinary dashboard
- Enable moderation if needed

## Resources

- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Upload Presets Guide](https://cloudinary.com/documentation/upload_presets)
- [React Integration](https://cloudinary.com/documentation/react_integration)
