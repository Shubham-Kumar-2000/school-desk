import React from 'react';
import { BasePropertyComponent } from 'adminjs';

import { Box } from "@adminjs/design-system";

export const NoticeTargets = (props) => {
    console.log(props)
    const currentAudienceType = props.record.params?.['targets.audienceType'];
    const [audienceType, setAudienceType] = React.useState(currentAudienceType || 'ALL');
    const [ackReq, setAckReq] = React.useState(props.record.params?.['targets.acknowledgementRequired']);

    const handleChange = (propertyName, val) => {
        if (propertyName === 'targets.audienceType') {
            setAudienceType(val);
        }
        if (propertyName === 'targets.acknowledgementRequired') {
            setAckReq(val);
        }

        props.onChange(propertyName, val);
    };

    return (
        <Box>
            {
                props.property.subProperties.map((property) => {
                    const propertyName = property.name.split('.').pop()
                    if (audienceType === 'ALL' && propertyName != 'audienceType') return;
                    if (audienceType === 'STUDENT' && !(['audienceType', 'student', 'acknowledgementRequired', 'acknowledgedBy', 'acknowledged'].includes(propertyName))) return;
                    if (audienceType === 'CLASS' && !(['audienceType', 'class'].includes(propertyName))) return;
                    if (audienceType === 'GROUP_OF_STUDENTS' && !(['audienceType', 'students', 'acknowledgementRequired', 'acknowledgedBy', 'acknowledged'].includes(propertyName))) return;
                    if (!ackReq && ['acknowledgedBy', 'acknowledged'].includes(propertyName)) return;
                    return (
                        <BasePropertyComponent {...props} property={property} onChange={handleChange} />
                    )
                })
            }
        </Box>
    );
}

export default NoticeTargets;
