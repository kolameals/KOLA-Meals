import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Tag, Switch, Select, InputNumber, Card, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, TeamOutlined, ReloadOutlined } from '@ant-design/icons';
import deliveryPartnerService, { type DeliveryPartner, type Address, type ApartmentData, type Tower } from '../../../services/deliveryPartner.service';

const { Option } = Select;

const DeliveryPartners = () => {
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [currentPartner, setCurrentPartner] = useState<DeliveryPartner | null>(null);
  const [form] = Form.useForm();
  const [assignmentForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [apartments, setApartments] = useState<ApartmentData[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);

  const fetchApartmentsWithUsers = async () => {
    try {
      const data = await deliveryPartnerService.getApartmentsWithUsers();
      console.log('Fetched apartments data:', data);
      setApartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch apartment data:', error);
      message.error('Failed to fetch apartment data');
      setApartments([]);
    }
  };

  const fetchPartners = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await deliveryPartnerService.getDeliveryPartners(page, pageSize);
      console.log('Delivery partners response:', response);
      
      // Ensure we have the correct data structure
      if (response && response.data && Array.isArray(response.data)) {
        setPartners(response.data);
        setPagination({
          current: response.meta.page,
          pageSize: response.meta.limit,
          total: response.meta.total,
        });
      } else {
        console.error('Invalid response structure:', response);
        setPartners([]);
        setPagination({
          current: 1,
          pageSize: 10,
          total: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching delivery partners:', error);
      message.error('Failed to fetch delivery partners');
      setPartners([]);
      setPagination({
        current: 1,
        pageSize: 10,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
    fetchApartmentsWithUsers();
  }, []);

  // Fetch towers on mount
  useEffect(() => {
    const fetchTowers = async () => {
      try {
        const data = await deliveryPartnerService.getTowers();
        setTowers(Array.isArray(data) ? data : []);
      } catch (error) {
        message.error('Failed to fetch towers');
        setTowers([]);
      }
    };
    fetchTowers();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchPartners(pagination.current, pagination.pageSize);
  };

  const getAvailableRooms = (selectedTowers: string[], currentPartnerId?: string) => {
    // Generate all possible room numbers for selected towers
    const allRooms = selectedTowers.flatMap(towerId => {
      const tower = towers.find(t => t.id === towerId);
      if (!tower) return [];
      const rooms: string[] = [];
      for (let floor = 1; floor <= tower.floors; floor++) {
        for (let room = 1; room <= tower.roomsPerFloor; room++) {
          rooms.push(`${tower.name}-${floor}${room.toString().padStart(2, '0')}`);
        }
      }
      return rooms;
    });
    // Get rooms that are already assigned to other delivery partners
    const assignedRooms = partners
      .filter(partner => partner.id !== currentPartnerId)
      .flatMap(partner => partner.deliveryAgent?.assignedRooms || []);
    // Filter out already assigned rooms
    return allRooms.filter(room => !assignedRooms.includes(room));
  };

  const handleTowerChange = (selectedTowers: string[], form: any, currentPartnerId?: string) => {
    const mealCount = form.getFieldValue('mealCount') || 35;
    const currentRooms = form.getFieldValue('assignedRooms') || [];
    
    // Get available rooms for selected towers
    const availableRooms = getAvailableRooms(selectedTowers, currentPartnerId);

    // Filter out rooms that are not in the available rooms list
    const roomsToKeep = currentRooms.filter((room: string) => availableRooms.includes(room));

    // Combine kept rooms with new rooms, up to meal count limit
    const newRooms = [...roomsToKeep, ...availableRooms]
      .filter((room, index, self) => self.indexOf(room) === index)
      .slice(0, mealCount);

    form.setFieldsValue({ assignedRooms: newRooms });
  };

  const handleMealCountChange = (value: number, form: any) => {
    const currentRooms = form.getFieldValue('assignedRooms') || [];
    if (currentRooms.length > value) {
      form.setFieldsValue({ assignedRooms: currentRooms.slice(0, value) });
    }
  };

  const handleOpenModal = (partner?: DeliveryPartner) => {
    if (partner) {
      setCurrentPartner(partner);
      form.setFieldsValue({
        name: partner.name,
        email: partner.email,
        phoneNumber: partner.phoneNumber,
        assignedTowers: partner.deliveryAgent?.assignedTowers || [],
        assignedRooms: partner.deliveryAgent?.assignedRooms || [],
        mealCount: partner.deliveryAgent?.mealCount || 35,
      });
    } else {
      setCurrentPartner(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleOpenAssignmentModal = (partner: DeliveryPartner) => {
    setCurrentPartner(partner);
    assignmentForm.setFieldsValue({
      assignedTowers: partner.deliveryAgent?.assignedTowers || [],
      assignedRooms: partner.deliveryAgent?.assignedRooms || [],
      mealCount: partner.deliveryAgent?.mealCount || 35,
    });
    setIsAssignmentModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPartner(null);
    form.resetFields();
  };

  const handleCloseAssignmentModal = () => {
    setIsAssignmentModalOpen(false);
    assignmentForm.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      if (currentPartner) {
        await deliveryPartnerService.updateDeliveryPartner(currentPartner.id, values);
        message.success('Delivery partner updated successfully');
      } else {
        await deliveryPartnerService.createDeliveryPartner(values);
        message.success('Delivery partner created successfully');
      }
      handleCloseModal();
      fetchPartners(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to save delivery partner');
    }
  };

  const handleAssignmentSubmit = async (values: any) => {
    try {
      if (currentPartner) {
        await deliveryPartnerService.updateDeliveryAgentAssignments(currentPartner.id, values);
        message.success('Assignments updated successfully');
        handleCloseAssignmentModal();
        fetchPartners(pagination.current, pagination.pageSize);
      }
    } catch (error) {
      message.error('Failed to update assignments');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deliveryPartnerService.deleteDeliveryPartner(id);
      message.success('Delivery partner deleted successfully');
      fetchPartners(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to delete delivery partner');
    }
  };

  const handleStatusChange = async (id: string, isAvailable: boolean) => {
    try {
      await deliveryPartnerService.updateDeliveryAgentStatus(id, isAvailable);
      message.success('Status updated successfully');
      fetchPartners(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const handleResetAssignments = async () => {
    try {
      await deliveryPartnerService.resetAllAssignments();
      message.success('All assignments have been reset successfully');
      fetchPartners(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to reset assignments');
    }
  };

  const renderTowerAndRoomFields = (form: any, isAssignmentModal: boolean = false) => {
    const currentPartnerId = currentPartner?.id;
    const selectedTowers = form.getFieldValue('assignedTowers') || [];
    const availableRooms = getAvailableRooms(selectedTowers, currentPartnerId);

    return (
      <>
        <Form.Item
          name="assignedTowers"
          label="Assigned Towers"
          rules={[{ required: true, message: 'Please select towers' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select towers"
            onChange={(value) => handleTowerChange(value, form, currentPartnerId)}
          >
            {towers.map(tower => (
              <Option key={tower.id} value={tower.id}>
                {tower.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="assignedRooms"
          label="Assigned Rooms"
          rules={[{ required: true, message: 'Please select rooms' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select rooms"
            disabled={selectedTowers.length === 0}
          >
            {availableRooms.map(room => (
              <Option key={room} value={room}>
                {room}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="mealCount"
          label="Meal Count"
          rules={[{ required: true, message: 'Please enter meal count' }]}
          initialValue={35}
        >
          <InputNumber
            min={1}
            max={100}
            onChange={(value) => handleMealCountChange(value || 35, form)}
          />
        </Form.Item>
      </>
    );
  };

  const renderMainModal = () => (
    <Modal
      title={currentPartner ? 'Edit Delivery Partner' : 'Add Delivery Partner'}
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input />
        </Form.Item>

        {renderTowerAndRoomFields(form)}

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {currentPartner ? 'Update' : 'Create'}
            </Button>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderAssignmentModal = () => (
    <Modal
      title="Update Assignments"
      open={isAssignmentModalOpen}
      onCancel={handleCloseAssignmentModal}
      footer={null}
    >
      <Form
        form={assignmentForm}
        layout="vertical"
        onFinish={handleAssignmentSubmit}
      >
        {renderTowerAndRoomFields(assignmentForm, true)}

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
            <Button onClick={handleCloseAssignmentModal}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Location',
      key: 'location',
      render: (record: DeliveryPartner) => (
        <span>{record.deliveryAgent?.currentLocation || '-'}</span>
      ),
    },
    {
      title: 'Assigned Towers',
      key: 'towers',
      render: (record: DeliveryPartner) => {
        console.log('Delivery Partner Tower Details:', record.deliveryAgent?.assignedTowerDetails);
        const towerDetails = record.deliveryAgent?.assignedTowerDetails || [];
        return towerDetails.length > 0 ? (
          <Space wrap>
            {towerDetails.map((tower: { id: string; name: string; floors: number; roomsPerFloor: number }) => (
              <Tag key={tower.id} color="blue">
                {tower.name} ({tower.floors} floors, {tower.roomsPerFloor} rooms/floor)
              </Tag>
            ))}
          </Space>
        ) : '-';
      },
    },
    {
      title: 'Assigned Rooms',
      key: 'rooms',
      render: (record: DeliveryPartner) => {
        const rooms = record.deliveryAgent?.assignedRooms || [];
        return rooms.length > 0 ? (
          <Space wrap>
            {rooms.map(room => (
              <Tag key={room} color="green">{room}</Tag>
            ))}
          </Space>
        ) : '-';
      },
    },
    {
      title: 'Meal Count',
      key: 'mealCount',
      render: (record: DeliveryPartner) => (
        <span>{record.deliveryAgent?.mealCount || '-'} meals</span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: DeliveryPartner) => (
        <Switch
          checked={record.deliveryAgent?.isAvailable}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: DeliveryPartner) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Edit
          </Button>
          <Button
            type="default"
            icon={<TeamOutlined />}
            onClick={() => handleOpenAssignmentModal(record)}
          >
            Assignments
          </Button>
          <Popconfirm
            title="Delete Delivery Partner"
            description="Are you sure you want to delete this delivery partner?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Delivery Partners</h1>
        <Space>
          <Popconfirm
            title="Reset All Assignments"
            description="Are you sure you want to reset all apartment assignments? This will clear all tower and room assignments for all delivery partners."
            onConfirm={handleResetAssignments}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="default"
              icon={<ReloadOutlined />}
              danger
            >
              Reset All Assignments
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Add Delivery Partner
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={partners}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      {renderMainModal()}
      {renderAssignmentModal()}
    </div>
  );
};

export default DeliveryPartners; 