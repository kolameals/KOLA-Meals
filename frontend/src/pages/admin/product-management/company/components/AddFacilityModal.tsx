import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch } from '@/store';
import { createFacilityCost } from '@/store/slices/costSlice';
import { Loader2 } from 'lucide-react';

interface AddFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FacilityFormData {
  name: string;
  description: string;
  type: 'kitchen' | 'office' | 'warehouse';
  rentAmount: string;
  maintenanceAmount: string;
  utilitiesAmount: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ONE_TIME';
  startDate: string;
  endDate: string;
}

const AddFacilityModal: React.FC<AddFacilityModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [facilityData, setFacilityData] = useState<FacilityFormData>({
    name: '',
    description: '',
    type: 'kitchen',
    rentAmount: '',
    maintenanceAmount: '',
    utilitiesAmount: '',
    frequency: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFacilityData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFacilityData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        ...facilityData,
        rentAmount: parseFloat(facilityData.rentAmount) || 0,
        maintenanceAmount: parseFloat(facilityData.maintenanceAmount) || 0,
        utilitiesAmount: parseFloat(facilityData.utilitiesAmount) || 0,
        startDate: new Date(facilityData.startDate),
        endDate: facilityData.endDate ? new Date(facilityData.endDate) : undefined
      };

      await dispatch(createFacilityCost(formData)).unwrap();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating facility cost:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Facility</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Facility Name</Label>
            <Input
              id="name"
              name="name"
              value={facilityData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={facilityData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Facility Type</Label>
            <Select
              value={facilityData.type}
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select facility type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kitchen">Kitchen</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rentAmount">Rent Amount</Label>
              <Input
                id="rentAmount"
                name="rentAmount"
                type="number"
                value={facilityData.rentAmount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenanceAmount">Maintenance Amount</Label>
              <Input
                id="maintenanceAmount"
                name="maintenanceAmount"
                type="number"
                value={facilityData.maintenanceAmount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="utilitiesAmount">Utilities Amount</Label>
              <Input
                id="utilitiesAmount"
                name="utilitiesAmount"
                type="number"
                value={facilityData.utilitiesAmount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Payment Frequency</Label>
            <Select
              value={facilityData.frequency}
              onValueChange={(value) => handleSelectChange('frequency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="ONE_TIME">One Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={facilityData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={facilityData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Facility'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFacilityModal; 