import mysql.connector
from mysql.connector import Error

def connect_to_database():
    try:
        connection = mysql.connector.connect(
            host='144.13.1.11',         
            user='singssd',    
            password='singssd@123', 
            database='sing_ssd'  # Replace with your database name
            
        )
        
        if connection.is_connected():
            print("Connected to MySQL database")
            
            # Create a cursor object to interact with the database
            cursor = connection.cursor()
            
            # Example query to fetch data
            cursor.execute("SELECT * FROM xxfmmfg_trc_testing_parameters_t")  # Replace with your table name
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