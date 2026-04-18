-- Add phone number to profile table
ALTER TABLE profile ADD COLUMN phone_number VARCHAR(20);

-- Create education table
CREATE TABLE education (
    id BIGSERIAL PRIMARY KEY,
    school_name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    degree VARCHAR(100),
    gpa DOUBLE PRECISION,
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0
);
