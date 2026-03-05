-- MangoGo Database Schema
-- PostgreSQL 15 + PostGIS

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  language VARCHAR(10) DEFAULT 'zh'
);

-- Spots table
CREATE TABLE spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  country VARCHAR(100) NOT NULL,
  province VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  area VARCHAR(100),
  best_time VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  likes_count INT DEFAULT 0,
  posts_count INT DEFAULT 0,
  checkins_count INT DEFAULT 0
);

CREATE INDEX idx_spots_location ON spots USING GIST(location);
CREATE INDEX idx_spots_city ON spots(city);

-- More tables in separate migration files
