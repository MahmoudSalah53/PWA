import { PrismaClient } from "../lib/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting to seed database...");

  const products = [
    {
      id: "1",
      name: "Wireless Headphones",
      price: 79.99,
      description:
        "Premium wireless headphones with noise cancellation and 30-hour battery life.",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      category: "Electronics",
      inStock: true,
    },
    {
      id: "2",
      name: "Smart Watch",
      price: 199.99,
      description: "Feature-rich smartwatch with health tracking and GPS.",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      category: "Electronics",
      inStock: true,
    },
    {
      id: "3",
      name: "Laptop Backpack",
      price: 49.99,
      description:
        "Durable laptop backpack with multiple compartments and USB charging port.",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      category: "Accessories",
      inStock: true,
    },
    {
      id: "4",
      name: "Mechanical Keyboard",
      price: 129.99,
      description: "RGB mechanical keyboard with cherry MX switches.",
      image:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
      category: "Electronics",
      inStock: true,
    },
    {
      id: "5",
      name: "Gaming Mouse",
      price: 59.99,
      description:
        "High-precision gaming mouse with customizable RGB lighting.",
      image:
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
      category: "Electronics",
      inStock: true,
    },
    {
      id: "6",
      name: "USB-C Hub",
      price: 39.99,
      description:
        "Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader.",
      image:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500",
      category: "Accessories",
      inStock: true,
    },
    {
      id: "7",
      name: "Wireless Charger",
      price: 29.99,
      description:
        "15W fast wireless charging pad compatible with all devices.",
      image:
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500",
      category: "Accessories",
      inStock: true,
    },
    {
      id: "8",
      name: "Bluetooth Speaker",
      price: 89.99,
      description:
        "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
      category: "Electronics",
      inStock: true,
    },
    {
      id: "9",
      name: "Phone Stand",
      price: 19.99,
      description: "Adjustable metal phone stand with charging dock support.",
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500",
      category: "Accessories",
      inStock: true,
    },
    {
      id: "10",
      name: "Monitor Stand",
      price: 79.99,
      description:
        "Ergonomic monitor stand with built-in storage and cable management.",
      image:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500",
      category: "Accessories",
      inStock: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: product,
    });
  }

  console.log(`Seeded ${products.length} products`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
