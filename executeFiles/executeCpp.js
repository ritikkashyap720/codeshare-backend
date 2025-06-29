const { exec } = require("child_process");

const executeCpp = (filepath, input) => {
    return new Promise((resolve, reject) => {
        var child = exec(
            `cd  ${filepath} && g++ ./main.cpp -o main && main`,
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

module.exports = { executeCpp }
