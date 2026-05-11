export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  cars: number;
  image: string;
  tag?: string;
  tagColor?: string;
  slug?: string;
}

export interface ProductListProps {
  properties: Property[];
}
