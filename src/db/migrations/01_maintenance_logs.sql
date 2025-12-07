-- Create maintenance_logs table
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    maintenance_date DATE NOT NULL,
    maintenance_type VARCHAR(50) NOT NULL, -- "PREVENTIVE", "CORRECTIVE", "BREAKDOWN"
    description TEXT,
    performed_by VARCHAR(255),
    cost DECIMAL(10, 2),
    next_due_date DATE,
    status VARCHAR(50) DEFAULT 'COMPLETED', -- "COMPLETED", "SCHEDULED", "PENDING"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (for now, similar to other tables)
CREATE POLICY "Enable all access for all users" ON maintenance_logs
    FOR ALL USING (true) WITH CHECK (true);
