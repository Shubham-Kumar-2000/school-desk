import React from 'react';
import { BasePropertyComponent } from 'adminjs';

import { Box } from "@adminjs/design-system";

export const NoticeTargets = (props) => {
    const currentAudienceType = props.record.params?.['targets.audienceType'];
    const [audienceType, setAudienceType] = React.useState(currentAudienceType || 'ALL');
    const [ackReq, setAckReq] = React.useState(props.record.params?.['targets.acknowdegementRequired']);

    const handleChange = (propertyName, val) => {
        if (propertyName === 'targets.audienceType') {
            setAudienceType(val);
        }
        if (propertyName === 'targets.acknowdegementRequired') {
            setAckReq(val);
        }

        props.onChange(propertyName, val);
    };

    return (
        <Box>
            {
                props.property.subProperties.map((property) => {
                    if (audienceType === 'ALL' && property.name != 'audienceType') return;
                    if (audienceType === 'STUDENT' && !(['audienceType', 'student', 'acknowdegementRequired', 'acknowledgedBy', 'acknowledged'].includes(property.name))) return;
                    if (audienceType === 'CLASS' && !(['audienceType', 'class'].includes(property.name))) return;
                    if (audienceType === 'GROUP_OF_STUDENTS' && !(['audienceType', 'students', 'acknowdegementRequired', 'acknowledgedBy', 'acknowledged'].includes(property.name))) return;
                    if ((!ackReq || props.where != 'show') && ['acknowledgedBy', 'acknowledged'].includes(property.name)) return;
                    return (
                        <BasePropertyComponent {...props} property={property} onChange={handleChange} />
                    )
                })
            }
        </Box>
    );
}

export default NoticeTargets;
