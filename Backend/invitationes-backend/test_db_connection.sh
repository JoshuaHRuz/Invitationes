#!/bin/bash

echo "=== Testing MySQL Connection ==="
echo "1. Checking if MySQL is running..."

# Check if MySQL process is running
if pgrep -x "mysqld" > /dev/null || pgrep -x "mariadbd" > /dev/null; then
    echo "✓ MySQL process is running"
else
    echo "✗ MySQL process is not running"
    echo "To start MySQL:"
    echo "  - macOS with Homebrew: brew services start mysql"
    echo "  - Linux: sudo systemctl start mysql"
    echo "  - Windows: net start mysql"
fi

echo ""
echo "2. Testing connection to MySQL..."

# Test connection with current credentials
mysql -u root -proot -e "SELECT 'Connection successful!' as status;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✓ Connection with root/root successful"

    echo ""
    echo "3. Checking if database 'invitationes_db' exists..."
    mysql -u root -proot -e "SHOW DATABASES LIKE 'invitationes_db';" 2>/dev/null | grep -q "invitationes_db"
    if [ $? -eq 0 ]; then
        echo "✓ Database 'invitationes_db' exists"
    else
        echo "✗ Database 'invitationes_db' does not exist"
        echo "Creating database..."
        mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS invitationes_db;" 2>/dev/null
        if [ $? -eq 0 ]; then
            echo "✓ Database 'invitationes_db' created successfully"
        else
            echo "✗ Failed to create database"
        fi
    fi
else
    echo "✗ Connection failed with root/root"
    echo ""
    echo "Possible solutions:"
    echo "1. Try connecting without password:"
    mysql -u root -e "SELECT 'Connection successful!' as status;" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "   ✓ Connection without password works"
        echo "   Update application.properties: spring.datasource.password="
    else
        echo "   ✗ Connection without password also failed"
    fi

    echo ""
    echo "2. Reset MySQL root password:"
    echo "   sudo mysql_secure_installation"
    echo ""
    echo "3. Or connect as root and set password:"
    echo "   sudo mysql -u root"
    echo "   ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';"
    echo "   FLUSH PRIVILEGES;"
fi

echo ""
echo "=== Connection Test Complete ==="
