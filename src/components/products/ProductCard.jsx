
import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  ArrowUpRight,
  Sparkles,
  Check,
} from "lucide-react";

import { useCart } from "../../assets/context/CartContext";
import { useWishlist } from "../../assets/context/WishlistContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [added, setAdded] = useState(false);

  const wishlisted = isInWishlist(product.id);

  // 3D mouse movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [9, -9]),
    { stiffness: 180, damping: 18 }
  );

  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
    { stiffness: 180, damping: 18 }
  );

  const imageX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [10, -10]),
    { stiffness: 120, damping: 20 }
  );

  const imageY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [10, -10]),
    { stiffness: 120, damping: 20 }
  );

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);

    event.currentTarget.style.setProperty(
      "--pointer-x",
      `${(x + 0.5) * 100}%`
    );

    event.currentTarget.style.setProperty(
      "--pointer-y",
      `${(y + 0.5) * 100}%`
    );
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleAddToCart = () => {
    if (product.stock < 1 || added) return;

    addToCart(
      product,
      1,
      product.sizes?.[0] || "Free Size",
      product.colors?.[0] || "Default"
    );

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1600);
  };

  return (
    <motion.article
      className="raunaq-product-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="raunaq-product-card-inner">
        <div className="raunaq-product-image-wrap">
          <motion.img
            src={product.image}
            alt={product.name}
            className="raunaq-product-image"
            loading="lazy"
            style={{
              x: imageX,
              y: imageY,
            }}
          />

          <div className="raunaq-image-vignette" />

          <div className="raunaq-product-light" />

          <div className="raunaq-product-top-label">
            <Sparkles size={12} />
            <span>RAUNAQ EXCLUSIVE</span>
          </div>

          {product.oldPrice && (
            <motion.span
              className="raunaq-product-badge"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              SPECIAL PRICE
            </motion.span>
          )}

          <motion.button
            type="button"
            className={`raunaq-wishlist-btn ${
              wishlisted ? "active" : ""
            }`}
            onClick={() => toggleWishlist(product)}
            whileHover={{ scale: 1.15, rotate: -8 }}
            whileTap={{ scale: 0.8 }}
            aria-label="Toggle wishlist"
          >
            <Heart
              size={19}
              fill={wishlisted ? "currentColor" : "none"}
            />
          </motion.button>

          <motion.div
            className="raunaq-product-image-caption"
            initial={{ opacity: 0, y: 15 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            <span>CRAFTED WITH ELEGANCE</span>
          </motion.div>

          <motion.button
            type="button"
            className={`raunaq-quick-add ${added ? "is-added" : ""}`}
            onClick={handleAddToCart}
            disabled={product.stock < 1 || added}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
          >
            {product.stock < 1 ? (
              <>
                <ShoppingBag size={16} />
                Out of stock
              </>
            ) : added ? (
              <>
                <Check size={17} />
                Added to bag
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                Add to bag
                <ArrowUpRight size={15} />
              </>
            )}
          </motion.button>
        </div>

        <div className="raunaq-product-info">
          <div className="raunaq-product-meta">
            <span>{product.region}</span>
            <span>{product.category}</span>
          </div>

          <h3>{product.name}</h3>

          <p className="raunaq-product-description">
            {product.description}
          </p>

          <div className="raunaq-product-bottom">
            <div className="raunaq-product-prices">
              <strong>
                Rs. {product.price?.toLocaleString("en-PK")}
              </strong>

              {product.oldPrice && (
                <del>
                  Rs. {product.oldPrice.toLocaleString("en-PK")}
                </del>
              )}
            </div>

            <motion.span
              className="raunaq-product-arrow"
              whileHover={{
                rotate: 45,
                scale: 1.12,
                backgroundColor: "#421b28",
                color: "#ffffff",
              }}
            >
              <ArrowUpRight size={18} />
            </motion.span>
          </div>

          <div className="raunaq-card-bottom-line" />
        </div>
      </div>
    </motion.article>
  );
}
