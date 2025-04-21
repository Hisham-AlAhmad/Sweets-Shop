# 🍬 Fresh Time — Sweets Shop

A React + PHP project with secure JWT authentication, and RESTful APIs.

## **🌟 Features**

### **User Side**

### **Main Page**

- Welcoming introduction to the shop
- Chef's section featuring owner's photo and name
- Customer testimonials

### **Menu Page**

- Display all products
- Detailed view for each item
- Quantity selection and cart addition

### **Contact Page**

- User feedback form (name and message)
- Approved feedback displayed in testimonials

### **Cart Page**

- Selected items with quantities
- Delivery options
- Checkout form (name, address, phone number)
- Total price display
- WhatsApp integration for order submission to owner

### **Admin Side**

- **Category Management** – View and add categories
- **Product Management** – View and add products
- **Suppliers Management** – View and add suppliers
- **Customers View** – Access customer information
- **Feedback View** – Manage user testimonials
- **Orders View** – Monitor and track orders

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Hisham-AlAhmad/Sweets-Shop.git
```

### 2. Run these commands first!!

So that u can have the files that are needed for the project to work.

```bash
npm install
composer install
```

### 3. Make sure to have 2 terminals opened for these (3rd one is optional for yourself):

```bash
npm run dev

php -S localhost:8000
```

### 4. Create a .env file that should be like:

```bash
DB_HOST=localhost
DB_NAME=your_database
DB_USER=your_username
DB_PASS=your_password
JWT_SECRET=your_jwt_secret_here
SETUP_KEY=secure_setup_key #For the admin registration
```

---

## **🛠 Technologies Used**

- **Frontend**:
    - HTML
    - CSS
    - JavaScript (React)
    - Bootstrap
- **Backend**:
    - Pure PHP
    - Composer (Dependency Management)
    - JWT (JSON Web Tokens for authentication)
    - RESTful API Architecture (Custom PHP implementation)
- **Database**:
    - MySQL