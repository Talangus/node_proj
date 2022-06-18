# Task managment system - Backend project REST API
This project was built in Node.js as part of programing languages mini project in BGU, by Tal Langus and Tsipi Barel. 

The project is using the following tools in the API server implementation:
* express
* SQLite


#### Prerequisites:
*Node.js* (v16 or higher)

*npm* (v8 or higher) 

### Running the project:
1. Open terminal in the root project directory
2. Run `npm install` to install the project dependencies
3. Run the project by running `npm start`

The system is ready to accept requets on port 3000.

### Project Description: 
This REST API manages tasks objects (chores or homework) assigned to different people.
It uses Node.js and express frameworks with SQLite embedded database.
Express initializes the server in app.js, but all of the logic is implemented in the routers.
The routers are express's way to abstract the code that needs to run under separate url's.
Each router has different block for different action (POST, GET, etc.) under different url.
We import the DB instance and use its methods to perform all the needed tasks.
There is an extensive use in JS promise design pattern, as all API and DB calls are asynchronous.


#### Database- 
We used sqlite as our embedded database.
It uses a "promise-like" interface - each call gets the sql query and 2 callback (success callback that gets the response 
or fail callback that gets the error).
We created a Wrapper function (myDB) that gets the query type (run, get or all) and params, and sends it to the DB.
Our DB initializes with 4 tables: Person table, tasks table (task - type mapping), Homework table and Chores table.
Each way of dividing the data between tables has its trade-off, our method saves space (instead of having both types in same table with null values), makes it easier for future changes on specific types and saves time when trying to find specific tasks (instead of querying both tables) to some degree.
Following the initialization we create a JS LocalDatabase instance that point to the local sqlite file and export it (a singleton).
All the DB methods are implemented inside that class and are available for the routers.
All DB requets return promises, hence the LocalDatabase methods also return promises with the requiered data (for example getAllPersonDetails() returns a promise - when it fulfils the parameter is the PersonDetails array).


#### Requests and Responses-
When the server gets HTTP request from the browser, 
the suitable router (people for api/people or tasks for api/tasks) is getting it, and recognizes the request type (GET/POST/PATCH/DELETE..) using express functionality. 
The function that fits to the request's endpoint and its type is executed and return a response to the client. 
The folloing scheme describes the flow of a request in the server: 

<img width="1051" alt="Screen Shot 2022-06-18 at 21 08 59" src="https://user-images.githubusercontent.com/80578086/174451202-e15bdea3-6105-45d6-9d05-3eb6aee415d8.png">


