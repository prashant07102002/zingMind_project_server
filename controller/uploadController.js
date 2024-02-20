const { success } = require("../Utils/response_wrapper.js");
const fs = require("fs");
const { error } = require("console");
const client = require("../dbConnet.js");
const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();

const fileUpload = async (req, res) => {
  try {
    const file = req.file;
    console.log(file);
    const filePath = file.path;
    const options = {};
    let resumedata = " ";
    pdfExtract.extract(`${filePath}`, options, async (err, data) => {
      if (err) {
        return res.send(error(500, "Failed to extract resume content"));
      }
      // console.log(data);

      const user_id = req.params.id;

      data.pages[0].content.map((obj) => {
        resumedata += obj.str + " ";
      });
      await client.update({
        index: "my_index",
        id: user_id,
        body: {
          doc: {
            resumeContent: resumedata,
          },
        },
      });
      res.send(success(200, { resumedata }));
    });
  } catch (e) {
    console.log("The error in uploading file :- ", e);
  }
};

module.exports = {
  fileUpload,
};
