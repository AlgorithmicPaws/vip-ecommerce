from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey, Enum, DateTime, DECIMAL, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Product-Category Junction Table (for many-to-many relationship)
product_categories = Table(
    'product_categories',
    Base.metadata,
    Column('product_id', Integer, ForeignKey('products.product_id', ondelete='CASCADE'), primary_key=True),
    Column('category_id', Integer, ForeignKey('categories.category_id', ondelete='CASCADE'), primary_key=True)
)

class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    address = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    seller = relationship("Seller", back_populates="user", uselist=False, cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user")

class Seller(Base):
    __tablename__ = 'sellers'

    seller_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), unique=True, nullable=False)
    business_name = Column(String(255))
    business_description = Column(Text)
    id_type = Column(String(50), nullable=False)
    number_id = Column(String(100), nullable=False)

    # Relationships
    user = relationship("User", back_populates="seller")
    products = relationship("Product", back_populates="seller", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = 'products'

    product_id = Column(Integer, primary_key=True, autoincrement=True)
    seller_id = Column(Integer, ForeignKey('sellers.seller_id', ondelete='CASCADE'), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(DECIMAL(10, 2), nullable=False)
    stock_quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    seller = relationship("Seller", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    categories = relationship("Category", secondary=product_categories, back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")

class Category(Base):
    __tablename__ = 'categories'

    category_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)

    # Relationships
    products = relationship("Product", secondary=product_categories, back_populates="categories")

class ProductImage(Base):
    __tablename__ = 'product_images'

    image_id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey('products.product_id', ondelete='CASCADE'), nullable=False)
    image_url = Column(String(255), nullable=False)
    is_primary = Column(Boolean, default=False)
    display_order = Column(Integer)

    # Relationships
    product = relationship("Product", back_populates="images")

class Order(Base):
    __tablename__ = 'orders'

    order_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    order_date = Column(DateTime, server_default=func.now())
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    shipping_address = Column(Text, nullable=False)
    payment_method = Column(String(50))
    order_status = Column(Enum('pending', 'processing', 'shipped', 'delivered', 'cancelled', name='order_status_enum'), default='pending')
    tracking_number = Column(String(100))
    notes = Column(Text)
    status_updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    status_updated_by = Column(String(100))

    # Relationships
    user = relationship("User", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = 'order_items'

    order_item_id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey('orders.order_id', ondelete='CASCADE'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.product_id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_per_unit = Column(DECIMAL(10, 2), nullable=False)
    subtotal = Column(DECIMAL(10, 2), nullable=False)

    # Relationships
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items") 