// src/pages/ProductCatalog/subcomponents/SellerFilter.jsx
import React from 'react';

const SellerFilter = ({
    sellers = [],          // Expects array of { seller_id, business_name }
    selectedSellers = [],  // Expects array of selected seller IDs [1, 5, ...]
    onSellerChange         // Function to call with updated array of selected IDs
}) => {

  // Handler for when a seller checkbox is toggled
  const handleSellerCheckboxChange = (sellerId) => {
    // Convert the clicked sellerId to a string for consistent checking within the Set
    const sellerIdStr = String(sellerId);
    // Create a Set of currently selected seller IDs (as strings) for efficient add/delete
    const currentSelectedSet = new Set(selectedSellers.map(String));

    // Toggle selection
    if (currentSelectedSet.has(sellerIdStr)) {
      currentSelectedSet.delete(sellerIdStr); // Remove if already selected
    } else {
      currentSelectedSet.add(sellerIdStr); // Add if not selected
    }

    // Convert the Set back to an array of IDs.
    // It's important to convert back to the original data type (likely number)
    // if the parent component (ProductCatalog) expects numbers.
    const newSelection = Array.from(currentSelectedSet).map(idStr => {
        // Find the original seller object to potentially get the original ID type
        const originalSeller = sellers.find(s => String(s.seller_id) === idStr);
        // Return the ID in its original type (number) if possible, otherwise keep as string
        return originalSeller ? originalSeller.seller_id : parseInt(idStr, 10); // Assuming IDs are numbers
    }).filter(id => !isNaN(id)); // Ensure only valid numbers are included if parsing

    // Call the parent handler with the updated array of selected IDs
    if (onSellerChange) {
      onSellerChange(newSelection);
    }
  };

  return (
    <div className="filter-section">
      <h3>Vendedores</h3>
      <div className="seller-filter">
        {/* Display message if no sellers are available */}
        {sellers.length === 0 && <p>No hay vendedores disponibles.</p>}

        {/* Map through the available sellers to create checkboxes */}
        {sellers.map((seller) => (
          <label key={seller.seller_id} className="checkbox-label">
            <input
              type="checkbox"
              // Determine if this seller's ID is in the selectedSellers array
              checked={selectedSellers.map(String).includes(String(seller.seller_id))}
              // Call the handler when the checkbox state changes
              onChange={() => handleSellerCheckboxChange(seller.seller_id)}
              // Use seller_id as the value (useful for forms, though not strictly needed here)
              value={seller.seller_id}
            />
            {/* Display the seller's business name, fallback to ID if name is missing */}
            {seller.business_name || `Vendedor #${seller.seller_id}`}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SellerFilter;