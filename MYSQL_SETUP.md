# MySQL Database Setup Guide

This guide will help you set up MySQL for the FlipBook application.

## 📦 Installing MySQL

### macOS (using Homebrew)
```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure installation (set root password)
mysql_secure_installation
```

### Windows
1. Download MySQL installer from [mysql.com/downloads](https://dev.mysql.com/downloads/installer/)
2. Run the installer
3. Choose "Developer Default" setup
4. Set root password during installation
5. Complete the installation

### Linux (Ubuntu/Debian)
```bash
# Install MySQL Server
sudo apt update
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure installation
sudo mysql_secure_installation
```

### Linux (CentOS/RHEL)
```bash
# Install MySQL Server
sudo yum install mysql-server

# Start MySQL service
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Get temporary root password
sudo grep 'temporary password' /var/log/mysqld.log

# Secure installation
sudo mysql_secure_installation
```

## 🔧 Configure MySQL

### 1. Login to MySQL
```bash
mysql -u root -p
```

### 2. Create Database
```sql
CREATE DATABASE flipbook CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Create User (Optional but Recommended)
```sql
-- Create a dedicated user for the application
CREATE USER 'flipbook_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON flipbook.* TO 'flipbook_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 4. Test Connection
```bash
mysql -u flipbook_user -p flipbook
```

## 🔗 Connection String Format

### Using Root User
```env
DATABASE_URL="mysql://root:your_root_password@localhost:3306/flipbook"
```

### Using Dedicated User (Recommended)
```env
DATABASE_URL="mysql://flipbook_user:your_secure_password@localhost:3306/flipbook"
```

### Remote MySQL Server
```env
DATABASE_URL="mysql://username:password@your-server.com:3306/flipbook"
```

### MySQL with SSL
```env
DATABASE_URL="mysql://username:password@localhost:3306/flipbook?sslmode=required"
```

## 📝 Configuration Options

### Connection Pool Settings (Optional)
Add to your DATABASE_URL for better performance:

```env
DATABASE_URL="mysql://user:pass@localhost:3306/flipbook?connection_limit=5&pool_timeout=10"
```

Available options:
- `connection_limit` - Maximum number of connections (default: depends on provider)
- `pool_timeout` - Connection pool timeout in seconds
- `connect_timeout` - Connection timeout in seconds
- `socket_timeout` - Socket timeout in seconds

## ✅ Verify Setup

### 1. Check MySQL is Running
```bash
# macOS/Linux
sudo systemctl status mysql
# or
brew services list

# Windows
sc query MySQL
```

### 2. Check Database Exists
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

### 3. Test with Prisma
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```

## 🐛 Troubleshooting

### Issue: "Access denied for user"
**Solution:**
```sql
-- Login as root
mysql -u root -p

-- Check user privileges
SELECT user, host FROM mysql.user;

-- Reset user password if needed
ALTER USER 'username'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### Issue: "Can't connect to MySQL server"
**Solution:**
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Check port 3306 is listening
netstat -an | grep 3306
```

### Issue: "Unknown database 'flipbook'"
**Solution:**
```sql
-- Create the database
mysql -u root -p -e "CREATE DATABASE flipbook;"
```

### Issue: "Too many connections"
**Solution:**
Edit MySQL config (`/etc/mysql/my.cnf` or `/etc/my.cnf`):
```ini
[mysqld]
max_connections = 200
```
Then restart MySQL:
```bash
sudo systemctl restart mysql
```

### Issue: "Authentication plugin error"
**Solution:**
```sql
-- For MySQL 8.0+, use mysql_native_password
ALTER USER 'username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;
```

## 🚀 Production Considerations

### For Production Deployment:

1. **Use Connection Pooling**
```env
DATABASE_URL="mysql://user:pass@host:3306/flipbook?connection_limit=10"
```

2. **Enable SSL for Remote Connections**
```env
DATABASE_URL="mysql://user:pass@host:3306/flipbook?sslmode=required"
```

3. **Regular Backups**
```bash
# Backup database
mysqldump -u root -p flipbook > flipbook_backup.sql

# Restore database
mysql -u root -p flipbook < flipbook_backup.sql
```

4. **Optimize MySQL Configuration**
Edit `/etc/mysql/my.cnf`:
```ini
[mysqld]
# InnoDB settings
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2

# Connection settings
max_connections = 200
connect_timeout = 10

# Character set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

## 🎯 Using Managed MySQL Services

### AWS RDS MySQL
```env
DATABASE_URL="mysql://admin:password@your-instance.region.rds.amazonaws.com:3306/flipbook"
```

### Google Cloud SQL
```env
DATABASE_URL="mysql://root:password@your-instance-ip:3306/flipbook"
```

### Azure Database for MySQL
```env
DATABASE_URL="mysql://username@servername:password@servername.mysql.database.azure.com:3306/flipbook?ssl=true"
```

### PlanetScale (MySQL-compatible)
```env
DATABASE_URL="mysql://username:password@host.psdb.cloud/flipbook?sslaccept=strict"
```

## 📊 MySQL vs PostgreSQL

**Why we switched to MySQL:**
- ✅ Widely available in shared hosting
- ✅ Easier to set up for beginners
- ✅ Better compatibility with various hosting providers
- ✅ Excellent for read-heavy workloads
- ✅ Strong community support

**Both work great for FlipBook!** The application code is database-agnostic thanks to Prisma ORM.

## 🔄 Migrating from PostgreSQL to MySQL

If you have existing PostgreSQL data:

1. Export PostgreSQL data:
```bash
pg_dump -U username flipbook > flipbook_pg.sql
```

2. Convert to MySQL format (manual or use tools like `pgloader`)

3. Import to MySQL:
```bash
mysql -u root -p flipbook < flipbook_mysql.sql
```

## 📚 Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Prisma MySQL Guide](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

## ✅ Quick Check

After setup, verify everything works:

```bash
# 1. Check MySQL is running
mysql -u root -p -e "SELECT VERSION();"

# 2. Check database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'flipbook';"

# 3. Test Prisma connection
npx prisma db push

# 4. Open Prisma Studio
npx prisma studio
```

If all commands succeed, you're ready to go! 🎉

---

**Need help?** Check the main SETUP.md or QUICKSTART.md documentation.

