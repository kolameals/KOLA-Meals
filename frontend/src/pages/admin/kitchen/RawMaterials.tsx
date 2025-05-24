import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import {
  fetchRawMaterials,
  addRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
  updateStock
} from '../../../store/slices/rawMaterialSlice';
import type { RawMaterial } from '../../../services/rawMaterial.service';

const RawMaterials = () => {
  const dispatch = useDispatch();
  const { items: rawMaterials, loading, error } = useSelector((state: RootState) => state.rawMaterials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<RawMaterial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    currentStock: 0,
    minimumStock: 0,
    costPerUnit: 0,
    supplier: ''
  });
  const [stockUpdate, setStockUpdate] = useState({ id: '', quantity: 0 });

  useEffect(() => {
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const handleOpenModal = (material?: RawMaterial) => {
    if (material) {
      setCurrentMaterial(material);
      setFormData({
        name: material.name,
        category: material.category,
        unit: material.unit,
        currentStock: material.currentStock,
        minimumStock: material.minimumStock,
        costPerUnit: material.costPerUnit,
        supplier: material.supplier || ''
      });
    } else {
      setCurrentMaterial(null);
      setFormData({
        name: '',
        category: '',
        unit: '',
        currentStock: 0,
        minimumStock: 0,
        costPerUnit: 0,
        supplier: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentMaterial(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentMaterial) {
        await dispatch(updateRawMaterial({ id: currentMaterial.id, data: formData }));
      } else {
        await dispatch(addRawMaterial(formData));
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save raw material:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this raw material?')) {
      try {
        await dispatch(deleteRawMaterial(id));
      } catch (error) {
        console.error('Failed to delete raw material:', error);
      }
    }
  };

  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateStock({ id: stockUpdate.id, quantity: stockUpdate.quantity }));
      setStockUpdate({ id: '', quantity: 0 });
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Raw Materials Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Raw Material
        </button>
      </div>

      {/* Stock Update Form */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-4">Update Stock</h2>
        <form onSubmit={handleStockUpdate} className="flex gap-4">
          <select
            value={stockUpdate.id}
            onChange={(e) => setStockUpdate({ ...stockUpdate, id: e.target.value })}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Material</option>
            {rawMaterials.map((material) => (
              <option key={material.id} value={material.id}>
                {material.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={stockUpdate.quantity}
            onChange={(e) => setStockUpdate({ ...stockUpdate, quantity: Number(e.target.value) })}
            placeholder="Quantity"
            className="border p-2 rounded"
            required
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Update Stock
          </button>
        </form>
      </div>

      {/* Raw Materials Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/Unit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rawMaterials.map((material) => (
              <tr key={material.id}>
                <td className="px-6 py-4 whitespace-nowrap">{material.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{material.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{material.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap">{material.currentStock}</td>
                <td className="px-6 py-4 whitespace-nowrap">{material.minimumStock}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{material.costPerUnit}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleOpenModal(material)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(material.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentMaterial ? 'Edit Raw Material' : 'Add Raw Material'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Unit</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Current Stock</label>
                <input
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Minimum Stock</label>
                <input
                  type="number"
                  value={formData.minimumStock}
                  onChange={(e) => setFormData({ ...formData, minimumStock: Number(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Cost per Unit</label>
                <input
                  type="number"
                  value={formData.costPerUnit}
                  onChange={(e) => setFormData({ ...formData, costPerUnit: Number(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {currentMaterial ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RawMaterials; 