import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

//middlewares intermediario o fuentes 
app.use(cors());
app.use(express.json())//permite recibir objetos JSON

// conexion a MongoDB Altlas 
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("conectado a MongoBD Altlas"))
.catch(err => console.error("Error conectado a MongoBD:". err));

const frutaSchema = new mongoose.Schema({
    "nombre": {type: String,required: true},
    "precio": {type: Number,required: true},
    "estado": {type:Boolean, required: true}
});

const Fruta = mongoose.model("fruta",frutaSchema)

//Metodos http 
//consultar todas las frutas 
//o documentos 

app.get("/frutas/", async (req, res) => {
    const frutas = await Fruta.find();
    res.json(frutas);
});

app.get("/frutas/:id",async(req, res) => {
    const fruta = await Fruta.findById(req.params.id);
    res.json(fruta)
})
//Metodo para insertar 
app.post("/frutas/", async(req, res) => {
    const nuevafruta =  new Fruta(req.body);
    await nuevafruta.save();
    res.status(201).json(nuevafruta);
});

//actualizar datos
app.put("/frutas/:id", async(req, res) => {
    const frutamodificada =  await Fruta.findByIdAndUpdate(req.params.id, req.body,{new:true});
    res.status(202).json(frutamodificada);
});

app.delete("/frutas/:id", async(req, res) => {
    await Fruta.findByIdAndDelete(req.params.id);
    res.status(204).end();

})




app.listen(process.env.PORT, () => {
    console.log(`Servidor en ejecucion http://localhost:${process.env.PORT}`)
})