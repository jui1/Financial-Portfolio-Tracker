# Financial Portfolio Tracker

A comprehensive full-stack application for managing and tracking financial portfolios with real-time stock data, built with Spring Boot backend and React frontend.

## 🏗️ Architecture Overview

- **Backend**: Spring Boot 3.2 with PostgreSQL, JWT authentication, and Alpha Vantage API integration
- **Frontend**: React 18 + Vite with TypeScript, Tailwind CSS, and Chart.js for data visualization
- **Database**: PostgreSQL 15 for data persistence
- **Security**: JWT-based authentication with Spring Security
- **AI/ML**: Mock diversification scoring and recommendation system
- **Containerization**: Docker with multi-stage builds for production

## ✨ Features

### Core Functionality
- 🔐 User authentication and authorization
- 📊 Portfolio creation and management
- 📈 Real-time stock data integration via Alpha Vantage API
- 💰 Asset tracking with current market values
- 📊 Portfolio visualization with interactive charts
- 🤖 AI-driven diversification scoring and recommendations
- 📱 Responsive design with modern UI/UX

### Technical Features
- RESTful API design with comprehensive error handling
- JWT token-based authentication
- Real-time stock price updates
- Portfolio performance analytics
- Asset allocation visualization
- Docker containerization for easy deployment
- CI/CD pipeline with GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (recommended)

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd portfolio-tracker

# Start all services
docker-compose up -d

# The application will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
# Database: localhost:5432
```

### Manual Setup

#### Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

#### Database Setup

```bash
# Create PostgreSQL database
createdb portfolio_tracker

# Or using Docker
docker run --name portfolio-tracker-db -e POSTGRES_DB=portfolio_tracker -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
```

## 📚 API Documentation

The backend provides RESTful APIs organized into the following modules:

### Authentication (`/api/auth/`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user info

### Portfolio Management (`/api/portfolios/`)
- `POST /` - Create new portfolio
- `GET /` - Get user portfolios
- `GET /{id}` - Get portfolio details
- `POST /{id}/assets` - Add asset to portfolio
- `DELETE /{id}/assets/{assetId}` - Remove asset from portfolio

### Stock Data (`/api/stocks/`)
- `GET /quote/{symbol}` - Get stock quote
- `GET /overview/{symbol}` - Get stock overview
- `GET /timeseries/{symbol}` - Get historical data

### AI Insights (`/api/insights/`)
- `GET /diversification/{portfolioId}` - Calculate diversification score
- `GET /recommendations/{portfolioId}` - Get AI recommendations
- `GET /simulation/{portfolioId}` - Portfolio performance simulation

## 🔧 Environment Variables

### Backend Configuration

Create a `.env` file in the backend directory:

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/portfolio_tracker
DB_USERNAME=postgres
DB_PASSWORD=password
JWT_SECRET=your_jwt_secret_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```

### Frontend Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Production Environment

Copy `.env.prod.example` to `.env.prod` and update with production values:

```bash
cp .env.prod.example .env.prod
# Edit .env.prod with your production values
```

## 🐳 Docker Deployment

### Development

```bash
docker-compose up -d
```

### Production

```bash
# Set up production environment
cp .env.prod.example .env.prod
# Edit .env.prod with production values

# Deploy using the deployment script
chmod +x deploy.sh
./deploy.sh
```

### Manual Production Deployment

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🚀 Cloud Deployment

### Frontend Deployment

**Vercel:**
```bash
cd frontend
npm run build
# Deploy to Vercel
```

**Netlify:**
```bash
cd frontend
npm run build
# Deploy to Netlify
```

### Backend Deployment

**Heroku:**
```bash
# Add Heroku PostgreSQL addon
# Set environment variables in Heroku dashboard
# Deploy using Heroku CLI
```

**AWS Elastic Beanstalk:**
```bash
# Package the application
cd backend
./mvnw clean package
# Deploy using AWS CLI or console
```

**Google Cloud Platform:**
```bash
# Use Cloud Run for containerized deployment
# Set up Cloud SQL for PostgreSQL
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Integration Tests

```bash
# Start services
docker-compose up -d

# Run integration tests
# (Add your integration test commands here)
```

## 🔄 CI/CD Pipeline

The project includes a GitHub Actions workflow that:

1. **Tests**: Runs backend and frontend tests
2. **Builds**: Creates Docker images for both services
3. **Pushes**: Pushes images to Docker Hub
4. **Deploys**: Deploys to production (configurable)

### Setting up CI/CD

1. Fork the repository
2. Set up Docker Hub secrets in GitHub:
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
3. Configure deployment target in `.github/workflows/ci-cd.yml`

## 🛠️ Development

### Project Structure

```
portfolio-tracker/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── Dockerfile          # Backend Docker configuration
├── frontend/               # React frontend
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   └── Dockerfile         # Frontend Docker configuration
├── docker-compose.yml     # Development environment
├── docker-compose.prod.yml # Production environment
└── README.md              # This file
```

### Key Technologies

- **Backend**: Spring Boot, Spring Security, Spring Data JPA, PostgreSQL, JWT
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Chart.js, React Router
- **DevOps**: Docker, Docker Compose, GitHub Actions
- **APIs**: Alpha Vantage for stock data

### Code Quality

- TypeScript for type safety
- ESLint and Prettier for code formatting
- Maven for dependency management
- Comprehensive error handling
- Security best practices

## 📈 Performance Considerations

- Database indexing for optimal query performance
- Caching strategies for stock data
- Optimized Docker images with multi-stage builds
- Lazy loading for frontend components
- Efficient state management

## 🔒 Security Features

- JWT token-based authentication
- Password encryption with BCrypt
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Alpha Vantage for providing stock market data API
- Spring Boot team for the excellent framework
- React team for the powerful frontend library
- Tailwind CSS for the utility-first CSS framework
- Chart.js for the charting library

## 📞 Support

For support, email support@portfoliotracker.com or create an issue in the GitHub repository.

---

**Built with ❤️ for the financial portfolio management community**
