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

#### Database- 
There are ..... **tal** 

#### Requests and Responses-
When the server gets HTTP request from the browser, 

the suitable router (people for api/people or tasks for api/tasks) is getting it, and recognizes the request type (GET/POST/PATCH/DELETE..) using express functionality. 
The function that fits to the request's endpoint and its type is executed and return a response to the client. 
The folloing scheme describes the flow of a request in the server: 

<img width="1051" alt="Screen Shot 2022-06-18 at 21 08 59" src="https://user-images.githubusercontent.com/80578086/174451202-e15bdea3-6105-45d6-9d05-3eb6aee415d8.png">


