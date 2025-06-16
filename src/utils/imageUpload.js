const multer = require("multer");
const imagekit = require("../plugins/Imagekit");

const upload = multer({ storage: multer.memoryStorage() });

function multerMiddleware(req, reply, done) {
  upload.array("images")(req.raw, reply.raw, (err) => {
    if (err) {
      done(err);
    } else {
      req.files = req.raw.files;
      done();
    }
  });
}

async function imageUploadRoutes(fastify, options) {
  fastify.post("/upload-images", { preHandler: multerMiddleware }, async (request, reply) => {
    try {
      if (!request.files || request.files.length === 0) {
        return reply.status(400).send({ error: "No images uploaded" });
      }

      const uploadResults = await Promise.all(
        request.files.map((file) =>
          imagekit.upload({
            file: file.buffer.toString("base64"),
            fileName: file.originalname,
          })
        )
      );

      return reply.send({
        message: "Images uploaded successfully",
        images: uploadResults,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return reply.status(500).send({ error: "Failed to upload images" });
    }
  });
}

module.exports = imageUploadRoutes;
