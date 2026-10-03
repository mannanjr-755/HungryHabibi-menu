import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed PostgreSQL");
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
});

const BRAND_NAME = "HungryHabibi";
const BRAND_SLUG = "hungryhabibi";
const LEGACY_SLUGS = ["BonPainer", "Hungry Habibi", "hungry-habibi"];
const PIZZA_SLUG = "pizza-palace";
const BRAND_TABLES = 12;

async function main() {
  console.log("Seeding HungryHabibi data (insert-only, safe for shared databases)...");

  const passwordHash = await bcrypt.hash("password123", 10);

  // Prefer migrating an existing BonPainer / legacy restaurant so real menu data is kept.
  let brand = await prisma.restaurant.findUnique({ where: { slug: BRAND_SLUG } });
  if (!brand) {
    for (const legacySlug of LEGACY_SLUGS) {
      const legacy = await prisma.restaurant.findUnique({ where: { slug: legacySlug } });
      if (legacy) {
        brand = await prisma.restaurant.update({
          where: { id: legacy.id },
          data: {
            name: BRAND_NAME,
            slug: BRAND_SLUG,
            logo: "/logo.png",
            description:
              legacy.description ??
              "Delicious food, great mood! Explore our chef's special dishes made just for you.",
          },
        });
        console.log(`Migrated restaurant slug "${legacySlug}" → "${BRAND_SLUG}".`);
        break;
      }
    }
  }

  if (!brand) {
    brand = await prisma.restaurant.create({
      data: {
        name: BRAND_NAME,
        slug: BRAND_SLUG,
        logo: "/logo.png",
        coverImage:
          "https://images.unsplash.com/photo-1558030006-450675393462?w=1400&h=700&fit=crop",
        description: "Delicious food, great mood! Explore our chef's special dishes made just for you.",
        phone: "+92 300 1234567",
        whatsapp: "+923001234567",
        address: "12 Gourmet Avenue, City Center",
        googleMapsUrl: "https://maps.google.com",
        openingHours: JSON.stringify({
          mon: "11:00–23:00",
          tue: "11:00–23:00",
          wed: "11:00–23:00",
          thu: "11:00–23:00",
          fri: "11:00–00:00",
          sat: "11:00–00:00",
          sun: "12:00–22:00",
        }),
        socialLinks: JSON.stringify({
          instagram: "https://instagram.com",
          facebook: "https://facebook.com",
        }),
      },
    });
  } else {
    brand = await prisma.restaurant.update({
      where: { id: brand.id },
      data: {
        name: BRAND_NAME,
        logo: "/logo.png",
      },
    });
  }

  const adminEmail = "admin@hungryhabibi.com";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { restaurantId: brand.id, active: true, passwordHash, name: "Admin", role: "ADMIN" },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Admin",
      role: "ADMIN",
      restaurantId: brand.id,
    },
  });

  // Clean up legacy admin emails if present
  for (const legacyEmail of ["admin@bonpainer.com", "admin@BonPainer.com", "admin@hungry habibi.com"]) {
    const legacyAdmin = await prisma.user.findUnique({ where: { email: legacyEmail } });
    if (legacyAdmin && legacyAdmin.email !== adminEmail) {
      await prisma.user.delete({ where: { id: legacyAdmin.id } });
    }
  }

  for (let n = 1; n <= BRAND_TABLES; n++) {
    const existing = await prisma.table.findFirst({
      where: { restaurantId: brand.id, tableNumber: n },
      select: { id: true },
    });
    if (existing) {
      await prisma.table.update({
        where: { id: existing.id },
        data: { active: true },
      });
      continue;
    }
    await prisma.table.create({
      data: {
        restaurantId: brand.id,
        tableNumber: n,
        uniqueCode: `hungryhabibi-t${n}-${Math.random().toString(36).slice(2, 8)}`,
        active: true,
      },
    });
  }

  const existingCategories = await prisma.menuCategory.count({
    where: { restaurantId: brand.id },
  });

  const requestedMenu = [
    {
      name: "Chicken Karahi",
      items: [
        "Chicken Peshawari Karahi",
        "Chicken Shinwari Karahi",
        "Chicken Brown Karahi",
        "Chicken Balochi Karahi",
        "Chicken White Karahi",
      ],
    },
    {
      name: "Handi",
      items: ["Chicken Mughlai Handi", "Chicken Paneer Reshmi"],
    },
    { name: "Tandoor", items: ["Farmaishi Chapati", "Paratha"] },
    {
      name: "Chicken Biryani",
      items: [
        "Chicken Biryani (Single)",
        "Chicken Biryani (Double)",
        "Tikka Biryani (Single)",
        "Tikka Biryani (Double)",
        "Sada Biryani",
      ],
    },
    {
      name: "Chicken Kabab",
      items: ["Chicken Turkish Kabab", "Chicken Gola Kabab", "Chicken Reshmi Kabab"],
    },
    {
      name: "Chicken B.B.Q",
      items: [
        "Chicken Tikka (Leg)",
        "Chicken Tikka (Chest)",
        "Behari Tikka (Leg)",
        "Behari Tikka (Chest)",
        "Malai Tikka (Leg)",
        "Malai Tikka (Chest)",
        "Special Boti",
        "Chicken Boti",
        "Chicken Behari Boti",
        "Chicken Malai Boti",
        "Chicken Afghani Boti",
      ],
    },
    {
      name: "Chicken Rolls",
      items: ["Chicken Chatni Roll", "Chicken Bihari Roll", "Chicken Malai Roll", "Chicken Kabab Roll"],
    },
    {
      name: "Beef Biryani",
      items: [
        "Beef Biryani (Single)",
        "Beef Biryani (Double)",
        "Beef White Biryani (Single)",
        "Beef White Biryani (Double)",
      ],
    },
    {
      name: "Beef Kabab",
      items: ["Beef Seekh Kabab", "Beef Behari Kabab", "Beef Gola Kabab"],
    },
    { name: "Beef B.B.Q", items: ["Beef Boti", "Beef Behari Boti", "Beef Afghani Boti"] },
    { name: "Beef Roll", items: ["Beef Chatni Roll", "Beef Bihari Roll", "Beef Kabab Roll"] },
    { name: "Beef Fry Kabab", items: ["Beef Fry Kabab"] },
    { name: "Beverages & Sides", items: ["Can", "Small Water", "Large Water", "Raita", "Salad"] },
  ];

  // Only seed menu when empty — never wipe existing production categories/items.
  if (existingCategories === 0) {
    for (const [sortOrder, categoryData] of requestedMenu.entries()) {
      const category = await prisma.menuCategory.create({
        data: { restaurantId: brand.id, name: categoryData.name, sortOrder },
      });
      await prisma.menuItem.createMany({
        data: categoryData.items.map((name, index) => ({
          restaurantId: brand.id,
          categoryId: category.id,
          name,
          // Placeholder prices for a fresh seed — CRM/admin can edit later.
          // Beverages & Sides use lower defaults.
          price:
            categoryData.name === "Beverages & Sides"
              ? [120, 50, 80, 100, 80][index] ?? 100
              : categoryData.name === "Tandoor"
                ? [30, 60][index] ?? 50
                : 450 + index * 50,
          available: true,
        })),
      });
    }
    console.log(`Inserted HungryHabibi menu with ${requestedMenu.length} categories.`);
  } else {
    console.log(`HungryHabibi already has ${existingCategories} menu categories — left untouched.`);
  }

  // Backfill placeholder prices if items were previously seeded at 0.
  const zeroPriceItems = await prisma.menuItem.findMany({
    where: { restaurantId: brand.id, price: 0 },
    include: { category: { select: { name: true } } },
    orderBy: { name: "asc" },
  });
  if (zeroPriceItems.length > 0) {
    let i = 0;
    for (const item of zeroPriceItems) {
      const categoryName = item.category?.name ?? "";
      const price =
        categoryName === "Beverages & Sides"
          ? 100
          : categoryName === "Tandoor"
            ? 50
            : 450 + (i % 8) * 50;
      await prisma.menuItem.update({ where: { id: item.id }, data: { price } });
      i += 1;
    }
    console.log(`Updated ${zeroPriceItems.length} items that had price 0.`);
  }

  const pizza = await prisma.restaurant.upsert({
    where: { slug: PIZZA_SLUG },
    update: {},
    create: {
      name: "Pizza Palace",
      slug: PIZZA_SLUG,
      description: "Wood-fired pizzas",
      phone: "+92 300 7654321",
      logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=600&fit=crop",
    },
  });
  await prisma.user.upsert({
    where: { email: "staff@pizzapalace.com" },
    update: { restaurantId: pizza.id, active: true, passwordHash },
    create: {
      email: "staff@pizzapalace.com",
      passwordHash,
      name: "Pizza Admin",
      restaurantId: pizza.id,
    },
  });
  const pizzaTable = await prisma.table.findFirst({
    where: { restaurantId: pizza.id, tableNumber: 1 },
    select: { id: true },
  });
  if (!pizzaTable) {
    await prisma.table.create({
      data: {
        restaurantId: pizza.id,
        tableNumber: 1,
        uniqueCode: "pizza-palace-t1-demo",
        active: true,
      },
    });
  }

  console.log("Done!");
  console.log("Customer menu: /r/hungryhabibi/t/12");
  console.log("Admin login: admin@hungryhabibi.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
