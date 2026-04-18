-- V1__init.sql
-- Portfolio CMS Database Schema

-- Users table
CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(50)  NOT NULL DEFAULT 'ADMIN',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

-- Projects table
CREATE TABLE projects (
    id            BIGSERIAL PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    slug          VARCHAR(255) UNIQUE NOT NULL,
    description   TEXT,
    github_url    VARCHAR(500),
    demo_url      VARCHAR(500),
    image_url     VARCHAR(500),
    is_featured   BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);

-- Project <-> Tag (Many-to-Many)
CREATE TABLE project_tags (
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tag_id     BIGINT NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

-- Blog posts table
CREATE TABLE blog_posts (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(500) NOT NULL,
    slug            VARCHAR(500) UNIQUE NOT NULL,
    summary         TEXT,
    content         TEXT NOT NULL,
    cover_image_url VARCHAR(500),
    view_count      INT DEFAULT 0,
    is_published    BOOLEAN DEFAULT FALSE,
    published_at    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- BlogPost <-> Tag (Many-to-Many)
CREATE TABLE blog_post_tags (
    post_id BIGINT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id  BIGINT NOT NULL REFERENCES tags(id)       ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Experiences table
CREATE TABLE experiences (
    id               BIGSERIAL PRIMARY KEY,
    company          VARCHAR(255) NOT NULL,
    position         VARCHAR(255) NOT NULL,
    description      TEXT,
    start_date       DATE NOT NULL,
    end_date         DATE,
    is_current       BOOLEAN DEFAULT FALSE,
    location         VARCHAR(255),
    company_logo_url VARCHAR(500),
    display_order    INT DEFAULT 0
);

-- Certificates table
CREATE TABLE certificates (
    id             BIGSERIAL PRIMARY KEY,
    title          VARCHAR(255) NOT NULL,
    issuer         VARCHAR(255) NOT NULL,
    issue_date     DATE,
    credential_url VARCHAR(500),
    image_url      VARCHAR(500),
    display_order  INT DEFAULT 0
);

-- Messages table
CREATE TABLE messages (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    subject    VARCHAR(500),
    body       TEXT NOT NULL,
    is_read    BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_is_featured ON projects(is_featured);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_tags_slug ON tags(slug);
