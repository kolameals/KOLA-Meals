import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../types/routes';

const Welcome: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              Welcome to KOLA Meals
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-200">
              Experience the perfect blend of taste, health, and convenience. 
              Delicious meals delivered right to your doorstep.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link
                to={ROUTES.MENU}
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition duration-300"
              >
                View Our Menu
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-white hover:text-blue-600 transition duration-300"
              >
                Subscribe Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose KOLA Meals?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              We're committed to providing the best dining experience
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mx-auto">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Fresh & Timely</h3>
              <p className="mt-2 text-gray-500">
                Meals prepared fresh daily and delivered at your preferred time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mx-auto">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Quality Assured</h3>
              <p className="mt-2 text-gray-500">
                High-quality ingredients and strict hygiene standards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mx-auto">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Easy Payment</h3>
              <p className="mt-2 text-gray-500">
                Secure and convenient payment options.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mx-auto">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">100% Satisfaction</h3>
              <p className="mt-2 text-gray-500">
                Money-back guarantee if you're not satisfied.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Menu Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Sample Menu
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              A glimpse of our delicious offerings
            </p>
          </div>

          <div className="mt-16">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Breakfast
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lunch
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dinner
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Monday</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Idli Sambar, Chutney</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Jeera Rice, Dal Fry, Sabzi</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Chapati, Paneer Butter Masala</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tuesday</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Poha, Sprouts</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Veg Biryani, Raita</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Roti, Chole Masala</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Wednesday</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Upma, Fruits</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Rice, Sambar, Rasam</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Paratha, Curd</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-8 text-center">
              <Link
                to={ROUTES.MENU}
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition duration-300"
              >
                View Full Menu
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Choose Your Plan
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Flexible subscription plans to suit your needs
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Standard Plan */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-gray-900">Standard Plan</h3>
                <p className="mt-4 text-gray-500">Perfect for individuals</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">₹4,000</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">2 meals per day</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">Home delivery</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">Standard menu options</span>
                  </li>
                </ul>
                <Link
                  to={ROUTES.LOGIN}
                  className="mt-8 block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-300"
                >
                  Subscribe Now
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-600 relative">
              <div className="absolute top-0 right-0 -mt-4 mr-4">
                <span className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Popular
                </span>
              </div>
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-gray-900">Premium Plan</h3>
                <p className="mt-4 text-gray-500">Best for families</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">₹6,000</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">3 meals per day</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">Priority home delivery</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">Full menu access</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">Custom meal preferences</span>
                  </li>
                </ul>
                <Link
                  to={ROUTES.LOGIN}
                  className="mt-8 block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-300"
                >
                  Subscribe Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Customers Say
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Sarah Johnson</h4>
                  <p className="text-gray-500">Premium Plan Member</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">
                "The quality of meals is outstanding, and the delivery is always on time. 
                It's made my life so much easier!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Michael Chen</h4>
                  <p className="text-gray-500">Standard Plan Member</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">
                "Great variety of meals and excellent customer service. 
                The subscription has been a game-changer for my busy schedule."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Emily Rodriguez</h4>
                  <p className="text-gray-500">Premium Plan Member</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">
                "Perfect solution for our family. The kids love the food, 
                and the service is impeccable. Highly recommended!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Ready to transform your dining experience?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of satisfied customers enjoying our delicious meals.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                to={ROUTES.LOGIN}
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition duration-300"
              >
                Subscribe Now
              </Link>
              <Link
                to={ROUTES.CONTACT}
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-white hover:text-blue-600 transition duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;


