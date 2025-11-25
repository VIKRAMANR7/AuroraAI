# 🌟 AuroraAI - Intelligent AI Chat & Image Generation Platform

<div align="center">

![AuroraAI Banner](public/screenshots/home.png)

**A full-stack AI-powered platform for intelligent conversations and image generation**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://aurora-ai-jet.vercel.app)
[![Backend API](https://img.shields.io/badge/API-active-blue)](https://aurora-ai-server-eta.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-61dafb)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org/)

[Live Demo](https://aurora-ai-jet.vercel.app) • [API Documentation](#api-endpoints) • [Report Bug](https://github.com/yourusername/auroraai/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [System Design](#-system-design)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Performance & Optimization](#-performance--optimization)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**AuroraAI** is a modern, full-stack AI platform that combines intelligent chat capabilities with AI-powered image generation. Built with the MERN stack and powered by Google's Gemini AI and ImageKit, it provides a seamless user experience with a credit-based monetization system.

### 🌐 Live Links

- **Frontend**: [https://aurora-ai-jet.vercel.app](https://aurora-ai-jet.vercel.app)
- **Backend API**: [https://aurora-ai-server-eta.vercel.app](https://aurora-ai-server-eta.vercel.app)

---

## ✨ Features

### 🤖 Core Functionality

- **AI-Powered Chat**: Real-time conversations using Google Gemini 2.0 Flash
- **Image Generation**: AI-generated images via ImageKit integration
- **Multi-Chat Management**: Create, manage, and switch between multiple conversations
- **Community Gallery**: Share and explore user-generated AI images

### 💎 Credit System

- **Flexible Pricing**: Three-tier credit plans (Basic, Pro, Premium)
- **Secure Payments**: Stripe integration for seamless transactions
- **Real-time Balance**: Live credit tracking and updates
- **Webhook Automation**: Automated credit allocation post-payment

### 🎨 User Experience

- **Dark/Light Mode**: System-wide theme switching with persistence
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Instant message and credit synchronization
- **Search & Filter**: Quick conversation lookup
- **Markdown Support**: Rich text formatting with syntax highlighting

### 🔐 Security & Auth

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt encryption for user passwords
- **Protected Routes**: Middleware-based route protection
- **Environment Security**: Comprehensive env validation

---

## 🛠 Tech Stack

### Frontend

```
├── React 19.1          # UI Framework
├── TypeScript 5.9      # Type Safety
├── Vite 7.1           # Build Tool
├── Tailwind CSS 4.1    # Styling
├── React Router 7.8    # Routing
├── Axios 1.11         # HTTP Client
├── React Hot Toast     # Notifications
├── React Markdown      # Content Rendering
├── Prism.js           # Syntax Highlighting
└── Moment.js          # Date Formatting
```

### Backend

```
├── Node.js + Express 5.1  # Server Framework
├── TypeScript 5.9         # Type Safety
├── MongoDB + Mongoose 8.0 # Database
├── JWT                    # Authentication
├── Bcrypt.js             # Password Hashing
├── Stripe 18.4           # Payment Processing
├── OpenAI SDK 5.15       # Gemini API Client
├── ImageKit 6.0          # Image Management
└── Svix 1.74            # Webhook Handling
```

### DevOps & Tools

```
├── Vercel              # Deployment Platform
├── MongoDB Atlas       # Database Hosting
├── ESLint + Prettier   # Code Quality
├── TSX                 # Development Server
└── Git                 # Version Control
```

---

## 🏗 Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Frontend<br/>Vite + TypeScript]
        B[Tailwind CSS<br/>Responsive UI]
    end

    subgraph "API Gateway"
        C[Express Server<br/>REST API]
        D[JWT Middleware<br/>Auth Protection]
    end

    subgraph "Business Logic"
        E[User Controller<br/>Auth & Profile]
        F[Chat Controller<br/>Conversation Mgmt]
        G[Message Controller<br/>AI Integration]
        H[Credit Controller<br/>Payment Logic]
        I[Webhook Handler<br/>Stripe Events]
    end

    subgraph "Data Layer"
        J[(MongoDB Atlas<br/>User Data)]
        K[(MongoDB Atlas<br/>Chats & Messages)]
        L[(MongoDB Atlas<br/>Transactions)]
    end

    subgraph "External Services"
        M[Google Gemini API<br/>Text Generation]
        N[ImageKit<br/>Image Generation]
        O[Stripe API<br/>Payments]
    end

    A --> C
    B --> A
    C --> D
    D --> E & F & G & H
    O --> I
    I --> H

    E --> J
    F --> K
    G --> K
    G --> M & N
    H --> L & O

    style A fill:#61dafb
    style C fill:#68a063
    style J fill:#4db33d
    style M fill:#ff6b6b
    style N fill:#4ecdc4
    style O fill:#635bff
```

### Data Flow Diagram

```mermaid
sequenceDiagram
    participant U as User Browser
    participant F as React Frontend
    participant A as Express API
    participant DB as MongoDB
    participant AI as Gemini AI
    participant IK as ImageKit
    participant S as Stripe

    Note over U,S: User Registration & Authentication
    U->>F: Register/Login
    F->>A: POST /api/user/register
    A->>DB: Create User (20 free credits)
    DB-->>A: User Created
    A-->>F: JWT Token
    F->>F: Store Token in LocalStorage

    Note over U,S: Chat Interaction Flow
    U->>F: Send Text Message
    F->>A: POST /api/message/text
    A->>DB: Verify User Credits
    DB-->>A: Credits Available
    A->>AI: Generate Response
    AI-->>A: AI Response
    A->>DB: Save Message & Deduct 1 Credit
    A-->>F: AI Response
    F->>F: Update UI

    Note over U,S: Image Generation Flow
    U->>F: Generate Image Request
    F->>A: POST /api/message/image
    A->>DB: Verify Credits (2 required)
    A->>IK: Generate Image
    IK-->>A: Image URL
    A->>DB: Save Message & Deduct 2 Credits
    A-->>F: Image URL
    F->>F: Display Image

    Note over U,S: Credit Purchase Flow
    U->>F: Select Credit Plan
    F->>A: POST /api/credit/purchase
    A->>DB: Create Transaction Record
    A->>S: Create Checkout Session
    S-->>A: Session URL
    A-->>F: Redirect URL
    F->>U: Redirect to Stripe
    U->>S: Complete Payment
    S->>A: Webhook: payment_intent.succeeded
    A->>DB: Update User Credits
    A->>DB: Mark Transaction as Paid
    A-->>S: Webhook Acknowledged
```

### Database Schema

```mermaid
erDiagram
    USER ||--o{ CHAT : creates
    USER ||--o{ TRANSACTION : makes
    CHAT ||--|{ MESSAGE : contains

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        number credits
        timestamp createdAt
        timestamp updatedAt
    }

    CHAT {
        ObjectId _id PK
        string userId FK
        string userName
        string name
        array messages
        timestamp createdAt
        timestamp updatedAt
    }

    MESSAGE {
        string role
        string content
        number timestamp
        boolean isImage
        boolean isPublished
    }

    TRANSACTION {
        ObjectId _id PK
        ObjectId userId FK
        string planId
        number amount
        number credits
        boolean isPaid
        timestamp createdAt
        timestamp updatedAt
    }
```

---

## 💻 System Design

### Component Architecture

```mermaid
graph LR
    subgraph "Frontend Components"
        A[App.tsx<br/>Root Component]
        B[Sidebar<br/>Navigation]
        C[ChatBox<br/>Main Interface]
        D[Message<br/>Display]
        E[Login<br/>Auth]
        F[Credits<br/>Plans]
        G[Community<br/>Gallery]
        H[Loading<br/>State]
    end

    subgraph "Context & State"
        I[AppContext<br/>Global State]
        J[Local Storage<br/>Persistence]
    end

    subgraph "API Layer"
        K[Axios Instance<br/>HTTP Client]
        L[Auth Token<br/>Interceptor]
    end

    A --> B & C & E & F & G & H
    C --> D
    A --> I
    I --> J
    I --> K
    K --> L

    style A fill:#61dafb
    style I fill:#ff6b6b
    style K fill:#68a063
```

### API Request Flow

```mermaid
flowchart TD
    A[Client Request] --> B{Auth Required?}
    B -->|Yes| C[JWT Middleware]
    B -->|No| D[Direct to Controller]
    C --> E{Token Valid?}
    E -->|No| F[401 Unauthorized]
    E -->|Yes| G[Attach User to Request]
    G --> D
    D --> H[Controller Logic]
    H --> I{Database Operation?}
    I -->|Yes| J[Mongoose Query]
    I -->|No| K[External API Call]
    J --> L[Process Result]
    K --> L
    L --> M{Success?}
    M -->|Yes| N[200 Success Response]
    M -->|No| O[Error Handler]
    O --> P[500 Error Response]

    style C fill:#ffd93d
    style H fill:#6bcf7f
    style O fill:#ff6b6b
```

---

## 🚀 Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0 or pnpm >= 8.0.0
MongoDB Atlas Account
Stripe Account
Google Gemini API Key
ImageKit Account
```

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/auroraai.git
cd auroraai
```

#### 2️⃣ Backend Setup

```bash
cd server
pnpm install

# Create .env file
cp .env.example .env

# Update .env with your credentials
nano .env

# Run development server
pnpm dev
```

#### 3️⃣ Frontend Setup

```bash
cd client
pnpm install

# Create .env file
cp .env.example .env

# Update with backend URL
echo "VITE_BASE_URL=http://localhost:5000" > .env

# Run development server
pnpm dev
```

#### 4️⃣ Access the Application

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Stripe Payment
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# ImageKit (Optional)
IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

### Frontend (.env)

```env
VITE_BASE_URL=http://localhost:5000
# For production: https://aurora-ai-server-eta.vercel.app
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint                     | Description          | Auth Required |
| ------ | ---------------------------- | -------------------- | ------------- |
| POST   | `/api/user/register`         | Register new user    | ❌            |
| POST   | `/api/user/login`            | Login user           | ❌            |
| GET    | `/api/user/data`             | Get user profile     | ✅            |
| GET    | `/api/user/published-images` | Get community images | ❌            |

### Chat Management

| Method | Endpoint           | Description        | Auth Required |
| ------ | ------------------ | ------------------ | ------------- |
| POST   | `/api/chat/create` | Create new chat    | ✅            |
| GET    | `/api/chat/list`   | Get all user chats | ✅            |
| POST   | `/api/chat/delete` | Delete chat        | ✅            |

### Messages

| Method | Endpoint             | Description       | Auth Required |
| ------ | -------------------- | ----------------- | ------------- |
| POST   | `/api/message/text`  | Send text message | ✅            |
| POST   | `/api/message/image` | Generate image    | ✅            |

### Credits

| Method | Endpoint               | Description          | Auth Required |
| ------ | ---------------------- | -------------------- | ------------- |
| GET    | `/api/credit/plan`     | Get available plans  | ❌            |
| POST   | `/api/credit/purchase` | Purchase credit plan | ✅            |

### Webhooks

| Method | Endpoint      | Description            | Auth Required  |
| ------ | ------------- | ---------------------- | -------------- |
| POST   | `/api/stripe` | Stripe webhook handler | ❌ (Signature) |

---

## 📸 Screenshots

### Home Page

![Home](public/screenshots/home.png)
_Landing page with AI chat interface_

### Chat Interface

![Chat](public/screenshots/chat.png)
_Real-time AI conversation with syntax highlighting_

### Dark Mode

![Dark Mode](public/screenshots/darkmode.png)
_Elegant dark theme for comfortable viewing_

### Credit Plans

![Credits](public/screenshots/credits.png)
_Flexible credit purchasing options_

### Community Gallery

![Community](public/screenshots/community.png)
_User-generated AI images showcase_

### Login Page

![Login](public/screenshots/login.png)
_Secure authentication interface_

---

## 🌐 Deployment

### Frontend (Vercel)

```bash
cd client
vercel --prod
```

**Configuration** (`vercel.json`):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Backend (Vercel)

```bash
cd server
vercel --prod
```

**Configuration** (`vercel.json`):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ]
}
```

### Environment Variables

Set these in Vercel Dashboard:

- Frontend: `VITE_BASE_URL`
- Backend: All variables from `.env.example`

---

## ⚡ Performance & Optimization

### Frontend Optimizations

✅ **Code Splitting**: Dynamic imports for routes
✅ **Lazy Loading**: Images loaded on-demand
✅ **Memoization**: React.memo for expensive components
✅ **Virtual Scrolling**: Efficient chat message rendering
✅ **Debouncing**: Search input optimization
✅ **LocalStorage Caching**: Theme and auth persistence

### Backend Optimizations

✅ **MongoDB Indexing**: Optimized queries on userId and email
✅ **Connection Pooling**: Efficient database connections
✅ **Async/Await**: Non-blocking operations
✅ **Error Handling**: Centralized error middleware
✅ **Rate Limiting**: Stripe webhook protection
✅ **Compression**: Response payload optimization

### Performance Metrics

| Metric                 | Value  |
| ---------------------- | ------ |
| First Contentful Paint | < 1.5s |
| Time to Interactive    | < 3.0s |
| Lighthouse Score       | 95+    |
| Bundle Size (gzipped)  | ~180KB |

---

## 🔒 Security

### Implemented Security Measures

🛡️ **Authentication**

- JWT token-based authentication
- Secure password hashing with bcrypt (10 salt rounds)
- Token expiration (30 days)

🛡️ **API Security**

- CORS configuration with origin whitelist
- Rate limiting on webhooks
- Input validation and sanitization
- Error message sanitization

🛡️ **Database Security**

- MongoDB connection string encryption
- No sensitive data in version control
- Indexed queries to prevent injection

🛡️ **Payment Security**

- Stripe webhook signature verification
- Secure metadata passing
- Transaction idempotency

🛡️ **Frontend Security**

- XSS prevention with React's built-in escaping
- HTTPS-only in production
- Secure token storage

---

## 🏆 Key Highlights

### Technical Excellence

✨ **Full TypeScript Implementation**: End-to-end type safety
✨ **Modular Architecture**: Scalable folder structure
✨ **Error Handling**: Comprehensive async error management
✨ **Code Quality**: ESLint + Prettier configured
✨ **Git Workflow**: Conventional commits and branching

### Business Logic

💼 **Credit System**: Flexible monetization strategy
💼 **User Retention**: Free credits for new users
💼 **Social Features**: Community image sharing
💼 **Analytics Ready**: Transaction tracking for insights

### Scalability

📈 **Database Design**: Optimized schema for growth
📈 **API Structure**: RESTful design patterns
📈 **State Management**: Efficient React Context usage
📈 **Deployment**: Serverless architecture on Vercel

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Vikraman R**

- GitHub: [@VIKRAMANR7](https://github.com/VIKRAMANR7)

---

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [ImageKit](https://imagekit.io/) for image generation
- [Stripe](https://stripe.com/) for payment processing
- [Vercel](https://vercel.com/) for deployment platform
- [MongoDB Atlas](https://www.mongodb.com/atlas) for database hosting

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

Made with ❤️ by Vikraman R

[Back to Top](#-auroraai---intelligent-ai-chat--image-generation-platform)

</div>
