# MUX Video Player Setup Guide

## Prerequisites

1. **MUX Account**: Sign up at [mux.com](https://mux.com)
2. **Video Uploaded**: Upload a video to your MUX dashboard
3. **Playback ID**: Get the playback ID from your uploaded video

## Installation

The MUX player package has already been installed:

```bash
pnpm add @mux/mux-player-react
```

## Configuration

### 1. Get Your Video ID

- Go to your [MUX Dashboard](https://dashboard.mux.com)
- Navigate to "Assets" → Select your video
- Copy the "Playback ID" (this is your video ID)

### 2. Update the Code

In `app/craft/page.tsx`, replace the placeholder:

```typescript
const videoId = "your-mux-video-id-here";
```

With your actual playback ID:

```typescript
const videoId = "abc123def456";
```

### 3. Environment Variables (Optional)

For production, you might want to use environment variables:

Create a `.env.local` file:

```env
MUX_VIDEO_ID=your_video_id_here
```

Then update the code:

```typescript
const videoId = process.env.MUX_VIDEO_ID || "fallback-video-id";
```

## Features

The current implementation includes:

- ✅ Responsive video player
- ✅ Dark theme UI
- ✅ Proper aspect ratio (16:9)
- ✅ Metadata support
- ✅ Preload optimization
- ✅ Auto-play disabled (user-friendly)

## Customization

You can customize the player by modifying these props:

- `autoPlay`: Set to `true` for auto-play
- `muted`: Set to `true` for muted playback
- `preload`: Change to `"auto"` for immediate loading
- `style`: Customize player dimensions and appearance

## Troubleshooting

1. **Video not loading**: Check if your video ID is correct
2. **Player not showing**: Ensure the MUX package is properly installed
3. **Styling issues**: Check if Tailwind CSS is properly configured

## Next Steps

- Add multiple video support
- Implement video playlists
- Add custom controls
- Integrate with MUX Analytics
