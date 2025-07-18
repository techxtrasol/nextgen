# NextGen Welfare Platform

A comprehensive financial welfare management system built with Laravel 12 for financial groups, enabling milestone tracking, money market fund management, and member lending services.

## 🏦 Overview

NextGen Welfare Platform is a modern financial management system designed for welfare groups within financial institutions. The platform enables members to contribute to a collective welfare fund, track savings in CIC money market funds, and access borrowing facilities based on their contribution history.

## 💼 Business Model

### Core Features
- **Member Savings Management**: Track individual member contributions to the welfare fund
- **CIC Money Market Integration**: Manage collective savings in CIC money market funds (9.75% monthly interest)
- **Milestone Tracking**: Document and track group financial milestones
- **Lending Services**: Enable members to borrow against their savings
- **Interest Distribution**: Automatic distribution of CIC returns among six members

### Financial Structure
- **Base Members**: 6 core members
- **CIC Investment**: Group funds invested in CIC money market (9.75% monthly returns)
- **Interest Distribution**: Monthly CIC returns divided equally among 6 members
- **Borrowing Limit**: Members can borrow up to their total savings amount

## 📊 Lending Terms & Interest Rates

| Duration | Interest Rate | Example (KES 10,000) |
|----------|---------------|---------------------|
| 1 Week   | 5%           | Repay KES 10,500    |
| 2 Weeks  | 10%          | Repay KES 11,000    |
| 3 Weeks  | 15%          | Repay KES 11,500    |
| 4 Weeks  | 20%          | Repay KES 12,000    |

### Penalty Structure
- **Late Payment**: Additional charges apply for overdue payments
- **Default Warning**: Progressive warning system for non-compliance
- **Account Restrictions**: Borrowing privileges may be suspended for repeated defaults

## 🛠 Technical Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React with Inertia.js
- **Database**: MySQL/PostgreSQL
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Package Manager**: Composer & npm

## 📋 System Requirements

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MySQL 8.0+ or PostgreSQL 13+
- Redis (for caching and queues)

## 🚀 Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd nextgen-welfare-platform
```

### 2. Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 3. Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Database Setup
```bash
# Create database
touch database/database.sqlite

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed
```

### 5. Build Assets
```bash
# Development build
npm run dev

# Production build
npm run build
```

### 6. Start Development Server
```bash
# Start all services (server, queue, logs, vite)
composer run dev

