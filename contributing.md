# Contributing Guide

## 1. Basic Rule

**Never push directly to `main`.**

Har task ke liye:

```text
Issue → Branch → Code → Test → Push → PR → Review → Merge
```

---

## 2. Start Working

Latest code lo:

```bash
git checkout main
git pull origin main
```

Apne Issue ke liye branch banao:

```bash
git checkout -b feature/issue-12-login
```

Example:

```bash
git checkout -b feature/issue-25-attendance-detection
```

---

## 3. Work on Your Task

Sirf apne assigned Issue ka kaam karo.

Code complete hone ke baad **properly test karo**.

---

## 4. Check Your Changes

```bash
git status
```

Changes dekho:

```bash
git diff
```

---

## 5. Commit

Files add karo:

```bash
git add .
```

Commit:

```bash
git commit -m "feat: add attendance detection"
```

### Commit format

```text
feat: new feature
fix: bug fix
test: add tests
docs: documentation
refactor: code improvement
```

Example:

```bash
git commit -m "fix: handle missing camera stream"
```

---

## 6. Push Your Branch

First time:

```bash
git push -u origin feature/issue-25-attendance-detection
```

Next time:

```bash
git push
```

---

## 7. Create Pull Request

GitHub par jao → **Compare & Pull Request**

PR mein:

```text
Title:
feat: add attendance detection

Description:
- Added person detection
- Added attendance counting
- Added API integration
- Tested with sample video

Closes #25
```

---

## 8. Code Review

PR ko team member review karega.

Agar changes bole:

```bash
# code fix karo

git add .
git commit -m "fix: address review comments"
git push
```

Same PR automatically update ho jayega.

---

## 9. Merge

**Reviewer approval ke baad hi PR merge karo.**

Merge ke baad:

```bash
git checkout main
git pull origin main
```

Phir apna old branch delete kar sakte ho:

```bash
git branch -d feature/issue-25-attendance-detection
```

---

# Important Rules

### ❌ Don't

```text
Don't push directly to main
Don't commit .env
Don't commit passwords/API keys
Don't push untested code
Don't work on someone else's branch without discussion
```

### ✅ Do

```text
One Issue = One Branch
Test before PR
Write meaningful commit messages
Keep PR focused on one task
Ask if you are stuck
```

---

# Our Workflow

```text
GitHub Issue
     ↓
Create Branch
     ↓
Write Code
     ↓
Test
     ↓
Commit
     ↓
Push
     ↓
Pull Request
     ↓
Code Review
     ↓
Fix Review Comments
     ↓
Merge to main
```

## Golden Rule

> **Main branch should always contain working code.**
