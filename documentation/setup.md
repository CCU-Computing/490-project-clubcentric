React by itself is outdated. We need to use Vite, with a React variant + javascript
IN VENV
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

## PostgreSQL Setup
Install the latest version of PostgreSQL
(You may or may not be asked to set up with a username/password).
In your virtual environment for the project in VSCode, install psycopg2-binary

`pip install psycopg2-binary`
 
You can work with PostgreSQL from the terminal but I installed pgAdmin4 to make things easier. This tutorial will be using pgAdmin4.
 
Make sure Postgres is running and open pgAdmin4.
 

In the Object Explorer, right click server and select Register->Server (Name is not too important for this, I named the server localserver)

Go to the connection tab, host name/address is localhost because we are using local databases for now. Port is default. Username is what you set up PostgreSQL with, if you werent asked it would be default so either postgres or the name of your computer. Click save, it will go through if it is all correct.
 
Now to create the database. Expand the new server (click the arrow next to the name). Right click on Databases and select Create->Database

Name should be clubcentric_db for simplicity. Save that.
 
Now go down in the server to find Login/Group Roles. Right click that and select Create->Login/Group Role

Enter the name for the user you would like in General and the password in Definition. Go to Privileges and make sure Can Login, Create roles, Inherit rights from the parent roles, and Create Databases are all switched on. Save.
 
In clubcentric_db, go down to schemas and expand it. Right click on public, go to Properties. Go to Security and click the plus. Make the Grantee the new user and the privileges all.
 
 
Now in VSCode, go to the .env file in the root backend folder and it should look like this (replace with your username and password for the user you created):
 
`DEBUG=True`
`API_URL=api`

`DB_NAME=clubcentric_db`
`DB_USER=yourusernamehere`
`DB_PASSWORD=yourpasswordhere`
`DB_HOST=localhost`
`DB_PORT=5432`
 
The .env file should be gitignored and custom to each of us, like our virtual environments.
 
Now in the terminal in the backend folder, run

`python3 manage.py makemigrations`
`python3 manage.py migrate`
then run
`python3 manage.py createsuperuser`

to make an admin profile. Remember the username and password.
Now run the backend with

`python3 manage.py runserver`

and you should see in the terminal "Starting development server at http ..." click the link and it will open a page that probably has an error. Go to the url and add /api/admin to the end. Now log in with your admin profile and you will be taken to the Django Admin Site where you can see your models, confirming that your PostgreSQL database is connected to your backend.