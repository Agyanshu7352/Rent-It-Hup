# 🏠 Rent-It-Hub

<div align="center">

![Rent-It-Hub Banner](https://img.shields.io/badge/Rent--It--Hub-Your%20Rental%20Marketplace-blue?style=for-the-badge)

**A modern peer-to-peer rental marketplace connecting people who want to rent with those who have items to share.**

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://rent-it-hup.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

[Features](#-features) •
[Demo](#-demo) •
[Installation](#-installation) •
[Tech Stack](#-tech-stack) •
[Contributing](#-contributing)

</div>

---

## 📖 About

Rent-It-Hub is a full-stack peer-to-peer rental marketplace that enables users to rent out their items or find items to rent from others in their community. From electronics and tools to sports equipment and party supplies, Rent-It-Hub makes sharing easy, sustainable, and profitable.

### Why Rent-It-Hub?

- 🌍 **Sustainable** - Promote reuse and reduce waste
- 💰 **Cost-Effective** - Earn money from idle items or save by renting
- 🤝 **Community-Driven** - Build trust within your local community
- 🔒 **Secure** - Protected transactions and verified users
- 📱 **Modern UI** - Beautiful, responsive design that works on all devices

---

## ✨ Features

### For Renters
- 🔍 **Smart Search** - Find exactly what you need with advanced filters
- 📍 **Location-Based** - Discover items near you
- 💬 **Direct Messaging** - Chat with owners before renting
- ⭐ **Reviews & Ratings** - Make informed decisions
- 📅 **Booking Management** - Track your rentals easily

### For Owners
- 📸 **Easy Listing** - List items in minutes with photos
- 💵 **Flexible Pricing** - Set daily, weekly, or monthly rates
- 📊 **Dashboard** - Manage all your listings in one place
- 🔔 **Notifications** - Stay updated on rental requests
- 💳 **Secure Payments** - Get paid safely and on time

### General Features
- 🔐 **Authentication** - Secure sign-up/login with Supabase
- 👤 **User Profiles** - Build your reputation
- ❤️ **Favorites** - Save items for later
- 🏷️ **Categories** - Browse by Electronics, Sports, Tools, Party Supplies, and more
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI/UX** - Built with shadcn/ui components
- 🌙 **Dark Mode Ready** - Eye-friendly interface (coming soon)

---

## 🎥 Demo

### Homepage
![Homepage Screenshot](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Homepage+Screenshot)

### Browse Items
![Browse Screenshot](https://via.placeholder.com/800x400/10B981/FFFFFF?text=Browse+Items+Screenshot)

### List Your Item
![List Item Screenshot](https://via.placeholder.com/800x400/F59E0B/FFFFFF?text=List+Item+Screenshot)

---

## 🚀 Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript 5.6** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching & caching
- **Tailwind CSS 4.0** - Styling
- **shadcn/ui** - UI components
- **Radix UI** - Accessible primitives
- **Framer Motion** - Animations
- **Lucide Icons** - Beautiful icons

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Storage for images
  - Row Level Security (RLS)

### Deployment
- **Vercel** - Hosting & CI/CD
- **GitHub** - Version control

---

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([Sign up here](https://supabase.com))
- Git

### Step 1: Clone the repository

```bash
git clone https://github.com/Agyanshu7352/Rent-It-Hup.git
cd Rent-It-Hup
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Set up environment variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your [Supabase Dashboard](https://app.supabase.com) → Project Settings → API

### Step 4: Set up the database

1. Go to your Supabase project
2. Run the SQL schema (found in `/supabase` folder or create tables for):
   - `profiles` - User profiles
   - `items` - Rental items
   - `categories` - Item categories
   - `bookings` - Rental bookings
   - `messages` - User messaging
   - `reviews` - Item reviews
   - `favorites` - User favorites

### Step 5: Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 6: Build for production

```bash
npm run build
npm run preview
```

---

## 🗂️ Project Structure

```
Rent-It-Hup/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── layout/      # Layout components (Navbar, Footer)
│   │   ├── sections/    # Page sections (Hero, Categories)
│   │   └── ui/          # shadcn/ui components
│   ├── hooks/           # Custom React hooks
│   ├── integrations/    # Supabase integration
│   ├── lib/             # Utilities and API functions
│   │   └── api/         # API calls to Supabase
│   ├── pages/           # Page components
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── .env                 # Environment variables
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
├── vercel.json          # Vercel deployment config
└── tailwind.config.js   # Tailwind config
```

---

## 🔧 Configuration

### Vercel Deployment

The project includes a `vercel.json` for proper client-side routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### TypeScript

Three TypeScript configs for optimal development:
- `tsconfig.json` - Main config
- `tsconfig.app.json` - App code config
- `tsconfig.node.json` - Build tools config

---

## 🎨 Customization

### Tailwind Theme

Customize colors and styles in `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#10B981',
        // Add your colors
      }
    }
  }
}
```

### Categories

Add/edit categories in `src/data/categories.ts`

---

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 🐛 Known Issues

- [ ] Dark mode implementation pending
- [ ] Payment integration in progress
- [ ] Mobile app version planned

See the [issues page](https://github.com/Agyanshu7352/Rent-It-Hup/issues) for a full list.

---

## 🗺️ Roadmap

- [ ] **Q1 2026**
  - [ ] Payment gateway integration (Stripe/Razorpay)
  - [ ] Advanced search filters
  - [ ] Email notifications
  
- [ ] **Q2 2026**
  - [ ] Mobile apps (iOS & Android)
  - [ ] Dark mode
  - [ ] Multi-language support

- [ ] **Q3 2026**
  - [ ] Insurance integration
  - [ ] Delivery service integration
  - [ ] AI-powered recommendations

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Agyanshu**

- GitHub: [@Agyanshu7352](https://github.com/Agyanshu7352)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - For the amazing UI components
- [Supabase](https://supabase.com) - For the powerful backend platform
- [Vercel](https://vercel.com) - For seamless deployment
- [Lucide](https://lucide.dev) - For beautiful icons
- All contributors who help improve this project

---

## 💖 Support

If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🔀 Contributing to the code

---

<div align="center">

**Made with ❤️ by Agyanshu**

[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=social&logo=github)](https://github.com/Agyanshu7352)
[![Twitter](https://img.shields.io/badge/Twitter-Follow-blue?style=social&logo=twitter)](https://twitter.com/yourhandle)

**[⬆ Back to Top](#-rent-it-hub)**

</div>