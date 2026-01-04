# AuroraAI

A full-stack AI-powered platform for intelligent conversations and image generation, built with the MERN stack, Google Gemini AI, and ImageKit.

## Live Demo

- **Frontend:** https://aurora-ai-jet.vercel.app
- **Backend API:** https://aurora-ai-server-eta.vercel.app

---

## Screenshots

| Home                                        | Chat                                        |
| ------------------------------------------- | ------------------------------------------- |
| ![Home](client/public/screenshots/home.png) | ![Chat](client/public/screenshots/chat.png) |

| Dark Mode                                            | Credits                                           |
| ---------------------------------------------------- | ------------------------------------------------- |
| ![Dark Mode](client/public/screenshots/darkmode.png) | ![Credits](client/public/screenshots/credits.png) |

| Community                                             | Login                                         |
| ----------------------------------------------------- | --------------------------------------------- |
| ![Community](client/public/screenshots/community.png) | ![Login](client/public/screenshots/login.png) |

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture Diagrams](#architecture-diagrams)
4. [Project Structure](#project-structure)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Getting Started](#getting-started)
8. [Environment Variables](#environment-variables)
9. [How It Works](#how-it-works)
10. [Author](#author)

---

## Features

### Core Features

- **AI Chat** — Powered by Google Gemini 2.0 Flash for intelligent conversations
- **AI Image Generation** — Create images from text prompts via ImageKit
- **Multi-Chat Management** — Create, switch, search, and delete conversations
- **Community Gallery** — Share and browse AI-generated images from all users

### Credit System

- **Three Pricing Tiers** — Basic ($10/100 credits), Pro ($20/500 credits), Premium ($30/1000 credits)
- **Stripe Integration** — Secure payment processing with webhook verification
- **Real-time Tracking** — Credits update instantly after purchase
- **Usage Costs** — Text: 1 credit, Image: 2 credits

### User Experience

- **Dark/Light Mode** — Theme persists across sessions via localStorage
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Markdown Support** — AI responses render with full markdown and code syntax highlighting
- **Real-time Updates** — Messages appear instantly with smooth scrolling

---

## Tech Stack

### Frontend

| Technology         | Purpose                  |
| ------------------ | ------------------------ |
| React 19           | UI library               |
| TypeScript         | Type safety              |
| Vite               | Build tool & dev server  |
| TailwindCSS 4      | Styling                  |
| React Router DOM 7 | Client-side routing      |
| Axios              | HTTP client              |
| React Markdown     | Render AI responses      |
| Prism.js           | Code syntax highlighting |
| React Hot Toast    | Notifications            |
| Moment.js          | Date formatting          |

### Backend

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| Node.js            | Runtime                    |
| TypeScript         | Type safety                |
| Express 5          | Web framework              |
| MongoDB + Mongoose | Database                   |
| JWT                | Authentication             |
| Bcrypt.js          | Password hashing           |
| Stripe             | Payment processing         |
| OpenAI SDK         | Gemini API client          |
| ImageKit           | Image generation & storage |

---

## Architecture Diagrams

### 1. High-Level System Architecture

This diagram shows how the major components of the system connect together.

```mermaid
flowchart TB
    subgraph Client["Frontend (React + Vite)"]
        UI[User Interface]
        CTX[App Context]
        API[Axios API Client]
    end

    subgraph Server["Backend (Express.js)"]
        MW[Auth Middleware]
        RT[Routes]
        CTRL[Controllers]
    end

    subgraph External["External Services"]
        GEMINI[Google Gemini API]
        IMGKIT[ImageKit]
        STRIPE[Stripe]
    end

    subgraph Database["Database"]
        MONGO[(MongoDB Atlas)]
    end

    UI --> CTX
    CTX --> API
    API -->|HTTP Requests| MW
    MW -->|Authenticated| RT
    RT --> CTRL
    CTRL -->|AI Text| GEMINI
    CTRL -->|AI Images| IMGKIT
    CTRL -->|Payments| STRIPE
    CTRL -->|CRUD| MONGO
    STRIPE -->|Webhooks| RT
```

### 2. Frontend Component Architecture

This shows how React components are organized and how data flows through the app.

```mermaid
flowchart TB
    subgraph Entry["Entry Point"]
        MAIN[main.tsx]
    end

    subgraph Providers["Providers"]
        BR[BrowserRouter]
        AP[AppProvider]
    end

    subgraph AppComponent["App.tsx"]
        APP[App Component]
    end

    subgraph Layout["Layout Components"]
        SB[Sidebar]
        CB[ChatBox]
    end

    subgraph Pages["Pages"]
        LOGIN[Login]
        CREDITS[Credits]
        COMMUNITY[Community]
        LOADING[Loading]
    end

    subgraph Shared["Shared Components"]
        MSG[Message]
    end

    subgraph Context["Context (AppContext)"]
        USER[User State]
        CHATS[Chats State]
        THEME[Theme State]
        TOKEN[Token State]
    end

    MAIN --> BR
    BR --> AP
    AP --> APP
    APP --> SB
    APP --> CB
    APP --> LOGIN
    APP --> CREDITS
    APP --> COMMUNITY
    APP --> LOADING
    CB --> MSG
    AP --> Context
    SB -.->|uses| Context
    CB -.->|uses| Context
    LOGIN -.->|uses| Context
    CREDITS -.->|uses| Context
```

### 3. Backend Architecture

This shows the server-side structure with middleware, routes, and controllers.

```mermaid
flowchart LR
    subgraph Incoming["Incoming Request"]
        REQ[HTTP Request]
    end

    subgraph Middleware["Middleware Layer"]
        CORS[CORS]
        JSON[JSON Parser]
        AUTH[JWT Auth]
        ERR[Error Handler]
    end

    subgraph Routes["Route Layer"]
        UR[/api/user]
        CR[/api/chat]
        MR[/api/message]
        CRR[/api/credit]
        SR[/api/stripe]
    end

    subgraph Controllers["Controller Layer"]
        UC[userController]
        CC[chatController]
        MC[messageController]
        CRC[creditController]
        WH[webhooks]
    end

    subgraph Services["External Services"]
        DB[(MongoDB)]
        GEM[Gemini API]
        IK[ImageKit]
        ST[Stripe]
    end

    REQ --> CORS
    CORS --> JSON
    JSON --> Routes
    UR --> AUTH
    CR --> AUTH
    MR --> AUTH
    CRR --> AUTH
    AUTH --> Controllers
    SR --> WH
    UC --> DB
    CC --> DB
    MC --> DB
    MC --> GEM
    MC --> IK
    CRC --> DB
    CRC --> ST
    WH --> DB
    WH --> ST
    Controllers --> ERR
```

### 4. Authentication Flow

This shows how user registration, login, and protected routes work.

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant S as Server
    participant DB as MongoDB

    Note over U,DB: Registration Flow
    U->>C: Fill registration form
    C->>S: POST /api/user/register
    S->>S: Hash password (bcrypt)
    S->>DB: Create user document
    DB-->>S: User created
    S->>S: Generate JWT token
    S-->>C: Return token
    C->>C: Store token in localStorage
    C-->>U: Redirect to chat

    Note over U,DB: Login Flow
    U->>C: Enter credentials
    C->>S: POST /api/user/login
    S->>DB: Find user by email
    DB-->>S: User document
    S->>S: Compare password (bcrypt)
    S->>S: Generate JWT token
    S-->>C: Return token
    C->>C: Store token in localStorage
    C-->>U: Redirect to chat

    Note over U,DB: Protected Route Access
    U->>C: Access protected page
    C->>S: GET /api/user/data (with token)
    S->>S: Verify JWT token
    S->>DB: Find user by ID
    DB-->>S: User data
    S-->>C: Return user profile
    C-->>U: Display user data
```

### 5. Chat Message Flow

This shows what happens when a user sends a text message or generates an image.

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant S as Server
    participant G as Gemini API
    participant I as ImageKit
    participant DB as MongoDB

    Note over U,DB: Text Message Flow
    U->>C: Type message & submit
    C->>C: Add user message to UI
    C->>S: POST /api/message/text
    S->>S: Verify credits >= 1
    S->>DB: Save user message to chat
    S->>G: Send prompt to Gemini
    G-->>S: AI response
    S->>DB: Save AI response to chat
    S->>DB: Deduct 1 credit from user
    S-->>C: Return AI response
    C->>C: Add AI message to UI
    C-->>U: Display response

    Note over U,DB: Image Generation Flow
    U->>C: Enter prompt & select image mode
    C->>C: Add user prompt to UI
    C->>S: POST /api/message/image
    S->>S: Verify credits >= 2
    S->>DB: Save user prompt to chat
    S->>I: Generate image from prompt
    I-->>S: Generated image URL
    S->>I: Upload to ImageKit storage
    I-->>S: Permanent image URL
    S->>DB: Save image URL to chat
    S->>DB: Deduct 2 credits from user
    S-->>C: Return image URL
    C->>C: Display generated image
    C-->>U: Show image in chat
```

### 6. Payment Flow (Stripe Integration)

This shows the complete payment process for purchasing credits.

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant S as Server
    participant ST as Stripe
    participant DB as MongoDB

    Note over U,DB: Purchase Flow
    U->>C: Select credit plan
    C->>S: POST /api/credit/purchase
    S->>DB: Create transaction (isPaid: false)
    S->>ST: Create checkout session
    ST-->>S: Checkout URL
    S-->>C: Return checkout URL
    C->>C: Redirect to Stripe

    Note over U,DB: Stripe Checkout
    U->>ST: Complete payment
    ST-->>U: Success page redirect
    U->>C: Redirect to /loading

    Note over U,DB: Webhook Processing
    ST->>S: POST /api/stripe (webhook)
    S->>S: Verify Stripe signature
    S->>S: Extract transaction ID from metadata
    S->>DB: Find transaction by ID
    S->>DB: Add credits to user
    S->>DB: Mark transaction isPaid: true
    S-->>ST: Acknowledge webhook

    Note over U,DB: Credit Update
    C->>S: GET /api/user/data
    S->>DB: Fetch updated user
    S-->>C: Return user with new credits
    C-->>U: Display updated credit balance
```

### 7. State Management Flow (React Context)

This shows how the AppContext manages global state across the application.

```mermaid
flowchart TB
    subgraph AppContext["AppContext Provider"]
        subgraph State["State"]
            USER[user: UserType | null]
            CHATS[chats: ChatType[]]
            SELECTED[selectedChat: ChatType | null]
            TOKEN[token: string | null]
            THEME[theme: 'light' | 'dark']
            LOADING[loadingUser: boolean]
        end

        subgraph Actions["Actions"]
            FETCH_USER[fetchUser]
            FETCH_CHATS[fetchUsersChats]
            CREATE_CHAT[createNewChat]
            SET_USER[setUser]
            SET_TOKEN[setToken]
            SET_THEME[setTheme]
        end
    end

    subgraph Effects["useEffect Triggers"]
        E1[Token changes → fetchUser]
        E2[User changes → fetchChats]
        E3[Theme changes → Update DOM]
    end

    subgraph Storage["Persistence"]
        LS_TOKEN[localStorage: token]
        LS_THEME[localStorage: theme]
    end

    TOKEN --> E1
    USER --> E2
    THEME --> E3
    E3 --> LS_THEME
    SET_TOKEN --> LS_TOKEN
    LS_TOKEN --> TOKEN
    LS_THEME --> THEME
```

### 8. Database Schema (ERD)

This shows the MongoDB collections and their relationships.

```mermaid
erDiagram
    USER ||--o{ CHAT : "creates"
    USER ||--o{ TRANSACTION : "makes"
    CHAT ||--|{ MESSAGE : "contains"

    USER {
        ObjectId _id PK
        String name "required"
        String email "unique, required"
        String password "hashed, required"
        Number credits "default: 20"
        Date createdAt "auto"
        Date updatedAt "auto"
    }

    CHAT {
        ObjectId _id PK
        ObjectId userId FK "ref: User"
        String userName "required"
        String name "required, default: New Chat"
        Array messages "embedded"
        Date createdAt "auto"
        Date updatedAt "auto"
    }

    MESSAGE {
        String role "user | assistant"
        String content "text or image URL"
        Number timestamp "Date.now()"
        Boolean isImage "required"
        Boolean isPublished "default: false"
    }

    TRANSACTION {
        ObjectId _id PK
        ObjectId userId FK "ref: User"
        String planId "basic | pro | premium"
        Number amount "in USD"
        Number credits "credits purchased"
        Boolean isPaid "default: false"
        Date createdAt "auto"
        Date updatedAt "auto"
    }
```

### 9. Request-Response Lifecycle

This shows the complete lifecycle of an API request from client to server and back.

```mermaid
flowchart TB
    subgraph Client["Client Side"]
        A[User Action] --> B[Component Handler]
        B --> C[API Call via Axios]
        C --> D{Add Auth Header?}
        D -->|Protected Route| E[Add Bearer Token]
        D -->|Public Route| F[No Token]
        E --> G[Send Request]
        F --> G
    end

    subgraph Network["Network"]
        G --> H[HTTP Request]
        H --> I[Server]
    end

    subgraph Server["Server Side"]
        I --> J[CORS Middleware]
        J --> K[JSON Parser]
        K --> L[Route Matcher]
        L --> M{Protected?}
        M -->|Yes| N[Auth Middleware]
        M -->|No| O[Controller]
        N --> P{Valid Token?}
        P -->|Yes| Q[Attach user to req]
        P -->|No| R[401 Error]
        Q --> O
        O --> S[Business Logic]
        S --> T[Database Operation]
        T --> U[Format Response]
        U --> V[Send Response]
        R --> W[Error Handler]
        W --> V
    end

    subgraph Response["Response Handling"]
        V --> X[HTTP Response]
        X --> Y[Axios Receives]
        Y --> Z{Success?}
        Z -->|Yes| AA[Update State]
        Z -->|No| AB[Show Error Toast]
        AA --> AC[Re-render UI]
        AB --> AC
    end
```

### 10. Deployment Architecture

This shows how the application is deployed across different services.

```mermaid
flowchart TB
    subgraph Users["Users"]
        BROWSER[Web Browser]
    end

    subgraph Vercel["Vercel Platform"]
        subgraph FE["Frontend Deployment"]
            VITE_BUILD[Vite Build Output]
            CDN[Vercel CDN]
        end

        subgraph BE["Backend Deployment"]
            SERVERLESS[Serverless Functions]
        end
    end

    subgraph External["External Services"]
        MONGO[(MongoDB Atlas)]
        STRIPE[Stripe API]
        GEMINI[Google Gemini API]
        IMAGEKIT[ImageKit CDN]
    end

    BROWSER -->|HTTPS| CDN
    CDN --> VITE_BUILD
    BROWSER -->|API Calls| SERVERLESS
    SERVERLESS --> MONGO
    SERVERLESS --> STRIPE
    SERVERLESS --> GEMINI
    SERVERLESS --> IMAGEKIT
    STRIPE -->|Webhooks| SERVERLESS
```

---

## Project Structure

```
auroraai/
├── client/                     # Frontend React application
│   ├── public/                 # Static assets
│   │   └── screenshots/        # App screenshots for README
│   ├── src/
│   │   ├── api/
│   │   │   └── api.ts          # Axios instance & auth token helper
│   │   ├── assets/
│   │   │   ├── assets.ts       # Asset exports
│   │   │   └── *.svg           # Icons and images
│   │   ├── components/
│   │   │   ├── ChatBox.tsx     # Main chat interface
│   │   │   ├── Message.tsx     # Individual message display
│   │   │   └── Sidebar.tsx     # Navigation & chat list
│   │   ├── context/
│   │   │   ├── AppContext.tsx  # Global state provider
│   │   │   └── AppContextValue.ts # Context creation & hook
│   │   ├── pages/
│   │   │   ├── Community.tsx   # Public image gallery
│   │   │   ├── Credits.tsx     # Purchase credits page
│   │   │   ├── Loading.tsx     # Loading/redirect page
│   │   │   └── Login.tsx       # Authentication form
│   │   ├── types/
│   │   │   ├── chat.ts         # Chat & message types
│   │   │   ├── context.ts      # Context type definitions
│   │   │   ├── message.ts      # Message type
│   │   │   ├── plan.ts         # Credit plan type
│   │   │   └── user.ts         # User type
│   │   ├── utils/
│   │   │   └── handleError.ts  # Error handling utility
│   │   ├── App.tsx             # Root component with routing
│   │   ├── main.tsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vercel.json             # Vercel SPA configuration
│
└── server/                     # Backend Express application
    ├── src/
    │   ├── configs/
    │   │   ├── db.ts           # MongoDB connection
    │   │   ├── imageKit.ts     # ImageKit client setup
    │   │   ├── openai.ts       # Gemini API client setup
    │   │   └── validateEnv.ts  # Environment validation
    │   ├── controllers/
    │   │   ├── chatController.ts    # Chat CRUD operations
    │   │   ├── creditController.ts  # Plans & purchases
    │   │   ├── messageController.ts # AI text & image
    │   │   ├── userController.ts    # Auth & user data
    │   │   └── webhooks.ts          # Stripe webhook handler
    │   ├── middleware/
    │   │   ├── auth.ts         # JWT verification
    │   │   └── errorHandler.ts # Global error handler
    │   ├── models/
    │   │   ├── Chat.ts         # Chat schema
    │   │   ├── Transaction.ts  # Transaction schema
    │   │   └── User.ts         # User schema with password hashing
    │   ├── routes/
    │   │   ├── chatRoutes.ts   # /api/chat routes
    │   │   ├── creditRoutes.ts # /api/credit routes
    │   │   ├── messageRoutes.ts # /api/message routes
    │   │   └── userRoutes.ts   # /api/user routes
    │   ├── types/
    │   │   └── express.d.ts    # Express type augmentation
    │   ├── utils/
    │   │   └── asyncHandler.ts # Async error wrapper
    │   └── server.ts           # Express app entry point
    ├── package.json
    ├── tsconfig.json
    └── vercel.json             # Vercel serverless configuration
```

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint                     | Auth | Description              |
| ------ | ---------------------------- | ---- | ------------------------ |
| POST   | `/api/user/register`         | No   | Create new user account  |
| POST   | `/api/user/login`            | No   | Authenticate user        |
| GET    | `/api/user/data`             | Yes  | Get current user profile |
| GET    | `/api/user/published-images` | No   | Get community images     |

#### POST /api/user/register

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST /api/user/login

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Chat Endpoints

| Method | Endpoint           | Auth | Description          |
| ------ | ------------------ | ---- | -------------------- |
| POST   | `/api/chat/create` | Yes  | Create new chat      |
| GET    | `/api/chat/list`   | Yes  | Get all user's chats |
| POST   | `/api/chat/delete` | Yes  | Delete a chat        |

### Message Endpoints

| Method | Endpoint             | Auth | Credits | Description                 |
| ------ | -------------------- | ---- | ------- | --------------------------- |
| POST   | `/api/message/text`  | Yes  | 1       | Send text & get AI response |
| POST   | `/api/message/image` | Yes  | 2       | Generate AI image           |

#### POST /api/message/text

**Request Body:**

```json
{
  "chatId": "507f1f77bcf86cd799439011",
  "prompt": "Explain quantum computing in simple terms"
}
```

**Response:**

```json
{
  "success": true,
  "reply": {
    "role": "assistant",
    "content": "Quantum computing is...",
    "timestamp": 1704067200000,
    "isImage": false
  }
}
```

#### POST /api/message/image

**Request Body:**

```json
{
  "chatId": "507f1f77bcf86cd799439011",
  "prompt": "A sunset over mountains",
  "isPublished": true
}
```

**Response:**

```json
{
  "success": true,
  "reply": {
    "role": "assistant",
    "content": "https://ik.imagekit.io/...",
    "timestamp": 1704067200000,
    "isImage": true,
    "isPublished": true
  }
}
```

### Credit Endpoints

| Method | Endpoint               | Auth | Description         |
| ------ | ---------------------- | ---- | ------------------- |
| GET    | `/api/credit/plan`     | No   | Get available plans |
| POST   | `/api/credit/purchase` | Yes  | Start purchase flow |

#### GET /api/credit/plan

**Response:**

```json
{
  "success": true,
  "plans": [
    {
      "_id": "basic",
      "name": "Basic",
      "price": 10,
      "credits": 100,
      "features": ["100 text generations", "50 image generations", "..."]
    }
  ]
}
```

### Webhook Endpoint

| Method | Endpoint      | Description            |
| ------ | ------------- | ---------------------- |
| POST   | `/api/stripe` | Stripe webhook handler |

---

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,           // Required
  email: String,          // Required, Unique
  password: String,       // Required, Hashed with bcrypt
  credits: Number,        // Default: 20
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

### Chat Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // Reference to User
  userName: String,       // Denormalized for community display
  name: String,           // Default: "New Chat"
  messages: [             // Embedded array
    {
      role: String,       // "user" | "assistant"
      content: String,    // Text or image URL
      timestamp: Number,  // Date.now()
      isImage: Boolean,
      isPublished: Boolean
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // Reference to User
  planId: String,         // "basic" | "pro" | "premium"
  amount: Number,         // Price in USD
  credits: Number,        // Credits purchased
  isPaid: Boolean,        // Default: false, set true by webhook
  createdAt: Date,
  updatedAt: Date
}
```

---

## Getting Started

### Prerequisites

- **Node.js** 20 or higher
- **pnpm** (recommended) or npm
- **MongoDB Atlas** account (free tier works)
- **Stripe** account (test mode for development)
- **Google AI Studio** account (for Gemini API key)
- **ImageKit** account (free tier available)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/VIKRAMANR7/auroraai.git
cd auroraai
```

2. **Install server dependencies**

```bash
cd server
pnpm install
```

3. **Install client dependencies**

```bash
cd ../client
pnpm install
```

4. **Set up environment variables** (see next section)

5. **Start development servers**

```bash
# Terminal 1 - Start backend
cd server
pnpm dev

# Terminal 2 - Start frontend
cd client
pnpm dev
```

6. **Open the app**

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Environment Variables

### Server (`server/.env`)

```bash
# Server Port
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your_super_secret_jwt_key_here

# Stripe (get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google Gemini API (get from Google AI Studio)
GEMINI_API_KEY=AIza...

# ImageKit (get from ImageKit Dashboard)
IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

### Client (`client/.env`)

```bash
# Backend API URL
VITE_BASE_URL=http://localhost:5000
```

### How to Get API Keys

| Service        | Where to Get                                                            |
| -------------- | ----------------------------------------------------------------------- |
| MongoDB URI    | [MongoDB Atlas](https://cloud.mongodb.com) → Create Cluster → Connect   |
| Stripe Keys    | [Stripe Dashboard](https://dashboard.stripe.com/apikeys)                |
| Gemini API Key | [Google AI Studio](https://aistudio.google.com/apikey)                  |
| ImageKit Keys  | [ImageKit Dashboard](https://imagekit.io/dashboard) → Developer Options |

---

## How It Works

### 1. User Authentication

When a user registers or logs in:

1. Password is hashed using bcrypt (10 salt rounds)
2. User document is created/verified in MongoDB
3. JWT token is generated with user ID
4. Token is returned to client and stored in localStorage
5. All subsequent API requests include the token in Authorization header

### 2. Chat System

Each user can have multiple chats:

1. Chats are created with an empty messages array
2. Messages are embedded documents within the chat
3. Each message has a role (user/assistant), content, and timestamp
4. Chats are sorted by updatedAt for recent-first display

### 3. AI Integration

**Text Messages:**

1. User prompt is sent to Google Gemini 2.0 Flash via OpenAI-compatible API
2. AI response is saved to the chat
3. 1 credit is deducted from user

**Image Generation:**

1. Prompt is encoded and sent to ImageKit's AI generation endpoint
2. Generated image is uploaded to ImageKit storage
3. Permanent URL is saved to the chat
4. 2 credits are deducted from user
5. If `isPublished: true`, image appears in community gallery

### 4. Payment System

1. User selects a plan → Transaction created with `isPaid: false`
2. Stripe checkout session created with transaction ID in metadata
3. User completes payment on Stripe
4. Stripe sends webhook to `/api/stripe`
5. Server verifies signature and finds transaction
6. Credits added to user, transaction marked `isPaid: true`

### 5. Theme System

1. Theme state stored in React Context
2. On change, `dark` class is toggled on `<html>` element
3. Theme preference saved to localStorage
4. On app load, theme is restored from localStorage

---

## Scripts

### Client

```bash
pnpm dev        # Start Vite dev server
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm typecheck  # Run TypeScript type checking
pnpm lint       # Run ESLint
pnpm format     # Format code with Prettier
```

### Server

```bash
pnpm dev        # Start with tsx watch mode
pnpm build      # Compile TypeScript
pnpm start      # Run compiled JavaScript
pnpm typecheck  # Run TypeScript type checking
pnpm lint       # Run ESLint
pnpm format     # Format code with Prettier
```

---

## Deployment

### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Set root directory to `client`
3. Add environment variable: `VITE_BASE_URL=https://your-backend.vercel.app`
4. Deploy

### Backend (Vercel)

1. Connect GitHub repository to Vercel
2. Set root directory to `server`
3. Add all environment variables from `.env`
4. Deploy
5. Update Stripe webhook URL to `https://your-backend.vercel.app/api/stripe`

---

## What I Learned

This project helped me understand and implement:

### TypeScript Best Practices

- **Type Inference** — Let TypeScript infer types instead of adding redundant annotations like `const name: string = "John"`
- **Function Declarations** — Use `function handleClick()` instead of `const handleClick = () =>` for components and handlers
- **Interface vs Type** — Use `interface` for objects (User, Chat), `type` for unions (`"user" | "assistant"`)
- **Generics** — Only use when TypeScript can't infer (e.g., `useState<User | null>(null)`, `useState<Chat[]>([])`)
- **Type Assertions** — Use `as` only for validated external data (JWT payload, Stripe events), centralized in one place
- **Avoid `any`** — Use `unknown` with type narrowing instead

### React Patterns

- **Context API** — Global state management for user, chats, theme, and authentication
- **Custom Hooks** — `useAppContext()` for type-safe context access with runtime error if used outside provider
- **useEffect Organization** — Move async functions inside useEffect to avoid stale closures and unnecessary dependencies
- **useCallback** — Only needed when passing functions to `memo()` components; removed from this project as no components are memoized
- **Conditional Rendering** — Early returns for loading states (`if (loading) return <Loading />`)
- **Controlled Components** — Form inputs bound to state with onChange handlers

### Backend Architecture

- **MVC Pattern** — Clear separation: Routes (URL mapping) → Controllers (business logic) → Models (data layer)
- **Middleware Chain** — CORS → JSON Parser → Route Matching → Auth → Controller → Error Handler
- **Async Handler** — Higher-order function to catch async errors and pass to error middleware
- **Environment Validation** — Fail fast on startup if required env vars are missing (before any requests)
- **Type Augmentation** — Extend Express `Request` type to include `user` property after authentication

### Authentication & Security

- **JWT Flow** — Token generated on login, stored in localStorage, sent in Authorization header
- **Password Hashing** — Bcrypt with salt rounds, using Mongoose pre-save hook
- **Protected Routes** — Middleware verifies JWT and attaches user to request
- **Webhook Security** — Stripe signature verification to prevent spoofed requests

### Payment Integration

- **Stripe Checkout** — Create session with metadata, redirect to hosted payment page
- **Webhook Pattern** — Async payment confirmation via POST to `/api/stripe`
- **Idempotency** — Check `isPaid: false` before adding credits to prevent double-processing
- **Transaction Records** — Audit trail of all purchase attempts

### External API Integration

- **OpenAI SDK for Gemini** — Using OpenAI-compatible endpoint with Google's Gemini models
- **ImageKit** — AI image generation via URL pattern, then upload to permanent storage
- **Error Handling** — Graceful degradation with user-friendly error messages via toast notifications

### Deployment

- **Vercel Serverless** — Backend runs as serverless functions, not persistent server
- **Environment Variables** — Separate `.env` files for client (VITE\_ prefix) and server
- **SPA Routing** — Vercel rewrites config to handle client-side routing

---

## Author

**Vikraman R** — [@VIKRAMANR7](https://github.com/VIKRAMANR7)

---
