import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Building2, 
  Loader2, 
  IndianRupee, 
  Calendar, 
  Clock, 
  ChevronDown,
  ChevronUp,
  Wrench,
  Zap,
  Home,
  BadgeCheck,
  Warehouse,
  Building
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAppDispatch } from '@/store';
import { fetchFacilityCosts } from '@/store/slices/costSlice';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import AddFacilityModal from '@/pages/admin/product-management/company/components/AddFacilityModal';
import { format } from 'date-fns';

interface FacilityCostsProps {
  facilityCosts: any[];
  costSummary: any;
  loading: boolean;
  selectedMonth: Date;
}

const FacilityCosts: React.FC<FacilityCostsProps> = ({
  facilityCosts,
  costSummary,
  loading,
  selectedMonth
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const handleAddSuccess = () => {
    dispatch(fetchFacilityCosts());
  };

  const toggleExpand = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'kitchen':
        return <Home className="h-5 w-5" />;
      case 'office':
        return <Building className="h-5 w-5" />;
      case 'warehouse':
        return <Warehouse className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  const renderFacilityCostDetails = (cost: any) => {
    const isExpanded = expandedItems.includes(cost.id);
    const totalMonthly = Number(cost.rentAmount || 0) + 
                        Number(cost.maintenanceAmount || 0) + 
                        Number(cost.utilitiesAmount || 0);

    return (
      <div className="space-y-4">
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
          onClick={() => toggleExpand(cost.id)}
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              {getFacilityIcon(cost.type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{cost.name}</h3>
              <p className="text-sm text-gray-500">{cost.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
              {cost.type}
            </Badge>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pl-16 pr-4 pb-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cost.rentAmount && (
                  <Card className="bg-white border-blue-100 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <Home className="h-4 w-4" />
                        <span className="font-medium">Rent Amount</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(Number(cost.rentAmount))}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {cost.frequency} payment
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {cost.maintenanceAmount && (
                  <Card className="bg-white border-green-100 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-green-600 mb-2">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium">Maintenance Amount</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(Number(cost.maintenanceAmount))}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {cost.frequency} payment
                      </p>
                    </CardContent>
                  </Card>
                )}

                {cost.utilitiesAmount && (
                  <Card className="bg-white border-yellow-100 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-yellow-600 mb-2">
                        <Building className="h-4 w-4" />
                        <span className="font-medium">Utilities Amount</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(Number(cost.utilitiesAmount))}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {cost.frequency} payment
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white border-gray-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Duration</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-900">
                        Start: {format(new Date(cost.startDate), 'MMMM d, yyyy')}
                      </p>
                      {cost.endDate && (
                        <p className="text-sm text-gray-900">
                          End: {format(new Date(cost.endDate), 'MMMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-white border-purple-100 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-purple-600 mb-2">
                    <IndianRupee className="h-4 w-4" />
                    <span className="font-medium">Total Monthly Cost</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalMonthly)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {cost.frequency === 'MONTHLY' ? 'per month' : 
                     cost.frequency === 'WEEKLY' ? 'per week' :
                     cost.frequency === 'DAILY' ? 'per day' : 'one-time'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Facility Costs</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all facility-related costs
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">
            {format(selectedMonth, 'MMMM yyyy')}
          </p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" 
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Facility
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700">
              <Building2 className="h-4 w-4" />
              Total Monthly Facility Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 flex items-center gap-2">
              <IndianRupee className="h-6 w-6" />
              {formatCurrency(costSummary?.facilityCosts?.total || 0)}
            </div>
            <p className="text-sm text-blue-600 mt-2">
              {facilityCosts.length} active facilities
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700">
              <Building2 className="h-4 w-4" />
              Facility Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Kitchens</span>
                <span className="font-medium text-gray-900">
                  {facilityCosts.filter(cost => cost.type === 'kitchen').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Offices</span>
                <span className="font-medium text-gray-900">
                  {facilityCosts.filter(cost => cost.type === 'office').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Warehouses</span>
                <span className="font-medium text-gray-900">
                  {facilityCosts.filter(cost => cost.type === 'warehouse').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-2">
            {facilityCosts.map((cost) => (
              <Card key={cost.id} className="border-gray-200 hover:shadow-md transition-all duration-200">
                <CardContent className="p-0">
                  {renderFacilityCostDetails(cost)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddFacilityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default FacilityCosts; 