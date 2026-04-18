CREATE TABLE profile (
    id BIGINT PRIMARY KEY,
    full_name VARCHAR(255),
    title VARCHAR(255),
    about TEXT,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    gitlab_url VARCHAR(255),
    twitter_url VARCHAR(255),
    cv_url VARCHAR(255),
    public_email VARCHAR(255)
);
