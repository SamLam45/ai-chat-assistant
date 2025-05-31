import React from 'react';

interface CarouselArrowsProps {
  className?: string;
  onClick?: () => void;
}

export const PrevArrow: React.FC<CarouselArrowsProps> = ({ className, onClick }) => {
  return (
    <button
      className={`carousel-control-prev ${className}`}
      type="button"
      onClick={onClick}
      style={{
        position: 'absolute',
        left: '-50px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        background: 'none',
        border: 'none',
        fontSize: '2rem',
        color: '#f28b00',
        cursor: 'pointer',
      }}
    >
      <span aria-hidden="true">&lt;</span>
      <span className="visually-hidden">Previous</span>
    </button>
  );
};

export const NextArrow: React.FC<CarouselArrowsProps> = ({ className, onClick }) => {
  return (
    <button
      className={`carousel-control-next ${className}`}
      type="button"
      onClick={onClick}
      style={{
        position: 'absolute',
        right: '-50px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        background: 'none',
        border: 'none',
        fontSize: '2rem',
        color: '#f28b00',
        cursor: 'pointer',
      }}
    >
      <span aria-hidden="true">&gt;</span>
      <span className="visually-hidden">Next</span>
    </button>
  );
}; 