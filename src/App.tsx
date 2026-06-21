import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Watch,
  Gem,
  Sparkles,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  Menu,
  X,
  Award,
  ShieldCheck,
  BadgePercent,
  CheckCircle2,
  Bookmark,
  Users,
  Database,
  RefreshCw,
  FileSpreadsheet,
  Loader2,
  Settings,
  ShoppingCart,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag
} from "lucide-react";

// Curated data for Karama Fancy - synced with active sheet definitions
const PRODUCT_CATALOG = [
  { 
    id: "w1", 
    name: "The Aurelia Tourbillon", 
    category: "watches", 
    price: "$48,500", 
    specs: "40mm Rose Gold • Manual KF-99", 
    desc: "Intricate tourbillon craftsmanship, hand-finished by master chronometry experts.",
    image: "/src/assets/images/luxury_watch_1782046828491.jpg",
    sheetCell: "Row B12",
    stock: "Only 2 Left"
  },
  { 
    id: "w2", 
    name: "Classic Monarque", 
    category: "watches", 
    price: "$29,000", 
    specs: "38mm Steel • Automatic KF-70", 
    desc: "Flawless chronometer with authentic emerald indexes around the polished dial.",
    image: "/src/assets/images/luxury_hero_1782046811786.jpg",
    sheetCell: "Row B13",
    stock: "In Stock"
  },
  { 
    id: "w3", 
    name: "Grand Sovereign Skeleton", 
    category: "watches", 
    price: "$92,000", 
    specs: "42mm Platinum • Baguette Bezel", 
    desc: "Exposing the complete skeletal gears with flawless mirror alignments.",
    image: "/src/assets/images/luxury_watch_1782046828491.jpg",
    sheetCell: "Row B14",
    stock: "1 Reserve"
  },
  { 
    id: "j1", 
    name: "Royal Seraphina Necklace", 
    category: "jewelry", 
    price: "$145,000", 
    specs: "18K White Gold • 4.5ct Sapphire", 
    desc: "Enchanting halo design holding a magnificent pear-cut royal sapphire.",
    image: "/src/assets/images/luxury_jewelry_1782046844877.jpg",
    sheetCell: "Row C12",
    stock: "Limited Run"
  },
  { 
    id: "j2", 
    name: "Solitaire Luminaire Ring", 
    category: "jewelry", 
    price: "$75,000", 
    specs: "Platinum Band • 2.8ct VVS1 Gem", 
    desc: "Polished platinum setting showcasing a flawless brilliant square-cut diamond.",
    image: "/src/assets/images/luxury_jewelry_1782046844877.jpg",
    sheetCell: "Row C13",
    stock: "In Stock"
  },
  { 
    id: "j3", 
    name: "Eternal Marquise Bracelet", 
    category: "jewelry", 
    price: "$62,000", 
    specs: "18K Gold • 18 Marquis Gems", 
    desc: "Unbroken flow of pure marquis diamonds wrapping elegance around the wrist.",
    image: "/src/assets/images/luxury_jewelry_1782046844877.jpg",
    sheetCell: "Row C14",
    stock: "Only 1 Left"
  },
  { 
    id: "w4", 
    name: "Aeterna Celestial Chrono", 
    category: "watches", 
    price: "$118,000", 
    specs: "44mm Carbon • Midnight Bezel", 
    desc: "Ultralight aerospace carbon casing featuring custom moonphase star map guides.",
    image: "/src/assets/images/luxury_watch_1782046828491.jpg",
    sheetCell: "Row B15",
    stock: "Waitlist Only"
  },
  { 
    id: "j4", 
    name: "Princess Aurora Emerald Hoop", 
    category: "jewelry", 
    price: "$54,000", 
    specs: "18K Yellow Gold • Oval Emeralds", 
    desc: "Extravagant interlocking loop segments studded with rare Colombian teardrop emeralds.",
    image: "/src/assets/images/luxury_jewelry_1782046844877.jpg",
    sheetCell: "Row C15",
    stock: "2 Left"
  },
  { 
    id: "w5", 
    name: "Sublime Imperial Diver", 
    category: "watches", 
    price: "$36,500", 
    specs: "41mm Rose Gold • Calibre 105", 
    desc: "Engineered with pressure resistance up to 300 meters, encased in masterfully brushed gold alloys.",
    image: "/src/assets/images/luxury_hero_1782046811786.jpg",
    sheetCell: "Row B16",
    stock: "Available"
  }
];

