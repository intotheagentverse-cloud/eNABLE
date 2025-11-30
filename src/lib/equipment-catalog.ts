// Equipment Categories based on diagnostic lab equipment guide

export const EQUIPMENT_CATEGORIES = [
    { id: 'hematology', name: 'Hematology', icon: '🩸' },
    { id: 'clinical_chemistry', name: 'Clinical Chemistry & Biochemistry', icon: '🧪' },
    { id: 'electrolyte_blood_gas', name: 'Electrolyte & Blood Gas', icon: '⚡' },
    { id: 'coagulation', name: 'Coagulation', icon: '🩹' },
    { id: 'immunology', name: 'Immunology & Immunoassay', icon: '🛡️' },
    { id: 'microbiology', name: 'Microbiology', icon: '🦠' },
    { id: 'molecular', name: 'Molecular Diagnostics', icon: '🧬' },
    { id: 'histopathology', name: 'Histopathology', icon: '🔬' },
    { id: 'urinalysis', name: 'Urinalysis', icon: '💧' },
    { id: 'basic_lab', name: 'Basic Laboratory Equipment', icon: '⚙️' },
    { id: 'storage', name: 'Storage & Support', icon: '📦' }
] as const;

export type EquipmentCategoryId = typeof EQUIPMENT_CATEGORIES[number]['id'];

// Equipment types by category
export const EQUIPMENT_TYPES: Record<EquipmentCategoryId, string[]> = {
    hematology: [
        'Automated Hematology Analyzer (High-Throughput)',
        'Automated Hematology Analyzer (Mid-Range)',
        'Semi-Automated Analyzer',
        'Hemoglobin Meter',
        'ESR Analyzer',
        'Blood Film Preparation Station',
        'Slide Stainer'
    ],
    clinical_chemistry: [
        'Chemistry Analyzer (High-Throughput)',
        'Chemistry Analyzer (Mid-Range)',
        'Semi-Automated Chemistry Analyzer',
        'Spectrophotometer',
        'Glucose Analyzer',
        'HbA1c Analyzer',
        'Lipid Profile Analyzer'
    ],
    electrolyte_blood_gas: [
        'Electrolyte Analyzer (ISE)',
        'Blood Gas Analyzer',
        'Point-of-Care Analyzer',
        'Portable Electrolyte Analyzer'
    ],
    coagulation: [
        'Coagulation Analyzer (Automated)',
        'Coagulation Analyzer (Semi-Auto)',
        'ESR Analyzer',
        'Platelet Function Analyzer'
    ],
    immunology: [
        'Chemiluminescent Immunoassay Analyzer',
        'ELISA Plate Reader',
        'Plate Washer',
        'Flow Cytometer',
        'Immunofluorescence Microscope'
    ],
    microbiology: [
        'Automated Culture System',
        'Bacterial Identification System (VITEK/MALDI-TOF)',
        'Biosafety Cabinet',
        'Incubator (37°C)',
        'Incubator (Anaerobic)',
        'Incubator (CO2)',
        'Autoclave',
        'Gram Staining Station'
    ],
    molecular: [
        'Real-Time PCR (qPCR)',
        'Conventional PCR (Thermal Cycler)',
        'Nucleic Acid Extraction System',
        'Gel Electrophoresis System',
        'NanoDrop Spectrophotometer',
        'Next-Generation Sequencer'
    ],
    histopathology: [
        'Tissue Processor',
        'Embedding Station',
        'Microtome',
        'Cryostat',
        'Automated Slide Stainer (H&E)',
        'IHC Stainer',
        'Whole Slide Scanner',
        'Digital Microscope'
    ],
    urinalysis: [
        'Urine Dipstick Reader',
        'Urine Sediment Analyzer',
        'Urine Chemistry Analyzer'
    ],
    basic_lab: [
        'Microscope (Binocular)',
        'Microscope (Trinocular)',
        'Clinical Centrifuge',
        'Microcentrifuge',
        'Water Bath',
        'Analytical Balance',
        'pH Meter',
        'Heat Block'
    ],
    storage: [
        'Refrigerator (4°C)',
        'Freezer (-20°C)',
        'Ultra-Low Freezer (-70°C to -80°C)',
        'Liquid Nitrogen Tank',
        'Barcode Printer',
        'Barcode Scanner'
    ]
};

