import React from 'react';
import { Form, Input, Select, Button, Space } from 'antd';
import type { User, CreateUserData, UpdateUserData } from '../../../../types/user.types';

const { Option } = Select;

interface UserFormProps {
  initialValues?: User;
  onSubmit: (values: CreateUserData | UpdateUserData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const SUPPORTED_APARTMENTS = [
  { id: 'sunrise', name: 'Sunrise Apartments' },
  { id: 'oakwood', name: 'Oakwood Residences' },
  { id: 'greenview', name: 'Greenview Heights' },
  { id: 'riverside', name: 'Riverside Gardens' },
];

const SUBSCRIPTION_PLANS = [
  { id: 'two-meals', name: 'Two Meals Plan', price: 4000, mealsPerDay: 2 },
  { id: 'three-meals', name: 'Three Meals Plan', price: 6000, mealsPerDay: 3 },
];

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSubmit({
      ...values,
      apartment: values.apartment ? {
        name: SUPPORTED_APARTMENTS.find(apt => apt.id === values.apartment)?.name || '',
        tower: values.tower,
        floor: values.floor,
        roomNumber: values.roomNumber,
      } : undefined,
      subscription: values.planId ? {
        planId: values.planId,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      } : undefined,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
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
          { type: 'email', message: 'Please enter a valid email' },
          { required: true, message: 'Please enter email' },
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

      <Form.Item
        name="role"
        label="Role"
        rules={[{ required: true, message: 'Please select role' }]}
      >
        <Select>
          <Option value="USER">User</Option>
          <Option value="ADMIN">Admin</Option>
          <Option value="DELIVERY_PARTNER">Delivery Partner</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="apartment"
        label="Apartment"
      >
        <Select placeholder="Select apartment">
          {SUPPORTED_APARTMENTS.map(apt => (
            <Option key={apt.id} value={apt.id}>{apt.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.apartment !== currentValues.apartment}
      >
        {({ getFieldValue }) => {
          const hasApartment = getFieldValue('apartment');
          return hasApartment ? (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item
                name="tower"
                label="Tower"
                rules={[{ required: true, message: 'Please enter tower' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="floor"
                label="Floor"
                rules={[{ required: true, message: 'Please enter floor' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="roomNumber"
                label="Room Number"
                rules={[{ required: true, message: 'Please enter room number' }]}
              >
                <Input />
              </Form.Item>
            </Space>
          ) : null;
        }}
      </Form.Item>

      <Form.Item
        name="planId"
        label="Subscription Plan"
      >
        <Select placeholder="Select subscription plan">
          {SUBSCRIPTION_PLANS.map(plan => (
            <Option key={plan.id} value={plan.id}>
              {plan.name} (₹{plan.price}/month, {plan.mealsPerDay} meals/day)
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Update' : 'Create'}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UserForm; 