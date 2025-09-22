# Portfolio Tracker Deployment Guide

## 🚀 Quick Deployment

### Prerequisites
- Docker and Docker Compose installed
- Git (to clone the repository)

### 1. Environment Setup

**Update the `.env.prod` file with your production values:**

```bash
# Production Environment Variables
DB_PASSWORD=your_secure_database_password_here
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here_at_least_512_bits
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
```

### 2. Deploy with Docker Compose

```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### 3. Access Your Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8087/api
- **Health Check**: http://localhost:8087/actuator/health

## 🔧 Manual Deployment Steps

### 1. Build and Start Services

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up --build -d

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 2. Stop Services

```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Stop and remove volumes (⚠️ This will delete all data)
docker-compose -f docker-compose.prod.yml down -v
```

## 🐳 Docker Commands

### Build Individual Services

```bash
# Build backend only
docker-compose -f docker-compose.prod.yml build backend

# Build frontend only
docker-compose -f docker-compose.prod.yml build frontend

# Build database only
docker-compose -f docker-compose.prod.yml build postgres
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs

# Specific service
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs postgres
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :8087
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Database Connection Issues**
   ```bash
   # Check if PostgreSQL is running
   docker-compose -f docker-compose.prod.yml ps postgres
   
   # Check database logs
   docker-compose -f docker-compose.prod.yml logs postgres
   ```

3. **Build Failures**
   ```bash
   # Clean build
   docker-compose -f docker-compose.prod.yml down
   docker system prune -f
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

### Health Checks

```bash
# Check backend health
curl http://localhost:8087/actuator/health

# Check if services are responding
curl http://localhost:8087/api/auth/me
```

## 🔐 Security Notes

### Production Security Checklist

- [ ] Change default database password
- [ ] Use strong JWT secret (at least 512 bits)
- [ ] Get real Alpha Vantage API key
- [ ] Configure proper CORS origins
- [ ] Use HTTPS in production
- [ ] Set up proper firewall rules
- [ ] Enable database SSL
- [ ] Use environment-specific configurations

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_PASSWORD` | Database password | ✅ |
| `JWT_SECRET` | JWT signing secret | ✅ |
| `ALPHA_VANTAGE_API_KEY` | Stock data API key | ✅ |
| `CORS_ORIGINS` | Allowed CORS origins | ❌ |

## 📊 Monitoring

### Application Logs
```bash
# Follow all logs
docker-compose -f docker-compose.prod.yml logs -f

# Follow specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Resource Usage
```bash
# Check container resource usage
docker stats

# Check specific container
docker stats portfolio-tracker-backend-prod
```

## 🔄 Updates

### Deploy Updates
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up --build -d
```

### Database Migrations
The application uses `spring.jpa.hibernate.ddl-auto=validate` in production, which means:
- Schema changes need to be handled manually
- No automatic schema updates in production
- Use migration tools for schema changes

## 📝 API Documentation

### Endpoints

- **Authentication**: `/api/auth/*`
- **Portfolios**: `/api/portfolios/*`
- **Stocks**: `/api/stocks/*`
- **Insights**: `/api/insights/*`
- **Health**: `/actuator/health`

### Authentication
All API endpoints (except auth) require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose -f docker-compose.prod.yml logs`
2. Verify environment variables in `.env.prod`
3. Ensure all ports are available
4. Check Docker daemon is running

---

**Happy Deploying! 🎉**

