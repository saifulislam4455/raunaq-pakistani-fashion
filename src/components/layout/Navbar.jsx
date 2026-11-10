
import { useState } from "react";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { label: "HOME", href: "#home" },
  {
    label: "WOMEN",
    href: "#collections",
    submenu: ["Luxury Pret", "Formal Wear", "Bridal Collection", "Daily Wear"],
  },
  {
    label: "MEN",
    href: "#collections",
    submenu: ["Kurta Collection", "Peshawari Collection", "Formal Wear"],
  },
  { label: "PAKHTOON", href: "#collections" },
  { label: "OUR STORY", href: "#story" },
];

const actions = [
  { icon: Search, label: "Search" },
  { icon: Heart, label: "Wishlist" },
  { icon: ShoppingBag, label: "Shopping bag" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <header className="sticky top-0 z-[100] w-full bg-[#f8f2e8]/95 backdrop-blur-2xl">
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#b58c56] to-transparent" />

      <div className="mx-auto flex min-h-[84px] w-[94%] max-w-[1600px] items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center text-[#51232f] lg:hidden"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <motion.a
          href="#home"
          whileHover={{ scale: 1.045 }}
          className="group flex shrink-0 items-center gap-3"
        >
          <motion.div
            whileHover={{ rotateY: 180, rotateX: 10 }}
            transition={{ duration: 0.65 }}
            className="relative flex h-[55px] w-[55px] items-center justify-center border border-[#d6b77f] bg-gradient-to-br from-[#82505a] via-[#421b28] to-[#1d1015] shadow-[0_7px_18px_rgba(49,20,28,0.2)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span className="font-serif text-[38px] italic text-[#e9d0a0]">
              R
            </span>
            <span className="absolute inset-[5px] border border-[#d6b77f]/40" />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#e4c78d]" />
          </motion.div>

          <div className="flex flex-col">
            <span className="font-serif text-[24px] font-semibold tracking-[5px] text-[#421b28] sm:text-[27px]">
              RAUNAQ
            </span>
            <span className="mt-1 text-[8px] font-bold tracking-[2px] text-[#98764c]">
              PAKISTANI FASHION HOUSE
            </span>
          </div>
        </motion.a>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-9">
          {navigation.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setActiveMenu(item.label)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <a
                href={item.href}
                className="group relative flex items-center gap-1 py-7 text-[10px] font-bold tracking-[1.6px] text-[#533b35] transition-colors hover:text-[#a47748]"
              >
                {item.label}
                {item.submenu && (
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-300 ${
                      activeMenu === item.label ? "rotate-180" : ""
                    }`}
                  />
                )}
                <span className="absolute bottom-4 left-0 h-px w-0 bg-[#b58c56] transition-all duration-500 group-hover:w-full" />
              </a>

              <AnimatePresence>
                {item.submenu && activeMenu === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.22 }}
                    className="absolute left-0 top-full z-[110] w-64 border border-[#d9c5a5] bg-[#fbf7ef] p-3 shadow-[0_22px_55px_rgba(49,20,28,0.18)]"
                  >
                    <p className="px-4 pb-3 pt-2 text-[9px] tracking-[3px] text-[#ad8a5a]">
                      EXPLORE COLLECTION
                    </p>
                    {item.submenu.map((subItem, index) => (
                      <motion.a
                        key={subItem}
                        href="#collections"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setActiveMenu(null)}
                        className="flex items-center justify-between border-b border-[#e9dece] px-4 py-3 text-[10px] tracking-[1px] text-[#5d443a] last:border-0 hover:bg-[#f1e8d9] hover:text-[#8b543d]"
                      >
                        {subItem}
                        <ArrowUpRight size={13} />
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          {actions.map(({ icon: Icon, label }) => (
            <motion.a
              key={label}
              href="#collections"
              whileHover={{ y: -3, scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c9aa77]/40 text-[#51232f] transition-colors hover:bg-[#51232f] hover:text-[#f5dfb7]"
            >
              <Icon size={16} strokeWidth={1.6} />
            </motion.a>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[#d9c5a5] bg-[#f8f2e8] lg:hidden"
          >
            <div className="mx-auto w-[90%] py-3">
              {navigation.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-[#e7dac7] py-4 text-[11px] font-bold tracking-[2px] text-[#51232f]"
                >
                  {item.label}
                  <ArrowUpRight size={15} className="text-[#b58c56]" />
                </motion.a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="h-px bg-gradient-to-r from-transparent via-[#c9aa77]/60 to-transparent" />
    </header>
  );
}
