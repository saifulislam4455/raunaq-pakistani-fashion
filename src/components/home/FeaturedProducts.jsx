
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { products } from "../../data/products";
import ProductCard from "../products/ProductCard";
import "./ProductSections.css";

export default function FeaturedProducts() {
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <section className="raunaq-featured-section" id="featured-products">
      <div className="raunaq-section-container">
        <motion.div
          className="raunaq-section-heading"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="raunaq-eyebrow">
            <Sparkles size={15} />
            <span>CURATED FOR YOU</span>
          </div>

          <h2>
            Discover Our <span>Signature</span> Pieces
          </h2>

          <p>
            Explore thoughtfully selected Pakistani outfits where heritage
            meets contemporary elegance.
          </p>
        </motion.div>

        <div className="raunaq-products-grid">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="raunaq-view-all-wrap">
          <a href="#collections" className="raunaq-view-all">
            Explore our collections
            <ArrowRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
