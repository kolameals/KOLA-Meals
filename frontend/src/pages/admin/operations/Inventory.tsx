import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import { fetchInventoryItems, createInventoryItem, updateStock, recordWaste, fetchWasteRecords } from '../../../store/slices/inventorySlice';
import { Button, Table, Modal, Form, Input, InputNumber, message, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { InventoryItem, WasteRecord } from '../../../services/inventory.service';

const { TabPane } = Tabs;
const { confirm } = Modal;

const Inventory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, wasteRecords, loading } = useSelector((state: RootState) => state.inventory);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isWasteModalVisible, setIsWasteModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [form] = Form.useForm();
  const [wasteForm] = Form.useForm();

  useEffect(() => {
    dispatch(fetchInventoryItems());
    dispatch(fetchWasteRecords());
  }, [dispatch]);

  const showModal = (item?: InventoryItem) => {
    setCurrentItem(item || null);
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const showWasteModal = (item: InventoryItem) => {
    setCurrentItem(item);
    wasteForm.resetFields();
    setIsWasteModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleWasteCancel = () => {
    setIsWasteModalVisible(false);
    wasteForm.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      if (currentItem) {
        await dispatch(updateStock({ itemId: currentItem.id, data: { quantity: values.currentStock } }));
        message.success('Stock updated successfully');
      } else {
        await dispatch(createInventoryItem(values));
        message.success('Item created successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleWasteSubmit = async (values: any) => {
    try {
      if (currentItem) {
        await dispatch(recordWaste({ itemId: currentItem.id, data: values }));
        message.success('Waste recorded successfully');
        setIsWasteModalVisible(false);
        wasteForm.resetFields();
      }
    } catch (error) {
      message.error('Failed to record waste');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Current Stock',
      dataIndex: 'currentStock',
      key: 'currentStock',
    },
    {
      title: 'Minimum Stock',
      dataIndex: 'minimumStock',
      key: 'minimumStock',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: InventoryItem) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Update Stock
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showWasteModal(record)}
          >
            Record Waste
          </Button>
        </>
      ),
    },
  ];

  const wasteColumns = [
    {
      title: 'Item',
      dataIndex: ['item', 'name'],
      key: 'itemName',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add New Item
        </Button>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Inventory Items" key="1">
          <Table
            columns={columns}
            dataSource={items}
            rowKey="id"
            loading={loading}
          />
        </TabPane>
        <TabPane tab="Waste Records" key="2">
          <Table
            columns={wasteColumns}
            dataSource={wasteRecords}
            rowKey="id"
            loading={loading}
          />
        </TabPane>
      </Tabs>

      <Modal
        title={currentItem ? 'Update Stock' : 'Add New Item'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {!currentItem && (
            <>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter item name' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="minimumStock"
                label="Minimum Stock"
                rules={[{ required: true, message: 'Please enter minimum stock' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="unit"
                label="Unit"
                rules={[{ required: true, message: 'Please enter unit' }]}
              >
                <Input />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="currentStock"
            label="Current Stock"
            rules={[{ required: true, message: 'Please enter current stock' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentItem ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Record Waste"
        open={isWasteModalVisible}
        onCancel={handleWasteCancel}
        footer={null}
      >
        <Form
          form={wasteForm}
          layout="vertical"
          onFinish={handleWasteSubmit}
        >
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: 'Please enter reason' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Record Waste
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Inventory; 