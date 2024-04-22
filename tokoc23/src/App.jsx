import { useState, useEffect } from 'react';
import './App.css'; // Menggunakan Tailwind CSS

// HeroSectionSlide component
function HeroSectionSlide() {
  const [currentSlide, setCurrentSlide] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide % 3) + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-96">
      <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-4xl text-white font-bold">Promo Spesial!</h2>
        <img src={`${currentSlide}.jpg`} alt={`Slide ${currentSlide}`} />
      </div>
    </div>
  );
}

function App() {
  // State untuk menyimpan data produk
  const [products, setProducts] = useState([]);

  // State untuk menyimpan data keranjang
  const [cart, setCart] = useState([]);

  // State untuk menyimpan kata kunci pencarian
  const [searchTerm, setSearchTerm] = useState('');

  // Menggunakan state lokal untuk menyimpan jumlah sementara untuk setiap produk
  const [inputQuantities, setInputQuantities] = useState({});

  // State untuk menyimpan status checkout
  const [isCheckout, setIsCheckout] = useState(false);

  // Mengambil data produk dari API (simulasi dengan useEffect)
  useEffect(() => {
    const fetchProducts = async () => {
      // Simulasi fetch data dari API
      const apiProducts = [
        { id: 1, name: 'Tank Mainan', description: 'Tank mainan', price: 100, image: 'https://awsimages.detik.net.id/community/media/visual/2023/02/06/tank-tempur-paling-mengerikan_169.jpeg?w=600&q=90' }, // Harga sebagai angka
        { id: 2, name: 'Little Boy Mainan', description: 'Senjata mainan', price: 200, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Little_boy.jpg/1200px-Little_boy.jpg'
        },
        { id: 3, name: 'Kapal Perang Mainan', description: 'Kapal Perang mainan', price: 300, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThnRIy9ByVgZW7thzgS1M1sjuesZXqGK3QX-UVPChYpA&s' 
      },
      ];
      setProducts(apiProducts);
    };

    fetchProducts();
  }, []);

  // Fungsi untuk menangani perubahan pada input jumlah
  const handleQuantityChange = (id, value) => {
    setInputQuantities({ ...inputQuantities, [id]: value });
  };

  // Fungsi untuk menambahkan produk ke keranjang
  const addToCart = (product) => {
    const quantity = inputQuantities[product.id] || 1;
    const productExists = cart.find((item) => item.id === product.id);
    if (productExists) {
      // Jika produk sudah ada, tingkatkan jumlahnya sesuai input
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      // Jika produk belum ada di keranjang, tambahkan dengan jumlah dari input
      setCart([...cart, { ...product, quantity }]);
    }
    // Reset input jumlah untuk produk tersebut
    setInputQuantities({ ...inputQuantities, [product.id]: 1 });
  };

  // Fungsi untuk menghitung total harga
  const calculateTotal = () => {
    return cart.reduce((acc, current) => acc + (current.price * current.quantity), 0);
  };

  // Fungsi untuk menangani perubahan pada input pencarian
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter produk berdasarkan kata kunci pencarian
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fungsi untuk memulai proses checkout
  const startCheckout = () => {
    setIsCheckout(true);
  };

  // Fungsi untuk menyelesaikan proses checkout
  const completeCheckout = () => {
    setIsCheckout(false);
    setCart([]); // Mengosongkan keranjang setelah checkout
  };

  return (
    <div className="min-h-screen m-0 p-0 bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-3xl">Toko Online Saya</h1>
        <input
          type="text"
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-md p-2"
        />
      </header>
      <main className="p-4">
        <HeroSectionSlide />
        <section className="products">
          <h2 className="text-2xl font-bold text-black mb-4">Produk Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                <div className="w-48 h-48 bg-gray-200 overflow-hidden">
                  <img src={product.image} alt={product.name} className="min-w-full min-h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-center">{product.name}</h3>
                <p className="text-gray-600 text-center">{product.description}</p>
                <p className="text-gray-800 font-bold text-center">${product.price}</p>
                <div className="flex items-center text-black space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={inputQuantities[product.id] || 1}
                    className="quantity-input w-16 text-center border rounded-md"
                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10))}
                  />
                  <button
                    className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                    onClick={() => addToCart({ ...product, quantity: inputQuantities[product.id] || 1 })}
                  >
                    Masukan Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="cart mt-8">
          <h2 className="text-2xl font-bold text-black mb-4">Keranjang Belanja</h2>
          <div>
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-4 p-2 bg-white rounded-lg shadow text-black">
                <span className="text-lg">{item.name}</span>
                <span className="text-lg">Jumlah: {item.quantity}</span>
                <span className="text-lg">Harga: ${item.price}</span>
                <span className="text-lg">Total: ${item.price * item.quantity}</span>
              </div>
            ))}
            {/* Menampilkan total harga */}
            <div className="total-price text-black text-right mt-4">
              <span className="text-lg font-bold">Total Harga: ${calculateTotal()}</span>
            </div>
          </div>
          {isCheckout ? (
            <div>
              {/* Tampilkan informasi checkout di sini */}
              <button onClick={completeCheckout} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300">
                Konfirmasi Pembayaran
              </button>
            </div>
          ) : (
            <button onClick={startCheckout} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
              Checkout
            </button>
          )}
        </section>
      </main>
      <footer className="bg-blue-600 text-white text-center p-3">
        <p>© 2023 Toko Online Saya. Semua hak cipta dilindungi.</p>
      </footer>
    </div>
  );
}



export default App;
