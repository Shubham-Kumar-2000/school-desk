import { ComponentLoader } from 'adminjs';
import Os from 'os';

export const componentLoader = new ComponentLoader();
export const Components = {};
if (Os.platform() !== 'win32') {
    Components['Dashboard'] = componentLoader.add(
        'Dashboard',
        './dashboard.jsx'
    );
    Components['NoticeTargets'] = componentLoader.add(
        'NoticeTargetsEdit',
        './noticeTargets.jsx'
    );
}
