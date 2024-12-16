import tkinter as tk
from tkinter import ttk
import mysql.connector
from tkinter import messagebox

# Establish connection to the MySQL database
def connect_to_db():
    try:
        conn = mysql.connector.connect(
            host='144.13.1.11', 
            user='singssd',  
            password='singssd@123',  
            database='sing_ssd'  
        )
        return conn
    except mysql.connector.Error as err:
        messagebox.showerror("Connection Error", f"Error: {err}")
        return None

# Fetch the names of all tables in the database
def get_table_names(conn):
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    cursor.close()
    return [table[0] for table in tables]

# Fetch all rows from a selected table
def get_table_data(conn, table_name):
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    cursor.close()
    return columns, rows

# Function to display data of selected table
def display_table_data(root, table_name):
    conn = connect_to_db()
    if conn:
        columns, rows = get_table_data(conn, table_name)
        window = tk.Toplevel(root)
        window.title(f"Data of {table_name}")
        
        # Create a treeview widget to display data
        tree = ttk.Treeview(window, columns=columns, show="headings")
        for col in columns:
            tree.heading(col, text=col)
            tree.column(col, anchor="w")
        tree.pack(expand=True, fill="both")
        
        # Insert rows into the treeview
        for row in rows:
            tree.insert("", "end", values=row)
        
        conn.close()

# Function to create the main window and display table buttons
def create_main_window():
    root = tk.Tk()
    root.title("Select a Table")

    conn = connect_to_db()
    if conn:
        table_names = get_table_names(conn)
        conn.close()

        # Create a button for each table
        for table in table_names:
            button = tk.Button(root, text=table, command=lambda t=table: display_table_data(root, t))
            button.pack(pady=5)

    root.mainloop()

# Start the program
if __name__ == "__main__":
    create_main_window()