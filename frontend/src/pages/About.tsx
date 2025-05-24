import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About KOLA Meals</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Story</h2>
        <p className="text-gray-600 mb-4">
          KOLA Meals is dedicated to providing delicious, nutritious meals delivered right to your doorstep.
          We believe in using fresh, high-quality ingredients to create memorable dining experiences.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-600">
          To make healthy, tasty food accessible to everyone while supporting local communities
          and maintaining sustainable practices.
        </p>
      </div>
    </div>
  );
};

export default About; 