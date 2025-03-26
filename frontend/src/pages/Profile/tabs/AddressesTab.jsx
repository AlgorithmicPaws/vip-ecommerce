import React, { useState } from 'react';
import AddressCard from '../subcomponents/AddressCard';
import AddressForm from '../subcomponents/AddressForm';

const AddressesTab = ({ addresses, setAddresses }) => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    title: '',
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'España',
    phone: '',
    isDefault: false
  });
  const [editAddressData, setEditAddressData] = useState(null);

  // Manejar cambios en nueva dirección
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejar cambios en dirección que se edita
  const handleEditAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditAddressData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Guardar nueva dirección
  const handleSaveAddress = (e) => {
    e.preventDefault();
    const newId = Math.max(...addresses.map(addr => addr.id), 0) + 1;
    
    if (newAddress.isDefault) {
      // Si la nueva dirección es predeterminada, actualizar las demás
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
      setAddresses([...updatedAddresses, { ...newAddress, id: newId }]);
    } else {
      setAddresses([...addresses, { ...newAddress, id: newId }]);
    }
    
    setIsAddingAddress(false);
    setNewAddress({
      title: '',
      fullName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'España',
      phone: '',
      isDefault: false
    });
  };

  // Iniciar edición de dirección
  const handleEditAddress = (addressId) => {
    const addressToEdit = addresses.find(addr => addr.id === addressId);
    setEditAddressId(addressId);
    setEditAddressData({ ...addressToEdit });
  };

  // Guardar cambios en dirección editada
  const handleSaveEditedAddress = (e) => {
    e.preventDefault();
    
    if (editAddressData.isDefault) {
      // Si la dirección editada es predeterminada, actualizar las demás
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === editAddressId ? true : false
      }));
      setAddresses(updatedAddresses);
    } else {
      // Asegurarse de que al menos una dirección sea predeterminada
      const currentDefaultExists = addresses.some(addr => addr.id !== editAddressId && addr.isDefault);
      
      if (!currentDefaultExists && addresses.find(addr => addr.id === editAddressId).isDefault) {
        // Si estamos quitando la marca de predeterminada a la única que la tiene
        alert('Debe haber al menos una dirección predeterminada');
        return;
      }
      
      setAddresses(addresses.map(addr => 
        addr.id === editAddressId ? editAddressData : addr
      ));
    }
    
    setEditAddressId(null);
    setEditAddressData(null);
  };

  // Cancelar edición de dirección
  const handleCancelEditAddress = () => {
    setEditAddressId(null);
    setEditAddressData(null);
  };

  // Eliminar dirección
  const handleDeleteAddress = (addressId) => {
    // Verificar si es la dirección predeterminada
    const isDefault = addresses.find(addr => addr.id === addressId).isDefault;
    
    if (isDefault && addresses.length > 1) {
      alert('No se puede eliminar la dirección predeterminada. Por favor, establezca otra dirección como predeterminada primero.');
      return;
    }
    
    if (addresses.length === 1) {
      alert('Debe mantener al menos una dirección.');
      return;
    }
    
    if (window.confirm('¿Está seguro de que desea eliminar esta dirección?')) {
      setAddresses(addresses.filter(addr => addr.id !== addressId));
    }
  };

  // Establecer dirección como predeterminada
  const handleSetDefaultAddress = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
  };

  return (
    <div className="addresses-tab">
      <div className="section-header">
        <h2>Mis Direcciones</h2>
        <button 
          className="add-btn"
          onClick={() => setIsAddingAddress(true)}
        >
          Añadir Nueva
        </button>
      </div>
      
      {addresses.length > 0 ? (
        <div className="addresses-grid">
          {addresses.map(address => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => handleEditAddress(address.id)}
              onDelete={() => handleDeleteAddress(address.id)}
              onSetDefault={() => handleSetDefaultAddress(address.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📍</div>
          <h3>No hay direcciones guardadas</h3>
          <p>Añade una dirección para facilitar tus futuras compras.</p>
          <button 
            className="action-btn"
            onClick={() => setIsAddingAddress(true)}
          >
            Añadir Dirección
          </button>
        </div>
      )}
      
      {/* Formulario para añadir nueva dirección */}
      {isAddingAddress && (
        <AddressForm
          title="Añadir Nueva Dirección"
          address={newAddress}
          onChange={handleAddressChange}
          onSave={handleSaveAddress}
          onCancel={() => setIsAddingAddress(false)}
        />
      )}
      
      {/* Formulario para editar dirección */}
      {editAddressId !== null && editAddressData && (
        <AddressForm
          title="Editar Dirección"
          address={editAddressData}
          onChange={handleEditAddressChange}
          onSave={handleSaveEditedAddress}
          onCancel={handleCancelEditAddress}
        />
      )}
    </div>
  );
};

export default AddressesTab;