import React from 'react';
import { useNavigate } from 'react-router-dom';

import { BasePropertyComponent } from 'adminjs';

import { Box, Button, Icon } from "@adminjs/design-system";
import { ApiClient, useNotice } from 'adminjs'

const api = new ApiClient()

export const Answer = (props) => {
    console.log('Answer props:', props);
    console.log(props.resource.showProperties.find(p => p.name == "answers").subProperties[0])
    const { resource, record } = props;
    const [answer, setAnswer] = React.useState("");
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate();
    const onNotice = useNotice();

    const handleChange = (propertyName, val) => {
        setAnswer(val);
    };

    const onSubmit = async () => {
        setLoading(true)
        api.recordAction({
            resourceId: resource.id,
            recordId: record.id,
            actionName: 'answer',
            data: {
                text: answer
            }
        }).then((response) => {
            setLoading(false)
            let skipNavigation = false;
            if (response.data.notice) {
                onNotice(response.data.notice)
                if (response.data.notice.type != 'success') {
                    skipNavigation = true;
                }
            }
            if (response.data.err) {
                throw new Error(response.data.msg)
            }
            if (skipNavigation) return;
            navigate(-1);
        }).catch(() => {
            setLoading(false)
            onNotice({
                message:
                    'There was an error answering this question.',
                type: 'error',
            })
        });
    }

    return (
        <Box>
            <BasePropertyComponent {...props} where={'edit'} property={props.resource.showProperties.find(p => p.name == "answers").subProperties[0]} onChange={handleChange} />
            <Button variant={'contained'} onClick={onSubmit} disabled={loading}>
                {loading ? (<Icon icon="Loader" spin />) : null}
                Submit
            </Button>
        </Box>
    );
}

export default Answer;
