## Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)

## Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/christopherwdev/alevelchat
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory.
     ```env
     NEXT_PUBLIC_SUPABASE_URL=supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=supabase_anon_key
     NEXT_PUBLIC_SITE_URL=http://localhost:3000 # for local development
     ```
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   You will be able to see live changes as you edit the code.

