import { IMAGES } from "./images"

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Obsidian Bomber Jacket",
    price: 580,
    originalPrice: 720,
    image: IMAGES[3],
    category: "Outerwear",
  },
  {
    id: "2",
    name: "Merino Wool Turtleneck",
    price: 340,
    image: IMAGES[4],
    category: "Tops",
  },
  {
    id: "3",
    name: "Structured Overcoat",
    price: 890,
    image: IMAGES[5],
    category: "Outerwear",
  },
  {
    id: "4",
    name: "Canvas Field Jacket",
    price: 460,
    originalPrice: 520,
    image: IMAGES[6],
    category: "Outerwear",
  },
  {
    id: "5",
    name: "Red Runner Sneakers",
    price: 320,
    image: IMAGES[7],
    category: "Footwear",
  },
  {
    id: "6",
    name: "Leather Crossbody",
    price: 420,
    image: IMAGES[8],
    category: "Accessories",
  },
  {
    id: "7",
    name: "Cashmere Scarf",
    price: 180,
    image: IMAGES[9],
    category: "Accessories",
  },
  {
    id: "8",
    name: "Tactical Backpack",
    price: 280,
    image: IMAGES[10],
    category: "Accessories",
  },
]