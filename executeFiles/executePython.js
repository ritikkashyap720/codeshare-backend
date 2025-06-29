const { exec } = require("child_process");
const controller = new AbortController();
const { signal } = controller;

// const executePython = (filepath, input) => {
//   return new Promise((resolve, reject) => {
//     const child = exec(
//       `python -u "${filepath}"`, { signal },
//       (error, stdout, stderr) => {
//         error && reject({ error, stderr });
//         stderr && reject(stderr);
//         resolve(stdout);
//         if (stdout == "") {
//           resolve(stdout = "")
//         }
//       }
//     );
//     if (input) {
//       child.stdin.write(input)
//       child.stdin.end()
//     }  
//   });

// };


const executePython = (filepath, input) => {
  return new Promise((resolve, reject) => {
    const child = exec(
      `python -u "${filepath}"`, { signal },
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
        if (stdout == "") {
          resolve(stdout = "Error")
        }
      }
    );
    if (input) {
      child.stdin.write(input)
      child.stdin.end()
    }  
    // setTimeout(()=>{
      
    //   console.log(child.stdout)
    // },3000)
  });

};

module.exports = {
  executePython,
};