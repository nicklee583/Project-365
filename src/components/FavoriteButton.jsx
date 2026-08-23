export default function FavoriteButton({ favorite, onToggle }) {
  return (
    <button
      type="button"
      className={`favoriteButton ${favorite ? "isFavorite" : ""}`}
      onClick={onToggle}
      aria-pressed={favorite}
      aria-label={favorite ? "Remove this day from favorites" : "Favorite this day"}
    >
      <span aria-hidden="true">{favorite ? "★" : "☆"}</span>
      <strong>{favorite ? "Favorited" : "Favorite day"}</strong>
    </button>
  );
}
