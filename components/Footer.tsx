export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TSTCommerce</h3>
            <p className="text-gray-400">
              Your trusted online shopping destination for quality products.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white">
                  Products
                </a>
              </li>
              <li>
                <a href="/cart" className="hover:text-white">
                  Cart
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="/products?category=Electronics"
                  className="hover:text-white"
                >
                  Electronics
                </a>
              </li>
              <li>
                <a
                  href="/products?category=Accessories"
                  className="hover:text-white"
                >
                  Accessories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">
              Email: support@tstcommerce.com
              <br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TSTCommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
