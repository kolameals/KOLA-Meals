import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  Users, 
  Loader2, 
  IndianRupee, 
  Edit2, 
  Save, 
  X,
  Building2,
  MapPin
} from 'lucide-react';

interface StaffCostsProps {
  staffCosts: any[];
  costSummary: any;
  loading: boolean;
  costPerAgent: number;
  isEditing: boolean;
  onCostChange: (value: number) => void;
  onEditToggle: () => void;
  onSave: () => void;
  selectedMonth: Date;
}

const StaffCosts: React.FC<StaffCostsProps> = ({
  staffCosts,
  costSummary,
  loading,
  costPerAgent,
  isEditing,
  onCostChange,
  onEditToggle,
  onSave,
  selectedMonth
}) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Staff Costs</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track delivery staff costs
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">
            {format(selectedMonth, 'MMMM yyyy')}
          </p>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={costPerAgent}
                onChange={(e) => onCostChange(Number(e.target.value))}
                className="w-32"
              />
              <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={onEditToggle} variant="outline">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={onEditToggle} variant="outline">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Cost per Agent
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700">
              <Users className="h-4 w-4" />
              Total Monthly Staff Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 flex items-center gap-2">
              <IndianRupee className="h-6 w-6" />
              {formatCurrency(costSummary?.staffCosts?.total || 0)}
            </div>
            <p className="text-sm text-blue-600 mt-2">
              {staffCosts.length} delivery partners
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700">
              <IndianRupee className="h-4 w-4" />
              Cost per Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 flex items-center gap-2">
              <IndianRupee className="h-6 w-6" />
              {formatCurrency(costPerAgent)}
            </div>
            <p className="text-sm text-green-600 mt-2">
              Monthly base cost per delivery partner
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffCosts.map((cost) => (
              <Card key={cost.id} className="hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{cost.user.name}</h3>
                      <p className="text-sm text-gray-500">{cost.user.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(cost.baseSalary)}
                      </div>
                      <div className="text-sm text-gray-500">Monthly</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="h-4 w-4" />
                      <span>{cost.user.deliveryAgent?.apartment?.name || 'No apartment assigned'}</span>
                    </div>
                    {cost.user.deliveryAgent?.assignedTowers?.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>Towers: {cost.user.deliveryAgent.assignedTowers.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffCosts; 