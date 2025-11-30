-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Labs table (organizations/facilities)
CREATE TABLE IF NOT EXISTS labs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_name VARCHAR(255) NOT NULL,
    lab_code VARCHAR(50) UNIQUE,
    lab_tier VARCHAR(20), -- 'TIER_1', 'TIER_2', 'TIER_3'
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(50),
    email VARCHAR(255),
    nabl_certificate_number VARCHAR(100),
    nabl_valid_until DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'LAB_MANAGER', -- 'ADMIN', 'LAB_MANAGER', 'TECHNICIAN', 'AUDITOR'
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-Lab relationship (for multi-lab access)
CREATE TABLE IF NOT EXISTS user_labs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lab_id UUID NOT NULL REFERENCES labs(id) ON DELETE CASCADE,
    role VARCHAR(50), -- Role specific to this lab: 'OWNER', 'MANAGER', 'TECHNICIAN', 'VIEWER'
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lab_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_labs_user_id ON user_labs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_labs_lab_id ON user_labs(lab_id);
CREATE INDEX IF NOT EXISTS idx_labs_status ON labs(status);

-- Note: Foreign key constraints for existing tables (equipment, qc_tests, etc.) 
-- will be added after those tables are created. If you've already run schema.sql,
-- you can add these constraints manually in Supabase SQL Editor:
--
-- ALTER TABLE equipment ADD CONSTRAINT fk_equipment_lab FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE;
-- ALTER TABLE qc_tests ADD CONSTRAINT fk_qc_tests_lab FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE;
-- ALTER TABLE documents ADD CONSTRAINT fk_documents_lab FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE;
-- ALTER TABLE reagents ADD CONSTRAINT fk_reagents_lab FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE;
-- ALTER TABLE audits ADD CONSTRAINT fk_audits_lab FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE;
-- ALTER TABLE staff_members ADD CONSTRAINT fk_staff_members_lab FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE;
-- ALTER TABLE training_programs ADD CONSTRAINT fk_training_programs_lab FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE;
