
import Home from "./pages/Home.jsx";
import "./App.css";

import { CartProvider } from "./assets/context/CartContext.jsx";
import { WishlistProvider } from "./assets/context/WishlistContext.jsx";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Home />
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
