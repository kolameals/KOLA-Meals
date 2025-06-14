import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  PlusCircle, 
  Package, 
  Loader2, 
  IndianRupee, 
  Calendar, 
  Clock, 
  ChevronDown,
  ChevronUp,
  CreditCard,
  Repeat,
  ShoppingCart
} from 'lucide-react';
import { useAppDispatch } from '@/store';
import { fetchEquipmentCosts } from '@/store/slices/costSlice';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils'; 
import AddEquipmentModal from '@/pages/admin/product-management/company/components/AddEquipmentModal';

interface EquipmentCostsProps {
  equipmentCosts: any[];
  costSummary: any;
  loading: boolean;
  selectedMonth: Date;
}

const EquipmentCosts: React.FC<EquipmentCostsProps> = ({
  equipmentCosts,
  costSummary,
  loading,
  selectedMonth
}) => {
  const dispatch = useAppDispatch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const handleAddSuccess = () => {
    dispatch(fetchEquipmentCosts());
  };

  const toggleExpand = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'one-time':
        return <ShoppingCart className="h-5 w-5" />;
      case 'emi':
        return <CreditCard className="h-5 w-5" />;
      case 'rented':
        return <Repeat className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const renderEquipmentCostDetails = (cost: any) => {
    const isExpanded = expandedItems.includes(cost.id);

    return (
      <div className="space-y-4">
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
          onClick={() => toggleExpand(cost.id)}
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              {getPaymentTypeIcon(cost.paymentType)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{cost.name}</h3>
              <p className="text-sm text-gray-500">{cost.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
              {cost.paymentType}
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
              {cost.paymentType === 'one-time' && cost.purchaseAmount && (
                <Card className="bg-white border-blue-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="font-medium">Purchase Amount</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(Number(cost.purchaseAmount))}
                    </p>
                    {cost.purchaseDate && (
                      <p className="text-sm text-gray-500 mt-1">
                        Purchased on {format(new Date(cost.purchaseDate), 'MMMM d, yyyy')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {cost.paymentType === 'emi' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cost.emiAmount && (
                    <Card className="bg-white border-green-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                          <CreditCard className="h-4 w-4" />
                          <span className="font-medium">EMI Amount</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(Number(cost.emiAmount))}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {cost.emiFrequency} payments
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {cost.totalEmis && cost.remainingEmis && (
                    <Card className="bg-white border-purple-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-purple-600 mb-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">EMI Progress</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {cost.remainingEmis} / {cost.totalEmis}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Remaining payments
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {cost.paymentType === 'rented' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cost.monthlyRent && (
                    <Card className="bg-white border-yellow-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-yellow-600 mb-2">
                          <Repeat className="h-4 w-4" />
                          <span className="font-medium">Monthly Rent</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(Number(cost.monthlyRent))}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {cost.rentDuration} rental
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {cost.securityDeposit && (
                    <Card className="bg-white border-orange-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-orange-600 mb-2">
                          <CreditCard className="h-4 w-4" />
                          <span className="font-medium">Security Deposit</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(Number(cost.securityDeposit))}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-white border-gray-100 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Purchase Date</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {cost.purchaseDate ? format(new Date(cost.purchaseDate), 'MMMM d, yyyy') : 'Not specified'}
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
          <h2 className="text-3xl font-bold text-gray-900">Equipment Costs</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all equipment-related costs
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
            Add New Equipment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700">
              <Package className="h-4 w-4" />
              Total Equipment Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 flex items-center gap-2">
              <IndianRupee className="h-6 w-6" />
              {formatCurrency(costSummary?.equipmentCosts?.total || 0)}
            </div>
            <p className="text-sm text-blue-600 mt-2">
              {equipmentCosts.length} equipment items
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700">
              <CreditCard className="h-4 w-4" />
              Payment Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">One-time Purchases</span>
                <span className="font-medium text-gray-900">
                  {equipmentCosts.filter(cost => cost.paymentType === 'one-time').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">EMI Payments</span>
                <span className="font-medium text-gray-900">
                  {equipmentCosts.filter(cost => cost.paymentType === 'emi').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rented Equipment</span>
                <span className="font-medium text-gray-900">
                  {equipmentCosts.filter(cost => cost.paymentType === 'rented').length}
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
            {equipmentCosts.map((cost) => (
              <Card key={cost.id} className="border-gray-200 hover:shadow-md transition-all duration-200">
                <CardContent className="p-0">
                  {renderEquipmentCostDetails(cost)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddEquipmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default EquipmentCosts; 