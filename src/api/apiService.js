import apiClient from "./apiClient";

export const fetchDestinations = async () => {
    try {
        const response = await apiClient.get("/destinations");
        return response.data;
    } catch (error) {
        console.error("Error fetching destinations:", error);
        throw error;
    }
};
