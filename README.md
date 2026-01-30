# DonatePeriod 🩸

A full-stack platform connecting donors with NGOs to provide menstrual hygiene products to women in need.

## Features

- 🗺️ **Geolocation-based NGO finder** - Find NGOs near you using GPS or manual address entry
- 🔐 **User Authentication** - Register as Donor or NGO
- 💝 **Donation System** - Donate products or money to verified NGOs
- 📊 **Campaign Tracking** - Support active fundraising campaigns
- 🤝 **Volunteer Registration** - Join the mission as a volunteer
- 📰 **Blog & Stories** - Read inspiring impact stories
- 🔔 **Real-time Notifications** - Stay updated on your donations
- 💬 **Chat System** - Direct communication with NGOs

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express 5, MongoDB, Socket.IO
- **APIs**: OpenStreetMap (Nominatim/Overpass) for geolocation

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/YashPratap56/Donate-Period-Final-Geolocation.git
cd Donate-Period-Final-Geolocation
```

2. **Create `.env` file in root directory**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

3. **Install dependencies & run**
```bash
# Server
cd server
npm install
node seed.js  # Seed the database
npm run dev

# Client (new terminal)
cd client
npm install
npm run dev
```

4. Open http://localhost:5173

## Deployment

### Backend (Render)

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL` (your Vercel URL)

### Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → Import Project
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `client`
   - **Framework**: Vite
4. Add Environment Variable:
   - `VITE_API_URL` = your Render backend URL (e.g., `https://your-app.onrender.com`)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ngos` | Get all NGOs (with optional geolocation) |
| GET | `/api/ngos/search?q=` | Search NGOs by name/city |
| GET | `/api/ngos/geocode/forward?address=` | Convert address to coordinates |
| GET | `/api/ngos/geocode/reverse?lat=&lng=` | Convert coordinates to address |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/campaigns` | Get active campaigns |
| GET | `/api/blogs` | Get blog posts |
| POST | `/api/donations` | Create donation (auth required) |
| POST | `/api/volunteers` | Apply as volunteer (auth required) |

## License

MIT

---

Made with ❤️ for women everywhere
