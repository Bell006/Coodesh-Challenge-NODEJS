require("express-async-errors");

const cors = require("cors");
const express = require("express");

const AppError = require("./Utils/appError");
const routes = require("./Routes");

//Initializing Express
const app = express();
app.use(express.json());

//Connecting with FrontEnd
app.use(cors());

//Using routes
app.use(routes);



app.use((error, request, response, next) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    };
    
    return [response.status(500).json({
        status: "error",
        message: "Internal server error"
    }), console.log(error)]
});








const PORT = 3333;


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
