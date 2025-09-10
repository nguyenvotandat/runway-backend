# Runway Backend - Fashion E-commerce API

Backend API cho ứng dụng thời trang Runway, được phát triển với NestJS, Prisma ORM và MySQL.

## 🚀 Tính năng

- **Authentication**: JWT-based authentication với Argon2 password hashing
- **Product Management**: CRUD operations cho sản phẩm và danh mục
- **3D Model Support**: Lưu trữ URL cho file GLB/GLTF models
- **Image Management**: Multiple images per product
- **Color Variants**: Màu sắc sản phẩm với hex codes
- **Shopping Cart**: Giỏ hàng và order management
- **Pagination**: Phân trang cho danh sách sản phẩm

## 🏗️ Kiến trúc

### 3-Layer Architecture + DDD
```
src/
├── common/                 # Cross-cutting concerns
│   ├── dto/               # Shared DTOs
│   ├── guards/            # Authentication guards
│   ├── interceptors/      # Response transformation
│   ├── filters/           # Exception handling
│   └── decorators/        # Custom decorators
│
├── config/                # Configuration management
├── infra/                 # Infrastructure layer
│   └── prisma/           # Database service
│
└── modules/               # Feature modules
    ├── auth/
    │   ├── presentation/  # Controllers
    │   ├── application/   # Services (use cases)
    │   ├── domain/        # Entities, interfaces
    │   └── infrastructure # Repository implementations
    ├── category/
    └── product/
```

## 📦 Tech Stack

- **Framework**: NestJS
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Password**: Argon2
- **Documentation**: Auto-generated API docs

## 🔧 Setup

### 1. Environment Setup
```bash
cp .env.example .env
# Edit .env với database credentials
```

### 2. Database Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

### 3. Start Development Server
```bash
npm run start:dev
```

Server sẽ chạy tại `http://localhost:3000`

## 📊 Database Schema

### Models
- **User**: Authentication và profile
- **Category**: Danh mục sản phẩm
- **Product**: Thông tin sản phẩm
- **ProductImage**: Multiple images per product
- **ProductColor**: Color variants với hex codes
- **CartItem**: Items trong giỏ hàng
- **Order & OrderItem**: Order management

### Relationships
```prisma
Product -> Category (Many-to-One)
Product -> ProductImage (One-to-Many)
Product -> ProductColor (One-to-Many)
User -> CartItem (One-to-Many)
User -> Order (One-to-Many)
Order -> OrderItem (One-to-Many)
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `POST /api/categories` - Tạo danh mục (Auth required)

### Products
- `GET /api/products` - Lấy danh sách sản phẩm (với pagination & filters)
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (Auth required)

### Query Parameters cho Products
- `page`: Số trang (default: 1)
- `limit`: Số items per page (default: 10)
- `categoryId`: Filter theo danh mục
- `brand`: Filter theo thương hiệu
- `minPrice`, `maxPrice`: Filter theo giá
- `search`: Tìm kiếm theo tên/thương hiệu

## 🔐 Security

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Argon2 for password security
- **Input Validation**: Comprehensive DTO validation
- **CORS**: Configured for frontend origins
- **Guards**: Protected routes với JWT guard

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Docker (Optional)
```bash
docker-compose up -d
```

## 📝 Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start development server
- `npm run start:debug` - Start with debugging
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run e2e tests
- `npm run lint` - Lint code

## 🗃️ Sample Data

Database được seed với sample data:
- User: `admin@runway.com` / `123456`
- 4 Categories: Áo thun, Quần jeans, Giày sneaker, Áo khoác
- Multiple products với images và colors

## 📈 Future Enhancements

- [ ] Redis caching
- [ ] File upload cho images
- [ ] Advanced search với Elasticsearch
- [ ] Real-time notifications
- [ ] Analytics và reporting
- [ ] API versioning