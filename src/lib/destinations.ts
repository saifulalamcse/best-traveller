import maldives from "@/assets/dest-maldives.jpg";
import alps from "@/assets/dest-alps.jpg";
import santorini from "@/assets/dest-santorini.jpg";
import kyoto from "@/assets/dest-kyoto.jpg";
import sahara from "@/assets/dest-sahara.jpg";
import iceland from "@/assets/dest-iceland.jpg";

export type Destination = {
  id: string;
  title: string;
  location: string;
  mood: string;
  category: "mood" | "trending" | "top";
  price: string;
  rating: number;
  image: string;
};

export const destinations: Destination[] = [
  { id: "maldives", title: "Weekend Relaxation", location: "Maldives", mood: "Relaxed", category: "mood", price: "$320/night", rating: 4.9, image: maldives },
  { id: "alps", title: "Adventure Awaits", location: "Swiss Alps", mood: "Excited", category: "mood", price: "$210/night", rating: 4.8, image: alps },
  { id: "santorini", title: "Cliffside Sunsets", location: "Santorini, Greece", mood: "Dreamy", category: "trending", price: "$285/night", rating: 4.9, image: santorini },
  { id: "kyoto", title: "Quiet Mornings", location: "Kyoto, Japan", mood: "Serene", category: "trending", price: "$190/night", rating: 4.7, image: kyoto },
  { id: "sahara", title: "Desert Glamping", location: "Sahara, Morocco", mood: "Wild", category: "top", price: "$240/night", rating: 4.8, image: sahara },
  { id: "iceland", title: "Chasing Auroras", location: "Reykjavík, Iceland", mood: "Mystic", category: "top", price: "$275/night", rating: 4.9, image: iceland },
];