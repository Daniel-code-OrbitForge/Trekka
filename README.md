# Trekka –> Africa's Smart Transport Booking Platform

Trekka is a web application that connects passengers with transport companies across Africa, allowing users to book verified interstate and intercountry trips safely.

---

## Tech Stack
|     Layer    | Technology |
|--------------|------------|
|   Frontend   | HTML, CSS, JavaScript |
|   Backend    | Node.js, Express.js |
|   Database   | MongoDB & SQL (Hybrid) |
|   Payments   | Paystack, Flutterwave (Test mode) |
| Architecture | Modular MVC |

---

## Monorepo Structure
- /frontend -> UI Screens
- /backend  -> REST API
- /docs     -> Technical documentation
- /qaTesting -> Test cases & bug reports 
- /projectManagement -> Sprint planning & roadmap

---

## Features
- User & Company Authentication
- Fleet & Driver Management
- Live Booking System
- Admin Control Panel
- Email Alerts
- Payment Integration
- Role-Based Access

---

## Teams
- Frontend
- Backend
- UI/UX Design
- QA Testing
- Technical Documentation
- Project Management

---

## Setup Instructions
Backend:
```bash
cd backend
npm install
npm run dev
```

---

**Frontend:** Open HTML files directly in browser

---

# Status
**Project Development Phase: INITIAL SETUP**

---

### 3. Add CONTRIBUTING.md

File: trekka/CONTRIBUTING.md

```markdown
# Contribution Guidelines

Thank you for contributing to Trekka!

## Git Rules
- Main branches:
  - main -> Production code
  - dev -> Development base
  - frontend -> Frontend team
  - backend -> Backend team
  - docs -> Documentation team

**Always create a new branch before working:**
```bash
git checkout -b feature-user-auth
```

**Always write meaningful commit message:**
```bash
git commit -m "Added user registration route"
```

- **Submit code using Pull Requests**
- **Every code must be reviewed before merge**

---

## Code Standards
- Comment your code
- Use clean naming
- Follow folder structure
---