# Or start individual services
php artisan serve
```

## 🏗 Database Architecture

### Core Models

#### User Model
```php
- id (Primary Key)
- name (Full Name)
- email (Unique)
- role (admin, member, viewer)
- phone_number
- national_id
- joined_at (Date member joined the platform)
- status (active, suspended, inactive)
- created_at
- updated_at
```

#### Member Contribution Model
```php
- id (Primary Key)
- user_id (Foreign Key to User)
- amount (Contribution Amount)
- contribution_date
- description
- transaction_reference
- status (pending, completed, failed)
- created_at
- updated_at
```

#### Loan Model
```php
- id (Primary Key)
- user_id (Foreign Key to User)
- loan_amount
- interest_rate (5%, 10%, 15%, 20%)
- duration_weeks (1-4 weeks)
- total_repayment
- loan_date
- due_date
- status (pending, approved, active, completed, defaulted)
- repayment_date
- created_at
- updated_at
```

#### CIC Investment Model
```php
- id (Primary Key)
- investment_amount
- investment_date
- maturity_date
- interest_rate (9.75%)
- monthly_returns
- status (active, matured, withdrawn)
- created_at
- updated_at
```

#### Interest Distribution Model
```php
- id (Primary Key)
- cic_investment_id (Foreign Key)
- user_id (Foreign Key to User)
- distribution_amount
- distribution_date
- month_year
- status (pending, distributed)
- created_at
- updated_at
```

#### Milestone Model
```php
- id (Primary Key)
- title
- description
- target_amount
- achieved_amount
- target_date
- achieved_date
- status (pending, in_progress, achieved)
- created_at
- updated_at
```

#### Penalty Model
```php
- id (Primary Key)
- user_id (Foreign Key to User)
- loan_id (Foreign Key to Loan)
- penalty_amount
- penalty_reason
- penalty_date
- status (pending, paid)
- created_at
- updated_at
```

## 🔐 User Roles & Permissions

### Admin
- Full system access
- User management
- Loan approval/rejection
- Financial reporting
- Milestone management
- CIC investment oversight

### Member
- View personal dashboard
- Submit loan applications
- View contribution history
- Check interest distributions
- Update personal profile

### Viewer
- Read-only access to reports
- View group milestones
- Access financial summaries

## 📈 Key Features

### Member Dashboard
- Personal savings summary
- Borrowing capacity calculator
- Loan history and status
- Interest distribution history
- Contribution tracking

### Admin Dashboard
- Group financial overview
- Pending loan applications
- CIC investment performance
- Member management
- Milestone progress tracking

### Financial Management
- Automated interest calculations
- CIC return distributions
- Penalty tracking
- Payment reminders
- Financial reporting

### Loan Management
- Application workflow
- Approval process
- Repayment tracking
- Default management
- Interest calculation

## 📊 Reporting Features

### Financial Reports
- Monthly contribution summaries
- CIC investment performance
- Loan portfolio analysis
- Interest distribution reports
- Member balance statements

### Milestone Tracking
- Progress visualization
- Target vs achievement analysis
- Historical milestone data
- Future projection reports

## 🔄 API Endpoints

### Authentication
- `POST /login` - User authentication
- `POST /logout` - User logout
- `GET /profile` - User profile information

### Contributions
- `GET /contributions` - List member contributions
- `POST /contributions` - Record new contribution
- `GET /contributions/{id}` - Get specific contribution

### Loans
- `GET /loans` - List loans (filtered by user role)
- `POST /loans` - Submit loan application
- `PUT /loans/{id}/approve` - Approve loan (admin only)
- `PUT /loans/{id}/repay` - Record loan repayment

### CIC Investments
- `GET /cic-investments` - List CIC investments
- `POST /cic-investments` - Record new investment
- `GET /cic-returns` - Calculate and distribute returns

## 🛡 Security Features

- CSRF protection
- SQL injection prevention
- XSS protection
- Rate limiting
- Authentication middleware
- Role-based access control
- Secure password hashing
- Data validation and sanitization

## 📱 Mobile Responsiveness

The platform is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Progressive Web App (PWA) capabilities

## 🧪 Testing

```bash
# Run all tests
composer test

# Run specific test suites
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit

# Run with coverage
php artisan test --coverage
```

## 📚 Development Guidelines

### Code Standards
- Follow PSR-12 coding standards
- Use meaningful variable and function names
- Write comprehensive tests for new features
- Document complex business logic
- Follow Laravel best practices

### Database Guidelines
- Use migrations for schema changes
- Implement proper foreign key relationships
- Add database indexes for performance
- Use model factories for testing
- Implement soft deletes where appropriate

## 🚀 Deployment

### Production Setup
```bash
# Optimize for production
composer install --optimize-autoloader --no-dev
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment Variables
```env
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nextgen_welfare
DB_USERNAME=your_username
DB_PASSWORD=your_password

# CIC API Configuration (if applicable)
CIC_API_URL=https://api.cic.co.ke
CIC_API_KEY=your_api_key

# SMS/Email Configuration
MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
```

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- Database backups
- Security updates
- Performance monitoring
- Log file management
- CIC return reconciliation

### Support Channels
- Technical Documentation: `/docs`
- Issue Tracking: GitHub Issues
- Email Support: support@nextgen-welfare.com

## 🔮 Future Enhancements

### Planned Features
- Mobile application
- SMS notifications
- Automated CIC API integration
- Advanced financial analytics
- Multi-currency support
- Blockchain transaction recording

### Integration Opportunities
- M-Pesa payment integration
- Bank API connections
- Credit scoring systems
- Financial advisory services

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 👥 Team

- **Project Manager**: [Name]
- **Lead Developer**: [Name]
- **Financial Analyst**: [Name]
- **QA Engineer**: [Name]

---

**NextGen Welfare Platform** - Empowering financial groups through technology and innovation.

*For technical support or business inquiries, please contact our support team.*