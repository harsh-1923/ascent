# OG Image Generator Setup

This project now includes a dynamic Open Graph (OG) image generator that automatically creates beautiful social media preview images for your pages.

## How It Works

The OG image generator creates images with:

- **Page title** in large, bold text (H1 style)
- **Your name** (Harsh Sharma) below the title
- **Your role** (Design Engineer) below your name
- **Beautiful styling** with gradients, accent lines, and background patterns
- **Dynamic font sizing** that adjusts based on title length

## Features

- ✅ **Automatic generation** for all craft and writing pages
- ✅ **Dynamic content** based on page titles
- ✅ **Responsive design** with automatic font scaling
- ✅ **Professional appearance** with modern design elements
- ✅ **Social media optimized** at 1200x630px dimensions
- ✅ **Fast generation** using Vercel's Edge Runtime

## API Endpoint

The OG images are generated via the `/api/og` endpoint:

```
GET /api/og?title={pageTitle}&name={yourName}&role={yourRole}
```

### Parameters

- `title` (required): The page title to display
- `name` (optional): Your name (defaults to "Harsh Sharma")
- `role` (optional): Your role (defaults to "Design Engineer")

### Example URLs

```
/api/og?title=Glyph Inspector&name=Harsh Sharma&role=Design Engineer
/api/og?title=Getting Started with Next.js&name=Harsh Sharma&role=Design Engineer
/api/og?title=Advanced TypeScript Tips and Tricks for Modern Web Development
```

## Implementation Details

### 1. API Route (`/app/api/og/route.tsx`)

- Uses `@vercel/og` for image generation
- Runs on Edge Runtime for fast performance
- Includes dynamic font sizing for long titles
- Features modern design with gradients and patterns

### 2. Metadata Integration

The OG images are automatically integrated into:

- **Craft pages** (`/app/craft/utils/generateMetadata.ts`)
- **Writing pages** (`/app/writings/[slug]/page.tsx`)
- **Main layout** (`/app/layout.tsx`)

### 3. Social Media Tags

Each page automatically includes:

```html
<meta property="og:image" content="[og-image-url]" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="[title] - Harsh Sharma" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="[og-image-url]" />
```

## Demo Page

Visit `/og-demo` to see examples of all generated OG images and test different titles.

## Customization

### Changing Your Information

To update your name or role, modify the metadata generation files:

1. **Craft pages**: Update `app/craft/utils/generateMetadata.ts`
2. **Writing pages**: Update `app/writings/[slug]/page.tsx`
3. **Main layout**: Update `app/layout.tsx`

### Styling Changes

To modify the visual appearance, edit `app/api/og/route.tsx`:

- **Colors**: Update the background gradients and text colors
- **Typography**: Adjust font sizes, weights, and families
- **Layout**: Modify spacing, positioning, and visual elements
- **Background**: Change the gradient patterns and accent lines

### Adding New Page Types

To add OG images to new page types:

1. Create metadata generation function
2. Include the OG image URL in OpenGraph and Twitter metadata
3. Use the same URL pattern: `/api/og?title=${title}&name=Harsh Sharma&role=Design Engineer`

## Dependencies

- `@vercel/og`: For image generation
- `next`: For API routes and metadata

## Performance

- **Edge Runtime**: Fast image generation
- **Caching**: Images are cached by social media platforms
- **Optimization**: 1200x630px is optimal for social sharing
- **Lightweight**: Minimal impact on page load times

## Troubleshooting

### Images Not Generating

1. Check that the development server is running
2. Verify the `/api/og` endpoint is accessible
3. Check browser console for errors
4. Ensure all dependencies are installed

### Poor Image Quality

1. Verify the 1200x630 dimensions are maintained
2. Check that the title parameter is properly encoded
3. Ensure the font sizes are appropriate for the content

### Social Media Preview Issues

1. Use Facebook's Sharing Debugger to test
2. Use Twitter's Card Validator
3. Clear social media cache if needed
4. Verify metadata is properly generated

## Future Enhancements

Potential improvements:

- Add custom fonts support
- Include page thumbnails or icons
- Add more visual elements (logos, patterns)
- Support for different image dimensions
- Add animation or interactive elements
- Include page-specific branding

## Support

For issues or questions about the OG image generator, check:

1. The demo page at `/og-demo`
2. Browser developer tools for errors
3. Network tab for API responses
4. This documentation file
