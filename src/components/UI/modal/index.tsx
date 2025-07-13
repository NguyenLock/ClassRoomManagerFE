import { Modal, Form } from "antd";
import { ReusableModalProps } from "../../../types";

const ReusableModal = ({
  title,
  isVisible,
  onOk,
  onCancel,
  loading = false,
  form,
  children,
}: ReusableModalProps) => {
  return (
    <Modal
      title={title}
      open={isVisible}
      onOk={onOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" className="mt-4">
        {children}
      </Form>
    </Modal>
  );
};

export default ReusableModal;
