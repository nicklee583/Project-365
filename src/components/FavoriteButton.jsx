import { StarIcon } from "./Icons";

export default function FavoriteButton({ favorite, onToggle }) {
  return (
    <button
      type="button"
      className={`favoriteButton ${favorite ? "isFavorite" : ""}`}
      onClick={onToggle}
      aria-pressed={favorite}
      aria-label={favorite ? "Remove this day from favorites" : "Favorite this day"}
    >
      <StarIcon className="favoriteStarIcon" filled={favorite} />
      <strong>{favorite ? "Favorited" : "Favorite day"}</strong>
    </button>
  );
}
