
import { fetchApi } from '@/utils/apiHelper';

export interface Seat {
  SeatNumber: string;
  SeatType: string;
  Status: "Available" | "Booked" | "Selected";
  price: number;
}

export interface SeatMapResponse {
  transportationId: string;
  totalSeats: number;
  seats: Seat[];
}

export const seatService = {
  getSeats: async (transportationId: number): Promise<SeatMapResponse> => {
    try {
      const url = `http://localhost:3000/api/transportation/${transportationId}/seats`;
      console.log('Fetching seats for transportation:', transportationId);
      
      const response = await fetchApi<SeatMapResponse>(url);
      return response;
    } catch (error) {
      console.error('Error fetching seats:', error);
      // Return an empty seat map to avoid undefined errors
      return { transportationId: transportationId.toString(), totalSeats: 0, seats: [] };
    }
  }
};
