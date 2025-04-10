import React, { useState, useEffect } from 'react';
import ProductImage from '../subcomponents/ProductImage';

const ProductForm = ({ product, onSave, onCancel, categories, title }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    image: null
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        price: typeof product.price === 'number' ? product.price.toString() : product.price,
        stock: typeof product.stock === 'number' ? product.stock.toString() : product.stock,
        category: product.category,
        description: product.description || '',
        image: product.image
      });
    }
  }, [product]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock is required';
    } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle image change
  const handleImageChange = (image) => {
    setFormData(prev => ({
      ...prev,
      image
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const submittedData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };
      
      await onSave(submittedData);
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to save product. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button 
            className="close-modal"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>
        
        {errors.submit && (
          <div className="error-message" style={{ margin: '10px 20px 0' }}>
            {errors.submit}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={errors.name ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={errors.category ? 'error' : ''}
                disabled={isSubmitting}
              >
                <option value="">Select category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <div className="error-text">{errors.category}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className={errors.price ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.price && <div className="error-text">{errors.price}</div>}
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className={errors.stock ? 'error' : ''}
                disabled={isSubmitting}
              />
              {errors.stock && <div className="error-text">{errors.stock}</div>}
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              disabled={isSubmitting}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Product Image</label>
            <ProductImage 
              image={formData.image}
              onChange={handleImageChange}
              category={formData.category || 'uncategorized'}
              productId={formData.id || 'new'}
              disabled={isSubmitting}
            />
          </div>
          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;