export default function StarRating({ value, onChange, readOnly }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating">
      {stars.map((star) => (
        <span
          key={star}
          className={star <= value ? 'star filled' : 'star'}
          onClick={() => !readOnly && onChange(star)}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          ★
        </span>
      ))}
    </div>
  );
}