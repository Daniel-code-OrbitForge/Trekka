# Trekka Git Branching Strategy
We use a structured Git workflow for safe development.

## Main Branches
| Branch   | Purpose |
|----------|----------|____________
| main     | Production-ready code |____
| dev      | Combined development stage |
| frontend | Frontend development |
| backend  | Backend development |___
| docs     | Technical documentation |

---

## Feature Branch Naming
Always create a branch when working:

**Format:**
- feature/fix/
```bash
Examples:
feature/user-authentication fix/login-page-validation
```

---

## Workflow
1. Pull latest code
2. Create feature branch
3. Commit progress
4. Push branch
5. Create Pull Request to dev
6. Code review required
7. Merge approved code

## Pull Request Template
Create folder: .github/ and file: .github/pull_request_template.md

```bash
### Description
Explain what this PR does:

---

### Changes Made
- [ ] Feature added
- [ ] Bug fixed
- [ ] UI updated
- [ ] Backend logic
- [ ] Documentation added

---

### Related Issues
Fixes: #

---

### Checklist
- [ ] Code runs without errors
- [ ] Code follows folder structure
- [ ] No console errors
- [ ] Tested locally
```

## Issue Templates
Create folder: github/ISSUE_TEMPLATE/
```bash
---
name: Bug Report
about: Report a problem
---

### Bug Description
<!-- What went wrong? -->

### Steps to Reproduce
1.
2.
3.

### Screenshot
(optional)

### Device Info
Browser:
OS:
```

## Features_request.md
```bash
---
name: Feature Request
about: Suggest a new feature
---

### Suggestion
<!-- Describe your feature idea -->

### Why It Matters
<!-- Explain benefit -->

### Possible Solution
(optional)
```

## Security Policy
Create file: SECURITY.md
```bash
# Security Policy

If you discover a security vulnerability in Trekka, please DO NOT open a GitHub issue.

Instead, report it directly to the team:
security@trekka.com

We will investigate and respond quickly.
```

---

## GitHub Repository Setup (MONOREPO)(for newbies)
Below are the exact steps to create and initialize the Trekka repo properly so your whole team can start work immediately.
**Step 1:** Create GitHub Repo
- Go to GitHub -> Click New Repository
- Name it: your-project-name
- Visibility: Public (so team members can clone easily) or Private (if you prefer control)
- DO NOT tick “Add README” 
- Click Create Repository

**Step 2:** Connect Local Files
Once your folder structure is created locally, run these commands:

```bash
git init
git branch -M main
git add .
git commit -m "Initial commit - Trekka monorepo setup"
git remote add origin https://github.com/<your-username>/(your-project).git
git push -u origin main
```

**Step 3:** Create Development Branches

```bash
git checkout -b dev
git push origin dev

git checkout -b frontend
git push origin frontend

git checkout -b backend
git push origin backend

git checkout -b docs
git push origin docs

git checkout main
```
**Step 4:** Protect Main Branch (Very Important)
On GitHub:
Go to Repo Settings -> Branches -> Branch Protection Rules
Protect main and dev
**Enable:** Require Pull Request before merging
- Require code review (at least 1 approval)
- Block direct push to main and dev

**Step 5:** Invite Team Members
Go to: Repo -> Settings -> Collaborators -> Add People Invite: 
- Frontend Team
- Backend Team
- PM
- QA/Testers
- Docs/Tech Writers
**Each team member will clone:**
```bash
git clone https://github.com/<your-username>/trekka.git
cd trekka
git checkout dev
```
# BONUS –> Branch Naming Guide For Team
----------------------------
| Purpose       | Example   |_________
| Feature work  | feature/user-signup |
| Fix bug       | fix/payment-error |
| UI change     | ui/header-navbar |
| Documentation | docs/setup-guide |
---