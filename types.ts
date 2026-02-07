export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: 'Coffee' | 'Non-Coffee' | 'Pastry' | 'Meal';
  imageUrl: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  comment: string;
  avatar: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}