// Major equipment brands by category (top brands from CrelioHealth integration)
export const EQUIPMENT_BRANDS: Record<EquipmentCategoryId, string[]> = {
    hematology: [
        'Sysmex',
        'Beckman Coulter',
        'Abbott',
        'Horiba',
        'Mindray',
        'ABX',
        'Erba',
        'Other'
    ],
    clinical_chemistry: [
        'Roche',
        'Abbott',
        'Beckman Coulter',
        'Siemens',
        'Mindray',
        'Erba',
        'Autobio',
        'Transasia',
        'Other'
    ],
    electrolyte_blood_gas: [
        'Abbott (i-STAT)',
        'Radiometer',
        'Roche',
        'GEM',
        'Diamond',
        'Seamaty',
        'Dirui',
        'Other'
    ],
    coagulation: [
        'Beckman Coulter',
        'Roche',
        'Stago',
        'Sysmex',
        'Horiba',
        'ABX',
        'Other'
    ],
    immunology: [
        'Roche',
        'Abbott',
        'Siemens',
        'Beckman Coulter',
        'Mindray',
        'Autobio',
        'BioTek',
        'Tecan',
        'Other'
    ],
    microbiology: [
        'BioMérieux',
        'BD Biosciences',
        'Bruker',
        'Siemens',
        'Esco',
        'Memmert',
        'MELAG',
        'Other'
    ],
    molecular: [
        'Roche',
        'Abbott',
        'Bio-Rad',
        'Applied Biosystems',
        'Qiagen',
        'Cepheid',
        'Illumina',
        'Thermo Fisher',
        'Other'
    ],
    histopathology: [
        'Leica',
        'Sakura',
        'Roche Ventana',
        'Zeiss',
        'Thermo Fisher',
        'Milestone',
        'Other'
    ],
    urinalysis: [
        'Siemens',
        'Roche',
        'Dirui',
        'Sysmex',
        'IRIS',
        'Other'
    ],
    basic_lab: [
        'Olympus',
        'Nikon',
        'Zeiss',
        'Leica',
        'Beckman Coulter',
        'Sartorius',
        'Hanna Instruments',
        'Other'
    ],
    storage: [
        'Thermo Fisher',
        'Sanyo',
        'Godrej',
        'Voltas',
        'Zebra',
        'Honeywell',
        'Other'
    ]
};

export const LAB_TIERS = [
    { id: 'tier1', name: 'Tier 1 (Small Lab, <50 tests/day)', value: 'TIER_1' },
    { id: 'tier2', name: 'Tier 2 (Medium Lab, 50-150 tests/day)', value: 'TIER_2' },
    { id: 'tier3', name: 'Tier 3 (Large Network, 150+ tests/day)', value: 'TIER_3' }
] as const;

export const INTEGRATION_METHODS = [
    { id: 'serial', name: 'Serial (RS-232)' },
    { id: 'tcp_ip', name: 'Network (TCP/IP)' },
    { id: 'usb', name: 'USB' },
    { id: 'file', name: 'File Export (CSV/XML)' },
    { id: 'api', name: 'API/Middleware' },
    { id: 'manual', name: 'Manual Entry' }
] as const;

export const INTEGRATION_STATUS = [
    { id: 'integrated', name: 'Integrated', color: 'green' },
    { id: 'manual', name: 'Manual Entry', color: 'gray' },
    { id: 'pending', name: 'Pending Setup', color: 'yellow' },
    { id: 'failed', name: 'Connection Failed', color: 'red' }
] as const;

// Default calibration intervals (in days) by equipment category
export const DEFAULT_CALIBRATION_INTERVALS: Record<EquipmentCategoryId, number> = {
    hematology: 365, // Annual
    clinical_chemistry: 180, // Semi-annual
    electrolyte_blood_gas: 90, // Quarterly
    coagulation: 180,
    immunology: 365,
    microbiology: 365,
    molecular: 365,
    histopathology: 365,
    urinalysis: 180,
    basic_lab: 365,
    storage: 365 // For temperature-controlled equipment
};
