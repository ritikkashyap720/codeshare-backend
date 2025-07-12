const { exec, spawn } = require("child_process");

const executeCpp = (filepath, input) => {
  return new Promise((resolve, reject) => {
    // Step 1: Compile main.cpp
    exec(`cd ${filepath} && g++ main.cpp -o main`, (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        return reject({ error: compileError, stderr: compileStderr });
      }
      if (compileStderr) {
        // Compilation warnings could be here; not necessarily fatal
        console.warn("Compilation warnings:", compileStderr);
      }

      // Step 2: Run the compiled binary
      const runProcess = spawn(`${filepath}/main`, [], { cwd: filepath });

      let output = "";
      let errorOutput = "";

      runProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      runProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      runProcess.on("close", (code) => {
        if (code !== 0) {
          return reject({ error: `Process exited with code ${code}`, stderr: errorOutput });
        }
        resolve(output);
      });

      // If there's input to send to the program:
      if (input) {
        runProcess.stdin.write(input);
      }
      runProcess.stdin.end();
    });
  });
};

module.exports = { executeCpp };
