
import ProductCard from "./products/ProductCard.jsx";

export default function ProductSection({
  id,
  eyebrow,
  title,
  description,
  products = [],
}) {
  return (
    <section id={id} className="product-section section-pad">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <p>New collection coming soon.</p>
      )}
    </section>
  );
}
