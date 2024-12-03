import mysql.connector
from mysql.connector import Error

def connect_to_database():
    try:
        # Establish the connection
        connection = mysql.connector.connect(
            host='localhost',         # Replace with your database host (e.g., '127.0.0.1' or IP)
            user='singssd',     # Replace with your MySQL username
            password='singssd@123', # Replace with your MySQL password
            database='sing_ssd'  # Replace with your database name
            
        )
        
        if connection.is_connected():
            print("Connected to MySQL database")
            
            # Create a cursor object to interact with the database
            cursor = connection.cursor()
            
            # Example query to fetch data
            cursor.execute("SELECT * FROM your_table_name")  # Replace with your table name
            rows = cursor.fetchall()

            # Print the data
            for row in rows:
                print(row)

    except Error as e:
        print(f"Error connecting to MySQL: {e}")

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection closed")

# Run the function
connect_to_database()
