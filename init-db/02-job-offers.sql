-- Migration: Create job_offers table
-- Description: Tabla para almacenar las ofertas de trabajo

CREATE TABLE job_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    salary DECIMAL(10,2) NULL,
    employment_type VARCHAR(20) NOT NULL DEFAULT 'FULL_TIME' 
        CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' 
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'CLOSED')),
    requirements TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    experience_level VARCHAR(50) NULL,
    application_deadline DATE NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_job_offers_created_by 
        FOREIGN KEY (created_by) REFERENCES users(id) 
        ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_job_offers_status ON job_offers(status);
CREATE INDEX idx_job_offers_employment_type ON job_offers(employment_type);
CREATE INDEX idx_job_offers_location ON job_offers(location);
CREATE INDEX idx_job_offers_company ON job_offers(company);
CREATE INDEX idx_job_offers_created_at ON job_offers(created_at);
CREATE INDEX idx_job_offers_created_by ON job_offers(created_by);
CREATE INDEX idx_job_offers_salary ON job_offers(salary) WHERE salary IS NOT NULL;

-- Full text search index for title and description
CREATE INDEX idx_job_offers_search ON job_offers 
    USING gin(to_tsvector('spanish', title || ' ' || description));

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_job_offers_updated_at 
    BEFORE UPDATE ON job_offers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
