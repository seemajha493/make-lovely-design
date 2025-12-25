import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShoppingCart, Plus, Minus, Pill, Filter, Package, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Medicine {
  id: string;
  name: string;
  generic_name: string | null;
  description: string | null;
  category: string;
  price: number;
  stock_quantity: number;
  dosage_form: string;
  strength: string | null;
  manufacturer: string | null;
  requires_prescription: boolean;
  image_url: string | null;
}

const categories = [
  "All Categories",
  "Pain Relief",
  "Antibiotics",
  "Vitamins",
  "Cold & Flu",
  "Digestive Health",
  "Skin Care",
  "Diabetes",
  "Heart Health",
  "Allergy",
  "First Aid"
];

export default function Medicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { addToCart, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .eq('is_active', true)
        .gt('stock_quantity', 0)
        .order('name');

      if (error) throw error;
      setMedicines(data || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (medicine.generic_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      medicine.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleQuantityChange = (medicineId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [medicineId]: Math.max(1, (prev[medicineId] || 1) + delta)
    }));
  };

  const handleAddToCart = async (medicine: Medicine) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/auth');
      return;
    }

    if (medicine.requires_prescription) {
      toast.info('This medicine requires a prescription');
    }

    await addToCart(medicine.id, quantities[medicine.id] || 1);
    setQuantities(prev => ({ ...prev, [medicine.id]: 1 }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Medicine Store
            </h1>
            <p className="text-muted-foreground">
              Browse and order medicines from verified pharmacies
            </p>
          </div>
          <Button 
            onClick={() => navigate('/cart')} 
            className="gap-2"
            variant="outline"
          >
            <ShoppingCart className="h-5 w-5" />
            Cart ({totalItems})
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search medicines by name, generic name, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Medicines Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-40 bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredMedicines.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No medicines found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory !== "All Categories"
                ? "Try adjusting your search or filter criteria"
                : "No medicines are currently available. Check back later!"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedicines.map(medicine => (
              <Card key={medicine.id} className="overflow-hidden card-hover">
                <div className="relative h-40 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                  {medicine.image_url ? (
                    <img 
                      src={medicine.image_url} 
                      alt={medicine.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Pill className="h-16 w-16 text-primary/30" />
                  )}
                  {medicine.requires_prescription && (
                    <Badge className="absolute top-2 right-2 bg-warning text-warning-foreground">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Rx Required
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {medicine.category}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                    {medicine.name}
                  </h3>
                  {medicine.generic_name && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                      {medicine.generic_name}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span>{medicine.dosage_form}</span>
                    {medicine.strength && (
                      <>
                        <span>•</span>
                        <span>{medicine.strength}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-primary">
                      ₹{medicine.price.toFixed(2)}
                    </span>
                    <span className={`text-xs ${medicine.stock_quantity < 10 ? 'text-warning' : 'text-success'}`}>
                      {medicine.stock_quantity < 10 ? 'Low stock' : 'In stock'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(medicine.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-sm">
                        {quantities[medicine.id] || 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(medicine.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      className="flex-1 gap-2"
                      size="sm"
                      onClick={() => handleAddToCart(medicine)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Important Notice</h3>
              <p className="text-sm text-muted-foreground">
                Some medicines require a valid prescription from a registered doctor. 
                You may be asked to upload your prescription during checkout.
                Always consult a healthcare professional before taking any medication.
              </p>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
