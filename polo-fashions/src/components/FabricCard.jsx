import React from 'react';
import { Card } from 'react-bootstrap';
import { Check } from 'lucide-react';

export default function FabricCard({ fabric, isSelected, onClick }) {
  return (
    <Card 
      className={`fabric-card h-100 ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(fabric)}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      {isSelected && (
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
            background: '#667eea',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Check size={20} color="white" />
        </div>
      )}
      
      <Card.Img 
        variant="top" 
        src={fabric.image} 
        alt={fabric.name}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{fabric.name}</Card.Title>
        <div className="mb-2">
          <small className="text-muted">Type: </small>
          <strong>{fabric.type}</strong>
        </div>
        <div className="mb-2">
          <small className="text-muted">Color: </small>
          <strong>{fabric.color}</strong>
        </div>
        <h5 className="text-primary mb-0">₹{fabric.price}</h5>
      </Card.Body>
    </Card>
  );
}