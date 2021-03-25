const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const appointmentRoutes = express.Router();
const PORT = 4000;

let Appointment = require('./todo.modal');

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/appointments", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const connection = mongoose.connection;

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

appointmentRoutes.route('/').get(function(req, res) {
    Appointment.find(function(err, appointments) {
        if(err) {
            console.log(err);
        } else {
            res.json(appointments)
        }
    });
});

appointmentRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Appointment.findById(id, function(err, appointments) {
        res.json(appointments);
    });
});

appointmentRoutes.route('/add').post(function(req, res) {
    let appointment = new Appointment(req.body);
    appointment.save()
    .then(appointment => {
        res.status(200).json({'appointment': 'appointment added successfully'})
    })
    .catch(err => {
        res.status(400).send('adding new appointment failed')
    });
});



app.use('/appointments', appointmentRoutes);

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
