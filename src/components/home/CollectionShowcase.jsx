
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { collections } from "../../data/products";
import "./ProductSections.css";

export default function CollectionShowcase() {
  return (
    <section className="raunaq-collections-section" id="collections">
      <div className="raunaq-section-container">
        <motion.div
          className="raunaq-section-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="raunaq-eyebrow">THE RAUNAQ EDIT</div>

          <h2>
            Fashion With <span>Heritage</span>
          </h2>

          <p>
            From the streets of Peshawar to the traditions of Pakistan,
            discover fashion that celebrates our identity.
          </p>
        </motion.div>

        <div className="raunaq-collections-grid">
          {collections.map((collection, index) => (
            <motion.a
              href="#featured-products"
              className={`raunaq-collection-card collection-card-${index + 1}`}
              key={collection.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <img
                src={collection.image}
                alt={collection.title}
                loading="lazy"
              />

              <div className="raunaq-collection-overlay">
                <div>
                  <span>{collection.category}</span>
                  <h3>{collection.title}</h3>
                  <p>{collection.subtitle}</p>
                </div>

                <span className="raunaq-collection-arrow">
                  <ArrowUpRight size={21} />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
