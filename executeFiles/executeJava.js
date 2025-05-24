const { exec } = require("child_process");
const controller = new AbortController();
const { signal } = controller;

const executeJava = (filepath, input) => {
    return new Promise((resolve, reject) => {
        var child = exec(
            `cd ${filepath} && java Main.java `,{ signal },
            (error, stdout, stderr) => {
                error && reject({ error, stderr });
                stderr && reject(stderr);
                resolve(stdout);
                if (stdout == "") {
                    resolve(stdout = "")
                }
            }
        );
        
        if(input){
            child.stdin.write(input)
            child.stdin.end()
        }
       

    });
};

module.exports = { executeJava }
