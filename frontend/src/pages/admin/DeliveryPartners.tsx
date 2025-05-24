import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeliveryPartners, addDeliveryPartner, updateDeliveryPartner, deleteDeliveryPartner } from '../../store/slices/deliveryPartnerSlice';
import type { RootState } from '../../store';
import type { DeliveryPartner } from '../../services/deliveryPartner.service';
import type { AppDispatch } from '../../store';

interface DeliveryPartnerFormData extends Omit<DeliveryPartner, 'id' | 'createdAt' | 'updatedAt'> {
  password?: string;
}

const DeliveryPartners = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { partners, loading, error } = useSelector((state: RootState) => state.deliveryPartner);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPartner, setCurrentPartner] = useState<Partial<DeliveryPartner> | null>(null);
  const [formData, setFormData] = useState<DeliveryPartnerFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  console.log('Current state:', { partners, loading, error });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting to fetch delivery partners...');
        const token = localStorage.getItem('token');
        console.log('Auth token:', token ? 'Present' : 'Missing');
        console.log('User role:', localStorage.getItem('userRole'));
        
        const resultAction = await dispatch(fetchDeliveryPartners());
        console.log('Fetch result:', resultAction);
        
        if (fetchDeliveryPartners.rejected.match(resultAction)) {
          console.error('Error in fetch result:', resultAction.error);
          console.error('Error details:', resultAction.payload);
        } else {
          console.log('Delivery partners fetched successfully:', resultAction.payload);
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
      }
    };
    fetchData();
  }, [dispatch]);

  const handleOpenModal = (partner?: DeliveryPartner) => {
    if (partner) {
      setCurrentPartner(partner);
      setFormData({
        name: partner.name,
        email: partner.email,
        phoneNumber: partner.phoneNumber
      });
    } else {
      setCurrentPartner(null);
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        password: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPartner(null);
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      password: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentPartner) {
        await dispatch(updateDeliveryPartner({ id: currentPartner.id!, data: formData }));
      } else {
        if (!formData.password) {
          throw new Error('Password is required for new delivery partners');
        }
        await dispatch(addDeliveryPartner({
          ...formData,
          password: formData.password
        }));
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this delivery partner?')) {
      await dispatch(deleteDeliveryPartner(id));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Delivery Partners</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => handleOpenModal()}
      >
        Add Delivery Partner
      </button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Phone</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner: DeliveryPartner) => (
            <tr key={partner.id}>
              <td className="py-2">{partner.name}</td>
              <td className="py-2">{partner.email}</td>
              <td className="py-2">{partner.phoneNumber}</td>
              <td className="py-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleOpenModal(partner)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(partner.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <h2 className="text-xl font-bold mb-4">
              {currentPartner ? 'Edit Delivery Partner' : 'Add Delivery Partner'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border p-1 w-full"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border p-1 w-full"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block">Phone</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="border p-1 w-full"
                  required
                />
              </div>
              {!currentPartner && (
                <div className="mb-2">
                  <label className="block">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border p-1 w-full"
                    required
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {currentPartner ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPartners; 