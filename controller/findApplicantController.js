const { success } = require("../Utils/response_wrapper");
const client = require("../dbConnet");

const findApplicant = async (req, res) => {
  try {
    let skills = "";
    const skillObj = req.query;
    console.log("skill obj is :- ", skillObj);
    for (key in skillObj) {
      skills += skillObj[key] + " ";
    }
    console.log("the skill is :- ", skills);
    const response = await client.search({
      index: "my_index",
      body: {
        query: {
          match: {
            resumeContent: {
              query: skills,
              fuzziness: "AUTO",
            },
          },
        },
      },
    });
    // console.log(response);
    let applicantArray = [];
    response.hits.hits.map((obj) => {
      let newObj = {
        email: obj._source.email,
        id: obj._id,
        firstName: obj._source.firstName,
        lastName: obj._source.lastName,
      };
      applicantArray.push(newObj);
    });
    // console.log("user is :- ", applicantArray);
    res.send(success(200, { applicantArray }));
  } catch (e) {
    console.log("The error is :- ", e);
  }
};
module.exports = {
  findApplicant,
};
