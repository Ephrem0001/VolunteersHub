// SuccessStories.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SuccessStories = () => {
  // Success stories data - 11 stories
  const successStories = [
    {
      title: "Community Cleanup Initiative",
      description: "Over 50 volunteers mobilized to clean up city parks, collecting 2 tons of waste and revitalizing public spaces.",
      impact: "15 parks renovated",
      image: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46"
    },
    {
      title: "Literacy Program",
      description: "Volunteers provided reading support to 120 children in underprivileged schools, improving literacy rates significantly.",
      impact: "85% improved reading scores",
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350"
    },
    {
      title: "Disaster Relief",
      description: "Our rapid response team delivered essential supplies to 300 families affected by devastating floods in the region.",
      impact: "1,000 meals distributed",
      image: "https://images.unsplash.com/photo-1501426026826-31c667bdf23d"
    },
    {
      title: "Senior Companion Program",
      description: "Weekly visits to elderly community members reduced isolation and improved quality of life for 75 seniors.",
      impact: "200+ visits monthly",
      image: "https://images.unsplash.com/photo-1516589091380-5d60177e95f1"
    },
    {
      title: "Food Bank Expansion",
      description: "Expanded our food bank operations to serve an additional 500 families facing food insecurity each month.",
      impact: "5,000 meals monthly",
      image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f"
    },
    {
      title: "Youth Mentorship",
      description: "Established a mentorship program pairing 60 at-risk youth with positive adult role models in the community.",
      impact: "92% school retention",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7"
    },
    {
      title: "Medical Outreach",
      description: "Provided free health screenings and basic medical care to 450 uninsured community members.",
      impact: "120 follow-up treatments",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef"
    },
    {
      title: "Habitat Restoration",
      description: "Volunteers planted over 1,200 native trees and plants to restore 5 acres of critical wildlife habitat.",
      impact: "8 species protected",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
    },
    {
      title: "Tech for Seniors",
      description: "Taught 90 senior citizens how to use technology to connect with family and access essential services.",
      impact: "75% regular users",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
    },
    {
      title: "Back to School Drive",
      description: "Collected and distributed school supplies to 800 children from low-income families before the school year.",
      impact: "300 backpacks donated",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
    },
    {
      title: "Community Garden",
      description: "Established a community garden providing fresh produce to 120 families and gardening education.",
      impact: "1,500 lbs harvested",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
            Our <span className="text-orange-500">Success</span> Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our community has made a real difference through these impactful initiatives.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {successStories.map((story, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group"
            >
              <div className="relative overflow-hidden h-60">
                <img 
                  src={story.image} 
                  alt={story.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Story #{index + 1}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{story.title}</h2>
                <p className="text-gray-600 mb-5">{story.description}</p>
                
                <div className="flex items-center">
                  <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg text-sm font-semibold">
                    <span className="font-bold">Impact:</span> {story.impact}
                  </div>
                  <div className="ml-auto">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center mt-20 animate-bounce-in">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-3 bg-gray-900 hover:bg-orange-600 text-white px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;