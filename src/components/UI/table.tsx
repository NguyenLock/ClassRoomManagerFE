import { Table, Card, Button, Input, Space } from "antd";
import { Search, Plus, Filter } from "lucide-react";
import { ReusableTableProps } from "../../types";

const ReusableTable = <T extends Record<string, any>>({
  title = "Data Table",
  data,
  columns,
  loading = false,
  onAdd,
  onSearch,
  onFilter,
  addButtonText = "Add New",
  searchPlaceholder = "Search...",
  showActions = true,
}: ReusableTableProps<T>) => {
  return (
    <Card className="shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <h3 className="text-xl font-semibold text-gray-900 font-sans">
          {title}
        </h3>

        {showActions && (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 font-sans">
            <Input
              placeholder={searchPlaceholder}
              prefix={<Search size={16} className="text-gray-400" />}
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full sm:w-64"
              allowClear
            />
            <Space>
              <Button
                icon={<Filter size={16} />}
                onClick={onFilter}
                className="flex items-center font-sans"
              >
                Filter
              </Button>
              <Button
                type="primary"
                icon={<Plus size={16} />}
                onClick={onAdd}
                className="flex items-center font-sans"
              >
                {addButtonText}
              </Button>
            </Space>
          </div>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: true }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        className="overflow-hidden"
      />
    </Card>
  );
};

export default ReusableTable;
