export interface Property {
  _id: string;
  crmId: string;
  title: string;
  description: string;
  status: 'available' | 'sold' | 'pending' | 'under_contract';
  price: number;
  propertyType: string;
  beds: number;
  baths: number;
  sqft: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  images: Array<{
    url: string;
    caption?: string;
    isPrimary?: boolean;
  }>;
  features?: Record<string, any>;
  lastSync?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  type: 'contact' | 'valuation';
  name: string;
  email: string;
  phone?: string;
  message?: string;
  address?: string;
  interest?: string;
  source?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'closed';
}

export interface Analytics {
  totalLeads: number;
  leadsThisWeek: number;
  mostViewedProperty?: string;
  sourceBreakdown: Record<string, number>;
}
