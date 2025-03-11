export interface AddOn {
    id: string;
    name: string;
    price: number;
    status: 'Available' | 'In Use' | 'Returned';
    rfidTag?: string;
} 