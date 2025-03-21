const express = require("express");
const { subscribe } = require("../../controllers/newsletter/newsletterController");

const router = express.Router();

router.post("/subscribe", subscribe);

module.exports = router;
