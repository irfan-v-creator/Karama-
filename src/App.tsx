import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Watch, Gem, Sparkles, Clock, MapPin, Phone, Mail, Calendar,
  ChevronRight, Menu, X, Award, ShieldCheck, BadgePercent,
  CheckCircle2, Bookmark, Users, Database, RefreshCw,
  FileSpreadsheet, Loader2, Settings, ShoppingCart, ArrowLeft,
  Trash2, Plus, Minus, ShoppingBag
} from "lucide-react";

// Google Sheet CSV Link Connected!
const SHEET_URL = "https://docs.google.com/spreadsheets/d/11UI14UUB0riJo5jiiWj0UgNPu5-6xYIPsNFe2Sacf0g/export?format=csv";

interface Product {
  id: string;
  name: string;
  price: string;
  stock: string;
  image: string;
  category: string;
  specs: string;
  desc: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<"home" | "detail" | "cart">("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    // Parse CSV to JSON Logic
    fetch(SHEET_URL)
      .then(res => res.text())
      .then(text => {
        const lines = text.split("\n");
        const headers = lines[0].split(",").map(h => h.trim());
        
        const data: Product[] = lines.slice(1).map(line => {
          const values = line.split(",").map(v => v.trim());
          if (values.length < headers.length) return null;
          
          return {
            id: values[headers.indexOf("watch_id")] || "",
            name: values[headers.indexOf("watch_name")] || "",
            price: values[headers.indexOf("watch_price")] || "",
            stock: values[headers.indexOf("watch_stock_fomo")] || "In Stock",
            image: values[headers.indexOf("watch_image_url")] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            category: values[headers.indexOf("category")] || "watches",
            specs: values[headers.indexOf("specs")] || "",
            desc: values[headers.indexOf("desc")] || ""
          };
        }).filter(item => item !== null && item.id !== "") as Product[];

        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching sheet:", err);
        setLoading(false);
      });
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleWhatsAppCheckout = () => {
    let message = "🛍️ *New Order from Karama Fancy* 🛍️\n\n";
    cart.forEach(item => {
      message += `▪️ *${item.product.name}* x ${item.quantity} - ${item.product.price}\n`;
    });
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919000000000?text=${encodedMessage}`, "_blank"); // Replace with your WhatsApp number
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={48} />
        <p className="text-amber-500 font-serif tracking-widest">LOADING KARAMA LUXURY...</p>
      </div>
    );
  }

  const filteredProducts = categoryFilter === "all" ? products : products.filter(p => p.category === categoryFilter);

  return (
    <div className="min-h-screen bg-black text-stone-100 font-sans selection:bg-amber-500/30">
      {/* Navbar */}
      <nav className="border-b border-stone-800 bg-stone-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-serif tracking-wider text-amber-500 cursor-pointer" onClick={() => setCurrentView("home")}>KARAMA FANCY</h1>
        <div className="flex gap-6 items-center">
          <button onClick={() => setCurrentView("home")} className="text-sm tracking-widest uppercase hover:text-amber-400 transition">Collection</button>
          <button onClick={() => setCurrentView("cart")} className="relative p-2 text-stone-300 hover:text-amber-500 transition">
            <ShoppingCart size={24} />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
          </button>
        </div>
      </nav>

      {/* Dynamic Views */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {currentView === "home" && (
          <div>
            {/* Category Filter */}
            <div className="flex gap-4 justify-center mb-12">
              {["all", "watches", "jewelry"].map(cat => (
                <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-6 py-2 uppercase text-xs tracking-widest border transition ${categoryFilter === cat ? "bg-amber-500 text-black border-amber-500" : "border-stone-800 hover:border-amber-500"}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="border border-stone-900 bg-stone-950 p-4 rounded-lg group cursor-pointer flex flex-col justify-between" onClick={() => { setSelectedProduct(product); setCurrentView("detail"); }}>
                  <div className="overflow-hidden rounded mb-4 aspect-square bg-stone-900">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div>
                    <span className="text-xs tracking-widest text-amber-500 uppercase font-mono">{product.stock}</span>
                    <h3 className="font-serif text-xl mt-1 group-hover:text-amber-400 transition">{product.name}</h3>
                    <p className="text-stone-400 mt-2 font-mono">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === "detail" && selectedProduct && (
          <div>
            <button onClick={() => setCurrentView("home")} className="flex items-center gap-2 text-stone-400 hover:text-white mb-8 font-mono text-sm uppercase tracking-wider"><ArrowLeft size={16} /> Back</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="aspect-square rounded-xl overflow-hidden bg-stone-950 border border-stone-900">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-mono text-amber-500 tracking-widest uppercase">{selectedProduct.stock}</span>
                <h2 className="text-4xl font-serif mt-2 mb-4 tracking-wide">{selectedProduct.name}</h2>
                <p className="text-2xl font-mono text-stone-200 mb-6">{selectedProduct.price}</p>
                <div className="border-t border-b border-stone-900 py-6 my-6">
                  <h4 className="text-xs font-mono tracking-widest uppercase text-stone-400 mb-2">Specifications</h4>
                  <p className="text-sm text-stone-300 font-mono">{selectedProduct.specs}</p>
                </div>
                <p className="text-stone-400 leading-relaxed font-sans mb-8">{selectedProduct.desc}</p>
                <button onClick={() => { addToCart(selectedProduct); setCurrentView("cart"); }} className="w-full bg-amber-500 hover:bg-amber-400 text-black py-4 font-serif text-lg tracking-widest uppercase transition rounded">Add to Bag</button>
              </div>
            </div>
          </div>
        )}

        {currentView === "cart" && (
          <div>
            <h2 className="text-3xl font-serif tracking-wide mb-8">SHOPPING BAG</h2>
            {cart.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-stone-900 rounded-xl">
                <ShoppingBag className="mx-auto text-stone-600 mb-4" size={48} />
                <p className="text-stone-400 font-mono">Your bag is completely empty.</p>
                <button onClick={() => setCurrentView("home")} className="mt-6 border border-amber-500/50 text-amber-500 px-6 py-2 uppercase text-xs tracking-widest hover:bg-amber-500 hover:text-black transition">Continue Exploring</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="border border-stone-900 bg-stone-950 p-4 rounded-xl flex gap-4 items-center justify-between">
                      <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded bg-stone-900" />
                      <div className="flex-1">
                        <h4 className="font-serif text-lg">{item.product.name}</h4>
                        <p className="text-stone-400 text-sm font-mono">{item.product.price} (x{item.quantity})</p>
                      </div>
                      <button onClick={() => setCart(prev => prev.filter(i => i.product.id !== item.product.id))} className="text-stone-600 hover:text-red-400 transition p-2"><Trash2 size={20} /></button>
                    </div>
                  ))}
                </div>
                <div className="border border-stone-900 bg-stone-950 p-6 rounded-xl h-fit">
                  <h3 className="font-serif text-xl mb-4 tracking-wide">ORDER SUMMARY</h3>
                  <div className="border-t border-stone-900 pt-4 mt-4">
                    <button onClick={handleWhatsAppCheckout} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-serif tracking-wider uppercase py-4 rounded flex items-center justify-center gap-2 transition"><Phone size={18} /> Checkout on WhatsApp</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
