const express = require("express");
const { google } = require("googleapis");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index")
});

app.post("/", async (req, res) => {

    const { request, name } = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: "key.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",

    });


    const client = await auth.getClient();

    const googleSheet = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "130pNn28WzNOmbr9nSMxAMfPalnngC0xdkJKaX78cwNM";

    const metaData = await googleSheet.spreadsheets.get({
        auth,
        spreadsheetId,

    });

    const getRows = await googleSheet.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "sheet1",

    });

    await googleSheet.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "sheet1",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                [ request, name],
            ],
        }
    })

    res.redirect("https://docs.google.com/spreadsheets/d/130pNn28WzNOmbr9nSMxAMfPalnngC0xdkJKaX78cwNM/edit?usp=sharing");

});

app.listen(1337, (req, res) => console.log("running on 1337"));