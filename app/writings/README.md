# Writings System

This directory contains the writings system for the Ascent project. It allows you to create and manage MDX-based content that gets rendered as individual pages.

## Structure

```
app/writings/
├── content/           # MDX files go here
├── [slug]/           # Dynamic route for individual writings
├── utils/            # Utility functions
├── layout.tsx        # Layout for the writings section
├── page.tsx          # Main writings listing page
└── README.md         # This file
```

## Adding New Writings

1. Create a new `.mdx` file in the `content/` folder
2. Add frontmatter at the top of the file:

```mdx
---
title: "Your Writing Title"
date: "2024-01-15"
description: "A brief description of your writing"
tags: ["tag1", "tag2"]
---

# Your Content Here

Your MDX content goes here...
```

3. The file will automatically appear on the `/writings` page and be accessible at `/writings/[filename-without-extension]`

## Frontmatter Fields

- **title** (required): The title of your writing
- **date** (required): Publication date in YYYY-MM-DD format
- **description** (required): A brief description for the listing page
- **tags** (optional): Array of tags for categorization

## Features

- **Automatic listing**: All MDX files are automatically listed on the main writings page
- **Tag system**: Writings are categorized with tags
- **Responsive design**: Mobile-friendly layout
- **SEO optimized**: Proper metadata and Open Graph tags
- **Static generation**: Pages are pre-built for better performance
- **Prose styling**: Beautiful typography for MDX content

## Styling

The writings use Tailwind CSS with built-in prose utilities for optimal readability. The prose classes provide beautiful typography for MDX content without any custom CSS.

## Navigation

The writings section is accessible from the main navigation bar and includes:

- Back navigation from individual writings
- Breadcrumb-style navigation
- Related writings suggestions (can be enhanced further)

## Customization

You can customize the appearance by:

- Modifying the Tailwind prose classes in the components
- Updating the layout components
- Adding new frontmatter fields
- Implementing additional features like search or filtering
