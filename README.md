**Ai Toold Used** : Lovable

**Output**:https://code-display-tool.lovable.app/


Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


## UI Design

1. AI-Generated Modern Web UI

The UI of generated apps is created by Lovable AI based on your prompts or imported designs like Figma.

It typically uses modern web UI components built in React (or other front-end frameworks) — responsive and component-based.

2. Tailwind CSS + Semantic Design Tokens

Lovable outputs designs that use Tailwind CSS utility classes and semantic tokens (primary, secondary, accent, etc.) for consistent styling and theming.

3. Inter and Monospace Fonts

Interfaces often use the Inter font for text and a monospace font for code blocks by default, because that’s what Lovable’s design system tends to emit.

4. Component-Based UI

UI structures are built from reusable components (buttons, cards, modals), with spacing and layout standardized across screens.

5. Visual Editing Support

Once generated, Lovable provides a visual WYSIWYG-style UI editor where you can adjust spacing, colors, fonts, and layout without writing code yourself.


## Backend Logic


🧱 1. Data Model (Supabase/PostgreSQL)
CREATE TABLE snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  code TEXT,
  language TEXT,
  theme TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If you want authentication:
ALTER TABLE snippets ADD COLUMN user_id UUID;


Fields explained

id: unique snippet identifier

title: snippet title

code: raw code content

language: JS, Python, etc.

theme: dark/light theme preference

is_public: whether anyone can see it

user_id (optional): owner if auth used

🛠 2. REST API Endpoints

Lovable + Supabase gives you auto APIs for each table, but you’ll want custom functions for logic.

🟢 Create a Snippet

POST /api/snippets

Body

{
  "title": "My Snippet",
  "code": "... code ...",
  "language": "javascript",
  "theme": "dark",
  "is_public": true
}


Logic

Validate fields

Sanitize code (escape dangerous characters)

Insert into snippets table

Return ID + snippet URL

🔎 Get Snippet

GET /api/snippets/:id

Logic

Lookup by ID

Only return if is_public == true OR authenticated owner

Return { title, code, language, theme }

✏️ Update Snippet

PUT /api/snippets/:id

Body

{ "code": "...", "title": "New Title" }


Logic

Check ownership (if auth)

Update fields + updated_at

Return updated snippet

❌ Delete Snippet

DELETE /api/snippets/:id

Logic

Validate user

Delete row

📜 List Snippets

GET /api/snippets?public=true&language=js

Return paginated list of snippets filtered by params.

📌 3. Business Rules (Security)

✅ Never execute code on backend — code is only stored/displayed.
✅ Escape <script> tags if embedding into HTML (XSS protection).
✅ Rate-limit creation endpoints.

If using Supabase, most of this is managed via policies and serverless functions.

🧠 4. Using Supabase for Backend

Once you connect Supabase to your Lovable project:

✔ Supabase auto-generates REST APIs for your tables
✔ You get built-in Auth (email/password)
✔ You can write edge functions for custom logic
✔ You handle file storage & realtime events (if needed)

🧾 Example Node.js Backend (Custom Server)

If you want your own backend instead of Supabase, here’s the basic logic:

📌 server.js (Express)
import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import sanitizeHtml from "sanitize-html";

const app = express();
app.use(bodyParser.json());

let snippetStore = {};

app.post("/api/snippets", (req, res) => {
  let { title, code, language, theme, is_public } = req.body;
  if (!code) return res.status(400).send("Missing code");

  const id = uuidv4();
  snippetStore[id] = {
    id,
    title,
    code: sanitizeHtml(code),
    language,
    theme,
    is_public: !!is_public,
    created_at: new Date()
  };

  res.json({ id, url: `/snippets/${id}` });
});

app.get("/api/snippets/:id", (req, res) => {
  const snippet = snippetStore[req.params.id];
  if (!snippet) return res.status(404).send("Not found");
  if (!snippet.is_public) return res.status(403).send("Private");
  res.json(snippet);
});

app.listen(process.env.PORT || 4000);


This stores in memory; for production swap to a DB (SQL / Mongo).

🔗 How It Ties to Your Lovable Frontend

Your Lovable UI will call these APIs to:

✔ Save a snippet (POST)
✔ Load code snippet (GET)
✔ Render code in the frontend

Lovable UI code just needs base API URLs — the logic lives on your API service.

🏁 Summary
Feature	Backend Logic
Store code snippets	API + DB (Supabase/Postgres)
Load/display code	GET endpoint
Edit snippets	PUT endpoint
Delete snippets	DELETE endpoint
Public sharing	Boolean + share URL
Auth/ownership	Optional Supabase Auth

