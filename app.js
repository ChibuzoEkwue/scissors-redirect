import express from "express";
import connectDB from "./utils/db.js";
import Links from "./model/Links.js";
import path from "path";
import * as url from "url";

const app = express();
app.use(express.static("public"));

const port = process.env.PORT || 5001;

app.get("/:id", async (req, res) => {
	try {
		const link = await Links.findOne({ shortId: req.params.id });
		const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

		if (!link) {
			res.sendFile(path.join(__dirname, "/public/not-found.html"));
			return;
		}

		await Links.updateOne({ _id: link._id }, { $inc: { no_of_visits: 1 } });

		res.status(200).redirect(link.longUrl);
	} catch (error) {
		res.status(400).json({ errorMessage: error.message });
	}
});

app.listen(port, () => {
	connectDB();
	console.log(`server is running at ${port}`);
});
