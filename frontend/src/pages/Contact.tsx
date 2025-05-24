import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> support@kolameals.com
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span> +1 (555) 123-4567
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Address:</span><br />
                123 Food Street<br />
                Cuisine City, FC 12345
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Hours</h2>
            <div className="space-y-2">
              <p className="text-gray-600">Monday - Friday: 9:00 AM - 10:00 PM</p>
              <p className="text-gray-600">Saturday: 10:00 AM - 9:00 PM</p>
              <p className="text-gray-600">Sunday: 11:00 AM - 8:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 