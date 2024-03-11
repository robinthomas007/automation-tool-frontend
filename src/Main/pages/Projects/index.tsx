import React, { useState } from 'react'
// import { Button, DatePicker } from 'antd';
import { Button, message, Steps, theme } from 'antd';
import CreateProject from './createProject'
import CreateResource from './createResource'
import './project.css';

export default function CreateProjectCoponent() {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const steps = [
        {
            title: 'Create Project',
            content: <CreateProject next={next} />,
        },
        {
            title: 'Create Object',
            content: <CreateResource next={next} />,
        },
        {
            title: 'Create Steps',
            content: 'Create Steps',
        },
        {
            title: 'Create Test',
            content: 'Create Test',
        },
        {
            title: 'Create Suites',
            content: 'Create Suites',
        },
    ];



    const prev = () => {
        setCurrent(current - 1);
    };

    const onChange = (value: number) => {
        setCurrent(value);
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
        padding: 20,
        minHeight: 200,
        marginBottom: 16,
    };

    return (
        <div>
            <Steps current={current} items={items} onChange={onChange} />
            <div style={contentStyle}>{steps[current].content}</div>
            <div style={{ marginTop: 0, display: 'flex', justifyContent: 'end' }}>
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        Previous
                    </Button>
                )}

                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                        Done
                    </Button>
                )}

            </div>
        </div>
    )
}
