import React from 'react';

const EventCard = ({ event, onLike }) => {
  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold">{event.title}</h2>
      <p>{event.description}</p>
      <button onClick={() => onLike(event._id)}>Like ({event.likes.length})</button>
    </div>
  );
};

export default EventCard;
