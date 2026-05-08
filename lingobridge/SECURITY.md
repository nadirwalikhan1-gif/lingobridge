# Security Checklist

Follow this checklist in order. Do not skip steps.

---

## 🚨 IMMEDIATE: Rotate the Supabase service role key

The audit found that a real Supabase service role key was committed
to git history inside `src/LingoBridgeServer/.env`. This key has
admin-level database access and bypasses Row Level Security.

**Steps to rotate:**

1. Log in to [supabase.com](https://supabase.com) → your project
2. Go to **Settings → API**
3. Scroll to **Service Role Key**
4. Click **Rotate** (or "Generate new secret")
5. Copy the new key
6. Update the value in your `server/.env` file: `SUPABASE_SERVICE_ROLE_KEY=<new_key>`
7. Redeploy the server with the new env var
8. Verify the old key no longer works (test an admin API call)

---

## Remove secrets from git history

If the old `.env` was ever pushed to a remote repository:

```bash
# Option A: BFG Repo Cleaner (recommended — fast)
# 1. Download BFG: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files .env
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force

# Option B: git filter-branch (slower, built-in)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/LingoBridgeServer/.env" \
  --prune-empty --tag-name-filter cat -- --all
git push --force
```

After purging history, notify any collaborators to re-clone.

---

## Remove node_modules from the repository

```bash
# 1. Remove from git tracking (if already committed)
git rm -r --cached node_modules/
git rm -r --cached src/LingoBridgeServer/node_modules/ 2>/dev/null || true

# 2. Verify .gitignore now covers it
echo "node_modules/" >> .gitignore

# 3. Commit the cleanup
git add .gitignore
git commit -m "chore: remove node_modules from tracking, add .gitignore"

# 4. Push
git push
```

---

## Verify environment variable separation

| Variable | Where it lives | Safe in browser? |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | `server/.env` only | ❌ Never |
| `SUPABASE_URL` | Both (server + client) | ✅ Yes |
| `SUPABASE_ANON_KEY` | `client/.env` only | ✅ Yes (anon key) |
| `AGORA_APP_CERTIFICATE` | `server/.env` only | ❌ Never |
| `AGORA_APP_ID` | `client/.env` (VITE_) | ✅ Yes (needs token) |
| `LEMONSQUEEZY_API_KEY` | `server/.env` only | ❌ Never |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | `server/.env` only | ❌ Never |

---

## Pre-deployment checklist

- [ ] Supabase service role key rotated
- [ ] Old `.env` removed from git history
- [ ] `node_modules/` removed from git tracking
- [ ] `server/.env` is in `.gitignore` (verify with `git check-ignore -v server/.env`)
- [ ] `client/.env` is in `.gitignore`
- [ ] No hardcoded secrets in any source file
- [ ] Agora App ID in `client/.env`, App Certificate in `server/.env` only
- [ ] `server/.env.example` and `client/.env.example` committed (no real values)
- [ ] Production env vars set in deployment platform dashboard (not in repo)

