const express = require("express");
const axios = require("axios");
const router = express.Router();

const PISTON_URL = "https://emkc.org/api/piston/v2";

// Fetch runtimes
router.get("/runtimes", async (req, res) => {
  try {
    const { data } = await axios.get(`${PISTON_URL}/runtimes`);
    res.json(data);
    console.log(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch runtimes" });
  }
});

// Execute code
router.post("/", async (req, res) => {
  const { language, code, input } = req.body;

  try {
    const { data: runtimes } = await axios.get(`${PISTON_URL}/runtimes`);
    const matched = runtimes.find(
      (rt) => rt.language === language || (rt.aliases || []).includes(language)
    );

    if (!matched)
      return res.status(400).json({ error: "Language not supported" });

    const payload = {
      language: matched.language,
      version: matched.version,
      files: [{ content: code }],
      stdin: input || "",
    };

    const { data } = await axios.post(`${PISTON_URL}/execute`, payload);

    res.json({
      output: data.run.output,
      code: data.run.code,
      language: data.language,
      version: data.version,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Execution failed" });
  }
});

module.exports = router;
