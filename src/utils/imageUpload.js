const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

function multerSingleMiddleware(req, reply, done) {

  upload.single("profilePic")(req.raw, reply.raw, (err) => {
    if (err) {
      return done(err);
    }
    
    req.file = req.raw.file; 
    req.body = req.raw.body;

    done();
  });
}

module.exports = multerSingleMiddleware;
