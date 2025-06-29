const fs = require('fs');
const { generateFile } = require("./codes/generateFile");
const Job = require('../model/job');
const { executePython } = require('../executeFiles/executePython');
const { executeJava } = require('../executeFiles/executeJava');
const { generateFileJava } = require('./codes/generateFIleJava');
const { generateFileCpp } = require('./codes/generateFIleCpp');
const { executeCpp } = require('../executeFiles/executeCpp');

async function handleCompilation(req, res) {
    const { language, code } = req.body;
    const input = req.body?.input

    function deleteFiles(filepath) {
        fs.rm(filepath, { recursive: true }, err => {
            if (err) {
                console.log("err", err)
            } else {
                console.log(`${filepath} deleted succesfully`);
            }
        })
    }
    try {
        if (language == "python") {
            const language = "py"
            const filepath = await generateFile(language, code);
            const job = await new Job({ language, filepath }).save();
            const jobId = job["_id"];
            console.log(jobId)
            res.status(201).json({ jobId, status: "pending" });
            try {
                var output = await executePython(job.filepath, input);
                if (output) {
                    job["completedAt"] = new Date();
                    job["output"] = output;
                    job["status"] = "success";
                    await job.save();
                    deleteFiles(filepath)
                }
                setTimeout(async () => {
                    if (!output) {
                        deleteFiles(filepath)
                        job["completedAt"] = new Date();
                        job["output"] = JSON.stringify({ error: { code: "ERR_CHILD_PROCESS_STDIO_MAXBUFFER" } });
                        job["status"] = "error";
                        await job.save();
                    }
                }, 3000)
            } catch (error) {
                job["completedAt"] = new Date();
                job["output"] = JSON.stringify(error);
                job["status"] = "error";
                await job.save();
                deleteFiles(filepath)
            }

        } else if (language == "cpp") {
            const language = "c++"
            const filepath = await generateFileCpp(code);
            console.log(filepath)
            const job = await new Job({ language, filepath }).save();
            const jobId = job["_id"];
            console.log(jobId)
            res.status(201).json({ jobId, status: "pending" });
            try {
                var output = await executeCpp(filepath, input);
                if (output) {
                    job["completedAt"] = new Date();
                    job["output"] = output;
                    job["status"] = "success";
                    await job.save();
                    deleteFiles(filepath)
                }
                setTimeout(async () => {
                    if (!output) {
                        deleteFiles(filepath)
                        job["completedAt"] = new Date();
                        job["output"] = JSON.stringify({ error: { code: "ERR_CHILD_PROCESS_STDIO_MAXBUFFER" } });
                        job["status"] = "error";
                        await job.save();
                    }
                }, 3000)
            } catch (error) {
                job["completedAt"] = new Date();
                job["output"] = JSON.stringify(error);
                job["status"] = "error";
                await job.save();
                deleteFiles(filepath)
            }



        } else if (language == "java") {
            const language = "java"
            const filepath = await generateFileJava(code);
            console.log(filepath)
            const job = await new Job({ language, filepath }).save();
            const jobId = job["_id"];
            console.log(jobId)
            res.status(201).json({ jobId, status: "pending" });
            try {
                var output = await executeJava(filepath, input);
                if (output) {
                    deleteFiles(filepath)
                    job["completedAt"] = new Date();
                    job["output"] = output;
                    job["status"] = "success";
                    await job.save();
                }
                setTimeout(async () => {
                    if (!output) {
                        deleteFiles(filepath)
                        job["completedAt"] = new Date();
                        job["output"] = JSON.stringify({ error: { code: "ERR_CHILD_PROCESS_STDIO_MAXBUFFER" } });
                        job["status"] = "error";
                        await job.save();
                    }
                }, 3000)
            } catch (error) {
                deleteFiles(filepath)
                job["completedAt"] = new Date();
                job["output"] = JSON.stringify(error);
                job["status"] = "error";
                await job.save();
            }


        }
    } catch (error) {
        console.log(error)
    }


}

function handleDownload(req, res) {
    const { htmlCode, cssCode, jsCode } = req.body;
    const fileText = `<!doctype html>
    <html lang="en">
      <head>
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>${jsCode}</script>
      </body>
    </html>`
    const fileName = `${Date.now()}.html`

    fs.writeFile(fileName, fileText, (err) => {
        if (err) {
            console.log(err)
            res.end("internal server error")
        } else {
            res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
            res.setHeader('Content-type', 'text/html');
            const fileStream = fs.createReadStream(fileName);
            fileStream.pipe(res);

            // Remove the temporary file after streaming is complete
            fileStream.on('end', () => {
                fs.unlink(fileName, (err) => {
                    if (err) console.error(err);
                });
            });
        }
    })



}

async function handleCheckStatus(req, res) {
    const jobId = req.params.jobId
    console.log("jobid", jobId)
    if (jobId) {
        const result = await Job.findOne({ "_id": jobId })
        console.log(result)
        if (result) {
            if(result.error == "error" || result.status == "success"){
                res.json(result)
                await Job.deleteOne({ "_id": jobId })
            }
        } else {
            res.status(404).json({ "status": "invalid job id" })
        }
    } else {
        res.status(404).json({ "status": "invalid request" })
    }
}


module.exports = { handleCompilation, handleDownload, handleCheckStatus };
