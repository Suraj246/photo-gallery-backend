const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const userProfile = require("./model/imageModel");
const multer = require("multer");
// const upload = multer({ dest: 'uploads/' })


// const User = require("./model/authModel")
// const fileUpload = require("express-fileupload")
// const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 4000

const app = express()

app.use('/uploads', express.static('uploads'))

mongoose.connect(process.env.DATABASE)
    .then(() => { console.log("database is connected"); })
    .catch((err) => { console.log(err) })

app.use(
    cors(
        // {

        // origin: ["http://localhost:3000"],
        // methods: ["GET", "POST", "DELETE"],
        // credentials: true,
        // origin: true,
        // }
    )
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", authRoutes);

// app.use(fileUpload())

// below commented code is nothing to do with main code it is for practical purposes
//express upload code
// const staticPath = path.join(__dirname, "");
// console.log(staticPath)
// app.post('/upload', (req, res) => {
//     if (req.files === null) {
//         return res.status(404).json({ message: "file not uploaded" });
//     }
//     const file = req.files.file

//     file.mv(`${__dirname}/uploads/${file.name}`, err => {
//         // file.mv(`${__dirname}/middleware/public/uploads/${file.name}`, err => {
//         if (err) {
//             return res.status(500).json({ msg: err })
//         }
//         res.json({ fileName: file.name, filePath: `/uploads/${file.name}` })
//     })
// })


// multer code


app.get('/api/getimage', async (req, res) => {
    const _data = await userProfile.find({})
    if (_data) {
        res.status(200).json({ data: _data })
    }
})

app.get('/api/getimage/:id', async (req, res) => {
    // console.log(req.params)
    res.download(`./uploads/${req.params.id}`)
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage })



app.post("/api/image", upload.single("image"), (req, res) => {
    // console.log("post", req.file)
    const profile = req.file ? req.file.filename : null
    const img = new userProfile({ profile, title: req.file.originalname, type: req.file.mimetype })
    if (!profile) {
        res.status(404).json({ error: "failed to upload profile" })
    }
    img.save()
    // console.log("img", img)
})


//delete single items

// app.delete("/delete/:id", async (req, res) => {
//     console.log("req", req.params)
//     const result = await userProfile.findByIdAndDelete({ _id: req.params.id })
//     console.log("result", result)
// });

//delete multiple items
app.post("/delete", async (req, res) => {
    // console.log("body", req.body)
    const ids = req.body
    const result = await userProfile.deleteMany({ _id: ids })
    if (result) {
        res.status(200).json({ message: "selected products are deleted" })
    }
    else {
        res.status(404).json({ message: "failed to delete products" })
    }

});

// upload multiple images
// app.post("/api/multiple", upload.array("images"), (req, res) => {
//     const file = "name"
//     const profile = file.map((f) => f.filename)
//     const p = profile.join(" ")
//     const fileName = file.map((f) => f.originalname)
//     const type = file.map((f) => f.mimetype)
//     console.log(file)
//     // console.log("profile", profile.join(" "))
//     // console.log("filename", fileName)
//     // console.log("type", type)
//     try {
//         const img = new userProfile.findByIdAndUpdate({ _id: "64353af409ae37d92554015a" }, { $push: { images: file } })
//         if (img) {
//             res.status(200).json(img)
//         }
//         else {
//             res.status(404).json({ message: "failed to upload " })
//         }
//         img.save()
//         // // if (Array.isArray(file) && file.length > 0) {
//         // //     res.status(200).json({ message: "done", file })
//         // // }
//         // // else {
//         // //     throw new Error("Error while uploading")
//         // // }

//         console.log("img", img)
//     } catch (error) {
//         res.status(500).json({ error: "server error" })
//     }

// })


app.listen(port, () => {
    console.log('server running', port)
})
