import React, { useState, useEffect } from 'react';
import { PRODUCTS } from './data/products';
import { Product } from './types/product';
import { User } from './types/user';
import { authService } from './utils/auth';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { ProductSection } from './components/ProductSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { StreamSimulator } from './components/StreamSimulator';
import { CuratedCollections } from './components/CuratedCollections';
import { StreamerWorkflow } from './components/StreamerWorkflow';
import { BrandPhilosophy } from './components/BrandPhilosophy';
import { NewsletterSection } from './components/NewsletterSection';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { GuidesModal } from './components/GuidesModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminModal } from './components/AdminModal';
import { AiChatWidget } from './components/AiChatWidget';
import { sounds } from './utils/audio';
import { X } from 'lucide-react';

export function App() {
  // Dynamic products database with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('forest_products_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error loading products from storage:', err);
    }
    return PRODUCTS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [simulatorProduct, setSimulatorProduct] = useState<Product | null>(null);
  
  // User Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Shopping cart state with localStorage persistence
  const [cart, setCart] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('forest_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    try {
      localStorage.setItem('forest_cart_items', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('forest_products_db', JSON.stringify(products));
    } catch (err) {
      console.error('Failed to save products to storage:', err);
    }
  }, [products]);

  // Product operations for Admin
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
    if (simulatorProduct?.id === productId) {
      setSimulatorProduct(null);
    }
    setCart((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleResetDefaultProducts = () => {
    setProducts(PRODUCTS);
    try {
      localStorage.removeItem('forest_products_db');
    } catch {}
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    sounds.playChime();
    setCart((prev) => {
      // Avoid duplicate item in cart
      if (prev.some(item => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Auth operations
  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminModalOpen(false);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  // Navigation action handlers
  const handleExploreClick = () => {
    const el = document.getElementById('explore-collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActiveNav('overlay');
  };

  const handleFeaturedClick = () => {
    const el = document.getElementById('featured-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenLiveSimulator = () => {
    // Default to the flagship overlay: Deep Woods
    const flagship = products.find(p => p.id === 'deep-woods') || products[0];
    setSimulatorProduct(flagship);
  };

  return (
    <div className="min-h-screen bg-ivory text-forest-900 flex flex-col font-sans selection:bg-forest-600 selection:text-ivory">
      
      {/* 1. Header & Navigation */}
      <Header
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenGuides={() => setIsGuidesOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleExploreClick();
        }}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        
        {/* 2. Hero Section */}
        <Hero
          onExploreClick={handleExploreClick}
          onFeaturedClick={handleFeaturedClick}
          onOpenLiveSimulator={handleOpenLiveSimulator}
        />

        {/* 3. Three Featured Overlays Horizontal Carousel */}
        <FeaturedCarousel
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onPreviewSimulator={(p) => setSimulatorProduct(p)}
          onAddToCart={handleAddToCart}
        />

        {/* 4. All Products Showcase with Dynamic Filters & Sorting */}
        <ProductSection
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onPreviewSimulator={(p) => setSimulatorProduct(p)}
          onAddToCart={handleAddToCart}
          isAdmin={isAdmin}
          onDeleteProduct={handleDeleteProduct}
        />

        {/* 5. Curated Collections by Style */}
        <CuratedCollections
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            handleExploreClick();
          }}
        />

        {/* 6. Streamer 3-Step Workflow */}
        <StreamerWorkflow />

        {/* 7. Brand Philosophy & Craftsmanship */}
        <BrandPhilosophy />

        {/* 8. Newsletter & VIP Streamer Club */}
        <NewsletterSection />

      </main>

      {/* MODAL 1: Product Detail View */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          allProducts={products}
          onSelectRelated={(p) => setSelectedProduct(p)}
          isAdmin={isAdmin}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {/* MODAL 2: Full Screen OBS Stream Simulator Playground */}
      {simulatorProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-fade-in">
          <div className="relative w-full max-w-5xl">
            {/* Close Button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setSimulatorProduct(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-forest-900 border border-forest-700 text-ivory text-xs font-semibold hover:bg-forest-800 transition-colors flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Đóng Simulator</span>
              </button>
            </div>
            {/* Live Interactive Stream Simulator */}
            <StreamSimulator product={simulatorProduct} isEmbedded={false} />
          </div>
        </div>
      )}

      {/* MODAL 3: Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* MODAL 4: Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* MODAL 5: Guides Modal */}
      <GuidesModal
        isOpen={isGuidesOpen}
        onClose={() => setIsGuidesOpen(false)}
      />

      {/* MODAL 6: Authentication Modal (Sign In / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authInitialMode}
      />

      {/* MODAL 7: User Profile Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={currentUser}
          onLogout={handleLogout}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenGuides={() => setIsGuidesOpen(true)}
          onUserUpdated={handleUserUpdated}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />
      )}

      {/* MODAL 8: Admin Management Panel (Available exclusively to admin honggiahuy933@gmail.com) */}
      {isAdmin && (
        <AdminModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          products={products}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onResetDefaultProducts={handleResetDefaultProducts}
        />
      )}

      {/* FLOATING WIDGET: AI Chat Assistant & Custom Overlay Zalo 0876065085 */}
      <AiChatWidget />

    </div>
  );
}

export default App;
