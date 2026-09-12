export interface AppInfo {
  slug: string;
  name: string;
  description: string;
  color: string;
}

export const apps: AppInfo[] = [
  {
    slug: "shoppingcart",
    name: "Shopping Cart",
    description: "Carrito de compras para clientes",
    color: "#2563eb",
  },
  {
    slug: "backoffice",
    name: "Backoffice",
    description: "Panel de administración interno",
    color: "#7c3aed",
  },
  {
    slug: "catalogos",
    name: "Catálogos",
    description: "Gestión de catálogos y productos",
    color: "#059669",
  },
];

export function getApp(slug: string): AppInfo | undefined {
  return apps.find((app) => app.slug === slug);
}
