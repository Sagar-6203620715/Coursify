// RAG-style AI recommendation: fetches live course data from MongoDB,
// injects it as context into Gemini prompt, returns top 3 ranked results
const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

router.post("/recommend", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Missing or invalid query" });
    }

    const rawCourses = await Course.find()
      .select("name price rating duration affiliate_link domain section")
      .populate("domain", "name")
      .populate("section", "name")
      .lean();

    const courses = rawCourses.map((c) => ({
      name: c.name,
      price: c.price,
      rating: c.rating,
      duration: c.duration,
      domainName: c.domain?.name,
      sectionName: c.section?.name,
      affiliate_link: c.affiliate_link,
    }));

    const prompt = `You are a smart course advisor for Coursify, an Indian course comparison platform.
Respond ONLY with a valid JSON array of exactly 3 courses. No markdown, no explanation, no code blocks.
Format:
[{"name":"...","reason":"...","price":0,"rating":0.0,"affiliate_link":"..."}]

Course catalog:
${JSON.stringify(courses)}

User query: "${query}"`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "AI service unavailable" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Gemini API error:", response.status, errBody);
      if (response.status === 429) {
        return res.status(429).json({
          message: "Too many requests. Please try again in a moment.",
        });
      }
      return res.status(500).json({ message: "AI service unavailable" });
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      console.error("Gemini empty text. Full response:", JSON.stringify(data).slice(0, 500));
      return res.status(500).json({ message: "AI service unavailable" });
    }

    // Strip markdown code blocks if present (e.g. ```json ... ```)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) text = jsonMatch[1].trim();

    let recommendations;
    try {
      recommendations = JSON.parse(text);
      if (!Array.isArray(recommendations)) {
        recommendations = [recommendations];
      }
    } catch (parseErr) {
      console.error("Gemini JSON parse error:", parseErr.message);
      console.error("Raw text (first 400 chars):", text.slice(0, 400));
      return res.status(500).json({ message: "AI service unavailable" });
    }

    res.json({ recommendations });
  } catch (err) {
    console.error("AI recommend error:", err);
    res.status(500).json({ message: "AI service unavailable" });
  }
});

module.exports = router;
