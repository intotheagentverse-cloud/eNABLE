-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Equipment Registry
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_id UUID NOT NULL, -- References labs(id) in full schema
    equipment_name VARCHAR(255) NOT NULL,
    equipment_category VARCHAR(50), -- Hematology, Clinical Chemistry, etc.
    equipment_type VARCHAR(100),
    equipment_brand VARCHAR(100), -- Manufacturer/Brand
    manufacturer VARCHAR(100), -- Legacy field, use equipment_brand
    model VARCHAR(100),
    serial_number VARCHAR(100),
    nabl_risk_level VARCHAR(20), -- "HIGH", "MEDIUM", "LOW"
    calibration_interval_days INT,
    location VARCHAR(255),
    status VARCHAR(50), -- "ACTIVE", "BREAKDOWN", "ARCHIVED"
    lab_tier VARCHAR(20), -- "TIER_1", "TIER_2", "TIER_3"
    integration_method VARCHAR(50), -- "Serial (RS-232)", "Network (TCP/IP)", etc.
    integration_status VARCHAR(50), -- "Integrated", "Manual Entry", "Pending Setup"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calibration Records
CREATE TABLE IF NOT EXISTS calibrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES equipment(id),
    calibration_date DATE NOT NULL,
    next_due_date DATE NOT NULL,
    calibration_provider VARCHAR(255),
    certificate_number VARCHAR(100),
    si_traceability_chain TEXT,
    measurement_uncertainty DECIMAL(10, 4),
    document_url VARCHAR(500),
    performed_by VARCHAR(100),
    status VARCHAR(50), -- "COMPLETED", "PENDING", "OVERDUE"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QC Tests (Daily Records)
CREATE TABLE IF NOT EXISTS qc_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_id UUID NOT NULL,
    equipment_id UUID NOT NULL REFERENCES equipment(id),
    test_date DATE NOT NULL,
    test_time TIME,
    parameter_name VARCHAR(100),
    control_level VARCHAR(50),
    control_value DECIMAL(10, 4),
    result_obtained DECIMAL(10, 4),
    expected_range_low DECIMAL(10, 4),
    expected_range_high DECIMAL(10, 4),
    unit VARCHAR(20),
    status VARCHAR(50),
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QC Control Limits (Mean & SD)
CREATE TABLE IF NOT EXISTS equipment_control_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES equipment(id),
    parameter_name VARCHAR(100) NOT NULL,
    control_level VARCHAR(50) NOT NULL, -- "L1", "L2", "L3"
    mean_value DECIMAL(10, 4) NOT NULL,
    sd_value DECIMAL(10, 4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(equipment_id, parameter_name, control_level)
);

-- Documents (SOPs, Policies, Protocols)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_id UUID NOT NULL,
    document_number VARCHAR(50) NOT NULL UNIQUE,
    document_title VARCHAR(255) NOT NULL,
    document_type VARCHAR(50), -- "SOP", "POLICY", "PROTOCOL", "FORM", "CHECKLIST"
    department VARCHAR(100),
    current_version VARCHAR(20),
    status VARCHAR(50), -- "DRAFT", "UNDER_REVIEW", "APPROVED", "SUPERSEDED", "ARCHIVED"
    review_frequency_days INT DEFAULT 365,
    next_review_date DATE,
    owner VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Versions
CREATE TABLE IF NOT EXISTS document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number VARCHAR(20) NOT NULL,
    file_url VARCHAR(500),
    change_summary TEXT,
    approved_by VARCHAR(100),
    approval_date DATE,
    effective_date DATE,
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, version_number)
);

-- Reagents & Consumables
CREATE TABLE IF NOT EXISTS reagents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_id UUID NOT NULL,
    reagent_name VARCHAR(255) NOT NULL,
    reagent_type VARCHAR(50), -- "REAGENT", "CONTROL", "CALIBRATOR", "CONSUMABLE"
    catalog_number VARCHAR(100),
    supplier VARCHAR(100),
    storage_condition VARCHAR(100), -- "2-8°C", "15-25°C", "-20°C", "Room Temp"
    unit VARCHAR(50), -- "mL", "Bottle", "Test", "Kit"
    reorder_level INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reagent Lots (Individual batches with expiry)
CREATE TABLE IF NOT EXISTS reagent_lots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reagent_id UUID NOT NULL REFERENCES reagents(id) ON DELETE CASCADE,
    lot_number VARCHAR(100) NOT NULL,
    quantity_received INT,
    quantity_remaining INT,
    expiry_date DATE NOT NULL,
    received_date DATE NOT NULL,
    location VARCHAR(100), -- "Fridge A", "Freezer B", "Room 3"
    status VARCHAR(50), -- "IN_USE", "RESERVED", "EXPIRED", "DISCARDED"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(reagent_id, lot_number)
);

