import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { createEquipmentCost } from '@/store/slices/costSlice';

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface EquipmentFormData {
  name: string;
  description: string;
  category: string;
  paymentType: 'one-time' | 'emi' | 'rented';
  purchaseDate: string;
  purchaseAmount: string;
  monthlyRent: string;
  securityDeposit: string;
  emiAmount: string;
  emiFrequency: string;
  totalEmis: string;
  remainingEmis: string;
  rentDuration: string;
  status: string;
}

const EQUIPMENT_CATEGORIES = [
  { id: 'kitchen', name: 'Kitchen Equipment', icon: '🍳' },
  { id: 'delivery', name: 'Delivery Equipment', icon: '🛵' },
  { id: 'office', name: 'Office Equipment', icon: '💻' },
  { id: 'other', name: 'Other Equipment', icon: '📦' }
];

const PAYMENT_TYPES = [
  { id: 'rented', name: 'Rented Equipment' },
  { id: 'one-time', name: 'One-time Purchase' },
  { id: 'emi', name: 'EMI Based' }
];

const EMI_FREQUENCIES = [
  { id: 'MONTHLY', name: 'Monthly' },
  { id: 'WEEKLY', name: 'Weekly' },
  { id: 'DAILY', name: 'Daily' },
  { id: 'ONE_TIME', name: 'One Time' }
];

const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [equipmentData, setEquipmentData] = useState<EquipmentFormData>({
    name: '',
    description: '',
    category: '',
    paymentType: 'one-time',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseAmount: '',
    monthlyRent: '',
    securityDeposit: '',
    emiAmount: '',
    emiFrequency: 'MONTHLY',
    totalEmis: '',
    remainingEmis: '',
    rentDuration: 'MONTHLY',
    status: 'ACTIVE'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEquipmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEquipmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        ...equipmentData,
        totalEmis: parseInt(equipmentData.totalEmis) || 0,
        remainingEmis: parseInt(equipmentData.remainingEmis) || 0,
        purchaseAmount: parseFloat(equipmentData.purchaseAmount) || 0,
        emiAmount: parseFloat(equipmentData.emiAmount) || 0,
        monthlyRent: parseFloat(equipmentData.monthlyRent) || 0,
        securityDeposit: parseFloat(equipmentData.securityDeposit) || 0,
        emiFrequency: equipmentData.emiFrequency as 'MONTHLY' | 'WEEKLY' | 'DAILY' | 'ONE_TIME',
        purchaseDate: new Date(equipmentData.purchaseDate)
      };

      await dispatch(createEquipmentCost(formData)).unwrap();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating equipment cost:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Equipment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Equipment Name</Label>
              <Input
                id="name"
                name="name"
                value={equipmentData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={equipmentData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EQUIPMENT_CATEGORIES.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={equipmentData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentType">Payment Type</Label>
            <Select
              value={equipmentData.paymentType}
              onValueChange={(value) => handleSelectChange('paymentType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_TYPES.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {equipmentData.paymentType === 'rented' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyRent">Monthly Rent</Label>
                <Input
                  id="monthlyRent"
                  name="monthlyRent"
                  type="number"
                  value={equipmentData.monthlyRent}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Security Deposit</Label>
                <Input
                  id="securityDeposit"
                  name="securityDeposit"
                  type="number"
                  value={equipmentData.securityDeposit}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          {equipmentData.paymentType === 'emi' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emiAmount">EMI Amount</Label>
                <Input
                  id="emiAmount"
                  name="emiAmount"
                  type="number"
                  value={equipmentData.emiAmount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emiFrequency">EMI Frequency</Label>
                <Select
                  value={equipmentData.emiFrequency}
                  onValueChange={(value) => handleSelectChange('emiFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMI_FREQUENCIES.map(freq => (
                      <SelectItem key={freq.id} value={freq.id}>
                        {freq.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalEmis">Total EMIs</Label>
                <Input
                  id="totalEmis"
                  name="totalEmis"
                  type="number"
                  value={equipmentData.totalEmis}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remainingEmis">Remaining EMIs</Label>
                <Input
                  id="remainingEmis"
                  name="remainingEmis"
                  type="number"
                  value={equipmentData.remainingEmis}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          {equipmentData.paymentType === 'one-time' && (
            <div className="space-y-2">
              <Label htmlFor="purchaseAmount">Purchase Amount</Label>
              <Input
                id="purchaseAmount"
                name="purchaseAmount"
                type="number"
                value={equipmentData.purchaseAmount}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Equipment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEquipmentModal; 