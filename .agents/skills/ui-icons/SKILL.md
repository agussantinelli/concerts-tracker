---
name: ui-icons
description: Guidelines for using icons in the UI, mandating the use of icon libraries and prohibiting simple emojis.
---

# UI Icons Policy

## Mandatory Icon Library
All user interface elements that require iconography **MUST** use the `react-icons` library (or another explicitly installed icon library, if specified).

## Prohibition of Simple Emojis
You are **STRICTLY PROHIBITED** from using simple text emojis (like 🗺️, 🔍, ⚡, 📍, etc.) as structural or decorative UI elements in React components. Emojis render inconsistently across different operating systems and browsers, which breaks the professional aesthetic of the application.

## How to use `react-icons`
1. Ensure the library is installed: `pnpm add react-icons`
2. Import the required icon from the appropriate set (e.g., FontAwesome, Material Design):
   ```tsx
   import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
   ```
3. Use it in the component:
   ```tsx
   <FaMapMarkerAlt className="icon-class" />
   ```