-- Inventory Transactions
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reagent_lot_id UUID NOT NULL REFERENCES reagent_lots(id),
    transaction_type VARCHAR(20), -- "RECEIVE", "USE", "WASTE", "ADJUST"
    quantity INT NOT NULL,
    performed_by VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Internal Audits
CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_id UUID NOT NULL,
    audit_title VARCHAR(255) NOT NULL,
    audit_type VARCHAR(50), -- "INTERNAL", "MANAGEMENT_REVIEW", "EXTERNAL"
    department VARCHAR(100),
    audit_date DATE NOT NULL,
    lead_auditor VARCHAR(100),
    auditee VARCHAR(100),
    status VARCHAR(50), -- "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CLOSED"
    conclusion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Findings
CREATE TABLE IF NOT EXISTS audit_findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    finding_number VARCHAR(50),
    category VARCHAR(50), -- "MAJOR", "MINOR", "OBSERVATION", "OFI"
    clause_reference VARCHAR(100), -- ISO 15189 clause
    description TEXT NOT NULL,
    evidence TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CAPA (Corrective and Preventive Actions)
CREATE TABLE IF NOT EXISTS capa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    finding_id UUID REFERENCES audit_findings(id) ON DELETE SET NULL,
    capa_number VARCHAR(50) NOT NULL UNIQUE,
    capa_type VARCHAR(20), -- "CORRECTIVE", "PREVENTIVE"
    issue_description TEXT NOT NULL,
    root_cause TEXT,
    action_plan TEXT NOT NULL,
    responsible_person VARCHAR(100),
    target_date DATE,
    completion_date DATE,
    status VARCHAR(50), -- "OPEN", "IN_PROGRESS", "COMPLETED", "VERIFIED", "CLOSED"
    effectiveness_verification TEXT,
    verified_by VARCHAR(100),
    verification_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Members
CREATE TABLE IF NOT EXISTS staff_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_id UUID NOT NULL,
    employee_id VARCHAR(50) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    department VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    hire_date DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Programs
CREATE TABLE IF NOT EXISTS training_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_id UUID NOT NULL,
    program_name VARCHAR(255) NOT NULL,
    program_type VARCHAR(50),
    description TEXT,
    duration_hours DECIMAL(5, 2),
    validity_months INT,
    is_mandatory BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Records
CREATE TABLE IF NOT EXISTS training_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES training_programs(id),
    training_date DATE NOT NULL,
    trainer VARCHAR(100),
    score DECIMAL(5, 2),
    pass_fail VARCHAR(10),
    certificate_issued BOOLEAN DEFAULT false,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competency Assessments
CREATE TABLE IF NOT EXISTS competency_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
    assessment_type VARCHAR(100),
    assessment_date DATE NOT NULL,
    assessor VARCHAR(100),
    skill_category VARCHAR(100),
    result VARCHAR(50),
    score DECIMAL(5, 2),
    remarks TEXT,
    next_assessment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
    certificate_type VARCHAR(100),
    certificate_number VARCHAR(100),
    issuing_authority VARCHAR(255),
    issue_date DATE NOT NULL,
    expiry_date DATE,
    renewal_required BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'VALID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- QC Results (Imported from Analyzers)
CREATE TABLE IF NOT EXISTS qc_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    control_name VARCHAR(100) NOT NULL,
    lot_number VARCHAR(50) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    result_value DECIMAL(10, 3) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    target_mean DECIMAL(10, 3) NOT NULL,
    target_sd DECIMAL(10, 3) NOT NULL,
    measurement_date DATE NOT NULL,
    measurement_time TIME NOT NULL,
    analyzer_id VARCHAR(100) NOT NULL,
    qc_status VARCHAR(20), -- "Pass", "Fail", "Warning"
    operator_id VARCHAR(50),
    source_file_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Optional fields
    module VARCHAR(50),
    reagent_lot VARCHAR(50),
    cv_percent DECIMAL(5, 2),
    z_score DECIMAL(5, 2),
    westgard_rule_violation VARCHAR(50)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_qc_results_lookup ON qc_results(control_name, lot_number, test_name, measurement_date);
CREATE INDEX IF NOT EXISTS idx_qc_results_analyzer ON qc_results(analyzer_id);
CREATE INDEX IF NOT EXISTS idx_qc_results_date ON qc_results(measurement_date);
