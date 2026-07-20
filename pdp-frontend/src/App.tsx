import React from 'react';
import { ProductPage } from './pages/ProductPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { useCart } from './hooks/useCart';
import type { WishlistItem } from './types/wishlist';
import type { Variant } from './data/product';

type Page = 'product' | 'marketplace' | 'wishlist' | 'cart';

export default function App() {
  const [page, setPage] = React.useState<Page>('product');
  const cart = useCart();

  // Adapter: WishlistItem → Variant shape for adding to cart from the wishlist page
  function handleWishlistAddToCart(item: WishlistItem) {
    const variant: Variant = {
      id: item.variantId,
      title: item.variantTitle,
      capsules: item.capsules,
      price: item.priceCents,
      priceDisplay: item.priceDisplay,
      perDayDisplay: '',
      tag: item.tag,
      available: item.available,
    };
    cart.addItem(variant, item.productHandle, item.productTitle);
    setPage('cart');
  }

  if (page === 'wishlist') {
    return (
      <WishlistPage
        onBack={() => setPage('product')}
        onGoToCart={() => setPage('cart')}
        onAddItemToCart={handleWishlistAddToCart}
      />
    );
  }

  if (page === 'cart') {
    return (
      <CartPage
        items={cart.items}
        count={cart.count}
        totalDisplay={cart.totalDisplay}
        totalCents={cart.totalCents}
        onBack={() => setPage('product')}
        onGoToWishlist={() => setPage('wishlist')}
        onRemoveItem={cart.removeItem}
        onUpdateQuantity={cart.updateQuantity}
        onClearCart={cart.clearCart}
      />
    );
  }

  if (page === 'marketplace') {
    return (
      <MarketplacePage
        cartCount={cart.count}
        onAddToCart={cart.addItem}
        onGoToCart={() => setPage('cart')}
        onGoToWishlist={() => setPage('wishlist')}
        onBack={() => setPage('product')}
      />
    );
  }

  return (
    <ProductPage
      cartCount={cart.count}
      onAddToCart={(variant) =>
        cart.addItem(variant, 'ashwagandha', 'Ashwagandha Capsules')
      }
      onGoToCart={() => setPage('cart')}
      onGoToWishlist={() => setPage('wishlist')}
      onGoToMarketplace={() => setPage('marketplace')}
    />
  );
}
