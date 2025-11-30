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
