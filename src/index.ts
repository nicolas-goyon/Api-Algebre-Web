import app from './app';


const port = Number(process.env.PORT) || 3050;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Server ON, listening on port : ${port}`);
  /* eslint-enable no-console */
});
