import React from 'react';

interface AboutProps {
  appName: string;
  description: string;
  contactEmail: string;
}

const About: React.FC<AboutProps> = ({ appName, description, contactEmail }) => {
  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-50 border border-gray-200 rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{appName}</h1>
      <p className="text-lg text-gray-700 mb-6">{description}</p>
      <p className="text-base text-gray-600">
        <strong>Contact:</strong> {contactEmail}
      </p>
    </div>
  );
};

export default About;
