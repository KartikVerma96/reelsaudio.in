# 🌿 Git Branching Guide

## Quick Commands

### Create New Feature Branch
```bash
# Create and switch to new branch
git checkout -b feature/your-feature-name

# Example:
git checkout -b feature/new-ui-design
git checkout -b feature/audio-player
git checkout -b feature/user-authentication
```

### Verify Current Branch
```bash
git branch
# Shows all branches, * indicates current branch
```

### Push Branch to GitHub
```bash
git push -u origin feature/your-feature-name
```

### Switch Between Branches
```bash
# Switch to main branch
git checkout main

# Switch back to feature branch
git checkout feature/your-feature-name
```

### Merge Feature Branch (when ready)
```bash
# Switch to main branch
git checkout main

# Merge feature branch
git merge feature/your-feature-name

# Push merged changes
git push origin main
```

## Branch Naming Conventions

- `feature/` - New features (e.g., `feature/user-dashboard`)
- `fix/` - Bug fixes (e.g., `fix/audio-download-error`)
- `refactor/` - Code refactoring (e.g., `refactor/api-routes`)
- `docs/` - Documentation updates (e.g., `docs/readme-update`)

## Workflow Example

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes, add files
git add .
git commit -m "Add new feature"

# 3. Push to GitHub
git push -u origin feature/new-feature

# 4. When ready to merge:
git checkout main
git merge feature/new-feature
git push origin main

# 5. Delete local branch (optional)
git branch -d feature/new-feature

# 6. Delete remote branch (optional)
git push origin --delete feature/new-feature
```

## Best Practices

1. ✅ Always create a branch from `main` when it's up to date
2. ✅ Use descriptive branch names
3. ✅ Commit frequently with clear messages
4. ✅ Push branches regularly to backup your work
5. ✅ Merge to `main` only when feature is complete and tested