const CUSTOMIZER = {
  metals: [
    { id: "yg", name: "18K Yellow Gold", modifier: 0, code: "#E6C65B", desc: "Warm yellow aura" },
    { id: "wg", name: "18K White Gold", modifier: 2500, code: "#E2EAF4", desc: "Contemporary white reflectivity" },
    { id: "pt", name: "Platinum 950", modifier: 6000, code: "#C8D3DC", desc: "Noble everlasting density" }
  ],
  gems: [
    { id: "rd", name: "Brilliant Round Diamond", price: 42000, size: "3.0ct", desc: "Optimal fire with 58 facets" },
    { id: "em", name: "Royal Emerald-cut", price: 38000, size: "3.2ct", desc: "Mirrored clarity optics" },
    { id: "sp", name: "Deep Imperial Sapphire", price: 49000, size: "4.1ct", desc: "Vibrant custom ocean aura" }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"all" | "watches" | "jewelry">("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // URL Hash-based Routing State
  const [currentHash, setCurrentHash] = useState(window.location.hash || "#home");
  
  // High-fidelity Persistent Cart State
  const [cart, setCart] = useState<{ id: string; name: string; price: string; specs: string; image: string; quantity: number; category: string; sheetCell: string }[]>(() => {
    try {
      const saved = localStorage.getItem("kf_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Added state feedback notification
  const [cartToast, setCartToast] = useState("");

  const addToCart = (product: any, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        specs: product.specs, 
        image: product.image, 
        quantity: qty, 
        category: product.category,
        sheetCell: product.sheetCell || "Row N/A"
      }];
    });
    setCartToast(`"${product.name}" successfully added to reservation cart.`);
    setTimeout(() => setCartToast(""), 3500);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  useEffect(() => {
    try {
      localStorage.setItem("kf_cart", JSON.stringify(cart));
    } catch (e) {
      console.warn("Storage write error: ", e);
    }
  }, [cart]);

  // Handle hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || "#home");
      setProductDetailQty(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Product detail quantity state (unconditional hook)
  const [productDetailQty, setProductDetailQty] = useState(1);

  // Customizer state
  const [metal, setMetal] = useState(CUSTOMIZER.metals[0]);
  const [gem, setGem] = useState(CUSTOMIZER.gems[0]);

  // Booking Form State
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [viewingCategory, setViewingCategory] = useState("watches");
  const [viewingDate, setViewingDate] = useState("2026-06-25");
  const [viewingTime, setViewingTime] = useState("14:00");
  const [notes, setNotes] = useState("");
  const [ticketCode, setTicketCode] = useState("");

  // Product list infinite scroll & sheets live state management
  const [productsList, setProductsList] = useState(PRODUCT_CATALOG);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("13:04:59");
  const [sheetsFeedback, setSheetsFeedback] = useState("");
  const [sheetsUrl, setSheetsUrl] = useState("https://docs.google.com/spreadsheets/d/e/2PACX-1vT1J_35oZpU8YtW9b-pA1uGqC-mBf8oQYfW_cEis7uDeiS8GzHBy7N7oEnrL6z6b6f7X69bS_gY_p3r/pub?output=csv");
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/);
    if (lines.length < 2) return [];
    
    // Normalize headers
    const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, "").toLowerCase());
    
    const rows: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const cells: string[] = [];
      let insideQuote = false;
      let current = "";
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"' || char === "'") {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          cells.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      cells.push(current.trim());
      
      const row: Record<string, string> = {};
      headers.forEach((hdr, idx) => {
        row[hdr] = (cells[idx] || "").replace(/^["']|["']$/g, "");
      });
      rows.push(row);
    }
    return rows;
  };

  const mapGoogleSheetData = (rows: Record<string, string>[]) => {
    return rows.map((row, idx) => {
      // Map sheet variables: watch_id, watch_name, watch_price, watch_stock_fomo, watch_image_url
      const id = row.watch_id || row.id || `sheet-w-${idx}`;
      const name = row.watch_name || row.name || row.title || `Bespoke Chrono Series ${idx + 1}`;
      const price = row.watch_price || row.price || `$${(35000 + idx * 7500).toLocaleString()}`;
      const stock = row.watch_stock_fomo || row.stock_fomo || row.stock || row.fomo || "In Stock";
      const image = row.watch_image_url || row.image_url || row.image || (idx % 2 === 0 ? "/src/assets/images/luxury_watch_1782046828491.jpg" : "/src/assets/images/luxury_hero_1782046811786.jpg");
      
      const category = (row.category?.toLowerCase() === "jewelry" || name.toLowerCase().includes("ring") || name.toLowerCase().includes("earring") || name.toLowerCase().includes("diamond") || name.toLowerCase().includes("gem")) ? "jewelry" : "watches";
      const specs = row.specs || (category === "watches" ? "Swiss Mechanical Tourbillon" : "18K Gold • Flawless Cut");
      const desc = row.desc || row.description || `Exquisite master craftsmanship, synchronized live with boutique reservation allocations.`;
      
      return {
        id,
        name,
        category,
        price,
        specs,
        desc,
        image,
        sheetCell: `Row ${idx + 2}`,
        stock
      };
    });
  };

  const syncGoogleSheets = async (targetUrl: string) => {
    setIsSyncing(true);
    setSheetsFeedback("Establishing secure handshake with Google Sheets database system...");
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSheetsFeedback("Connected. Resolving CSV structure and parsing columns (watch_id, watch_name, watch_price, watch_stock_fomo, watch_image_url)...");
      
      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(`Google Sheet returned HTTP ${response.status}`);
      }
      const dataText = await response.text();
      
      if (!dataText || dataText.trim().length === 0) {
        throw new Error("Empty rows in spreadsheet database");
      }
      
      const rawRows = parseCSV(dataText);
      if (rawRows.length === 0) {
        throw new Error("No parsed content columns discovered in target CSV");
      }
      
      const mapped = mapGoogleSheetData(rawRows);
      setProductsList(mapped);
      
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSync(time);
      setSheetsFeedback(`Synchronization successful! Synchronized ${mapped.length} active collection models.`);
      setTimeout(() => setSheetsFeedback(""), 4000);
    } catch (error: any) {
      console.warn("GSheet Fetch Fallback: ", error);
      setSheetsFeedback(`Network / CORS fallback bypassed. Seamlessly restored offline master catalog.`);
      setProductsList(PRODUCT_CATALOG);
      setTimeout(() => setSheetsFeedback(""), 4500);
    } finally {
      setIsSyncing(false);
    }
  };

  const triggerSheetsSync = () => {
    syncGoogleSheets(sheetsUrl);
  };

  useEffect(() => {
    // Initial fetch of Google Sheets live database on component mount
    syncGoogleSheets(sheetsUrl);

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBooking = (e: FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone) return;
    setTicketCode("KF-" + Math.floor(10000 + Math.random() * 90000));
  };

  const currentPrice = gem.price + metal.modifier;

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (window.location.hash !== "#home" && window.location.hash !== "" && window.location.hash !== "#") {
      window.location.hash = "#home";
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 400);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Render Product Detail View
  const renderProductDetailView = () => {
    const productId = currentHash.replace("#product/", "");
    const product = productsList.find(p => p.id === productId);

    if (!product) {
      return (
        <div className="pt-40 pb-24 px-6 text-center max-w-7xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full border border-red-500/20 bg-red-500/5 mx-auto flex items-center justify-center text-red-400">
            <X className="w-8 h-8" />
          </div>
          <h2 className="font-sans text-2xl font-bold uppercase text-white">Masterpiece Not Discovered</h2>
          <p className="text-xs text-gray-500 font-mono tracking-widest">ERROR: CORRUPT ITEM REF SEQUENCE</p>
          <a
            href="#home"
            className="inline-block border border-white/20 text-white rounded-xs px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:border-[#FFD700] hover:text-[#FFD700] duration-300 transition-colors"
          >
            Return to Atelier Homepage
          </a>
        </div>
      );
    }

    // Find related items (within watches/jewelry, excluding itself)
    const relatedItems = productsList
      .filter(item => item.category === product.category && item.id !== product.id)
      .slice(0, 4);

    return (
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto text-left space-y-16">
        {/* Breadcrumb path */}
        <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-semibold tracking-widest uppercase font-mono border-b border-white/5 pb-4">
          <a href="#home" className="hover:text-white transition-colors">Salon Home</a>
          <span>/</span>
          <span className="hover:text-white transition-colors capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-[#FFD700] font-bold">{product.name}</span>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Large Showcase Image Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden border border-white/10 p-2 sm:p-4 bg-[#181818] rounded-xs shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent pointer-events-none z-10" />
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-xs filter brightness-[0.85] hover:brightness-100 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-6 left-6 z-20 text-[9px] font-mono tracking-widest uppercase text-emerald-400 px-3 py-1 bg-black/90 border border-emerald-500/20 rounded-xs">
                {product.stock}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono tracking-widest border-t border-white/5 pt-4">
              <span className="flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>GSheet Row Ref: {product.sheetCell}</span>
              </span>
              <span>100% Genuine Certified</span>
            </div>
          </div>

          {/* Right Specifications and Cart Action Column */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-xs text-[#FFD700] tracking-[0.4em] uppercase font-bold flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 gold-glow inline" />
                <span>Karama Fancy Certified Release</span>
              </span>
              <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight">
                {product.name}
              </h1>
              <div className="text-3xl font-serif italic text-[#FFD700] font-semibold border-b border-white/5 pb-6">
                {product.price}
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
              {product.desc}
            </p>

            {/* Specifications Details Table */}
            <div className="border border-white/10 rounded-xs bg-[#161616] p-6 space-y-4 shadow-xl">
              <h3 className="text-[10px] font-mono tracking-[0.25em] text-gray-400 uppercase border-b border-white/5 pb-2">CHRONOMETRY CERTIFICATION SPECS</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-mono uppercase">
                <div className="text-gray-500">Item Model Category</div>
                <div className="text-white text-right capitalize">{product.category}</div>

                <div className="text-gray-500">Core Calibre / Composition</div>
                <div className="text-[#FFD700] text-right font-semibold">{product.specs}</div>

                <div className="text-gray-500">Boutique Suite Allocation</div>
                <div className="text-white text-right font-medium">Flagship Al Maktoum St</div>

                <div className="text-gray-500">Escrow Security warranty</div>
                <div className="text-emerald-400 text-right font-medium">Complimentary 5-Year Sovereign</div>
              </div>
            </div>

            {/* Quantity Selector + Add to Cart block */}
            <div className="flex flex-col sm:flex-row gap-4 items-center border-t border-white/5 pt-8">
              <div className="flex items-center space-x-1.5 border border-white/15 bg-black/40 p-1.5 rounded-sm w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setProductDetailQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 border border-white/5 hover:border-white/20 text-gray-400 hover:text-white transition-colors rounded-sm flex items-center justify-center bg-black cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <div className="w-12 text-center text-xs font-mono font-extrabold text-white">
                  {productDetailQty}
                </div>
                <button
                  type="button"
                  onClick={() => setProductDetailQty(q => q + 1)}
                  className="w-10 h-10 border border-white/5 hover:border-white/20 text-gray-400 hover:text-white transition-colors rounded-sm flex items-center justify-center bg-black cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => addToCart(product, productDetailQty)}
                  className="flex-1 bg-[#FFD700] hover:bg-yellow-400 text-black font-extrabold text-xs tracking-widest uppercase py-4 rounded-xs cursor-pointer shadow-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Request Allocation Addition</span>
                </button>

                <button
                  onClick={() => {
                    setViewingCategory(product.category);
                    setNotes(`Atelier Reservation Request: Seeking priority discussion and private viewing for "${product.name}" (${product.price}) with sheet allocation ID ${product.sheetCell}. Quantity: ${productDetailQty}x.`);
                    scrollToSection("concierge");
                  }}
                  className="border border-white/15 hover:border-[#FFD700] text-gray-300 hover:text-[#FFD700] text-xs font-semibold uppercase tracking-widest py-4 px-6 rounded-xs transition-colors cursor-pointer bg-black/20"
                >
                  Discuss Invite
                </button>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#home"
                className="inline-flex items-center space-x-2 text-xs text-gray-400 hover:text-[#FFD700] uppercase tracking-wider transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Active Collection List</span>
              </a>
            </div>
          </div>
        </div>

        {/* Related Collectibles */}
        {relatedItems.length > 0 && (
          <div className="pt-16 border-t border-white/5 text-left space-y-8">
            <div className="space-y-1">
              <span className="text-[10px] text-[#FFD700] font-mono uppercase tracking-[0.3em]">COHESIVE CREATIONS</span>
              <h2 className="font-sans text-2xl font-black uppercase text-white">Explore Cohort Patrons</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedItems.map(item => (
                <a
                  key={item.id}
                  href={`#product/${item.id}`}
                  className="bg-[#181818] border border-white/5 hover:border-[#FFD700]/30 transition-all duration-300 p-4 rounded-xs block group text-left"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black/40 border border-white/5 relative mb-4 rounded-xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover filter brightness-[0.8] group-hover:brightness-100 group-hover:scale-105 duration-500 rounded-xs"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="font-display font-bold text-xs uppercase text-gray-400 group-hover:text-white mt-1">{item.name}</h4>
                  <p className="text-xs font-mono text-[#FFD700] font-bold mt-1">{item.price}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Cart View
  const renderCartView = () => {
    const subtotal = cart.reduce((sum, item) => {
      const numericPrice = parseFloat(item.price.replace(/[$,]/g, ""));
      return sum + (isNaN(numericPrice) ? 0 : numericPrice) * item.quantity;
    }, 0);

    const vat = subtotal * 0.05;
    const grandTotal = subtotal + vat;

    const handleWhatsAppCheckout = () => {
      const cartSummary = cart.map(item => `• ${item.name} x${item.quantity} (${item.price}) [Ref: ${item.sheetCell}]`).join("\n");
      
      const message = `Atelier Karama Fancy - High-Precision Luxury Reservation
-------------------------------------------
Client Guest Contact: ${guestName || "Estemeed Patron"}
Boutique Coordinator Desk: Al Maktoum Road, Dubai

Requested Boutique Items:
${cartSummary}

Financial Summary Matrix:
- Subtotal: $${subtotal.toLocaleString()}
- UAE Unified VAT (5%): $${vat.toLocaleString()}
- Insured Express Courier: Complimentary
-------------------------------------------
GRAND TOTAL ALLOCATED: $${grandTotal.toLocaleString()}

Please confirm active serial verification status for Deira flagship suite pickup.`;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/97142945885?text=${encoded}`, "_blank");
    };

    if (cart.length === 0) {
      return (
        <div className="pt-48 pb-32 px-6 text-center max-w-7xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 mx-auto flex items-center justify-center text-gray-500">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="font-sans text-2xl font-bold uppercase text-white">Your Reservation Cart is Vacant</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            Begin exploring our live synchronized Google Sheet timepiece collection and request luxury allocation.
          </p>
          <a
            href="#home"
            className="inline-block bg-[#FFD700] hover:bg-yellow-400 text-black rounded-xs px-8 py-3.5 text-xs font-bold uppercase tracking-widest duration-300 transition-colors cursor-pointer"
          >
            Explore Active Showrooms
          </a>
        </div>
      );
    }

    return (
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto text-left space-y-12">
        <div className="space-y-2 border-b border-white/5 pb-6">
          <span className="text-[10px] text-[#FFD700] font-mono font-bold tracking-[0.3em] uppercase">PATRON ALLOCATIONS LIST</span>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold uppercase text-white">Reservation Ledger Ledger</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-[#181818] border border-white/10 p-4 sm:p-6 rounded-xs flex flex-col sm:flex-row gap-6 items-center justify-between shadow-md opacity-100 hover:border-white/20 transition-all"
              >
                {/* Product Thumbnail Info */}
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden bg-black/40 border border-white/5 p-1 rounded-xs">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover filter brightness-90 rounded-xs" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <span className="text-[8.5px] font-mono tracking-widest text-[#FFD700] uppercase block mb-1">
                      {item.category} • REF {item.sheetCell}
                    </span>
                    <h4 className="font-display font-bold text-sm tracking-wide text-white uppercase">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 font-mono tracking-wider mt-0.5">{item.specs}</p>
                  </div>
                </div>

                {/* Adjusting Quantity Controls & Pricing */}
                <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                  <div className="flex items-center space-x-1.5 border border-white/10 p-1 bg-black/40 rounded-sm">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 border border-white/5 text-gray-400 hover:text-white transition-colors rounded-sm flex items-center justify-center bg-black cursor-pointer"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <div className="w-10 text-center text-xs font-mono font-bold text-white">
                      {item.quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 border border-white/5 text-gray-400 hover:text-white transition-colors rounded-sm flex items-center justify-center bg-black cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <span className="block text-[8px] tracking-widest text-gray-500 font-mono">APPRAISAL</span>
                    <span className="font-serif italic font-semibold text-white tracking-wide text-sm">{item.price}</span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-500 hover:text-rose-400 transition-colors bg-black/30 border border-white/5 hover:border-rose-500/20 rounded-sm"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-4 flex items-center justify-between text-xs uppercase font-semibold">
              <a href="#home" className="inline-flex items-center space-x-2 text-gray-400 hover:text-[#FFD700] duration-300 tracking-wider">
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping Collective</span>
              </a>
              <button
                onClick={() => {
                  if (confirm("Are you certain you wish to purge the active reservation ledger?")) {
                    setCart([]);
                  }
                }}
                className="text-gray-500 hover:text-rose-400 transition-colors tracking-widest font-mono cursor-pointer"
              >
                Clear Ledger
              </button>
            </div>
          </div>

          {/* Checkout Financial Statement Panel */}
          <div className="lg:col-span-4 bg-[#181818] border border-[#FFD700]/30 rounded-xs p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="absolute inset-1 border border-white/5 pointer-events-none" />
            
            <h3 className="font-sans font-extrabold text-[#FFD700] text-xs tracking-widest uppercase border-b border-white/10 pb-4">
              Atelier Fiscal Statement
            </h3>

            <div className="space-y-4 text-xs font-mono uppercase">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal Appraisal</span>
                <span className="text-white text-right">$ {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Dubai Unified VAT (5%)</span>
                <span className="text-white text-right">$ {vat.toLocaleString()}</span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-4">
                <span className="text-gray-500">Armed Insured Courier</span>
                <span className="text-emerald-400 text-right font-semibold">Complimentary</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-gray-300 font-bold tracking-wide">GRAND TOTAL DEPOSIT</span>
                <span className="text-[#FFD700] font-sans font-black text-lg transition-colors">$ {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Quick Guest Detail Inputs embedded in checkout summary so they are populated in WA chat! */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <span className="text-[8px] font-mono tracking-widest text-gray-400 uppercase block">VIP REGISTRATION DATA</span>
              <input
                type="text"
                placeholder="YOUR ESTEEMED NAME"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-black/80 border border-white/10 px-3 py-2 text-[10px] text-white placeholder-gray-600 tracking-wider uppercase rounded-xs font-mono focus:outline-none focus:border-[#FFD700]"
              />
              <input
                type="text"
                placeholder="YOUR DIRECT PHONELINE"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full bg-black/80 border border-white/10 px-3 py-2 text-[10px] text-white placeholder-gray-600 tracking-wider uppercase rounded-xs font-mono focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <button
              onClick={handleWhatsAppCheckout}
              disabled={cart.length === 0}
              className="w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-extrabold text-xs tracking-widest uppercase py-4 transition-colors rounded-xs shadow-md cursor-pointer block text-center disabled:opacity-50"
            >
              Request WhatsApp Allocation
            </button>

            <span className="block text-[8px] font-mono tracking-wider text-gray-500 align-middle text-center mt-4">
              🛡️ END-TO-END ESCROW SYSTEM COMPLIANT
            </span>
          </div>
        </div>
      </div>
    );
  };

  const filteredItems = productsList.filter(item => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans antialiased selection:bg-[#FFD700] selection:text-black">
      {/* HEADER NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glassmorphic py-4 bg-[#121212]/85 shadow-lg" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div onClick={() => scrollToSection("home")} className="flex items-center space-x-2.5 cursor-pointer group">
            <div className="w-10 h-10 rounded-full border border-[#FFD700] flex items-center justify-center p-1 group-hover:scale-105 duration-300">
              <Gem className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <span className="font-display text-lg md:text-xl font-bold tracking-[0.25em] text-[#FFD700] uppercase">
                KARAMA
              </span>
              <span className="block text-[8px] tracking-[0.4em] text-white font-semibold">
                FANCY
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 font-sans text-xs tracking-widest uppercase font-semibold">
            <button onClick={() => scrollToSection("home")} className="hover:text-[#FFD700] transition-colors cursor-pointer">Home</button>
            <button onClick={() => scrollToSection("collections")} className="hover:text-[#FFD700] transition-colors cursor-pointer">Collections</button>
            <button onClick={() => scrollToSection("customizer")} className="hover:text-[#FFD700] transition-colors cursor-pointer">Salon Atelier</button>
            <button onClick={() => scrollToSection("offers")} className="hover:text-[#FFD700] transition-colors cursor-pointer">Offers</button>
            <button onClick={() => scrollToSection("concierge")} className="hover:text-[#FFD700] transition-colors cursor-pointer">Concierge</button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-[#FFD700] transition-colors cursor-pointer">Contact</button>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:block">
              <button
                onClick={() => scrollToSection("concierge")}
                className="border border-[#FFD700] text-[#FFD700] px-5 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-[#FFD700] hover:text-black duration-300 transition-all rounded-sm cursor-pointer"
              >
                Request Invite
              </button>
            </div>

            <a
              href="#cart"
              className="relative p-2.5 text-gray-300 hover:text-[#FFD700] transition-colors border border-white/10 bg-black/60 rounded-full flex items-center justify-center cursor-pointer"
              title="View Reservation Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFD700] text-black text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-lg font-mono">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-[#FFD700] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="fixed inset-0 z-40 bg-[#121212]/95 pt-28 px-8 flex flex-col space-y-6 md:hidden backdrop-blur-2xl"
          >
            <button onClick={() => scrollToSection("home")} className="text-left text-xl font-display font-medium tracking-wide text-gray-200">Home</button>
            <button onClick={() => scrollToSection("collections")} className="text-left text-xl font-display font-medium tracking-wide text-gray-200">Collections</button>
            <button onClick={() => scrollToSection("customizer")} className="text-left text-xl font-display font-medium tracking-wide text-gray-200">Salon Atelier</button>
            <button onClick={() => scrollToSection("offers")} className="text-left text-xl font-display font-medium tracking-wide text-gray-200">Offers</button>
            <button onClick={() => scrollToSection("concierge")} className="text-left text-xl font-display font-medium tracking-wide text-gray-200">Concierge</button>
            <button onClick={() => scrollToSection("contact")} className="text-left text-xl font-display font-medium tracking-wide text-gray-200">Contact</button>
            
            <a 
              href="#cart" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-left text-xl font-display font-semibold tracking-wide text-[#FFD700] flex items-center space-x-2 border-t border-white/5 pt-4"
            >
              <ShoppingCart className="w-5 h-5 text-[#FFD700]" />
              <span>Reservation Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
            </a>

            <button
              onClick={() => scrollToSection("concierge")}
              className="w-full text-center bg-[#FFD700] text-black py-3.5 rounded-sm text-xs font-bold tracking-widest uppercase mt-4"
            >
              Private Salon Appt
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Toast Feedback Overlay */}
      <AnimatePresence>
        {cartToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#1c1c1c] border-2 border-[#FFD700] text-white px-6 py-4 rounded-md shadow-2xl flex items-center space-x-3 text-xs max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-[#FFD700]/10 border border-[#FFD700] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 text-[#FFD700]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#FFD700] uppercase tracking-wider text-[10px]">Atelier System Msg</p>
              <p className="text-gray-300 mt-0.5">{cartToast}</p>
            </div>
            <button onClick={() => setCartToast("")} className="text-gray-400 hover:text-white border-none bg-transparent cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {currentHash === "#cart" ? (
        renderCartView()
      ) : currentHash.startsWith("#product/") ? (
        renderProductDetailView()
      ) : (
        <>
          {/* HERO SECTION */}
          <section id="home" className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-black/90 z-10" />
          <motion.img
            src="/src/assets/images/luxury_hero_1782046811786.jpg"
            alt="Luxury Showcase"
            className="w-full h-full object-cover filter brightness-[0.5]"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 7, ease: "easeOut" }}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Double side decorative vertical label from Design HTML */}
        <div className="absolute left-6 bottom-24 writing-mode-vertical rotate-180 text-[9px] tracking-[0.45em] text-gray-500 uppercase font-mono hidden xl:block select-none opacity-60">
          Est. Dubai 1994
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 pt-28 pb-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-screen">
          {/* Left Text Column: col-span-7 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="lg:col-span-7 space-y-8 text-left"
          >
            <div className="flex items-center space-x-2 text-[#FFD700] tracking-[0.45em] text-[10px] uppercase font-bold">
              <Sparkles className="w-4 h-4 gold-glow inline" />
              <span>Bespoke Horology & Haute Joaillerie</span>
            </div>

            <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-black uppercase tracking-tight leading-[0.95] text-white">
              Where Time <br />
              Meets <span className="font-serif italic font-light text-[#FFD700] lowercase tracking-normal">pure brilliance.</span>
            </h1>

            {/* Left border detail from Design HTML (.hero-sub) */}
            <div className="border-l-2 border-[#FFD700] pl-6 py-1 max-w-xl">
              <p className="text-sm sm:text-base text-gray-300 font-light tracking-wide leading-relaxed">
                Curating the world's most prestigious timepieces and hand-wound Swiss tourbillons since 1994. Experience magnificent custom diamond creations at our private salon on Al Maktoum St, Dubai.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={() => scrollToSection("collections")}
                className="w-full sm:w-auto bg-transparent border border-[#FFD700] text-[#FFD700] font-sans hover:bg-[#FFD700] hover:text-black px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 rounded-sm cursor-pointer shadow-lg shadow-yellow-500/5"
              >
                Explore Collection
              </button>
              <button
                onClick={() => scrollToSection("customizer")}
                className="w-full sm:w-auto border border-white/20 hover:border-[#FFD700] hover:text-[#FFD700] px-8 py-3.5 font-sans text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 rounded-sm bg-black/50 backdrop-blur-xs cursor-pointer text-gray-300"
              >
                Bespoke Atelier Creator
              </button>
            </div>
          </motion.div>

          {/* Right Image Showcase Column: col-span-5 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              y: [0, -12, 0]
            }}
            transition={{ 
              x: { duration: 1, delay: 0.2 },
              opacity: { duration: 1, delay: 0.2 },
              y: { 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }
            }}
            className="lg:col-span-12 xl:col-span-5 flex justify-center lg:justify-end cursor-grab active:cursor-grabbing"
          >
            {/* Image showcase layout block matching Design HTML */}
            <div className="image-showcase-effect rounded-sm aspect-[4/5] w-full max-w-[420px] p-6 sm:p-8 flex items-center justify-center relative group min-h-[420px] shadow-2xl">
              <div className="border border-white/10 w-full h-full flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-black/60 backdrop-blur-md relative z-10 rounded-xs">
                <p className="text-[10px] uppercase tracking-[0.45em] text-[#FFD700] opacity-50 mb-4 font-mono">Featured Piece</p>
                
                <h2 className="font-serif italic font-light text-2xl sm:text-3xl text-white leading-snug">
                  The Aurelia <br /> Chronograph
                </h2>
                
                <div className="w-[1px] h-12 bg-[#FFD700]/60 my-6" />
                
                <p className="text-xs tracking-widest text-gray-400 font-sans uppercase">
                  18K Rose Gold & Sapphire Crystal
                </p>
              </div>

              {/* Angle printed true price tag matching Design HTML */}
              <div className="absolute bottom-10 -left-6 bg-[#FFD700] text-black font-extrabold font-sans uppercase tracking-[0.15em] text-sm py-2.5 px-8 rotate-[-6deg] shadow-2xl transition-transform duration-300 group-hover:scale-105 select-none rounded-none border border-black/10">
                $48,500
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured Announcement ticker at the very bottom of the Hero */}
        <div className="absolute bottom-6 left-6 right-6 border-t border-white/5 pt-4 text-[9px] tracking-widest text-gray-500 uppercase font-mono hidden md:flex items-center justify-between select-none">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
            <span>NEW ARRIVAL: THE MIDNIGHT NOCTURNE COLLECTION — NOW AVAILABLE AT OUR BOUTIQUE.</span>
          </div>
          <span>Boutique allocation active</span>
        </div>
      </section>

      {/* THREE PILLAR ASSURANCES */}
      <section className="bg-[#121212] border-y border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-[#FFD700]/10 rounded-full flex items-center justify-center shrink-0 border border-[#FFD700]/20 text-[#FFD700]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold tracking-wide uppercase text-sm mb-1 text-white">Certified Diamonds</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Meticulously selected with certified purity, verified color grading & ethical pedigree.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-[#FFD700]/10 rounded-full flex items-center justify-center shrink-0 border border-[#FFD700]/20 text-[#FFD700]">
              <Watch className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold tracking-wide uppercase text-sm mb-1 text-white">Genuine Swiss Calibres</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Genuine hand-wound tourbillon systems and perpetual custom mechanical chronographs.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-[#FFD700]/10 rounded-full flex items-center justify-center shrink-0 border border-[#FFD700]/20 text-[#FFD700]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold tracking-wide uppercase text-sm mb-1 text-white">Lifetime Atelier Care</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Ultrasonic diagnostics and tailored polishing sequences provided perpetually to owners.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DOUBLE COMPLEMENTARY BANNER SHOWCASE */}
      <section id="collections" className="py-24 px-6 bg-[#121212] relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-2">
            <p className="text-[#FFD700] uppercase tracking-[0.4em] text-xs font-semibold">Exquisite Masterpieces</p>
            <h2 className="font-sans text-3xl sm:text-5xl font-extrabold uppercase text-white">
              Curated <span className="font-serif italic font-light text-[#FFD700] lowercase tracking-normal">specialties.</span>
            </h2>
            <div className="w-16 h-[2px] bg-[#FFD700] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Watches showcase banner */}
            <div className="relative group overflow-hidden rounded-lg bg-black border border-white-5/5 flex flex-col justify-between">
              <div className="relative h-96 overflow-hidden">
                <img
                  src="/src/assets/images/luxury_watch_1782046828491.jpg"
                  alt="Fine Watch"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
                <div className="absolute top-6 left-6 z-20 bg-[#121212]/90 backdrop-blur-md border border-[#FFD700]/30 px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-[#FFD700]">
                  Swiss Movements
                </div>
              </div>
              <div className="p-8 space-y-3 bg-black">
                <h3 className="font-display text-2xl font-bold tracking-wide uppercase text-white">Classic Horology</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  Hand-built systems protected by sapphire crystal casing. Housing tourbillon rotors, skeleton gear setups & bespoke 18K rose gold bezels.
                </p>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                  <span className="text-[#FFD700] font-mono uppercase tracking-widest text-[10px]">6 Options Available</span>
                  <button
                    onClick={() => { setActiveTab("watches"); scrollToSection("shop-catalog"); }}
                    className="text-white hover:text-[#FFD700] transition-colors uppercase font-bold text-[10px] tracking-widest flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View Watches</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Fine Jewelry showcase banner */}
            <div className="relative group overflow-hidden rounded-lg bg-black border border-white-5/5 flex flex-col justify-between">
              <div className="relative h-96 overflow-hidden">
                <img
                  src="/src/assets/images/luxury_jewelry_1782046844877.jpg"
                  alt="Fine Jewelry"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
                <div className="absolute top-6 left-6 z-20 bg-[#121212]/90 backdrop-blur-md border border-[#FFD700]/30 px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-[#FFD700]">
                  Imperial Diamonds
                </div>
              </div>
              <div className="p-8 space-y-3 bg-black">
                <h3 className="font-display text-2xl font-bold tracking-wide uppercase text-white">Haute Joaillerie</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  Flawless certified white diamonds coupled with magnificent pear sapphire drops, carved masterworks & customizable gold chains.
                </p>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                  <span className="text-[#FFD700] font-mono uppercase tracking-widest text-[10px]">Gem Match Guarantee</span>
                  <button
                    onClick={() => { setActiveTab("jewelry"); scrollToSection("shop-catalog"); }}
                    className="text-white hover:text-[#FFD700] transition-colors uppercase font-bold text-[10px] tracking-widest flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View Jewelry</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERABLE INTERACTIVE CATALOG GRID with Infinite Scroll feel */}
      <section id="shop-catalog" className="py-24 px-6 bg-black/60 border-t border-white/5 relative">
        <div className="absolute left-0 right-0 top-0 h-40 bg-gradient-to-b from-black to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          {/* Header & Simulated Google Sheets connection status bar */}
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-6 border-b border-white/5">
            <div className="space-y-2">
              <span className="text-[#FFD700] uppercase tracking-[0.4em] text-xs font-semibold block">AURA COLLECTION ENGINE</span>
              <h3 className="font-sans text-2xl md:text-4xl font-extrabold uppercase text-white leading-tight">
                Signature <span className="font-serif italic font-light text-[#FFD700] lowercase tracking-normal">releases.</span>
              </h3>
              <p className="text-xs text-gray-400 max-w-xl">
                Default options synchronized hourly with our Google Sheets Inventory database template. All cell allocations are parsed live.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Google Sheets Live Status Box */}
              <div className="bg-[#121212]/90 border border-white/10 px-4 py-3 rounded-sm flex items-center justify-between gap-4 select-none">
                <div className="flex items-center space-x-3">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono tracking-widest text-gray-500 uppercase">SHEETS DATA LINK</span>
                    <span className="block text-[10px] text-gray-300 font-semibold uppercase flex items-center gap-1">
                      <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
                      {isSyncing ? "Syncing Workspace..." : "KaramaFancy_Inv.xlsx"}
                    </span>
                  </div>
                </div>
                
                <div className="border-l border-white/10 pl-4 text-right">
                  <span className="block text-[8px] font-mono tracking-widest text-gray-500 uppercase">SYNC STAMP</span>
                  <span className="block text-[10px] text-[#FFD700] tracking-wider font-mono">
                    {lastSync}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 border-l border-white/10 pl-3">
                  <button
                    type="button"
                    onClick={() => setIsConfigOpen(!isConfigOpen)}
                    className={`p-1.5 rounded-sm border border-white/10 bg-black hover:border-[#FFD700]/40 text-gray-400 hover:text-white transition-colors cursor-pointer ${
                      isConfigOpen ? "text-[#FFD700] border-[#FFD700]/35 bg-yellow-500/5" : ""
                    }`}
                    title="Configure Custom Google Sheet URL"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={triggerSheetsSync}
                    disabled={isSyncing}
                    className={`p-1.5 rounded-sm border border-white/10 bg-black hover:border-[#FFD700]/40 transition-colors cursor-pointer ${
                      isSyncing ? "animate-spin text-[#FFD700]" : "text-gray-400 hover:text-white"
                    }`}
                    title="Force Google Sheets Live Synchronize"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Filter Pill Tab bar */}
              <div className="flex items-center bg-[#121212] p-1 border border-white/10 rounded-sm self-start sm:self-auto shrink-0">
                {(["all", "watches", "jewelry"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setVisibleCount(6); // reset initial batch inside filter
                    }}
                    className={`px-4 py-2.5 text-[10.5px] tracking-widest uppercase font-bold transition-all cursor-pointer ${
                      activeTab === tab ? "bg-[#FFD700] text-black rounded-xs" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Google Sheets URL Config Panel */}
          <AnimatePresence>
            {isConfigOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-[#181818] border border-[#FFD700]/30 p-5 rounded-xs flex flex-col md:flex-row gap-4 items-end shadow-2xl relative z-20"
              >
                <div className="flex-1 space-y-2 w-full text-left">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#FFD700] font-mono font-bold">
                    Custom Google Sheet (Published CSV Feed URL)
                  </label>
                  <p className="text-[10.5px] text-gray-400 font-light">
                    Go to File &gt; Share &gt; Publish to web, choose "Entire Document" or sheet name, select "Comma-separated values (.csv)", and copy the link. Use the columns: <span className="text-[#FFD700] font-mono">watch_id</span>, <span className="text-[#FFD700] font-mono">watch_name</span>, <span className="text-[#FFD700] font-mono">watch_price</span>, <span className="text-[#FFD700] font-mono">watch_stock_fomo</span>, and <span className="text-[#FFD700] font-mono">watch_image_url</span>.
                  </p>
                  <input
                    type="url"
                    value={sheetsUrl}
                    onChange={(e) => setSheetsUrl(e.target.value)}
                    className="w-full bg-black/80 border border-white/10 px-4 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-[#FFD700] transition-colors rounded-xs font-mono"
                    placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setSheetsUrl("https://docs.google.com/spreadsheets/d/e/2PACX-1vT1J_35oZpU8YtW9b-pA1uGqC-mBf8oQYfW_cEis7uDeiS8GzHBy7N7oEnrL6z6b6f7X69bS_gY_p3r/pub?output=csv");
                      syncGoogleSheets("https://docs.google.com/spreadsheets/d/e/2PACX-1vT1J_35oZpU8YtW9b-pA1uGqC-mBf8oQYfW_cEis7uDeiS8GzHBy7N7oEnrL6z6b6f7X69bS_gY_p3r/pub?output=csv");
                    }}
                    className="flex-1 md:flex-none border border-white/10 hover:border-white/20 text-xs text-gray-400 hover:text-white px-4 py-2.5 transition-colors font-semibold uppercase tracking-wider rounded-xs cursor-pointer bg-black/40 text-center"
                  >
                    Reset Template
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      syncGoogleSheets(sheetsUrl);
                    }}
                    disabled={isSyncing}
                    className="flex-1 md:flex-none bg-[#FFD700] text-black font-extrabold text-xs tracking-widest uppercase px-6 py-2.5 hover:bg-yellow-400 transition-colors rounded-xs cursor-pointer disabled:opacity-50"
                  >
                    Load Sheet
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback log block */}
          {sheetsFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#121212] border border-emerald-500/10 text-emerald-400 p-3 rounded-xs text-[10.5px] font-mono tracking-wider flex items-center space-x-2 select-none"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>{sheetsFeedback}</span>
            </motion.div>
          )}

          {/* Product Cards Layout - Staggered viewport entrance reproducing GSAP Cascade flawlessly */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {productsList.filter(item => {
                if (activeTab === "all") return true;
                return item.category === activeTab;
              }).slice(0, visibleCount).map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.8, 
                    delay: (idx % 4) * 0.12,
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="bg-[#191919] border border-white/5 rounded-xs flex flex-col justify-between hover:border-[#FFD700]/30 transition-all duration-300 relative group overflow-hidden shadow-xl"
                >
                  <div className="space-y-4">
                    {/* Image Preview Container with high quality hover zoom & slight lift */}
                    <div className="relative aspect-[16/11] w-full overflow-hidden bg-black/60 border-b border-white/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.8] group-hover:brightness-[0.95]"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Interactive subtle gradient fade */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#191919] via-transparent to-transparent opacity-60 pointer-events-none" />

                      {/* Floating Stock/Sheet indicators */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="text-[8.5px] font-mono tracking-widest uppercase text-[#FFD700] px-2.5 py-1 bg-black/85 backdrop-blur-md border border-[#FFD700]/20 rounded-xs">
                          {item.category}
                        </span>
                        
                        <span className="text-[8.5px] font-mono tracking-widest uppercase text-emerald-400 px-2.5 py-1 bg-black/85 backdrop-blur-md border border-emerald-500/20 rounded-xs">
                          {item.stock}
                        </span>
                      </div>

                      {/* Google Sheet Cell Address tag representing dynamic linked cell data */}
                      <div className="absolute bottom-3 right-4 bg-black/80 backdrop-blur-sm px-2 py-0.5 border border-white/10 rounded-xs text-[7.5px] font-mono tracking-widest text-[#FFD700] flex items-center gap-1 select-none">
                        <Database className="w-2.5 h-2.5 text-[#FFD700]" />
                        <span>SHEETS: {item.sheetCell}</span>
                      </div>
                    </div>

                    {/* text content */}
                    <div className="px-6 pb-2 space-y-3">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="font-sans font-extrabold text-[#FFD700] tracking-wider text-sm uppercase">
                          {item.price}
                        </h4>
                        <span className="text-[10px] text-gray-500 font-mono tracking-wider">{item.specs}</span>
                      </div>

                      <h4 className="font-display font-bold text-lg tracking-wide uppercase text-white group-hover:text-[#FFD700] transition-colors duration-200">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4 border-t border-white/5 flex gap-2">
                    <a
                      href={`#product/${item.id}`}
                      className="flex-1 text-center text-[9px] tracking-widest font-display font-bold uppercase bg-transparent border border-white/20 hover:border-[#FFD700]/60 hover:text-[#FFD700] py-3 transition-all duration-200 rounded-xs cursor-pointer block"
                    >
                      Explore
                    </a>
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 text-center text-[9px] tracking-widest font-display font-bold uppercase bg-[#FFD700] border border-[#FFD700] text-black hover:bg-yellow-400 hover:border-yellow-400 py-3 transition-all duration-200 rounded-xs cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Addictive Infinite Scroll load-more engine */}
          <div className="pt-8 text-center space-y-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.25em] font-mono">
              Displayed: {Math.min(visibleCount, productsList.filter(item => activeTab === "all" ? true : item.category === activeTab).length)} of {productsList.filter(item => activeTab === "all" ? true : item.category === activeTab).length} luxury items
            </p>

            {visibleCount < productsList.filter(item => activeTab === "all" ? true : item.category === activeTab).length ? (
              <button
                onClick={() => {
                  setIsSyncing(true);
                  setTimeout(() => {
                    setVisibleCount(prev => prev + 3);
                    setIsSyncing(false);
                  }, 800);
                }}
                disabled={isSyncing}
                className="inline-flex items-center space-x-2 border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black px-10 py-3.5 text-xs uppercase tracking-[0.25em] font-bold transition-all rounded-sm cursor-pointer shadow-lg shadow-yellow-500/5 select-none"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Accessing Spreadsheet Rows...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Masterpieces</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            ) : (
              <div className="inline-flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 px-6 py-2.5 border border-emerald-500/20 text-[10.5px] tracking-widest uppercase font-semibold rounded-sm select-none">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Atelier catalog fully mapped with active spreadsheet rows</span>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* INTERACTIVE BESPOKE CUSTOMIZER */}
      <section id="customizer" className="py-24 px-6 bg-[#121212] relative border-t border-white/5">
        <div className="absolute right-0 top-1/4 w-96 h-96 rounded-full bg-[#FFD700]/5 blur-[120px] pointer-events-none animate-pulse" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <p className="text-[#FFD700] uppercase tracking-[0.4em] text-xs font-semibold">Virtual Atelier</p>
            <h2 className="font-sans text-3xl sm:text-5xl font-extrabold uppercase text-white">
              Bespoke <span className="font-serif italic font-light text-[#FFD700] lowercase tracking-normal">jewelry creator.</span>
            </h2>
            <p className="max-w-xl mx-auto text-xs text-gray-400 mt-2">Test exquisite configurations of premium base alloys and signature flawless gemstones with dynamic live valuation estimates.</p>
            <div className="w-16 h-[2px] bg-[#FFD700] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-black/30 border border-white/5 p-6 md:p-12 rounded-lg">
            
            {/* Dynamic Visual Simulated Preview */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6">
              <div className="relative w-72 h-72 rounded-full border border-white/5 flex items-center justify-center bg-gradient-to-tr from-black/80 to-[#1c1c1c] p-4 shadow-3xl">
                
                {/* Aura lighting */}
                <div 
                  className="absolute w-44 h-44 rounded-full blur-3xl opacity-20 transition-all duration-500"
                  style={{
                    backgroundColor: gem.id === "sp" ? "#3b82f6" : metal.id === "yg" ? "#eab308" : "#ffffff",
                  }}
                />

                <div className="absolute inset-0 rounded-full border border-white/5 animate-spin-slow pointer-events-none" />

                <div className="relative text-center z-10 flex flex-col items-center justify-center">
                  <div className="mb-4">
                    <Gem 
                      className="w-16 h-16 filter drop-shadow-xl transition-all duration-500 hover:rotate-12 cursor-pointer"
                      style={{
                        color: gem.id === "sp" ? "#3b82f6" : "#FFD700",
                      }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="block text-[8px] tracking-[0.3em] uppercase text-gray-500 font-mono">SELECTED BLUEPRINT</span>
                    <span className="block font-display text-sm font-bold text-white tracking-widest uppercase">
                      {gem.name}
                    </span>
                    <span className="block text-[9px] text-[#FFD700]/90 font-mono tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded-xs inline-block">
                      {metal.name} • {gem.size}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-6 flex items-center space-x-1.5 text-[9px] text-gray-500 font-mono">
                  <span>ALLOY CORE:</span>
                  <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: metal.code }} />
                </div>
              </div>

              {/* Estimate Box */}
              <div className="w-full bg-[#1c1c1c] border border-[#FFD700]/20 p-5 rounded-sm text-center space-y-0.5">
                <span className="text-[9px] tracking-[0.2em] font-medium text-gray-400 uppercase">ESTIMATED ATELIER COST</span>
                <div className="text-3xl text-[#FFD700] font-display font-black">
                  ${currentPrice.toLocaleString()}
                </div>
                <div className="text-[8px] text-emerald-400 font-mono uppercase tracking-widest">Complimentary insured global private transit</div>
              </div>
            </div>

            {/* Selector Options Box */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Metal Alloy Selector */}
              <div className="space-y-3">
                <span className="text-xs font-bold tracking-[0.2em] text-white uppercase block">1. Select Noble Base Alloy</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {CUSTOMIZER.metals.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setMetal(m)}
                      className={`cursor-pointer p-4 border rounded-xs transition-all flex flex-col justify-between ${
                        metal.id === m.id
                          ? "border-[#FFD700] bg-[#FFD700]/5 text-white"
                          : "border-white/5 bg-[#1c1c1c]/40 hover:border-white/20 text-gray-400"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.code }} />
                        <span className="text-[11px] font-bold uppercase text-white">{m.name}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">{m.desc}</p>
                      <span className="text-[9px] font-mono uppercase text-right block mt-3">
                        {m.modifier > 0 ? `+$${m.modifier.toLocaleString()}` : "Included"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gemstone Selector */}
              <div className="space-y-3">
                <span className="text-xs font-bold tracking-[0.2em] text-white uppercase block">2. Select Primary Flawless Gem</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {CUSTOMIZER.gems.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => setGem(g)}
                      className={`cursor-pointer p-4 border rounded-xs transition-all flex flex-col justify-between ${
                        gem.id === g.id
                          ? "border-[#FFD700] bg-[#FFD700]/5 text-white"
                          : "border-white/5 bg-[#1c1c1c]/40 hover:border-white/20 text-gray-400"
                      }`}
                    >
                      <div>
                        <span className="text-[11px] font-bold uppercase text-white block">{g.name}</span>
                        <p className="text-[10px] text-gray-500 mt-0.5">{g.desc}</p>
                      </div>
                      <div className="mt-3 flex justify-between items-center text-[9px] font-mono">
                        <span className="text-[#FFD700]">{g.size}</span>
                        <span>${g.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit to studio */}
              <button
                onClick={() => {
                  setNotes(`Client Configuration: ${metal.name} with ${gem.name} value of $${currentPrice.toLocaleString()}`);
                  setViewingCategory("customizer");
                  scrollToSection("concierge");
                }}
                className="w-full bg-[#FFD700] text-black text-xs font-bold tracking-widest uppercase hover:bg-yellow-400 py-3.5 rounded-sm transition-all shadow-md hover:shadow-yellow-500/15 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Bookmark className="w-4 h-4 cursor-pointer" />
                <span>Transmit Blueprint to Designers</span>
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* EXCLUSIVE CIRCLE OFFERS */}
      <section id="offers" className="py-24 px-6 bg-black relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-lg bg-[#1c1c1c] border border-[#FFD700]/20 p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="space-y-6 max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 text-[#FFD700] text-[10px] tracking-widest uppercase font-bold bg-[#FFD700]/10 px-3 py-1.5 rounded-full border border-[#FFD700]/10">
                <BadgePercent className="w-3.5 h-3.5" />
                <span>VIP Allocation Circles</span>
              </div>
              
              <h2 className="font-sans text-3xl sm:text-5xl font-extrabold uppercase text-white leading-tight">
                Secure Early <br />
                <span className="font-serif italic font-light text-[#FFD700] lowercase tracking-normal">salon releases.</span>
              </h2>
              
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-light">
                Obtain priority reservation allocations on highly-coveted limited production watches, custom gemstones allocations, and private champagne viewing nights.
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-left pt-2 text-[11px] text-gray-300 uppercase tracking-wider font-semibold">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />
                  <span>Early Swiss Release</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />
                  <span>Geneva Private Invites</span>
                </div>
              </div>
            </div>

            {/* Email Box */}
            <div className="bg-black/80 border border-white/5 p-6 md:p-8 rounded-sm w-full lg:max-w-sm shrink-0 space-y-4">
              <h4 className="font-display font-bold uppercase text-xs tracking-widest text-center text-white text-medium">Private Releases Digest</h4>
              <p className="text-center text-[10px] text-gray-500">Mailed strictly to credentialed subscribers list. No promotional fluff.</p>
              
              <div className="space-y-3 pt-1">
                <input
                  type="email"
                  placeholder="Enter private email..."
                  required
                  className="w-full bg-[#121212] border border-white/10 placeholder-gray-600 px-4 py-3 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-[#FFD700] transition-colors rounded-sm"
                />
                <button
                  onClick={() => alert("Exquisite choice. Your coordinates are encrypted inside the Master distribution registry.")}
                  className="w-full bg-[#FFD700] text-black hover:bg-yellow-400 font-bold text-xs tracking-widest uppercase py-3 duration-300 transition-all rounded-sm cursor-pointer"
                >
                  Join Circle Registry
                </button>
              </div>
              <div className="text-[8px] text-gray-500 text-center font-mono tracking-widest uppercase">Secured with 256-bit client-side cipher</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVATE VIEWING APPOINTMENT & DIGITIZED INVITATION */}
      <section id="concierge" className="py-24 px-6 bg-[#121212] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <p className="text-[#FFD700] uppercase tracking-[0.4em] text-xs font-semibold">Salon Service</p>
            <h2 className="font-sans text-3xl sm:text-5xl font-extrabold uppercase text-white">
              Book a <span className="font-serif italic font-light text-[#FFD700] lowercase tracking-normal">private viewing.</span>
            </h2>
            <div className="w-16 h-[2px] bg-[#FFD700] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Form */}
            <div className="bg-black/40 border border-white/5 p-6 md:p-8 rounded-lg space-y-6">
              <h3 className="font-display font-medium uppercase text-lg text-white tracking-wider flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[#FFD700]" />
                <span>Private Suite Reservations</span>
              </h3>

              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] tracking-widest uppercase font-bold text-gray-400 block">Patron Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Alexander"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 px-4 py-3 text-xs placeholder-gray-600 focus:outline-none focus:border-[#FFD700] uppercase tracking-wider rounded-sm text-white"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] tracking-widest uppercase font-bold text-gray-400 block">Secure Mobile Coordinate</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +971 50 123 4567"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 px-4 py-3 text-xs placeholder-gray-600 focus:outline-none focus:border-[#FFD700] uppercase tracking-wider rounded-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] tracking-widest uppercase font-bold text-gray-400 block">Focus Category</label>
                    <select
                      value={viewingCategory}
                      onChange={(e) => setViewingCategory(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 px-4 py-3 text-xs focus:outline-none focus:border-[#FFD700] uppercase tracking-wider rounded-sm text-white"
                    >
                      <option value="watches">Swiss Chronographs</option>
                      <option value="jewelry">Haute Jewelry</option>
                      <option value="customizer">Bespoke Design Studio</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] tracking-widest uppercase font-bold text-gray-400 block">Reservation Date</label>
                    <input
                      type="date"
                      required
                      value={viewingDate}
                      onChange={(e) => setViewingDate(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-[#FFD700] uppercase tracking-wider rounded-sm text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] tracking-widest uppercase font-bold text-gray-400 block">Select Time (GMT+4)</label>
                    <input
                      type="time"
                      required
                      value={viewingTime}
                      onChange={(e) => setViewingTime(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-[#FFD700] uppercase tracking-wider rounded-sm text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest uppercase font-bold text-gray-400 block">Special client requests & champagne choice</label>
                  <textarea
                    rows={3}
                    placeholder="Provide bespoke sizing, ring requests, private security guidelines here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 px-4 py-3 text-xs placeholder-gray-600 focus:outline-none focus:border-[#FFD700] uppercase tracking-wider rounded-sm text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FFD700] text-black hover:bg-yellow-400 font-bold text-xs tracking-widest uppercase py-4 transition-all rounded-sm cursor-pointer shadow-md"
                >
                  Generate Private Salon Invitation
                </button>
              </form>
            </div>

            {/* Simulated Invitation Graphic card */}
            <div className="flex flex-col items-center space-y-6">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-mono">YOUR DECRYPTED VIP ADMIT-ONE INVITE</span>
              
              <div className="w-full max-w-md bg-gradient-to-br from-[#1c1c1c] to-black border-2 border-[#FFD700]/30 p-8 rounded-lg relative overflow-hidden shadow-2xl">
                <div className="absolute inset-1 border border-white/5 pointer-events-none" />

                {/* header */}
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex items-center space-x-1.5">
                    <Gem className="w-4 h-4 text-[#FFD700]" />
                    <span className="font-display font-bold text-[10px] tracking-widest text-white uppercase">Atelier Salon Pass</span>
                  </div>
                  <span className="font-mono text-[#FFD700] text-[10px] tracking-widest font-bold">
                    {ticketCode || "KF-PENDING"}
                  </span>
                </div>

                {/* center guest name */}
                <div className="py-8 text-center space-y-2">
                  <span className="text-[8px] tracking-[0.3em] font-light text-gray-500 uppercase block">Verified Client Guest</span>
                  <h4 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-wider luxury-text-gradient min-h-[32px]">
                    {guestName || "CHASE ALEXANDERS"}
                  </h4>
                  <div className="w-12 h-[1px] bg-[#FFD700]/30 mx-auto" />
                </div>

                {/* details */}
                <div className="grid grid-cols-2 gap-4 text-xs font-medium uppercase border-t border-white/5 pt-4">
                  <div>
                    <span className="text-[8px] text-gray-500 block mb-0.5 font-mono tracking-widest">FOCUS COLLECTION</span>
                    <span className="text-white text-[10px] tracking-wide text-[#FFD700]/90">
                      {viewingCategory === "watches" ? "Swiss Horology" : viewingCategory === "jewelry" ? "Fine Jewels" : "Bespoke Creator"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[8px] text-gray-500 block mb-0.5 font-mono tracking-widest">BOUTIQUE SUITE</span>
                    <span className="text-white text-[10px] tracking-wide">CHAMBER 3A</span>
                  </div>

                  <div>
                    <span className="text-[8px] text-gray-500 block mb-0.5 font-mono tracking-widest">RESERVATION DATE</span>
                    <span className="text-white text-[10px] tracking-wide font-mono">
                      {viewingDate ? new Date(viewingDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "CHOSE DATE"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[8px] text-gray-500 block mb-0.5 font-mono tracking-widest">ADMITTIME (GMT+4)</span>
                    <span className="text-white text-[10px] tracking-wide font-mono">
                      {viewingTime || "CHOSE TIME"}
                    </span>
                  </div>
                </div>

                {/* qr placeholder */}
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <div className="space-y-1 max-w-[240px]">
                    <span className="text-[8px] text-gray-400 block uppercase tracking-widest font-bold font-mono">Screening admittance</span>
                    <p className="text-[9px] text-gray-500 leading-normal">Transmit coordinate verification 2 hours prior to arrival. Valet holds active status at Deira entrance.</p>
                  </div>
                  
                  {/* qr block */}
                  <div className="w-12 h-12 border border-[#FFD700]/25 bg-black flex items-center justify-center p-1 relative shrink-0">
                    <div className="grid grid-cols-4 gap-1 w-full h-full opacity-60">
                      <div className="bg-[#FFD700]"></div><div className="bg-transparent"></div><div className="bg-[#FFD700]"></div><div className="bg-[#FFD700]"></div>
                      <div className="bg-transparent"></div><div className="bg-[#FFD700]"></div><div className="bg-[#FFD700]"></div><div className="bg-transparent"></div>
                      <div className="bg-[#FFD700]"></div><div className="bg-transparent"></div><div className="bg-[#FFD700]"></div><div className="bg-[#FFD700]"></div>
                      <div className="bg-transparent"></div><div className="bg-[#FFD700]"></div><div className="bg-transparent"></div><div className="bg-[#FFD700]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {ticketCode && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] px-4 py-2.5 rounded-sm flex items-center space-x-2 w-full max-w-md">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>VIP reservation live. Decrypted entry pass assigned.</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* BOUTIQUE DIRECTORY & GPS SIMULATION */}
      <section id="contact" className="py-24 px-6 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <span className="text-[#FFD700] uppercase tracking-[0.4em] text-xs font-semibold">Flagship Coordinates</span>
              <h2 className="font-sans text-3xl md:text-4xl font-extrabold uppercase text-white">
                Our <span className="font-serif italic font-light text-[#FFD700] lowercase tracking-normal">salon chambers.</span>
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
              Located on high-end Al Maktoum Road in Deira. Private private suites are guarded with rigorous confidentiality sequences for our esteemed patrons.
            </p>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-[#FFD700] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-medium text-[11px] tracking-wider text-gray-300 uppercase">Address Directory</h4>
                  <p className="text-white mt-1">Suite 112, Al Maktoum Street, Deira district, Dubai, UAE</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-5 h-5 text-[#FFD700] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-medium text-[11px] tracking-wider text-gray-300 uppercase">Saloon Hours</h4>
                  <div className="text-white mt-1 space-y-1 font-mono">
                    <p>Monday - Friday: 10:00 AM - 9:00 PM</p>
                    <p>Saturday: 11:00 AM - 10:00 PM</p>
                    <p className="text-[#FFD700]/80">Sunday: Closed (VIP booking rentals exclusively)</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="w-5 h-5 text-[#FFD700] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-medium text-[11px] tracking-wider text-gray-300 uppercase">Boutique Line</h4>
                  <p className="text-white mt-1 font-mono">+971 (0) 4 294 5885</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] tracking-widest uppercase font-bold text-gray-500 block mb-2 font-mono">Sister Hubs</span>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                <span className="border border-white/10 px-3 py-1 bg-[#1c1c1c] rounded-full text-white">London, Mayfair</span>
                <span className="border border-white/10 px-3 py-1 bg-[#1c1c1c] rounded-full text-white">Geneva, Aurelia</span>
                <span className="border border-white/10 px-3 py-1 bg-[#1c1c1c] rounded-full text-white">Tokyo, Ginza</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#1c1c1c]/40 border border-white/5 p-6 md:p-8 rounded-lg flex flex-col justify-between h-full relative group">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white-5/5">
                <span className="text-xs font-bold font-display uppercase text-white tracking-widest flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-[#FFD700]" />
                  <span>Interactive GPS Coordinate</span>
                </span>
                <span className="text-[8px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-sm">GPS STAMP ALIGNED</span>
              </div>

              {/* Map block background */}
              <div className="w-full h-80 bg-black relative rounded-md border border-white/5 overflow-hidden flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                <div className="absolute w-[400px] h-[1px] bg-white/5 rotate-45" />
                <div className="absolute w-[400px] h-[1px] bg-white/5 -rotate-45" />

                <div className="absolute z-10 text-center space-y-3 bg-black/95 p-6 border border-[#FFD700]/30 rounded-sm shadow-2xl max-w-sm">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FFD700]/10 border-2 border-[#FFD700]">
                    <Gem className="w-5 h-5 text-[#FFD700] animate-bounce" />
                  </div>
                  <div>
                    <h5 className="font-display font-medium uppercase text-xs text-white tracking-wider">Karama Fancy Salon</h5>
                    <p className="text-[10px] text-gray-500 mt-1">Al Maktoum St, Deira Core district near the Clocktower landmark</p>
                  </div>
                  <button 
                    onClick={() => alert("Coordinate details copied. Navigating via Dubai maps app.")}
                    className="bg-[#FFD700] hover:bg-yellow-400 text-black font-bold font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 w-full rounded-xs transition-colors cursor-pointer"
                  >
                    Open Live Routing
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 uppercase font-mono">
              <span>Security status: Level-4 private</span>
              <span>Coordinates: 25.2635° N, 55.3218° E</span>
            </div>
          </div>

        </div>
      </section>

        </>
      )}

      {/* FOOTER */}
      <footer className="bg-[#121212] border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full border border-[#FFD700] flex items-center justify-center shrink-0">
              <Gem className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <span className="font-display text-base font-bold tracking-[0.2em] text-white">
                KARAMA FANCY
              </span>
              <span className="block text-[8px] tracking-[0.3em] text-[#FFD700] uppercase font-bold">
                Time & Brilliancy
              </span>
            </div>
          </div>

          <div className="text-center md:text-right space-y-2">
            <p className="text-[10px] text-gray-400 font-light tracking-wide">
              © 2026 Karama Fancy Jewellers & Watchmaker Co. All rights reserved.
            </p>
            <div className="flex justify-center md:justify-end space-x-6 text-[10px] uppercase tracking-widest font-mono text-gray-500">
              <a href="#home" className="hover:text-[#FFD700] transition-colors">Privacy Shield</a>
              <a href="#home" className="hover:text-[#FFD700] transition-colors">Client Code</a>
              <a href="#home" className="hover:text-[#FFD700] transition-colors">Integrity Charter</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
