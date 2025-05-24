import api from './api';

export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  lastUpdated: string;
  createdAt: string;
}

export interface CreateInventoryItemDto {
  name: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
}

export interface UpdateStockDto {
  quantity: number;
}

export interface WasteRecord {
  id: string;
  itemId: string;
  quantity: number;
  reason: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  item: InventoryItem;
}

export interface RecordWasteDto {
  quantity: number;
  reason: string;
}

export const inventoryService = {
  async getInventoryItems(): Promise<InventoryItem[]> {
    const response = await api.get('/inventory');
    return response.data;
  },

  async getLowStockItems(): Promise<InventoryItem[]> {
    const response = await api.get('/inventory/low-stock');
    return response.data;
  },

  async createInventoryItem(data: CreateInventoryItemDto): Promise<InventoryItem> {
    const response = await api.post('/inventory', data);
    return response.data;
  },

  async updateStock(itemId: string, data: UpdateStockDto): Promise<InventoryItem> {
    const response = await api.patch(`/inventory/${itemId}/stock`, data);
    return response.data;
  },

  async recordWaste(itemId: string, data: RecordWasteDto): Promise<{ wasteRecord: WasteRecord; updatedItem: InventoryItem }> {
    const response = await api.post(`/inventory/${itemId}/waste`, data);
    return response.data;
  },

  async getWasteRecords(): Promise<WasteRecord[]> {
    const response = await api.get('/inventory/waste-records');
    return response.data;
  },

  async deleteInventoryItem(id: string): Promise<void> {
    await api.delete(`/inventory/${id}`);
  }
}; 