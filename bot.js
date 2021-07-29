app.get("/", (request, response) => {
    response.sendStatus(200);
});
app.listen(process.env.PORT);

setInterval(() => {
 //   urllib.request('https://amadeusu.herokuapp.com');
}, 1000);


