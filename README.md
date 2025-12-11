# MC App - Carrier Management System

A one-page web application built with React, Tailwind CSS, and Supabase for managing carrier information with MC checks.

## Features

- **Username-only Login**: Simple authentication with username validation against Supabase database
- **Data Entry Form**: Add entries with MC, Carrier Name, Amount, Approved status, Checked By, and Notes
- **Data Table**: View all entries in a clean, organized table format
- **MC Search**: Search and browse all unique MCs with pagination and sorting
- **Database Integration**: All data is stored in Supabase for persistent storage
- **Responsive Design**: Modern UI with Tailwind CSS, fully responsive

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a Supabase project at [https://supabase.com](https://supabase.com)
   - Get your project URL and anon key from Supabase dashboard
   - See `SUPABASE_SETUP.md` for detailed instructions

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database:
   - Run the SQL from `database/schema.sql` in your Supabase SQL Editor
   - Add at least one user to the `users` table for testing

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
MC App/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login page component
│   │   ├── Dashboard.jsx      # Main dashboard with form and table
│   │   ├── DataEntryForm.jsx  # Form for entering new entries
│   │   ├── DataTable.jsx      # Table component to display entries
│   │   └── MCSearch.jsx       # MC search and listing component
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication context provider
│   ├── services/
│   │   ├── entryService.js    # Supabase service for entries CRUD
│   │   └── userService.js     # Supabase service for user operations
│   ├── lib/
│   │   └── supabase.js        # Supabase client configuration
│   ├── App.jsx                # Main app component with routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles with Tailwind
├── database/
│   └── schema.sql             # Database schema for Supabase
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example               # Example environment variables
└── SUPABASE_SETUP.md          # Detailed Supabase setup guide
```

## Usage

1. **Login**: Enter a username that exists in your Supabase `users` table
2. **Add Entry**: Fill out the form with:
   - MC (required)
   - Carrier Name (required)
   - Amount (optional)
   - Approved status (YES/NO)
   - Checked By (required)
   - Note (optional)
3. **View Entries**: All entries are displayed in the table below the form
4. **MC Search**: Use the MC Search tab to browse all unique MCs with search and sorting
5. **Delete Entry**: Click the "Delete" button to remove an entry

## Database Schema

The application uses two main tables:

- **users**: Stores usernames for authentication
- **entries**: Stores all MC carrier entries with date, MC, carrier name, amount, approval status, checker, and notes

See `database/schema.sql` for the complete schema with indexes and Row Level Security policies.

## Future Enhancements

- Admin panel for user management
- Export functionality (CSV, PDF)
- Advanced filtering and search
- Bulk import/export
- User roles and permissions

## Technologies Used

- React 18
- React Router DOM
- Tailwind CSS
- Vite
- Supabase (PostgreSQL database)

