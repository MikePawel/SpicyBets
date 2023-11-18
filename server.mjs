import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5001;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json());

// Endpoint to handle the verification request
app.post('/verify', async (req, res) => {
  try {

    const reqBody = req.body;
    console.log(reqBody.signal)
    var currentDate = new Date();
    var timestamp = currentDate.getTime();
    var timestampInSeconds = Math.floor(timestamp / 1000);
    console.log(timestampInSeconds)

    if(reqBody.signal < timestampInSeconds-300 && reqBody.signal < timestampInSeconds){
      throw new Error('The signal is onlder than 5 minutes')
    }
    // console.log('Received verification request:', reqBody);

    // Send the verification request to the World ID API
    const worldcoinApiUrl = `https://developer.worldcoin.org/api/v1/verify/${process.env.PUBLIC_WLD_APP_ID}`;
    const verifyRes = await axios.post(worldcoinApiUrl, reqBody);

    // Process the response from the World ID API
    const wldResponse = verifyRes.data;
    if (verifyRes.status === 200) {
      // Perform backend actions based on the verified credential
      // For example, set a user as "verified" in a database
      // Your backend actions go here...

      // Respond to the frontend with a success message
      res.status(verifyRes.status).send({ code: 'success' });
    } else {
      // Return the error code and detail from the World ID /verify endpoint to our frontend
      res.status(verifyRes.status).send({
        code: wldResponse.code,
        detail: wldResponse.detail,
      });
    }
  } catch (error) {
    console.error('Error during verification:', error);
    res.status(500).send({ code: 'internal_server_error', detail: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
