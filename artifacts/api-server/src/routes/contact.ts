import { Router } from "express";

const router = Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message, lang } = req.body as {
      name?: string; email?: string; message?: string; lang?: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      res.status(400).json({ error: "Name, email, and message are required." });
      return;
    }

    req.log.info({ name, email, lang }, "Contact form submission");
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
