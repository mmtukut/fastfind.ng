# **App Name**: FastFind360

## Core Features:

- Property Mapping: Display buildings on a map using Mapbox GL JS with custom styling and layers to differentiate building types.
- Data Filtering: Filter buildings based on type (residential, commercial, industrial, institutional), size range, and detection confidence to refine the displayed data.
- Executive Dashboard: Provide a dashboard with key metrics such as total buildings, total area, revenue potential, and building classifications with visual charts.
- Government Admin Dashboard: Enable a toggleable admin view for managing flagged properties, enforcement queue, and revenue metrics.
- Data Export: Allow exporting filtered or full building data as a CSV file for further analysis.
- AI-Powered Building Classification: The platform's AI-engine examines satellite imagery to classify new buildings. It has access to historical and current building registries tool, and if it is unsure about whether a building appears on that list, the engine can attempt to retrieve building records using geolocation to assist in identifying potentially unregistered properties for review.

## Style Guidelines:

- Primary color: Government Blue with warmth (#3B82F6) for the main brand color.
- Background color: Light gray (#F9FAFB) to provide a clean backdrop for content.
- Accent color: Emerald green (#10B981) for success states, particularly for residential buildings.
- Font: 'Inter' (sans-serif) for a modern, clean, and readable user interface. Note: currently only Google Fonts are supported.
- Font weights: Use normal (400), medium (500), and semibold (600) for varying emphasis throughout the application.
- Use only Lucide React icons for a consistent and professional look. Do not include any emojis.
- Apply rounded corners (12-16px) to cards and other UI elements for a softer, more approachable interface.
- Implement soft shadows for layered depth and avoid harsh borders to maintain a gentle UI feel.
- Use smooth transitions (200-300ms) with easeInOut timing for subtle yet noticeable UI interactions.