import React from "react";
import styles from "./starRating.module.css";

export default function StarRating({ stars, size = 18 }) {
  return (
    <div className={styles.rating}>
      {[1, 2, 3, 4, 5].map((number) => (
        <Star key={number} number={number} stars={stars} size={size} />
      ))}
    </div>
  );
}

function Star({ number, stars, size }) {
  const halfNumber = number - 0.5;
  let starSrc = "/star-empty.svg";

  if (stars >= number) {
    starSrc = "/star-full.svg";
  } else if (stars >= halfNumber) {
    starSrc = "/star-half.svg";
  }

  return (
    <img
      src={starSrc}
      className={styles.star}
      style={{ width: size, height: size }}
      alt={`Star ${number}`}
    />
  );
}
