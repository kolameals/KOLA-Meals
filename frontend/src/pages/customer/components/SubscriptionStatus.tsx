import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store';
import { createUserAddress, createUserSubscription, initializeUserPayment, clearSubscriptionState } from '../../../store/slices/subscriptionSlice';
import type { Address } from '../../../services/address.service';
import type { SubscriptionPlan } from '../../../services/subscription.service';

// API base URL
const API_BASE_URL = 'http://localhost:3000';

const SUPPORTED_APARTMENTS = [
  { id: 'sunrise', name: 'Sunrise Apartments' },
  { id: 'oakwood', name: 'Oakwood Residences' },
  { id: 'greenview', name: 'Greenview Heights' },
  { id: 'riverside', name: 'Riverside Gardens' },
];

const SubscriptionStatus: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading, error, paymentLink } = useSelector((state: RootState) => state.subscription);
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<string>('');
  const [address, setAddress] = useState<Address>({
    apartment: '',
    tower: '',
    floor: '',
    roomNumber: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: true
  });

  const plans: SubscriptionPlan[] = [
    {
      id: 'two-meals',
      name: 'Two Meals Plan',
      price: 4000,
      mealsPerDay: 2,
      description: 'Two meals per day, perfect for balanced nutrition',
    },
    {
      id: 'three-meals',
      name: 'Three Meals Plan',
      price: 6000,
      mealsPerDay: 3,
      description: 'Three meals per day, complete nutrition solution',
    },
  ];

  useEffect(() => {
    if (paymentLink) {
      window.location.href = paymentLink;
    }
  }, [paymentLink]);

  const handleSubscribe = async (planId: string) => {
    try {
      setSelectedPlan(planId);
      setShowAddressForm(true);
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!selectedApartment) {
        throw new Error('Please select an apartment');
      }

      // Create address
      const addressData = await dispatch(createUserAddress({
        ...address,
        apartment: selectedApartment
      })).unwrap();

      // Create subscription
      const subscriptionData = await dispatch(createUserSubscription({
        planId: selectedPlan!,
        addressId: addressData.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      })).unwrap();

      // Initialize payment
      await dispatch(initializeUserPayment({
        subscriptionId: subscriptionData.id,
        amount: plans.find(p => p.id === selectedPlan)?.price || 0,
        currency: 'INR'
      })).unwrap();

      // Reset form
      setShowAddressForm(false);
      setSelectedPlan(null);
      setSelectedApartment('');
      setAddress({
        apartment: '',
        tower: '',
        floor: '',
        roomNumber: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: true
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!showAddressForm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg p-6 ${
                selectedPlan === plan.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'
              }`}
            >
              <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">₹{plan.price}</p>
              <p className="mt-1 text-sm text-gray-500">per month</p>
              <p className="mt-4 text-gray-600">{plan.description}</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {plan.mealsPerDay} meals per day
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free delivery
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Skip up to 5 meals per month
                </li>
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleAddressSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Delivery Address</h3>
            <p className="mt-1 text-sm text-gray-500">Please provide your delivery address</p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
                Select Apartment
              </label>
              <select
                id="apartment"
                value={selectedApartment}
                onChange={(e) => setSelectedApartment(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select an apartment</option>
                {SUPPORTED_APARTMENTS.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedApartment && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="tower" className="block text-sm font-medium text-gray-700">
                      Tower
                    </label>
                    <input
                      type="text"
                      id="tower"
                      value={address.tower}
                      onChange={(e) => setAddress({ ...address, tower: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                      Floor
                    </label>
                    <input
                      type="text"
                      id="floor"
                      value={address.floor}
                      onChange={(e) => setAddress({ ...address, floor: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
                      Room Number
                    </label>
                    <input
                      type="text"
                      id="roomNumber"
                      value={address.roomNumber}
                      onChange={(e) => setAddress({ ...address, roomNumber: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setShowAddressForm(false);
                setSelectedPlan(null);
                setSelectedApartment('');
                dispatch(clearSubscriptionState());
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SubscriptionStatus; 