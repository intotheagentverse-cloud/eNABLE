import { getEquipmentList } from '@/app/actions/equipment';
import { getCalibrationOverview } from '@/app/actions/calibration';
import { TEST_LAB_ID } from '@/lib/constants';
import EquipmentTabs from '@/components/dashboard/EquipmentTabs';

export const dynamic = 'force-dynamic';

export default async function EquipmentPage() {
    const [equipment, calibration] = await Promise.all([
        getEquipmentList(TEST_LAB_ID),
        getCalibrationOverview(TEST_LAB_ID)
    ]);

    return <EquipmentTabs equipmentData={equipment} calibrationData={calibration} />;
}
