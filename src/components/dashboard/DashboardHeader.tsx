import { getUserLabs } from '@/app/actions/labs';
import LabSelector from './LabSelector';
import LogoutButton from './LogoutButton';

// Hardcoded to Maxine's user for development
const MAXINE_USER_ID = '96d0d265-a40b-4b74-8cf2-03f1244139a5';

export default async function DashboardHeader() {
    const labs = await getUserLabs(MAXINE_USER_ID);

    // Mock user data
    const user = {
        full_name: 'Dr. Maxine Mustermann',
        email: 'maxine.mustermann@gmail.com'
    };

    return (
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
                <LabSelector labs={labs} />
                <div className="flex items-center gap-3 border-l border-gray-300 pl-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
