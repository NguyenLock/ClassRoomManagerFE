import { Table, Card, Button, Input, Space } from "antd";
import { Search, Plus, Filter } from "lucide-react";
import { ReusableTableProps } from "../../types";

const ReusableTable = <T extends object>({
  title,
  data,
  columns,
  loading = false,
  onAdd,
  onSearch,
  onFilter,
  addButtonText = "Add New",
  searchPlaceholder = "Search...",
  showActions = true,
  hideAddButton = false,
}: ReusableTableProps<T>) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center space-x-4">
            {onSearch && (
              <Input.Search
                placeholder={searchPlaceholder}
                onSearch={onSearch}
                className="w-64"
              />
            )}
            {onFilter && (
              <Button
                icon={<Filter size={16} />}
                onClick={onFilter}
                className="border-gray-300"
              >
                Filter
              </Button>
            )}
            {!hideAddButton && onAdd && (
              <Button
                type="primary"
                icon={<Plus size={16} />}
                onClick={onAdd}
                className="bg-blue-600"
              >
                {addButtonText}
              </Button>
            )}
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
        />
      </div>
    </div>
  );
};

export default ReusableTable;
