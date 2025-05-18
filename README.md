
# Uganda Clinical Case Reports (UCCR)

A Next.js application for doctors, medical students, and healthcare professionals to share and discuss clinical cases from Uganda.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Firebase Configuration

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable Email/Password authentication in the Authentication section.
3. Set up Firestore Database and Storage.
4. Update Firestore security rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
5. Update Storage security rules:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

## Deployment

Deploy to Firebase Hosting:
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login to Firebase:
   ```bash
   firebase login
   ```
3. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
4. Build and deploy:
   ```bash
   npm run build && firebase deploy
   ```

## Features
- Firebase Authentication (Email/Password)
- Case creation with title, presenting complaint, history, investigations, management, and optional image upload
- Case discussions with comments and reactions (Like, Insightful, Dislike)
- User profiles with photo upload
- Private messaging between users
- Responsive design with plain CSS

## Directory Structure
```
uccr/
├── public/
│   ├── favicon.ico
│   └── images/
│       └── placeholder.png
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Case/
│   │   ├── Profile/
│   │   ├── Chat/
│   │   ├── Navbar.js
│   │   └── Footer.js
│   ├── pages/
│   │   ├── index.js
│   │   ├── cases/
│   │   ├── profile/
│   │   ├── inbox/
│   │   ├── login.js
│   │   └── signup.js
│   ├── styles/
│   │   └── globals.css
│   ├── firebase/
│   │   ├── config.js
│   │   ├── auth.js
│   │   ├── firestore.js
│   │   └── storage.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCases.js
│   │   └── useMessages.js
│   ├── utils/
│   │   └── constants.js
│   └── lib/
│       └── types.js
├── .gitignore
├── next.config.js
├── package.json
├── README.md
└── firebase.json
```

## Technologies
- Next.js 14.2.3
- React 18.2.0
- Firebase 10.12.2
- Plain CSS for styling

## Contributing
Submit pull requests or open issues on the project repository for suggestions and improvements.

## License
© 2025 Uganda Clinical Case Reports
