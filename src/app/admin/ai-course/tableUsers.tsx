"use client"
import { Table } from 'antd';

// rowSelection object indicates the need for row selection
const TableApp = ({ data, set }: any) => {
    // const [selectionType, setSelectionType] = useState('checkbox')
    let District = Array.from(new Set(data.map((a: any) => (a.District)))).map(a => ({ text: a, value: a }))

    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            set(selectedRows)
        },

    };
    const columns: any = [
        {
            title: 'العمر',
            dataIndex: 'births',
            render: (births: any) => <p>{Math.floor(new Date().getFullYear() - births / 10000)}</p>
        },
        {
            title: 'الاسم',
            dataIndex: 'fullName',
        },
        {
            title: 'اهتمامات ',
            dataIndex: 'interests',
        },
        {
            title: 'العمل',
            dataIndex: 'work',
        },
        {
            title: 'العنوان',
            dataIndex: 'District',
            filters: District,
            onFilter: (value: any, record: any) => record.District.includes(value),
        },

        {
            title: 'العنوان',
            dataIndex: 'city',
        },
    ];
    return (
        <div>
            <Table
                rowSelection={{
                    ...rowSelection,
                }}
                rowKey={(_) => _._id}

                columns={columns}
                dataSource={data}
                pagination={false}
            />
        </div>
    );
};
export default TableApp;