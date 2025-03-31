import React, { useEffect, useState } from "react";
import { fetchDestinations } from "../api/apiService";

const Destinations = () => {
    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        console.log("Fetching destinations..."); // Debugging
        fetchDestinations()
            .then(data => {
                console.log("API Response:", data); // Debugging
                setDestinations(data);
            })
            .catch(error => console.error("Error fetching destinations:", error));
    }, []);

    return (
        <div>
            <h2>Popular Destinations</h2>
            <ul>
                {destinations.length > 0 ? (
                    destinations.map(dest => (
                        <li key={dest.id}>{dest.name}</li>
                    ))
                ) : (
                    <p>Loading destinations...</p>
                )}
            </ul>
        </div>
    );
};

export default Destinations;