const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("mock/db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

function delay(ms = 200) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
}

server.post("/api/verify", async (req, res) => {
	const { code } = req.body;
	const verificationCode = router.db
		.get("verifyCodes")
		.find({ code })
		.value();
	await delay(1000);
	if (verificationCode) {
		res.json({ valid: true, token: verificationCode.token });
	} else {
		res.json({ valid: false });
	}
});

server.get("/api/profile", async (req, res) => {
	const token = req.headers.authorization;
	const profile = router.db
		.get("users")
		.find({ token })
		.value();
	if (token && profile) {
		res.json(profile);
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
});

server.use(router);

server.listen(3000, () => {
	console.log("JSON Server is running on port 3000");
});
