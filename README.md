# 🎓 CollegeFinder

A full-stack college discovery platform that helps students search, compare, save and discover colleges based on fees, ratings, placements and entrance-exam rank.

## 🚀 Live Features

- 🔍 College search
- 🎯 College Predictor
- ⚖️ College comparison
- ⭐ College ratings
- 💰 Fee comparison
- 📊 Placement information
- 📍 Location filtering
- 🔃 Sorting
- 📄 Pagination
- ❤️ Save colleges
- 🗑️ Remove saved colleges
- 🔐 User authentication
- 📝 College reviews
- 📚 Course information
- 🔎 Individual college details

---

## 🛠️ Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js API Routes
- Node.js
- Prisma ORM
- PostgreSQL

### Authentication

- JWT
- bcryptjs
- HTTP-only authentication cookie

### Database

- PostgreSQL
- Neon

---

## 📁 Project Structure

```text
college-finder/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── colleges/
│   │   ├── courses/
│   │   ├── predictor/
│   │   ├── reviews/
│   │   └── saved-colleges/
│   │
│   ├── colleges/
│   │   ├── [id]/
│   │   └── page.tsx
│   │
│   ├── compare/
│   ├── predictor/
│   ├── saved-colleges/
│   ├── login/
│   ├── signup/
│   └── page.tsx
│
├── components/
│   ├── CollegeCard.tsx
│   ├── CollegeRating.tsx
│   ├── Courses.tsx
│   ├── Navbar.tsx
│   ├── Reviews.tsx
│   └── SaveCollegeButton.tsx
│
├── lib/
│   └── prisma.ts
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│
├── package.json
└── README.md