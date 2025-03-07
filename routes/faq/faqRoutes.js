const express=require('express');


const {getFAQs,createFAQs,updateFAQs,deleteFAQs}=
require('../../controllers/faq/faqController');

const router=express.Router();


router.get("/",getFAQs);
router.post("/",createFAQs);
router.put("/:id",updateFAQs);
router.delete("/:id",deleteFAQs);



module.exports = router;