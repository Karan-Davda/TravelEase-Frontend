
# TravelEase - Modern Travel Booking Platform

## Overview

TravelEase is a comprehensive travel booking platform that allows users to create custom travel itineraries or choose from pre-arranged packages. The platform provides a seamless booking flow for flights, hotels, and local experiences all in one place.

## Features

- **Custom Trip Builder**: Create personalized travel itineraries based on destination, dates, travelers, and budget
- **Packages & Tours**: Browse pre-arranged travel packages with detailed information
- **Booking System**: Secure payment processing with Stripe integration
- **User Accounts**: Save preferences, manage bookings, and receive personalized recommendations
- **Responsive Design**: Mobile-first approach ensures excellent user experience on all devices

## Technology Stack

- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS for utility-first styling
- **Routing**: React Router for page navigation
- **State Management**: React Query for remote data management
- **UI Components**: Custom components built with shadcn/ui
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/         # Reusable React components
│   ├── ui/            # UI components from shadcn/ui
│   ├── forms/         # Form components
│   └── sections/      # Page section components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and helpers
├── pages/             # Page components
│   ├── Index.tsx       # Landing page
│   ├── CustomTrip.tsx  # Custom trip builder
│   ├── Packages.tsx    # Packages and tours
│   └── ...            # Other pages
└── App.tsx            # Main application component
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Design Decisions

- **Color Palette**: Fresh blues and teals with coral accents to create a modern, vibrant travel brand
- **Typography**: Clean sans-serif fonts (Inter for body text, Montserrat for headings) for optimal readability
- **Component Structure**: Modular components built for reusability across the application
- **User Flow**: Intuitive navigation with clear CTAs to guide users through the booking process

## Extending the Project

### Adding New Destinations

To add new destinations, update the `popularDestinations` array in `src/pages/Packages.tsx` with new destination objects:

```typescript
const popularDestinations = [
  {
    id: "new-destination-id",
    name: "Destination Name",
    count: 10  // Number of packages available
  },
  // ...
];
```

### Adding New Packages

To add new tour packages, update the `packages` array in `src/pages/Packages.tsx`:

```typescript
const packages = [
  {
    id: "new-package-id",
    title: "Package Title",
    image: "https://example.com/image.jpg",
    description: "Package description...",
    price: 1299,
    duration: "7 days",
    rating: 4.8,
    reviewCount: 45,
    maxGroupSize: 12,
    destinations: ["destination-id"],
    featured: false,
    categories: ["category1", "category2"]
  },
  // ...
];
```

## Future Improvements

- Integration with real flight and hotel APIs
- User reviews and ratings system
- Multi-language support
- Advanced filtering and search options
- Trip sharing functionality

## License

This project is licensed under the MIT License.
