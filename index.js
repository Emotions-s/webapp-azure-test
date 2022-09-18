const express = require("express");
const { google } = require("googleapis");

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`sever running on port ${PORT}`));

app.set("view engine", "ejs");
app.use('/css', express.static(__dirname + '/public/css'))

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

    await googleSheet.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "sheet1",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                [name, request],
            ],
        }
    })

    res.redirect("/");

});