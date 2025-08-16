-- IDRA Grievance Management System - Database Initialization
-- This script sets up the PostgreSQL database for the IDRA GMS

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom functions for search
CREATE OR REPLACE FUNCTION normalize_search_text(text) RETURNS text AS $$
BEGIN
    RETURN lower(trim($1));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Set timezone
SET timezone TO 'Asia/Dhaka';