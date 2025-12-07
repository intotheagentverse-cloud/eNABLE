
export type WestgardRule = '1_2s' | '1_3s' | '2_2s' | 'R_4s' | '4_1s' | '10_x';

export interface QCDataPoint {
    value: number;
    mean: number;
    sd: number;
    date: string;
}

export interface WestgardViolation {
    rule: WestgardRule;
    index: number;
    message: string;
}

export type Equipment = {
    id: string;
    lab_id: string;
    equipment_name: string;
    manufacturer: string | null;
    model: string | null;
    serial_number: string | null;
    location: string | null;
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
    calibration_interval_days: number;
    last_calibration_date: string | null;
    next_calibration_date: string | null;
    created_at: string;
    updated_at: string;
};

export type QCTest = {
    id: string;
    lab_id: string;
    equipment_id: string;
    test_date: string;
    test_time: string | null;
    parameter_name: string;
    control_level: string;
    lot_number: string | null;
    result_obtained: number | null;
    unit: string | null;
    control_value: number | null;
    expected_range_low: number | null;
    expected_range_high: number | null;
    status: string | null;
    validation_status: string | null;
    violation_rule: string | null;
    created_at: string;
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

export type Calibration = {
    id: string;
    equipment_id: string;
    calibration_date: string;
    calibrated_by: string | null;
    status: 'PASS' | 'REJECT' | 'WARNING';
    certificate_number: string | null;
    next_calibration_date: string | null;
    notes: string | null;
    created_at: string;
};

export type Lab = {
    id: string;
    lab_name: string;
    lab_code: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postal_code: string | null;
    phone: string | null;
    email: string | null;
    accreditation_body: string | null;
    accreditation_number: string | null;
    accreditation_expiry: string | null;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    created_at: string;
    updated_at: string;
};

export type User = {
    id: string;
    email: string;
    full_name: string | null;
    role: 'ADMIN' | 'LAB_MANAGER' | 'TECHNICIAN' | 'VIEWER';
    lab_id: string | null;
    created_at: string;
    updated_at: string;
};

export type CAPA = {
    id: string;
    lab_id: string;
    capa_number: string;
    title: string;
    description: string | null;
    category: 'CORRECTIVE' | 'PREVENTIVE';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
    root_cause: string | null;
    action_plan: string | null;
    responsible_person: string | null;
    target_date: string | null;
    completion_date: string | null;
    effectiveness_check: boolean;
    created_at: string;
    updated_at: string;
};

export type Audit = {
    id: string;
    lab_id: string;
    audit_type: 'INTERNAL' | 'EXTERNAL' | 'SURVEILLANCE';
    audit_date: string;
    auditor: string | null;
    scope: string | null;
    findings: string | null;
    recommendations: string | null;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
    created_at: string;
    updated_at: string;
};

export type Document = {
    id: string;
    lab_id: string;
    document_number: string;
    title: string;
    category: string | null;
    version: string | null;
    effective_date: string | null;
    review_date: string | null;
    status: 'DRAFT' | 'ACTIVE' | 'OBSOLETE';
    file_path: string | null;
    created_at: string;
    updated_at: string;
};

export type Training = {
    id: string;
    lab_id: string;
    training_title: string;
    description: string | null;
    trainer: string | null;
    training_date: string;
    duration_hours: number | null;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    created_at: string;
    updated_at: string;
};

export type TrainingAttendance = {
    id: string;
    training_id: string;
    staff_id: string;
    attendance_status: 'PRESENT' | 'ABSENT' | 'EXCUSED';
    assessment_score: number | null;
    certificate_issued: boolean;
    remarks: string | null;
    created_at: string;
};

export type Reagent = {
    id: string;
    lab_id: string;
    reagent_name: string;
    catalog_number: string | null;
    manufacturer: string | null;
    lot_number: string | null;
    receipt_date: string | null;
    expiry_date: string | null;
    storage_location: string | null;
    quantity_received: number | null;
    quantity_remaining: number | null;
    unit: string | null;
    status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED';
    created_at: string;
    updated_at: string;
};

export type Staff = {
    id: string;
    lab_id: string;
    employee_id: string | null;
    full_name: string;
    email: string | null;
    phone: string | null;
    designation: string | null;
    department: string | null;
    qualification: string | null;
    date_of_joining: string | null;
    status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
    created_at: string;
    updated_at: string;
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

export type MaintenanceLog = {
    id: string;
    equipment_id: string;
    maintenance_date: string;
    maintenance_type: 'PREVENTIVE' | 'CORRECTIVE' | 'BREAKDOWN';
    description: string | null;
    performed_by: string | null;
    cost: number | null;
    next_due_date: string | null;
    status: 'COMPLETED' | 'SCHEDULED' | 'PENDING';
    created_at: string;
    updated_at: string;
};

export type ValidationLog = {
    id: string;
    equipment_id: string;
    validation_type: 'IQ' | 'OQ' | 'PQ';
    status: 'PASS' | 'FAIL' | 'PENDING';
    validation_date: string;
    performed_by: string;
    report_url?: string;
    notes?: string;
    next_validation_due?: string;
    created_at?: string;
};
