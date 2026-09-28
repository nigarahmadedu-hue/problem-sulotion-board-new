-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    initials TEXT NOT NULL,
    role TEXT,
    role_category TEXT,
    bio TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Problems Table
CREATE TABLE problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT,
    description TEXT NOT NULL,
    full_description JSONB DEFAULT '[]'::jsonb,
    stage TEXT NOT NULL,
    who_faces_it JSONB DEFAULT '[]'::jsonb,
    evidence_references INTEGER DEFAULT 0,
    evidence_images INTEGER DEFAULT 0,
    evidence_solutions INTEGER DEFAULT 0,
    looking_for_roles JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Ideas Table
CREATE TABLE ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    who_would_use TEXT,
    needed_to_build TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Comments Table
-- Comments can belong to either a Problem or an Idea.
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Ensure comment belongs to exactly one entity (Problem or Idea)
    CONSTRAINT comment_target_check CHECK (
        (problem_id IS NOT NULL AND idea_id IS NULL) OR 
        (problem_id IS NULL AND idea_id IS NOT NULL)
    )
);

-- 5. Votes Table
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, idea_id)
);

-- 6. Teams Table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Team Members Table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(team_id, user_id)
);

-- Enable public read access on everything (no login required to browse)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "public read problems" ON problems FOR SELECT USING (true);
CREATE POLICY "public read ideas" ON ideas FOR SELECT USING (true);
CREATE POLICY "public read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "public read votes" ON votes FOR SELECT USING (true);
CREATE POLICY "public read teams" ON teams FOR SELECT USING (true);
CREATE POLICY "public read team_members" ON team_members FOR SELECT USING (true);

-- Anyone can insert for now (no login built yet — will restrict later when auth ships)
CREATE POLICY "public insert problems" ON problems FOR INSERT WITH CHECK (true);
CREATE POLICY "public insert ideas" ON ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "public insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "public insert votes" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "public insert profiles" ON profiles FOR INSERT WITH CHECK (true);

-- 8. Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read messages" ON messages FOR SELECT USING (true);
CREATE POLICY "public insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "public update messages" ON messages FOR UPDATE USING (true);

-- Seed one placeholder profile so the existing form's ANONYMOUS_AUTHOR_ID works
INSERT INTO profiles (id, name, initials)
VALUES ('5a126e26-2720-4c2a-811b-76b7e57ef36e', 'Anonymous', 'NA')
ON CONFLICT (id) DO NOTHING;
