export type Equipment = {
    id: string;
    lab_id: string;
    equipment_name: string;
    equipment_category: string | null;
    equipment_type: string | null;
    equipment_brand: string | null;
    manufacturer: string | null;
    model: string | null;
    serial_number: string | null;
    nabl_risk_level: 'HIGH' | 'MEDIUM' | 'LOW' | null;
    calibration_interval_days: number | null;
    location: string | null;
    status: 'ACTIVE' | 'BREAKDOWN' | 'ARCHIVED' | null;
    lab_tier: 'TIER_1' | 'TIER_2' | 'TIER_3' | null;
    integration_method: string | null;
    integration_status: 'Integrated' | 'Manual Entry' | 'Pending Setup' | 'Connection Failed' | null;
    created_at: string;
    updated_at: string;
};

export type Calibration = {
    id: string;
    equipment_id: string;
    calibration_date: string;
    next_due_date: string;
    calibration_provider: string | null;
    certificate_number: string | null;
    si_traceability_chain: string | null;
    measurement_uncertainty: number | null;
    document_url: string | null;
    performed_by: string | null;
    status: 'PASS' | 'WARNING' | 'REJECT';
    created_at: string;
};

// Module 3: Document Control & Reagent Management

export type Document = {
    id: string;
    lab_id: string;
    document_number: string;
    document_title: string;
    document_type: 'SOP' | 'POLICY' | 'PROTOCOL' | 'FORM' | 'CHECKLIST' | null;
    department: string | null;
    current_version: string | null;
    status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'SUPERSEDED' | 'ARCHIVED' | null;
    review_frequency_days: number | null;
    next_review_date: string | null;
    owner: string | null;
    created_at: string;
    updated_at: string;
};

export type DocumentVersion = {
    id: string;
    document_id: string;
    version_number: string;
    file_url: string | null;
    change_summary: string | null;
    approved_by: string | null;
    approval_date: string | null;
    effective_date: string | null;
    created_by: string | null;
    created_at: string;
};

export type Reagent = {
    id: string;
    lab_id: string;
    reagent_name: string;
    reagent_type: 'REAGENT' | 'CONTROL' | 'CALIBRATOR' | 'CONSUMABLE' | null;
    catalog_number: string | null;
    supplier: string | null;
    storage_condition: string | null;
    unit: string | null;
    reorder_level: number | null;
    created_at: string;
    updated_at: string;
};

export type ReagentLot = {
    id: string;
    reagent_id: string;
    lot_number: string;
    quantity_received: number | null;
    quantity_remaining: number | null;
    expiry_date: string;
    received_date: string;
    location: string | null;
    status: 'IN_USE' | 'RESERVED' | 'EXPIRED' | 'DISCARDED' | null;
    created_at: string;
    updated_at: string;
};

export type InventoryTransaction = {
    id: string;
    reagent_lot_id: string;
    transaction_type: 'RECEIVE' | 'USE' | 'WASTE' | 'ADJUST';
    quantity: number;
    performed_by: string | null;
    notes: string | null;
    created_at: string;
};

// Module 4: Internal Audit Reports

export type Audit = {
    id: string;
    lab_id: string;
    audit_title: string;
    audit_type: 'INTERNAL' | 'MANAGEMENT_REVIEW' | 'EXTERNAL' | null;
    department: string | null;
    audit_date: string;
    lead_auditor: string | null;
    auditee: string | null;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED' | null;
    conclusion: string | null;
    created_at: string;
    updated_at: string;
};

export type AuditFinding = {
    id: string;
    audit_id: string;
    finding_number: string | null;
    category: 'MAJOR' | 'MINOR' | 'OBSERVATION' | 'OFI' | null;
    clause_reference: string | null;
    description: string;
    evidence: string | null;
    created_at: string;
};

export type CAPA = {
    id: string;
    finding_id: string | null;
    capa_number: string;
    capa_type: 'CORRECTIVE' | 'PREVENTIVE' | null;
    issue_description: string;
    root_cause: string | null;
    action_plan: string;
    responsible_person: string | null;
    target_date: string | null;
    completion_date: string | null;
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED' | 'CLOSED' | null;
    effectiveness_verification: string | null;
    verified_by: string | null;
    verification_date: string | null;
    created_at: string;
    updated_at: string;
};

export type QCTest = {
    id: string;
    lab_id: string;
    equipment_id: string;
    test_date: string;
    test_time: string | null;
    parameter_name: string | null;
    control_level: string | null;
    control_value: number | null;
    result_obtained: number | null;
    expected_range_low: number | null;
    expected_range_high: number | null;
    unit: string | null;
    status: string | null;
    validation_status: 'PENDING' | 'VALID' | 'INVALID' | 'VIOLATION' | null;
    violation_rule: string | null;
    deviation_id: string | null;
    created_by: string | null;
    created_at: string;
};

export type QCDeviation = {
    id: string;
    test_id: string;
    created_at: string;
    status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
    root_cause: string | null;
    corrective_action: string | null;
    investigated_by: string | null;
    resolved_at: string | null;
};

export type QCTrend = {
    id: string;
    equipment_id: string;
    parameter_name: string;
    calculated_at: string;
    period: '30d' | '90d' | '365d';
    sd_change_pct: number;
    mean_shift: number;
    status: 'STABLE' | 'DRIFTING' | 'CRITICAL';
};

export type ControlLimit = {
    id: string;
    equipment_id: string;
    parameter_name: string;
    control_level: string;
    mean_value: number;
    sd_value: number;
    created_at: string;
    updated_at: string;
};

// Module 5: Staff Training & Competency

export type StaffMember = {
    id: string;
    lab_id: string;
    employee_id: string | null;
    full_name: string;
    role: string | null;
    department: string | null;
    email: string | null;
    phone: string | null;
    hire_date: string | null;
    status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | null;
    created_at: string;
    updated_at: string;
};

export type TrainingProgram = {
    id: string;
    lab_id: string;
    program_name: string;
    program_type: 'ORIENTATION' | 'TECHNICAL' | 'SAFETY' | 'COMPLIANCE' | 'REFRESH' | null;
    description: string | null;
    duration_hours: number | null;
    validity_months: number | null;
    is_mandatory: boolean;
    created_at: string;
    updated_at: string;
};

export type TrainingRecord = {
    id: string;
    staff_id: string;
    program_id: string;
    training_date: string;
    trainer: string | null;
    score: number | null;
    pass_fail: 'PASS' | 'FAIL' | null;
    certificate_issued: boolean;
    expiry_date: string | null;
    notes: string | null;
    created_at: string;
};

export type CompetencyAssessment = {
    id: string;
    staff_id: string;
    assessment_type: string | null;
    assessment_date: string;
    assessor: string | null;
    skill_category: string | null;
    result: 'COMPETENT' | 'NEEDS_IMPROVEMENT' | 'NOT_COMPETENT' | null;
    score: number | null;
    remarks: string | null;
    next_assessment_date: string | null;
    created_at: string;
};

export type Certificate = {
    id: string;
    staff_id: string;
    certificate_type: string | null;
    certificate_number: string | null;
    issuing_authority: string | null;
    issue_date: string;
    expiry_date: string | null;
    renewal_required: boolean;
    status: 'VALID' | 'EXPIRED' | 'PENDING_RENEWAL' | null;
    created_at: string;
    updated_at: string;
};
