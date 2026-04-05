# College Skill Exchange - Complete Platform

A comprehensive skill-sharing platform connecting students and tutors for peer-to-peer learning.

## Features

### Authentication
- Sign In / Sign Up with role selection (Student, Tutor, Admin)
- Google OAuth simulation with role-based accounts
- Dark/Light theme toggle

### Student Dashboard
- **Overview**: Progress tracking, credit balance, daily goals
- **Find Tutors**: AI-powered tutor matching with skill prioritization
  - Exact skill matches shown first with match percentage
  - Suggested tutors displayed below
  - Real-time filtering by skill categories
- **My Courses**: Track active and completed courses
- **Credits**: View balance and transaction history
- **Saved Notes**: Learning materials storage
- **Profile**: Account management

### Tutor Dashboard
- **Overview**: Platform analytics with activity charts
- **Student Requests**: Review and manage incoming tutoring requests
  - Accept/Reject functionality
  - View student messages and requested skills
- **Active Courses**: Ongoing tutoring sessions
- **Credits**: Earnings tracking and history
- **Reviews**: Student feedback and ratings (4.9⭐ average)
- **Profile**: Tutor profile management

### Admin Dashboard
- **Overview**: Platform statistics and alerts
- **User Management**: Manage students, tutors, and accounts
- Platform health monitoring
- System analytics

### Global Features
- **AI Chatbot**: Contextual help and tutor suggestions
  - Credit system explanations
  - Navigation guidance
  - Course status tracking
  - Smart responses based on current page
- **Notifications Panel**: Real-time updates
  - Credits earned
  - Request acceptances
  - Course completions
  - 5 notification categories
- **Responsive Design**: Mobile-first approach
  - Mobile bottom navigation
  - Desktop sidebar navigation
  - Adaptive layouts

## Tech Stack
- React 18
- TypeScript
- React Router (Data Mode)
- Tailwind CSS v4
- Recharts (Analytics)
- Radix UI Components
- Lucide Icons
- Motion/Framer Motion (Animations)

## Key Concepts

### Credit System
- Students start with 50 credits
- Course enrollment: -2 credits
- Course completion: +7 credits
- Tutors earn credits for teaching

### Connection States
1. **None**: No interaction
2. **Requested**: Student sent request
3. **Accepted**: Tutor approved
4. **Rejected**: Tutor declined
5. **Active**: Course in progress
6. **Completed**: Course finished

### AI Matching Algorithm
1. Filter tutors by selected skill
2. Sort exact matches by rating and experience
3. Display suggested tutors (related skills)
4. Show match percentage for transparency

## Navigation Structure
```
/                    - Sign In
/signup              - Sign Up
/student             - Student Dashboard
  /find-tutors       - Browse and request tutors
  /courses           - My active courses
  /credits           - Credit management
  /notes             - Saved learning materials
  /profile           - Student profile
/tutor               - Tutor Dashboard
  /requests          - Pending student requests
  /active-courses    - Current teaching sessions
  /credits           - Earnings
  /reviews           - Student feedback
  /profile           - Tutor profile
/admin               - Admin Dashboard
  /users             - User management
```

## Quick Start

### Demo Accounts
- **Student**: student@gmail.com
- **Tutor**: tutor@gmail.com
- **Admin**: admin@gmail.com

### Default State
- 50 student credits
- 120 tutor credits
- 2 pending course requests
- 5 notifications
- 3 tutors available

## Color Theme
### Light Mode
- Primary: #2563EB (Blue)
- Accent: #14B8A6 (Teal)
- Background: #F8FAFC
- Cards: White

### Dark Mode
- Primary: #3B82F6 (Blue)
- Accent: #22D3EE (Cyan)
- Background: #0F172A
- Cards: #1E293B
"# skillswap" 
"# skillswap" 
"# skillswap-1" 
